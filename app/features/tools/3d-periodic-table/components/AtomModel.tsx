import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail, Float, Text, Billboard, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { type ElementData, PerformanceLevel } from '../types';

interface Props {
    element: ElementData;
    performance?: PerformanceLevel;
    isPanelOpen?: boolean;
}

const Electron: React.FC<{ radius: number; speed: number; offset: number; trailLength: number }> = ({
    radius,
    speed,
    offset,
    trailLength
}) => {
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.getElapsedTime() * speed + offset;
            ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
        }
    });

    return (
        <group ref={ref}>
            <Trail width={0.25} length={trailLength} color="#facc15" attenuation={(t) => t * t}>
                <Sphere args={[0.06, 12, 12]}>
                    <meshBasicMaterial color="#facc15" />
                </Sphere>
            </Trail>
        </group>
    );
};

const OrbitLine: React.FC<{ radius: number }> = ({ radius }) => {
    const points = useMemo(() => {
        const pts = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
        }
        return pts;
    }, [radius]);

    return <Line points={points} color="white" lineWidth={0.5} transparent opacity={0.15} />;
};

const Nucleus: React.FC<{
    protons: number;
    neutrons: number;
    maxParticles: number;
    isPanelOpen?: boolean;
}> = ({ protons, neutrons, maxParticles, isPanelOpen }) => {
    const groupRef = useRef<THREE.Group>(null);
    const total = protons + neutrons;
    const displayCount = Math.min(total, maxParticles);

    const particles = useMemo(() => {
        const temp = [];
        const pool: string[] = Array.from({ length: displayCount }, (_, i) => {
            // Logic to ensure mixed protons and neutrons
            return i < displayCount * (protons / total) ? '#ef4444' : '#3b82f6';
        });

        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // TIGHT COMPACT CORE
        const baseRadius = 0.22 * Math.pow(displayCount, 1 / 3);

        for (let i = 0; i < displayCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = baseRadius * Math.pow(Math.random(), 0.33);

            temp.push({
                pos: [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)],
                color: pool[i]
            });
        }
        return temp;
    }, [protons, neutrons, displayCount]);

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.getElapsedTime();
            const s = 1 + Math.sin(t * 1.5) * 0.01;
            groupRef.current.scale.set(s, s, s);
            groupRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group>
            <group ref={groupRef}>
                {particles.map((p, i) => (
                    <group key={i} position={p.pos as any}>
                        <Sphere args={[0.18, 12, 12]}>
                            <meshStandardMaterial
                                color={p.color}
                                emissive={p.color}
                                emissiveIntensity={0.5}
                                roughness={0.2}
                                metalness={0.4}
                            />
                        </Sphere>
                    </group>
                ))}
            </group>

            <Html
                position={[0, 1.5, 0]}
                center
                distanceFactor={10}
                style={{
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: isPanelOpen ? 0 : 1,
                    pointerEvents: 'none'
                }}>
                <div className="whitespace-nowrap bg-black/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border border-white/20 flex items-center gap-3 shadow-2xl">
                    <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        {protons}P
                    </span>
                    <div className="w-px h-2 bg-white/20"></div>
                    <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {neutrons}N
                    </span>
                </div>
            </Html>
        </group>
    );
};

const AtomModel: React.FC<Props> = ({ element, performance = PerformanceLevel.MEDIUM, isPanelOpen }) => {
    const protons = element.number;
    const neutrons = Math.round(element.atomic_mass) - protons;

    const nucleusConfig = useMemo(() => {
        switch (performance) {
            case PerformanceLevel.LOW:
                return { maxParticles: 20, trail: 1 };
            case PerformanceLevel.HIGH:
                return { maxParticles: 150, trail: 6 };
            default:
                return { maxParticles: 80, trail: 3 };
        }
    }, [performance]);

    const shells = useMemo(() => {
        let remaining = protons;
        const distribution = [2, 8, 18, 32, 32, 18, 8];
        const result: number[] = [];
        for (const max of distribution) {
            if (remaining <= 0) break;
            const count = Math.min(remaining, max);
            result.push(count);
            remaining -= count;
        }
        return result;
    }, [protons]);

    return (
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.05}>
            {/* Scale adjusted from 1.8 to 1.0 to ensure it fits in camera view at Z=20~30 */}
            <group scale={1.0}>
                <Nucleus
                    protons={protons}
                    neutrons={neutrons}
                    maxParticles={nucleusConfig.maxParticles}
                    isPanelOpen={isPanelOpen}
                />
                {shells.map((count, shellIdx) => {
                    const radius = (shellIdx + 1) * 2.2;
                    return (
                        <group key={shellIdx}>
                            <OrbitLine radius={radius} />
                            <Billboard position={[radius, 0.2, 0]}>
                                <Text
                                    fontSize={0.12}
                                    color="#94a3b8"
                                    anchorX="center"
                                    anchorY="bottom"
                                    fontWeight="bold">
                                    n={shellIdx + 1}
                                </Text>
                            </Billboard>
                            {Array.from({ length: count }).map((_, eIdx) => (
                                <Electron
                                    key={eIdx}
                                    radius={radius}
                                    speed={0.4 / (shellIdx + 1)}
                                    offset={(eIdx / count) * Math.PI * 2}
                                    trailLength={nucleusConfig.trail}
                                />
                            ))}
                        </group>
                    );
                })}
            </group>
        </Float>
    );
};

export default AtomModel;
