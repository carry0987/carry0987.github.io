import React, { useEffect, useRef, useState } from 'react';
import type { PoseResults } from '../types';

interface PoseSensorProps {
    onPoseDetected: (results: PoseResults) => void;
    isActive: boolean;
}

const PoseSensor: React.FC<PoseSensorProps> = ({ onPoseDetected, isActive }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(true);
    const requestRef = useRef<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const poseRef = useRef<any>(null);

    useEffect(() => {
        if (!videoRef.current) return;
        const videoElement = videoRef.current;

        // Access the globally loaded Pose class
        const Pose = (window as any).Pose;

        if (!Pose) {
            console.error('MediaPipe Pose library not loaded');
            setLoading(false);
            return;
        }

        const pose = new Pose({
            locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pose.onResults((results: any) => {
            setLoading(false);
            if (!results.poseLandmarks) return;
            onPoseDetected({ poseLandmarks: results.poseLandmarks });
        });

        poseRef.current = pose;

        let stream: MediaStream | null = null;
        let isProcessing = false;

        const loop = async () => {
            if (!isActive || !videoElement) return;

            if (videoElement.readyState >= 2 && !isProcessing && poseRef.current) {
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
            }
        };

        if (isActive) {
            startCamera();
        }

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
    }, [isActive, onPoseDetected]);

    return (
        <div className="absolute top-4 right-4 w-32 h-24 sm:w-48 sm:h-36 bg-black rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-lg z-50">
            {/* Hidden video element for processing */}
            <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" playsInline muted />
            {loading && isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-xs text-cyan-400">
                    Init Vision...
                </div>
            )}
        </div>
    );
};

export default PoseSensor;
