// pages/login.tsx
import { useContext, useEffect } from "react";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { AuthContext } from "./_app";

export default function Login() {
  const user = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Login to your Journal</h1>
      <button onClick={handleLogin} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Sign in with Google
      </button>
    </div>
  );
}
