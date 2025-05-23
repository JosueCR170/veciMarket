import {
  IonButton, IonButtons, IonContent, IonHeader, IonIcon,
  IonModal, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { menu } from 'ionicons/icons';
import { useState } from 'react';
import ModalContent from '../components/elemtos de una pagina/ModalContent'; // Ajusta la ruta
import { createAnimation } from '@ionic/react';
import { LogoutButton }  from "../components/tipo de logueo/logOut";
import CapturaFotoPage from '../components/camara/fotoUser';
import './perfil.css';

const Perfil: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

   return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonTitle className="custom-title">
            Vec<span style={{ color: "#A8C7FF" }}>i</span>Mark<span style={{ color: "#A8C7FF" }}>e</span>t Lite
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={(e) => {
                       (e.currentTarget as unknown as HTMLButtonElement).blur();
                       setShowModal(true);}} 
                       className="custom-button">
              <IonIcon icon={menu} style={{ fontSize: '28px' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      
      </IonContent> 
      <ModalContent isOpen={showModal} onClose={() => setShowModal(false)} />
    </IonPage>
  );
};

export default Perfil;
