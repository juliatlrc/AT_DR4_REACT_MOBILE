// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore completo

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD80gBKygdssNDjBCqLSHJX0_mrjbU1cNU",
  authDomain: "projeto-de-bloco-d5b52.firebaseapp.com",
  projectId: "projeto-de-bloco-d5b52",
  storageBucket: "projeto-de-bloco-d5b52.appspot.com",
  messagingSenderId: "442698868499",
  appId: "1:442698868499:web:d87c762f1b16ef517e5ce6",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore completo
const db = getFirestore(app);

export { db };
