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
} from '@ionic/react';
import { callOutline, personCircleOutline, arrowBackOutline } from 'ionicons/icons';
import './productoModal.css';
import { getUser } from '../../services/firebase/userService';
import { ReactNode, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../context/contextUsuario';
import { collection, query, where, doc, getDocs, serverTimestamp, writeBatch, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase/config/firebaseConfig';
import { detectPresence, sendPushNotification } from '../../services/firebase/chatService';

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

  const { user } = useAuth();
  const history = useHistory();

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

  const contactSeller = async () => {
    const chatQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user?.uid)
    );

    const querySnapshot = await getDocs(chatQuery);

    // Verificamos si ya existe un chat con este producto y usuario
    const existingChat = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return (
        data.participants.includes(producto?.idVendedor) &&
        data.participants.includes(user?.uid)
      );
    });

    const batch = writeBatch(db);

    const message = "¡Saludos! Tengo interés en el producto: " + producto?.nombre + "-" + producto?.id;

    let chatDocRef;

    if (!existingChat) {
      // Crear nuevo chat
      chatDocRef = doc(collection(db, 'chats')); // genera nuevo ID
      batch.set(chatDocRef, {
        lastMessage: message,
        lastTimestamp: serverTimestamp(),
        participants: [producto?.idVendedor, user?.uid]
      });
    } else {
      // Actualizar chat existente
      chatDocRef = doc(db, 'chats', existingChat.id);
      batch.update(chatDocRef, {
        lastMessage: message,
        lastTimestamp: serverTimestamp(),
        // Usar arrayUnion para evitar duplicados por seguridad
        participants: arrayUnion(producto?.idVendedor, user?.uid)
      });
    }

    const chatId = chatDocRef.id;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const newMessageRef = doc(messagesRef); // genera un id automáticamente

    // Prepara el nuevo mensaje
    batch.set(newMessageRef, {
      from: user?.uid,
      text: message,
      timestamp: serverTimestamp(),
      read: false
    });

    await batch.commit();

    const shouldNotify = await detectPresence(chatId, producto?.idVendedor!);
    if (shouldNotify) {
      await sendPushNotification(producto?.idVendedor!, chatId, message, user?.email!, user?.uid!);
    }

    history.replace("/chat");
  }

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
            <IonText className="textInfo"><strong>Precio: </strong>₡{producto.precio}</IonText>
            <IonText className="textInfo"> <strong>Categoría: </strong> {producto.categoria} </IonText>
            <IonText className="textInfo"> <strong>Descripción: </strong> {producto.descripcion} </IonText>
            {vendedorCorreo && (
              <IonText className="textInfo"> <IonIcon icon={callOutline} /> <strong>Contacto:</strong> {vendedorCorreo} </IonText>
            )}
            <IonButton onClick={contactSeller}>
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