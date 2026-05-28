import { createContext } from "react";
import { Id } from "@/convex/_generated/dataModel";

export type AssistantType = {
  _id?: Id<"userAiAssistants">;
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
