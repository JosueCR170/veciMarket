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
import { collection, query, where, doc, getDocs, getDoc, serverTimestamp, writeBatch, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase/config/firebaseConfig';

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

  const API_BASE = 'http://10.0.2.2:3000';

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

    let chatId = "";

    const chatQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user?.uid)
    );

    const querySnapshot = await getDocs(chatQuery);

    const existingChat = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return (
        data.participants.includes(producto?.idVendedor) &&
        data.participants.includes(user?.uid)
      );
    });

    const batch = writeBatch(db);

    const message = "¡Saludos! Tengo interés en el producto: " + producto?.nombre + "-" + producto?.id;

    console.log("Existing chat", existingChat)

    let chatDocRef;

    if (!existingChat) {
      chatDocRef = doc(collection(db, 'chats')); 
      batch.set(chatDocRef, {
        lastMessage: message,
        lastTimestamp: serverTimestamp(),
        participants: [producto?.idVendedor, user?.uid]
      });
    } else {
      chatDocRef = doc(db, 'chats', existingChat.id);
      batch.update(chatDocRef, {
        lastMessage: message,
        lastTimestamp: serverTimestamp(),
        participants: arrayUnion(producto?.idVendedor, user?.uid)
      });
    }

    chatId = chatDocRef.id;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const newMessageRef = doc(messagesRef);

    batch.set(newMessageRef, {
      from: user?.uid,
      text: message,
      timestamp: serverTimestamp(),
      read: false
    });

    await batch.commit();

    const sessionDocRef = doc(db, "userSessions", producto?.idVendedor!);
    const sessionSnap = await getDoc(sessionDocRef);
    const existingDeviceToken = sessionSnap.exists() ? sessionSnap.data().deviceToken : null;

    if (existingDeviceToken) {
      try {
        const payload = {
          token: existingDeviceToken,
          title: `Nuevo mensaje de ${user?.email}`,
          body: message,
          data: { chatId, senderId: user?.uid },

        };

        const res = await fetch(`${API_BASE}/api/send-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const resData = await res.json();
        console.log(JSON.stringify(resData, null, 1));
      } catch (err: any) {
        console.error('Error al enviar la notificación: ' + err.message);
      }
      console.log("Enviando notificación push al usuario:", producto?.idVendedor);
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