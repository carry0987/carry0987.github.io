import type { ChatSettings, Message, Platform } from './types';

export const DEFAULT_SETTINGS: ChatSettings = {
    time: '12:34',
    batteryLevel: 85,
    partnerName: '寶貝 ❤️',
    partnerAvatar: 'https://picsum.photos/100/100',
    myAvatar: 'https://picsum.photos/101/101'
};

export const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        text: '嗨！今天晚上要吃什麼？',
        isSender: false,
        timestamp: '12:30',
        isRead: true
    },
    {
        id: '2',
        text: '我想吃火鍋 🍲',
        isSender: true,
        timestamp: '12:31',
        isRead: true
    }
];

export const PLATFORMS: { id: Platform; name: string; icon: string }[] = [
    { id: 'instagram', name: 'Instagram', icon: 'camera' },
    { id: 'line', name: 'LINE', icon: 'message-circle' },
    { id: 'telegram', name: 'Telegram', icon: 'send' },
    { id: 'tiktok', name: 'TikTok', icon: 'music' }
];
