// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7gx2GFMkUWnfgV0Rl-5AGr71UCqiQ9nA",
  authDomain: "aiquiz-generator.firebaseapp.com",
  projectId: "aiquiz-generator",
  storageBucket: "aiquiz-generator.firebasestorage.app",
  messagingSenderId: "1047283119889",
  appId: "1:1047283119889:web:5cacaa5685c03094813eb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
