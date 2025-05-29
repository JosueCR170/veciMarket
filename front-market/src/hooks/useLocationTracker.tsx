import { useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';

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

  return {
    ...state,
    requestPermissions,
    getCurrentPosition,
  };
};