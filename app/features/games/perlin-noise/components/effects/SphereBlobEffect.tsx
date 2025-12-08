import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { SphereBlobMaterial } from '../materials';
import type { EffectParams, FireballParams } from '../../types';

// Extend R3F with our custom material
extend({ SphereBlobMaterial });

interface SphereBlobEffectProps {
    params: EffectParams;
    fireballParams: FireballParams;
}

const SphereBlobEffect: React.FC<SphereBlobEffectProps> = ({ params, fireballParams }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const startTimeRef = useRef(Date.now());

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
        if (meshRef.current) {
            meshRef.current.rotation.y += fireballParams.velocity;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2, 64]} />
            <sphereBlobMaterial ref={materialRef} wireframe={params.wireframe} />
        </mesh>
    );
};

export default SphereBlobEffect;
