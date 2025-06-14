import {  IonLabel, IonTabButton, IonIcon, IonButton, } from "@ionic/react";
import {logOut } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { auth } from "../../services/firebase/config/firebaseConfig";
import { signOut } from "firebase/auth";
import { IonAlert } from '@ionic/react';
import { useState } from "react";
import { useLocationContext } from "../../context/contextLocation";

export const LogoutButton = () => {
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();
  const {clearLocation} = useLocationContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await FirebaseAuthentication.signOut();
     clearLocation();
      history.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <IonButton className="bottonLogOut"   onClick={() => setShowAlert(true)}>
        <IonIcon icon={logOut}  slot="end" />
        <IonLabel >Cerrar Sesión</IonLabel>
      </IonButton>

      <IonAlert
        isOpen={showAlert}
        header="¿Deseas cerrar sesión?"
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