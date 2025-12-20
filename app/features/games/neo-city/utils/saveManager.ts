import { getLocalValue, setLocalValue, removeLocalValue } from '@carry0987/utils';
import type { TileData, CityStats, FeedMessage, SaveData } from '../types';

const DB_NAME = 'neo-city-db';
const STORE_NAME = 'saves';
const SAVE_KEY = 'current-save';
const CURRENT_VERSION = 1;

class SaveManager {
    private db: IDBDatabase | null = null;
    private dbReady: Promise<void>;

    constructor() {
        this.dbReady = this.initDB();
    }

    private initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.indexedDB) {
                // SSR or no IndexedDB support, fallback will be handled
                resolve();
                return;
            }

            const request = indexedDB.open(DB_NAME, 1);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }

    async save(
        cityData: TileData[],
        stats: CityStats,
        cityName: string,
        gameTime: number,
        feedMessages: FeedMessage[]
    ): Promise<boolean> {
        await this.dbReady;

        const saveData: SaveData = {
            cityData,
            stats,
            cityName,
            gameTime,
            feedMessages,
            savedAt: Date.now(),
            version: CURRENT_VERSION
        };

        // Try IndexedDB first
        if (this.db) {
            return new Promise((resolve) => {
                const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put(saveData, SAVE_KEY);

                request.onsuccess = () => resolve(true);
                request.onerror = () => {
                    console.error('IndexedDB save failed, trying localStorage');
                    resolve(this.saveToLocalStorage(saveData));
                };
            });
        }

        // Fallback to localStorage
        return this.saveToLocalStorage(saveData);
    }

    private saveToLocalStorage(saveData: SaveData): boolean {
        try {
            setLocalValue(SAVE_KEY, saveData);
            return true;
        } catch (e) {
            console.error('localStorage save failed:', e);
            return false;
        }
    }

    async load(): Promise<SaveData | null> {
        await this.dbReady;

        // Try IndexedDB first
        if (this.db) {
            const data = await new Promise<SaveData | null>((resolve) => {
                const transaction = this.db!.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(SAVE_KEY);

                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => {
                    console.error('IndexedDB load failed, trying localStorage');
                    resolve(null);
                };
            });

            if (data) return data;
        }

        // Fallback to localStorage
        return this.loadFromLocalStorage();
    }

    private loadFromLocalStorage(): SaveData | null {
        try {
            const data = getLocalValue<SaveData>(SAVE_KEY, true);
            if (data) {
                return data;
            }
        } catch (e) {
            console.error('localStorage load failed:', e);
        }

        return null;
    }

    async deleteSave(): Promise<boolean> {
        await this.dbReady;

        if (this.db) {
            return new Promise((resolve) => {
                const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(SAVE_KEY);

                request.onsuccess = () => resolve(true);
                request.onerror = () => resolve(false);
            });
        }

        try {
            removeLocalValue(SAVE_KEY);
            return true;
        } catch {
            return false;
        }
    }

    async hasSave(): Promise<boolean> {
        const data = await this.load();
        return data !== null;
    }
}

// Singleton instance
export const saveManager = new SaveManager();
