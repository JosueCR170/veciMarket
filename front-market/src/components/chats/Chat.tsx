import React, { useState, useEffect, useRef, use } from 'react';
import { IonList, IonItem, IonTextarea, IonIcon } from '@ionic/react';
import { send } from 'ionicons/icons';
import { useAuth } from '../../context/contextUsuario';
import { db } from '../../services/firebase/config/firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ChatPreview } from './chatPreviewInterface';
import { getDatabase, ref, onDisconnect, set } from 'firebase/database';
import { getApp } from 'firebase/app';
import { convertDate, saveMessage, detectPresence, sendPushNotification } from '../../services/firebase/chatService';

const realtimeDb = getDatabase(getApp());

const Chat: React.FC<ChatPreview> = (chatPreview) => {

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

    useEffect(() => {
        const userId = user?.uid;
        if (!userId) return;

        const statusRef = ref(realtimeDb, `/userPresence/${userId}`);
        const isOnlineForRealtimeDb = {
            state: 'online',
            currentChatId: chatPreview.id,
            lastChanged: Date.now(),
        };
        const isOfflineForRealtimeDb = {
            state: 'offline',
            currentChatId: null,
            lastChanged: Date.now(),
        };
        onDisconnect(statusRef).set(isOfflineForRealtimeDb).then(() => {
            set(statusRef, isOnlineForRealtimeDb)
                .then(() => {
                    console.log("[useEffect] Estado online seteado en Realtime DB:", isOnlineForRealtimeDb);
                })
                .catch(err => {
                    console.error("[useEffect] Error al hacer set online:", err);
                });
        }).catch(err => {
            console.error("[useEffect] Error al configurar onDisconnect:", err);
        });
        return () => {
            set(statusRef, isOfflineForRealtimeDb);
        };
    }, [chatPreview.id]);


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
        await saveMessage(chatId, userId, text);

        const otherUserId = chatPreview.participants.find(id => id !== user?.uid);
        if (!otherUserId) return;

        const shouldNotify = await detectPresence(chatId, otherUserId);
        if (!shouldNotify) {
            console.log("El usuario está activo en el chat. No se envía push.");
            return;
        }

        await sendPushNotification(otherUserId, chatId, text, user?.displayName || "Usuario", userId);
    }


    async function handleSendClick() {
        const text = inputValue.trim();
        if (text === '') return;
        try {
            setInputValue('');
            await sendMessage(chatPreview.id, user?.uid!, text);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
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