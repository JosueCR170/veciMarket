import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import MapaComercios from '../components/mapa/mapa';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage >
      <IonHeader >
        <IonToolbar className="custom-header">
          <IonTitle className="custom-title">
             Vec<span style={{color: "#A8C7FF"}}>i</span>Mark<span style={{color: "#A8C7FF"}}>e</span>t Lite
          </IonTitle>
        </IonToolbar>
      </IonHeader>
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
