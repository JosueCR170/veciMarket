import { PushNotifications } from '@capacitor/push-notifications';
import { getAuth } from "firebase/auth";
import { onSnapshot, collection, query, where, DocumentChangeType } from "firebase/firestore";
import { db } from "./firebase/config/firebaseConfig";

class NotificationService {

    private static instance: NotificationService;
    private listeners: Function[] = [];
    private notifications: any[] = [];

    private chatSnapshotUnsub: (() => void) | null = null;

    private constructor() {
        // Constructor privado para Singleton
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Inicializar el servicio de notificaciones
    async initialize(uid: string) {
        await this.initializeNative(uid);

        this.loadSavedNotifications();
    }

    public initializeChatListener(userId: string) {
        if (this.chatSnapshotUnsub) return; // Evita múltiples listeners activos

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", userId)
        );

        this.chatSnapshotUnsub = onSnapshot(q, snapshot => {
            let updated = false;

            snapshot.docChanges().forEach(change => {
                const data = change.doc.data();
                const chatId = change.doc.id;

                if (change.type === "modified") {
                    const lastMsg = data.lastMessage;

                    // Si el último mensaje no fue enviado por el usuario actual
                    if (lastMsg && lastMsg.senderId !== userId) {
                        const alreadyExists = this.notifications.some(n =>
                            n.data?.chatId === chatId && !n.read
                        );

                        if (!alreadyExists) {
                            console.log("[NotificationService] Mensaje nuevo en", chatId);

                            this.addNotification({
                                title: "Nuevo mensaje",
                                body: lastMsg.text || "Tienes un nuevo mensaje",
                                data: { chatId }
                            });

                            updated = true;
                        }
                    }
                }
            });

            if (updated) {
                this.notifyListeners();
            }
        }, error => {
            console.error("[NotificationService] Error en onSnapshot:", error);
        });
    }

    // Inicializar para dispositivos nativos
    private async initializeNative(uid: string) {
        try {

            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                console.warn("No hay usuario autenticado al registrar el token");
                return;
            }

            // Solicitar permiso para notificaciones push
            const result = await PushNotifications.requestPermissions();

            if (result.receive === 'granted') {
                // Registrar para recibir notificaciones push
                await PushNotifications.register();

                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('Notificación recibida:', notification);
                    this.addNotification(notification);
                    this.notifyListeners();
                });

                PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                    console.log('Acción realizada en notificación:', notification);
                    this.addNotification(notification.notification);
                    this.notifyListeners();
                });
            }
        } catch (error) {
            alert('Error al inicializar notificaciones nativas:');
        }
    }

    // Añadir notificación a la lista
    private addNotification(notification: any) {
        const newNotification = {
            id: Date.now().toString(),
            title: notification.title || 'Sin título',
            body: notification.body || '',
            data: notification.data || {},
            read: false,
            date: new Date().toISOString()
        };

        this.notifications = [newNotification, ...this.notifications];
        this.saveNotifications();
    }

    // Guardar notificaciones en localStorage
    private saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    // Cargar notificaciones guardadas
    public loadSavedNotifications() {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            try {
                this.notifications = JSON.parse(saved);
            } catch (e) {
                this.notifications = [];
            }
        }
    }

    // Obtener todas las notificaciones
    getNotifications() {
        return [...this.notifications];
    }

    // Obtener cantidad de notificaciones no leídas
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    // Marcar notificación como leída
    markAsRead(id: string) {
        this.notifications = this.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        this.saveNotifications();
        this.notifyListeners();
    }

    // Marcar todas las notificaciones como leídas
    markAllAsRead() {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        this.saveNotifications();
        this.notifyListeners();
    }

    // Eliminar notificación
    deleteNotification(id: string) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.saveNotifications();
        this.notifyListeners();
    }

    // Añadir listener para cambios en notificaciones
    addListener(listener: Function) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notificar a todos los listeners sobre cambios
    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    public initializeAppListener() {
        this.notifyListeners();
    }
}

export default NotificationService;