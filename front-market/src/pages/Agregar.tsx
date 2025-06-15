import { IonPage } from '@ionic/react';
import Navbar from '../components/navbar/navbar';
import AgregarProducto from '../components/agregarProducto/agregarProducto';
import { useLocationContext } from '../context/contextLocation';
import './Tab2.css';
import Map from '../components/mapa/mapaCambiarLocalizacion';


const Agregar: React.FC = () => {
  const { location } = useLocationContext();
   return (
    <IonPage>
      <Navbar />
      {location ? <AgregarProducto /> : <Map />}
    </IonPage>
  );
};

export default Agregar;
