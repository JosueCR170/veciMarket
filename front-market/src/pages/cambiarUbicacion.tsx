import { IonPage } from '@ionic/react';
import Navbar from '../components/navbar/navbar';
import Map from '../components/mapa/mapaCambiarLocalizacion';
import { SubmodalHeader } from '../components/modal/submenus/submodalHeader';
import { useHistory } from "react-router";

export const CambiarUbicacion: React.FC = () => {
  const history = useHistory();

  const onClose = () => {
    history.goBack();
  };

  return (
    <IonPage>
      {/* <Navbar/> */}
       <SubmodalHeader titulo="Cambiar ubicación" onClose={onClose} />
      <Map />

    </IonPage>
  );
};

