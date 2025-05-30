import { IonButton, IonAlert, IonSpinner, IonText } from "@ionic/react";
import { useLocationContext } from "../../context/contextLocation";
import { UseMapElements } from "../../hooks/useMapElements";
import { useState } from "react";

const Map: React.FC = () => {
  const { location, loading, error, refreshLocation } = useLocationContext();
  const {
    mapRef,
    activarSeleccionUbicacion,
    guardarUbicacion,
    coordsSeleccionadas,
    mapReady,
  } = UseMapElements(location, refreshLocation);

  const [showAlert, setShowAlert] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <IonButton
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 999 }}
        onClick={() => setShowAlert(true)}
      >
        Cambiar ubicación
      </IonButton>

      <IonButton
        style={{ position: 'absolute', top: 10, left: 180, zIndex: 999 }}
        color="success"
        onClick={guardarUbicacion}
        disabled={!coordsSeleccionadas}
      >
        Guardar ubicación
      </IonButton>

      <div ref={mapRef} id="local-map" style={{ width: "100%", height: "100%" }} />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="¿Cambiar localización manualmente?"
        buttons={[
          { text: "No", role: "cancel" },
          { text: "Sí", handler: activarSeleccionUbicacion },
        ]}
      />

      {loading && !location?.coords && (
        <div style={{
          position: "absolute", top: 16, right: 16, backgroundColor: "white",
          padding: "10px 16px", borderRadius: "12px", boxShadow: "0 2px 8px black",
          display: "flex", alignItems: "center", gap: "8px", zIndex: 1000,
        }}>
          <IonSpinner name='crescent' color='primary' />
          <IonText>Estamos buscando tu ubicación...</IonText>
        </div>
      )}
    </div>
  );
};

export default Map;
