import { collection, doc, getDoc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "./config/firebaseConfig";
import { get, getDatabase, ref } from "firebase/database";
import { getApp } from "firebase/app";
import { ChatPreview } from "../../components/chats/chatPreviewInterface";

const API_BASE = 'http://10.0.2.2:3000';

export function convertDate(timestamp: Timestamp) {
    return timestamp?.toDate().toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export async function saveMessage(chatId: string, userId: string, text: string) {
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
export async function detectPresence(chatId: string, otherUserId: string): Promise<boolean> {
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
export async function sendPushNotification(otherUserId: string, chatId: string, text: string, senderName: string, senderId: string) {
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
        title: `Nuevo mensaje de ${senderName}`,
        body: text,
        data: { chatId, senderId },
    };
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

export async function makeRead(chatPreview: ChatPreview, otherUserId: String) {
    try {
        const messagesRef = collection(db, 'chats', chatPreview.id, 'messages');
        const q = query(messagesRef, where('read', '==', false), where('from', '==', otherUserId));
        const querySnapshot = await getDocs(q);

        const updatePromises = querySnapshot.docs.map((messageDoc) => {
            const messageRef = doc(db, 'chats', chatPreview.id, 'messages', messageDoc.id);
            return updateDoc(messageRef, { read: true });
        });

        await Promise.all(updatePromises);
        console.log('Mensajes marcados como leídos');
    } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error);
    }
}