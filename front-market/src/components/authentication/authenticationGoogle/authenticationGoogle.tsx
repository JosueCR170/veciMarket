import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { useHistory } from "react-router-dom";
import { useCallback, useState } from "react";
import { IonButton, IonIcon, IonLoading } from "@ionic/react";
import { auth, authReady } from "../../../services/firebase/config/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { createUserProfile } from "../../../services/firebase/createUser";
import { createUserProfile } from "../../../services/firebase/userService";
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
  
      if (result?.user) {
        await authReady;
        const credential = await GoogleAuthProvider.credential(result.credential?.idToken);
  
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        // await new Promise((res) => setTimeout(res, 500));
  
        const docRef = doc(db, `userRol/${user.uid}`);
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            // Si no existe, crea el documento con rol general
            await setDoc(docRef, {
              name: user.displayName || "",
              correo: user.email || "",
              rol: "usuario", // rol por defecto
            });
          }
          // Redirigir después de asegurarse que el perfil existe
          
          setLoading(false);
          //history.push("/home");
       
        
      } else {
        setLoading(false);
        alert("El inicio de sesión con Google falló o fue cancelado.");
      }
    } catch (error: any) {
      setLoading(false);
      alert("Error durante el inicio de sesión con Google: " + error.message);
    }
  }, [history]);
  
  

  if (loading) {
    return <IonLoading isOpen message='Cargando sesión...' />;
  }

  return (
   
    <button className="btn-login google-btn" onClick={signInWithGoogle}>
      <img src="/img/google-logo.png" alt="google" className="img-logo"/>
      <p>Continuar con Google</p>
     
    </button>
  );
};

export default HandleGoogleSignIn;
