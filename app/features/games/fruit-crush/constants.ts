import { FruitColor, ObjectiveType } from './types';
import type { LevelConfig } from './types';

export const BOARD_SIZE = 8;
export const MOVES_LIMIT = 20; // Default fallback

export const FRUIT_COLORS = [
    FruitColor.RED,
    FruitColor.ORANGE,
    FruitColor.YELLOW,
    FruitColor.GREEN,
    FruitColor.BLUE,
    FruitColor.PURPLE
];

// For DOM elements (UI)
export const FRUIT_VISUALS: Record<FruitColor, { bg: string; ring: string; icon: string }> = {
    [FruitColor.RED]: { bg: 'bg-red-500', ring: 'ring-red-300', icon: '❤️' },
    [FruitColor.ORANGE]: { bg: 'bg-orange-500', ring: 'ring-orange-300', icon: '🍊' },
    [FruitColor.YELLOW]: { bg: 'bg-yellow-400', ring: 'ring-yellow-200', icon: '⭐' },
    [FruitColor.GREEN]: { bg: 'bg-green-500', ring: 'ring-green-300', icon: '🍀' },
    [FruitColor.BLUE]: { bg: 'bg-blue-500', ring: 'ring-blue-300', icon: '💧' },
    [FruitColor.PURPLE]: { bg: 'bg-purple-500', ring: 'ring-purple-300', icon: '🍇' },
    [FruitColor.EMPTY]: { bg: 'bg-transparent', ring: 'ring-transparent', icon: '' },
    [FruitColor.RAINBOW]: {
        bg: 'bg-gradient-to-br from-red-400 via-yellow-400 to-blue-500',
        ring: 'ring-white',
        icon: '🌈'
    }
};

// For PixiJS (WebGL)
export const FRUIT_COLOR_HEX: Record<FruitColor, number> = {
    [FruitColor.RED]: 0xef4444, // red-500
    [FruitColor.ORANGE]: 0xf97316, // orange-500
    [FruitColor.YELLOW]: 0xfacc15, // yellow-400
    [FruitColor.GREEN]: 0x22c55e, // green-500
    [FruitColor.BLUE]: 0x3b82f6, // blue-500
    [FruitColor.PURPLE]: 0xa855f7, // purple-500
    [FruitColor.EMPTY]: 0x000000,
    [FruitColor.RAINBOW]: 0xffffff
};

export const LEVELS: LevelConfig[] = [
    {
        id: 1,
        moves: 20,
        description: 'Score 1000 points',
        objectives: [{ type: ObjectiveType.TARGET_SCORE, target: 1000 }]
    },
    {
        id: 2,
        moves: 30,
        description: 'Collect 12 Red Fruits',
        objectives: [{ type: ObjectiveType.COLLECT, color: FruitColor.RED, count: 12 }]
    },
    {
        id: 3,
        moves: 40,
        description: 'Collect 10 Blue and 10 Green',
        objectives: [
            { type: ObjectiveType.COLLECT, color: FruitColor.BLUE, count: 10 },
            { type: ObjectiveType.COLLECT, color: FruitColor.GREEN, count: 10 }
        ]
    },
    {
        id: 4,
        moves: 50,
        description: 'Score 3000 pts & Collect 10 Purple',
        objectives: [
            { type: ObjectiveType.TARGET_SCORE, target: 3000 },
            { type: ObjectiveType.COLLECT, color: FruitColor.PURPLE, count: 10 }
        ]
    },
    {
        id: 5,
        moves: 60,
        description: 'Master: Score 5000 pts',
        objectives: [{ type: ObjectiveType.TARGET_SCORE, target: 5000 }]
    }
];
