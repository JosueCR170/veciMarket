// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDxUY0f_uvRPR-6CRg2FHWmCKAZTTVr5mI",
    authDomain: "vecimarket-19984.firebaseapp.com",
    projectId: "vecimarket-19984",
    storageBucket: "vecimarket-19984.firebasestorage.app",
    messagingSenderId: "867337163000",
    appId: "1:867337163000:web:6adee3d76af7d30dd12b0d",
    measurementId: "G-CZQPDWDS75"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistencia configurada correctamente.");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia:", error);
  });
 
export { auth, db, messaging, authReady };