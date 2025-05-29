// src/services/registerUser.ts
import { auth, db } from './config/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

type Coordenadas = {
  lat: number;
  lng: number;
};

interface VendedorModel{
    user_id: string;
    productos: string[] | null;
    localizacion: Coordenadas | null;
}

  export const createVendedorProfile = async ({ user_id, productos, localizacion }: VendedorModel) => {
    try {
      const vendedorRef = doc(db, 'vendedor', user_id);
      const vendedorDoc = await getDoc(vendedorRef);
  
      // Solo crear si no existe
      if (!vendedorDoc.exists()) {
        await setDoc(vendedorRef, {
          productos,
          localizacion,
        });
        console.log('Vendedor creado en Firestore');
      } else {
        console.log('El vendedor ya existe en Firestore');
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error creando vendedor en Firestore:', error);
      return { success: false, error };
    }
  }


  export const updateVendedorLocation = async ( user_id:string, localizacion:Coordenadas) => {
  try {
    const vendedorRef = doc(db, 'vendedor', user_id);
    const vendedorDoc = await getDoc(vendedorRef);

    if (!vendedorDoc.exists()) {
      throw new Error('El vendedor no existe en Firestore');
    }

    await updateDoc(vendedorRef, {
      localizacion
    });

    console.log('Localización del vendedor actualizada correctamente.');
    return { success: true };
  } catch (error) {
    console.error('Error actualizando localización del vendedor en Firestore:', error);
    return { success: false, error };
  }
};