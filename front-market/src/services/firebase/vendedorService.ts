// src/services/registerUser.ts
import { auth, db } from "./config/firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";

type Coordenadas = {
  lat: number;
  lng: number;
  direccion?: string;
};

interface VendedorModel {
  user_id: string;
  localizacion: Coordenadas | null;
  nombre: string;
}

export const createVendedorProfile = async ({
  user_id,
  localizacion,
  nombre,
}: VendedorModel) => {
  try {
    const vendedorRef = doc(db, "vendedor", user_id);
    const vendedorDoc = await getDoc(vendedorRef);

    // Solo crear si no existe
    if (!vendedorDoc.exists()) {
      await setDoc(vendedorRef, {
        //productos,
        localizacion,
        nombre,
      });
      console.log("Vendedor creado en Firestore");
    } else {
      console.log("El vendedor ya existe en Firestore");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creando vendedor en Firestore:", error);
    return { success: false, error };
  }
};

export const updateVendedorLocation = async (
  user_id: string,
  localizacion: Coordenadas
) => {
  try {
    const vendedorRef = doc(db, "vendedor", user_id);
    const vendedorDoc = await getDoc(vendedorRef);

    if (!vendedorDoc.exists()) {
      throw new Error("El vendedor no existe en Firestore");
    }

    await updateDoc(vendedorRef, {
      localizacion,
    });

    console.log("Localización del vendedor actualizada correctamente.");
    return { success: true };
  } catch (error) {
    console.error(
      "Error actualizando localización del vendedor en Firestore:",
      error
    );
    return { success: false, error };
  }
};

export const getVendedor = async (user_id: string) => {
  try {
    const vendedorRef = doc(db, "vendedor", user_id);
    const vendedorDoc = await getDoc(vendedorRef);

    if (!vendedorDoc.exists()) {
      throw new Error("El vendedor no existe en Firestore");
    }

    return vendedorDoc.data();
  } catch (error) {
    console.error(
      "Error obteniendo el vendedor en Firestore:",
      error
    );
    return { success: false, error };
  }
};

export const getVendedoresWithLocation = async () => {
  try {
    const vendedoresRef = collection(db, "vendedor");
    const q = query(vendedoresRef, where("localizacion", "!=", null));
    const vendedoresSnapshot = await getDocs(q);

    const vendedores = vendedoresSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        productos: data.productos || null,
        localizacion: data.localizacion || null,
        nombre: data.nombre || "Vendedor Anónimo",
      };
    });

    return { success: true, vendedores };
  } catch (error) {
    console.error("Error obteniendo vendedores en Firestore:", error);
    return { success: false, error };
  }
};
