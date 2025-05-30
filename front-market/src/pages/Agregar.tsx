import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
// import { useEffect } from 'react';
import Navbar from '../components/navbar/navbar';
// import MapaComercios from '../components/mapa/mapa';
import MapaLocal from '../components/mapa/mapaBase';
import './Tab2.css';

import AgregarProducto from '../components/agregarProducto/agregarProducto';

const Agregar: React.FC = () => {
  return (
    <IonPage>
      <Navbar />
      {/* <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Agregar</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <MapaComercios /> */}
      {/*</IonContent> */}
        <MapaLocal />
        {/* <AgregarProducto /> */}
        {/* <MapaPruebas /> */}
    </IonPage>
  );
};

export default Agregar;
