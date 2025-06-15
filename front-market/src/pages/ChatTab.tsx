import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ChatList from '../components/chats/ChatList';
import './ChatTab.css';

const ChatTab: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonTitle className="custom-title">
            Vec<span style={{ color: "#A8C7FF" }}>i</span>Mark<span style={{ color: "#A8C7FF" }}>e</span>t Lite
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="back-color">
        <ChatList />
      </IonContent>
    </IonPage>
  );
};

export default ChatTab;
