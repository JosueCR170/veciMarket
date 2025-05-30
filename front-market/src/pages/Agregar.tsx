import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonText, IonSpinner } from '@ionic/react';
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
 {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <IonSpinner name="crescent" />
          </div>
        ) : location ? (
          <AgregarProducto />
        ) : (
          <>
            <Map />
            <IonCard color="warning" style={{ margin: 16 }}>
              <IonCardContent>
                <IonText>
                  ⚠️ Para poder añadir productos, primero debes registrar tu localización.
                </IonText>
              </IonCardContent>
            </IonCard>
          </>
        )}
    </IonPage>
  );
};

export default Agregar;
