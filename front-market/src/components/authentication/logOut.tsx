import { IonLabel, IonIcon, IonButton, } from "@ionic/react";
import { logOut } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { auth, db } from "../../services/firebase/config/firebaseConfig";
import { signOut } from "firebase/auth";
import { IonAlert } from '@ionic/react';
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";

export const LogoutButton = () => {
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // 🔴 Elimina sesión en Firestore
        await deleteDoc(doc(db, "userSessions", user.uid));
      }

      // 🔴 Logout de Firebase + Capacitor
      await signOut(auth);
      await FirebaseAuthentication.signOut();

      // 🔴 Redirige
      history.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <IonButton className="bottonLogOut" onClick={() => setShowAlert(true)}>
        <IonIcon icon={logOut} slot="end" />
        <IonLabel >Cerrar sesion</IonLabel>
      </IonButton>

      <IonAlert
        isOpen={showAlert}
        header="sure you want to log out?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
          },
          {
            text: "Sí",
            handler: handleLogout,
          },
        ]}
        onDidDismiss={() => setShowAlert(false)}
      />
    </>
  );
};