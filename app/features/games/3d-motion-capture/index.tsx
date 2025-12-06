import React, { useState, useCallback, useRef } from 'react';
import type { PoseResults, Landmark, AvatarConfig } from './types';
import { AvatarColorScheme, AVATAR_COLORS } from './types';
import Avatar3D from './components/Avatar3D';
import PoseSensor from './components/PoseSensor';
import { useCameraAvailability } from '@/hooks';
import {
    VideoCameraIcon,
    CursorArrowRaysIcon,
    Bars3Icon,
    XMarkIcon,
    SparklesIcon,
    FireIcon,
    SunIcon,
    CommandLineIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';

// Import styles
import './style.css';

// Generate a neutral standing pose (A-pose)
// Y values are designed so that with the transform ((0.5 - y) * 3 + 1):
// - Head (y=0.17) -> y=2.0 in 3D
// - Feet (y=0.83) -> y=0 in 3D (ground level)
// Z values in MediaPipe: negative = closer to camera, positive = farther
// For upright pose: nose forward, ears behind, torso at reference plane
const generateNeutralPose = (): Landmark[] => {
    const neutralLandmarks: Landmark[] = Array.from({ length: 33 }, () => ({
        x: 0.5,
        y: 0.5,
        z: 0,
        visibility: 1
    }));

    const setL = (idx: number, x: number, y: number, z: number = 0) => {
        neutralLandmarks[idx] = { x, y, z, visibility: 1 };
    };

    // Head (y around 0.17 -> 3D y = 2.0)
    // Nose is forward (negative z), ears are behind (positive z)
    setL(0, 0.5, 0.17, 0); // Nose (forward)
    setL(7, 0.55, 0.17, 0.05); // L Ear (behind nose)
    setL(8, 0.45, 0.17, 0.05); // R Ear (behind nose)
    setL(9, 0.52, 0.2, -0.08); // Mouth L (slightly forward)
    setL(10, 0.48, 0.2, -0.08); // Mouth R (slightly forward)

    // Shoulders (y around 0.30 -> 3D y = 1.6)
    // Shoulders at reference plane (z = 0)
    setL(11, 0.6, 0.3, 0); // L Shoulder
    setL(12, 0.4, 0.3, 0); // R Shoulder

    // Elbows (y around 0.47 -> 3D y = 1.1)
    setL(13, 0.65, 0.47, 0); // L Elbow
    setL(14, 0.35, 0.47, 0); // R Elbow

    // Wrists (y around 0.60 -> 3D y = 0.7)
    setL(15, 0.7, 0.6, 0); // L Wrist
    setL(16, 0.3, 0.6, 0); // R Wrist

    // Hips (y around 0.53 -> 3D y = 0.9)
    setL(23, 0.55, 0.53, 0); // L Hip
    setL(24, 0.45, 0.53, 0); // R Hip

    // Knees (y around 0.68 -> 3D y = 0.46)
    setL(25, 0.55, 0.68, 0); // L Knee
    setL(26, 0.45, 0.68, 0); // R Knee

    // Ankles (y around 0.83 -> 3D y = 0.0, ground level)
    setL(27, 0.55, 0.83, 0); // L Ankle
    setL(28, 0.45, 0.83, 0); // R Ankle

    return neutralLandmarks;
};

const App: React.FC = () => {
    const [poseData, setPoseData] = useState<PoseResults | null>({ poseLandmarks: generateNeutralPose() });
    const [loading, setLoading] = useState(true);
    const [panelOpen, setPanelOpen] = useState(false);

    // Config state
    const [config, setConfig] = useState<AvatarConfig>({
        smoothing: 0.3,
        scale: 1.0,
        boneThickness: 0.06,
        jointSize: 0.08,
        colorScheme: AvatarColorScheme.CYAN
    });

    // Store the latest pose
    const currentPoseRef = useRef<Landmark[]>(generateNeutralPose());

    // Reset pose to neutral
    const resetPose = useCallback(() => {
        const neutralLandmarks = generateNeutralPose();
        setPoseData({ poseLandmarks: neutralLandmarks });
        currentPoseRef.current = neutralLandmarks;
    }, []);

    // Camera availability hook
    const { cameraAvailable, cameraEnabled, setCameraEnabled, handleCameraError } = useCameraAvailability({
        onCameraUnavailable: () => {
            resetPose();
            setLoading(false);
        },
        onCameraError: () => {
            resetPose();
            setLoading(false);
        }
    });

    const handlePoseDetected = useCallback((results: PoseResults) => {
        setPoseData(results);
        currentPoseRef.current = results.poseLandmarks;
    }, []);

    const handleCameraReady = useCallback(() => {
        setLoading(false);
    }, []);

    const colorSchemes = [
        { scheme: AvatarColorScheme.CYAN, icon: SparklesIcon, label: 'Cyan' },
        { scheme: AvatarColorScheme.NEON, icon: FireIcon, label: 'Neon' },
        { scheme: AvatarColorScheme.SUNSET, icon: SunIcon, label: 'Sunset' },
        { scheme: AvatarColorScheme.MATRIX, icon: CommandLineIcon, label: 'Matrix' }
    ];

    return (
        <div className="w-full h-screen relative bg-black overflow-hidden text-white select-none font-sans">
            {/* 3D Background/Avatar Layer */}
            <div className="absolute inset-0 z-0">
                <Avatar3D poseResults={poseData} config={config} />
            </div>

            {/* Vision Sensor (Top Right) */}
            {cameraEnabled && (
                <PoseSensor
                    isActive={cameraEnabled}
                    onPoseDetected={handlePoseDetected}
                    onCameraReady={handleCameraReady}
                    onCameraError={handleCameraError}
                />
            )}

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

            {/* Camera Unavailable Warning */}
            {!loading && !cameraAvailable && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-orange-500/20 backdrop-blur-md border border-orange-500/50 rounded-lg px-4 py-2 text-orange-400 text-sm flex items-center space-x-2">
                    <VideoCameraIcon className="w-4 h-4" />
                    <span>Camera unavailable - using static mode</span>
                </div>
            )}

            {/* Desktop Control Panel - Right Side */}
            <div className="hidden md:flex absolute top-0 right-0 h-full w-80 p-6 z-40 pointer-events-none flex-col justify-center">
                <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all hover:bg-black/50 hover:border-white/20">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-600">
                            Motion Capture
                        </h1>
                        <p className="text-xs text-gray-400 font-mono tracking-wider">3D POSE TRACKING SYSTEM</p>
                    </div>

                    {/* Control Mode Toggle */}
                    <div className="flex flex-col space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => cameraAvailable && setCameraEnabled(true)}
                                className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all text-xs ${
                                    cameraEnabled && cameraAvailable
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                        : !cameraAvailable
                                          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400/60 cursor-not-allowed'
                                          : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'
                                } border cursor-pointer`}
                                disabled={!cameraAvailable}>
                                <VideoCameraIcon className="w-4 h-4 mr-1" />
                                Camera
                            </button>
                            <button
                                onClick={() => {
                                    setCameraEnabled(false);
                                    resetPose();
                                }}
                                className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all text-xs ${
                                    !cameraEnabled
                                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                        : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'
                                } border cursor-pointer`}>
                                <CursorArrowRaysIcon className="w-4 h-4 mr-1" />
                                Static
                            </button>
                        </div>
                        {!cameraAvailable && (
                            <p className="text-[10px] text-orange-400 text-center">
                                Camera unavailable - using static mode
                            </p>
                        )}
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-3 mb-8 bg-white/5 p-3 rounded-lg border border-white/5">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                cameraEnabled && poseData ? 'bg-green-500 animate-pulse' : 'bg-cyan-500'
                            }`}></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase">Status</span>
                            <span className="text-sm font-medium text-white">
                                {cameraEnabled ? (poseData ? 'Tracking Active' : 'No Skeleton') : 'Static Pose'}
                            </span>
                        </div>
                        {cameraEnabled ? (
                            <VideoCameraIcon className="w-5 h-5 text-cyan-500 ml-auto" />
                        ) : (
                            <CursorArrowRaysIcon className="w-5 h-5 text-purple-500 ml-auto" />
                        )}
                    </div>

                    {/* Color Scheme Selectors */}
                    <div className="space-y-4 mb-8">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Color Scheme</span>
                        <div className="grid grid-cols-2 gap-3">
                            {colorSchemes.map(({ scheme, icon: Icon, label }) => (
                                <button
                                    key={scheme}
                                    onClick={() => setConfig((prev) => ({ ...prev, colorScheme: scheme }))}
                                    className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                                        config.colorScheme === scheme
                                            ? `bg-opacity-20 border-opacity-50`
                                            : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'
                                    } border cursor-pointer`}
                                    style={{
                                        backgroundColor:
                                            config.colorScheme === scheme
                                                ? `${AVATAR_COLORS[scheme].bone}20`
                                                : undefined,
                                        borderColor:
                                            config.colorScheme === scheme
                                                ? `${AVATAR_COLORS[scheme].bone}80`
                                                : undefined,
                                        color: config.colorScheme === scheme ? AVATAR_COLORS[scheme].bone : undefined
                                    }}>
                                    <Icon className="w-5 h-5 mr-2" />
                                    <span className="text-sm">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Smoothing</span>
                                <span>{config.smoothing.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="0.9"
                                step="0.05"
                                value={config.smoothing}
                                onChange={(e) =>
                                    setConfig((prev) => ({ ...prev, smoothing: parseFloat(e.target.value) }))
                                }
                                className="range-slider-cyan"
                                style={{
                                    background: `linear-gradient(to right, #06b6d4 0%, #22d3ee ${((config.smoothing - 0.1) / (0.9 - 0.1)) * 100}%, #374151 ${((config.smoothing - 0.1) / (0.9 - 0.1)) * 100}%, #374151 100%)`
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Scale</span>
                                <span>{config.scale.toFixed(1)}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={config.scale}
                                onChange={(e) => setConfig((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))}
                                className="range-slider-pink"
                                style={{
                                    background: `linear-gradient(to right, #ec4899 0%, #f472b6 ${((config.scale - 0.5) / (2.0 - 0.5)) * 100}%, #374151 ${((config.scale - 0.5) / (2.0 - 0.5)) * 100}%, #374151 100%)`
                                }}
                            />
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={resetPose}
                        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-900/50 hover:bg-cyan-700/50 border border-cyan-500/50 rounded-lg text-cyan-100 font-semibold transition-all cursor-pointer">
                        <ArrowPathIcon className="w-4 h-4" />
                        Reset Pose
                    </button>

                    <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-gray-600 leading-relaxed text-center">
                        {cameraEnabled ? (
                            <>
                                Stand back so the camera can see your full body.
                                <br />
                                The 3D Robot will mimic your movements.
                            </>
                        ) : (
                            <>
                                Enable camera to track your body movements.
                                <br />
                                Or enjoy the static robot pose.
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setPanelOpen(!panelOpen)}
                className={`md:hidden fixed right-4 w-12 h-12 bg-black/20 border border-white/20 rounded-full flex items-center justify-center shadow-lg z-60 transition-all duration-300 bottom-4`}>
                {panelOpen ? (
                    <XMarkIcon className="w-6 h-6 text-white" />
                ) : (
                    <Bars3Icon className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Mobile UI Controls */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div
                    className={`transform transition-transform duration-300 ease-out ${
                        panelOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}>
                    <div className="bg-black/70 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-4 pb-8 shadow-2xl max-h-[70vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-600">
                                    Motion Capture
                                </h1>
                                <p className="text-[10px] text-gray-400 font-mono">3D POSE TRACKING</p>
                            </div>
                            {/* Status */}
                            <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        cameraEnabled && poseData ? 'bg-green-500 animate-pulse' : 'bg-cyan-500'
                                    }`}></div>
                                <span className="text-xs text-white">
                                    {cameraEnabled ? (poseData ? 'Tracking' : 'No Skeleton') : 'Static'}
                                </span>
                            </div>
                        </div>

                        {/* Control Mode Toggle */}
                        <div className="flex items-center space-x-2 mb-4">
                            <button
                                onClick={() => cameraAvailable && setCameraEnabled(true)}
                                className={`flex-1 flex items-center justify-center p-2.5 rounded-xl transition-all text-xs ${
                                    cameraEnabled && cameraAvailable
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                        : !cameraAvailable
                                          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400/60'
                                          : 'bg-white/5 border-transparent text-gray-400'
                                } border`}
                                disabled={!cameraAvailable}>
                                <VideoCameraIcon className="w-4 h-4 mr-1" />
                                Camera
                            </button>
                            <button
                                onClick={() => {
                                    setCameraEnabled(false);
                                    resetPose();
                                }}
                                className={`flex-1 flex items-center justify-center p-2.5 rounded-xl transition-all text-xs ${
                                    !cameraEnabled
                                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                        : 'bg-white/5 border-transparent text-gray-400'
                                } border`}>
                                <CursorArrowRaysIcon className="w-4 h-4 mr-1" />
                                Static
                            </button>
                        </div>
                        {!cameraAvailable && (
                            <p className="text-[10px] text-orange-400 text-center mb-4">Camera unavailable</p>
                        )}

                        {/* Color Scheme Selectors */}
                        <div className="mb-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                Color Scheme
                            </span>
                            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
                                {colorSchemes.map(({ scheme, icon: Icon, label }) => (
                                    <button
                                        key={scheme}
                                        onClick={() => setConfig((prev) => ({ ...prev, colorScheme: scheme }))}
                                        className={`shrink-0 flex items-center justify-center px-4 py-2.5 rounded-xl transition-all border ${
                                            config.colorScheme === scheme
                                                ? ''
                                                : 'bg-white/5 border-transparent text-gray-400'
                                        }`}
                                        style={{
                                            backgroundColor:
                                                config.colorScheme === scheme
                                                    ? `${AVATAR_COLORS[scheme].bone}20`
                                                    : undefined,
                                            borderColor:
                                                config.colorScheme === scheme
                                                    ? `${AVATAR_COLORS[scheme].bone}80`
                                                    : undefined,
                                            color:
                                                config.colorScheme === scheme ? AVATAR_COLORS[scheme].bone : undefined
                                        }}>
                                        <Icon className="w-4 h-4 mr-1.5" />
                                        <span className="text-xs">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>Smoothing</span>
                                    <span>{config.smoothing.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="0.9"
                                    step="0.05"
                                    value={config.smoothing}
                                    onChange={(e) =>
                                        setConfig((prev) => ({ ...prev, smoothing: parseFloat(e.target.value) }))
                                    }
                                    className="range-slider-cyan"
                                    style={{
                                        background: `linear-gradient(to right, #06b6d4 0%, #22d3ee ${((config.smoothing - 0.1) / (0.9 - 0.1)) * 100}%, #374151 ${((config.smoothing - 0.1) / (0.9 - 0.1)) * 100}%, #374151 100%)`
                                    }}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>Scale</span>
                                    <span>{config.scale.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.1"
                                    value={config.scale}
                                    onChange={(e) =>
                                        setConfig((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))
                                    }
                                    className="range-slider-pink"
                                    style={{
                                        background: `linear-gradient(to right, #ec4899 0%, #f472b6 ${((config.scale - 0.5) / (2.0 - 0.5)) * 100}%, #374151 ${((config.scale - 0.5) / (2.0 - 0.5)) * 100}%, #374151 100%)`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={resetPose}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-900/50 hover:bg-cyan-700/50 border border-cyan-500/50 rounded-lg text-cyan-100 font-semibold transition-all text-sm cursor-pointer">
                            <ArrowPathIcon className="w-4 h-4" />
                            Reset Pose
                        </button>

                        {/* Instructions */}
                        <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-gray-500 text-center">
                            {cameraEnabled
                                ? 'Stand back so the camera can see your full body'
                                : 'Enable camera to track your movements'}
                        </div>
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
        { title: '3D Motion Capture' },
        {
            property: 'og:title',
            content: '3D Motion Capture'
        },
        {
            name: 'description',
            content: '3D Motion Capture - Real-time pose detection that mirrors your movements onto a 3D robot avatar.'
        }
    ];
}

export default App;
