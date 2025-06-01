// pages/api/entries/[id].ts
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

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;

  const docRef = db.collection("entries").doc(id as string);
  const doc = await docRef.get();

  if (!doc.exists || doc.data()?.userId !== userId) {
    return res.status(404).json({ error: "Entry not found or unauthorized" });
  }

  await docRef.delete();
  res.status(204).end();
}
