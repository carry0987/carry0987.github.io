export type Platform = 'instagram' | 'line' | 'telegram' | 'tiktok';

export type PhoneModelId =
    | 'iphone-15-pro-max'
    | 'iphone-15-pro'
    | 'iphone-15'
    | 'iphone-se'
    | 'pixel-8-pro'
    | 'galaxy-s24';

export interface PhoneModel {
    id: PhoneModelId;
    name: string;
    width: number;
    height: number;
    borderRadius: string;
    hasHomeButton: boolean;
    notchType: 'dynamic-island' | 'notch' | 'none';
}

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
    isTyping?: boolean; // Show typing indicator
}

export interface ExportData {
    version: string;
    platform: Platform;
    settings: ChatSettings;
    messages: Message[];
    exportedAt: string;
}

export interface GeneratorResponse {
    topic: string;
    messages: Array<{
        text: string;
        isSender: boolean;
        timeOffsetMinutes: number;
    }>;
}
