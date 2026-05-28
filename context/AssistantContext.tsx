import { createContext } from "react";

export type AssistantType = {
  _id?: string;
  id: number;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
  aiModelId?: string;
};

export type AssistantContextType = {
  assistant: AssistantType | null;
  setAssistant: React.Dispatch<React.SetStateAction<AssistantType | null>>;
};

export const AssistantContext = createContext<AssistantContextType>({
  assistant: null,
  setAssistant: () => undefined,
});
