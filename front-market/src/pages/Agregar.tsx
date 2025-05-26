import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Navbar from '../components/navbar/navbar';
import './Tab2.css';
import MapaComercios from '../components/mapa/mapa';
import { useEffect } from 'react';
import Mapa from '../components/mapa/mapaBase';

// useEffect(() => {
//   // const fetchLocation = async () => {
//   //   await getCurrentPosition(); // Esto se ejecuta una sola vez
//   // };

//   // fetchLocation();
// }, []);

const Agregar: React.FC = () => {
  return (
    <IonPage>
      
        <Mapa />
     
    </IonPage>
  );
};

export default Agregar;
