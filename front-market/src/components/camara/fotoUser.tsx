import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  IonIcon,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import {
  pencilSharp,
  imageOutline,
  colorFill,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../../context/contextUsuario'
import { app, storage, model } from '../../services/firebase/config/firebaseConfig'; // Importa el modelo de Vertex AI
// NUEVO: Imports para Filesystem
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

interface AlertInfo {
  isOpen: boolean;
  header?: string;
  message: string;
  buttons?: Array<string | { text: string; handler?: () => void; role?: string; cssClass?: string }>;
}
const CapturaFotoPage: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({ isOpen: false, message: '' }); 
     const {user, rol, loading}= useAuth();
      const showAlert = useCallback((header: string, message: string, buttons: AlertInfo['buttons'] = ['OK']) => {
    setAlertInfo({ isOpen: true, header, message, buttons });
  }, []);

  return (
    <div className="captura-foto-container">
         <div
          style={{
            position: 'relative', // ✅ importante
    marginBottom: '1rem',
    border: '1px dashed var(--ion-color-medium)',
    minHeight: '160px',
    width: '160px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'white',
    borderRadius: '94px',
   
          }}
        >
          {photoPreview ? (
            <IonImg
              src={photoPreview}
              style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
              onIonError={(e) => {
                console.error('Error al cargar previsualización:', e);
                showAlert('Error de Previsualización', 'No se pudo mostrar la imagen.');
                setPhotoPreview(null);
              }}
            />
          ) : (
            <IonIcon icon={imageOutline} style={{ fontSize: '64px', color: 'var(--ion-color-medium)' }} />
          )}
          <div className='iconEditar'> <IonIcon icon={pencilSharp} style={{fontSize: '20px'}}></IonIcon></div>
        </div>
      
          <IonCard style={{ width: '100%', minWidth: '200px', height: '100%', background: 'white', borderRadius: '10px', color: 'black', padding: '10px' }}>
    <IonCardHeader>
      <IonCardTitle>{user?.displayName}</IonCardTitle>
      <IonCardSubtitle>{user?.email}</IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent>
      <p>{rol}</p>
    </IonCardContent>
  </IonCard>
      
    </div>
  );
}
export default CapturaFotoPage;