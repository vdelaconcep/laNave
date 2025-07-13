// Para iniciar sesión con google

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCx5YBZe0aobthDNVUQDJ_AD4ofm2Xj9LE",
    authDomain: "lanaverockeria.firebaseapp.com",
    projectId: "lanaverockeria",
    storageBucket: "lanaverockeria.firebasestorage.app",
    messagingSenderId: "376201797857",
    appId: "1:376201797857:web:5fd87896a9ac02044ed7a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };