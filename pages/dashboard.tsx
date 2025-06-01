import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut, getIdToken } from "firebase/auth";

interface Entry {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchEntries(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchEntries = async (user: any) => {
    const token = await getIdToken(user);
    const res = await fetch("/api/entries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setEntries(data);
  };

  const handleAddEntry = async () => {
    if (!title || !body) return;
    const token = await getIdToken(user);

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body }),
    });

    const newEntry = await res.json();
    setEntries([newEntry, ...entries]);
    setTitle("");
    setBody("");
  };

  const handleDelete = async (id: string) => {
    const token = await getIdToken(user);
    await fetch(`/api/entries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Your Journal</h1>
      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAddEntry}>Add Entry</button>
      </div>

      {entries.map((entry) => (
        <div key={entry.id} style={{ marginBottom: 20, borderBottom: "1px solid #ccc" }}>
          <h3>{entry.title}</h3>
          <p>{entry.body}</p>
          <small>{new Date(entry.createdAt).toLocaleString()}</small>
          <br />
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
