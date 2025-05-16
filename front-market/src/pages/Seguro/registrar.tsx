import React from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../services/firebase/firebaseConfig';
import { doc,setDoc } from 'firebase/firestore';
import { IonToast } from "@ionic/react"; 


const Registrar: React.FC<{ onToggleForm: () => void }> = ({ onToggleForm }) => {
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showToast, setShowToast] = React.useState(false);

    async function registerUser(name:string, email: string, password: string, rol: string) {
       try {
          const infoUsuario = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(infoUsuario.user, {displayName: name});
            const docuRef = doc(db,`userRol/${infoUsuario.user.uid}` );
            await  setDoc(docuRef, { name: name, correo: email, rol: rol });
            console.log("data");
            
          }  catch (error: any) {
            let mensaje = "Ocurrió un error al registrar el usuario.";
            switch (error.code) {
              case "auth/email-already-in-use":
                mensaje = "El correo ya está registrado.";
                break;
              case "auth/invalid-email":
                mensaje = "El correo no es válido.";
                break;
              case "auth/weak-password":
                mensaje = "La contraseña debe tener al menos 6 caracteres.";
                break;
              default:
                mensaje = "Error desconocido: " + error.message;
            }
            setErrorMessage(mensaje);
            setShowToast(true);
          }
    }
     function sumitHandler(event: React.FormEvent) {
       event.preventDefault();
        const form = event.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const rol = (form.elements.namedItem('rol') as HTMLInputElement).value;
        console.log(email, password, rol);
        registerUser(name, email, password, rol).then(() => {
            console.log("Usuario registrado");
        }).catch((error) => {
            console.error("Error al registrar el usuario:", error);
        });
     }

    return (  <div className="login-access">
      <form  onSubmit={sumitHandler}>
      <div className="titulo-login">
            <h1>
            Vec<span style={{color: "#A8C7FF"}}>i</span>Mark<span style={{color: "#A8C7FF"}}>e</span>t Lite
            </h1>
            </div>
    <div  className='input-registrar'>
        <label className='titulos-input'>Nombre de usuario</label>
        <IonItem>
        <IonInput name="name" required></IonInput>
        </IonItem>
    </div>
    <div  className='input-registrar'>
    <label className='titulos-input'>Correo electronico</label>
        <IonItem>
    <IonInput
      type="email"
      name="email"
      required
    ></IonInput>
  </IonItem>
    </div>
    
  <div  className='input-registrar'>
  <label className='titulos-input'>Contraseña</label>
    <IonItem>
    <IonInput
      type="password"
      name="password"
      required
    ></IonInput>
  </IonItem>  
</div>
 
  <div  className='input-registrar'>
   <IonItem>
     <IonSelect aria-label="rol" name='rol' placeholder="Tipo de cuenta" required>
          <IonSelectOption value="usuario">Usuario</IonSelectOption>
          <IonSelectOption value="ejecutiva">Ejecutiva</IonSelectOption>
    </IonSelect>
  </IonItem>     
        </div>
  
        <div className="login-button">
          <IonButton expand='block' type='submit' 
          style={{
          '--padding-top': '13px',
          '--padding-bottom': '10px',
          '--padding-start': '10px',
          '--padding-end': '10px'
          }}>
            Register
          </IonButton>
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <IonText color="white">
            ¿Ya tienes una cuenta?{" "}
            <span
               className="register-link"
              onClick={onToggleForm}
            >
              Inicia sesión
            </span>
          </IonText>
        </div>

      </form>
      <IonToast
        position="top"
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={errorMessage}
        duration={3000}
        color="warning"
      />
    </div>
);
}
export default Registrar;