import React, { useState } from 'react';
import { Plane, Grid, Box } from '@react-three/drei';
import Building from './Building';
import { type TileData, ZoneType } from '../types';
import { GRID_SIZE, TILE_SIZE } from '../constants';

interface CityGridProps {
    cityData: TileData[];
    onTileClick: (x: number, z: number) => void;
    selectedType: ZoneType;
    selectedBuilding: { x: number; z: number } | null;
}

const CityGrid: React.FC<CityGridProps> = ({ cityData, onTileClick, selectedType, selectedBuilding }) => {
    const [hovered, setHovered] = useState<{ x: number; z: number } | null>(null);

    const handlePointerMove = (e: any) => {
        e.stopPropagation();
        const x = Math.floor(e.point.x + GRID_SIZE / 2);
        const z = Math.floor(e.point.z + GRID_SIZE / 2);
        if (x >= 0 && x < GRID_SIZE && z >= 0 && z < GRID_SIZE) {
            setHovered({ x, z });
        } else {
            setHovered(null);
        }
    };

    const handleClick = (e: any) => {
        e.stopPropagation();
        if (hovered) {
            onTileClick(hovered.x, hovered.z);
        }
    };

    // Helper to check if a neighbor is a road
    const isRoad = (x: number, z: number) => {
        return cityData.some((t) => t.x === x && t.z === z && t.type === ZoneType.ROAD);
    };

    return (
        <group>
            {/* 3D Terrain Base */}
            <group position={[0, -0.25, 0]}>
                {/* Grass Top */}
                <Box args={[GRID_SIZE, 0.5, GRID_SIZE]}>
                    <meshStandardMaterial color="#38a169" />
                </Box>
                {/* Dirt Base */}
                <Box args={[GRID_SIZE, 1.5, GRID_SIZE]} position={[0, -1, 0]}>
                    <meshStandardMaterial color="#4a3728" />
                </Box>
            </group>

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

            <Plane
                args={[GRID_SIZE, GRID_SIZE]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.02, 0]}
                onPointerMove={handlePointerMove}
                onPointerOut={() => setHovered(null)}
                onClick={handleClick}
                receiveShadow>
                <meshStandardMaterial transparent opacity={0} />
            </Plane>

            {cityData.map((tile) => {
                if (tile.type === ZoneType.EMPTY) return null;

                // Calculate connections for roads
                const connections =
                    tile.type === ZoneType.ROAD
                        ? {
                              n: isRoad(tile.x, tile.z - 1),
                              s: isRoad(tile.x, tile.z + 1),
                              e: isRoad(tile.x + 1, tile.z),
                              w: isRoad(tile.x - 1, tile.z)
                          }
                        : undefined;

                return (
                    <Building
                        key={`${tile.x}-${tile.z}`}
                        type={tile.type}
                        variant={tile.level} // Use level as variant index
                        isSelected={selectedBuilding?.x === tile.x && selectedBuilding?.z === tile.z}
                        position={[tile.x - GRID_SIZE / 2 + 0.5, 0, tile.z - GRID_SIZE / 2 + 0.5]}
                        connections={connections}
                    />
                );
            })}

            {hovered && (
                <mesh
                    position={[hovered.x - GRID_SIZE / 2 + 0.5, 0.03, hovered.z - GRID_SIZE / 2 + 0.5]}
                    rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.95, 0.95]} />
                    <meshStandardMaterial
                        color={selectedType === ZoneType.EMPTY ? '#f56565' : '#ffffff'}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            )}
        </group>
    );
};

export default CityGrid;
