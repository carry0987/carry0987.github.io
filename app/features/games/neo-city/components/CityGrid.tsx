import React, { useState, useMemo, memo, useCallback } from 'react';
import { Plane, Grid } from '@react-three/drei';
import * as THREE from 'three';
import BuildingsInstanced from './BuildingsInstanced';
import { type TileData, ZoneType } from '../types';
import { GRID_SIZE, TILE_SIZE } from '../constants';

interface CityGridProps {
    cityData: TileData[];
    onTileClick: (x: number, z: number) => void;
    selectedType: ZoneType | null;
    selectedBuilding: { x: number; z: number } | null;
    isMobile?: boolean | null;
}

// Shared geometries and materials - created once
const terrainGrassGeo = new THREE.BoxGeometry(GRID_SIZE, 0.5, GRID_SIZE);
const terrainDirtGeo = new THREE.BoxGeometry(GRID_SIZE, 1.5, GRID_SIZE);
const hoverPlaneGeo = new THREE.PlaneGeometry(0.95, 0.95);
const grassMaterial = new THREE.MeshStandardMaterial({ color: '#38a169' });
const dirtMaterial = new THREE.MeshStandardMaterial({ color: '#4a3728' });
const interactionPlaneMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 });

// Memoized terrain component
const Terrain = memo(() => (
    <group position={[0, -0.25, 0]}>
        <mesh geometry={terrainGrassGeo} material={grassMaterial} />
        <mesh geometry={terrainDirtGeo} material={dirtMaterial} position={[0, -1, 0]} />
    </group>
));
Terrain.displayName = 'Terrain';

// Memoized grid overlay
const GridOverlay = memo(() => (
    <Grid
        infiniteGrid={false}
        args={[GRID_SIZE, GRID_SIZE]}
        fadeDistance={30}
        sectionSize={TILE_SIZE}
        sectionThickness={1.5}
        sectionColor="#2d3748"
        cellSize={TILE_SIZE}
        cellThickness={0.5}
        cellColor="#2d3748"
        position={[0, 0.01, 0]}
    />
));
GridOverlay.displayName = 'GridOverlay';

// Hover indicator component
const HoverIndicator = memo(
    ({ hovered, selectedType }: { hovered: { x: number; z: number } | null; selectedType: ZoneType | null }) => {
        const material = useMemo(
            () =>
                new THREE.MeshStandardMaterial({
                    color: selectedType === ZoneType.EMPTY ? '#f56565' : selectedType === null ? '#3b82f6' : '#ffffff',
                    transparent: true,
                    opacity: 0.3
                }),
            [selectedType]
        );

        if (!hovered) return null;

        return (
            <mesh
                position={[hovered.x - GRID_SIZE / 2 + 0.5, 0.03, hovered.z - GRID_SIZE / 2 + 0.5]}
                rotation={[-Math.PI / 2, 0, 0]}
                geometry={hoverPlaneGeo}
                material={material}
            />
        );
    }
);
HoverIndicator.displayName = 'HoverIndicator';

const CityGrid: React.FC<CityGridProps> = ({ cityData, onTileClick, selectedType, selectedBuilding, isMobile }) => {
    const [hovered, setHovered] = useState<{ x: number; z: number } | null>(null);

    const handlePointerMove = useCallback(
        (e: any) => {
            if (isMobile) return;
            e.stopPropagation();
            const x = Math.floor(e.point.x + GRID_SIZE / 2);
            const z = Math.floor(e.point.z + GRID_SIZE / 2);
            if (x >= 0 && x < GRID_SIZE && z >= 0 && z < GRID_SIZE) {
                setHovered({ x, z });
            } else {
                setHovered(null);
            }
        },
        [isMobile]
    );

    const handlePointerOut = useCallback(() => {
        if (isMobile) return;
        setHovered(null);
    }, [isMobile]);

    const handleClick = useCallback(
        (e: any) => {
            e.stopPropagation();
            const x = Math.floor(e.point.x + GRID_SIZE / 2);
            const z = Math.floor(e.point.z + GRID_SIZE / 2);
            if (x >= 0 && x < GRID_SIZE && z >= 0 && z < GRID_SIZE) {
                onTileClick(x, z);
            }
        },
        [onTileClick]
    );

    return (
        <group>
            {/* 3D Terrain Base - memoized */}
            <Terrain />

            {/* Grid overlay - memoized */}
            <GridOverlay />

            {/* Interaction plane */}
            <Plane
                args={[GRID_SIZE, GRID_SIZE]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.02, 0]}
                onPointerMove={handlePointerMove}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
                material={interactionPlaneMaterial}
                receiveShadow
            />

            {/* Instanced buildings - major performance improvement */}
            <BuildingsInstanced cityData={cityData} selectedBuilding={selectedBuilding} />

            {/* Hover indicator */}
            <HoverIndicator hovered={hovered} selectedType={selectedType} />
        </group>
    );
};

export default memo(CityGrid);
