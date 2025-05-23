import React, { useRef, useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, SelectCustomEvent } from '@ionic/react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../services/firebase/config/firebaseConfig';
import { doc,setDoc } from 'firebase/firestore';
import { IonToast } from "@ionic/react"; 


const Registrar: React.FC<{ onToggleForm: () => void }> = ({ onToggleForm }) => {
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showToast, setShowToast] = React.useState(false);
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean | undefined>();

   const rolSeleccionado = useRef<HTMLIonSelectElement>(null);

  const validateSelect = (event: SelectCustomEvent<{ value: string }>) => {
    setIsValid(event.detail.value ? true : false);
  };

  const markTouched = () => {
    setIsTouched(true);
  };

  const onIonBlur = () => {
    markTouched();

    if (rolSeleccionado.current) {
      validateSelect({
        detail: { value: rolSeleccionado.current.value },
      } as SelectCustomEvent<{ value: string }>);
    }
  };
    
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
       markTouched();
      
       
    if (rolSeleccionado.current) {
      const rolValue = rolSeleccionado.current.value;
      validateSelect({ detail: { value: rolValue } } as SelectCustomEvent<{ value: string }>);

      if (!rolValue) {
        setErrorMessage("Debe seleccionar un tipo de cuenta.");
        setShowToast(true);
        return;
      }
       
       
        const form = event.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
     
        console.log(email, password, rolValue);
        registerUser(name, email, password, rolValue).then(() => {
            console.log("Usuario registrado");
        }).catch((error) => {
            console.error("Error al registrar el usuario:", error);
        });
     }
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
        <IonInput className='inputColor' name="name" required></IonInput>
        </IonItem>
    </div>
    <div  className='input-registrar'>
    <label className='titulos-input'>Correo electrónico</label>
        <IonItem>
    <IonInput className='inputColor'
      type="email"
      name="email"
      required
    ></IonInput>
  </IonItem>
    </div>
    
  <div  className='input-registrar'>
  <label className='titulos-input'>Contraseña</label>
    <IonItem>
    <IonInput className='inputColor'
      type="password"
      name="password"
      required
    ></IonInput>
  </IonItem>  
</div>
 
  <div  className='input-registrar'>
   <IonItem>
     <IonSelect  
      ref={rolSeleccionado} 
     
     name='rol'
      placeholder="Tipo de cuenta"
     className={`inputColor ${isValid ? 'ion-valid' : ''} ${isValid === false ? 'ion-invalid' : ''} 
     ${isTouched ? 'ion-touched' : ''}`}
     errorText="Seleccion requerida"
     onIonChange={(event) => validateSelect(event)}
    onIonBlur={onIonBlur}
     > 
          <IonSelectOption value="usuario">Usuario</IonSelectOption>
          <IonSelectOption value="ejecutivo">Ejecutivo</IonSelectOption>
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
            Registrarse
          </IonButton>
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <span style={{color:"white"}}>
            ¿Ya tienes una cuenta?{" "}
            <span
               className="register-link"
              onClick={onToggleForm}
            >
              Inicia sesión
            </span>
          </span>
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