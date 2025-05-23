import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface UserContextType {
  user: User | null; 
  rol: string | null;
  loading: boolean;
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
        //return null;
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
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user){
                setUser(user);
                const userRol = await getRol(user.uid);
                setRol(userRol);
                 setLoading(false);
                 
            } else {
                setUser(null);
                setRol(null);
              }
              setLoading(false);
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    return (<contextoUsuario.Provider value={{ user, rol, loading}}>{children}</contextoUsuario.Provider>);
};

    export const useAuth = (): UserContextType => {
    const context = useContext(contextoUsuario);
    if (!context) {
        throw new Error("useAuth must be used within a UserProvider");
    }
    return context;
}
