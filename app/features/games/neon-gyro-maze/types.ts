export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    WON = 'WON',
    GAME_OVER = 'GAME_OVER'
}

export interface Vector2 {
    x: number;
    y: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

// Simple level map: 1 = Wall, 0 = Floor, 2 = Start, 3 = Goal, 4 = Hole (Reset)
export type LevelGrid = number[][];
