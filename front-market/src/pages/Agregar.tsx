import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Navbar from '../components/elemtos de una pagina/navbar';
import './Tab2.css';

const Agregar: React.FC = () => {
  return (
    <IonPage>
      <Navbar/>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Agregar</IonTitle>
          </IonToolbar>
        </IonHeader>
     
      </IonContent>
    </IonPage>
  );
};

export default Agregar;
