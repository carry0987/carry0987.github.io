import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import type { TileData, CityStats, FeedMessage, SaveSettings, PerformanceSettings } from './types';
import { ZoneType, PERFORMANCE_PRESETS } from './types';
import { GRID_SIZE, INITIAL_STATS, BUILDINGS } from './constants';
import { saveManager } from './utils/saveManager';
import { AlertTriangle } from 'lucide-react';
import CityGrid from './components/CityGrid';
import UIOverlay from './components/UIOverlay';
import CityLife from './components/CityLife';
import DayNightCycle from './components/DayNightCycle';
import EnvironmentEffects from './components/Environment';
import CityFeed from './components/CityFeed';
import StartScreen from './components/StartScreen';

const App: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [cityData, setCityData] = useState<TileData[]>([]);
    const [stats, setStats] = useState<CityStats>(INITIAL_STATS);
    const [cityName, setCityName] = useState<string>('Neo City');
    const [selectedType, setSelectedType] = useState<ZoneType | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<{ x: number; z: number } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [gameTime, setGameTime] = useState(10);
    const [feedMessages, setFeedMessages] = useState<FeedMessage[]>([]);
    const [isFeedVisible, setIsFeedVisible] = useState(true);

    // Performance Settings State
    const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings>(PERFORMANCE_PRESETS.medium);
    const [dpr, setDpr] = useState(performanceSettings.pixelRatio);

    // Save Settings State
    const [saveSettings, setSaveSettings] = useState<SaveSettings>({
        autoSaveEnabled: true,
        lastSavedAt: null
    });
    const [hasSavedGame, setHasSavedGame] = useState(false);

    // Correctly define Refs at the top level
    const cityDataRef = useRef(cityData);
    const statsRef = useRef(stats);
    const cityNameRef = useRef(cityName);
    const gameTimeRef = useRef(gameTime);
    const feedMessagesRef = useRef(feedMessages);
    const prevMoneyRef = useRef(stats.money);

    useEffect(() => {
        cityDataRef.current = cityData;
    }, [cityData]);

    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    useEffect(() => {
        cityNameRef.current = cityName;
    }, [cityName]);

    useEffect(() => {
        gameTimeRef.current = gameTime;
    }, [gameTime]);

    useEffect(() => {
        feedMessagesRef.current = feedMessages;
    }, [feedMessages]);

    // Check for saved game on mount
    useEffect(() => {
        const checkSave = async () => {
            const hasSave = await saveManager.hasSave();
            setHasSavedGame(hasSave);
        };
        checkSave();
    }, []);

    // Save/Load Functions
    const handleSave = useCallback(
        async (silent = false) => {
            const success = await saveManager.save(
                cityDataRef.current,
                statsRef.current,
                cityNameRef.current,
                gameTimeRef.current,
                feedMessagesRef.current
            );
            if (success) {
                setSaveSettings((prev) => ({ ...prev, lastSavedAt: Date.now() }));
                if (!silent) {
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setFeedMessages((prev) => [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            user: 'SYSTEM',
                            content: 'City data synchronized to neural network.',
                            timestamp: timeStr,
                            type: 'positive'
                        } as FeedMessage,
                        ...prev
                    ]);
                }
            }
            return success;
        },
        [setFeedMessages]
    );

    const handleLoad = useCallback(async () => {
        const saveData = await saveManager.load();
        if (saveData) {
            setCityData(saveData.cityData);
            setStats(saveData.stats);
            setCityName(saveData.cityName);
            setGameTime(saveData.gameTime);
            setFeedMessages(saveData.feedMessages);
            setSaveSettings((prev) => ({ ...prev, lastSavedAt: saveData.savedAt }));
            return true;
        }
        return false;
    }, []);

    const handleStart = async (continueGame = false) => {
        if (continueGame) {
            await handleLoad();
        } else {
            // Reset stats and time for new game
            setStats(INITIAL_STATS);
            setGameTime(10); // Start at 10 AM

            // Initialize new game
            const initialData: TileData[] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                for (let z = 0; z < GRID_SIZE; z++) {
                    initialData.push({ x, z, type: ZoneType.EMPTY, level: 0 });
                }
            }
            setCityData(initialData);

            // Initial welcome system message
            const welcomeMsg: FeedMessage = {
                id: 'welcome',
                user: 'SYSTEM',
                content: `Welcome to ${cityName}. Terrain generation complete. Ready for development.`,
                timestamp: '10:00 AM',
                type: 'neutral'
            };
            setFeedMessages([welcomeMsg]);
        }
        setGameStarted(true);
    };

    const toggleAutoSave = () => {
        setSaveSettings((prev) => ({ ...prev, autoSaveEnabled: !prev.autoSaveEnabled }));
    };

    // Auto-save effect
    useEffect(() => {
        if (!gameStarted || !saveSettings.autoSaveEnabled) return;

        const interval = setInterval(() => {
            handleSave(true);
        }, 60000); // Auto-save every minute

        return () => clearInterval(interval);
    }, [gameStarted, saveSettings.autoSaveEnabled, handleSave]);

    // Periodically update economic data and game time
    useEffect(() => {
        if (!gameStarted) return;

        const interval = setInterval(() => {
            setCityData((prevData) => {
                const counts = prevData.reduce(
                    (acc, tile) => {
                        acc[tile.type] = (acc[tile.type] || 0) + 1;
                        return acc;
                    },
                    {} as Record<string, number>
                );

                const pop = (counts[ZoneType.RESIDENTIAL] || 0) * 10;
                const inc = (counts[ZoneType.COMMERCIAL] || 0) * 15 + (counts[ZoneType.INDUSTRIAL] || 0) * 25;
                const exp = (counts[ZoneType.ROAD] || 0) * 2 + (counts[ZoneType.PARK] || 0) * 10;

                setStats((prev) => ({
                    ...prev,
                    population: pop,
                    money: prev.money + (inc - exp),
                    income: inc,
                    expense: exp
                }));
                return prevData;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [gameStarted]);

    // Smooth Day/Night Cycle (30 seconds per day)
    const prevTimeRef = useRef(gameTime);
    useEffect(() => {
        if (!gameStarted) return;

        const interval = setInterval(() => {
            setGameTime((prev) => {
                const next = prev + 0.08; // 24 / (30s / 0.1s) = 0.08
                return next >= 24 ? 0 : next;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [gameStarted]);

    // Handle Day Increment
    useEffect(() => {
        if (!gameStarted) return;
        // Detect transition from late night to early morning
        if (prevTimeRef.current > 22 && gameTime < 2) {
            setStats((s) => ({ ...s, day: s.day + 1 }));
        }
        prevTimeRef.current = gameTime;
    }, [gameTime, gameStarted]);

    // Listen for important events and add system logs
    useEffect(() => {
        if (!gameStarted) return;
        // Use prevMoneyRef defined at the top level
        if (stats.money < 0 && prevMoneyRef.current >= 0) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Fix: Cast the message object to FeedMessage to prevent type inference from failing on the union 'type' field.
            setFeedMessages((prev) =>
                [
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        user: 'SYSTEM',
                        content: `Warning: City treasury is in deficit! Revenue generation required.`,
                        timestamp: timeStr,
                        type: 'negative'
                    } as FeedMessage,
                    ...prev
                ].slice(0, 50)
            );
        }
        prevMoneyRef.current = stats.money;
    }, [stats.money]);

    const handleTileClick = useCallback(
        (x: number, z: number) => {
            if (!gameStarted) return;
            setErrorMsg(null);
            setCityData((prev) => {
                const idx = prev.findIndex((t) => t.x === x && t.z === z);
                if (idx === -1) return prev;

                const currentTile = prev[idx];

                if (selectedType === null) {
                    if (currentTile.type !== ZoneType.EMPTY) {
                        setSelectedBuilding({ x, z });
                    } else {
                        setSelectedBuilding(null);
                    }
                    return prev;
                }

                if (selectedType === ZoneType.EMPTY) {
                    if (currentTile.type === ZoneType.EMPTY) return prev;
                    const newData = [...prev];
                    const refund = Math.floor(BUILDINGS[currentTile.type].cost * 0.8);

                    // Add system log for demolition and refund
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setFeedMessages((prevMsg) =>
                        [
                            {
                                id: Math.random().toString(36).substr(2, 9),
                                user: 'SYSTEM',
                                content: `Demolition complete: ${BUILDINGS[currentTile.type].label} removed. $${refund} refunded to treasury.`,
                                timestamp: timeStr,
                                type: 'positive'
                            } as FeedMessage,
                            ...prevMsg
                        ].slice(0, 50)
                    );

                    setStats((s) => ({ ...s, money: s.money + refund }));
                    newData[idx] = { ...currentTile, type: ZoneType.EMPTY, level: 0 };
                    setSelectedBuilding(null);
                    return newData;
                }

                if (currentTile.type !== ZoneType.EMPTY) {
                    setSelectedBuilding({ x, z });
                    return prev;
                }

                const config = BUILDINGS[selectedType];
                if (statsRef.current.money < config.cost) {
                    setErrorMsg('Insufficient budget!');
                    return prev;
                }

                const newData = [...prev];
                const randomVariant = Math.floor(Math.random() * 3);
                newData[idx] = { ...currentTile, type: selectedType, level: randomVariant };

                // Add system log when construction is complete
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                // Fix: Cast the message object to FeedMessage to ensure 'type' field matches the union type expected.
                setFeedMessages((prevMsg) =>
                    [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            user: 'SYSTEM',
                            content: `Construction complete: ${config.label} deployed at [${x}, ${z}].`,
                            timestamp: timeStr,
                            type: 'neutral'
                        } as FeedMessage,
                        ...prevMsg
                    ].slice(0, 50)
                );

                setStats((s) => ({ ...s, money: s.money - config.cost }));
                setSelectedBuilding({ x, z });
                return newData;
            });
        },
        [selectedType, gameStarted]
    );

    const handleSelectType = (type: ZoneType | null) => {
        setSelectedType(type);
        setSelectedBuilding(null);
        setErrorMsg(null);
    };

    const selectedBuildingInfo =
        cityData.find((t) => t.x === selectedBuilding?.x && t.z === selectedBuilding?.z) || null;

    // Memoized GL config for better performance
    const glConfig = useMemo(
        () => ({
            antialias: performanceSettings.antialias,
            powerPreference: 'high-performance' as const,
            stencil: false,
            depth: true,
            // Reduce WebGL state changes
            alpha: false
        }),
        [performanceSettings.antialias]
    );

    // Handle performance level change
    const handlePerformanceChange = useCallback((level: 'low' | 'medium' | 'high') => {
        const newSettings = PERFORMANCE_PRESETS[level];
        setPerformanceSettings(newSettings);
        setDpr(newSettings.pixelRatio);
    }, []);

    return (
        <div className="relative w-full h-screen">
            <Canvas
                shadows={performanceSettings.shadows}
                camera={{ position: [15, 15, 15], fov: 40 }}
                dpr={dpr}
                gl={glConfig}
                performance={{ min: 0.5 }}
                onPointerMissed={() => {
                    setSelectedType(null);
                    setSelectedBuilding(null);
                }}>
                {/* Adaptive DPR based on performance */}
                <AdaptiveDpr pixelated />

                {/* Performance monitor to auto-adjust quality */}
                <PerformanceMonitor
                    onDecline={() => {
                        setDpr(Math.max(0.5, dpr - 0.25));
                    }}
                    onIncline={() => {
                        setDpr(Math.min(performanceSettings.pixelRatio, dpr + 0.25));
                    }}
                    flipflops={3}
                    onFallback={() => handlePerformanceChange('low')}
                />

                {/* Environment effects - conditionally rendered */}
                {performanceSettings.environmentEffects && <EnvironmentEffects />}

                <DayNightCycle
                    gameTime={gameTime}
                    lowQuality={performanceSettings.level === 'low'}
                    shadowMapSize={performanceSettings.shadowMapSize}
                />

                <CityGrid
                    cityData={cityData}
                    onTileClick={handleTileClick}
                    selectedType={selectedType}
                    selectedBuilding={selectedBuilding}
                />

                <CityLife cityData={cityData} />

                {/* Contact shadows - conditionally rendered */}
                {performanceSettings.shadows && (
                    <ContactShadows
                        position={[0, -0.01, 0]}
                        opacity={0.25}
                        scale={25}
                        blur={2}
                        far={4}
                        resolution={performanceSettings.level === 'high' ? 512 : 256}
                    />
                )}

                <Environment preset="city" />
                <OrbitControls
                    makeDefault
                    maxPolarAngle={Math.PI / 2.1}
                    minDistance={5}
                    maxDistance={40}
                    enableDamping={true}
                    dampingFactor={0.05}
                />
            </Canvas>

            {!gameStarted && <StartScreen onStart={handleStart} hasSavedGame={hasSavedGame} />}

            {gameStarted && (
                <>
                    <CityFeed messages={feedMessages} isVisible={isFeedVisible} onClear={() => setFeedMessages([])} />

                    {errorMsg && (
                        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600/90 text-white px-6 py-2 rounded-full shadow-lg border border-red-400 animate-bounce pointer-events-none flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            {errorMsg}
                        </div>
                    )}

                    <UIOverlay
                        stats={stats}
                        cityName={cityName}
                        onRenameCity={setCityName}
                        selectedType={selectedType}
                        onSelectType={handleSelectType}
                        selectedBuildingInfo={selectedBuildingInfo}
                        onDeselect={() => {
                            setSelectedBuilding(null);
                            setSelectedType(null);
                        }}
                        isFeedVisible={isFeedVisible}
                        onToggleFeed={() => setIsFeedVisible(!isFeedVisible)}
                        saveSettings={saveSettings}
                        onSave={() => handleSave(false)}
                        onToggleAutoSave={toggleAutoSave}
                        gameTime={gameTime}
                        performanceLevel={performanceSettings.level}
                        onPerformanceChange={handlePerformanceChange}
                    />
                </>
            )}
        </div>
    );
};

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export function meta() {
    return [
        { title: 'Neo City' },
        {
            property: 'og:title',
            content: 'Neo City'
        },
        {
            name: 'description',
            content: 'Neo City - A city building simulation game with isometric 3D graphics.'
        }
    ];
}

export default App;
