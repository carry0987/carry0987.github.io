import React, { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver, type NormalizedLandmark } from '@mediapipe/tasks-vision';
import type { HandData } from '../types';

interface HandTrackerProps {
    onHandUpdate: (data: HandData) => void;
    onCameraReady: () => void;
}

const HandTracker: React.FC<HandTrackerProps> = ({ onHandUpdate, onCameraReady }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const lastVideoTimeRef = useRef<number>(-1);
    const requestRef = useRef<number>(0);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);

    useEffect(() => {
        let isMounted = true;

        const setupMediaPipe = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
                );

                if (!isMounted) return;

                handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: 'GPU'
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                });

                startWebcam();
            } catch (err) {
                console.error('Error initializing MediaPipe:', err);
                setError('Failed to load AI model. Please check your network connection.');
            }
        };

        setupMediaPipe();

        return () => {
            isMounted = false;
            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
            cancelAnimationFrame(requestRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startWebcam = async () => {
        try {
            let stream: MediaStream;
            // Try with preferred constraints first (User facing, specific resolution)
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    }
                });
            } catch (err) {
                console.warn('Preferred camera constraints failed, trying fallback...', err);
                // Fallback to any available video device
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadeddata', () => {
                    onCameraReady();
                    predictWebcam();
                });
            }
        } catch (err) {
            console.error('Camera error:', err);
            let msg = 'Cannot access camera. Please allow permission.';
            if (err instanceof Error) {
                if (err.name === 'NotFoundError' || err.message.includes('device not found')) {
                    msg = 'Camera device not found. Please ensure a camera is connected.';
                } else if (err.name === 'NotAllowedError') {
                    msg = 'Camera permission denied. Please allow access in your browser settings.';
                } else if (err.name === 'NotReadableError') {
                    msg = 'Camera may be in use by another application.';
                }
            }
            setError(msg);
        }
    };

    const predictWebcam = () => {
        if (!handLandmarkerRef.current || !videoRef.current) return;

        let startTimeMs = performance.now();

        if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = videoRef.current.currentTime;
            // Ensure video has dimensions before detecting
            if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                try {
                    const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

                    if (results.landmarks && results.landmarks.length > 0) {
                        const landmarks = results.landmarks[0];
                        processLandmarks(landmarks);
                    } else {
                        // No hand detected
                        onHandUpdate({
                            isPresent: false,
                            isOpen: true,
                            position: { x: 0, y: 0, z: 0 },
                            pinchStrength: 0
                        });
                    }
                } catch (e) {
                    console.warn('Detection error (skipped frame):', e);
                }
            }
        }

        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    const processLandmarks = (landmarks: NormalizedLandmark[]) => {
        // MediaPipe Coords: x (0 left - 1 right), y (0 top - 1 bottom), z (depth)

        // 1. Calculate center (Wrist + Middle Finger Base)
        const wrist = landmarks[0];

        // Map to -1 to 1 range for 3D space
        // Flip X because webcam is mirrored
        const x = (0.5 - wrist.x) * 2 * 3; // Scale up for 3D scene coverage
        const y = -(wrist.y - 0.5) * 2 * 2; // Invert Y
        const z = 0; // Keep Z separate or use wrist.z if accurate enough

        // 2. Detect Open/Closed state
        // Measure distance between Wrist(0) and Middle Finger Tip(12)
        const middleTip = landmarks[12];
        const distance = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);

        // Thresholds need tuning based on hand size, but ratio is safer
        const isOpen = distance > 0.2; // Rough heuristic

        onHandUpdate({
            isPresent: true,
            isOpen: isOpen,
            position: { x, y, z },
            pinchStrength: isOpen ? 0 : 1
        });
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {error && (
                <div className="bg-red-500/80 text-white p-2 rounded-lg text-sm mb-2 backdrop-blur-md max-w-xs">
                    {error}
                </div>
            )}
            <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-white/20 shadow-lg bg-black/50">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover transform scale-x-[-1]"
                    autoPlay
                    playsInline
                    muted
                />
                <div className="absolute top-1 left-1 text-[10px] text-white/70 bg-black/40 px-1 rounded">Input</div>
            </div>
        </div>
    );
};

export default HandTracker;
