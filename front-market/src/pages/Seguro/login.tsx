import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "./login.css"
import { useState } from "react";
import LoginNormal from "../../components/tipo de logueo/loginNormal";
import Registrar from "./registrar";
import { StatusBar, Style } from '@capacitor/status-bar';
export const Login = () => {
    const [showRegister, setShowRegister] = useState(false);
    const toggleForm = () =>{ 
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setShowRegister(prev => !prev);}
      return (
        <IonPage>
          <IonContent fullscreen>
            <div className="login-container">
            <div className="login-access">
             <div className="nube"></div>
             <div className="nube2"></div>
             <div className="nube3"></div>
             <div className="nube4"></div>
              {showRegister ? 
                <Registrar onToggleForm={toggleForm} />: 
                <LoginNormal onToggleForm={toggleForm} />
              }
                 </div>
            </div>
          </IonContent>
        </IonPage>
      );
    }
