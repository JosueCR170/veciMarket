import { IonButton, IonAlert, IonSpinner, IonText, IonModal } from "@ionic/react";
import { useLocationContext } from "../../context/contextLocation";
import { UseMapElements } from "../../hooks/useMapElements";
import { useState, useEffect } from "react";

const Map: React.FC = () => {
  const { location, loading, error, refreshLocation } = useLocationContext();
  const {
    mapRef,
    activarSeleccionUbicacion,
    guardarUbicacion,
    coordsSeleccionadas,
    mapReady,
    comercioSeleccionado,
    seleccionarMarcadorVendedor
  } = UseMapElements(location, refreshLocation);

  const [showAlert, setShowAlert] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    if (comercioSeleccionado) {
      console.log("Comercio seleccionado:", comercioSeleccionado);
      setModalAbierto(true);
    }
  }, [comercioSeleccionado]);

  useEffect(() => {
    if (mapReady) {
      seleccionarMarcadorVendedor(); // activa el listener
    }
  }, [mapReady]);


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


      <IonModal isOpen={modalAbierto} trigger="open-modal" initialBreakpoint={0.25}
        breakpoints={[0, 0.25, 0.55, 1]} onDidDismiss={() => setModalAbierto(false)}
        style={{ '--background': '#fff', color: '#000' }}>
        {comercioSeleccionado && (
          <div style={{ padding: 16 }}>
            <h2>{comercioSeleccionado.nombre}</h2>
            <p>Latitud: {comercioSeleccionado.localizacion.lat}</p>
            <p>Longitud: {comercioSeleccionado.localizacion.lng}</p>
          </div>
        )}
      </IonModal>
    </div>
  );
};

export default Map;
