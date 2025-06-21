import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../services/firebase/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { IonAlert } from "@ionic/react";
import { getDeviceToken, requestPushPermissions } from "../services/firebase/tokenUtils";

interface UserContextType {
  user: User | null;
  rol: string | null;
  loading: boolean;
  showSessionAlert: boolean;
  setShowSessionAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const contextoUsuario = createContext<UserContextType | undefined>(undefined);

async function getRol(uid: string): Promise<string | null> {
  try {
    const docRef = doc(db, `userRol/${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.rol || null;
    } else {
      console.warn("No se encontró el documento del usuario");

      return "usuario";
    }
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    return null;
  }

}
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSessionAlert, setShowSessionAlert] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const granted = await requestPushPermissions();
      if (!granted) {
        console.log('Permisos denegados para notificaciones');
        return;
      }
      if (user) {
        const uid = user.uid;
        const currentDeviceToken = await getDeviceToken();

        if (!currentDeviceToken) {
          console.warn("No se pudo obtener el token del dispositivo");
          await signOut(auth);
          setUser(null);
          setRol(null);
          setShowSessionAlert(true);
          setLoading(false);
          return;
        }

        const docRef = doc(db, "userSessions", uid);
        const snap = await getDoc(docRef);
        const remoteDeviceToken = snap.exists() ? snap.data().deviceToken : null;

        if (remoteDeviceToken === null || remoteDeviceToken === currentDeviceToken) {
          console.log("No hay sesión activa o el token es igual, sesión válida");
          setUser(user);
          const userRol = await getRol(uid);
          setRol(userRol);
        } else {
          await signOut(auth);
          setUser(null);
          setRol(null);
          setShowSessionAlert(true);
        }
        setLoading(false);
      } else {
        setUser(null);
        setRol(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <contextoUsuario.Provider value={{ user, rol, loading, showSessionAlert, setShowSessionAlert }}>
        {children}
      </contextoUsuario.Provider>

      <IonAlert
        isOpen={showSessionAlert}
        onDidDismiss={() => setShowSessionAlert(false)}
        header="Sesión activa detectada"
        message="Ya tienes una sesión iniciada en otro dispositivo. Por favor cierra sesión antes de iniciar una nueva."
        buttons={["OK"]}
      />
    </>
  );
};

export const useAuth = (): UserContextType => {
  const context = useContext(contextoUsuario);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
}
