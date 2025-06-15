import { useEffect, useState } from "react";
import { IonModal, IonSpinner, IonText, IonButton,IonIcon } from "@ionic/react";
import "./map.css";
import { useLocationContext } from "../../context/contextLocation";
import { UseMapElements } from "../../hooks/useMapElements";
import VerProductos from "../verProductos/verProductos"
import { locate } from "ionicons/icons";

const MapaComercios: React.FC = () => {
  const { location, loading, refreshLocation } = useLocationContext();
  const {
    mapRef,
    mapReady,
    comercioSeleccionado,
    coordsSeleccionadas,
    seleccionarMarcadorVendedor,
    moverCamara,

  } = UseMapElements(location, refreshLocation, "verVendedores-map", true);

  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    if (comercioSeleccionado) {
      console.log("Comercio seleccionado:", comercioSeleccionado);
      setModalAbierto(true);
    }
  }, [comercioSeleccionado]);


  useEffect(() => {
    
  if ( mapReady) {
    console.log("entra a seleccionador de marcador");
    seleccionarMarcadorVendedor();
  }
}, [mapReady]
);

 const handleMoverCamara = async () => {
     await moverCamara( coordsSeleccionadas?.lat!, coordsSeleccionadas?.lng!, 19);
  }



  return (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <div
      id='Comercios-map'
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />

    {loading || !coordsSeleccionadas?.lat ? (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 999,
        }}
      >
        <IonSpinner name='crescent' color='primary' style={{ width: "24px", height: "24px" }} />
        <IonText style={{ fontSize: "16px", color: "#333" }}>
          Estamos buscando tu ubicación...
        </IonText>
      </div>
    ) : (
      <>
        <div className="top-buttons">
          <IonButton fill="outline" className="btn-icono" shape="round" onClick={handleMoverCamara}>
            <IonIcon slot="icon-only" ios={locate} md={locate}></IonIcon>
          </IonButton>
        </div>

        <IonModal
          isOpen={modalAbierto}
          trigger="open-modal"
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.55, 1]}
          onDidDismiss={() => setModalAbierto(false)}
          style={{ '--background': '#fff', color: '#000' }}
        >
          {comercioSeleccionado && (
            <div style={{ padding: 16, width: "100%", height: "100%" }}>
              <div>
                <h2>{comercioSeleccionado.nombre}</h2>
                <p>Dirección: {comercioSeleccionado.direccion}</p>
              </div>
              <VerProductos idVendedor={comercioSeleccionado.id} />
            </div>
          )}
        </IonModal>
      </>
    )}
  </div>
);

};

export default MapaComercios;