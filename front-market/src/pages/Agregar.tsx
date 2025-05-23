import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Navbar from '../components/navbar/navbar';
import './Tab2.css';
import AgregarProducto from '../components/agregarProducto/agregarProducto';

const Agregar: React.FC = () => {
  return (
    <IonPage>
      <Navbar />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Agregar</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AgregarProducto />
      </IonContent>
    </IonPage>
  );
};

export default Agregar;
