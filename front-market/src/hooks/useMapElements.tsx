import { useRef, useEffect, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { useAuth } from "../context/contextUsuario";
import { updateVendedorLocation, getVendedoresWithLocation } from "../services/firebase/vendedor";
import type { Position } from "@capacitor/geolocation";

type Coordenadas = { lat: number; lng: number };

export const UseMapElements = (
  location: Position | null,

  refreshLocation: () => void
) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<GoogleMap | null>(null);
  const marcadorActual = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  const [coordsSeleccionadas, setCoordsSeleccionadas] = useState<Coordenadas | null>(null);

  const { user } = useAuth();

  

  const createMap = async () => {
    if (!mapRef.current || !location) return;

    try {
      mapInstance.current = await GoogleMap.create({
        id: "local-map",
        element: mapRef.current,
        apiKey: "AIzaSyBV35eS9s-QUwN0WcZWeK-XIoICekxqXwk",
        config: {
          mapId: "ac464f4a57e00c008465a507",
          center: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
          zoom: 12,
          disableDefaultUI: true,
        },
      });

      marcadorActual.current = await mapInstance.current.addMarker({
        coordinate: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        title: "Tu posición",
      });

       const { success, vendedores } = await getVendedoresWithLocation();
       console.log("Vendedores:", vendedores);


      setMapReady(true);
    } catch (error) {
      alert("Error al crear el mapa: " + error);
    }
  };

  const agregarMarcadorUnico = async (lat: number, lng: number, titulo: string) => {
    if (!mapInstance.current) return;

    try {
      if (marcadorActual.current) {
        await mapInstance.current.removeMarker(marcadorActual.current);
      }

      marcadorActual.current = await mapInstance.current.addMarker({
        coordinate: { lat, lng },
        title: titulo,
      });

    } catch (error) {
      console.error("Error al agregar marcador:", error);
    }
  };

   const agregarMarcadoresDeVendedores = async () => {
    if (!mapInstance.current) return;
  try {
    const { success, vendedores } = await getVendedoresWithLocation();

    if (!success || !vendedores) return;

    for (const vendedor of vendedores) {
      if (vendedor.localizacion?.lat && vendedor.localizacion?.lng) {
        await mapInstance.current.addMarker({
          coordinate: {
            lat: vendedor.localizacion.lat,
            lng: vendedor.localizacion.lng,
          },
          title: vendedor.nombre || "Vendedor",
        });
      }
    }

    console.log("Marcadores de vendedores añadidos.");
  } catch (error) {
    console.error("Error al añadir marcadores de vendedores:", error);
  }
};

  const activarSeleccionUbicacion = async () => {
    if (!mapInstance.current) return;

    await mapInstance.current.setOnMapClickListener(async ({ latitude, longitude }) => {
      await agregarMarcadorUnico(latitude, longitude, "Ubicación seleccionada");
      setCoordsSeleccionadas({ lat: latitude, lng: longitude });
      mapInstance.current?.removeAllMapListeners();
    });
  };

  const guardarUbicacion = async () => {
    if (!user || !coordsSeleccionadas) return;

    const res = await updateVendedorLocation(user.uid, coordsSeleccionadas);
    if (res.success) {
      alert("Ubicación guardada correctamente.");
    } else {
      alert("Error al guardar la ubicación: " + res.error);
    }
  };

  const destroyMap = () => {
    mapInstance.current?.removeAllMapListeners();
    mapInstance.current?.destroy();
    mapInstance.current = null;
    marcadorActual.current = null;
    setMapReady(false);
  };

  useEffect(() => {
    if (location) {
      createMap();
    } else {
      refreshLocation();
    }

    return destroyMap;
  }, [location]);

  return {
    mapRef,
    activarSeleccionUbicacion,
    guardarUbicacion,
    coordsSeleccionadas,
    mapReady,
    agregarMarcadoresDeVendedores,
  };
};
