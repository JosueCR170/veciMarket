import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { IonLoading, IonSpinner, IonText, IonAlert, IonButton } from "@ionic/react"; // Importamos los componentes de Ionic
import "./map.css";
import { useLocationTracker } from "./useLocationTracker"; // Asegúrate de que la ruta sea correcta

const MapaComercios: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<GoogleMap | null>(null);

    const [mapReady, setMapReady] = useState(false);

    const marcadorActual = useRef<any>(null);
    const circuloActual = useRef<any>(null);

    const [showAlert, setShowAlert] = useState(false);



    const { location, loading, error, requestPermissions, getCurrentPosition } = useLocationTracker(); // Update every 40 seconds with 5 second countdown

    useEffect(() => {
        const initLocation = async () => {
            await requestPermissions();
            await getCurrentPosition();
        };
        initLocation();
    }, []);

    useEffect(() => {
        if (!loading && location?.coords) {
            createMap();
            console.log("Ubicación actual:", location);
        } else if (error) {
            alert("Error: " + error);
        }
    }, [loading, location, error]);

    useEffect(() => {
        if (!mapReady) return;

        (async () => {
            if (location?.coords) {
                const localizacionLocal = await agregarMarcador(mapInstance.current!, location.coords.latitude, location.coords.longitude, "Tu posición");
                //const circulo = await agregarCirculos(mapInstance.current!, location.coords.latitude, location.coords.longitude, 1000, '#FF000000', '#3300FF00');
                await moverCamara(mapInstance.current!, location.coords.latitude, location.coords.longitude, 12);

                //circuloActual.current = circulo;
                marcadorActual.current = localizacionLocal;


                //cambiar de marcador dando click, debe activarse cuando acepta cambiar de direccion
                // await mapInstance.current!.setOnMapClickListener(async ({ latitude, longitude }) => {
                //     if(mapInstance.current){await mapInstance.current.removeCircles(circuloActual.current!);}
                //     await agregarMarcadorUnico(latitude, longitude, "Ubicación seleccionada");

                // });

            }
        })();

    }, [mapReady, location]);

    async function createMap() {
        if (!mapRef.current) return;

        try {

            mapInstance.current = await GoogleMap.create({
                id: "local-map",
                element: mapRef.current,
                apiKey: "AIzaSyBV35eS9s-QUwN0WcZWeK-XIoICekxqXwk",
                config: {
                    mapId: "ac464f4a57e00c008465a507",
                    center: {
                        lat: 10.61822486603641,
                        lng: -85.4529675470169,
                    },
                    zoom: 8,
                    disableDefaultUI: true,
                },
            });
            setMapReady(true);

            // if (location?.coords) {
            //     const circulo=await agregarCirculos(mapInstance.current, location.coords.latitude, location.coords.longitude,
            //         1000,
            //         '#4285F4',
            //         'rgba(66, 133, 244, 0.3)',
            //     );
            //     circuloActual.current = circulo;
            // }


            // if (location?.coords) {
            //     const localizacionLocal = await agregarMarcador(mapInstance.current, location.coords.latitude, location.coords.longitude, "Tu posición");
            //     marcadorActual.current = localizacionLocal;
            //     await moverCamara(mapInstance.current, location.coords.latitude, location.coords.longitude, 12);

            //     //cambiar de marcador dando click, debe activarse cuando acepta cambiar de direccion
            //     await mapInstance.current.setOnMapClickListener(async ({ latitude, longitude }) => {
            //         if(mapInstance.current){await mapInstance.current.removeCircles(circuloActual.current);}
            //         await agregarMarcadorUnico(latitude, longitude, "Ubicación seleccionada");

            //     });
            // }

        } catch (error) {
            alert("Error al inicializar el mapa: " + error);
        }
    }

    // const agregarCirculos = async (map: GoogleMap, lat: number, lng: number, radius: number, strokeColor: string, fillColor: string) => {
    //     const circulo = await map.addCircles([{
    //         center: {
    //             lat,
    //             lng,
    //         },
    //         radius,
    //         strokeColor,
    //         fillColor,
    //     }]);
    //     return circulo[0]
    // }

    const moverCamara = async (map: GoogleMap, lat: number, lng: number, zoom: number) => {
        await map.setCamera({
            coordinate: {
                lat,
                lng,
            },
            zoom,
        });
    };

    const agregarMarcador = async (map: GoogleMap, lat: number, lng: number, title: string) => {
        const marcador = await map.addMarker({
            coordinate: { lat, lng },
            title,

        });
        console.log("Marcador agregado:", marcador)
        return marcador
    }

    async function agregarMarcadorUnico(lat: number, lng: number, titulo: string) {
        if (!mapInstance.current) return;

        
        try {
            if (marcadorActual.current) {
                await mapInstance.current.removeMarker(marcadorActual.current);
                 marcadorActual.current = null;
               
                // marcadorActual.current.setMap(null);
                
               
                //console.log("Marcador eliminado:", marcadorEliminado);
                //await mapInstance.current.removeCircles(circuloActual.current);
                const nuevoMarcador = await agregarMarcador(mapInstance.current, lat, lng, titulo);
                //const nuevoCirculo = await agregarCirculos(mapInstance.current, lat, lng, 1000, '#4285F4', '#4D4285F4');
                marcadorActual.current = nuevoMarcador;
                //circuloActual.current = nuevoCirculo;

            }
            

        } catch (error) {
            console.error("Error al agregar marcador:", error);
        }
    }

    const activarListenerClickMapa = async () => {
        if (!mapInstance.current) return;
        await mapInstance.current.setOnMapClickListener(async ({ latitude, longitude }) => {
            if (mapInstance.current && circuloActual.current) {
                //await mapInstance.current.removeCircles(circuloActual.current);
                mapInstance.current.removeAllMapListeners();
            }
            await agregarMarcadorUnico(latitude, longitude, "Ubicación seleccionada");
        });
    };






    /*useEffect(() => {
      const fetchLocation = async () => {
        await getCurrentPosition(); // Esto se ejecuta una sola vez
      };
    
      fetchLocation();
    }, []);*/


    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
             <IonButton
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          padding: '6px 12px',
        }}
        color="primary"
        onClick={() => setShowAlert(true)}
      >
        Cambiar ubicación
      </IonButton>




            <div
                id='vendedor-map'
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
             <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="¿Cambiar localización manualmente?"
                className="custom-alert"
                buttons={[
                    {
                        text: 'No',
                        cssClass: 'alert-button-cancel',
                        handler: () => {
                            setShowAlert(false);
                        }
                    },
                    {
                        text: 'Sí',
                        cssClass: 'alert-button-confirm',
                        handler: async () => {
                            await activarListenerClickMapa();
                        }
                    },
                ]}
            />

            {loading && !location?.coords && (
                <div
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo blanco semi-transparente
                        padding: "10px 16px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
        </div>
    );
};

export default MapaComercios;