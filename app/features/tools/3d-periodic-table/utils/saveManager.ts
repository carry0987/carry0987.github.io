import { getLocalValue, setLocalValue, removeLocalValue } from '@carry0987/utils';
import { LayoutMode, PerformanceLevel } from '../types';

export interface SaveData {
    isPanelOpen: boolean;
    performance: PerformanceLevel;
    layout: LayoutMode;
    savedAt: number;
    version: number;
}

const STORAGE_KEY = 'elemental3d-settings';
const CURRENT_VERSION = 1;

class SaveManager {
    save(data: Partial<Omit<SaveData, 'savedAt' | 'version'>>): boolean {
        const current = this.load() || {
            isPanelOpen: true,
            performance: PerformanceLevel.MEDIUM,
            layout: LayoutMode.TABLE
        };

        const saveData: SaveData = {
            ...current,
            ...data,
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

    getSettings() {
        const data = this.load();
        return {
            isPanelOpen: data?.isPanelOpen ?? true,
            performance: data?.performance ?? PerformanceLevel.MEDIUM,
            layout: data?.layout ?? LayoutMode.TABLE
        };
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
