import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect } from 'react';
import Navbar from '../components/navbar/navbar';
import MapaComercios from '../components/mapa/mapa';
import Mapa from '../components/mapa/mapaBase';
import './Tab2.css';

// useEffect(() => {
//   // const fetchLocation = async () => {
//   //   await getCurrentPosition(); // Esto se ejecuta una sola vez
//   // };

//   // fetchLocation();
// }, []);

import AgregarProducto from '../components/agregarProducto/agregarProducto';

const Agregar: React.FC = () => {
  return (
    <IonPage>
        <Mapa />
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
