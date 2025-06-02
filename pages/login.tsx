// pages/login.tsx
import { useRouter } from "next/router";
import { useEffect, useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check console for error.");
    }
  };

  return (
    <div>
      <h1>Login to your Journal</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}
