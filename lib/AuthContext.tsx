// lib/AuthContext.tsx
import { createContext } from "react";
import type { User } from "firebase/auth";

// The context will hold the authenticated Firebase user
export const AuthContext = createContext<User | null>(null);
