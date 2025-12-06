import React, { useEffect, useRef } from 'react';
import type { Pose } from '@mediapipe/pose';
import type { PoseResults } from '../types';
import { usePageVisibility } from '@/hooks';

interface PoseSensorProps {
    onPoseDetected: (results: PoseResults) => void;
    isActive: boolean;
    onCameraReady?: () => void;
    onCameraError?: () => void;
}

const PoseSensor: React.FC<PoseSensorProps> = ({ onPoseDetected, isActive, onCameraReady, onCameraError }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = React.useState(true);
    const requestRef = useRef<number>(0);
    const poseRef = useRef<Pose | null>(null);
    const { isVisible, isVisibleRef } = usePageVisibility();
    const isPaused = !isVisible;

    useEffect(() => {
        if (!isActive) return;
        if (!videoRef.current) return;
        const videoElement = videoRef.current;

        let stream: MediaStream | null = null;
        let isProcessing = false;

        const initPose = async () => {
            // Dynamic import for client-side only
            const mediapipePose = await import('@mediapipe/pose');
            const PoseClass = mediapipePose.Pose;

            const pose = new PoseClass({
                locateFile: (file: string) => {
                    return `/mediapipe/pose/${file}`;
                }
            });

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            pose.onResults((results) => {
                setLoading(false);
                onCameraReady?.();
                if (!results.poseLandmarks) return;
                onPoseDetected({ poseLandmarks: results.poseLandmarks as PoseResults['poseLandmarks'] });
            });

            poseRef.current = pose;

            // Start camera after pose is initialized
            startCamera();
        };

        const loop = async () => {
            if (!isActive || !videoElement) return;

            // Skip processing if page is not visible
            if (isVisibleRef.current && videoElement.readyState >= 2 && !isProcessing && poseRef.current) {
                isProcessing = true;
                try {
                    await poseRef.current.send({ image: videoElement });
                } catch (e) {
                    console.error('Pose processing error:', e);
                } finally {
                    isProcessing = false;
                }
            }
            requestRef.current = requestAnimationFrame(loop);
        };

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch((e) => console.error('Play error:', e));
                        loop();
                    };
                }
            } catch (err) {
                console.error('Error accessing webcam:', err);
                setLoading(false);
                onCameraError?.();
            }
        };

        initPose();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            if (poseRef.current) {
                poseRef.current.close();
                poseRef.current = null;
            }
        };
    }, [isActive, onPoseDetected, onCameraReady, onCameraError]);

    if (!isActive) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {/* Paused indicator */}
            {isPaused && (
                <div className="bg-yellow-500/80 text-white p-2 rounded-lg text-sm mb-2 backdrop-blur-md max-w-xs">
                    Paused (tab not visible)
                </div>
            )}
            {/* Error message */}
            {!loading && !videoRef.current?.srcObject && (
                <div className="bg-red-500/80 text-white p-2 rounded-lg text-sm mb-2 backdrop-blur-md max-w-xs">
                    Cannot access camera
                </div>
            )}
            {/* Video container */}
            <div className="relative w-32 h-24 sm:w-48 sm:h-36 rounded-lg overflow-hidden border border-cyan-500/50 shadow-lg bg-black/50">
                <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" playsInline muted />
                <div className="absolute top-1 left-1 text-[10px] text-white/70 bg-black/40 px-1 rounded">
                    Pose Input
                </div>
                {loading && isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-xs text-cyan-400">
                        Init Vision...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PoseSensor;
