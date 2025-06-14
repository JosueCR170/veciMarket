import { Timestamp } from "firebase/firestore";

export interface ChatPreview {
    id: string;
    lastMessage: string;
    lastTimestamp: Timestamp;
    participants: string[];
}