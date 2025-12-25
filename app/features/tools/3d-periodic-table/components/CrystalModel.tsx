import React, { useMemo } from 'react';
import { Sphere, Line, Float } from '@react-three/drei';
import type { ElementData } from '../types';

interface Props {
    element: ElementData;
}

const CrystalModel: React.FC<Props> = ({ element }) => {
    const structure = element.crystal_structure || 'SimpleCubic';

    const { points, bonds } = useMemo(() => {
        const pts: [number, number, number][] = [];
        const bds: [number, number, number][][] = [];
        const s = 2; // scale

        // Base Cube vertices
        const corners: [number, number, number][] = [
            [-s, -s, -s],
            [s, -s, -s],
            [s, s, -s],
            [-s, s, -s],
            [-s, -s, s],
            [s, -s, s],
            [s, s, s],
            [-s, s, s]
        ];

        // Corner atoms
        pts.push(...corners);

        // Bonds for the cube frame
        const cubeBonds = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0], // Bottom
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4], // Top
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7] // Verticals
        ];
        cubeBonds.forEach(([i, j]) => bds.push([corners[i], corners[j]]));

        if (structure === 'BCC') {
            pts.push([0, 0, 0]); // Body center
            corners.forEach((c) => bds.push([[0, 0, 0], c]));
        } else if (structure === 'FCC') {
            const faces: [number, number, number][] = [
                [s, 0, 0],
                [-s, 0, 0],
                [0, s, 0],
                [0, -s, 0],
                [0, 0, s],
                [0, 0, -s]
            ];
            pts.push(...faces);
        } else if (structure === 'Diamond') {
            const internal: [number, number, number][] = [
                [-s / 2, -s / 2, -s / 2],
                [s / 2, s / 2, -s / 2],
                [-s / 2, s / 2, s / 2],
                [s / 2, -s / 2, s / 2]
            ];
            pts.push(...internal);
        }

        return { points: pts, bonds: bds };
    }, [structure]);

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <group scale={1.2}>
                {points.map((p, i) => (
                    <Sphere key={i} position={p} args={[0.3, 16, 16]}>
                        <meshStandardMaterial
                            color={element.cpk_hex ? `#${element.cpk_hex}` : '#fff'}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </Sphere>
                ))}
                {bonds.map((b, i) => (
                    <Line key={i} points={b} color="white" lineWidth={1} transparent opacity={0.3} />
                ))}
            </group>
        </Float>
    );
};

export default CrystalModel;
