import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { useHistory } from "react-router-dom";
import { useCallback, useState } from "react";
import { IonLoading } from "@ionic/react";
import { auth, authReady } from "../../../services/firebase/config/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
import { getDeviceToken, savePushToken } from "../../../services/firebase/tokenUtils";
import "./authenticationGoogleStyles.css";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/config/firebaseConfig";

const HandleGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);

      const result = await FirebaseAuthentication.signInWithGoogle();
      if (!result?.user) {
        setLoading(false);
        alert("El inicio de sesión con Google fue cancelado.");
        return;
      }

      await authReady;
      const credential = GoogleAuthProvider.credential(result.credential?.idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      const uid = user.uid;

      const currentDeviceToken = await getDeviceToken();
      if (!currentDeviceToken) {
        await signOut(auth);
        setLoading(false);
        alert("No se pudo obtener el token del dispositivo.");
        return;
      }

      const sessionDocRef = doc(db, "userSessions", uid);
      const sessionSnap = await getDoc(sessionDocRef);
      const existingDeviceToken = sessionSnap.exists() ? sessionSnap.data().deviceToken : null;

      if (existingDeviceToken === null) {
        await savePushToken(currentDeviceToken, uid);
        history.replace("/home");
      } else if (existingDeviceToken === currentDeviceToken) {
        history.replace("/home");
      } else {
        await signOut(auth);
        setLoading(false);
        return;
      }

      const profileRef = doc(db, `userRol/${uid}`);
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          name: user.displayName || "",
          correo: user.email || "",
          rol: "usuario", // rol por defecto
        });
      }

      setLoading(false);
    } catch (error: any) {
      await signOut(auth);
      setLoading(false);
      alert("Error durante el inicio de sesión con Google: " + error.message);
    }
  }, [history]);

  if (loading) {
    return <IonLoading isOpen message='Cargando sesión...' />;
  }

  return (

    <button className="btn-login google-btn" onClick={signInWithGoogle}>
      <img src="/img/google-logo.png" alt="google" className="img-logo" />
      <p>Continuar con Google</p>

    </button>
  );
};

export default HandleGoogleSignIn;
