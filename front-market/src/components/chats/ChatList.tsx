import { IonList, IonItem, IonLabel } from '@ionic/react';
import ChatLabel from './ChatLabel';


const ChatList: React.FC = () => {
    return (
        <>
            <div>
                <IonList lines="none" className='back-color'>
                    <IonItem className='back-color'>
                        <ChatLabel />
                    </IonItem>
                    <IonItem className='back-color'>
                        <ChatLabel />
                    </IonItem>
                    <IonItem className='back-color'>
                        <ChatLabel />
                    </IonItem>
                    <IonItem className='back-color'>
                        <ChatLabel />
                    </IonItem>
                    <IonItem className='back-color'>
                        <ChatLabel />
                    </IonItem>
                    <IonItem className='back-color'>
                        <ChatLabel />
                    </IonItem>
                </IonList>
            </div>
        </>
    );
};

export default ChatList;