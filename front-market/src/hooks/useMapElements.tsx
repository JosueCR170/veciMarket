import { useRef, useEffect, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { useAuth } from "../context/contextUsuario";
import { updateVendedorLocation, getVendedoresWithLocation } from "../services/firebase/vendedorService";
import { useLocationTracker } from "./useLocationTracker";
import type { Position } from "@capacitor/geolocation";
import { useIonViewDidLeave, useIonViewWillEnter } from "@ionic/react";

type Coordenadas = { lat: number; lng: number };

export const UseMapElements = (
  location: Position | null,
  refreshLocation: () => Promise<void>,
  mapInstanceId = "local-map",
  mostrarVendedores: boolean = false
) => {

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapaYaCreado = useRef(false);
  const mapInstance = useRef<GoogleMap | null>(null);
  const marcadorActual = useRef<any>(null);

  const [coordsLocal, setCoordsLocal] = useState<Coordenadas | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [coordsSeleccionadas, setCoordsSeleccionadas] = useState<Coordenadas | null>(null);

  const [vendedores, setVendedores] = useState<any[]>([]);
  const [comercioSeleccionado, setComercioSeleccionado] = useState<any | null>(null);
  const [direccionLugar, setDireccionLugar] = useState<string | null>(null);


  const { user } = useAuth();
  const tracker = useLocationTracker();



  const createMap = async () => {
    if (mapaYaCreado.current || !mapRef.current) return;
    mapaYaCreado.current = true;

    const lat = location?.coords.latitude ?? coordsLocal?.lat;
    const lng = location?.coords.longitude ?? coordsLocal?.lng;

    if (lat == null || lng == null) return;
    setCoordsSeleccionadas({ lat, lng });

    const dir = await obtenerDireccionByCoords(lat, lng);
    setDireccionLugar(dir);


    //if (!mapRef.current || !location) return;

    try {
      mapInstance.current = await GoogleMap.create({
        id: mapInstanceId,
        element: mapRef.current!,
        apiKey: "AIzaSyBV35eS9s-QUwN0WcZWeK-XIoICekxqXwk",
        config: {
          mapId: "ac464f4a57e00c008465a507",
          center: {
            lat: lat,
            lng: lng,
          },
          zoom: 19,
          disableDefaultUI: true,
        },
      });

      marcadorActual.current = await mapInstance.current.addMarker({
        coordinate: {
          lat: lat,
          lng: lng,
        },
        title: "Tu posición",
        snippet: "Esta es tu ubicación actual",
      });

      if (mostrarVendedores) { await agregarMarcadoresDeVendedores() }


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
        snippet: "Esta es tu ubicación actual",

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
      setVendedores(vendedores);

      for (const vendedor of vendedores) {
        if (vendedor.localizacion?.lat && vendedor.localizacion?.lng) {
          await mapInstance.current.addMarker({
            coordinate: {
              lat: vendedor.localizacion.lat,
              lng: vendedor.localizacion.lng,
            },
            title: vendedor.nombre || "Vendedor",
            snippet: "Comercio",
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

      const direction = await obtenerDireccionByCoords(latitude, longitude);
      setDireccionLugar(direction);



      mapInstance.current?.removeAllMapListeners();
    });
  };

  const seleccionarMarcadorVendedor = async () => {
    if (!mapInstance.current) return false;

    try {
      await mapInstance.current.setOnMarkerClickListener(async (data) => {
        const { title, snippet } = data;

        // Ignorar el marcador del usuario
        if (title === "Tu posición" || snippet === "Esta es tu ubicación actual") {
          return;
        }
        const comercio = vendedores.find((c) => c.nombre === data.title);

        if (comercio) {

          const direccion = await obtenerDireccionByCoords(comercio.localizacion.lat, comercio.localizacion.lng);
          const comercioData = {
            ...comercio,
            direccion: direccion || "Ubicación desconocida"
          };
          console.log("Comercio seleccionado:", comercioData);
          
          setComercioSeleccionado(comercioData);
          // setModalAbierto(true); // Puedes habilitar esto si necesitas mostrar algo
          return true;
        }

        return false; // Si no encontró el comercio
      });
    } catch (error) {
      alert("Error al seleccionar el marcador: " + error);
    }
  };


  const guardarUbicacion = async () => {
    if (!user || !coordsSeleccionadas) return;

    const direccion = await obtenerDireccionByCoords(coordsSeleccionadas.lat, coordsSeleccionadas.lng);
    const coords = {
      lat: coordsSeleccionadas.lat,
      lng: coordsSeleccionadas.lng,
      direccion: direccion || "Ubicación desconocida",
    };

    const res = await updateVendedorLocation(user.uid, coords);
    if (res.success) {
      console.log("Ubicación guardada:", coordsSeleccionadas);
      alert("Ubicación guardada correctamente.");
      await refreshLocation();
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
    mapaYaCreado.current = false;
  };

  

  

  const obtenerDireccionByCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error("Error al obtener el nombre del lugar:", error);
      return null;
    }
  };

  const moverCamara = async ( lat: number, lng: number, zoom: number) => {
        await mapInstance.current!.setCamera({
            coordinate: { lat, lng },
            zoom,
        });
    };



//   useEffect(() => {
//   const handleLocation = async () => {
//     if (!location) {
//       if (!user) return;
//       await tracker.requestPermissions();
//       const pos = await tracker.getCurrentPosition();
//       if (pos) {
//         setCoordsLocal({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//       } else if (tracker.error) {
//         throw new Error(tracker.error);
//       }
//     } else {
//       await createMap();
//     }
//   };
//   handleLocation();
//   return destroyMap;
// }, [location]);


  useEffect(() => {
    if (coordsLocal) {
      createMap();
    }
  }, [coordsLocal]);


  
  useIonViewDidLeave(() => {
  destroyMap(); // 🔥 limpia el mapa cuando la vista deja de mostrarse
});

useIonViewWillEnter(() => {
  destroyMap(); // Limpia si quedaba algo
  if (location) {
    createMap();
  } else {
    // Obtener nueva ubicación si no hay una previa
    (async () => {
      if (!user) return;
      await tracker.requestPermissions();
      const pos = await tracker.getCurrentPosition();
      if (pos) {
        setCoordsLocal({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }
    })();
  }
});

  return {
    mapRef,
    coordsSeleccionadas,
    mapReady,
    comercioSeleccionado,
    direccionLugar,
    activarSeleccionUbicacion,
    guardarUbicacion,
    agregarMarcadoresDeVendedores,
    destroyMap,
    seleccionarMarcadorVendedor,
    moverCamara,
  };
};
