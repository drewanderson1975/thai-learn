import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // must be like "<project-id>.appspot.com"
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

console.log("FIREBASE STORAGE BUCKET (from env)", firebaseConfig.storageBucket);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 👇 force storage to the exact bucket from env
const bucket = firebaseConfig.storageBucket;           // e.g. "thailearn-470919.appspot.com"
export const storage = getStorage(app, `gs://${bucket}`);

console.log("FIREBASE STORAGE USING", `gs://${bucket}`);





