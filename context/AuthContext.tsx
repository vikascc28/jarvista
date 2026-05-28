import { createContext } from "react";
import { Doc } from "@/convex/_generated/dataModel";

export type AuthUser = Doc<"users">;

export type AuthContextType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => undefined,
  logout: async () => undefined,
});
