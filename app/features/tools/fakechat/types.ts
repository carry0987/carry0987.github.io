export type Platform = 'instagram' | 'line' | 'telegram' | 'tiktok';

export interface Message {
    id: string;
    text?: string;
    image?: string;
    audioDuration?: number; // duration in seconds
    isSender: boolean; // true = Me, false = Them
    timestamp: string;
    isRead?: boolean;
    reaction?: string;
}

export interface ChatSettings {
    time: string;
    batteryLevel: number;
    partnerName: string;
    partnerAvatar: string;
    myAvatar: string; // Only used for some platforms like TikTok/Line if needed
    backgroundImage?: string;
}

export interface GeneratorResponse {
    topic: string;
    messages: Array<{
        text: string;
        isSender: boolean;
        timeOffsetMinutes: number;
    }>;
}
