// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export default function firebaseInit():void {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: "better-server-mc.firebaseapp.com",
      projectId: "better-server-mc",
      storageBucket: "better-server-mc.firebasestorage.app",
      messagingSenderId: "120817434271",
      appId: "1:120817434271:web:c8c607b88cb10efbb22caa"
    };
    
    // Initialize Firebase
    initializeApp(firebaseConfig);
};