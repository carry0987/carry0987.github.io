import React, { useRef, useEffect, useState } from 'react';
import { Application, Container, Graphics, Text, Rectangle, Ticker } from 'pixi.js';
import { CandyColor, CandyType } from '../types';
import type { Board, MoveHint, Position, VisualEffect } from '../types';
import { BOARD_SIZE, CANDY_COLOR_HEX, CANDY_VISUALS } from '../constants';

interface PixiBoardProps {
    board: Board;
    onCandyClick: (row: number, col: number) => void;
    selectedPos: Position | null;
    hint: MoveHint | null;
    effects: VisualEffect[];
}

// Interfaces for our custom Pixi objects
type CandySprite = Container & {
    candyId: number;
    gridRow: number;
    gridCol: number;
    visual: Graphics; // The colored rounded rect
    iconText: Text; // The emoji
    selectionRing: Graphics; // The selection border
    targetX: number; // Where it wants to be
    targetY: number; // Where it wants to be
};

const CELL_SIZE = 50; // Base logical size, we will scale entire container
const GAP = 6;
const GRID_WIDTH = BOARD_SIZE * (CELL_SIZE + GAP) + GAP;

const PixiBoard: React.FC<PixiBoardProps> = ({ board, onCandyClick, selectedPos, hint, effects }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const boardContainerRef = useRef<Container | null>(null);
    const effectsContainerRef = useRef<Container | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Map to track existing sprites by ID to avoid recreating them
    const spritesMap = useRef<Map<number, CandySprite>>(new Map());

    // Use a ref to store the latest click handler to avoid stale closures in Pixi events
    const onCandyClickRef = useRef(onCandyClick);

    // Keep the ref updated with the latest prop
    useEffect(() => {
        onCandyClickRef.current = onCandyClick;
    }, [onCandyClick]);

    // Initialize Pixi Application
    useEffect(() => {
        if (!containerRef.current) return;

        let app: Application | null = null;
        let destroyed = false;

        const initPixi = async () => {
            // Determine dimensions based on viewport
            const size = Math.min(window.innerWidth * 0.9, 400);
            const resolution = window.devicePixelRatio || 1;

            app = new Application();
            await app.init({
                width: size,
                height: size,
                backgroundAlpha: 0, // Transparent background
                resolution: resolution,
                autoDensity: true,
                antialias: true
            });

            if (destroyed) {
                app.destroy(true, { children: true });
                return;
            }

            containerRef.current?.appendChild(app.canvas);
            appRef.current = app;

            // Main container that holds the grid
            const boardContainer = new Container();
            // Center it
            const scale = size / GRID_WIDTH;
            boardContainer.scale.set(scale);
            boardContainer.x = (size - GRID_WIDTH * scale) / 2; // Should be 0 if fully fitted
            boardContainer.y = (size - GRID_WIDTH * scale) / 2;

            app.stage.addChild(boardContainer);
            boardContainerRef.current = boardContainer;

            // Effects container (on top of board)
            const effectsContainer = new Container();
            effectsContainer.scale.set(scale);
            effectsContainer.x = boardContainer.x;
            effectsContainer.y = boardContainer.y;
            app.stage.addChild(effectsContainer);
            effectsContainerRef.current = effectsContainer;

            // Animation Loop
            app.ticker.add((ticker: Ticker) => {
                const delta = ticker.deltaTime;
                // Lerp Sprites
                spritesMap.current.forEach((sprite) => {
                    // Smooth movement (spring-like lerp) - 0.15 for smoother animation
                    sprite.x += (sprite.targetX - sprite.x) * 0.15 * delta;
                    sprite.y += (sprite.targetY - sprite.y) * 0.15 * delta;

                    // Selection Logic
                    const isSelected = selectedPos?.row === sprite.gridRow && selectedPos?.col === sprite.gridCol;
                    const targetScale = isSelected ? 1.15 : 1.0;
                    sprite.scale.x += (targetScale - sprite.scale.x) * 0.2 * delta;
                    sprite.scale.y += (targetScale - sprite.scale.y) * 0.2 * delta;
                    sprite.selectionRing.alpha = isSelected ? 1 : 0;

                    // Dynamic Z-Index: Lift moving items
                    const dx = Math.abs(sprite.targetX - sprite.x);
                    const dy = Math.abs(sprite.targetY - sprite.y);
                    const isMoving = dx > 2 || dy > 2;

                    if (isSelected) {
                        sprite.zIndex = 100;
                    } else if (isMoving) {
                        sprite.zIndex = 50;
                    } else {
                        sprite.zIndex = 1;
                    }
                });

                // Sort for z-index (bring selected to front)
                boardContainer.sortChildren();
            });

            setIsReady(true);
        };

        initPixi();

        return () => {
            destroyed = true;
            if (app) {
                app.destroy(true, { children: true });
            }
        };
    }, []); // Only run once on mount

    // Sync React State with Pixi Scene
    useEffect(() => {
        if (!appRef.current || !boardContainerRef.current || !isReady) return;
        const container = boardContainerRef.current;
        const currentIds = new Set<number>();

        board.forEach((row, rowIndex) => {
            row.forEach((candy, colIndex) => {
                if (candy.color === CandyColor.EMPTY) return;

                currentIds.add(candy.id);
                const x = GAP + colIndex * (CELL_SIZE + GAP) + CELL_SIZE / 2;
                const y = GAP + rowIndex * (CELL_SIZE + GAP) + CELL_SIZE / 2;

                let sprite = spritesMap.current.get(candy.id);

                // Create new Sprite if it doesn't exist
                if (!sprite) {
                    sprite = createCandySprite(candy.color, candy.type, candy.id);

                    // Interaction
                    sprite.eventMode = 'static';
                    sprite.cursor = 'pointer';

                    // IMPORTANT: Use the Ref to call the function.
                    // This ensures we always call the latest version of onCandyClick from App.tsx
                    sprite.on('pointerdown', () => {
                        if (onCandyClickRef.current) {
                            onCandyClickRef.current(sprite!.gridRow, sprite!.gridCol);
                        }
                    });

                    // Spawn logic
                    if (candy.shift && candy.shift > 0) {
                        sprite.x = x;
                        sprite.y = y - candy.shift * (CELL_SIZE + GAP);
                    } else {
                        // Fade in spawn
                        sprite.x = x;
                        sprite.y = y;
                        sprite.alpha = 0;
                        const fadeIn = () => {
                            if (sprite && sprite.alpha < 1) {
                                sprite.alpha += 0.1;
                                requestAnimationFrame(fadeIn);
                            }
                        };
                        fadeIn();
                    }

                    container.addChild(sprite);
                    spritesMap.current.set(candy.id, sprite);
                }

                // Update Target Data
                sprite.gridRow = rowIndex;
                sprite.gridCol = colIndex;
                sprite.targetX = x;
                sprite.targetY = y;

                // Handle Hint Visuals
                const isHinted =
                    hint &&
                    ((hint.row === rowIndex && hint.col === colIndex) ||
                        (hint.direction === 'UP' && hint.row - 1 === rowIndex && hint.col === colIndex) ||
                        (hint.direction === 'DOWN' && hint.row + 1 === rowIndex && hint.col === colIndex) ||
                        (hint.direction === 'LEFT' && hint.row === rowIndex && hint.col - 1 === colIndex) ||
                        (hint.direction === 'RIGHT' && hint.row === rowIndex && hint.col + 1 === colIndex));

                if (isHinted) {
                    sprite.visual.tint = 0xffffff; // Reset tint
                    const time = Date.now() / 200;
                    const val = 0.8 + Math.sin(time) * 0.2;
                    sprite.alpha = val;
                } else {
                    sprite.alpha = 1;
                }
            });
        });

        // Cleanup Removed Sprites
        spritesMap.current.forEach((sprite, id) => {
            if (!currentIds.has(id)) {
                // Animate out
                const animateOut = () => {
                    sprite.scale.x -= 0.1;
                    sprite.scale.y -= 0.1;
                    sprite.alpha -= 0.1;
                    if (sprite.alpha <= 0) {
                        container.removeChild(sprite);
                        sprite.destroy();
                    } else {
                        requestAnimationFrame(animateOut);
                    }
                };
                animateOut();
                spritesMap.current.delete(id);
            }
        });
    }, [board, selectedPos, hint, isReady]); // removed onCandyClick from deps to prevent re-running loop unnecessarily

    // Handle Visual Effects (Beams/Zaps)
    useEffect(() => {
        if (!effectsContainerRef.current || effects.length === 0) return;
        const container = effectsContainerRef.current;

        effects.forEach((effect) => {
            if (effect.type === 'ROW_CLEAR' && effect.row !== undefined) {
                const rect = new Graphics();
                rect.rect(0, 0, GRID_WIDTH, CELL_SIZE);
                rect.fill(0xffffff);
                rect.y = GAP + effect.row * (CELL_SIZE + GAP);
                rect.alpha = 0.8;
                container.addChild(rect);

                // Animate
                let t = 0;
                const tick = () => {
                    t += 0.1;
                    rect.scale.y = 1 - t;
                    rect.alpha = 1 - t;
                    if (t < 1) requestAnimationFrame(tick);
                    else {
                        container.removeChild(rect);
                        rect.destroy();
                    }
                };
                tick();
            }

            if (effect.type === 'COL_CLEAR' && effect.col !== undefined) {
                const rect = new Graphics();
                rect.rect(0, 0, CELL_SIZE, GRID_WIDTH);
                rect.fill(0xffffff);
                rect.x = GAP + effect.col * (CELL_SIZE + GAP);
                rect.alpha = 0.8;
                container.addChild(rect);

                let t = 0;
                const tick = () => {
                    t += 0.1;
                    rect.scale.x = 1 - t;
                    rect.alpha = 1 - t;
                    if (t < 1) requestAnimationFrame(tick);
                    else {
                        container.removeChild(rect);
                        rect.destroy();
                    }
                };
                tick();
            }

            if (effect.type === 'COLOR_CLEAR' && effect.color) {
                spritesMap.current.forEach(() => {
                    const flash = new Graphics();
                    flash.rect(0, 0, GRID_WIDTH, GRID_WIDTH);
                    flash.fill(CANDY_COLOR_HEX[effect.color!]);
                    flash.alpha = 0.3;
                    container.addChild(flash);
                    let t = 0;
                    const tick = () => {
                        t += 0.05;
                        flash.alpha = 0.3 - t * 0.3;
                        if (t < 1) requestAnimationFrame(tick);
                        else {
                            container.removeChild(flash);
                            flash.destroy();
                        }
                    };
                    tick();
                });
            }
        });
    }, [effects]);

    return <div ref={containerRef} className="w-full flex justify-center items-center" />;
};

// Helper to build sprite
function createCandySprite(color: CandyColor, type: CandyType, id: number): CandySprite {
    const container = new Container() as CandySprite;
    container.candyId = id;

    const size = CELL_SIZE;
    const hex = CANDY_COLOR_HEX[color];

    // Main Body
    const visual = new Graphics();

    if (color === CandyColor.RAINBOW) {
        visual.roundRect(-size / 2, -size / 2, size, size, 12);
        visual.stroke({ width: 2, color: 0xcccccc });
        visual.fill(0xffffff);
    } else {
        visual.roundRect(-size / 2, -size / 2, size, size, 12);
        visual.fill(hex);
    }

    // Shine/Gloss
    visual.circle(-size / 4, -size / 4, size / 6);
    visual.fill({ color: 0xffffff, alpha: 0.3 });

    // Bottom Shadow
    visual.roundRect(-size / 2, size / 2 - 5, size, 5, 4);
    visual.fill({ color: 0x000000, alpha: 0.2 });

    container.addChild(visual);
    container.visual = visual;

    // Explicit Hit Area to ensure clicks register on the whole cell
    container.hitArea = new Rectangle(-size / 2, -size / 2, size, size);

    // Selection Ring (Hidden by default)
    const ring = new Graphics();
    ring.roundRect(-size / 2 - 4, -size / 2 - 4, size + 8, size + 8, 16);
    ring.stroke({ width: 4, color: 0xffffff });
    ring.alpha = 0;
    container.addChild(ring);
    container.selectionRing = ring;

    // Special Markings
    const specialContainer = new Container();
    if (type === CandyType.HORIZONTAL_STRIPED) {
        const stripe = new Graphics();
        stripe.rect(-size / 2, -4, size, 8);
        stripe.fill({ color: 0xffffff, alpha: 0.7 });
        specialContainer.addChild(stripe);
    } else if (type === CandyType.VERTICAL_STRIPED) {
        const stripe = new Graphics();
        stripe.rect(-4, -size / 2, 8, size);
        stripe.fill({ color: 0xffffff, alpha: 0.7 });
        specialContainer.addChild(stripe);
    }
    container.addChild(specialContainer);

    // Emoji Icon
    const emoji = CANDY_VISUALS[color]?.icon || '';
    const text = new Text({
        text: emoji,
        style: {
            fontSize: 28,
            fontFamily: 'Segoe UI Emoji',
            align: 'center'
        }
    });
    text.anchor.set(0.5);
    container.addChild(text);
    container.iconText = text;

    return container;
}

export default PixiBoard;
