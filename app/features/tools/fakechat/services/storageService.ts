import type { Message, ChatSettings, Platform, AIGeneratorSettings } from '../types';

const DB_NAME = 'fakechat_db';
const DB_VERSION = 2;
const STORE_NAME = 'chat_data';
const DATA_KEY = 'current_chat';
const AI_SETTINGS_KEY = 'ai_generator_settings';

interface StoredChatData {
    id: string;
    platform: Platform;
    settings: ChatSettings;
    messages: Message[];
    updatedAt: string;
}

interface StoredAISettings {
    id: string;
    settings: AIGeneratorSettings;
    updatedAt: string;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Convert a File to base64 data URL for persistent storage
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB'));
        };

        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
};

export const saveChatData = async (platform: Platform, settings: ChatSettings, messages: Message[]): Promise<void> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const data: StoredChatData = {
            id: DATA_KEY,
            platform,
            settings,
            messages,
            updatedAt: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to save chat data'));
        });
    } catch (error) {
        console.error('Error saving to IndexedDB:', error);
    }
};

export const loadChatData = async (): Promise<StoredChatData | null> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.get(DATA_KEY);
            request.onsuccess = () => {
                resolve(request.result || null);
            };
            request.onerror = () => reject(new Error('Failed to load chat data'));
        });
    } catch (error) {
        console.error('Error loading from IndexedDB:', error);
        return null;
    }
};

export const clearChatData = async (): Promise<void> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.delete(DATA_KEY);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to clear chat data'));
        });
    } catch (error) {
        console.error('Error clearing IndexedDB:', error);
    }
};

export const saveAIGeneratorSettings = async (settings: AIGeneratorSettings): Promise<void> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const data: StoredAISettings = {
            id: AI_SETTINGS_KEY,
            settings,
            updatedAt: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to save AI generator settings'));
        });
    } catch (error) {
        console.error('Error saving AI settings to IndexedDB:', error);
    }
};

export const loadAIGeneratorSettings = async (): Promise<AIGeneratorSettings | null> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.get(AI_SETTINGS_KEY);
            request.onsuccess = () => {
                const result = request.result as StoredAISettings | undefined;
                resolve(result?.settings || null);
            };
            request.onerror = () => reject(new Error('Failed to load AI generator settings'));
        });
    } catch (error) {
        console.error('Error loading AI settings from IndexedDB:', error);
        return null;
    }
};

export const clearAIGeneratorSettings = async (): Promise<void> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.delete(AI_SETTINGS_KEY);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to clear AI generator settings'));
        });
    } catch (error) {
        console.error('Error clearing AI settings from IndexedDB:', error);
    }
};
