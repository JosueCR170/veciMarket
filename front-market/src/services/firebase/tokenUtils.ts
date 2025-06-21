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

export const requestPushPermissions = async (): Promise<boolean> => {
  try {
    const result = await PushNotifications.requestPermissions();
    return result.receive === 'granted';
  } catch (error) {
    console.error('Error solicitando permisos de notificación:', error);
    return false;
  }
};

/**
 * Registra el dispositivo y retorna el token de notificaciones push.
 * Solo debe llamarse si ya se tienen los permisos.
 */
export const getDeviceToken = async (): Promise<string | null> => {
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
};