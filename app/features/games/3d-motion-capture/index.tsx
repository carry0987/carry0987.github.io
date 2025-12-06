import React, { useState, useCallback } from 'react';
import type { PoseResults, Landmark } from './types';
import Avatar3D from './components/Avatar3D';
import PoseSensor from './components/PoseSensor';

// Import styles
import './style.css';

const App: React.FC = () => {
    const [poseData, setPoseData] = useState<PoseResults | null>(null);

    // Store the latest pose (optional, for future extensions)
    const currentPoseRef = React.useRef<Landmark[]>([]);

    const handlePoseDetected = useCallback((results: PoseResults) => {
        setPoseData(results);
        currentPoseRef.current = results.poseLandmarks;
    }, []);

    const handleResetPose = useCallback(() => {
        // Generate a neutral standing pose (A-pose ish)
        // MediaPipe Coords: x (0-1), y (0-1), z (approx meters)
        const neutralLandmarks: Landmark[] = Array.from({ length: 33 }, () => ({
            x: 0.5,
            y: 0.5,
            z: 0,
            visibility: 1
        }));

        const setL = (idx: number, x: number, y: number) => {
            neutralLandmarks[idx] = { x, y, z: 0, visibility: 1 };
        };

        // Head
        setL(0, 0.5, 0.1); // Nose
        setL(7, 0.55, 0.1); // L Ear
        setL(8, 0.45, 0.1); // R Ear
        setL(9, 0.52, 0.15); // Mouth L
        setL(10, 0.48, 0.15); // Mouth R

        // Body
        setL(11, 0.6, 0.25); // L Shoulder
        setL(12, 0.4, 0.25); // R Shoulder

        setL(13, 0.65, 0.45); // L Elbow
        setL(14, 0.35, 0.45); // R Elbow

        setL(15, 0.7, 0.6); // L Wrist
        setL(16, 0.3, 0.6); // R Wrist

        setL(23, 0.55, 0.55); // L Hip
        setL(24, 0.45, 0.55); // R Hip

        setL(25, 0.55, 0.75); // L Knee
        setL(26, 0.45, 0.75); // R Knee

        setL(27, 0.55, 0.95); // L Ankle
        setL(28, 0.45, 0.95); // R Ankle

        setPoseData({ poseLandmarks: neutralLandmarks });
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
            {/* 3D Background/Avatar Layer */}
            <div className="absolute inset-0 z-0">
                <Avatar3D poseResults={poseData} />
            </div>

            {/* Vision Sensor (Top Right) */}
            <PoseSensor isActive={true} onPoseDetected={handlePoseDetected} />

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
                {/* Header */}
                <header className="flex justify-between items-start pointer-events-auto">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600 tracking-tighter drop-shadow-sm">
                            MOTION CAPTURE
                        </h1>
                        <p className="text-cyan-200/70 text-sm mt-1">Real-time Pose to 3D Avatar</p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full ${poseData ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="font-mono font-bold text-gray-300 text-sm">
                                {poseData ? 'TRACKING ACTIVE' : 'NO SKELETON DETECTED'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Footer Instructions */}
                <footer className="pointer-events-auto flex flex-col items-center gap-4 mb-4">
                    <button
                        onClick={handleResetPose}
                        className="px-6 py-2 bg-cyan-900/80 hover:bg-cyan-700/80 border border-cyan-500/50 rounded-lg text-cyan-100 font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
                            <path d="M3 3v9h9" />
                        </svg>
                        Reset Pose
                    </button>

                    <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-xl text-center">
                        <p className="text-gray-300 text-sm">
                            Stand back so the camera can see your full body. <br />
                            The 3D Robot will mimic your movements in real-time.
                        </p>
                        <div className="mt-2 text-xs text-cyan-500/60 font-mono">
                            Powered by MediaPipe Pose & React Three Fiber
                        </div>
                    </div>
                </footer>
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
