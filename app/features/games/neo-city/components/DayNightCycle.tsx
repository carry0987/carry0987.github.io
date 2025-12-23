import React, { useMemo, memo } from 'react';
import * as THREE from 'three';

interface DayNightCycleProps {
    gameTime: number; // 0 to 24
    lowQuality?: boolean; // Performance mode flag
    shadowMapSize?: number; // Shadow map resolution
}

const DayNightCycle: React.FC<DayNightCycleProps> = memo(({ gameTime, lowQuality = false, shadowMapSize = 1024 }) => {
    const angle = ((gameTime - 6) / 24) * Math.PI * 2;
    const radius = 25;

    const sunPosition = useMemo(() => {
        return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 8);
    }, [angle]);

    const isNight = gameTime < 5.5 || gameTime > 19.5;
    const isGoldenHour = (gameTime >= 5.5 && gameTime <= 7) || (gameTime >= 18 && gameTime <= 19.5);

    const lightColor = useMemo(() => {
        if (isNight) return new THREE.Color('#3b82f6');
        if (isGoldenHour) return new THREE.Color('#ffaa44');
        return new THREE.Color('#ffffff');
    }, [isNight, isGoldenHour]);

    const intensity = useMemo(() => {
        if (isNight) return 0.2;
        if (isGoldenHour) return 0.8;
        return 1.2;
    }, [isNight, isGoldenHour]);

    const bgColor = useMemo(() => {
        if (isNight) return '#0f172a'; // Deep dark blue for night
        if (isGoldenHour) return '#fb923c'; // Orange for sunset/sunrise
        return '#BAE6FD'; // Light blue for day
    }, [isNight, isGoldenHour]);

    // Use provided shadowMapSize or fallback based on quality
    const actualShadowMapSize = lowQuality ? Math.min(shadowMapSize, 512) : shadowMapSize;

    return (
        <group>
            <color attach="background" args={[bgColor]} />
            <directionalLight
                position={sunPosition}
                intensity={intensity}
                color={lightColor}
                castShadow={!lowQuality} // Disable shadows in low quality mode
                shadow-bias={-0.001}
                shadow-mapSize={[actualShadowMapSize, actualShadowMapSize]}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
                shadow-camera-near={1}
                shadow-camera-far={50}
            />

            <ambientLight intensity={isNight ? 0.4 : 0.7} color={isNight ? '#3b82f6' : '#ffffff'} />
        </group>
    );
});

DayNightCycle.displayName = 'DayNightCycle';

export default DayNightCycle;
