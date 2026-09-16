import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0KI8o1Cox2gCpRKHpDs1vm2VM0kHxwpw",
  authDomain: "login-e632f.firebaseapp.com",
  projectId: "login-e632f",
  storageBucket: "login-e632f.firebasestorage.app",
  messagingSenderId: "239708156698",
  appId: "1:239708156698:web:35689656d2aa49f83eb2a3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
