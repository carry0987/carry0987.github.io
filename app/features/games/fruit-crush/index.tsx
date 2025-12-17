import React, { useState, useEffect, useCallback } from 'react';
import { FruitColor, FruitType, GameState, ObjectiveType } from './types';
import type { Board, Position, LevelObjective, MoveHint, VisualEffect } from './types';
import { BOARD_SIZE, FRUIT_COLORS, LEVELS, FRUIT_VISUALS } from './constants';
import { generateBoard, getMatchGroups, copyBoard, isAdjacent, getExplosionImpact } from './utils/gameLogic';
import PixiBoard from './components/PixiBoard';
import { RotateCcw, Trophy, ArrowRight, XCircle, BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [board, setBoard] = useState<Board>([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(LEVELS[0].moves); // Initialize with first level's moves
    const [collectedCounts, setCollectedCounts] = useState<Record<string, number>>({});
    const [effects, setEffects] = useState<VisualEffect[]>([]);

    const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
    const [selectedPos, setSelectedPos] = useState<Position | null>(null);
    const [hint, setHint] = useState<MoveHint | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [hintError, setHintError] = useState<string | null>(null);

    const currentLevel = LEVELS[currentLevelIndex];

    // Initialize board on mount or level change
    useEffect(() => {
        startLevel(currentLevelIndex);
    }, [currentLevelIndex]);

    const startLevel = (index: number) => {
        const config = LEVELS[index];
        setBoard(generateBoard());
        setScore(0);
        setMoves(config.moves);
        setCollectedCounts({});
        setGameState(GameState.IDLE);
        setSelectedPos(null);
        setHint(null);
        setHintError(null);
        setEffects([]);
    };

    const checkObjectives = (currentScore: number, currentCounts: Record<string, number>): boolean => {
        return currentLevel.objectives.every((obj) => {
            if (obj.type === ObjectiveType.TARGET_SCORE) {
                return currentScore >= (obj.target || 0);
            }
            if (obj.type === ObjectiveType.COLLECT) {
                const count = currentCounts[obj.color || ''] || 0;
                return count >= (obj.count || 0);
            }
            return false;
        });
    };

    // The main gravity loop
    const processBoard = useCallback(
        async (currentBoard: Board) => {
            setGameState(GameState.ANIMATING);
            let activeBoard = copyBoard(currentBoard);
            let currentScore = score; // Use local var to track score during animation
            const currentCounts = { ...collectedCounts }; // Use local var for counts

            // Helper function to apply gravity and refill
            const applyGravity = () => {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    let emptyRows: number[] = [];
                    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
                        if (activeBoard[row][col].color === FruitColor.EMPTY) emptyRows.push(row);
                    }

                    // Shift existing down
                    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
                        if (activeBoard[row][col].color !== FruitColor.EMPTY) {
                            let destRow = row;
                            const drops = emptyRows.filter((r) => r > row).length;
                            if (drops > 0) {
                                destRow = row + drops;
                                activeBoard[destRow][col] = { ...activeBoard[row][col], shift: drops };
                                activeBoard[row][col] = {
                                    color: FruitColor.EMPTY,
                                    type: FruitType.NORMAL,
                                    id: -1,
                                    shift: 0
                                };
                            } else {
                                activeBoard[row][col].shift = 0;
                            }
                        }
                    }

                    // Refill top
                    for (let row = 0; row < BOARD_SIZE; row++) {
                        if (activeBoard[row][col].color === FruitColor.EMPTY) {
                            activeBoard[row][col] = {
                                color: FRUIT_COLORS[Math.floor(Math.random() * FRUIT_COLORS.length)],
                                type: FruitType.NORMAL,
                                id: Math.random(),
                                shift: 8 // PixiBoard uses this to spawn it high up
                            };
                        }
                    }
                }
            };

            // Check if there are any empty cells that need gravity first
            const hasEmptyCells = activeBoard.some((row) => row.some((cell) => cell.color === FruitColor.EMPTY));
            if (hasEmptyCells) {
                applyGravity();
                setBoard(copyBoard(activeBoard));
                await new Promise((r) => setTimeout(r, 400));
            }

            let iterations = 0;
            let hasMatches = true;

            // Safety break loop
            while (hasMatches && iterations < 10) {
                const matchGroups = getMatchGroups(activeBoard);

                if (matchGroups.length === 0) {
                    hasMatches = false;
                    break;
                }

                const allPositionsToClear: Position[] = [];
                const spawns: { r: number; c: number; type: FruitType; color: FruitColor }[] = [];

                // Find L-shaped or T-shaped matches (intersecting horizontal and vertical matches)
                const intersectingGroups: Set<number> = new Set();
                for (let i = 0; i < matchGroups.length; i++) {
                    for (let j = i + 1; j < matchGroups.length; j++) {
                        const groupA = matchGroups[i];
                        const groupB = matchGroups[j];
                        // Check if they share a common position and are of same color
                        if (groupA.color === groupB.color && groupA.matchType !== groupB.matchType) {
                            const intersection = groupA.indices.find((posA) =>
                                groupB.indices.some((posB) => posA.row === posB.row && posA.col === posB.col)
                            );
                            if (intersection) {
                                // Calculate total unique positions
                                const uniquePositions = new Set<string>();
                                groupA.indices.forEach((p) => uniquePositions.add(`${p.row},${p.col}`));
                                groupB.indices.forEach((p) => uniquePositions.add(`${p.row},${p.col}`));
                                const totalCount = uniquePositions.size;

                                // If total >= 5, spawn rainbow bomb at intersection
                                if (totalCount >= 5) {
                                    spawns.push({
                                        r: intersection.row,
                                        c: intersection.col,
                                        type: FruitType.RAINBOW_BOMB,
                                        color: FruitColor.RAINBOW
                                    });
                                    intersectingGroups.add(i);
                                    intersectingGroups.add(j);
                                }
                            }
                        }
                    }
                }

                matchGroups.forEach((group, index) => {
                    allPositionsToClear.push(...group.indices);

                    // Skip groups that already spawned a rainbow bomb from L/T intersection
                    if (intersectingGroups.has(index)) return;

                    if (group.length >= 4) {
                        const midIndex = Math.floor(group.indices.length / 2);
                        const spawnPos = group.indices[midIndex];

                        if (group.length >= 5) {
                            spawns.push({
                                r: spawnPos.row,
                                c: spawnPos.col,
                                type: FruitType.RAINBOW_BOMB,
                                color: FruitColor.RAINBOW
                            });
                        } else if (group.length === 4) {
                            const type =
                                group.matchType === 'horizontal'
                                    ? FruitType.VERTICAL_STRIPED
                                    : FruitType.HORIZONTAL_STRIPED;
                            spawns.push({ r: spawnPos.row, c: spawnPos.col, type, color: group.color });
                        }
                    }
                });

                const impactedPositions = getExplosionImpact(activeBoard, allPositionsToClear);

                // --- VISUAL EFFECTS TRIGGER ---
                const newEffects: VisualEffect[] = [];
                impactedPositions.forEach(({ row, col }) => {
                    const fruit = activeBoard[row][col];
                    if (fruit.type === FruitType.HORIZONTAL_STRIPED) {
                        newEffects.push({ id: Math.random(), type: 'ROW_CLEAR', row });
                    } else if (fruit.type === FruitType.VERTICAL_STRIPED) {
                        newEffects.push({ id: Math.random(), type: 'COL_CLEAR', col });
                    }
                });

                if (newEffects.length > 0) {
                    setEffects(newEffects);
                    // Wait for visual effect in Pixi to trigger
                    await new Promise((r) => setTimeout(r, 400));
                    setEffects([]);
                }
                // -----------------------------

                // Execute Clears & Update Counts
                impactedPositions.forEach(({ row, col }) => {
                    const fruit = activeBoard[row][col];
                    if (fruit.color !== FruitColor.EMPTY && fruit.color !== FruitColor.RAINBOW) {
                        currentCounts[fruit.color] = (currentCounts[fruit.color] || 0) + 1;
                        currentScore += 10;
                    } else if (fruit.type === FruitType.RAINBOW_BOMB) {
                        currentScore += 50;
                    }

                    activeBoard[row][col].color = FruitColor.EMPTY;
                    activeBoard[row][col].type = FruitType.NORMAL;
                });

                setScore(currentScore);
                setCollectedCounts({ ...currentCounts });

                // Execute Spawns (Logical placeholder, actual refill handled below)
                spawns.forEach((spawn) => {
                    activeBoard[spawn.r][spawn.c] = {
                        color: spawn.color,
                        type: spawn.type,
                        id: Math.random(),
                        shift: 0
                    };
                });

                // Update Board to show emptiness
                setBoard(copyBoard(activeBoard));
                await new Promise((r) => setTimeout(r, 200));

                // Apply gravity and refill
                applyGravity();

                setBoard(copyBoard(activeBoard));
                // Pixi handles the interpolation, we just wait a bit for it to settle visually
                await new Promise((r) => setTimeout(r, 400));
                iterations++;
            }

            if (checkObjectives(currentScore, currentCounts)) {
                setGameState(GameState.LEVEL_COMPLETE);
            } else if (moves <= 0) {
                setGameState(GameState.IDLE);
            } else {
                setGameState(GameState.IDLE);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [moves, score, collectedCounts, currentLevel]
    );

    // Secondary effect to handle game over state once animation loop finishes and state updates
    useEffect(() => {
        // Only check game over if board is initialized
        if (gameState === GameState.IDLE && board.length > 0) {
            if (checkObjectives(score, collectedCounts)) {
                setGameState(GameState.LEVEL_COMPLETE);
            } else if (moves <= 0) {
                setGameState(GameState.GAME_OVER);
            }
        }
    }, [gameState, moves, score, collectedCounts, currentLevel, board.length]);

    const handleFruitClick = async (row: number, col: number) => {
        if (gameState !== GameState.IDLE) return;
        if (hint) setHint(null);

        const clickedPos = { row, col };

        if (!selectedPos) {
            setSelectedPos(clickedPos);
        } else {
            if (selectedPos.row === row && selectedPos.col === col) {
                setSelectedPos(null);
                return;
            }

            if (isAdjacent(selectedPos, clickedPos)) {
                setSelectedPos(null); // Clear selection immediately so swap animation looks clean
                await attemptSwap(selectedPos, clickedPos);
            } else {
                setSelectedPos(clickedPos);
            }
        }
    };

    const attemptSwap = async (p1: Position, p2: Position) => {
        setGameState(GameState.ANIMATING);

        const newBoard = copyBoard(board);
        const fruit1 = newBoard[p1.row][p1.col];
        const fruit2 = newBoard[p2.row][p2.col];

        // Rainbow Bomb Logic
        const isRainbow1 = fruit1.type === FruitType.RAINBOW_BOMB;
        const isRainbow2 = fruit2.type === FruitType.RAINBOW_BOMB;

        if (isRainbow1 || isRainbow2) {
            let colorToClear: FruitColor = FruitColor.EMPTY;

            // Determine color to clear before any swap
            if (isRainbow1 && !isRainbow2) colorToClear = fruit2.color;
            else if (isRainbow2 && !isRainbow1) colorToClear = fruit1.color;
            else if (isRainbow1 && isRainbow2) {
                // Rainbow + Rainbow - clear entire board
                setEffects([
                    { id: Math.random(), type: 'COLOR_CLEAR', color: FruitColor.RED },
                    { id: Math.random(), type: 'COLOR_CLEAR', color: FruitColor.BLUE },
                    { id: Math.random(), type: 'COLOR_CLEAR', color: FruitColor.GREEN }
                ]);

                newBoard.forEach((row) =>
                    row.forEach((c) => {
                        c.color = FruitColor.EMPTY;
                        c.type = FruitType.NORMAL;
                        c.id = Math.random();
                    })
                );
                setScore((s) => s + 1000);
                setMoves((prev) => prev - 1);
                setBoard(copyBoard(newBoard));
                await new Promise((r) => setTimeout(r, 600));
                setEffects([]);
                await processBoard(newBoard);
                return;
            }

            // Swap visual
            newBoard[p1.row][p1.col] = fruit2;
            newBoard[p2.row][p2.col] = fruit1;
            setBoard(copyBoard(newBoard));
            await new Promise((r) => setTimeout(r, 400));

            setEffects([{ id: Math.random(), type: 'COLOR_CLEAR', color: colorToClear }]);
            await new Promise((r) => setTimeout(r, 600));
            setEffects([]);

            // Clear all fruits of the target color AND any rainbow bombs
            let clearedCount = 0;
            const collectedColors: Record<string, number> = {};

            newBoard.forEach((row) =>
                row.forEach((c) => {
                    // Clear if: matches target color OR is a rainbow bomb
                    const shouldClear = c.color === colorToClear || c.type === FruitType.RAINBOW_BOMB;

                    if (shouldClear) {
                        if (c.color !== FruitColor.EMPTY && c.color !== FruitColor.RAINBOW) {
                            collectedColors[c.color] = (collectedColors[c.color] || 0) + 1;
                        }
                        c.color = FruitColor.EMPTY;
                        c.type = FruitType.NORMAL;
                        c.id = Math.random();
                        clearedCount++;
                    }
                })
            );

            // Update collected counts
            setCollectedCounts((prev) => {
                const updated = { ...prev };
                Object.keys(collectedColors).forEach((color) => {
                    updated[color] = (updated[color] || 0) + collectedColors[color];
                });
                return updated;
            });

            setScore((prev) => prev + clearedCount * 10 + 50);
            setMoves((prev) => prev - 1);
            setBoard(copyBoard(newBoard));
            await new Promise((r) => setTimeout(r, 300));
            await processBoard(newBoard);
            return;
        }

        // Standard Swap
        newBoard[p1.row][p1.col] = fruit2;
        newBoard[p2.row][p2.col] = fruit1;

        setBoard(newBoard);
        // Allow visual animation to complete before checking logic
        await new Promise((r) => setTimeout(r, 400));

        const matchGroups = getMatchGroups(newBoard);

        if (matchGroups.length > 0) {
            setMoves((prev) => prev - 1);
            await processBoard(newBoard);
        } else {
            // Revert
            const revertBoard = copyBoard(newBoard);
            revertBoard[p1.row][p1.col] = fruit1;
            revertBoard[p2.row][p2.col] = fruit2;
            setBoard(revertBoard);
            // Allow revert animation to complete
            await new Promise((r) => setTimeout(r, 400));
            setGameState(GameState.IDLE);
        }
    };

    // Find a valid move by simulating all possible swaps
    const findHint = (currentBoard: Board): MoveHint | null => {
        const directions: Array<{ dr: number; dc: number; dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' }> = [
            { dr: -1, dc: 0, dir: 'UP' },
            { dr: 1, dc: 0, dir: 'DOWN' },
            { dr: 0, dc: -1, dir: 'LEFT' },
            { dr: 0, dc: 1, dir: 'RIGHT' }
        ];

        let bestHint: MoveHint | null = null;
        let bestScore = 0;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                for (const { dr, dc, dir } of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    // Check bounds
                    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) continue;

                    // Skip empty cells
                    if (currentBoard[row][col].color === FruitColor.EMPTY) continue;
                    if (currentBoard[newRow][newCol].color === FruitColor.EMPTY) continue;

                    // Simulate swap
                    const testBoard = copyBoard(currentBoard);
                    const temp = testBoard[row][col];
                    testBoard[row][col] = testBoard[newRow][newCol];
                    testBoard[newRow][newCol] = temp;

                    // Check for matches
                    const matches = getMatchGroups(testBoard);
                    if (matches.length > 0) {
                        // Calculate score based on match quality
                        let score = 0;
                        for (const match of matches) {
                            score += match.length * 10;
                            if (match.length >= 4) score += 20; // Bonus for special fruit
                            if (match.length >= 5) score += 30; // Bonus for color bomb
                        }

                        if (score > bestScore) {
                            bestScore = score;
                            const matchLengths = matches.map((m) => m.length);
                            const maxMatch = Math.max(...matchLengths);
                            let reason = `Match ${maxMatch} fruits`;
                            if (maxMatch >= 5) reason += ' - Creates a Rainbow Bomb!';
                            else if (maxMatch >= 4) reason += ' - Creates a Striped Fruit!';

                            bestHint = { row, col, direction: dir, reason };
                        }
                    }
                }
            }
        }

        return bestHint;
    };

    const handleGetHint = async () => {
        if (gameState !== GameState.IDLE || isThinking || moves <= 0) return;
        setIsThinking(true);
        setHintError(null);
        setHint(null);

        const hintResult = findHint(board);

        setIsThinking(false);
        if (hintResult) {
            setHint(hintResult);
        } else {
            setHintError('No valid moves found!');
            setTimeout(() => setHintError(null), 3000);
        }
    };

    const nextLevel = () => {
        if (currentLevelIndex < LEVELS.length - 1) {
            setCurrentLevelIndex((prev) => prev + 1);
        } else {
            setCurrentLevelIndex(0);
        }
    };

    const restartLevel = () => {
        startLevel(currentLevelIndex);
    };

    // Render Objectives Helper
    const renderObjective = (obj: LevelObjective, idx: number) => {
        if (obj.type === ObjectiveType.TARGET_SCORE) {
            return (
                <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs text-gray-300 uppercase tracking-wide">Target</span>
                    <div className="flex items-end gap-1">
                        <span
                            className={`text-xl font-bold ${score >= (obj.target || 0) ? 'text-green-400' : 'text-white'}`}>
                            {score}
                        </span>
                        <span className="text-sm text-gray-400 mb-1">/ {obj.target}</span>
                    </div>
                </div>
            );
        }
        if (obj.type === ObjectiveType.COLLECT && obj.color) {
            const current = collectedCounts[obj.color] || 0;
            const target = obj.count || 0;
            const visual = FRUIT_VISUALS[obj.color];
            const isDone = current >= target;

            return (
                <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs text-gray-300 uppercase tracking-wide mb-1">Collect</span>
                    <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isDone ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/10'}`}>
                        <span className="text-xl filter drop-shadow-md">{visual.icon}</span>
                        <span className={`font-bold ${isDone ? 'text-green-400' : 'text-white'}`}>
                            {current}/{target}
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-x-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            {/* Header Level Info */}
            <div className="w-full max-w-lg mb-4 flex justify-between items-center z-10">
                <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                    <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Level</span>
                        <span className="text-lg font-black text-white leading-none">{currentLevel.id}</span>
                    </div>
                </div>

                <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex flex-col items-center min-w-25">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Moves</span>
                    <span
                        className={`text-2xl font-black leading-none ${moves < 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                        {moves}
                    </span>
                </div>
            </div>

            {/* Objective Bar */}
            <div className="w-full max-w-lg mb-6 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl flex justify-around items-center gap-4 z-10">
                {currentLevel.objectives.map((obj, i) => renderObjective(obj, i))}
            </div>

            {/* Main Board Area (PixiJS) */}
            <div className="relative p-3 bg-[#2d2d44] rounded-2xl shadow-2xl border-4 border-[#3e3e5e] board-bg z-10 flex justify-center items-center">
                <PixiBoard
                    board={board}
                    onFruitClick={handleFruitClick}
                    selectedPos={selectedPos}
                    hint={hint}
                    effects={effects}
                />

                {/* Thinking Overlay */}
                {isThinking && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-sm">
                        <div className="flex flex-col items-center animate-pulse">
                            <BrainCircuit className="w-12 h-12 text-purple-400 mb-2" />
                            <span className="text-purple-200 font-bold">Gemini is thinking...</span>
                        </div>
                    </div>
                )}

                {/* Level Complete Overlay */}
                {gameState === GameState.LEVEL_COMPLETE && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-green-900/90 rounded-xl backdrop-blur-md animate-fade-in">
                        <div className="text-center p-6 w-full">
                            <div className="inline-block p-4 rounded-full bg-green-500/20 mb-4 animate-bounce">
                                <Trophy className="w-16 h-16 text-yellow-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">Level Complete!</h2>
                            <p className="text-green-200 mb-6 font-medium">Excellent work!</p>
                            <button
                                onClick={nextLevel}
                                className="w-full bg-linear-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                Next Level <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Over Overlay */}
                {gameState === GameState.GAME_OVER && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-900/90 rounded-xl backdrop-blur-md animate-fade-in">
                        <div className="text-center p-6 w-full">
                            <div className="inline-block p-4 rounded-full bg-red-500/20 mb-4">
                                <XCircle className="w-16 h-16 text-red-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">Level Failed</h2>
                            <p className="text-red-200 mb-6 font-medium">Out of moves!</p>
                            <button
                                onClick={restartLevel}
                                className="w-full bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                Try Again <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Controls */}
            <div className="w-full max-w-md mt-6 flex gap-4 justify-center z-10">
                <button
                    onClick={handleGetHint}
                    disabled={moves <= 0 || isThinking || gameState !== GameState.IDLE}
                    className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 active:translate-y-0">
                    <Sparkles className="w-5 h-5" />
                    {hint ? 'Hint Active' : 'Hint'}
                </button>

                <button
                    onClick={restartLevel}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-2xl shadow-lg flex items-center justify-center transition-colors backdrop-blur-md"
                    title="Restart Level">
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Hint Text */}
            {hint && hint.reason && (
                <div className="mt-4 max-w-md bg-purple-900/80 backdrop-blur-md border border-purple-500/30 p-3 rounded-xl text-purple-100 text-sm flex items-start gap-2 animate-fade-in z-10 shadow-lg">
                    <BrainCircuit className="w-5 h-5 text-purple-300 mt-0.5 shrink-0" />
                    <p>{hint.reason}</p>
                </div>
            )}

            {/* Error Toast */}
            {hintError && (
                <div className="mt-4 bg-red-900/80 backdrop-blur-md border border-red-500/30 p-3 rounded-xl text-red-100 text-sm flex items-center gap-2 z-10 shadow-lg">
                    <AlertCircle className="w-4 h-4" />
                    {hintError}
                </div>
            )}
        </div>
    );
};

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export function meta() {
    return [
        { title: 'Fruit Crush | Carry' },
        {
            property: 'og:title',
            content: 'Fruit Crush'
        },
        {
            name: 'description',
            content: 'A colorful match-3 puzzle game with special fruit power-ups and multiple levels'
        }
    ];
}

export default App;
