import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { IonSpinner, IonText, IonAlert, IonButton } from "@ionic/react";
import "./map.css";
import { useLocationTracker } from "../../hooks/useLocationTracker";

import { useLocationContext } from "../../context/contextLocation";
import { updateVendedorLocation } from "../../services/firebase/vendedorService";
import { useAuth } from "../../context/contextUsuario";

const MapaLocal: React.FC = () => {
    const { user } = useAuth();

    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<GoogleMap | null>(null);
    const marcadorActual = useRef<any>(null);

    const [mapReady, setMapReady] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [coordsSeleccionadas, setCoordsSeleccionadas] = useState<{ lat: number; lng: number } | null>(null);

    const { location, loading, error, refreshLocation } = useLocationContext();

    //const { location, loading, error, requestPermissions, getCurrentPosition } = useLocationTracker();

    useEffect(() => {
        const init = async () => {
            await refreshLocation();
        };
        init();
    }, []);

    useEffect(() => {
    return () => {
        // Al desmontar el componente o cambiar de usuario, limpiamos el mapa
        if (mapInstance.current) {
            mapInstance.current.removeAllMapListeners();
            mapInstance.current.destroy(); // Destruye el mapa nativo
            mapInstance.current = null;
        }

        marcadorActual.current = null;
        setMapReady(false);
    };
}, [user]);


    useEffect(() => {
        if (!loading && location?.coords) {
            createMap();
            console.log("Ubicación actual:", location);
        } else if (error) {
            alert("Error: " + error);
        }
    }, [loading, location, error]);

    useEffect(() => {
        if (!mapReady || !location?.coords) return;

        (async () => {
            const localizacionLocal = await agregarMarcador(
                mapInstance.current!,
                location.coords.latitude,
                location.coords.longitude,
                "Tu posición"
            );
            await moverCamara(mapInstance.current!, location.coords.latitude, location.coords.longitude, 12);
            marcadorActual.current = localizacionLocal;
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
        } catch (error) {
            alert("Error al inicializar el mapa: " + error);
        }
    }

    const moverCamara = async (map: GoogleMap, lat: number, lng: number, zoom: number) => {
        await map.setCamera({
            coordinate: { lat, lng },
            zoom,
        });
    };

    const agregarMarcador = async (map: GoogleMap, lat: number, lng: number, title: string) => {
        const marcador = await map.addMarker({
            coordinate: { lat, lng },
            title,
        });
        console.log("Marcador agregado:", marcador);
        return marcador;
    };

    async function agregarMarcadorUnico(lat: number, lng: number, titulo: string) {
        if (!mapInstance.current) return;

        try {
            if (marcadorActual.current) {
                await mapInstance.current.removeMarker(marcadorActual.current);
                marcadorActual.current = null;

                const nuevoMarcador = await agregarMarcador(mapInstance.current, lat, lng, titulo);
                marcadorActual.current = nuevoMarcador;
            }
        } catch (error) {
            console.error("Error al agregar marcador:", error);
        }
    }

    const activarListenerClickMapa = async () => {
        if (!mapInstance.current) return;
        await mapInstance.current.setOnMapClickListener(async ({ latitude, longitude }) => {
            await agregarMarcadorUnico(latitude, longitude, "Ubicación seleccionada");
            setCoordsSeleccionadas({ lat: latitude, lng: longitude });
            console.log("Coordenadas seleccionadas:", coordsSeleccionadas);
            mapInstance.current?.removeAllMapListeners();
        });
    };

    const handleGuardarUbicacion = async () => {
        if (!user) return;
        const localizacionActualizada = await updateVendedorLocation(user.uid, coordsSeleccionadas!);
        if (localizacionActualizada.success) {
            alert("Ubicación guardada correctamente.");
        } else {
            alert("Error al guardar la ubicación: " + localizacionActualizada.error);
        }
    }

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

            <IonButton
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '290px',
                    zIndex: 9999,
                    padding: '6px 12px',
                }}
                color="primary"
                onClick={handleGuardarUbicacion}
            >
                Guardar ubicación
            </IonButton>

            <div
                id='local-map'
                ref={mapRef}
                style={{ width: "100%", height: "100%" }}
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
                        handler: () => setShowAlert(false),
                    },
                    {
                        text: 'Sí',
                        cssClass: 'alert-button-confirm',
                        handler: async () => {
                            await activarListenerClickMapa();
                        },
                    },
                ]}
            />

            {loading && !location?.coords && (
                <div
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        // backgroundColor: "rgba(255, 255, 255, 0.9)",
                         backgroundColor: "rgb(255, 255, 255)",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        boxShadow: "0 2px 8px rgb(0, 0, 0)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        zIndex: 1000,
                    }}
                >
                    <IonSpinner name='crescent' color='primary' style={{ width: "20px", height: "20px" }} />
                    <IonText style={{ fontSize: "14px", color: "#333" }}>
                        Estamos buscando tu ubicación...
                    </IonText>
                </div>
            )}
        </div>
    );
};

export default MapaLocal;
