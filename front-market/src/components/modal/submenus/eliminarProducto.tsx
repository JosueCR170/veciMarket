import React, { useState, useEffect, ReactNode } from 'react';
import { IonGrid, IonRow, IonCol, IonContent, IonItem, IonSelect, IonSelectOption, IonSearchbar } from '@ionic/react';
import { getProductosByVendedorId } from '../../../services/firebase/productService';
import { useAuth } from '../../../context/contextUsuario';
import { SubmodalHeader } from './submodalHeader';
import CardProducto from '../../cardProducto/cardProducto';
import ProductoAdminModal from '../../productoModal/productoAdminModal';

interface Producto {
    contacto: ReactNode;
    id: string;
    img: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    idVendedor?: string;
}

export const EliminarProducto = ({ onClose }: { onClose: () => void }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const { user } = useAuth();


    const categorias = [
        { value: 'electrónica', label: 'Electrónica' },
        { value: 'ropa', label: 'Ropa' },
        { value: 'hogar', label: 'Hogar' },
        { value: 'alimentos', label: 'Alimentos' },
        { value: 'otro', label: 'Otro' }
    ];

    useEffect(() => {
        fetchProductos();
    }, [user?.uid]);

    const fetchProductos = async () => {
        const { success, productos } = await getProductosByVendedorId(user?.uid!);
        if (!success || !productos) return;
        const productosConContacto = productos.map((producto: any) => ({
            ...producto,
            contacto: producto.contacto ?? null,
        }));
        setProductos(productosConContacto);
        setProductosFiltrados(productosConContacto);
    };

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
        console.log('Modal abierto:', true);
        setProductoSeleccionado(producto);
        setModalAbierto(true);
    };

    return (
        <>
            <SubmodalHeader titulo="Tus productos" onClose={onClose} />

            <IonContent style={{ '--background': '#EEEEEE' }}>

                <IonItem style={{ flex: 1, margin: 0, '--background': 'white', color: 'black' }}>
                    <IonSearchbar
                        style={{ '--background': 'white', color: 'black', margin: 10, '--padding-start': '0px' }}
                        value={searchTerm}
                        placeholder="Buscar"
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

                <div className="productos-container">
                    <IonGrid>
                        <IonRow className="productos-row">
                            {productosFiltrados.map(producto => (
                                <IonCol size="6" key={producto.id}>

                                    <CardProducto producto={producto} onClick={handleProductoClick} />

                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                </div>
                <ProductoAdminModal
                    isOpen={modalAbierto}
                    producto={productoSeleccionado}
                    onClose={() => setModalAbierto(false)}
                    onDelete={() => {
                        setModalAbierto(false);  // Cierra el modal
                        fetchProductos();
                    }}
                />
            </IonContent>
        </>
    );
};