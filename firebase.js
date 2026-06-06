// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGCPR26rWsC-mTXHQBs9CF9oXSN061FGM",
  authDomain: "counselling-helpdesk-41adc.firebaseapp.com",
  projectId: "counselling-helpdesk-41adc",
  storageBucket: "counselling-helpdesk-41adc.firebasestorage.app",
  messagingSenderId: "719726827689",
  appId: "1:719726827689:web:73d3c294e28886f96171b8",
  measurementId: "G-PE6V8KVVVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const AUTH = getAuth(app);