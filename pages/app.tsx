// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthContext } from "../lib/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;
