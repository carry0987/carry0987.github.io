import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { ElementData, Vector3D } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface Props {
    element: ElementData;
    position: Vector3D;
    isSelected: boolean;
    isMatched: boolean;
    onSelect: (el: ElementData) => void;
}

const ElementCard: React.FC<Props> = ({ element, position, isSelected, isMatched, onSelect }) => {
    const meshRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const [isHovered, setIsHovered] = useState(false);

    const color = useMemo(() => {
        return CATEGORY_COLORS[element.category] || CATEGORY_COLORS.unknown;
    }, [element.category]);

    useFrame((state) => {
        if (meshRef.current) {
            // Smoothly move to layout position
            meshRef.current.position.lerp(new THREE.Vector3(position.x, position.y, position.z), 0.1);

            // Idle floating animation
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + element.number) * 0.005;
        }

        if (materialRef.current) {
            // Adjust opacity based on search match
            const targetOpacity = isMatched ? 0.9 : 0.05;
            materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);

            // Adjust emissive intensity based on selection
            const baseEmissive = isMatched ? (isSelected ? 2.5 : 0.6) : 0;
            materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
                materialRef.current.emissiveIntensity,
                baseEmissive,
                0.1
            );
        }

        if (glowMaterialRef.current) {
            // Smoothly fade in/out the white glow
            const targetGlowOpacity = isHovered && isMatched && !isSelected ? 0.4 : 0;
            glowMaterialRef.current.opacity = THREE.MathUtils.lerp(
                glowMaterialRef.current.opacity,
                targetGlowOpacity,
                0.15
            );
        }
    });

    const handlePointerOver = (e: any) => {
        e.stopPropagation();
        if (isMatched) {
            document.body.style.cursor = 'pointer';
            setIsHovered(true);
        }
    };

    const handlePointerOut = (e: any) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        setIsHovered(false);
    };

    return (
        <group
            ref={meshRef}
            onClick={(e) => {
                e.stopPropagation();
                if (isMatched) onSelect(element);
            }}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}>
            {/* Hitbox & Main Body */}
            <RoundedBox args={[1.5, 2.0, 1.6]} radius={0.08} smoothness={4}>
                <meshStandardMaterial
                    ref={materialRef}
                    color={color}
                    emissive={color}
                    transparent
                    roughness={0.15}
                    metalness={0.7}
                    opacity={0.9}
                />
            </RoundedBox>

            {/* Subtle Hover Glow Outline - Raycasting disabled to prevent flickering */}
            <RoundedBox args={[1.58, 2.08, 1.68]} radius={0.1} smoothness={4} raycast={() => null}>
                <meshBasicMaterial ref={glowMaterialRef} color="white" transparent opacity={0} depthWrite={false} />
            </RoundedBox>

            {/* Search Selection Outline - Static wireframe for selected state */}
            {isMatched && isSelected && (
                <mesh raycast={() => null}>
                    <boxGeometry args={[1.6, 2.1, 1.65]} />
                    <meshBasicMaterial color="white" transparent opacity={0.15} wireframe />
                </mesh>
            )}

            {/* Front Face Text Content - Raycasting disabled to prevent pointer interruptions */}
            <group position={[0, 0, 0.81]} raycast={() => null}>
                {/* Atomic Number */}
                <Text
                    position={[-0.55, 0.8, 0]}
                    fontSize={0.16}
                    color="black"
                    anchorX="left"
                    anchorY="top"
                    fillOpacity={isMatched ? 1 : 0.1}>
                    {element.number}
                </Text>

                {/* Element Symbol */}
                <Text
                    position={[0, 0.15, 0]}
                    fontSize={0.7}
                    fontWeight="bold"
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={isMatched ? 1 : 0.1}>
                    {element.symbol}
                </Text>

                {/* Element Name */}
                <Text
                    position={[0, -0.4, 0]}
                    fontSize={0.18}
                    color="black"
                    anchorX="center"
                    anchorY="top"
                    fillOpacity={isMatched ? 1 : 0.1}>
                    {element.name}
                </Text>

                {/* Atomic Mass */}
                <Text
                    position={[0, -0.7, 0]}
                    fontSize={0.11}
                    color="black"
                    anchorX="center"
                    anchorY="top"
                    fillOpacity={isMatched ? 1 : 0.1}>
                    {element.atomic_mass.toFixed(3)}
                </Text>
            </group>
        </group>
    );
};

export default ElementCard;
