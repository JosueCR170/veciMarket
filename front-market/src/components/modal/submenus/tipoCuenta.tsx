import {
  IonContent,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonAlert,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useAuth } from "../../../context/contextUsuario";
import { auth, db } from "../../../services/firebase/config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { createVendedorProfile } from "../../../services/firebase/vendedorService";
import { SubmodalHeader } from "./submodalHeader";

export const TipoCuenta = ({ onClose }: { onClose: () => void }) => {
  const { rol, user } = useAuth(); // asegúrate de que user contenga el uid
  const [selectedRole, setSelectedRole] = useState(rol);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRoleChange = (newRole: string) => {
    if (newRole === "ejecutivo") {
      setShowConfirm(true); // Mostrar alerta si elige ejecutivo
    } else {
      setSelectedRole(newRole);
    }
  };

  const confirmarCambioRol = async () => {
    try {
      if (!user || !user.uid) {
        console.error("Usuario no autenticado o UID no disponible.");
        return;
      }
      const userRef = doc(db, "userRol", user.uid);
      await updateDoc(userRef, { rol: "ejecutivo" });

      const vendedorData = {
        user_id: user.uid,
        localizacion: null,
        nombre: user.displayName || "Vendedor Anónimo", // Asegúrate de que el nombre esté disponible
      }

      await createVendedorProfile(vendedorData)

      // Opción: localStorage.setItem("rol", "ejecutivo");
      window.location.reload(); // Recargar la app
    } catch (error) {
      console.error("Error actualizando el rol:", error);
    }
  };

  return (
    <>

      <SubmodalHeader titulo="Tipo de Cuenta" onClose={onClose}/>

      <IonContent class="subcontenidoBody" style={{ padding: "16px" }}>
        <p>
          Usted se encuentra en el rol <strong>{rol}</strong>, el cual le permite comprar productos sin que su
          localización sea expuesta. <br />
          Si desea cambiar al rol <strong>ejecutivo</strong>, <u>no podrá revertir esta opción</u>.
        </p>

        <IonRadioGroup value={selectedRole} onIonChange={(e) => handleRoleChange(e.detail.value)}>
          <IonItem  style={{'--background': '#b7b7b7ee', '--color': '#000000', '--border-radius': '10px 10px 0px 0'}}>
            <IonLabel>Usuario</IonLabel>
            <IonRadio slot="start" value="usuario" />
          </IonItem>
          <IonItem style={{'--background': '#b7b7b7ee', '--color': '#000000'}}>
            <IonLabel>Ejecutivo</IonLabel>
            <IonRadio slot="start" value="ejecutivo" />
          </IonItem>
        </IonRadioGroup>
      </IonContent>

      {/* Modal de confirmación */}
      <IonAlert
        isOpen={showConfirm}
        header="¿Estás seguro?"
        message="Cambiar al rol ejecutivo es permanente. ¿Deseas continuar?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            handler: () => setShowConfirm(false),
          },
          {
            text: "Sí, cambiar",
            handler: confirmarCambioRol,
          },
        ]}
        onDidDismiss={() => setShowConfirm(false)}
      />
    </>
  );
};