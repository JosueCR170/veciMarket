// src/services/registerUser.ts
import { db } from './config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserModel {
  user_id: string;
  name: string;
  correo: string;
  rol?: "ejecutivo" | "usuario";
}

export const createUserProfile = async ({ user_id, correo, name, rol = 'usuario' }: UserModel) => {
  try {
    const userRef = doc(db, 'userRol', user_id);
    const userDoc = await getDoc(userRef);

    // Solo crear si no existe
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        correo,
        name,
        rol,
      });
      console.log('Perfil de usuario creado en Firestore');
    } else {
      console.log('El perfil ya existe en Firestore');
    }

    return { success: true };
  } catch (error) {
    console.error('Error creando perfil en Firestore:', error);
    return { success: false, error };
  }
}

export const getUser = async (user_id: string) => {
  try {
    const userRef = doc(db, 'userRol', user_id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("El user no existe en Firestore");
    }

    return userDoc.data();
  } catch (error) {
    console.error(
      "Error obteniendo los datos del user en Firestore:",
      error
    );
    return { success: false, error };
  }
};
