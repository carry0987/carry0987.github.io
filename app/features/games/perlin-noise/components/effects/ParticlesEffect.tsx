import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticlesMaterial } from '../materials';
import type { EffectParams, FireballParams } from '../../types';

// Extend R3F with our custom material
extend({ ParticlesMaterial });

interface ParticlesEffectProps {
    params: EffectParams;
    fireballParams: FireballParams;
}

const ParticlesEffect: React.FC<ParticlesEffectProps> = ({ params, fireballParams }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const startTimeRef = useRef(Date.now());

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
            const elapsed = (Date.now() - startTimeRef.current) * fireballParams.speed;
            materialRef.current.uniforms.uTime.value = elapsed;
            materialRef.current.uniforms.uDecay.value = fireballParams.decay;
            materialRef.current.uniforms.uComplex.value = fireballParams.complex;
            materialRef.current.uniforms.uWaves.value = fireballParams.waves;
            materialRef.current.uniforms.uColorA.value.set(params.colorA);
            materialRef.current.uniforms.uColorB.value.set(params.colorB);
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y += fireballParams.velocity;
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
