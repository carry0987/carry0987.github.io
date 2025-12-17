export enum CandyColor {
    RED = 'RED',
    ORANGE = 'ORANGE',
    YELLOW = 'YELLOW',
    GREEN = 'GREEN',
    BLUE = 'BLUE',
    PURPLE = 'PURPLE',
    EMPTY = 'EMPTY',
    RAINBOW = 'RAINBOW' // Special color for Color Bombs
}

export enum CandyType {
    NORMAL = 'NORMAL',
    HORIZONTAL_STRIPED = 'HORIZONTAL_STRIPED', // Clears a row
    VERTICAL_STRIPED = 'VERTICAL_STRIPED', // Clears a column
    RAINBOW_BOMB = 'RAINBOW_BOMB' // Clears all of one color
}

export interface CandyItem {
    color: CandyColor;
    type: CandyType;
    id: number; // Unique ID for React keys and tracking
    shift?: number; // Number of rows to shift visually (for gravity animation)
}

export interface Position {
    row: number;
    col: number;
}

export interface MoveHint {
    row: number;
    col: number;
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    reason?: string;
}

export type Board = CandyItem[][];

export interface MatchResult {
    indices: Position[];
    matchType: 'horizontal' | 'vertical';
    length: number;
    color: CandyColor;
}

export enum GameState {
    IDLE = 'IDLE',
    SELECTED = 'SELECTED',
    ANIMATING = 'ANIMATING',
    GAME_OVER = 'GAME_OVER',
    LEVEL_COMPLETE = 'LEVEL_COMPLETE'
}

export enum ObjectiveType {
    TARGET_SCORE = 'TARGET_SCORE',
    COLLECT = 'COLLECT'
}

export interface LevelObjective {
    type: ObjectiveType;
    target?: number; // For score
    color?: CandyColor; // For collect
    count?: number; // For collect
}

export interface LevelConfig {
    id: number;
    moves: number;
    objectives: LevelObjective[];
    description: string;
}

export interface VisualEffect {
    id: number;
    type: 'ROW_CLEAR' | 'COL_CLEAR' | 'COLOR_CLEAR';
    row?: number;
    col?: number;
    color?: CandyColor;
}
