import React from 'react';
import { GameState } from '../types';
import { Play, RotateCcw, Smartphone, Trophy } from 'lucide-react';

interface UIOverlayProps {
    gameState: GameState;
    onStart: () => void;
    onReset: () => void;
    needsPermission: boolean;
    onRequestPermission: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, onStart, onReset, needsPermission, onRequestPermission }) => {
    if (gameState === GameState.PLAYING) {
        return (
            <div className="absolute top-4 left-0 right-0 flex justify-between px-6 pointer-events-none z-10">
                <div className="text-cyan-400 font-mono text-sm opacity-80 bg-black/50 p-2 rounded">TILT to Move</div>
                <div className="text-cyan-400 font-mono text-sm opacity-80 bg-black/50 p-2 rounded">SHAKE to Reset</div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-cyan-500 p-8 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] text-center max-w-sm w-full mx-4">
                {gameState === GameState.WON && (
                    <div className="mb-6 animate-bounce">
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-yellow-600">
                            VICTORY!
                        </h2>
                    </div>
                )}

                {gameState === GameState.MENU && (
                    <div className="mb-6">
                        <h1 className="text-4xl font-black text-cyan-400 mb-2 tracking-wider drop-shadow-lg">
                            NEON MAZE
                        </h1>
                        <p className="text-gray-400 text-sm">Navigate the ball to the pink beam.</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                    {needsPermission && gameState === GameState.MENU ? (
                        <button
                            onClick={onRequestPermission}
                            className="w-full group flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95">
                            <Smartphone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            Enable Sensors & Play
                        </button>
                    ) : (
                        <button
                            onClick={onStart}
                            className="w-full group flex items-center justify-center gap-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 shadow-lg">
                            {gameState === GameState.WON ? <RotateCcw /> : <Play />}
                            {gameState === GameState.WON ? 'Play Again' : 'Start Game'}
                        </button>
                    )}

                    {/* Desktop Hint */}
                    {!needsPermission && (
                        <p className="text-xs text-gray-500 mt-4">
                            Desktop: Use mouse to tilt board.
                            <br />
                            Mobile: Tilt device to move.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UIOverlay;
