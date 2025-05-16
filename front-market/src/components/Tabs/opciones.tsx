import {  IonLabel,IonTabBar, IonTabButton, IonTabs,  IonIcon, } from "@ionic/react";
import { ellipse, square, triangle,logOut } from 'ionicons/icons';
import "./opciones.css"

export const ButonNavegation = () => {

    return (
    <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home"> 
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="agregar" href="/agregar">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Agregar</IonLabel> 
          </IonTabButton>

        <IonTabButton tab="chat" href="/chat">
          <IonIcon aria-hidden="true" icon={square} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>

       <IonTabButton tab="perfil" href="/perfil">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Perfil</IonLabel> 
          </IonTabButton>
          {/*<IonTabButton tab="logout-action1" className="papaOut" style={{paddin:"0px"}}>
            <LogoutButton/>
          </IonTabButton>*/}
         
    </IonTabBar>
    );
}