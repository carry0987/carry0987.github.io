import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { TerrainMaterial } from '../materials';
import type { EffectParams } from '../../types';

// Extend R3F with our custom material
extend({ TerrainMaterial });

interface TerrainEffectProps {
    params: EffectParams;
}

const TerrainEffect: React.FC<TerrainEffectProps> = ({ params }) => {
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
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <terrainMaterial ref={materialRef} wireframe={params.wireframe} side={THREE.DoubleSide} />
        </mesh>
    );
};

export default TerrainEffect;
