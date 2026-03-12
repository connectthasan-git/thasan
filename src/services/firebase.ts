import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredFirebaseEnvVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const invalidFirebaseEnvVars = Object.entries(requiredFirebaseEnvVars)
  .filter(([, value]) => !value || value.startsWith("your_"))
  .map(([key]) => key);

if (invalidFirebaseEnvVars.length > 0) {
  throw new Error(`Invalid Firebase configuration: ${invalidFirebaseEnvVars.join(", ")}`);
}

const firebaseConfig = {
  apiKey: requiredFirebaseEnvVars.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: requiredFirebaseEnvVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: requiredFirebaseEnvVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: requiredFirebaseEnvVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: requiredFirebaseEnvVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: requiredFirebaseEnvVars.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
