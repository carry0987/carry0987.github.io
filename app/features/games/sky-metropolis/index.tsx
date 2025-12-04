import { useState, useEffect, useCallback, useRef } from 'react';
import type { Grid, TileData, CityStats, NewsItem } from './types';
import { BuildingType } from './types';
import { GRID_SIZE, BUILDINGS, TICK_RATE_MS, INITIAL_MONEY } from './constants';
import IsoMap from './components/IsoMap';
import UIOverlay from './components/UIOverlay';
import StartScreen from './components/StartScreen';

// Import CSS
import './style.css';

// Initialize empty grid with island shape generation for 3D visual interest
const createInitialGrid = (): Grid => {
    const grid: Grid = [];
    const center = GRID_SIZE / 2;
    // const radius = GRID_SIZE / 2 - 1;

    for (let y = 0; y < GRID_SIZE; y++) {
        const row: TileData[] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            // Simple circle crop for island look
            const dist = Math.sqrt((x - center) * (x - center) + (y - center) * (y - center));

            row.push({ x, y, buildingType: BuildingType.None });
        }
        grid.push(row);
    }
    return grid;
};

function App() {
    // --- Game State ---
    const [gameStarted, setGameStarted] = useState(false);

    const [grid, setGrid] = useState<Grid>(createInitialGrid);
    const [stats, setStats] = useState<CityStats>({ money: INITIAL_MONEY, population: 0, day: 1 });
    const [selectedTool, setSelectedTool] = useState<BuildingType>(BuildingType.Road);

    // --- News State ---
    const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);

    // Refs for accessing state inside intervals without dependencies
    const gridRef = useRef(grid);
    const statsRef = useRef(stats);

    // Sync refs
    useEffect(() => {
        gridRef.current = grid;
    }, [grid]);
    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    // --- News Helper ---

    const addNewsItem = useCallback((item: NewsItem) => {
        setNewsFeed((prev) => [...prev.slice(-12), item]); // Keep last few
    }, []);

    // --- Initial Setup ---
    useEffect(() => {
        if (!gameStarted) return;

        addNewsItem({
            id: Date.now().toString(),
            text: 'Welcome to SkyMetropolis. Terrain generation complete.',
            type: 'positive'
        });
    }, [gameStarted, addNewsItem]);

    // --- Game Loop ---
    useEffect(() => {
        if (!gameStarted) return;

        const intervalId = setInterval(() => {
            // 1. Calculate income/pop gen
            let dailyIncome = 0;
            let dailyPopGrowth = 0;
            let buildingCounts: Record<string, number> = {};

            gridRef.current.flat().forEach((tile) => {
                if (tile.buildingType !== BuildingType.None) {
                    const config = BUILDINGS[tile.buildingType];
                    dailyIncome += config.incomeGen;
                    dailyPopGrowth += config.popGen;
                    buildingCounts[tile.buildingType] = (buildingCounts[tile.buildingType] || 0) + 1;
                }
            });

            // Cap population growth by residential count just for some logic
            const resCount = buildingCounts[BuildingType.Residential] || 0;
            const maxPop = resCount * 50; // 50 people per house max

            // 2. Update Stats
            setStats((prev) => {
                let newPop = prev.population + dailyPopGrowth;
                if (newPop > maxPop) newPop = maxPop; // limit
                if (resCount === 0 && prev.population > 0) newPop = Math.max(0, prev.population - 5); // people leave if no homes

                return {
                    money: prev.money + dailyIncome,
                    population: newPop,
                    day: prev.day + 1
                };
            });
        }, TICK_RATE_MS);

        return () => clearInterval(intervalId);
    }, [gameStarted]);

    // --- Interaction Logic ---

    const handleTileClick = useCallback(
        (x: number, y: number) => {
            if (!gameStarted) return; // Prevent clicking through start screen

            const currentGrid = gridRef.current;
            const currentStats = statsRef.current;
            const tool = selectedTool; // Capture current tool

            if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

            const currentTile = currentGrid[y][x];
            const buildingConfig = BUILDINGS[tool];

            // Bulldoze logic
            if (tool === BuildingType.None) {
                if (currentTile.buildingType !== BuildingType.None) {
                    const demolishCost = 5;
                    if (currentStats.money >= demolishCost) {
                        const newGrid = currentGrid.map((row) => [...row]);
                        newGrid[y][x] = { ...currentTile, buildingType: BuildingType.None };
                        setGrid(newGrid);
                        setStats((prev) => ({ ...prev, money: prev.money - demolishCost }));
                        // Sound effect here
                    } else {
                        addNewsItem({
                            id: Date.now().toString(),
                            text: 'Cannot afford demolition costs.',
                            type: 'negative'
                        });
                    }
                }
                return;
            }

            // Placement Logic
            if (currentTile.buildingType === BuildingType.None) {
                if (currentStats.money >= buildingConfig.cost) {
                    // Deduct cost
                    setStats((prev) => ({ ...prev, money: prev.money - buildingConfig.cost }));

                    // Place building
                    const newGrid = currentGrid.map((row) => [...row]);
                    newGrid[y][x] = { ...currentTile, buildingType: tool };
                    setGrid(newGrid);
                    // Sound effect here
                } else {
                    // Not enough money feedback
                    addNewsItem({
                        id: Date.now().toString() + Math.random(),
                        text: `Treasury insufficient for ${buildingConfig.name}.`,
                        type: 'negative'
                    });
                }
            }
        },
        [selectedTool, addNewsItem, gameStarted]
    );

    const handleStart = () => {
        setGameStarted(true);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden selection:bg-transparent selection:text-transparent bg-sky-900">
            {/* 3D Rendering Layer - Always visible now, providing background for start screen */}
            <IsoMap
                grid={grid}
                onTileClick={handleTileClick}
                hoveredTool={selectedTool}
                population={stats.population}
            />

            {/* Start Screen Overlay */}
            {!gameStarted && <StartScreen onStart={handleStart} />}

            {/* UI Layer */}
            {gameStarted && (
                <UIOverlay
                    stats={stats}
                    selectedTool={selectedTool}
                    onSelectTool={setSelectedTool}
                    newsFeed={newsFeed}
                />
            )}

            {/* CSS for animations and utility */}
            <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .mask-image-b { -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%); mask-image: linear-gradient(to bottom, transparent 0%, black 15%); }
        
        /* Vertical text for toolbar label */
        .writing-mode-vertical { writing-mode: vertical-rl; text-orientation: mixed; }
        
        /* Custom scrollbar for news */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        `}</style>
        </div>
    );
}

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export default App;
