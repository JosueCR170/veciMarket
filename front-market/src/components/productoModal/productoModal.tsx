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
} from '@ionic/react';
import { callOutline, personCircleOutline, arrowBackOutline } from 'ionicons/icons';
import './productoModal.css';

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

interface ProductoModalProps {
  isOpen: boolean;
  producto: Producto | null;
  onClose: () => void;
}

const ProductoModal: React.FC<ProductoModalProps> = ({ isOpen, producto, onClose }) => {
  // console.log('ProductoModal renderizado', { isOpen, producto });
  if (!producto) return null;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="modal-sidebar">
      <IonHeader>
        <IonToolbar>
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
        <IonCard>
          <IonImg src={producto.img} alt={producto.nombre} />
          <IonCardContent className="product-details-content">
            <IonCardHeader>
              <IonCardTitle>{producto.nombre}</IonCardTitle>
              <IonCardSubtitle>
                <IonText color="medium">
                  {producto.categoria} - ${producto.precio}
                </IonText>
              </IonCardSubtitle>
            </IonCardHeader>

            <div className="product-details">
              <p><strong>Descripción:</strong></p>
              <p>{producto.descripcion}</p>

              {producto.vendedor && (
                <p>
                  <IonIcon icon={personCircleOutline} /> <strong>Vendedor:</strong> {producto.vendedor}
                </p>
              )}
              {producto.contacto && (
                <p>
                  <IonIcon icon={callOutline} /> <strong>Contacto:</strong> {producto.contacto}
                </p>
              )}
            </div>
            
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>

  );
};

export default ProductoModal;