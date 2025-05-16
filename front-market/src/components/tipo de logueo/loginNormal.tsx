import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonInput, IonButton, IonItem, IonLabel, IonText, IonLoading, IonIcon, IonInputPasswordToggle } from "@ionic/react";
import { personOutline,lockClosedOutline } from 'ionicons/icons';
import { auth, authReady } from "../../services/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginNormal: React.FC<{ onToggleForm: () => void }> = ({ onToggleForm }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();
    
    const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();
        setLoading(true);
        setError(null);
        try {
          await authReady;
          await signInWithEmailAndPassword(auth, email, password).then(() => {
            setLoading(false);
            history.replace("/home");
          });
        } catch (error: any) {
          setLoading(false);
          setError(error.message);
        }
    }
    if (loading) {
        return <IonLoading isOpen message='Cargando sesión...' />;
      }
    
    return (
       
          <form onSubmit={handleLogin}>
            <div className="titulo-login">
            <h1>
            Vec<span style={{color: "#A8C7FF"}}>i</span>Mark<span style={{color: "#A8C7FF"}}>e</span>t Lite
            </h1>
            </div>
        <IonItem style={{ '--ion-safe-area-right': '0',}}>
          <IonIcon aria-hidden="true" icon={personOutline} />
          <IonInput type='email' value={email} onIonChange={(e) => setEmail(e.detail.value!)} required />
        </IonItem>
        <IonItem style={{ '--ion-safe-area-right': '0',}}>
          <IonIcon aria-hidden="true" icon={lockClosedOutline}/>
          <IonInput type='password' value={password} onIonChange={(e) => setPassword(e.detail.value!)} required >
            <IonInputPasswordToggle slot="end"  className="toggle-password-icon"  ></IonInputPasswordToggle>
          </IonInput>
        </IonItem>
        {error && (
          <IonText color='danger'>
            <p>Error in password or email</p>
          </IonText>
        )}
        <div  className="login-button">
        <IonButton expand='block' type='submit'   style={{
          '--padding-top': '13px',
          '--padding-bottom': '10px',
          '--padding-start': '10px',
          '--padding-end': '10px'
        }} >
          Inicio de sesion
        </IonButton>
        {/*<GoogleSignIn/>*/}
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem"}}>
          <IonText color="white">
            ¿No tienes una cuenta?{" "}
            <span
            className="register-link"
            onClick={onToggleForm}
            >
              Regístrate aquí
            </span>
          </IonText>
        </div>
         </form>
     
    );
}

export default LoginNormal;