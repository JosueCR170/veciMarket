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

  // const [cargador, setCargador]= useState(true);

  // useEffect(() => {
  //   setCargador(true)
  // }, []);

  useEffect(() => {
    if (mapReady) {
      seleccionarMarcadorVendedor(); // activa el listener
      // setCargador(false)
    }
  }, [mapReady]);

  const handleMoverCamara = async () => {
     await moverCamara( coordsSeleccionadas?.lat!, coordsSeleccionadas?.lng!, 19);
  }

 return (
  <div className="map-container">
    {loading ? (
       <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "rgb(255, 255, 255)",
            padding: "10px 16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgb(0, 0, 0)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 1000,
          }}
        >
          <IonSpinner name='crescent' color='primary' style={{ width: "20px", height: "20px" }} />
          <IonText style={{ fontSize: "14px", color: "#333" }}>Estamos buscando tu ubicación...</IonText>
        </div>
    ) : (
      <>
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
      </>
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
  </div>
);

};

export default Map;
