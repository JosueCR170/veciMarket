import { IonLabel, IonTabBar, IonTabButton, IonTabs, IonIcon, } from "@ionic/react";
import { personCircle, chatbox, storefront, addCircle, mapOutline } from 'ionicons/icons';
import "./opciones.css"
import { useAuth } from "../../context/contextUsuario";

export const ButonNavegation = () => {
  const {rol} = useAuth()

  return (
    <IonTabBar slot="bottom" className="tabsMenu">
      <IonTabButton tab="home" href="/home">
        <IonIcon aria-hidden="true" className="iconTabs" icon={storefront} />
      </IonTabButton>

      {rol==="ejecutivo" &&(
      <IonTabButton tab="agregar" href="/agregar">
        <IonIcon className="iconTabs" aria-hidden="true" icon={addCircle} />
      </IonTabButton>

      )}

      <IonTabButton tab="chat" href="/chat">
        <IonIcon className="iconTabs" aria-hidden="true" icon={chatbox} />

      </IonTabButton>

      <IonTabButton tab="perfil" href="/perfil">
        <IonIcon className="iconTabs" aria-hidden="true" icon={personCircle} />
      </IonTabButton>


      {/* <IonTabButton tab="productos" href="/productos">
        <IonIcon className="iconTabs" aria-hidden="true" icon={personCircle} />
      </IonTabButton> */}


    </IonTabBar>
  );
}