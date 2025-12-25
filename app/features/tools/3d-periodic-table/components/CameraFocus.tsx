import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
    orbitRef: React.RefObject<any>;
    isSelected: boolean;
    selectedElementId?: number;
}

const CameraFocus: React.FC<Props> = ({ orbitRef, isSelected, selectedElementId }) => {
    const { camera } = useThree();
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
        orbitRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);

        if (isSelected) {
            // Atomic view: Transition to a specific top-down closer angle when selected/switched
            if (isTransitioning.current) {
                const targetPos = new THREE.Vector3(0, 7, 14);

                if (camera.position.distanceTo(targetPos) > 0.1) {
                    camera.position.lerp(targetPos, 0.1);
                } else {
                    isTransitioning.current = false;
                }
            }
        } else if (!isInteracting.current) {
            // Main interface: Slowly and continuously pull back to front view [0, 0, 60]
            // Only when NOT interacting to avoid "fighting" the user
            const targetPos = new THREE.Vector3(0, 0, 60);
            if (camera.position.distanceTo(targetPos) > 0.1) {
                camera.position.lerp(targetPos, 0.02);
            }
        }

        orbitRef.current.update();
    });

    return null;
};

export default CameraFocus;
