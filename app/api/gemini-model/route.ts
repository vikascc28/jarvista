import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AI_GUARDRAILS } from '@/lib/constants';

type ChatBody = {
  userInput: string;
  instruction?: string;
  userInstruction?: string;
  aiModelId?: string;
  responseStyle?: 'concise' | 'balanced' | 'detailed';
  detailLevel?: number;
  safeMode?: boolean;
  contextText?: string;
};

const FALLBACK_MODEL = 'gemini-1.5-flash';

function withPromptGuardrails(text: string) {
  if (text.length <= AI_GUARDRAILS.maxPromptChars) return text;
  return text.slice(0, AI_GUARDRAILS.maxPromptChars);
}

function buildPrompt(body: ChatBody) {
  const detailLabel = body.detailLevel && body.detailLevel > 2 ? 'high detail' : body.detailLevel === 1 ? 'very concise' : 'balanced detail';
  const style = body.responseStyle ?? 'balanced';

  return [
    'You are an AI assistant. Respond in clean Markdown.',
    body.safeMode ? 'Safety mode is ON: avoid unsafe, sexual, violent, abusive, illegal, or harmful guidance.' : '',
    body.instruction ? `Assistant role: ${body.instruction}` : '',
    body.userInstruction ? `User custom instruction: ${body.userInstruction}` : '',
    `Style: ${style}. Detail: ${detailLabel}.`,
    body.contextText ? `Context from user file/notes:\n${body.contextText}` : '',
    `User request: ${withPromptGuardrails(body.userInput || '')}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

async function runWithTimeout<T>(promise: Promise<T>) {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), AI_GUARDRAILS.requestTimeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
}

async function getModelResponse(body: ChatBody, prompt: string) {
  const aiModelId = body.aiModelId || FALLBACK_MODEL;

  if (aiModelId.startsWith('claude') && process.env.ANTHROPIC_API_KEY) {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await runWithTimeout(
      anthropic.messages.create({
        model: aiModelId,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    );

    const content = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    return {
      content: content || 'No response generated.',
      model: aiModelId,
      isFallback: false,
    };
  }

  if ((aiModelId === 'gpt-4o-mini' || aiModelId === 'gpt-3.5-turbo') && process.env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await runWithTimeout(
      openai.chat.completions.create({
        model: aiModelId,
        messages: [{ role: 'user', content: prompt }],
      }),
    );

    return {
      content: completion.choices?.[0]?.message?.content ?? 'No response generated.',
      model: aiModelId,
      isFallback: false,
    };
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
  const result = await runWithTimeout(model.generateContent(prompt));
  const response = await result.response;

  return {
    content: response.text(),
    model: FALLBACK_MODEL,
    isFallback: aiModelId !== FALLBACK_MODEL,
  };
}

function streamText(content: string, model: string, isFallback: boolean) {
  const encoder = new TextEncoder();
  const words = content.split(/(\s+)/);

  return new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          JSON.stringify({ type: 'meta', model, isFallback }) + '\n',
        ),
      );

      for (const chunk of words) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ type: 'chunk', content: chunk }) + '\n'),
        );
        await new Promise((resolve) =>
          setTimeout(resolve, AI_GUARDRAILS.streamingChunkDelayMs),
        );
      }

      controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'));
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatBody;

    if (!body?.userInput?.trim()) {
      return new Response(JSON.stringify({ error: 'userInput is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = buildPrompt(body);
    const { content, model, isFallback } = await getModelResponse(body, prompt);

    return new Response(streamText(content, model, isFallback), {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate response';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
