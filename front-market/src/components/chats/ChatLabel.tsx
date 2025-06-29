import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonIcon, IonModal, IonButton, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { personAddSharp, arrowBack } from 'ionicons/icons';
import { ChatPreview } from './chatPreviewInterface';
import { useAuth } from '../../context/contextUsuario';
import { db } from '../../services/firebase/config/firebaseConfig';
import { getDoc, doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { convertDate, makeRead } from '../../services/firebase/chatService';
import Chat from './Chat';
import "./chat.css"

interface user {
    correo: string,
    name: string,
    rol: string
}

const ChatLabel: React.FC<ChatPreview> = ({ ...chatPreview }) => {
    const [open, setOpen] = useState(false);
    const [chat, setChat] = useState(chatPreview);
    const [otherUser, setOtherUser] = useState<user | null>(null);
    const [otherUserId, setOtherUserId] = useState<string>("");
    const [hasUnread, setHasUnread] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        getOtherUser();
    }, []);

    useEffect(() => {
        const chatRef = doc(db, 'chats', chat.id);
        const messagesRef = collection(chatRef, 'messages');

        const unsubscribeChat = onSnapshot(chatRef, (docSnap) => {
            if (docSnap.exists()) {
                const updatedChat = docSnap.data() as ChatPreview;
                setChat({
                    ...updatedChat,
                    id: docSnap.id,
                });
            }
        });

        const q = query(
            messagesRef,
            where('read', '==', false),
            where('from', '==', otherUserId)
        );

        const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
            const unreadMessages = querySnapshot.docs.map(doc => doc.data());
            if (unreadMessages.length > 0) {
                setHasUnread(true);
            }
        });

        return () => {
            unsubscribeChat();
            unsubscribeMessages();
        };
    }, [chat.id, otherUser]);

    async function getOtherUser() {
        let otherUserId = "";
        if (chat.participants[0] == user?.uid) {
            otherUserId = chat.participants[1];
        } else {
            otherUserId = chat.participants[0];
        }
        setOtherUserId(otherUserId);

        const otherUserRef = doc(db, 'userRol', otherUserId);

        try {
            const docSnap = await getDoc(otherUserRef);
            if (docSnap.exists()) {
                const otherUserData = docSnap.data() as user;
                setOtherUser(otherUserData);
            } else {
                console.log("El documento del otro usuario no existe");
            }
        } catch (error) {
            console.error("Error al obtener datos del otro usuario:", error);
        }
    }

    const openChat = () => {
        setOpen(true);
        setHasUnread(false);
        makeRead(chatPreview, otherUserId);
    }

    const closeChat = () => {
        setOpen(false);
        setHasUnread(false);
        makeRead(chatPreview, otherUserId);
    }

    return (
        <>
            <IonCard className={`msg-preview-card${hasUnread ? ' msg-new' : ''}`} button={true} onClick={() => openChat()}>
                <IonCardContent className='msg-preview-content'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <IonIcon icon={personAddSharp} className='msg-preview-icon' />
                        <div className='msg-preview-detail'>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label className='msg-preview-title'>{otherUser?.name || 'Cargando...'}</label>
                                <label className='msg-preview-date'>{convertDate(chat.lastTimestamp)}</label>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <label className='msg-preview-text'>{chat.lastMessage}</label>
                            </div>
                        </div>
                    </div>
                </IonCardContent>
            </IonCard>

            <IonModal isOpen={open} onDidDismiss={() => closeChat()} className="chat-modal">
                <IonHeader>
                    <IonToolbar className="custom-header ">
                        <IonButton onClick={() => closeChat()} slot="start" fill="clear">
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