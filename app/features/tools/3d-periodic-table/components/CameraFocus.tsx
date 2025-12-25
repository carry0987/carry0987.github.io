import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
    orbitRef: React.RefObject<any>;
    isSelected: boolean;
}

const CameraFocus: React.FC<Props> = ({ orbitRef, isSelected }) => {
    const { camera } = useThree();
    const targetDistance = isSelected ? 30 : 60;

    useFrame(() => {
        // Smoothly focus the orbit target
        if (orbitRef.current) {
            orbitRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
            orbitRef.current.update();
        }

        // Smoothly adjust camera distance
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetDistance, 0.05);
    });

    return null;
};

export default CameraFocus;
