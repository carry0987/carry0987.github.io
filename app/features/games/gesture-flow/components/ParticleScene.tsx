import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { type HandData, ShapeType } from '../types';

interface ParticleSceneProps {
    handData: React.RefObject<HandData>;
    count: number;
    size: number;
    shape: ShapeType;
    color: string;
}

const ParticleScene: React.FC<ParticleSceneProps> = ({ handData, count, size, shape, color }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const { viewport } = useThree();

    // Adjust size for mobile devices (smaller viewport width)
    const isMobile = viewport.width < 6;
    const adjustedSize = isMobile ? size * 0.6 : size;
    // Scale factor for shapes on mobile
    const shapeScale = isMobile ? 0.5 : 1;

    // Create buffers
    const { positions, originalPositions, colors, randoms } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const orig = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        const rands = new Float32Array(count * 3); // For individual variation

        const colorObj = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            let x = 0,
                y = 0,
                z = 0;

            if (shape === ShapeType.NEBULA) {
                // Sphere distribution
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const r = Math.pow(Math.random(), 1 / 3) * 4 * shapeScale; // Biased distribution
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
            } else if (shape === ShapeType.HEART) {
                // Heart curve
                // x = 16sin^3(t)
                // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
                const t = Math.random() * Math.PI * 2;
                const scale = 0.15 * shapeScale;
                x = scale * (16 * Math.pow(Math.sin(t), 3));
                y = scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                z = (Math.random() - 0.5) * 2 * shapeScale; // Thickness
                // Randomize inside volume
                const r = Math.random();
                x *= r;
                y *= r;
                z *= r;
                y += 1 * shapeScale; // Center it visually
            } else if (shape === ShapeType.SATURN) {
                // Saturn: sphere (planet) + ring
                const isRing = Math.random() < 0.4; // 40% particles form the ring
                if (isRing) {
                    // Ring around the planet (tilted)
                    const t = Math.random() * Math.PI * 2;
                    const ringRadius = (2.5 + Math.random() * 1.2) * shapeScale; // Ring from 2.5 to 3.7 radius
                    const ringThickness = (Math.random() - 0.5) * 0.15 * shapeScale; // Thin ring
                    x = ringRadius * Math.cos(t);
                    z = ringRadius * Math.sin(t);
                    y = ringThickness + x * 0.3; // Tilt the ring
                } else {
                    // Sphere (planet body)
                    const phi = Math.acos(2 * Math.random() - 1);
                    const theta = Math.random() * Math.PI * 2;
                    const sphereRadius = 1.5 * Math.cbrt(Math.random()) * shapeScale; // Filled sphere
                    x = sphereRadius * Math.sin(phi) * Math.cos(theta);
                    y = sphereRadius * Math.sin(phi) * Math.sin(theta);
                    z = sphereRadius * Math.cos(phi);
                }
            } else {
                // Cube / Default
                x = (Math.random() - 0.5) * 4 * shapeScale;
                y = (Math.random() - 0.5) * 4 * shapeScale;
                z = (Math.random() - 0.5) * 4 * shapeScale;
            }

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            orig[i * 3] = x;
            orig[i * 3 + 1] = y;
            orig[i * 3 + 2] = z;

            // Color variation
            cols[i * 3] = colorObj.r + (Math.random() - 0.5) * 0.2;
            cols[i * 3 + 1] = colorObj.g + (Math.random() - 0.5) * 0.2;
            cols[i * 3 + 2] = colorObj.b + (Math.random() - 0.5) * 0.2;

            rands[i] = Math.random();
        }
        return { positions: pos, originalPositions: orig, colors: cols, randoms: rands };
    }, [count, shape, color, shapeScale]); // Re-calculate when these change

    // Temporary vectors for calculation to avoid GC
    const tempVec3 = new THREE.Vector3();
    const targetVec3 = new THREE.Vector3();
    const mouseVec3 = new THREE.Vector3();

    useFrame((state) => {
        if (!pointsRef.current) return;

        const hand = handData.current;
        const geometry = pointsRef.current.geometry;
        const positionAttribute = geometry.attributes.position;
        const time = state.clock.getElapsedTime();

        // Smoothly update hand influence position
        // We linearly interpolate the mouse vector for smoothness
        if (hand.isPresent) {
            mouseVec3.lerp(new THREE.Vector3(hand.position.x, hand.position.y, hand.position.z), 0.1);
        } else {
            // If no hand, drift to center or idle
            mouseVec3.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        }

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Current pos
            tempVec3.set(positionAttribute.array[ix], positionAttribute.array[iy], positionAttribute.array[iz]);

            // Original base pos (the shape)
            targetVec3.set(originalPositions[ix], originalPositions[iy], originalPositions[iz]);

            // Add some idle float movement (Noise-like)
            targetVec3.x += Math.sin(time * 0.5 + randoms[i] * 10) * 0.1;
            targetVec3.y += Math.cos(time * 0.3 + randoms[i] * 10) * 0.1;

            // Interaction Logic
            if (hand.isPresent) {
                const dist = tempVec3.distanceTo(mouseVec3);

                if (hand.isOpen) {
                    // EXPLODE / REPEL (Open Hand)
                    // Move away from hand center
                    if (dist < 4.0) {
                        const force = (4.0 - dist) * 0.15; // Repulsion strength
                        const dir = tempVec3.clone().sub(mouseVec3).normalize();
                        targetVec3.add(dir.multiplyScalar(force * 5));
                    }
                } else {
                    // ATTRACT / CONDENSE (Closed Hand)
                    // Move towards hand center
                    const attractionStrength = 0.05 + (1 - dist / 10) * 0.1;
                    targetVec3.lerp(mouseVec3, attractionStrength);
                }
            }

            // Physics integration (Lerp current to target)
            // "Stiffness" of the particles
            const lerpFactor = 0.05 + randoms[i] * 0.02;
            tempVec3.lerp(targetVec3, lerpFactor);

            positionAttribute.array[ix] = tempVec3.x;
            positionAttribute.array[iy] = tempVec3.y;
            positionAttribute.array[iz] = tempVec3.z;
        }

        positionAttribute.needsUpdate = true;

        // Rotate entire system slowly
        pointsRef.current.rotation.y = time * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={adjustedSize}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default ParticleScene;
