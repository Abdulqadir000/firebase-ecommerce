import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, 
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
 } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage,
  ref,
  uploadBytes,
  getDownloadURL,  
 } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
 const firebaseConfig = {
  apiKey: "AIzaSyBb1Fgbt672s9EVapKQ1PqRYQdSK09fjI0",
  authDomain: "ecommerce-59e95.firebaseapp.com",
  projectId: "ecommerce-59e95",
  storageBucket: "ecommerce-59e95.appspot.com",
  messagingSenderId: "1053781659652",
  appId: "1:1053781659652:web:90f8f3f3c7b441081fa551",
  measurementId: "G-QKMFBH5F3N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);


export {
  auth,
  db,
  storage,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  ref,
  uploadBytes,
  collection,
  addDoc,
  getDocs,
  getDownloadURL,
  signInWithEmailAndPassword,
  signOut,
  getDoc,
  getFirestore,
  getStorage,
  deleteDoc,
  query,
  where,
  updateDoc,  
};