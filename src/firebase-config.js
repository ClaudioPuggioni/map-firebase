// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnTlnqaksiv_kqTV_pJcizzmjFQVBrIhQ",
  authDomain: "fire-trip-map.firebaseapp.com",
  projectId: "fire-trip-map",
  storageBucket: "fire-trip-map.appspot.com",
  messagingSenderId: "68123052085",
  appId: "1:68123052085:web:c1976582613f5cf5f2897c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
