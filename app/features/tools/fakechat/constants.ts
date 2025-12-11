import type { ChatSettings, Message, Platform, PhoneModel } from './types';
import avatarPartner from './assets/avatar-partner.svg';
import avatarMe from './assets/avatar-me.svg';

export const DEFAULT_AVATAR_PARTNER = avatarPartner;
export const DEFAULT_AVATAR_ME = avatarMe;

// Generate random avatar from picsum
export const getRandomPicsumAvatar = () => `https://picsum.photos/seed/${Date.now()}/100/100`;

// Generate random background from picsum (phone screen ratio)
export const getRandomPicsumBackground = () => `https://picsum.photos/seed/${Date.now()}/400/800`;

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

export const PHONE_MODELS: PhoneModel[] = [
    {
        id: 'iphone-15-pro-max',
        name: 'iPhone 15 Pro Max',
        width: 430,
        height: 932,
        borderRadius: '3.5rem',
        hasHomeButton: false,
        notchType: 'dynamic-island'
    },
    {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        width: 393,
        height: 852,
        borderRadius: '3rem',
        hasHomeButton: false,
        notchType: 'dynamic-island'
    },
    {
        id: 'iphone-15',
        name: 'iPhone 15',
        width: 393,
        height: 852,
        borderRadius: '3rem',
        hasHomeButton: false,
        notchType: 'notch'
    },
    {
        id: 'iphone-se',
        name: 'iPhone SE 2',
        width: 375,
        height: 667,
        borderRadius: '0',
        hasHomeButton: true,
        notchType: 'none'
    },
    {
        id: 'pixel-8-pro',
        name: 'Pixel 8 Pro',
        width: 412,
        height: 892,
        borderRadius: '2.5rem',
        hasHomeButton: false,
        notchType: 'none'
    },
    {
        id: 'galaxy-s24',
        name: 'Galaxy S24',
        width: 412,
        height: 892,
        borderRadius: '2.5rem',
        hasHomeButton: false,
        notchType: 'none'
    }
];

export const DEFAULT_PHONE_MODEL = PHONE_MODELS[0];

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
