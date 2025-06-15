import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Navbar from '../components/navbar/navbar';

const Productos: React.FC = () => {
  return (
    <IonPage>
      <Navbar />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Productos</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Productos;
