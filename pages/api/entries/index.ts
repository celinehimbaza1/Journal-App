import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { verifyIdToken } from "../../../lib/firebaseAdmin"; // your token verification helper

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let decoded;
  try {
    decoded = await verifyIdToken(token); // custom logic using firebase-admin
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = getFirestore();

  if (req.method === "GET") {
    const snapshot = await db.collection("entries")
      .where("userId", "==", decoded.uid)
      .orderBy("createdAt", "desc")
      .get();
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(entries);
  }

  if (req.method === "POST") {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: "Missing fields" });

    const entry = {
      title,
      body,
      userId: decoded.uid,
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection("entries").add(entry);
    return res.status(201).json({ id: docRef.id, ...entry });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
