import { FruitColor, FruitType } from '../types';
import type { Board, FruitItem, Position, MatchResult } from '../types';
import { BOARD_SIZE, FRUIT_COLORS } from '../constants';

let globalIdCounter = 0;
const generateId = () => {
    return ++globalIdCounter;
};

export const generateBoard = (clusterChance: number = 0.4): Board => {
    const newBoard: Board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row: FruitItem[] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            let randomColor: FruitColor;

            // Try to cluster colors for easier testing (more adjacent same-color blocks)
            const neighbors: FruitColor[] = [];
            if (j > 0 && row[j - 1].color !== FruitColor.EMPTY) neighbors.push(row[j - 1].color);
            if (i > 0 && newBoard[i - 1][j].color !== FruitColor.EMPTY) neighbors.push(newBoard[i - 1][j].color);
            if (i > 0 && j > 0 && newBoard[i - 1][j - 1].color !== FruitColor.EMPTY)
                neighbors.push(newBoard[i - 1][j - 1].color);

            // With clusterChance probability, try to use a neighbor's color
            if (neighbors.length > 0 && Math.random() < clusterChance) {
                randomColor = neighbors[Math.floor(Math.random() * neighbors.length)];
            } else {
                randomColor = FRUIT_COLORS[Math.floor(Math.random() * FRUIT_COLORS.length)];
            }

            // Prevent initial matches (3 in a row)
            while (
                (j >= 2 && row[j - 1].color === randomColor && row[j - 2].color === randomColor) ||
                (i >= 2 && newBoard[i - 1][j].color === randomColor && newBoard[i - 2][j].color === randomColor)
            ) {
                randomColor = FRUIT_COLORS[Math.floor(Math.random() * FRUIT_COLORS.length)];
            }

            row.push({ color: randomColor, type: FruitType.NORMAL, id: generateId(), shift: 0 });
        }
        newBoard.push(row);
    }
    return newBoard;
};

// Returns grouped matches so we can determine if it was a 3, 4, or 5 match
export const getMatchGroups = (board: Board): MatchResult[] => {
    const groups: MatchResult[] = [];
    const visited = new Set<string>();

    // Horizontal Matches
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c].color === FruitColor.EMPTY || board[r][c].color === FruitColor.RAINBOW) continue;

            let k = c + 1;
            while (k < BOARD_SIZE && board[r][k].color === board[r][c].color) {
                k++;
            }
            const length = k - c;
            if (length >= 3) {
                const indices: Position[] = [];
                for (let l = 0; l < length; l++) indices.push({ row: r, col: c + l });

                // Check if this group is already largely accounted for (subset logic omitted for simplicity, using exact ranges)
                groups.push({
                    indices,
                    matchType: 'horizontal',
                    length,
                    color: board[r][c].color
                });
                c = k - 1; // Skip ahead
            }
        }
    }

    // Vertical Matches
    for (let c = 0; c < BOARD_SIZE; c++) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            if (board[r][c].color === FruitColor.EMPTY || board[r][c].color === FruitColor.RAINBOW) continue;

            let k = r + 1;
            while (k < BOARD_SIZE && board[k][c].color === board[r][c].color) {
                k++;
            }
            const length = k - r;
            if (length >= 3) {
                const indices: Position[] = [];
                for (let l = 0; l < length; l++) indices.push({ row: r + l, col: c });

                groups.push({
                    indices,
                    matchType: 'vertical',
                    length,
                    color: board[r][c].color
                });
                r = k - 1;
            }
        }
    }

    return groups;
};

// Recursively find all positions to clear including special fruit effects
export const getExplosionImpact = (board: Board, initialPositions: Position[]): Position[] => {
    const impactSet = new Set<string>();
    const queue = [...initialPositions];
    const processed = new Set<string>();

    while (queue.length > 0) {
        const pos = queue.shift()!;
        const key = `${pos.row},${pos.col}`;

        if (processed.has(key)) continue;
        processed.add(key);
        impactSet.add(key);

        // Validate bounds
        if (pos.row < 0 || pos.row >= BOARD_SIZE || pos.col < 0 || pos.col >= BOARD_SIZE) continue;

        const fruit = board[pos.row][pos.col];
        if (fruit.color === FruitColor.EMPTY) continue;

        // Trigger Special Effects
        if (fruit.type === FruitType.HORIZONTAL_STRIPED) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (!processed.has(`${pos.row},${c}`)) queue.push({ row: pos.row, col: c });
            }
        } else if (fruit.type === FruitType.VERTICAL_STRIPED) {
            for (let r = 0; r < BOARD_SIZE; r++) {
                if (!processed.has(`${r},${pos.col}`)) queue.push({ row: r, col: pos.col });
            }
        } else if (fruit.type === FruitType.RAINBOW_BOMB) {
            // Rainbow bombs usually trigger via swap, but if destroyed by another bomb,
            // let's say they explode the board or random fruits. For safety, just clear itself.
        }
    }

    return Array.from(impactSet).map((s) => {
        const [row, col] = s.split(',').map(Number);
        return { row, col };
    });
};

export const copyBoard = (board: Board): Board => {
    return board.map((row) => row.map((fruit) => ({ ...fruit })));
};

export const isAdjacent = (p1: Position, p2: Position): boolean => {
    const rowDiff = Math.abs(p1.row - p2.row);
    const colDiff = Math.abs(p1.col - p2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};
