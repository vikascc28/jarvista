// "use client";
// import React, { useEffect, useContext, useRef, useState } from 'react';
// import EmptyChatState from "@/app/(main)/workspace/_components/EmptyChatState";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2Icon, Send } from 'lucide-react';
// import AiModelOptions from "@/services/AiModelOptions";
// import axios from "axios";
// import { AssistantContext } from "@/context/AssistantContext";
// import Image from 'next/image';
// import { useMutation } from 'convex/react';
// import { api } from "@/convex/_generated/api";
// import { AuthContext } from "@/context/AuthContext";
// import { ASSISTANT } from '../../ai-assistants/page';

// type MESSAGE = {
//   role: string;
//   content: string;
// };

// function ChatUi() {
//   const [input, setInput] = useState<string>('');
//   const { assistant } = useContext(AssistantContext);
//   const [messages, setMessages] = useState<MESSAGE[]>([]);
//   const [loading, setLoading] = useState(false);
//   const chatRef = useRef<any>(null);
//   const { user, setUser } = useContext(AuthContext);
//   const UpdateTokens = useMutation(api.users.updateTokens);

//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     setMessages([]);
//   }, [assistant?.id]);

//   const onSendMessage = async () => {
//     if (!input.trim()) return;

//     setLoading(true);
//     setMessages(prev => [
//       ...prev,
//       { role: 'user', content: input },
//       { role: 'assistant', content: 'Loading...' }
//     ]);

//     const userInput = input;
//     setInput('');
//     const AIModel = AiModelOptions.find(item => item.name == assistant.aiModelId);

//     try {
//       const result = await axios.post('api/eden-ai-model', {
//         provider: AIModel?.edenAi,
//         userInput: `${userInput}:${assistant?.instruction}:${assistant?.userInteraction}`,
//         aiResp: messages[messages.length - 1]?.content
//       });

//       setMessages(prev => prev.slice(0, -1)); // remove "Loading..."
//       setMessages(prev => [...prev, result.data]);
//       updateUserToken(result.data?.content);
//     } catch (error) {
//       console.error("Error calling AI model:", error);
//       setMessages(prev => prev.slice(0, -1)); // remove "Loading..."
//       setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
//     }

//     setLoading(false);
//   };

//   const updateUserToken = async (resp: string) => {
//     const tokenCount = resp.trim() ? resp.trim().split(/\s+/).length : 0;
//     console.log(tokenCount);

//     await UpdateTokens({
//       credits: user?.credits - tokenCount,
//       uid: user?._id
//     });

//     setUser((prev: ASSISTANT) => ({
//       ...prev,
//       credits: (prev?.credits || 0) - tokenCount,
//     }));
//   };

//   return (
//     <div className='mt-20 p-6 relative h-[88vh]'>
//       {messages.length == 0 && <EmptyChatState />}

//       <div ref={chatRef} className='h-[74vh] overflow-scroll scrollbar-hide'>
//         {messages.map((message, index) => (
//           <div key={index} className={`flex mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className='flex gap-3'>
//               {message.role === 'assistant' && (
//                 <Image
//                   src={assistant?.image}
//                   alt="assistant"
//                   width={100}
//                   height={100}
//                   className="w-[30px] h-[30px] rounded-full object-cover"
//                 />
//               )}
//               <div className={`p-3 rounded-lg flex gap-2 ${message.role === 'user' ? 'bg-gray-200 text-black' : 'bg-gray-50 text-black'}`}>
//                 {loading && messages.length - 1 === index && <Loader2Icon className='animate-spin' />}
//                 <h2>{message.content}</h2>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className='flex justify-between p-5 gap-5 absolute bottom-5 w-[92%]'>
//         <Input
//           placeholder='Start Typing Here...'
//           value={input}
//           disabled={loading || user?.credits <= 0}
//           onChange={(event) => setInput(event.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter') {
//               onSendMessage();
//             }
//           }}
//         />
//         <Button disabled={loading || user?.credits <= 0} onClick={onSendMessage}>
//           <Send />
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default ChatUi;


// C:\Users\MI\jarvista\app\(main)\workspace\_components\ChatUi.tsx
"use client";

import React, { useEffect, useContext, useRef, useState } from "react";
import EmptyChatState from "@/app/(main)/workspace/_components/EmptyChatState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, Send } from "lucide-react";
import AiModelOptions from "@/services/AiModelOptions";
import axios from "axios";
import { AssistantContext } from "@/context/AssistantContext";
import Image from "next/image";

type MESSAGE = {
  role: string;
  content: string;
  model: string;
};

function ChatUi() {
  const [input, setInput] = useState("");
  const { assistant } = useContext(AssistantContext);
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [assistant?.id]);

  // In your ChatUi.tsx component
  const onSendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input, model: "You" },
      {
        role: "assistant",
        content: "...",
        model: assistant?.aiModelId || "Gemini",
      },
    ]);
    setLoading(true);
    setInput("");

    try {
      const result = await axios.post("/api/gemini-model", {
        provider: "google/gemini-1.5-flash",
        userInput: `${userInput}:${assistant?.userInstruction || ""}`,
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          {
            role: "assistant",
            content: result.data.content,
            model: assistant?.aiModelId || "Gemini",
          },
        ];
      });
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 p-6 relative h-[88vh]">
      {messages.length === 0 && <EmptyChatState />}

      <div ref={chatRef} className="h-[74vh] overflow-scroll scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex gap-3">
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
                className={`p-3 rounded-lg flex gap-2 ${message.role === "user" ? "bg-gray-200 text-black" : "bg-gray-50 text-black"}`}
              >
                {loading &&
                  index === messages.length - 1 &&
                  message.role === "assistant" && (
                    <Loader2Icon className="animate-spin" />
                  )}
                <pre className="whitespace-pre-wrap font-sans">
                  {message.content}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between p-5 gap-5 absolute bottom-5 w-[92%]">
        <Input
          placeholder="Start Typing Here..."
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSendMessage();
          }}
        />
        <Button onClick={onSendMessage} disabled={loading}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatUi;