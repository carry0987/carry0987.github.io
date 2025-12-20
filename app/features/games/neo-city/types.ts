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
    happiness: number;
    income: number;
    expense: number;
}

export interface BuildingConfig {
    type: ZoneType;
    cost: number;
    color: string;
    label: string;
    icon: string;
}

export interface FeedMessage {
    id: string;
    user: string;
    content: string;
    timestamp: string;
    type: 'positive' | 'negative' | 'neutral';
}
