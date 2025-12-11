import type { ChatSettings, Message, Platform } from './types';
import avatarPartner from './assets/avatar-partner.svg';
import avatarMe from './assets/avatar-me.svg';

export const DEFAULT_AVATAR_PARTNER = avatarPartner;
export const DEFAULT_AVATAR_ME = avatarMe;

// Generate random avatar from picsum
export const getRandomPicsumAvatar = () => `https://picsum.photos/seed/${Date.now()}/100/100`;

export const DEFAULT_SETTINGS: ChatSettings = {
    time: '12:34',
    batteryLevel: 85,
    partnerName: 'Babe ❤️',
    partnerAvatar: DEFAULT_AVATAR_PARTNER,
    myAvatar: DEFAULT_AVATAR_ME,
    isTyping: false
};

export const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        text: 'Hey! What do you want for dinner tonight?',
        isSender: false,
        timestamp: '12:30',
        isRead: true
    },
    {
        id: '2',
        text: 'I want hot pot 🍲',
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

// Common emoji stickers for quick insert
export const EMOJI_STICKERS: string[] = [
    '😀',
    '😂',
    '🥰',
    '😍',
    '😘',
    '🥺',
    '😢',
    '😭',
    '😡',
    '🤔',
    '😱',
    '🙄',
    '😴',
    '🤗',
    '🤣',
    '😎',
    '❤️',
    '💕',
    '💖',
    '💔',
    '🔥',
    '✨',
    '🎉',
    '👍',
    '👎',
    '👏',
    '🙏',
    '💪',
    '🤝',
    '👋',
    '✌️',
    '🤞',
    '🍕',
    '🍔',
    '🍜',
    '🍲',
    '🍺',
    '☕',
    '🎂',
    '🍰',
    '🎁',
    '🎈',
    '🎊',
    '💐',
    '🌹',
    '🌸',
    '⭐',
    '🌙'
];
