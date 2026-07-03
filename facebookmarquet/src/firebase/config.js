// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; //
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAEzNFWmzHjTnEMpJ1s6ODUEX3R59nrMyo",
  authDomain: "facebook-market-49d41.firebaseapp.com",
  projectId: "facebook-market-49d41",
  storageBucket: "facebook-market-49d41.firebasestorage.app",
  messagingSenderId: "359369825903",
  appId: "1:359369825903:web:d638a679cb5ea1861fb79a",
  measurementId: "G-MGENTF6Z9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

