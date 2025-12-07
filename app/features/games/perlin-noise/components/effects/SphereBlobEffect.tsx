import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { SphereBlobMaterial } from '../materials';
import type { EffectParams } from '../../types';

// Extend R3F with our custom material
extend({ SphereBlobMaterial });

interface SphereBlobEffectProps {
    params: EffectParams;
}

const SphereBlobEffect: React.FC<SphereBlobEffectProps> = ({ params }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += 0.01;
            materialRef.current.uniforms.uSpeed.value = params.speed;
            materialRef.current.uniforms.uNoiseScale.value = params.noiseScale;
            materialRef.current.uniforms.uDisplacement.value = params.displacement;
            materialRef.current.uniforms.uColorA.value.set(params.colorA);
            materialRef.current.uniforms.uColorB.value.set(params.colorB);
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
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
