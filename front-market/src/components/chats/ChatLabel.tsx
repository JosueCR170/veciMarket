import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonModal, IonButton, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { personAddSharp, arrowBack } from 'ionicons/icons';
import Chat from './Chat';
import './chat.css';

const ChatLabel: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IonCard className='msg-preview-card' button={true} onClick={() => setOpen(true)}>
                <IonCardContent className='msg-preview-content'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <IonIcon icon={personAddSharp} className='msg-preview-icon' />
                        <div className='msg-preview-detail'>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label className='msg-preview-title'>Nombre de Usuario</label>
                                <label className='msg-preview-date'>12/5/2025</label>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <label className='msg-preview-text'>Mensaje de prueba sin importar el tamaño que tenga agarra todo el tamaño del div</label>
                            </div>
                        </div>
                    </div>
                </IonCardContent>
            </IonCard>

            <IonModal isOpen={open} onDidDismiss={() => setOpen(false)}>
                <IonHeader>
                    <IonToolbar className="custom-header ">
                        <IonButton onClick={() => setOpen(false)} slot="start" fill="clear">
                            <IonIcon icon={arrowBack} className='chat-back-icon'></IonIcon>
                        </IonButton>
                        <IonTitle className="custom-title chat-title">
                            Josué
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Chat />
            </IonModal>
        </>
    );
};

export default ChatLabel;