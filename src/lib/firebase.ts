import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAgpa3LUruv3MD-iMP5QL74rmNOANgSxpc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "notebook-123a5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "notebook-123a5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "notebook-123a5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "300029913999",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:300029913999:web:74af13ed5bc531153539fa",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HD4GHCT3N0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);