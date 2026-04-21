import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "proinvoice-app-2026",
  appId: "1:895130832486:web:4f8b3e9b225bdd0e7ae7a7",
  storageBucket: "proinvoice-app-2026.firebasestorage.app",
  apiKey: "AIzaSyB9U9cD4A4gUhBV9Ich04qdLh14xi_Yb7o",
  authDomain: "proinvoice-app-2026.firebaseapp.com",
  messagingSenderId: "895130832486",
  projectNumber: "895130832486"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
