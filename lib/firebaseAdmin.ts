// lib/firebaseAdmin.ts

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ── 2a) Load your service‐account credentials from environment variables ──
// You must set these three vars in your .env.local (or Vercel dashboard):
//
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY
//
// (When you download a service‐account JSON from Firebase, those three fields come with it.)
//
// Example .env.local lines:
//
//   FIREBASE_PROJECT_ID=your-project-id
//   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@your-project-id.iam.gserviceaccount.com
//   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...snip...\n-----END PRIVATE KEY-----\n"
//
// IMPORTANT: Make sure to wrap the private key value in quotes so the newlines ("\n") stay intact.

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  // Replace literal `\\n` sequences with actual newlines:
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

// ── 2b) Initialize the Admin app only once ──
const adminApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

// ── 2c) Export Firestore and Auth from the Admin SDK ──
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

// ── 2d) Helper to verify an ID token inside your API routes ──
export async function verifyIdToken(idToken: string): Promise<string> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
