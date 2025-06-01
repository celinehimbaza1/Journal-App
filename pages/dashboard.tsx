// pages/dashboard.tsx
import { useContext, useEffect, useState } from "react";
import { withAuth } from "../lib/withAuth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { AuthContext } from "../lib/AuthContext"; // ✅ Make sure you have this file exporting the context

interface Entry {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

function Dashboard() {
  const user = useContext(AuthContext); // ✅ Correct context usage
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const router = useRouter();

  const fetchEntries = async () => {
    const token = await user?.getIdToken();
    const res = await fetch("/api/entries", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Corrected template literal
      },
    });
    const data = await res.json();
    setEntries(data);
  };

  const handleAdd = async () => {
    if (!title || !body) return;
    const token = await user?.getIdToken();
    await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Corrected template literal
      },
      body: JSON.stringify({ title, body }),
    });
    setTitle("");
    setBody("");
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const token = await user?.getIdToken();
    await fetch(`/api/entries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Corrected template literal
      },
    });
    fetchEntries();
  };

  const handleLogout = () => {
    auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: 20 }}>
      <h1>Welcome {user?.displayName}</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Add Entry</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />
      <button onClick={handleAdd}>Add Entry</button>

      <h2>Your Entries</h2>
      {entries.map((entry) => (
        <div
          key={entry.id}
          style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}
        >
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

export default withAuth(Dashboard);

