import { CandyColor, ObjectiveType } from './types';
import type { LevelConfig } from './types';

export const BOARD_SIZE = 8;
export const MOVES_LIMIT = 20; // Default fallback

export const CANDY_COLORS = [
    CandyColor.RED,
    CandyColor.ORANGE,
    CandyColor.YELLOW,
    CandyColor.GREEN,
    CandyColor.BLUE,
    CandyColor.PURPLE
];

// For DOM elements (UI)
export const CANDY_VISUALS: Record<CandyColor, { bg: string; ring: string; icon: string }> = {
    [CandyColor.RED]: { bg: 'bg-red-500', ring: 'ring-red-300', icon: '❤️' },
    [CandyColor.ORANGE]: { bg: 'bg-orange-500', ring: 'ring-orange-300', icon: '🍊' },
    [CandyColor.YELLOW]: { bg: 'bg-yellow-400', ring: 'ring-yellow-200', icon: '⭐' },
    [CandyColor.GREEN]: { bg: 'bg-green-500', ring: 'ring-green-300', icon: '🍀' },
    [CandyColor.BLUE]: { bg: 'bg-blue-500', ring: 'ring-blue-300', icon: '💧' },
    [CandyColor.PURPLE]: { bg: 'bg-purple-500', ring: 'ring-purple-300', icon: '🍇' },
    [CandyColor.EMPTY]: { bg: 'bg-transparent', ring: 'ring-transparent', icon: '' },
    [CandyColor.RAINBOW]: {
        bg: 'bg-gradient-to-br from-red-400 via-yellow-400 to-blue-500',
        ring: 'ring-white',
        icon: '🌈'
    }
};

// For PixiJS (WebGL)
export const CANDY_COLOR_HEX: Record<CandyColor, number> = {
    [CandyColor.RED]: 0xef4444, // red-500
    [CandyColor.ORANGE]: 0xf97316, // orange-500
    [CandyColor.YELLOW]: 0xfacc15, // yellow-400
    [CandyColor.GREEN]: 0x22c55e, // green-500
    [CandyColor.BLUE]: 0x3b82f6, // blue-500
    [CandyColor.PURPLE]: 0xa855f7, // purple-500
    [CandyColor.EMPTY]: 0x000000,
    [CandyColor.RAINBOW]: 0xffffff
};

export const LEVELS: LevelConfig[] = [
    {
        id: 1,
        moves: 15,
        description: 'Score 1000 points',
        objectives: [{ type: ObjectiveType.TARGET_SCORE, target: 1000 }]
    },
    {
        id: 2,
        moves: 20,
        description: 'Collect 12 Red Candies',
        objectives: [{ type: ObjectiveType.COLLECT, color: CandyColor.RED, count: 12 }]
    },
    {
        id: 3,
        moves: 20,
        description: 'Collect 10 Blue and 10 Green',
        objectives: [
            { type: ObjectiveType.COLLECT, color: CandyColor.BLUE, count: 10 },
            { type: ObjectiveType.COLLECT, color: CandyColor.GREEN, count: 10 }
        ]
    },
    {
        id: 4,
        moves: 25,
        description: 'Score 3000 pts & Collect 10 Purple',
        objectives: [
            { type: ObjectiveType.TARGET_SCORE, target: 3000 },
            { type: ObjectiveType.COLLECT, color: CandyColor.PURPLE, count: 10 }
        ]
    },
    {
        id: 5,
        moves: 30,
        description: 'Master: Score 5000 pts',
        objectives: [{ type: ObjectiveType.TARGET_SCORE, target: 5000 }]
    }
];
