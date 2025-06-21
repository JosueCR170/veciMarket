import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonText,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonIcon,
    IonButton,
    IonAlert,
} from '@ionic/react';
import { arrowBackOutline, trashOutline } from 'ionicons/icons';
import { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '../../context/contextUsuario';
import { getUser } from '../../services/firebase/userService';
import { deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '../../services/firebase/config/firebaseConfig';
import './productoModal.css';

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

interface ProductoModalProps {
    isOpen: boolean;
    producto: Producto | null;
    onClose: () => void;
    onDelete: () => void;
}

const ProductoAdminModal: React.FC<ProductoModalProps> = ({ isOpen, producto, onClose, onDelete }) => {
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const deleteProduct = async () => {
        if (!producto) return;

        try {
            await deleteDoc(doc(db, 'productos', producto.id));

            const storage = getStorage();
            const imageRef = ref(storage, `productos/${extractFileName(producto.img)}`);
            await deleteObject(imageRef);

            onClose();
            onDelete();
        } catch (error) {
            console.error('Error al eliminar producto o imagen:', error);
        }
    };

    const extractFileName = (url: string): string => {
        const decodedUrl = decodeURIComponent(url);
        const parts = decodedUrl.split('/');
        const nameWithToken = parts[parts.length - 1];
        return nameWithToken.split('?')[0];
    };

    if (!producto) return null;

    return (

        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="modal-sidebar">
            <IonHeader>
                <IonToolbar style={{ '--background': '#f8f8f8', color: '#000' }}>
                    <IonIcon
                        slot="start"
                        icon={arrowBackOutline}
                        className="modal-back-arrow"
                        onClick={onClose}
                    />
                    <IonTitle>Detalle del Producto</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="modal-product-content">
                <IonCard className="modal-product-card">
                    <IonImg className="modal-product-image" src={producto.img} alt={producto.nombre} />
                    <IonCardContent className="product-details-content">
                        <IonCardTitle style={{ color: '#000' }}>{producto.nombre}</IonCardTitle>
                        <IonText className="textInfo"><strong>Id:</strong> {producto.id}</IonText>
                        <IonText className="textInfo"><strong>Precio:</strong> ₡{producto.precio}</IonText>
                        <IonText className="textInfo"><strong>Categoría:</strong> {producto.categoria}</IonText>
                        <IonText className="textInfo"><strong>Descripción:</strong> {producto.descripcion}</IonText>
                        <IonButton onClick={() => setMostrarAlerta(true)} className="button-Contact">
                            <IonIcon icon={trashOutline} />
                            <strong className="text-Contact">Eliminar</strong>
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </IonContent>
            <IonAlert
                isOpen={mostrarAlerta}
                onDidDismiss={() => setMostrarAlerta(false)}
                header="¿Eliminar producto?"
                message="Esta acción no se puede deshacer. ¿Estás seguro?"
                buttons={[
                    {
                        text: 'Cancelar',
                        role: 'cancel',
                        handler: () => setMostrarAlerta(false),
                    },
                    {
                        text: 'Eliminar',
                        role: 'destructive',
                        handler: () => deleteProduct(),
                    },
                ]}
            />
        </IonModal>
    );
};

export default ProductoAdminModal;
