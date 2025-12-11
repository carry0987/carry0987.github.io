import { useState, useEffect } from 'react';
import MazeGame from './components/MazeGame';
import UIOverlay from './components/UIOverlay';
import { GameState } from './types';

// Import styles
import './style.css';

function App() {
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if device is iOS to determine if we need explicit permission button
        // This is a naive check but sufficient for modern permission flow distinction
        const isIOSDevice =
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function';

        setIsIOS(isIOSDevice);

        // If not iOS, we might already have permission or don't need explicit request
        if (!isIOSDevice) {
            setHasPermission(true);
        }
    }, []);

    const handleRequestPermission = async () => {
        if (isIOS) {
            try {
                const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setHasPermission(true);
                    setGameState(GameState.PLAYING);
                } else {
                    alert('Motion permissions are required to play.');
                }
            } catch (error) {
                console.error(error);
                // Fallback for non-https or dev environments where this might fail
                setHasPermission(true);
                setGameState(GameState.PLAYING);
            }
        } else {
            setHasPermission(true);
            setGameState(GameState.PLAYING);
        }
    };

    const handleStartGame = () => {
        if (isIOS && !hasPermission) {
            handleRequestPermission();
        } else {
            setGameState(GameState.PLAYING);
        }
    };

    const handleReset = () => {
        setGameState(GameState.PLAYING);
    };

    const handleMenu = () => {
        setGameState(GameState.MENU);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black select-none">
            <MazeGame gameState={gameState} onGameStateChange={setGameState} hasPermission={hasPermission} />
            <UIOverlay
                gameState={gameState}
                onStart={handleStartGame}
                onReset={handleReset}
                onMenu={handleMenu}
                needsPermission={isIOS && !hasPermission}
                onRequestPermission={handleRequestPermission}
            />
        </div>
    );
}

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export function meta() {
    return [
        { title: 'Neon Gyro Maze | Carry' },
        {
            property: 'og:title',
            content: 'Neon Gyro Maze'
        },
        {
            name: 'description',
            content:
                'A neon-themed maze game controlled by tilting your device. Navigate the glowing ball through the maze using your gyroscope.'
        }
    ];
}

export default App;
