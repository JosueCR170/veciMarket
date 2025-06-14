import { doc, setDoc } from "firebase/firestore";
import { db } from "./config/firebaseConfig";
import { PushNotifications } from "@capacitor/push-notifications";

export const savePushToken = async (token: string, uid: string) => {
  try {
    await setDoc(doc(db, "userSessions", uid), {
      deviceToken: token,
      updateAt: new Date(),
    });
  } catch (error) {
    alert("❌ Error al guardar token: " + error);
  }
};

export const getDeviceToken = async (): Promise<string | null> => {
  try {
    const result = await PushNotifications.requestPermissions();
    if (result.receive !== 'granted') return null;

    return new Promise((resolve, reject) => {
      PushNotifications.addListener('registration', (token) => {
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error registrando token:', error);
        reject(null);
      });

      PushNotifications.register();
    });
  } catch (err) {
    console.error('Error obteniendo device token:', err);
    return null;
  }
};