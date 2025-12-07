import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { PlasmaMaterial } from '../materials';
import type { EffectParams } from '../../types';

// Extend R3F with our custom material
extend({ PlasmaMaterial });

interface PlasmaEffectProps {
    params: EffectParams;
}

const PlasmaEffect: React.FC<PlasmaEffectProps> = ({ params }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += 0.01;
            materialRef.current.uniforms.uSpeed.value = params.speed;
            materialRef.current.uniforms.uNoiseScale.value = params.noiseScale;
            materialRef.current.uniforms.uColorA.value.set(params.colorA);
            materialRef.current.uniforms.uColorB.value.set(params.colorB);
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[8, 8, 32, 32]} />
            <plasmaMaterial ref={materialRef} side={THREE.DoubleSide} wireframe={params.wireframe} />
        </mesh>
    );
};

export default PlasmaEffect;
