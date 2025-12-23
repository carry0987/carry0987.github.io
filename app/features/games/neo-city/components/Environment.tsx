import { useMemo, useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GRID_SIZE } from '../constants';

const getRandomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Shared geometries - created once
const sphereGeo = new THREE.SphereGeometry(1, 6, 6); // Reduced segments
const birdWingGeo = new THREE.BoxGeometry(0.2, 0.05, 0.05);

// Shared materials - created once
const cloudMaterial = new THREE.MeshBasicMaterial({
    color: 'white',
    opacity: 0.4,
    transparent: true
});
const birdMaterial = new THREE.MeshBasicMaterial({ color: '#333' });

// Cloud component - memoized to prevent unnecessary re-renders
const Cloud = memo(
    ({
        position,
        scale,
        speed,
        seed
    }: {
        position: [number, number, number];
        scale: number;
        speed: number;
        seed: number;
    }) => {
        const group = useRef<THREE.Group>(null);
        const timeAccum = useRef(0);

        // Throttled update - only update every 2 frames
        useFrame((state, delta) => {
            if (group.current) {
                timeAccum.current += delta;
                // Update position less frequently
                if (timeAccum.current > 0.033) {
                    // ~30fps instead of 60fps
                    group.current.position.x += speed * timeAccum.current;
                    if (group.current.position.x > GRID_SIZE * 1.5) {
                        group.current.position.x = -GRID_SIZE * 1.5;
                    }
                    timeAccum.current = 0;
                }
            }
        });

        // Generate cloud bubbles based on seed for consistency
        const bubbles = useMemo(() => {
            const rng = (s: number) => {
                const x = Math.sin(s) * 10000;
                return x - Math.floor(x);
            };
            // Reduced bubble count from 5-10 to 3-5
            const count = 3 + Math.round(rng(seed) * 2);
            return Array.from({ length: count }).map((_, i) => ({
                pos: [
                    (rng(seed + i * 3) - 0.5) * 2,
                    rng(seed + i * 3 + 1) - 0.5,
                    (rng(seed + i * 3 + 2) - 0.5) * 2
                ] as [number, number, number],
                scale: 0.5 + rng(seed + i * 4) * 0.7
            }));
        }, [seed]);

        return (
            <group ref={group} position={position} scale={scale}>
                {bubbles.map((b, i) => (
                    <mesh
                        key={i}
                        geometry={sphereGeo}
                        material={cloudMaterial}
                        position={b.pos}
                        scale={b.scale}
                        // Disable shadows for clouds - big performance win
                        castShadow={false}
                        receiveShadow={false}
                    />
                ))}
            </group>
        );
    }
);

Cloud.displayName = 'Cloud';

// Bird using instanced geometry for wings
const Bird = memo(
    ({ position, speed, offset }: { position: [number, number, number]; speed: number; offset: number }) => {
        const ref = useRef<THREE.Group>(null);
        const leftWingRef = useRef<THREE.Mesh>(null);
        const rightWingRef = useRef<THREE.Mesh>(null);
        const timeAccum = useRef(0);

        useFrame((state) => {
            if (ref.current) {
                const time = state.clock.elapsedTime + offset;
                timeAccum.current += 1;

                // Update position every frame but with simpler math
                const sin = Math.sin(time * speed);
                const cos = Math.cos(time * speed);
                ref.current.position.x = position[0] + sin * (GRID_SIZE / 2);
                ref.current.position.z = position[1] + cos * (GRID_SIZE / 2);
                ref.current.rotation.y = -time * speed + Math.PI;

                // Wing flapping animation - update less frequently
                if (timeAccum.current % 2 === 0) {
                    const wingScale = 1 + Math.sin(time * 15) * 0.3;
                    if (leftWingRef.current) leftWingRef.current.scale.y = wingScale;
                    if (rightWingRef.current) rightWingRef.current.scale.y = wingScale;
                }
            }
        });

        return (
            <group ref={ref} position={[position[0], position[2], position[1]]}>
                <mesh
                    ref={leftWingRef}
                    geometry={birdWingGeo}
                    material={birdMaterial}
                    position={[0.1, 0, 0]}
                    rotation={[0, Math.PI / 4, 0]}
                />
                <mesh
                    ref={rightWingRef}
                    geometry={birdWingGeo}
                    material={birdMaterial}
                    position={[-0.1, 0, 0]}
                    rotation={[0, -Math.PI / 4, 0]}
                />
            </group>
        );
    }
);

Bird.displayName = 'Bird';

// Main component - memoized
const EnvironmentEffects = memo(() => {
    return (
        <group raycast={() => null}>
            {/* Reduced cloud count from 5 to 3 */}
            <Cloud position={[-12, 10, 4]} scale={1.5} speed={0.3} seed={1} />
            <Cloud position={[5, 12, -8]} scale={1.2} speed={0.4} seed={2} />
            <Cloud position={[15, 9, 10]} scale={1.6} speed={0.25} seed={3} />

            {/* Reduced bird count from 3 to 2 */}
            <group position={[0, 0, 0]} scale={0.8}>
                <Bird position={[0, 0, 8]} speed={0.5} offset={0} />
                <Bird position={[2, 0, 8]} speed={0.5} offset={1.5} />
            </group>
        </group>
    );
});

EnvironmentEffects.displayName = 'EnvironmentEffects';

export default EnvironmentEffects;
