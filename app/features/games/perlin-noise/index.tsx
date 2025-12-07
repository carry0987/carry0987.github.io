import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import Controls from './components/Controls';
import { EffectType, type EffectParams, type FireballParams } from './types';

const DEFAULT_PARAMS: Record<EffectType, EffectParams> = {
    [EffectType.TERRAIN]: {
        speed: 0.2,
        noiseScale: 0.8,
        displacement: 1.5,
        colorA: '#0d1b2a', // Dark Blue-ish
        colorB: '#00ffcc', // Bright Cyan
        wireframe: true
    },
    [EffectType.SPHERE_BLOB]: {
        speed: 0.5,
        noiseScale: 1.5,
        displacement: 0.8,
        colorA: '#ff0055',
        colorB: '#220033',
        wireframe: false
    },
    [EffectType.PARTICLES]: {
        speed: 0.1,
        noiseScale: 0.5,
        displacement: 2.0,
        colorA: '#ffffff',
        colorB: '#4444ff',
        wireframe: false
    },
    [EffectType.FIREBALL]: {
        speed: 1.0,
        noiseScale: 1.0,
        displacement: 2.0,
        colorA: '#ff5500',
        colorB: '#ffff00',
        wireframe: false
    }
};

const DEFAULT_FIREBALL_PARAMS: FireballParams = {
    velocity: 0.002,
    speed: 0.0005,
    pointScale: 1.0,
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
    const [activeEffect, setActiveEffect] = useState<EffectType>(EffectType.TERRAIN);
    const [params, setParams] = useState<EffectParams>(DEFAULT_PARAMS[EffectType.TERRAIN]);
    const [fireballParams, setFireballParams] = useState<FireballParams>(DEFAULT_FIREBALL_PARAMS);

    const handleEffectChange = (type: EffectType) => {
        setActiveEffect(type);
        setParams(DEFAULT_PARAMS[type]);
        if (type === EffectType.FIREBALL) {
            setFireballParams(DEFAULT_FIREBALL_PARAMS);
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden font-sans bg-transparent">
            {/* Background/Scene - Rendered first to be at the back */}
            <ThreeScene
                effectType={activeEffect}
                params={params}
                fireballParams={activeEffect === EffectType.FIREBALL ? fireballParams : undefined}
            />

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
