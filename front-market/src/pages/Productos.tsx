import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Navbar from '../components/navbar/navbar';

// import VerProductos from '../components/verProductos/verProductos';


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
        {/* <VerProductos /> */}
      </IonContent>
    </IonPage>
  );
};

export default Productos;
