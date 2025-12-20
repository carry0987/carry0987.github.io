import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GRID_SIZE } from '../constants';

const getRandomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const sphereGeo = new THREE.SphereGeometry(1, 8, 8);

const Cloud = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
    const group = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (group.current) {
            group.current.position.x += speed * delta;
            // Reset position when cloud goes out of bounds
            if (group.current.position.x > GRID_SIZE * 1.5) {
                group.current.position.x = -GRID_SIZE * 1.5;
            }
        }
    });

    const bubbles = useMemo(
        () =>
            Array.from({ length: 5 + Math.round(Math.random() * 5) }).map(() => ({
                pos: [getRandomRange(-1, 1), getRandomRange(-0.5, 0.5), getRandomRange(-1, 1)] as [
                    number,
                    number,
                    number
                ],
                scale: getRandomRange(0.5, 1.2)
            })),
        []
    );

    return (
        <group ref={group} position={position} scale={scale}>
            {bubbles.map((b, i) => (
                <mesh key={i} geometry={sphereGeo} position={b.pos} scale={b.scale} castShadow>
                    <meshStandardMaterial color="white" flatShading opacity={0.4} transparent />
                </mesh>
            ))}
        </group>
    );
};

const Bird = ({ position, speed, offset }: { position: [number, number, number]; speed: number; offset: number }) => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (ref.current) {
            const time = state.clock.elapsedTime + offset;
            // Circular flight path
            ref.current.position.x = position[0] + Math.sin(time * speed) * (GRID_SIZE / 2);
            ref.current.position.z = position[1] + Math.cos(time * speed) * (GRID_SIZE / 2);
            ref.current.rotation.y = -time * speed + Math.PI;
            // Flapping wings effect via scale
            ref.current.scale.y = 1 + Math.sin(time * 15) * 0.3;
        }
    });

    return (
        <group ref={ref} position={[position[0], position[2], position[1]]}>
            {/* Simple V-shaped bird */}
            <mesh geometry={boxGeo} scale={[0.2, 0.05, 0.05]} position={[0.1, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
                <meshBasicMaterial color="#333" />
            </mesh>
            <mesh geometry={boxGeo} scale={[0.2, 0.05, 0.05]} position={[-0.1, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
                <meshBasicMaterial color="#333" />
            </mesh>
        </group>
    );
};

const EnvironmentEffects = () => {
    return (
        <group raycast={() => null}>
            {/* Clouds */}
            <Cloud position={[-12, 10, 4]} scale={1.5} speed={0.3} />
            <Cloud position={[-12, 10, 4]} scale={1.5} speed={0.3} />
            <Cloud position={[5, 12, -8]} scale={1.2} speed={0.5} />
            <Cloud position={[15, 9, 10]} scale={1.8} speed={0.2} />
            <Cloud position={[-5, 11, -12]} scale={1.3} speed={0.4} />

            {/* Birds */}
            <group position={[0, 0, 0]} scale={0.8}>
                <Bird position={[0, 0, 8]} speed={0.6} offset={0} />
                <Bird position={[2, 0, 8]} speed={0.6} offset={1.2} />
                <Bird position={[-2, 0, 8]} speed={0.6} offset={2.5} />
            </group>
        </group>
    );
};

export default EnvironmentEffects;
