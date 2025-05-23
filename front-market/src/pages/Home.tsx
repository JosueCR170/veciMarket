import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Navbar from '../components/navbar/navbar';

import MapaComercios from '../components/mapa/mapa';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage >
      <Navbar/>
        {/*<IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />*/}
      <MapaComercios />

    </IonPage>
  );
};

export default Home;
