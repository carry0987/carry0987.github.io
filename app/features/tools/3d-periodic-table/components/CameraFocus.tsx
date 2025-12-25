import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
    orbitRef: React.RefObject<any>;
    isSelected: boolean;
}

const CameraFocus: React.FC<Props> = ({ orbitRef, isSelected }) => {
    const { camera } = useThree();
    const isTransitioning = useRef(false);
    const lastSelected = useRef(isSelected);

    useEffect(() => {
        if (lastSelected.current !== isSelected) {
            isTransitioning.current = true;
            lastSelected.current = isSelected;
        }
    }, [isSelected]);

    useFrame(() => {
        if (!orbitRef.current) return;

        // Smoothly focus the orbit target
        orbitRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);

        if (isSelected) {
            // Atomic view: Only transition once when selected, then allow free movement
            if (isTransitioning.current) {
                const targetDistance = 30;
                const currentDistance = camera.position.length();

                if (Math.abs(currentDistance - targetDistance) > 0.1) {
                    const direction = camera.position.clone().normalize();
                    const newDistance = THREE.MathUtils.lerp(currentDistance, targetDistance, 0.1);
                    camera.position.copy(direction.multiplyScalar(newDistance));
                } else {
                    isTransitioning.current = false;
                }
            }
        } else {
            // Main interface: Slowly and continuously pull back to front view [0, 0, 60]
            const targetPos = new THREE.Vector3(0, 0, 60);
            camera.position.lerp(targetPos, 0.05);
        }

        orbitRef.current.update();
    });

    return null;
};

export default CameraFocus;
