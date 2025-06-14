import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Navbar from '../components/navbar/navbar';

import MapaComercios from '../components/mapa/mapaVerComercios';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage >
      <Navbar/>

      <MapaComercios />

    </IonPage>
  );
};

export default Home;
