import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCameraAvailabilityOptions {
    /** Callback when camera becomes unavailable */
    onCameraUnavailable?: () => void;
    /** Callback when camera error occurs (permission denied, etc.) */
    onCameraError?: () => void;
}

interface UseCameraAvailabilityReturn {
    /** Whether a camera is available */
    cameraAvailable: boolean;
    /** Whether the camera is currently enabled/active */
    cameraEnabled: boolean;
    /** Set camera enabled state */
    setCameraEnabled: (enabled: boolean) => void;
    /** Handle camera error (call this from your camera component) */
    handleCameraError: () => void;
    /** Ref to track if camera error has occurred */
    cameraErrorOccurredRef: React.RefObject<boolean>;
}

/**
 * Hook to manage camera availability detection and state.
 * Handles checking for camera devices, listening to device changes,
 * and managing camera error states.
 */
export function useCameraAvailability(options: UseCameraAvailabilityOptions = {}): UseCameraAvailabilityReturn {
    const { onCameraUnavailable, onCameraError } = options;

    const [cameraAvailable, setCameraAvailable] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const cameraErrorOccurredRef = useRef(false);

    const handleCameraError = useCallback(() => {
        cameraErrorOccurredRef.current = true;
        setCameraAvailable(false);
        setCameraEnabled(false);
        onCameraError?.();
    }, [onCameraError]);

    useEffect(() => {
        // Check if mediaDevices API is available (requires secure context: HTTPS or localhost)
        if (!navigator.mediaDevices) {
            console.warn('mediaDevices API not available (requires HTTPS or localhost)');
            cameraErrorOccurredRef.current = true;
            setCameraAvailable(false);
            setCameraEnabled(false);
            onCameraUnavailable?.();
            return;
        }

        const checkCameraAvailability = async () => {
            // If camera error occurred (permission denied, etc.), don't auto-restore
            if (cameraErrorOccurredRef.current) {
                return;
            }

            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasCamera = devices.some((device) => device.kind === 'videoinput');

                setCameraAvailable((prev) => {
                    if (hasCamera !== prev) {
                        if (!hasCamera) {
                            setCameraEnabled(false);
                            onCameraUnavailable?.();
                        }
                        return hasCamera;
                    }
                    return prev;
                });
            } catch (err) {
                console.warn('Failed to enumerate devices:', err);
            }
        };

        // Initial check
        checkCameraAvailability();

        // Listen for device changes (plug/unplug)
        const handleDeviceChange = () => {
            // Reset error state on device change to allow re-detection
            // This handles the case when user plugs in a new camera
            cameraErrorOccurredRef.current = false;
            checkCameraAvailability();
        };

        navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
        };
    }, [onCameraUnavailable]);

    return {
        cameraAvailable,
        cameraEnabled,
        setCameraEnabled,
        handleCameraError,
        cameraErrorOccurredRef
    };
}
