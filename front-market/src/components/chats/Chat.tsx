import React, { useState, useEffect, useRef, use } from 'react';
import { IonList, IonItem, IonTextarea, IonIcon, IonButton } from '@ionic/react';
import { send, sendOutline } from 'ionicons/icons';

const Chat: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 50);
    }, []);

    return (
        <>
            <div className='chat-body'>
                <div className="chat-list-container">
                    <IonList lines="none" className="chat-msg-list">
                        <IonItem className='chat-msg-background'>
                            <div className='chat-msg chat-msg-left'>
                                <label className='chat-msg-text'>Mensaje de prueba sin importar el tamaño que tenga agarra todo el tamaño del div</label>
                                <label className='chat-msg-date'>12/5/2025-16:42</label>
                            </div>
                        </IonItem>
                        <IonItem className='chat-msg-background'>
                            <div className='chat-msg chat-msg-right'>
                                <label className='chat-msg-text'>Mensaje de prueba sin importar el tamaño que tenga agarra todo el tamaño del div</label>
                                <label className='chat-msg-date'>12/5/2025-16:43</label>
                            </div>
                        </IonItem>
                        <IonItem className='chat-msg-background'>
                            <div className='chat-msg chat-msg-left'>
                                <label className='chat-msg-text'>Mensaje de prueba sin importar el tamaño que tenga agarra todo el tamaño del div</label>
                                <label className='chat-msg-date'>12/5/2025-16:44</label>
                            </div>
                        </IonItem>
                        <IonItem className='chat-msg-background'>
                            <div className='chat-msg chat-msg-right'>
                                <label className='chat-msg-text'>Mensaje de prueba sin importar el tamaño que tenga agarra todo el tamaño del div</label>
                                <label className='chat-msg-date'>12/5/2025-16:45</label>
                            </div>
                        </IonItem>
                        <IonItem className='chat-msg-background'>
                            <div className='chat-msg chat-msg-left'>
                                <label className='chat-msg-text'>Mensaje de prueba sin importar el tamaño que tenga agarra todo el tamaño del div</label>
                                <label className='chat-msg-date'>12/5/2025-16:46</label>
                            </div>
                        </IonItem>
                        <IonItem className='chat-msg-background'>
                            <div className='chat-msg chat-msg-right'>
                                <label className='chat-msg-text'>Mensaje de prueba sin importar el tamaño que tenga agarra todo el tamaño del div</label>
                                <label className='chat-msg-date'>12/5/2025-16:47</label>
                            </div>
                        </IonItem>
                        <div ref={messagesEndRef} />
                    </IonList>
                </div>
                <div className='chat-msg-send'>
                    <IonTextarea placeholder="Escribe un mensaje" className='chat-msg-input' onIonChange={e => setInputValue(e.detail.value!)}></IonTextarea>
                    <IonIcon icon={send} className='chat-msg-icon'/>
                </div>
            </div>
        </>
    );
};

export default Chat;