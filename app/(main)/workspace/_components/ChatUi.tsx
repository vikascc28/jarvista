"use client";

import React, { useEffect, useContext, useMemo, useRef, useState } from "react";
import EmptyChatState from "@/app/(main)/workspace/_components/EmptyChatState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2Icon, RotateCcw, Send, Square } from "lucide-react";
import { AssistantContext } from "@/context/AssistantContext";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

type MESSAGE = {
  role: "user" | "assistant";
  content: string;
  model: string;
  failed?: boolean;
};

type LastRequest = {
  userInput: string;
  contextText: string;
  responseStyle: "concise" | "balanced" | "detailed";
  detailLevel: number;
  safeMode: boolean;
};

function ChatUi() {
  const [input, setInput] = useState("");
  const { assistant } = useContext(AssistantContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [loading, setLoading] = useState(false);
  const [contextText, setContextText] = useState("");
  const [responseStyle, setResponseStyle] = useState<"concise" | "balanced" | "detailed">("balanced");
  const [detailLevel, setDetailLevel] = useState(2);
  const [safeMode, setSafeMode] = useState(true);
  const [lastRequest, setLastRequest] = useState<LastRequest | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const SaveTurn = useMutation(api.assistantConversations.SaveConversationTurn);

  const history = useQuery(
    api.assistantConversations.GetRecentAssistantTurns,
    user?._id && assistant?.id
      ? { uid: user._id, assistantId: assistant.id, limit: 10 }
      : "skip",
  );

  const smartSuggestions = useQuery(
    api.assistantConversations.GetSmartSuggestions,
    user?._id && assistant?.id
      ? { uid: user._id, assistantId: assistant.id }
      : "skip",
  );

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!assistant?.id) {
      setMessages([]);
      return;
    }

    if (history && history.length > 0) {
      const hydrated: MESSAGE[] = [];
      history.forEach((row) => {
        hydrated.push({ role: "user", content: row.userMessage, model: "You" });
        hydrated.push({ role: "assistant", content: row.assistantMessage, model: assistant.aiModelId || "AI" });
      });
      setMessages(hydrated);
      return;
    }

    setMessages([]);
  }, [assistant?.id, history]);

  const selectedSuggestions = useMemo(
    () => (smartSuggestions && smartSuggestions.length > 0 ? smartSuggestions : assistant?.sampleQuestions || []),
    [smartSuggestions, assistant?.sampleQuestions],
  );

  const parseStreamAndUpdate = async (response: Response, assistantModel: string) => {
    if (!response.body) throw new Error("No response stream found");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let renderedModel = assistantModel;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        const packet = JSON.parse(line) as { type: string; content?: string; model?: string; isFallback?: boolean };

        if (packet.type === "meta") {
          renderedModel = packet.model || assistantModel;
          if (packet.isFallback) {
            toast.info(`Selected model unavailable. Responded with ${renderedModel}.`);
          }
        }

        if (packet.type === "chunk" && packet.content) {
          fullText += packet.content;
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: fullText,
              model: renderedModel,
            };
            return updated;
          });
        }
      }
    }

    return { fullText, renderedModel };
  };

  const sendMessage = async (userInput: string, requestOverrides?: Partial<LastRequest>) => {
    if (!assistant || !user?._id) return;

    const payloadState: LastRequest = {
      userInput,
      contextText: requestOverrides?.contextText ?? contextText,
      responseStyle: requestOverrides?.responseStyle ?? responseStyle,
      detailLevel: requestOverrides?.detailLevel ?? detailLevel,
      safeMode: requestOverrides?.safeMode ?? safeMode,
    };

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userInput, model: "You" },
      {
        role: "assistant",
        content: "",
        model: assistant.aiModelId || "gemini-1.5-flash",
      },
    ]);

    setLoading(true);
    setInput("");
    setLastRequest(payloadState);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/gemini-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          userInput: payloadState.userInput,
          instruction: assistant.instruction,
          userInstruction: assistant.userInstruction,
          aiModelId: assistant.aiModelId,
          responseStyle: payloadState.responseStyle,
          detailLevel: payloadState.detailLevel,
          safeMode: payloadState.safeMode,
          contextText: payloadState.contextText,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Request failed" }));
        throw new Error(data.error || "Request failed");
      }

      const { fullText, renderedModel } = await parseStreamAndUpdate(response, assistant.aiModelId || "AI");

      await SaveTurn({
        uid: user._id,
        assistantId: assistant.id,
        userMessage: payloadState.userInput,
        assistantMessage: fullText,
      });

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: fullText,
          model: renderedModel,
        };
        return updated;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: `⚠️ ${message}`,
          failed: true,
        };
        return updated;
      });

      toast.error(message);
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  const onSendMessage = async (suggestion?: string) => {
    const prompt = suggestion ?? input;
    if (!prompt.trim()) return;
    await sendMessage(prompt);
  };

  const onRetry = async () => {
    if (!lastRequest || loading) return;
    await sendMessage(lastRequest.userInput, lastRequest);
  };

  const cancelRequest = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
    toast.info("Generation stopped.");
  };

  const onFileUpload = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    setContextText(text.slice(0, 3000));
    toast.success(`Loaded ${file.name} as chat context.`);
  };

  return (
    <div className="mt-16 p-4 md:p-6 relative h-[88vh]">
      {messages.length === 0 && (
        <EmptyChatState
          suggestions={selectedSuggestions}
          onSelectSuggestion={(suggestion) => void onSendMessage(suggestion)}
        />
      )}

      <div ref={chatRef} className="h-[64vh] overflow-scroll scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex mb-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex gap-3 max-w-[90%]">
              {message.role === "assistant" && assistant?.image && (
                <Image
                  src={assistant.image}
                  alt="assistant"
                  width={100}
                  height={100}
                  className="w-[30px] h-[30px] rounded-full object-cover"
                />
              )}
              <div
                className={`p-3 rounded-lg flex flex-col gap-2 ${message.role === "user" ? "bg-gray-200 text-black" : "bg-gray-50 text-black"}`}
              >
                {loading &&
                  index === messages.length - 1 &&
                  message.role === "assistant" && (
                    <Loader2Icon className="animate-spin" />
                  )}
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.failed && (
                  <Button size="sm" variant="secondary" onClick={onRetry} className="w-fit">
                    <RotateCcw className="mr-2 h-3 w-3" /> Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <select
          className="border rounded-md px-2 py-1 bg-background"
          value={responseStyle}
          onChange={(e) => setResponseStyle(e.target.value as "concise" | "balanced" | "detailed")}
        >
          <option value="concise">Concise</option>
          <option value="balanced">Balanced</option>
          <option value="detailed">Detailed</option>
        </select>
        <div className="flex items-center gap-2">
          <span>Detail</span>
          <input
            type="range"
            min={1}
            max={3}
            value={detailLevel}
            onChange={(e) => setDetailLevel(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={safeMode} onCheckedChange={(v) => setSafeMode(Boolean(v))} />
          <span>Safety filter</span>
        </div>
      </div>

      <div className="mt-2">
        <Input type="file" accept=".txt,.md,.json" onChange={(e) => void onFileUpload(e.target.files?.[0])} />
      </div>

      {contextText && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          Context loaded ({contextText.length} chars)
        </p>
      )}

      <div className="flex justify-between p-2 md:p-4 gap-3 absolute bottom-3 left-0 right-0">
        <Input
          placeholder="Start typing here..."
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onSendMessage();
          }}
        />
        {loading ? (
          <Button onClick={cancelRequest} variant="secondary">
            <Square className="mr-2 h-4 w-4" /> Stop
          </Button>
        ) : (
          <Button onClick={() => void onSendMessage()}>
            <Send />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ChatUi;
