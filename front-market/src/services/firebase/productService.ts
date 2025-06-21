// src/services/firebaseProductService.ts
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, where, query, getDocs } from 'firebase/firestore';
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
  idVendedor: string;
}): Promise<void> => {
  await addDoc(collection(db, 'productos'), product);
};

export const getProductosByVendedorId = async (idVendedor: string) => {
  try {
    const productosRef = collection(db, 'productos');
    const q = query(productosRef, where('idVendedor', '==', idVendedor));
    const querySnapshot = await getDocs(q);



    const productos = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        img: data.img || '',
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        precio: data.precio || 0,
        categoria: data.categoria || '',
        ...data,
      };
    });

    return { success: true, productos: productos };
  } catch (error) {
    console.error('Error al obtener productos por vendedor:', error);
    return { success: false, error };
  }
}
