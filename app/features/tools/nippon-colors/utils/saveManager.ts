import { getLocalValue, setLocalValue, removeLocalValue } from '@carry0987/utils';

export interface SaveData {
    transitionDuration: number;
    savedAt: number;
    version: number;
}

const STORAGE_KEY = 'nippon-colors-settings';
const CURRENT_VERSION = 1;
const DEFAULT_DURATION = 1500;

class SaveManager {
    save(transitionDuration: number): boolean {
        const saveData: SaveData = {
            transitionDuration,
            savedAt: Date.now(),
            version: CURRENT_VERSION
        };

        try {
            setLocalValue(STORAGE_KEY, saveData);
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }

    load(): SaveData | null {
        try {
            const data = getLocalValue<SaveData>(STORAGE_KEY, true);
            if (data && data.version === CURRENT_VERSION) {
                return data;
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }

        return null;
    }

    getTransitionDuration(): number {
        const data = this.load();
        return data?.transitionDuration ?? DEFAULT_DURATION;
    }

    deleteSave(): boolean {
        try {
            removeLocalValue(STORAGE_KEY);
            return true;
        } catch {
            return false;
        }
    }

    hasSave(): boolean {
        return this.load() !== null;
    }
}

// Singleton instance
export const saveManager = new SaveManager();
