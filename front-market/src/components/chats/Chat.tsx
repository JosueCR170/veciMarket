import React, { useState, useEffect, useRef, use } from 'react';
import { IonList, IonItem, IonTextarea, IonIcon } from '@ionic/react';
import { send } from 'ionicons/icons';
import { useAuth } from '../../context/contextUsuario';
import { db } from '../../services/firebase/config/firebaseConfig';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ChatPreview } from './chatPreviewInterface';

const Chat: React.FC<ChatPreview> = (chatPreview) => {

    const API_BASE = 'http://10.0.2.2:3000';

    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<any[]>([]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 50);
    }, [, messages]);

    useEffect(() => {
        const unsubscribe = getMessages(chatPreview.id);

        return () => unsubscribe();
    }, [chatPreview]);

    function getMessages(chatId: string) {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messages);
        });
    }

    async function sendMessage(chatId: string, userId: string, text: string) {

        const batch = writeBatch(db);

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const newMessageRef = doc(messagesRef); // genera un id automáticamente

        // Prepara el nuevo mensaje
        batch.set(newMessageRef, {
            from: userId,
            text,
            timestamp: serverTimestamp(),
            read: false
        });

        // Referencia al doc principal
        const chatDocRef = doc(db, 'chats', chatId);

        // Actualiza lastMessage y lastTimestamp
        batch.update(chatDocRef, {
            lastMessage: text,
            lastTimestamp: serverTimestamp(),
        });

        // Ejecuta el batch
        await batch.commit();

        const otherUserId = chatPreview.participants.find(id => id !== user?.uid);
        if (!otherUserId) return;

        const sessionDocRef = doc(db, "userSessions", otherUserId!);
        const sessionSnap = await getDoc(sessionDocRef);
        const existingDeviceToken = sessionSnap.exists() ? sessionSnap.data().deviceToken : null;

        if (existingDeviceToken) {
            try {
                const payload = {
                    token: existingDeviceToken,
                    title: `Nuevo mensaje de ${user?.email}`,
                    body: text,
                    data: { chatId, senderId: user?.uid},
                    
                };

                const res = await fetch(`${API_BASE}/api/send-notification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const resData = await res.json();
                console.log(JSON.stringify(resData, null, 1));
            } catch (err: any) {
                console.error('Error al enviar la notificación: ' + err.message);
            }
            console.log("Enviando notificación push al usuario:", otherUserId);
        }
    }

    async function handleSendClick() {
        const text = inputValue.trim();
        if (text === '') return;
        try {
            await sendMessage(chatPreview.id, user?.uid!, text);
            setInputValue('');
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    }

    function convertDate(timestamp: Timestamp) {
        return timestamp?.toDate().toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    return (
        <>
            <div className='chat-body'>
                <div className="chat-list-container">
                    <IonList lines="none" className="chat-msg-list">
                        {messages.map(msg => (
                            <IonItem className='chat-msg-background'>
                                <div className={user?.uid == msg.from ? 'chat-msg chat-msg-right' : 'chat-msg chat-msg-left'}>
                                    <label className='chat-msg-text'>{msg.text}</label>
                                    <label className='chat-msg-date'>{convertDate(msg.timestamp)}</label>
                                </div>
                            </IonItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </IonList>
                </div>
                <div className='chat-msg-send'>
                    <IonTextarea placeholder="Escribe un mensaje" className='chat-msg-input' value={inputValue} onIonInput={e => setInputValue(e.detail.value!)}></IonTextarea>
                    <IonIcon icon={send} className="chat-msg-icon" onClick={handleSendClick} />
                </div>
            </div>
        </>
    );
};

export default Chat;