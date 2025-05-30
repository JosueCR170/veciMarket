import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../services/firebase/config/firebaseConfig';
import CardProducto from '../cardProducto/cardProducto';
import { IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';

type Producto = {
  id: string;
  img: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  [key: string]: any;
};

const VerProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchProductos = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'productos'));
      const productosData = querySnapshot.docs.map(doc => {
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
      setProductos(productosData);
    };

    fetchProductos();
  }, []);

  return (
    <IonContent style={{ '--background': '#EEEEEE' }}>
      <IonGrid>
        <IonRow>
          {productos.map(producto => (
            <IonCol size="12" sizeMd="6" sizeLg="4" sizeXl="3" key={producto.id}>
              <CardProducto producto={producto} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </IonContent>

  );
};

export default VerProductos;