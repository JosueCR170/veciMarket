import React, { useState, useCallback, useEffect } from 'react';
import {
  IonIcon,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonAlert,
  IonModal,
  IonSpinner,
  IonButtons,
  IonFooter,
} from '@ionic/react';
import {
  pencilSharp,
  imageOutline,
  camera,
  cloudUploadOutline,
  refreshOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config/firebaseConfig'; // tu instancia de Firestore
import { useAuth } from '../../context/contextUsuario';

const CapturaFotoPage: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: '', header: '', buttons: ['OK'] });
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [loadingFoto, setLoadingFoto] = useState(true);
  const { user, rol } = useAuth();

  const showAlert = useCallback((header: string, message: string, buttons = ['OK']) => {
    setAlertInfo({ isOpen: true, header, message, buttons });
  }, []);

  useEffect(() => {
    const fetchFotoPerfil = async () => {
      setLoadingFoto(true);
      setIsPreview(false);
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'userRol', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.fotoPerfil) {
              const img = new Image();
              img.onload = () => {
                setPhotoPreview(data.fotoPerfil);
                setOriginalPhotoUrl(data.fotoPerfil);
                setLoadingFoto(false);
              };
              img.onerror = () => {
                showAlert('Error', 'No se pudo cargar la imagen.');
                setLoadingFoto(false);
              };
              img.src = data.fotoPerfil;
            } else {
              setLoadingFoto(false);
            }
          }
        } catch (error) {
          console.error('Error al obtener la foto de perfil:', error);
          showAlert('Error', 'No se pudo cargar la foto de perfil.');
          setLoadingFoto(false);
        }
      }
    };

    fetchFotoPerfil();
  }, [user?.uid, showAlert]);


const handlePhoto = async (source: CameraSource) => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source,
        quality: 90,
      });
      setPhotoPreview(photo.dataUrl!);
      setIsPreview(true);
    } catch (err) {
      console.error(err);
      showAlert('Error', 'No se pudo obtener la imagen.');
    }
    setModalVisible(false);
  };

 const handleUpload = async () => {
    if (!photoPreview || !user?.uid) return;

    setIsUploading(true);

    try {
      const storageRef = ref(getStorage(), `usuarios/${user.uid}/perfil.jpg`);
      await uploadString(storageRef, photoPreview, 'data_url');
      const url = await getDownloadURL(storageRef);

      // Actualizar Firestore
      const userDocRef = doc(db, 'userRol', user.uid);
      await updateDoc(userDocRef, { fotoPerfil: url });

      showAlert('Éxito', 'La foto se ha subido correctamente.');
      setPhotoPreview(url);
      setOriginalPhotoUrl(url);
      setIsPreview(false);
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Ocurrió un problema al subir la foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (originalPhotoUrl) {
      setPhotoPreview(originalPhotoUrl); // Restaurar la original
      setIsPreview(false);
    }
  };

  return (
    <div className="captura-foto-container">
      {/* Imagen o Spinner */}
      <div className='foto-container'
        onClick={() => !loadingFoto && setModalVisible(true)}>
        {loadingFoto ? (
          <IonSpinner name="dots" color="primary" />
        ) : photoPreview ? (
          <IonImg src={photoPreview} className='foto-preview'
            onIonError={() => { showAlert('Error de Previsualización', 'No se pudo mostrar la imagen.'); setPhotoPreview(null);}}
          />
        ) : (
          <IonIcon icon={imageOutline} style={{ fontSize: '64px', color: 'var(--ion-color-medium)' }} />
        )}
      </div>
   
      {/* Card de Usuario */}
      <IonCard style={{ width: '100%', minWidth: '200px', background: 'white', borderRadius: '10px', padding: '10px' }}>
        <IonCardHeader>
          <IonCardTitle>{user?.displayName}</IonCardTitle>
          <IonCardSubtitle>{user?.email}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <p>{rol}</p>
        </IonCardContent>
      </IonCard>

      {photoPreview && isPreview && (
  <IonFooter
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'white',
      padding: '1rem 0',
      borderTop: '1px solid var(--ion-color-step-150, #e0e0e0)',
      zIndex: 1000,
    }}
  >
    <IonButtons
      style={{ display: 'flex', justifyContent: 'center', gap: '1rem'}}>
      <IonButton
       
        onClick={handleCancel}
        disabled={isUploading}
        className='botones-footer-cancelar'
      >
        <IonIcon slot="start" icon={refreshOutline} />
        Cancelar
      </IonButton>
      <IonButton
      
        onClick={handleUpload}
        disabled={isUploading}
        className='botones-footer-subir'
      >
        <IonIcon slot="start" icon={cloudUploadOutline} />
        Subir
      </IonButton>
    </IonButtons>
  </IonFooter>
)}

      {/* Indicador de subida */}
      {isUploading && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <IonSpinner name="crescent" color="primary" />
          <p>Subiendo...</p>
        </div>
      )}

      {/* Modal para seleccionar origen */}
      <IonModal isOpen={modalVisible} onDidDismiss={() => setModalVisible(false)} initialBreakpoint={0.50} breakpoints={[0, 0.25, 0.5, 0.75]}
      >
        <div style={{ padding: '2rem', textAlign: 'center', background: '#eeee', color: '#000000', height: '-webkit-fill-available'}}>
          <h2 style={{fontFamily: 'Poppi, sans-serif'}}>Seleccionar Imagen</h2>
          <IonButton className="botones-modal"  style={{fontFamily: 'zain, sans-serif'}} expand="block" onClick={() => handlePhoto(CameraSource.Camera)}>
            Tomar Foto
          </IonButton>
          <IonButton className="botones-modal" expand="block" onClick={() => handlePhoto(CameraSource.Photos)} style={{ marginTop: '1rem' }}>
            Elegir de Galería
          </IonButton>
        </div>
      </IonModal>

      {/* Alertas */}
      <IonAlert
        isOpen={alertInfo.isOpen}
        header={alertInfo.header}
        message={alertInfo.message}
        buttons={alertInfo.buttons}
        onDidDismiss={() => setAlertInfo({ isOpen: false, message: '', header: '', buttons: ['OK'] })}
      />
    </div>
  );
};

export default CapturaFotoPage;
