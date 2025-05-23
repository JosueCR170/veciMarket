import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonSpinner,
  IonAlert,
  IonItem,
  IonLabel,
  IonButtons,
  IonFooter,
  IonNote,
} from '@ionic/react';
import {
  camera,
  cloudUploadOutline,
  checkmarkCircleOutline,
  warningOutline,
  refreshOutline,
  imageOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

import { app, storage, model } from '../../services/firebase/firebaseConfig'; // Importa el modelo de Vertex AI
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
    
      const showAlert = useCallback((header: string, message: string, buttons: AlertInfo['buttons'] = ['OK']) => {
    setAlertInfo({ isOpen: true, header, message, buttons });
  }, []);

  return (
    <div className="captura-foto-container">
         <div
          style={{
            marginBottom: '1rem',
            border: '1px dashed var(--ion-color-medium)',
            minHeight: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--ion-color-light-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
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
        </div>
    </div>
  );
}
export default CapturaFotoPage;