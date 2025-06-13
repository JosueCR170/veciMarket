import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { IonContent, IonLoading, IonModal, IonSpinner, IonText } from "@ionic/react"; // Importamos los componentes de Ionic
import "./map.css";
import { useLocationTracker } from "../../hooks/useLocationTracker"; // Asegúrate de que la ruta sea correcta
import { useLocationContext } from "../../context/contextLocation";
import { UseMapElements } from "../../hooks/useMapElements";
import VerProductos from "../verProductos/verProductos"

const MapaComercios: React.FC = () => {
  const { location, loading, error, refreshLocation } = useLocationContext();
  const {
    mapRef,
    mapReady,
    comercioSeleccionado,
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
// [loading, mapReady, location]
);



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

      {loading && !location?.coords && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            // backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo blanco semi-transparente
            backgroundColor: "rgb(255, 255, 255)", // Fondo blanco semi-transparente
            padding: "10px 16px",
            borderRadius: "12px",
            // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            boxShadow: "0 2px 8px rgb(0, 0, 0)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 1000, // Asegurar que esté sobre el mapa
          }}
        >
          <IonSpinner name='crescent' color='primary' style={{ width: "20px", height: "20px" }} />
          <IonText style={{ fontSize: "14px", color: "#333" }}>Estamos buscando tu ubicación...</IonText>
        </div>
      )}

      <IonModal isOpen={modalAbierto} trigger="open-modal" initialBreakpoint={0.25}
        breakpoints={[0, 0.25, 0.55, 1]} onDidDismiss={() => setModalAbierto(false)}
        style={{ '--background': '#fff', color: '#000' }}>
        {comercioSeleccionado && (
          <div style={{ padding: 16, width: "100%", height: "100%" }}>
            <div>
              <h2>{comercioSeleccionado.nombre}</h2>
              <p>Direccion: {comercioSeleccionado.direccion}</p>
            </div>

            <VerProductos idVendedor={comercioSeleccionado.id}/>
          </div>

        )}
      </IonModal>
    </div>
  );
};

export default MapaComercios;