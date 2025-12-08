import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { FireballMaterial } from '../materials';
import type { FireballParams } from '../../types';

// Extend R3F with our custom material
extend({ FireballMaterial });

interface FireballEffectProps {
    params: FireballParams;
}

const FireballEffect: React.FC<FireballEffectProps> = ({ params }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const startTimeRef = useRef(Date.now());

    useFrame(() => {
        if (materialRef.current) {
            // Time-based animation like the original
            const elapsed = (Date.now() - startTimeRef.current) * params.speed;
            materialRef.current.uniforms.uTime.value = elapsed;
            materialRef.current.uniforms.uPointScale.value = params.pointScale;
            materialRef.current.uniforms.uDecay.value = params.decay;
            materialRef.current.uniforms.uComplex.value = params.complex;
            materialRef.current.uniforms.uWaves.value = params.waves;
            materialRef.current.uniforms.uEqColor.value = params.hue;
            materialRef.current.uniforms.uFragment.value = params.fragment;
            materialRef.current.uniforms.uElectroflow.value = params.electroflow;
        }
        if (pointsRef.current) {
            // Rotation animation
            pointsRef.current.rotation.y += params.velocity;

            // Sine-based X rotation (like original)
            const performance = Date.now() * 0.003;
            pointsRef.current.rotation.x = (Math.sin(performance * params.sinVel) * params.ampVel * Math.PI) / 180;
        }
    });

    return (
        <points ref={pointsRef}>
            <sphereGeometry args={[3, 512, 512]} />
            <fireballMaterial ref={materialRef} />
        </points>
    );
};

export default FireballEffect;
