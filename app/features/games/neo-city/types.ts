export enum ZoneType {
    EMPTY = 'EMPTY',
    ROAD = 'ROAD',
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    INDUSTRIAL = 'INDUSTRIAL',
    PARK = 'PARK',
    BUS_STOP = 'BUS_STOP'
}

export interface TileData {
    x: number;
    z: number;
    type: ZoneType;
    level: number;
}

export interface CityStats {
    money: number;
    population: number;
    day: number;
    income: number;
    expense: number;
}

export interface BuildingConfig {
    type: ZoneType;
    cost: number;
    color: string;
    label: string;
    icon: any;
    description?: string;
}

export interface FeedMessage {
    id: string;
    user: string;
    content: string;
    timestamp: string;
    type: 'positive' | 'negative' | 'neutral';
}

export interface SaveData {
    cityData: TileData[];
    stats: CityStats;
    cityName: string;
    gameTime: number;
    feedMessages: FeedMessage[];
    savedAt: number;
    version: number;
}

export interface SaveSettings {
    autoSaveEnabled: boolean;
    lastSavedAt: number | null;
}

export type PerformanceLevel = 'low' | 'medium' | 'high';

export interface PerformanceSettings {
    level: PerformanceLevel;
    shadows: boolean;
    environmentEffects: boolean;
    pixelRatio: number;
    antialias: boolean;
    shadowMapSize: number;
    maxLights: number;
}

export const PERFORMANCE_PRESETS: Record<PerformanceLevel, PerformanceSettings> = {
    low: {
        level: 'low',
        shadows: false,
        environmentEffects: false,
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 512,
        maxLights: 1
    },
    medium: {
        level: 'medium',
        shadows: true,
        environmentEffects: true,
        pixelRatio: 1.5,
        antialias: false,
        shadowMapSize: 1024,
        maxLights: 2
    },
    high: {
        level: 'high',
        shadows: true,
        environmentEffects: true,
        pixelRatio: 2,
        antialias: true,
        shadowMapSize: 2048,
        maxLights: 4
    }
};
