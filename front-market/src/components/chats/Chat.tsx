import React, { useState, useEffect, useRef, use } from 'react';
import { IonList, IonItem, IonTextarea, IonIcon } from '@ionic/react';
import { send } from 'ionicons/icons';
import { useAuth } from '../../context/contextUsuario';
import { db } from '../../services/firebase/config/firebaseConfig';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ChatPreview } from './chatPreviewInterface';
import { getDatabase, ref, onDisconnect, set, get } from 'firebase/database';
import { getApp } from 'firebase/app';

const realtimeDb = getDatabase(getApp());

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

        console.log("[useEffect] Preparando onDisconnect...");

        onDisconnect(statusRef).set(isOfflineForRealtimeDb).then(() => {
            console.log("[useEffect] onDisconnect configurado");
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
            console.log("[useEffect] Componente desmontado, seteando OFFLINE:", isOfflineForRealtimeDb);
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

    // --- 1. Guardar el mensaje y actualizar el chat ---
    async function saveMessage(chatId: string, userId: string, text: string) {
        console.log("[saveMessage] Iniciando batch...");
        const batch = writeBatch(db);

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const newMessageRef = doc(messagesRef);

        batch.set(newMessageRef, {
            from: userId,
            text,
            timestamp: serverTimestamp(),
            read: false,
        });

        const chatDocRef = doc(db, 'chats', chatId);
        batch.update(chatDocRef, {
            lastMessage: text,
            lastTimestamp: serverTimestamp(),
        });

        await batch.commit();
        console.log("[saveMessage] Batch commit ejecutado correctamente.");
    }

    // --- 2. Verificar si el otro usuario está conectado y en el chat ---
    async function detectPresence(chatId: string, otherUserId: string): Promise<boolean> {
        console.log(`[detectPresence] Verificando presencia de usuario ${otherUserId} en chat ${chatId}`);
        const realtimeDb = getDatabase(getApp());
        const presenceRef = ref(realtimeDb, `/userPresence/${otherUserId}`);
        const snapshot = await get(presenceRef);

        if (!snapshot.exists()) {
            console.log("[detectPresence] No hay snapshot, se enviará push.");
            return true;
        }

        const data = snapshot.val();
        console.log("[detectPresence] Estado actual:", data);

        const isOnline = data?.state === 'online';
        const isInChat = data?.currentChatId === chatId;

        const result = !(isOnline && isInChat);
        console.log(`[detectPresence] isOnline: ${isOnline}, isInChat: ${isInChat}, enviar push: ${result}`);

        return result;
    }


    // --- 3. Enviar la notificación push ---
    async function sendPushNotification(otherUserId: string, chatId: string, text: string, senderEmail: string, senderId: string) {
        console.log(`[sendPushNotification] Enviando notificación a ${otherUserId}`);
        const sessionDocRef = doc(db, "userSessions", otherUserId);
        const sessionSnap = await getDoc(sessionDocRef);

        if (!sessionSnap.exists()) {
            console.warn("[sendPushNotification] No existe el documento de sesión.");
            return;
        }

        const existingDeviceToken = sessionSnap.data().deviceToken;
        console.log("[sendPushNotification] Token encontrado:", existingDeviceToken);

        if (!existingDeviceToken) {
            console.warn("[sendPushNotification] No hay token registrado.");
            return;
        }

        const payload = {
            token: existingDeviceToken,
            title: `Nuevo mensaje de ${senderEmail}`,
            body: text,
            data: { chatId, senderId },
        };

        console.log("[sendPushNotification] Payload:", payload);

        try {
            const res = await fetch(`${API_BASE}/api/send-notification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const resData = await res.json();
            console.log("[sendPushNotification] Respuesta del servidor:", resData);
        } catch (err: any) {
            console.error('[sendPushNotification] Error al enviar la notificación:', err.message);
        }
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

        await sendPushNotification(
            otherUserId,
            chatId,
            text,
            user?.email || "Usuario",
            userId
        );
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