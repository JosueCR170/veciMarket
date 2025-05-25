import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonModal, IonButton, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { personAddSharp, arrowBack } from 'ionicons/icons';
import { ChatPreview } from './chatPreviewInterface';
import { useAuth } from '../../context/contextUsuario';
import { db } from '../../services/firebase/config/firebaseConfig';
import { getDoc, doc, onSnapshot } from 'firebase/firestore';
import Chat from './Chat';
import "./chat.css"

interface user {
    correo: string,
    name: string,
    rol: string
}

const ChatLabel: React.FC<ChatPreview> = (chatPreview) => {
    const [open, setOpen] = useState(false);
    const [chat, setChat] = useState(chatPreview);
    const [otherUser, setOtherUser] = useState<user | null>(null);

    const { user } = useAuth();

    const fechaFormateada = chat.lastTimestamp?.toDate().toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    async function getOtherUser() {
        let otherUserId = "";
        if (chat.participants[0] == user?.uid) {
            otherUserId = chat.participants[1];
        } else {
            otherUserId = chat.participants[0];
        }

        const otherUserRef = doc(db, 'userRol', otherUserId);

        try {
            const docSnap = await getDoc(otherUserRef);
            if (docSnap.exists()) {
                const otherUserData = docSnap.data() as user;
                console.log("Datos del otro usuario:", otherUserData);
                setOtherUser(otherUserData);

            } else {
                console.log("El documento del otro usuario no existe");
            }
        } catch (error) {
            console.error("Error al obtener datos del otro usuario:", error);
        }
    }

    useEffect(() => {
        getOtherUser();
    }, []);

    useEffect(() => {
        const chatRef = doc(db, 'chats', chat.id);
        const unsubscribe = onSnapshot(chatRef, (docSnap) => {
            if (docSnap.exists()) {
                const updatedChat = docSnap.data() as ChatPreview;
                setChat({
                    ...updatedChat,
                    id: docSnap.id,
                });
            }
        });

        return () => unsubscribe();
    }, [chat.id]);

    return (
        <>
            <IonCard className='msg-preview-card' button={true} onClick={() => setOpen(true)}>
                <IonCardContent className='msg-preview-content'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <IonIcon icon={personAddSharp} className='msg-preview-icon' />
                        <div className='msg-preview-detail'>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label className='msg-preview-title'>{otherUser?.name || 'Cargando...'}</label>
                                <label className='msg-preview-date'>{fechaFormateada}</label>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <label className='msg-preview-text'>{chat.lastMessage}</label>
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
                            {otherUser?.name || 'Cargando...'}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Chat {...chat} />
            </IonModal>
        </>
    );
};

export default ChatLabel;