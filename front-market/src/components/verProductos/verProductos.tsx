import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../services/firebase/config/firebaseConfig';
import CardProducto from '../cardProducto/cardProducto';
import ProductoModal from '../productoModal/productoModal';
import { IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';

// Define la interfaz Producto aquí
interface Producto {
  id: string;
  img: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  vendedor?: string;
  contacto?: string;
}

const VerProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
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
          // vendedor: data.vendedor || '', 
          // contacto: data.contacto || '',
          ...data,
        };
      });
      setProductos(productosData);
    };

    fetchProductos();
  }, []);

  const handleProductoClick = (producto: Producto) => {
    console.log('Modal abierto:', true); // Agrega esta línea
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  return (
    <IonContent style={{ '--background': '#EEEEEE',  position: 'relative' }}>
      <IonGrid>
        <IonRow>
          {productos.map(producto => (
            <IonCol size="6"  key={producto.id}>
              {/* Pasamos el ID como key */}
              <CardProducto producto={producto} onClick={handleProductoClick} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      <ProductoModal
        isOpen={modalAbierto}
        producto={productoSeleccionado}
        onClose={() => setModalAbierto(false)}
      />
    </IonContent>
  );
};

export default VerProductos;