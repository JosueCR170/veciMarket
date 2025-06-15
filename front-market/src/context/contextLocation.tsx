import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase/config/firebaseConfig";
import { useAuth } from "./contextUsuario";
import { useLocationTracker } from "../hooks/useLocationTracker"; 
import { Position } from "@capacitor/geolocation";

interface LocationContextType {
    location: Position | null
    loading: boolean
    error: string | null
    setLoading: (loading: boolean) => void;
    refreshLocation: () => Promise<void>
    clearLocation: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [location, setLocation] = useState<Position | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const tracker = useLocationTracker();

    useEffect(() => {
        if (user) {
            fetchLocation();
        }
    }, [user]);

    const clearLocation = () => {
        setLocation(null);
        setError(null);
        setLoading(false);
    };

    const fetchLocation = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const vendedorRef = doc(db, "vendedor", user.uid);
            const vendedorSnap = await getDoc(vendedorRef);

            if (vendedorSnap.exists()) {

                const data = vendedorSnap.data();
                console.log("Datos del vendedor:", data);
                if (data.localizacion !=null) {

                    await tracker.requestPermissions();
                    const fakePosition: Position = {
                        coords: {
                            latitude: data.localizacion.lat,
                            longitude: data.localizacion.lng,
                            accuracy: 0,
                            altitude: null,
                            altitudeAccuracy: null,
                            heading: null,
                            speed: null,
                        },
                        timestamp: Date.now(),
                    };

                    setLocation(fakePosition);

                    console.log("Location:", location);
                    console.log("data location:", data.localizacion);

                } else {
                    setLocation(null);

                }
            } else {
                throw new Error("No hay vendedor guardado en Firestore");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };



    return (
        <LocationContext.Provider
            value={{
                location,
                loading,
                setLoading,
                error,
                refreshLocation: fetchLocation,
                clearLocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = (): LocationContextType => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocationContext must be used within a LocationProvider");
    }
    return context;
};
