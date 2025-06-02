import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { IonContent, IonLoading, IonModal, IonSpinner, IonText } from "@ionic/react"; // Importamos los componentes de Ionic
import "./map.css";
import { useLocationTracker } from "../../hooks/useLocationTracker"; // Asegúrate de que la ruta sea correcta
import { useLocationContext } from "../../context/contextLocation";
import { UseMapElements } from "../../hooks/useMapElements";
 
// interface Comercios {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
// }

const MapaComercios: React.FC = () => {
  const { location, loading, error, refreshLocation } = useLocationContext();
    const {
      mapRef,
      mapReady,
      comercioSeleccionado,
      seleccionarMarcadorVendedor,

    } = UseMapElements(location, refreshLocation, "verVendedores-map", true);
  
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
  // const mapRef = useRef<HTMLDivElement | null>(null);
  // const mapInstance = useRef<GoogleMap | null>(null);
  // const [modalAbierto, setModalAbierto] = useState(false);
  // const [comercioSeleccionado, setComercioSeleccionado] = useState<Comercios | null>(null);
  // const { location, loading, error, requestPermissions, getCurrentPosition } = useLocationTracker(); // Update every 40 seconds with 5 second countdown

  // // Arreglo de ejemplo con varias Comercioss (simulando datos de Firebase)
  // const Comercioss: Comercios[] = [
  //   { id: "Comercios1", name: "Comercios Central", latitude: 10.680342684456466, longitude:-85.35736588343377 },
  //   { id: "Comercios2", name: "Comercios Norte", latitude: 10.335854451422804, longitude: -85.50964271300026 },
  //   { id: "Comercios3", name: "Comercios Sur", latitude: 10.081137400923057, longitude:-85.4276028962142 },
  // ];
  
  // async function createMap() {
  //   if (!mapRef.current) return;

  //   try {
  //     mapInstance.current = await GoogleMap.create({
  //       id: "vendedores-map",
  //       element: mapRef.current,
  //       apiKey: "AIzaSyBV35eS9s-QUwN0WcZWeK-XIoICekxqXwk",
  //       config: {
  //         mapId:"ac464f4a57e00c003b1f7259",
  //         center: {
  //           lat: 10.61822486603641,
  //           lng: -85.4529675470169,
  //         },
  //         zoom: 8,
  //         disableDefaultUI: true,
  //       },
  //     });

      
  //     for (const Comercios of Comercioss) {
  //       await mapInstance.current.addMarker({
  //         coordinate: {
  //           lat: Comercios.latitude,
  //           lng: Comercios.longitude,
  //         },
  //         title: Comercios.name,
  //         snippet: "Aquí estás",
  //       });
  //     }
  //     if (location?.coords) {
  //       // await mapInstance.current.addCircles([{
  //       //   center: {
  //       //     lat: location.coords.latitude,
  //       //     lng: location.coords.longitude,
  //       //   },
  //       //   radius: 1000,
  //       //   strokeColor: '#4285F4',
  //       //   fillColor: 'rgba(66, 133, 244, 0.3)',
  //       // }]);
  //     }


  //     if (location?.coords) {
  //       await mapInstance.current.addMarker({
  //         coordinate: {
  //           lat: location.coords.latitude,
  //           lng: location.coords.longitude,
  //         },
  //         title: "Tu posición",
          
  //       });

  //       // Centrar el mapa en la posición del usuario
  //       await mapInstance.current.setCamera({
  //         coordinate: {
  //           lat: location.coords.latitude,
  //           lng: location.coords.longitude,
  //         },
  //         zoom: 12,
  //       });
  //     }

  //     await mapInstance.current.setOnMarkerClickListener((data) => {
  //       const marcadorId = data.markerId;
  //       const comercio = Comercioss.find((c) => c.name === data.title);

  //        if (comercio) {
  //          setComercioSeleccionado(comercio);
  //          setModalAbierto(true); // Mostrar tu modal
  //        }
  //          });
  //       } catch (error) {
  //         alert("Error al inicializar el mapa: " + error);
  //       }
  //     }

  // useEffect(() => {
  //   const initLocation = async () => {
  //     await requestPermissions();
  //     await getCurrentPosition();
  //   };
  //   initLocation();
  // }, []);
  
//   useEffect(() => {
//   if (!loading && location?.coords) {
//     createMap();
//     console.log("Ubicación actual:", location);
//   } else if (error) {
//     alert("Error: " + error);
//   }
// }, [loading, location, error]);

/*useEffect(() => {
  const fetchLocation = async () => {
    await getCurrentPosition(); // Esto se ejecuta una sola vez
  };

  fetchLocation();
}, []);*/


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

     
        {/* <IonModal isOpen={modalAbierto} trigger="open-modal" initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.55, 1]} onDidDismiss={() => setModalAbierto(false)}
          style={{'--background': '#fff',  color: '#000'}}>
          {comercioSeleccionado && (
            <div style={{ padding: 16 }}>
              <h2>{comercioSeleccionado.name}</h2>
              <p>Latitud: {comercioSeleccionado.latitude}</p>
              <p>Longitud: {comercioSeleccionado.longitude}</p>
            </div>
          )}
      </IonModal> */}
       <IonModal isOpen={modalAbierto} trigger="open-modal" initialBreakpoint={0.25}
        breakpoints={[0, 0.25, 0.55, 1]} onDidDismiss={() => setModalAbierto(false)}
        style={{ '--background': '#fff', color: '#000' }}>
        {comercioSeleccionado && (
          <div style={{ padding: 16 }}>
            <h2>{comercioSeleccionado.nombre}</h2>
             <p>Direccion: {comercioSeleccionado.direccion}</p>
            <p>Latitud: {comercioSeleccionado.localizacion.lat}</p>
            <p>Longitud: {comercioSeleccionado.localizacion.lng}</p>
          </div>
        )}
      </IonModal>
    </div>
  );
};

export default MapaComercios;