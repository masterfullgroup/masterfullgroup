import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIL2Ck61QPrlCxp771TjxGnqSLDFqjpU0",
  authDomain: "masterfull-group.firebaseapp.com",
  projectId: "masterfull-group",
  storageBucket: "masterfull-group.firebasestorage.app",
  messagingSenderId: "671751303344",
  appId: "1:671751303344:web:18a0d423660131dcd70b75",
  measurementId: "G-K7NTFN634F",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
