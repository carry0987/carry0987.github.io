export const TILE_SIZE = 2;
export const BALL_RADIUS = 0.6;
export const BOARD_THICKNESS = 1;

// Physics constants
export const GRAVITY_SCALE = 0.15;
export const FRICTION = 0.96;
export const MAX_VELOCITY = 0.8;
export const SHAKE_THRESHOLD = 15;

// 1: Wall, 0: Path, 2: Start, 3: Goal, 4: Hole (Void)
export const LEVEL_1: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 0, 0, 4, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 4, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
