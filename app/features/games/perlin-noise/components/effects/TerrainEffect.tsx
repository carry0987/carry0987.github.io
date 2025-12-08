import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { TerrainMaterial } from '../materials';
import type { EffectParams, FireballParams } from '../../types';

// Extend R3F with our custom material
extend({ TerrainMaterial });

interface TerrainEffectProps {
    params: EffectParams;
    fireballParams: FireballParams;
}

const TerrainEffect: React.FC<TerrainEffectProps> = ({ params, fireballParams }) => {
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
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <terrainMaterial ref={materialRef} wireframe={params.wireframe} side={THREE.DoubleSide} />
        </mesh>
    );
};

export default TerrainEffect;
