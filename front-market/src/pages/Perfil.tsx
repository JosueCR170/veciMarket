import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import { LogoutButton }  from "../components/tipo de logueo/logOut";
import './Tab3.css';

const Perfil: React.FC = () => {
  return (
    <IonPage>
       <IonHeader>
        <IonToolbar className="custom-header">
          <IonTitle className="custom-title">
            Vec<span style={{ color: "#A8C7FF" }}>i</span>Mark<span style={{ color: "#A8C7FF" }}>e</span>t Lite
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
   
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
