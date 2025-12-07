export enum BuildingType {
    None = 'None',
    Road = 'Road',
    Residential = 'Residential',
    Commercial = 'Commercial',
    Industrial = 'Industrial',
    Park = 'Park'
}

export interface BuildingConfig {
    type: BuildingType;
    cost: number;
    name: string;
    description: string;
    color: string; // Main color for 3D material
    popGen: number; // Population generation per tick
    incomeGen: number; // Money generation per tick
}

export interface TileData {
    x: number;
    y: number;
    buildingType: BuildingType;
    // Suggested by AI for visual variety later
    variant?: number;
}

export type Grid = TileData[][];

export interface CityStats {
    money: number;
    population: number;
    day: number;
}

export interface NewsItem {
    id: string;
    text: string;
    type: 'positive' | 'negative' | 'neutral';
}

export interface SaveSettings {
    autoSaveEnabled: boolean;
    lastSavedAt: number | null;
}
