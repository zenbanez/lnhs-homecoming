import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9IQpVvrr5hnkvQsFihZYFBP9gM-V9me8",
  authDomain: "neon-camp-341511.firebaseapp.com",
  projectId: "neon-camp-341511",
  storageBucket: "neon-camp-341511.firebasestorage.app",
  messagingSenderId: "120818860058",
  appId: "1:120818860058:web:5ad65dcc268261ba68d1a3",
  measurementId: "G-MK562DBH56"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "homecoming");
export const auth = getAuth(app);
getAnalytics(app);