import { IonToolbar, IonTitle, IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";

interface SubmodalHeaderProps {
  titulo: string;
  onClose: () => void;
}

export const SubmodalHeader: React.FC<SubmodalHeaderProps> = ({ titulo, onClose }) => {
  return (
    <div>
      <IonToolbar className="tootalModalConfiguracion">
        <IonTitle className="tituloModalConfig">{titulo}</IonTitle>
        <span slot="start" onClick={onClose} style={{ cursor: "pointer" }}>
          <IonIcon icon={arrowBackOutline} style={{ fontSize: "24px", stroke: "#0003c9" }} />
        </span>
      </IonToolbar>
      <div style={{ height: "1px", backgroundColor: "#ccc", width: "100%" }}></div>
    </div>
  );
};

