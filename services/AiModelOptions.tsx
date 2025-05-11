// export default [
//     {
//         id: 1,
//         name: 'Google: Gemini 2.0 Flash',
//         edenAi: 'google/gemini-2.0-flash',
//         // model: 'google/gemini-2.0-flash-lite-001',//OpenRouter.ai
//         logo: '/google.png'
//     },
//     {
//         id: 2,
//         name: 'OpenAI: GPT-4o-mini',
//         edenAi: 'openai/gpt-4o-mini',
//         // model: 'openai/gpt-4o-mini',//OpenRouter.ai
//         logo: '/chatgpt.png'

//     },
//     {
//         id: 3,
//         name: 'OpenAI: GPT-3.5 Turbo',
//         edenAi: 'openai/gpt-4o-mini',
//         // model: 'openai/gpt-3.5-turbo',//OpenRouter.ai
//         logo: '/chatgpt.png'
//     },
//     {
//         id: 4,
//         name: 'Mistral: Saba',
//         edenAi: 'mistral/pixtral-large-latest',
//         // model: 'mistralai/mistral-saba',//OpenRouter.ai
//         logo: '/Mistral.png'

//     },
//     {
//         id: 5,
//         name: 'anthropic',
//         edenAi: 'anthropic/claude-3-5-haiku-latest',
//         // model: 'mistralai/mistral-saba',//OpenRouter.ai
//         logo: '/anthropic.png'

//     },

// ] 

// C:\Users\MI\jarvista\services\AiModelOptions.tsx
export type AiModelOption = {
    id: number;
    name: string;
    displayName: string;
    provider: string;
    description: string;
    logo: string;
    aiModelId: string;
  };
  
  const AiModelOptions: AiModelOption[] = [
    {
      id: 1,
      name: 'Google: Gemini 1.5 Flash',
      displayName: 'Gemini 1.5 Flash',
      provider: 'google/gemini-1.5-flash',
      description: "Google's latest and fastest language model for efficient, high-quality responses.",
      logo: '/google.png',
      aiModelId: 'gemini-1.5-flash',
    },
    {
      id: 2,
      name: 'OpenAI: GPT-4o-mini',
      displayName: 'GPT-4o-mini',
      provider: 'openai/gpt-4o-mini',
      description: "OpenAI's optimized model balancing speed and performance for a wide range of tasks.",
      logo: '/chatgpt.png',
      aiModelId: 'gpt-4o-mini',
    },
    {
      id: 3,
      name: 'OpenAI: GPT-3.5 Turbo',
      displayName: 'GPT-3.5 Turbo',
      provider: 'openai/gpt-3.5-turbo',
      description: "OpenAI's efficient and reliable language model for everyday tasks.",
      logo: '/chatgpt.png',
      aiModelId: 'gpt-3.5-turbo',
    },
    {
      id: 4,
      name: 'Mistral: Saba',
      displayName: 'Mistral Saba',
      provider: 'mistral/saba',
      description: "Mistral's advanced language model offering state-of-the-art performance for complex tasks.",
      logo: '/Mistral.png',
      aiModelId: 'mistral-saba',
    },
    {
      id: 5,
      name: 'Anthropic: Claude 3.5 Haiku',
      displayName: 'Claude 3.5 Haiku',
      provider: 'anthropic/claude-3.5-haiku',
      description: "Anthropic's fastest model delivering high-quality responses with minimal latency.",
      logo: '/anthropic.png',
      aiModelId: 'claude-3.5-haiku',
    },
  ];
  
  export default AiModelOptions;