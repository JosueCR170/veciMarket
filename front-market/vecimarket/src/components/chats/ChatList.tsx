import { IonList, IonItem } from '@ionic/react';
import ChatLabel from './ChatLabel';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/contextUsuario';
import { db } from '../../services/firebase/config/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { ChatPreview } from './chatPreviewInterface';

const ChatList: React.FC = () => {

    const { user } = useAuth();
    const [previewChats, setPreviewChats] = useState<ChatPreview[]>([]);

    useEffect(() => {
        if (!user) return;

        const chatsRef = collection(db, 'chats');

        const q = query(
            chatsRef,
            where('participants', 'array-contains', user.uid),
            orderBy('lastTimestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const chats: ChatPreview[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    lastMessage: data.lastMessage,
                    lastTimestamp: data.lastTimestamp,
                    participants: data.participants
                };
            });
            setPreviewChats(chats);
            console.log("PreviewChats", previewChats)
            console.log("Chats", chats)
        }, err => {
            console.error('Error al cargar chats:', err);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <>
            <div>
                <IonList lines="none" className='back-color'>
                    {previewChats.map(chatPreview => (
                        <IonItem key={chatPreview.id} className='back-color'>
                            <ChatLabel {...chatPreview}/>
                        </IonItem>
                    ))}
                </IonList>
            </div>
        </>
    );
};

export default ChatList;