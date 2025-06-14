import {
  IonIcon,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";

export const ModelGeneral = ({ onClose }: { onClose: () => void }) => {

  return (
    <>
      <div>
        <IonToolbar className="tootalModalConfiguracion">
          <IonTitle className="tituloModalConfig">Modal General</IonTitle>
          <span slot="start" onClick={onClose} style={{ cursor: "pointer" }}>
            <IonIcon icon={arrowBackOutline} style={{ fontSize: "24px", stroke: "#0003c9" }} />
          </span>
        </IonToolbar>
        <div style={{ height: "1px", backgroundColor: "#ccc", width: "100%" }}></div>
      </div>
    </>
  );
};