// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuqZW1Pax01tya2w1piMpz0l4e1VPEdys",
  authDomain: "sound-bit-316704.firebaseapp.com",
  projectId: "sound-bit-316704",
  storageBucket: "sound-bit-316704.firebasestorage.app",
  messagingSenderId: "271545738965",
  appId: "1:271545738965:web:f14c657d09567ffcf9645c",
  measurementId: "G-TPKPK9GVZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);