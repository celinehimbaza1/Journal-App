// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAtz85FxMTuiokecyWUyZerGgrH-N2ohJw",
  authDomain: "journal-app-2345d.firebaseapp.com",
  projectId: "journal-app-2345d",
  storageBucket: "journal-app-2345d.appspot.com",
  messagingSenderId: "308882507193",
  appId: "1:308882507193:web:ce27aec02ff96370d2a268",
  measurementId: "G-Z7JFFW5ET7"
};

// ✅ Check if Firebase app is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Export Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
