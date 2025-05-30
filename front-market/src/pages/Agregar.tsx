import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonText } from '@ionic/react';
import Navbar from '../components/navbar/navbar';
import MapaLocal from '../components/mapa/mapaBase';
import AgregarProducto from '../components/agregarProducto/agregarProducto';
import { useLocationContext } from '../context/contextLocation';
import './Tab2.css';
import Map from '../components/mapa/mapaCambiarLocalizacion';


const Agregar: React.FC = () => {
    const { location, loading } = useLocationContext();

  return (
    <IonPage>
      <Navbar />

        {/* <MapaLocal /> */}
<Map />

        {/* {!loading && location ? (
        <AgregarProducto />
      ) : (
        <IonCard color="warning">
          <IonCardContent>
            <IonText>
              ⚠️ Para poder añadir productos, primero debes registrar tu localización.
            </IonText>
          </IonCardContent>
        </IonCard>
      )} */}

        {/* <MapaComercios /> */}
        {/* <AgregarProducto /> */}
        {/* <MapaPruebas /> */}
    </IonPage>
  );
};

export default Agregar;
