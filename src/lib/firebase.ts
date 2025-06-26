
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAObe4TGNbvy63mkaK1F75703CWaBugATY",
  authDomain: "arjun-and-preetham.firebaseapp.com",
  projectId: "arjun-and-preetham",
  storageBucket: "arjun-and-preetham.firebasestorage.app",
  messagingSenderId: "234923795312",
  appId: "1:234923795312:web:922ccd131c6aa542d6a5b5",
  measurementId: "G-VPD056V2Z0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export { app, analytics };
