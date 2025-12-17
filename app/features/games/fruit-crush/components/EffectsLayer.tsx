import React from 'react';
import type { VisualEffect, Board } from '../types';

interface EffectsLayerProps {
    effects: VisualEffect[];
    board: Board;
}

const EffectsLayer: React.FC<EffectsLayerProps> = ({ effects, board }) => {
    if (effects.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-2xl">
            {effects.map((effect) => {
                // Horizontal Line Blast
                if (effect.type === 'ROW_CLEAR' && effect.row !== undefined) {
                    return (
                        <div
                            key={effect.id}
                            className="absolute left-0 w-full h-[12.5%] bg-white/80 shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-beam-horizontal flex items-center justify-center"
                            style={{ top: `${effect.row * 12.5}%` }}>
                            <div className="w-full h-1 bg-white shadow-[0_0_20px_white]"></div>
                        </div>
                    );
                }

                // Vertical Line Blast
                if (effect.type === 'COL_CLEAR' && effect.col !== undefined) {
                    return (
                        <div
                            key={effect.id}
                            className="absolute top-0 h-full w-[12.5%] bg-white/80 shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-beam-vertical flex items-center justify-center"
                            style={{ left: `${effect.col * 12.5}%` }}>
                            <div className="h-full w-1 bg-white shadow-[0_0_20px_white]"></div>
                        </div>
                    );
                }

                // Rainbow Bomb Color Clear
                if (effect.type === 'COLOR_CLEAR' && effect.color) {
                    // Render a zap on every candy of this color
                    return (
                        <React.Fragment key={effect.id}>
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                            {board.map((row, r) =>
                                row.map((candy, c) => {
                                    // Match color or match Rainbow bomb itself (if we want to explode the source too)
                                    if (candy.color === effect.color) {
                                        return (
                                            <div
                                                key={`zap-${r}-${c}`}
                                                className="absolute w-[12.5%] h-[12.5%] flex items-center justify-center z-50"
                                                style={{ top: `${r * 12.5}%`, left: `${c * 12.5}%` }}>
                                                <div className="w-[120%] h-[120%] bg-white/60 rounded-full animate-pulse-fast shadow-[0_0_25px_white]" />
                                                <div className="absolute w-full h-full border-2 border-white rounded-full animate-ping opacity-70"></div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                            )}
                        </React.Fragment>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default EffectsLayer;
