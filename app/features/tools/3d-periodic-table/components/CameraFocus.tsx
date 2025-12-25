import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks';

interface Props {
    orbitRef: React.RefObject<any>;
    isSelected: boolean;
    selectedElementId?: number;
    isPanelOpen?: boolean;
}

const CameraFocus: React.FC<Props> = ({ orbitRef, isSelected, selectedElementId, isPanelOpen }) => {
    const { camera } = useThree();
    const isMobile = useIsMobile();
    const isTransitioning = useRef(false);
    const isInteracting = useRef(false);
    const lastSelectedId = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (isSelected && selectedElementId !== lastSelectedId.current) {
            isTransitioning.current = true;
            lastSelectedId.current = selectedElementId;
        } else if (!isSelected) {
            lastSelectedId.current = undefined;
        }
    }, [isSelected, selectedElementId]);

    useEffect(() => {
        const orbit = orbitRef.current;
        if (!orbit) return;

        const handleStart = () => {
            isInteracting.current = true;
        };
        const handleEnd = () => {
            isInteracting.current = false;
        };

        orbit.addEventListener('start', handleStart);
        orbit.addEventListener('end', handleEnd);

        return () => {
            orbit.removeEventListener('start', handleStart);
            orbit.removeEventListener('end', handleEnd);
        };
    }, [orbitRef.current]);

    useFrame(() => {
        if (!orbitRef.current) return;

        // Smoothly focus the orbit target
        const targetCenter = new THREE.Vector3(0, 0, 0);
        // If panel is open on desktop, offset the target to the right so the model appears on the left
        if (!isMobile && isSelected && isPanelOpen) {
            targetCenter.x = 2.5;
        }
        orbitRef.current.target.lerp(targetCenter, 0.1);

        if (isSelected) {
            // Atomic view: Transition to a specific top-down closer angle when selected/switched
            if (isTransitioning.current) {
                const targetPos = isMobile ? new THREE.Vector3(0, 10, 25) : new THREE.Vector3(0, 7, 14);
                // If panel is open on desktop, offset the camera position slightly to the left as well
                if (!isMobile && isPanelOpen) {
                    targetPos.x = -1.5;
                }

                if (camera.position.distanceTo(targetPos) > 0.1) {
                    camera.position.lerp(targetPos, 0.1);
                } else {
                    isTransitioning.current = false;
                }
            }
        } else if (!isInteracting.current) {
            // Main interface: Slowly and continuously pull back to front view [0, 0, 60]
            // Only when NOT interacting to avoid "fighting" the user
            const targetPos = isMobile ? new THREE.Vector3(0, 0, 100) : new THREE.Vector3(0, 0, 60);
            if (camera.position.distanceTo(targetPos) > 0.1) {
                camera.position.lerp(targetPos, 0.02);
            }
        }

        orbitRef.current.update();
    });

    return null;
};

export default CameraFocus;
