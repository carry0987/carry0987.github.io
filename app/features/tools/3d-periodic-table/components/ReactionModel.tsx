import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { type ElementData, PerformanceLevel } from '../types';

interface Props {
    element: ElementData;
    performance?: PerformanceLevel;
}

const ReactionModel: React.FC<Props> = ({ element, performance = PerformanceLevel.MEDIUM }) => {
    const pointsRef = useRef<THREE.Points>(null);

    const count = useMemo(() => {
        switch (performance) {
            case PerformanceLevel.LOW:
                return 500;
            case PerformanceLevel.HIGH:
                return 5000;
            default:
                return 2000;
        }
    }, [performance]);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 2;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.getElapsedTime();
        const type = element.reaction_type;
        const array = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            if (type === 'Combustion') {
                array[i3 + 1] += Math.random() * 0.1;
                if (array[i3 + 1] > 5) {
                    array[i3] = (Math.random() - 0.5) * 1;
                    array[i3 + 1] = -2;
                    array[i3 + 2] = (Math.random() - 0.5) * 1;
                }
            } else if (type === 'Oxidation') {
                array[i3 + 1] -= Math.random() * 0.01;
                if (array[i3 + 1] < -3) array[i3 + 1] = 3;
                array[i3] += Math.sin(time + i) * 0.005;
            } else {
                array[i3] += Math.sin(time * 0.2 + i) * 0.002;
                array[i3 + 1] += Math.cos(time * 0.2 + i) * 0.002;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    const color = useMemo(() => {
        if (element.name === 'Magnesium') return '#ffffff';
        if (element.reaction_type === 'Combustion') return '#ff6600';
        if (element.reaction_type === 'Oxidation') return '#8b4513';
        return '#4fc3f7';
    }, [element]);

    return (
        <group>
            <Points ref={pointsRef} positions={positions} stride={3}>
                <PointMaterial
                    transparent
                    vertexColors={false}
                    color={color}
                    size={0.15}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            <pointLight intensity={2} color={color} distance={10} />
        </group>
    );
};

export default ReactionModel;
