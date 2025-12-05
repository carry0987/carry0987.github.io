import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import ParticleScene from './components/ParticleScene';
import HandTracker from './components/HandTracker';
import { ShapeType, THEME_COLORS } from './types';
import type { HandData, ParticleConfig } from './types';
import { SparklesIcon, HeartIcon, CubeIcon, GlobeAltIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

// Import necessary styles
import './style.css';

const App: React.FC = () => {
    // Config State
    const [config, setConfig] = useState<ParticleConfig>({
        count: 6000,
        size: 0.08,
        shape: ShapeType.NEBULA,
        color: THEME_COLORS.primary
    });

    const [loading, setLoading] = useState(true);

    // Hand State (Mutable Ref to avoid React render loop lag)
    const handDataRef = useRef<HandData>({
        isOpen: true,
        position: { x: 0, y: 0, z: 0 },
        pinchStrength: 0,
        isPresent: false
    });

    // UI Hand State (for visual feedback in UI only)
    const [uiHandState, setUiHandState] = useState<{ detected: boolean; state: string }>({
        detected: false,
        state: 'Waiting...'
    });

    const handleHandUpdate = (data: HandData) => {
        // Update ref for 3D loop
        handDataRef.current = data;

        // Update UI sparingly (throttle if needed, but here simple enough)
        if (
            data.isPresent !== uiHandState.detected ||
            (data.isPresent && (data.isOpen ? 'Open' : 'Fist') !== uiHandState.state)
        ) {
            setUiHandState({
                detected: data.isPresent,
                state: data.isPresent ? (data.isOpen ? 'Open (Explode)' : 'Fist (Implode)') : 'No Hand Detected'
            });
        }
    };

    return (
        <div className="w-full h-screen relative bg-black overflow-hidden text-white select-none">
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <color attach="background" args={['#050505']} />
                        <fog attach="fog" args={['#050505', 5, 15]} />

                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        <ambientLight intensity={0.5} />

                        <ParticleScene
                            handData={handDataRef}
                            count={config.count}
                            size={config.size}
                            shape={config.shape}
                            color={config.color}
                        />

                        <OrbitControls
                            enableZoom={true}
                            enablePan={false}
                            maxDistance={10}
                            minDistance={2}
                            autoRotate={!uiHandState.detected} // Auto rotate when idle
                            autoRotateSpeed={0.5}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* Hand Tracker Logic (Hidden or Minimised) */}
            <HandTracker onHandUpdate={handleHandUpdate} onCameraReady={() => setLoading(false)} />

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-500">
                    <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-500">
                        Initializing Vision Core...
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">Please allow camera access to interact</p>
                </div>
            )}

            {/* Main UI Controls */}
            <div className="absolute top-0 right-0 h-full w-80 p-6 z-40 pointer-events-none flex flex-col justify-center">
                <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all hover:bg-black/50 hover:border-white/20">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-pink-500">
                            Particle Flow
                        </h1>
                        <p className="text-xs text-gray-400 font-mono tracking-wider">WEBGL REACTIVE SYSTEM</p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-3 mb-8 bg-white/5 p-3 rounded-lg border border-white/5">
                        <div
                            className={`w-3 h-3 rounded-full ${uiHandState.detected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase">Status</span>
                            <span className="text-sm font-medium text-white">{uiHandState.state}</span>
                        </div>
                        <VideoCameraIcon className="w-5 h-5 text-gray-500 ml-auto" />
                    </div>

                    {/* Shape Selectors */}
                    <div className="space-y-4 mb-8">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Model</span>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() =>
                                    setConfig((prev) => ({
                                        ...prev,
                                        shape: ShapeType.NEBULA,
                                        color: THEME_COLORS.primary
                                    }))
                                }
                                className={`flex items-center justify-center p-3 rounded-xl transition-all ${config.shape === ShapeType.NEBULA ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'} border`}>
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Nebula</span>
                            </button>
                            <button
                                onClick={() =>
                                    setConfig((prev) => ({
                                        ...prev,
                                        shape: ShapeType.HEART,
                                        color: THEME_COLORS.secondary
                                    }))
                                }
                                className={`flex items-center justify-center p-3 rounded-xl transition-all ${config.shape === ShapeType.HEART ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'} border`}>
                                <HeartIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Heart</span>
                            </button>
                            <button
                                onClick={() =>
                                    setConfig((prev) => ({ ...prev, shape: ShapeType.SATURN, color: '#f59e0b' }))
                                }
                                className={`flex items-center justify-center p-3 rounded-xl transition-all ${config.shape === ShapeType.SATURN ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'} border`}>
                                <GlobeAltIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Saturn</span>
                            </button>
                            <button
                                onClick={() =>
                                    setConfig((prev) => ({ ...prev, shape: ShapeType.SPHERE, color: '#ffffff' }))
                                }
                                className={`flex items-center justify-center p-3 rounded-xl transition-all ${config.shape === ShapeType.SPHERE ? 'bg-white/20 border-white/50 text-white' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'} border`}>
                                <CubeIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm">Cube</span>
                            </button>
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Density</span>
                                <span>{(config.count / 1000).toFixed(1)}k</span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="20000"
                                step="1000"
                                value={config.count}
                                onChange={(e) => setConfig((prev) => ({ ...prev, count: parseInt(e.target.value) }))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Size</span>
                                <span>{config.size.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.01"
                                max="0.2"
                                step="0.01"
                                value={config.size}
                                onChange={(e) => setConfig((prev) => ({ ...prev, size: parseFloat(e.target.value) }))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-gray-600 leading-relaxed text-center">
                        Instructions:
                        <br />
                        Open palm to explode particles
                        <br />
                        Close fist to implode particles
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export function meta() {
    return [
        { title: 'Hand Controlled Particle Flow' },
        {
            property: 'og:title',
            content: 'Hand Controlled Particle Flow'
        },
        {
            name: 'description',
            content:
                'Hand Controlled Particle Flow - Control mesmerizing particle effects using hand gestures via webcam.'
        }
    ];
}

export default App;
