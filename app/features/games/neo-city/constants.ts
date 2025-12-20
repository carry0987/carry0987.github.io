import { ZoneType, type BuildingConfig } from './types';
import { Eraser, Route, Home, ShoppingCart, Factory, Trees, Bus } from 'lucide-react';

export const GRID_SIZE = 16;
export const TILE_SIZE = 1;

export interface BuildingMetadata extends BuildingConfig {
    description: string;
}

export const BUILDINGS: Record<ZoneType, BuildingMetadata> = {
    [ZoneType.EMPTY]: {
        type: ZoneType.EMPTY,
        cost: 0,
        color: '#2d3748',
        label: 'Bulldoze',
        icon: Eraser,
        description: 'Clear the land for new developments.'
    },
    [ZoneType.ROAD]: {
        type: ZoneType.ROAD,
        cost: 10,
        color: '#4a5568',
        label: 'Road',
        icon: Route,
        description: 'Connect your city. Essential for cars and growth.'
    },
    [ZoneType.RESIDENTIAL]: {
        type: ZoneType.RESIDENTIAL,
        cost: 50,
        color: '#48bb78',
        label: 'Residential',
        icon: Home,
        description: 'Where your citizens live. Provides population.'
    },
    [ZoneType.COMMERCIAL]: {
        type: ZoneType.COMMERCIAL,
        cost: 80,
        color: '#4299e1',
        label: 'Commercial',
        icon: ShoppingCart,
        description: 'Stores and offices. Boosts city income and happiness.'
    },
    [ZoneType.INDUSTRIAL]: {
        type: ZoneType.INDUSTRIAL,
        cost: 120,
        color: '#ecc94b',
        label: 'Industrial',
        icon: Factory,
        description: 'Factories and production. High income but low happiness.'
    },
    [ZoneType.PARK]: {
        type: ZoneType.PARK,
        cost: 200,
        color: '#38b2ac',
        label: 'Park',
        icon: Trees,
        description: 'Green spaces for relaxation. Greatly improves happiness.'
    },
    [ZoneType.BUS_STOP]: {
        type: ZoneType.BUS_STOP,
        cost: 150,
        color: '#f6ad55',
        label: 'Bus Stop',
        icon: Bus,
        description: 'Define routes. Buses stop at nearby roads to pick up citizens.'
    }
};

export const INITIAL_STATS = {
    money: 5000,
    population: 0,
    happiness: 80,
    income: 0,
    expense: 0
};
