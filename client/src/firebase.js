// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-stack-real-estate-f867f.firebaseapp.com",
  projectId: "mern-stack-real-estate-f867f",
  storageBucket: "mern-stack-real-estate-f867f.appspot.com",
  messagingSenderId: "198200583207",
  appId: "1:198200583207:web:298c2f675ec7e26238da02",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
