import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai';

const firebaseConfig = {
  apiKey: "AIzaSyBz_Snq78F9pThG7iNZUCfqJGT49f_pkS0",
  authDomain: "vecimarkert.firebaseapp.com",
  projectId: "vecimarkert",
  storageBucket: "vecimarkert.firebasestorage.app",
  messagingSenderId: "943940426974",
  appId: "1:943940426974:web:7fc746df6e97d694d0764f",
  measurementId: "G-M0R47Y59K0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const vertexAI = getVertexAI(app);
const model = getGenerativeModel(vertexAI, { model: 'gemini-2.0-flash' });
const storage = getStorage(app);

let messaging: ReturnType<typeof getMessaging> | null = null;
if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
  messaging = getMessaging(app);
}

const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistencia configurada correctamente.");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia:", error);
  });

export { auth, db, messaging, authReady, app, vertexAI, storage, model };
