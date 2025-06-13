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
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { callOutline, personCircleOutline, arrowBackOutline, locationOutline } from 'ionicons/icons';
import './productoModal.css';
import { getUser } from '../../services/firebase/userService';
import { ReactNode, useEffect, useState } from 'react';

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
}

const ProductoModal: React.FC<ProductoModalProps> = ({ isOpen, producto, onClose }) => {
  const [vendedorCorreo, setVendedorCorreo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendedorInfo = async () => {
      if (producto?.idVendedor) {
        const userData = await getUser(producto.idVendedor);
        if (userData && userData.correo) {
          setVendedorCorreo(userData.correo);
        }
      }
    };

    fetchVendedorInfo();
  }, [producto]);

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
          <IonImg src={producto.img} alt={producto.nombre} />
          <IonCardContent className="product-details-content">
            <IonCardTitle style={{ color: '#000' }}>{producto.nombre}</IonCardTitle>
            <IonText>
              <strong>Precio: </strong> ₡{producto.precio}
            </IonText>
            <IonText>
              <strong>Categoría: </strong> {producto.categoria}
            </IonText>
            <IonText>
              <strong>Descripción: </strong> {producto.descripcion}
            </IonText>
            {vendedorCorreo && (
              <IonText>
                <IonIcon icon={callOutline} /> <strong>Contacto:</strong> {vendedorCorreo}
              </IonText>
            )}

            <IonButton>
              <IonIcon icon={personCircleOutline} />
              <strong>Vendedor</strong>
            </IonButton>
            
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default ProductoModal;