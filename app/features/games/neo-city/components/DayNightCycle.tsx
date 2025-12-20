import React, { useMemo } from 'react';
import * as THREE from 'three';

interface DayNightCycleProps {
    gameTime: number; // 0 to 24
}

const DayNightCycle: React.FC<DayNightCycleProps> = ({ gameTime }) => {
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

    return (
        <group>
            <color attach="background" args={[bgColor]} />
            <directionalLight
                position={sunPosition}
                intensity={intensity}
                color={lightColor}
                castShadow
                shadow-bias={-0.0005}
                shadow-mapSize={[2048, 2048]}
            />

            <ambientLight intensity={isNight ? 0.3 : 0.6} color={isNight ? '#3b82f6' : '#ffffff'} />
        </group>
    );
};

export default DayNightCycle;
