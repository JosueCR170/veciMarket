import { useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';

// import { getVendedorLocation } from '../services/firebase/vendedor';
// import { useAuth } from '../context/contextUsuario';


interface LocationState {
  location: Position | null;
  loading: boolean;
  error: string | null;
}

export const useLocationTracker = () => {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: true,
    error: null,
  });

  // const { user } = useAuth();

  const getCurrentPosition = async () => {
    try {

      setState(prev => ({ ...prev, loading: true, error: null }));

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      setState(prev => ({
        ...prev,
        loading: false,
        location: position
      }));

      return position;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Error getting location: ${error instanceof Error ? error.message : String(error)}`
      }));
    }
  };

  const requestPermissions = async () => {
    try {

      const permissionStatus = await Geolocation.requestPermissions();
      return permissionStatus;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Error al pedir permisos: ${error instanceof Error ? error.message : String(error)}`,
      }));
      return null;
    }
  };

  // const getFirebaseLocation = async () => {
  //   try {
  //     const vendedorLocation = await getVendedorLocation(user!.uid);

  //     if (vendedorLocation?.lat && vendedorLocation?.lng) {
  //       const fakePosition: Position = {
  //         coords: {
  //           latitude: vendedorLocation.lat,
  //           longitude: vendedorLocation.lng,
  //           accuracy: 1,
  //           altitude: null,
  //           altitudeAccuracy: null,
  //           heading: null,
  //           speed: null,
  //         },
  //         timestamp: Date.now(),
  //       };

  //       setState(prev => ({
  //         ...prev,
  //         location: fakePosition,
  //         loading: false,
  //       }));

  //       console.log("Ubicación desde Firestore (simulada):", fakePosition);
  //       return fakePosition;
  //     } else {
  //       throw new Error("Localización no encontrada en Firestore");
  //     }
  //   } catch (error) {
  //     setState(prev => ({
  //       ...prev,
  //       loading: false,
  //       error: `Error obteniendo ubicación desde Firestore: ${error instanceof Error ? error.message : String(error)}`
  //     }));
  //     return null;
  //   }
  // };


  return {
    ...state,
    requestPermissions,
    getCurrentPosition,
    // getFirebaseLocation,
  };
};