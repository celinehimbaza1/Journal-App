// pages/api/entries/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}
const db = getFirestore();

async function verifyIdToken(token: string) {
  const auth = getAuth();
  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
  } catch (err) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  const userId = await verifyIdToken(token);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const collection = db.collection("entries").where("userId", "==", userId);

  if (req.method === "GET") {
    const snapshot = await collection.get();
    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(entries);
  } else if (req.method === "POST") {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body required" });
    }
    const newEntry = {
      userId,
      title,
      body,
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection("entries").add(newEntry);
    res.status(201).json({ id: docRef.id, ...newEntry });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
