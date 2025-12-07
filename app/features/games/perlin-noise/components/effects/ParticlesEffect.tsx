import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticlesMaterial } from '../materials';
import type { EffectParams } from '../../types';

// Extend R3F with our custom material
extend({ ParticlesMaterial });

interface ParticlesEffectProps {
    params: EffectParams;
}

const ParticlesEffect: React.FC<ParticlesEffectProps> = ({ params }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const pointsRef = useRef<THREE.Points>(null);

    // Generate particle positions and randoms
    const { positions, randoms } = useMemo(() => {
        const particleCount = 20000;
        const positions = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 3.5 + (Math.random() - 0.5) * 0.5;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            randoms[i] = Math.random();
        }

        return { positions, randoms };
    }, []);

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += 0.01;
            materialRef.current.uniforms.uSpeed.value = params.speed;
            materialRef.current.uniforms.uNoiseScale.value = params.noiseScale;
            materialRef.current.uniforms.uDisplacement.value = params.displacement;
            materialRef.current.uniforms.uColorA.value.set(params.colorA);
            materialRef.current.uniforms.uColorB.value.set(params.colorB);
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.002;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
            </bufferGeometry>
            <particlesMaterial
                ref={materialRef}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default ParticlesEffect;
