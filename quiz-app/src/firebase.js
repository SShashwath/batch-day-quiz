// src/firebase.js

// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// This object contains your unique keys to connect to your Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyCN8Hte_ZkLqukAqWwf7gWo3E1r0NIiLYE",
  authDomain: "batch-day-quiz.firebaseapp.com",
  databaseURL: "https://batch-day-quiz-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "batch-day-quiz",
  storageBucket: "batch-day-quiz.firebasestorage.app",
  messagingSenderId: "150889674092",
  appId: "1:150889674092:web:2d7beed928f9551de2ef49",
  measurementId: "G-B3NGX7L4V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service.
// We export this so we can use it in other files (like Host.js and Join.js).
export const database = getDatabase(app);