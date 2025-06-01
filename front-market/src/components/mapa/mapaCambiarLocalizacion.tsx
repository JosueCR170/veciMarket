import { IonButton, IonAlert, IonSpinner, IonText, IonModal, IonIcon } from "@ionic/react";
import { locate } from "ionicons/icons";
import { useLocationContext } from "../../context/contextLocation";
import { UseMapElements } from "../../hooks/useMapElements";
import { useState, useEffect } from "react";
import './mapaCambiarLocalizacion.css'

const Map: React.FC = () => {
  const { location, loading, error, refreshLocation } = useLocationContext();
  const {
    mapRef,
    coordsSeleccionadas,
    mapReady,
    //comercioSeleccionado,
    activarSeleccionUbicacion,
    guardarUbicacion,
    seleccionarMarcadorVendedor,
    moverCamara,
  } = UseMapElements(location, refreshLocation);

  const [showAlert, setShowAlert] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  // useEffect(() => {
  //   if (comercioSeleccionado) {
  //     console.log("Comercio seleccionado:", comercioSeleccionado);
  //     setModalAbierto(true);
  //   }
  // }, [comercioSeleccionado]);

  useEffect(() => {
    if (mapReady) {
      seleccionarMarcadorVendedor(); // activa el listener
    }
  }, [mapReady]);

  const handleMoverCamara = async () => {
     await moverCamara( coordsSeleccionadas?.lat!, coordsSeleccionadas?.lng!, 14);
  }

  return (
    <div className="map-container">
      <div className="top-buttons">
        
        <IonButton fill="outline" className="btn-icono" shape="round" onClick={handleMoverCamara}>
           <IonIcon slot="icon-only" ios={locate} md={locate}></IonIcon>
        </IonButton>

        <IonButton onClick={() => setShowAlert(true)} className="btn-cambiar" size="small">
          Cambiar ubicación
        </IonButton>

        <IonButton onClick={guardarUbicacion} disabled={!coordsSeleccionadas} className="btn-guardar" size="small">
          Guardar
        </IonButton>
      </div>

      {!location?.coords && showWarning && (
        <div className="alert-warning">
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            Para poder añadir productos, primero debes registrar tu localización.
          </div>
          <button onClick={() => setShowWarning(false)} className="alert-close" aria-label="Cerrar advertencia">
            ✖
          </button>
        </div>
      )}

      <div ref={mapRef} id="local-map" className="map" />

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
        <div className="loading-box">
          <IonSpinner name="crescent" color="primary" />
          <IonText>Estamos buscando tu ubicación...</IonText>
        </div>
      )}

      {/* <IonModal
        isOpen={modalAbierto}
        trigger="open-modal"
        initialBreakpoint={0.25}
        breakpoints={[0, 0.25, 0.55, 1]}
        onDidDismiss={() => setModalAbierto(false)}
        className="modal-comercio"
      >
        {comercioSeleccionado && (
          <div className="modal-content">
            <h2>{comercioSeleccionado.nombre}</h2>
            <p>Latitud: {comercioSeleccionado.localizacion.lat}</p>
            <p>Longitud: {comercioSeleccionado.localizacion.lng}</p>
          </div>
        )}
      </IonModal> */}
    </div>
  );
};

export default Map;
