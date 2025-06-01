// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState, createContext, ReactNode } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export const AuthContext = createContext<User | null>(null);

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={user}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;
