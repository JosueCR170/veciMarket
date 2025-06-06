// src/services/firebaseProductService.ts
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { storage, db, auth } from './config/firebaseConfig';


export const uploadProductImage = async (productName: string, imageDataUrl: string): Promise<string> => {
  const timestamp = new Date().getTime();
  const storageRef = ref(storage, `productos/${timestamp}-${productName}.jpeg`);
  await uploadString(storageRef, imageDataUrl, 'data_url');
  return await getDownloadURL(storageRef);
};

export const saveProductData = async (product: {

  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  img: string;
  idVendedor:string;
}): Promise<void> => {
  await addDoc(collection(db, 'productos'), product);
};
