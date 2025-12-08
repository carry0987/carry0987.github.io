import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import Controls from './components/Controls';
import { EffectType, type EffectParams, type FireballParams } from './types';

const DEFAULT_PARAMS: Record<EffectType, EffectParams> = {
    [EffectType.FIREBALL]: {
        colorA: '#ff5500',
        colorB: '#ffff00',
        wireframe: false
    },
    [EffectType.TERRAIN]: {
        colorA: '#0d1b2a',
        colorB: '#00ffcc',
        wireframe: true
    },
    [EffectType.SPHERE_BLOB]: {
        colorA: '#ff0055',
        colorB: '#220033',
        wireframe: false
    },
    [EffectType.PARTICLES]: {
        colorA: '#ffffff',
        colorB: '#4444ff',
        wireframe: false
    }
};

const DEFAULT_FIREBALL_PARAMS: FireballParams = {
    velocity: 0.002,
    speed: 0.0005,
    pointScale: 5.0,
    decay: 0.1,
    complex: 0.3,
    waves: 20.0,
    hue: 11.0,
    fragment: true,
    electroflow: true,
    sinVel: 0.0,
    ampVel: 80.0
};

const App: React.FC = () => {
    const [activeEffect, setActiveEffect] = useState<EffectType>(EffectType.FIREBALL);
    const [params, setParams] = useState<EffectParams>(DEFAULT_PARAMS[EffectType.FIREBALL]);
    const [fireballParams, setFireballParams] = useState<FireballParams>(DEFAULT_FIREBALL_PARAMS);

    const handleEffectChange = (type: EffectType) => {
        setActiveEffect(type);
        setParams(DEFAULT_PARAMS[type]);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden font-sans bg-transparent">
            {/* Background/Scene - Rendered first to be at the back */}
            <ThreeScene effectType={activeEffect} params={params} fireballParams={fireballParams} />

            {/* UI Controls */}
            <Controls
                effectType={activeEffect}
                params={params}
                setEffectType={handleEffectChange}
                setParams={setParams}
                fireballParams={fireballParams}
                setFireballParams={setFireballParams}
            />

            {/* Footer / Instruction overlay */}
            <div className="absolute bottom-6 left-6 pointer-events-none opacity-50 text-white mix-blend-difference z-10">
                <h2 className="text-4xl font-black tracking-tighter uppercase">{activeEffect.replace('_', ' ')}</h2>
                <p className="text-sm tracking-widest mt-1">PERLIN NOISE GENERATOR</p>
            </div>
        </div>
    );
};

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export function meta() {
    return [
        { title: 'Perlin Noise | Carry' },
        {
            property: 'og:title',
            content: 'Perlin Noise'
        },
        {
            name: 'description',
            content: 'An interactive Perlin noise visualizer with terrain, sphere blob, particles, and plasma effects.'
        }
    ];
}

export default App;
