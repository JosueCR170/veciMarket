import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../services/firebase/config/firebaseConfig';
import CardProducto from '../cardProducto/cardProducto';
import ProductoModal from '../productoModal/productoModal';
import { IonGrid, IonRow, IonCol, IonContent, IonItem, IonSelect, IonSelectOption, IonSearchbar } from '@ionic/react';
import { getProductosByVendedorId } from '../../services/firebase/productService';

// Define la interfaz Producto aquí
interface Producto {
  id: string;
  img: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  idVendedor?: string;
  vendedor?: string;
  contacto?: string;
}

const VerProductos: React.FC<{ idVendedor: string }> = ({ idVendedor }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);


  const categorias = [
    { value: 'electrónica', label: 'Electrónica' },
    { value: 'ropa', label: 'Ropa' },
    { value: 'hogar', label: 'Hogar' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'otro', label: 'Otro' }
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      const { success, productos } = await getProductosByVendedorId(idVendedor);
      console.log('Productos obtenidos:', productos);
      if (!success || !productos) return;
      setProductos(productos);
      setProductosFiltrados(productos);
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [selectedCategory, searchTerm, productos]);


  const aplicarFiltros = () => {
    let filtrados = [...productos];

    if (selectedCategory.length > 0) {
      filtrados = filtrados.filter(producto =>
        selectedCategory.includes(producto.categoria)
      );
    }

    if (searchTerm.trim() !== '') {
      filtrados = filtrados.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setProductosFiltrados(filtrados);
  };

  const handleProductoClick = (producto: Producto) => {
    console.log('Modal abierto:', true); // Agrega esta línea
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  return (
    <IonContent style={{ '--background': '#EEEEEE', position: 'relative' }}>

      <IonItem style={{ flex: 1, margin: 0, '--background': 'white', color: 'black' }}>
         <IonSearchbar
         style={{ '--background': 'white', color: 'black', margin: 10, }}
          value={searchTerm}
          placeholder="Buscar"
          // debounce={500}
          onIonInput={(e) => setSearchTerm(e.target.value ?? '')}
        />

        <IonSelect
          placeholder="Filtrar"
          multiple={true}
          interface="popover"
          value={selectedCategory}
          onIonChange={(e) => setSelectedCategory(e.detail.value)
          }

        >
          {categorias.map((cat) => (
            <IonSelectOption key={cat.value} value={cat.value}>
              {cat.label}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>



      <IonGrid>
        <IonRow>
          {productosFiltrados.map(producto => (
            <IonCol size="6" key={producto.id}>

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