import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectType, type EffectParams } from '../types';
import { TerrainEffect, SphereBlobEffect, PlasmaEffect, ParticlesEffect } from './effects';

interface ThreeSceneProps {
    effectType: EffectType;
    params: EffectParams;
}

// Camera positions for each effect type
const CAMERA_POSITIONS: Record<EffectType, [number, number, number]> = {
    [EffectType.TERRAIN]: [0, 3, 4],
    [EffectType.SPHERE_BLOB]: [0, 0, 6],
    [EffectType.PARTICLES]: [0, 0, 8],
    [EffectType.PLASMA]: [0, 0, 5]
};

const ThreeScene: React.FC<ThreeSceneProps> = ({ effectType, params }) => {
    const cameraPosition = CAMERA_POSITIONS[effectType];

    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <Canvas
                camera={{
                    position: cameraPosition,
                    fov: 60,
                    near: 0.1,
                    far: 1000
                }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: false
                }}>
                {/* Scene setup */}
                <color attach="background" args={[0x050505]} />
                <fogExp2 attach="fog" args={[0x050505, 0.02]} />

                {/* Controls */}
                <OrbitControls enableDamping dampingFactor={0.05} enableZoom />

                {/* Effects */}
                {effectType === EffectType.TERRAIN && <TerrainEffect params={params} />}
                {effectType === EffectType.SPHERE_BLOB && <SphereBlobEffect params={params} />}
                {effectType === EffectType.PLASMA && <PlasmaEffect params={params} />}
                {effectType === EffectType.PARTICLES && <ParticlesEffect params={params} />}
            </Canvas>
        </div>
    );
};

export default ThreeScene;
