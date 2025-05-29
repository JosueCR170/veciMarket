// src/services/registerUser.ts
import { auth, db } from './config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface VendedorModel{
    user_id: string;
    productos: string[] | null;
    localizacion: Location | null;
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