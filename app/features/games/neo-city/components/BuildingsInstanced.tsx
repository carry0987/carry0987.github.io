import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type TileData, ZoneType } from '../types';
import { GRID_SIZE } from '../constants';

interface BuildingsInstancedProps {
    cityData: TileData[];
    selectedBuilding: { x: number; z: number } | null;
}

// Reusable geometry instances (created once)
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const coneGeo = new THREE.ConeGeometry(1, 1, 4);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 8);
const sphereGeo = new THREE.SphereGeometry(1, 8, 8);

// Temporary objects for matrix calculations
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const hiddenMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

// Pre-created materials for road parts (fixed colors)
const roadMaterials = {
    asphalt: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9 }),
    sidewalk: new THREE.MeshStandardMaterial({ color: '#a0aec0' }),
    curb: new THREE.MeshStandardMaterial({ color: '#2d3748', roughness: 0.7 }),
    yellowLine: new THREE.MeshStandardMaterial({ color: '#fbbf24' }),
    zebra: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 })
};

// Pre-created materials for buildings (white base for instance colors)
const buildingMaterials = {
    box: new THREE.MeshStandardMaterial({ color: '#ffffff' }),
    cone: new THREE.MeshStandardMaterial({ color: '#ffffff' }),
    cylinder: new THREE.MeshStandardMaterial({ color: '#ffffff' }),
    sphere: new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.6 })
};

// Max instances per type
const MAX_ROAD_PARTS = 512;
const MAX_BUILDINGS = 256;
const MAX_DECORATIONS = 512;

const BuildingsInstanced: React.FC<BuildingsInstancedProps> = ({ cityData, selectedBuilding }) => {
    // Road instances
    const roadBaseRef = useRef<THREE.InstancedMesh>(null);
    const sidewalkRef = useRef<THREE.InstancedMesh>(null);
    const roadLinesRef = useRef<THREE.InstancedMesh>(null);
    const zebraRef = useRef<THREE.InstancedMesh>(null);
    const curbRef = useRef<THREE.InstancedMesh>(null);

    // Building instances
    const buildingBoxRef = useRef<THREE.InstancedMesh>(null);
    const buildingConeRef = useRef<THREE.InstancedMesh>(null);
    const buildingCylinderRef = useRef<THREE.InstancedMesh>(null);
    const buildingSphereRef = useRef<THREE.InstancedMesh>(null);

    // Track selected building for animation
    const selectedAnimRef = useRef({ y: 0, targetY: 0 });

    // Helper to check if a neighbor is a road
    const isRoad = useMemo(() => {
        const roadSet = new Set(cityData.filter((t) => t.type === ZoneType.ROAD).map((t) => `${t.x},${t.z}`));
        return (x: number, z: number) => roadSet.has(`${x},${z}`);
    }, [cityData]);

    // Update instances when cityData changes
    useEffect(() => {
        const refs = [
            roadBaseRef,
            sidewalkRef,
            roadLinesRef,
            zebraRef,
            curbRef,
            buildingBoxRef,
            buildingConeRef,
            buildingCylinderRef,
            buildingSphereRef
        ];

        // Initialize instance colors for building meshes (required for setColorAt to work)
        const colorRefs = [buildingBoxRef, buildingConeRef, buildingCylinderRef, buildingSphereRef];
        colorRefs.forEach((ref) => {
            if (ref.current) {
                // Always ensure instanceColor buffer exists
                if (!ref.current.instanceColor) {
                    const colors = new Float32Array(ref.current.count * 3);
                    // Initialize with white color
                    for (let i = 0; i < ref.current.count * 3; i++) {
                        colors[i] = 1;
                    }
                    ref.current.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
                    ref.current.instanceColor.needsUpdate = true;
                }
            }
        });

        // Reset all instances
        refs.forEach((ref) => {
            if (ref.current) {
                for (let i = 0; i < ref.current.count; i++) {
                    ref.current.setMatrixAt(i, hiddenMatrix);
                }
            }
        });

        let roadBaseIdx = 0;
        let sidewalkIdx = 0;
        let roadLinesIdx = 0;
        let zebraIdx = 0;
        let curbIdx = 0;
        let boxIdx = 0;
        let coneIdx = 0;
        let cylinderIdx = 0;
        let sphereIdx = 0;

        const setBox = (
            ref: React.RefObject<THREE.InstancedMesh | null>,
            idx: number,
            pos: [number, number, number],
            scale: [number, number, number],
            color?: string,
            rotation?: [number, number, number]
        ) => {
            if (!ref.current || idx >= ref.current.count) return idx;
            tempObject.position.set(...pos);
            tempObject.scale.set(...scale);
            if (rotation) {
                tempObject.rotation.set(...rotation);
            } else {
                tempObject.rotation.set(0, 0, 0);
            }
            tempObject.updateMatrix();
            ref.current.setMatrixAt(idx, tempObject.matrix);
            if (color) {
                ref.current.setColorAt(idx, tempColor.set(color));
            }
            return idx + 1;
        };

        const setCone = (
            ref: React.RefObject<THREE.InstancedMesh | null>,
            idx: number,
            pos: [number, number, number],
            radius: number,
            height: number,
            color?: string,
            rotation?: [number, number, number]
        ) => {
            if (!ref.current || idx >= ref.current.count) return idx;
            tempObject.position.set(...pos);
            tempObject.scale.set(radius, height, radius);
            if (rotation) {
                tempObject.rotation.set(...rotation);
            } else {
                tempObject.rotation.set(0, 0, 0);
            }
            tempObject.updateMatrix();
            ref.current.setMatrixAt(idx, tempObject.matrix);
            if (color) {
                ref.current.setColorAt(idx, tempColor.set(color));
            }
            return idx + 1;
        };

        const setCylinder = (
            ref: React.RefObject<THREE.InstancedMesh | null>,
            idx: number,
            pos: [number, number, number],
            radius: number,
            height: number,
            color?: string,
            rotation?: [number, number, number]
        ) => {
            if (!ref.current || idx >= ref.current.count) return idx;
            tempObject.position.set(...pos);
            tempObject.scale.set(radius, height, radius);
            if (rotation) {
                tempObject.rotation.set(...rotation);
            } else {
                tempObject.rotation.set(0, 0, 0);
            }
            tempObject.updateMatrix();
            ref.current.setMatrixAt(idx, tempObject.matrix);
            if (color) {
                ref.current.setColorAt(idx, tempColor.set(color));
            }
            return idx + 1;
        };

        cityData.forEach((tile) => {
            if (tile.type === ZoneType.EMPTY) return;

            const baseX = tile.x - GRID_SIZE / 2 + 0.5;
            const baseZ = tile.z - GRID_SIZE / 2 + 0.5;
            const isSelected = selectedBuilding?.x === tile.x && selectedBuilding?.z === tile.z;
            const yOffset = isSelected ? selectedAnimRef.current.y : 0;

            switch (tile.type) {
                case ZoneType.ROAD: {
                    const n = isRoad(tile.x, tile.z - 1);
                    const s = isRoad(tile.x, tile.z + 1);
                    const e = isRoad(tile.x + 1, tile.z);
                    const w = isRoad(tile.x - 1, tile.z);

                    // Road base
                    roadBaseIdx = setBox(roadBaseRef, roadBaseIdx, [baseX, 0.04, baseZ], [1, 0.08, 1], '#1a1a1a');

                    // Sidewalks
                    sidewalkIdx = setBox(
                        sidewalkRef,
                        sidewalkIdx,
                        [baseX - 0.45, 0.08, baseZ],
                        [0.1, 0.022, 1],
                        '#a0aec0'
                    );
                    sidewalkIdx = setBox(
                        sidewalkRef,
                        sidewalkIdx,
                        [baseX + 0.45, 0.08, baseZ],
                        [0.1, 0.022, 1],
                        '#a0aec0'
                    );
                    sidewalkIdx = setBox(
                        sidewalkRef,
                        sidewalkIdx,
                        [baseX, 0.08, baseZ - 0.45],
                        [1, 0.022, 0.1],
                        '#a0aec0'
                    );
                    sidewalkIdx = setBox(
                        sidewalkRef,
                        sidewalkIdx,
                        [baseX, 0.08, baseZ + 0.45],
                        [1, 0.022, 0.1],
                        '#a0aec0'
                    );

                    // Curbs
                    if (!n) curbIdx = setBox(curbRef, curbIdx, [baseX, 0.09, baseZ - 0.48], [1, 0.04, 0.04]);
                    if (!s) curbIdx = setBox(curbRef, curbIdx, [baseX, 0.09, baseZ + 0.48], [1, 0.04, 0.04]);
                    if (!e) curbIdx = setBox(curbRef, curbIdx, [baseX + 0.48, 0.09, baseZ], [0.04, 0.04, 1]);
                    if (!w) curbIdx = setBox(curbRef, curbIdx, [baseX - 0.48, 0.09, baseZ], [0.04, 0.04, 1]);

                    // Lane markings (simplified)
                    const connectionCount = [n, s, e, w].filter(Boolean).length;
                    if (connectionCount > 0) {
                        if (n)
                            roadLinesIdx = setBox(
                                roadLinesRef,
                                roadLinesIdx,
                                [baseX - 0.01, 0.081, baseZ - 0.25],
                                [0.04, 0.005, 0.4],
                                '#fbbf24'
                            );
                        if (s)
                            roadLinesIdx = setBox(
                                roadLinesRef,
                                roadLinesIdx,
                                [baseX - 0.01, 0.081, baseZ + 0.25],
                                [0.04, 0.005, 0.4],
                                '#fbbf24'
                            );
                        if (w)
                            roadLinesIdx = setBox(
                                roadLinesRef,
                                roadLinesIdx,
                                [baseX - 0.25, 0.081, baseZ],
                                [0.4, 0.005, 0.04],
                                '#fbbf24'
                            );
                        if (e)
                            roadLinesIdx = setBox(
                                roadLinesRef,
                                roadLinesIdx,
                                [baseX + 0.25, 0.081, baseZ],
                                [0.4, 0.005, 0.04],
                                '#fbbf24'
                            );
                    }
                    break;
                }

                case ZoneType.RESIDENTIAL: {
                    const variant = tile.level;
                    const color = isSelected ? '#60d67a' : '#48bb78';

                    if (variant === 1) {
                        // Modern two-story
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX - 0.15, 0.35 + yOffset, baseZ],
                            [0.4, 0.7, 0.6],
                            color
                        );
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX + 0.15, 0.2 + yOffset, baseZ],
                            [0.4, 0.4, 0.6],
                            '#c6f6d5'
                        );
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX, 0.7 + yOffset, baseZ],
                            [0.8, 0.05, 0.7],
                            '#2d3748'
                        );
                    } else if (variant === 2) {
                        // Bungalow
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX, 0.175 + yOffset, baseZ],
                            [0.8, 0.35, 0.4],
                            color
                        );
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX, 0.35 + yOffset, baseZ],
                            [0.9, 0.1, 0.5],
                            '#22543d',
                            [0.05, 0, 0]
                        );
                    } else {
                        // Default house
                        boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.25 + yOffset, baseZ], [0.6, 0.5, 0.6], color);
                        coneIdx = setCone(
                            buildingConeRef,
                            coneIdx,
                            [baseX, 0.7 + yOffset, baseZ],
                            0.5,
                            0.4,
                            '#276749',
                            [0, Math.PI / 4, 0]
                        );
                    }
                    break;
                }

                case ZoneType.COMMERCIAL: {
                    const variant = tile.level;
                    const color = isSelected ? '#5cb3f0' : '#4299e1';

                    if (variant === 1) {
                        // Glass building
                        boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.6 + yOffset, baseZ], [0.6, 1.2, 0.6], color);
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX, 1.2 + yOffset, baseZ],
                            [0.65, 0.05, 0.65],
                            '#2b6cb0'
                        );
                    } else if (variant === 2) {
                        // Mall
                        boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.2 + yOffset, baseZ], [0.8, 0.4, 0.8], color);
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX + 0.2, 0.45 + yOffset, baseZ + 0.35],
                            [0.2, 0.5, 0.1],
                            '#f6e05e'
                        );
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX, 0.4 + yOffset, baseZ],
                            [0.9, 0.05, 0.9],
                            '#2c5282'
                        );
                    } else {
                        // Default commercial
                        boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.4 + yOffset, baseZ], [0.7, 0.8, 0.7], color);
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX, 0.85 + yOffset, baseZ],
                            [0.75, 0.1, 0.75],
                            '#2b6cb0'
                        );
                    }
                    break;
                }

                case ZoneType.INDUSTRIAL: {
                    const variant = tile.level;
                    const color = isSelected ? '#f5d654' : '#ecc94b';

                    if (variant === 1) {
                        // Oil tanks
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX - 0.2, 0.25 + yOffset, baseZ - 0.2],
                            0.2,
                            0.5,
                            '#cbd5e0'
                        );
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX + 0.2, 0.25 + yOffset, baseZ + 0.2],
                            0.2,
                            0.5,
                            '#cbd5e0'
                        );
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX, 0.05 + yOffset, baseZ],
                            [0.8, 0.1, 0.8],
                            '#4a5568'
                        );
                    } else if (variant === 2) {
                        // Factory with chimneys
                        boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.2 + yOffset, baseZ], [0.7, 0.4, 0.7], color);
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX + 0.2, 0.4 + yOffset, baseZ + 0.2],
                            0.05,
                            0.8,
                            '#744210'
                        );
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX - 0.2, 0.4 + yOffset, baseZ + 0.2],
                            0.05,
                            0.8,
                            '#744210'
                        );
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX, 0.4 + yOffset, baseZ - 0.2],
                            0.05,
                            0.8,
                            '#744210'
                        );
                    } else {
                        // Default factory
                        boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.3 + yOffset, baseZ], [0.8, 0.6, 0.8], color);
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX + 0.2, 0.6 + yOffset, baseZ + 0.2],
                            0.1,
                            1,
                            '#744210'
                        );
                    }
                    break;
                }

                case ZoneType.PARK: {
                    const variant = tile.level;
                    const color = isSelected ? '#4cc9bd' : '#38b2ac';

                    boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.05 + yOffset, baseZ], [0.9, 0.1, 0.9], color);

                    if (variant === 1) {
                        // Fountain
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX, 0.1 + yOffset, baseZ],
                            0.3,
                            0.05,
                            '#63b3ed'
                        );
                        sphereIdx = setBox(
                            buildingSphereRef,
                            sphereIdx,
                            [baseX, 0.2 + yOffset, baseZ],
                            [0.1, 0.1, 0.1],
                            '#ebf8ff'
                        );
                    } else if (variant === 2) {
                        // Playground
                        boxIdx = setBox(
                            buildingBoxRef,
                            boxIdx,
                            [baseX - 0.2, 0.2 + yOffset, baseZ + 0.2],
                            [0.2, 0.2, 0.2],
                            '#f56565'
                        );
                        cylinderIdx = setCylinder(
                            buildingCylinderRef,
                            cylinderIdx,
                            [baseX + 0.2, 0.2 + yOffset, baseZ - 0.2],
                            0.15,
                            0.4,
                            '#4299e1',
                            [0, 0, 0.5]
                        );
                    } else {
                        // Trees
                        coneIdx = setCone(buildingConeRef, coneIdx, [baseX, 0.4 + yOffset, baseZ], 0.2, 0.5, '#234e52');
                        coneIdx = setCone(
                            buildingConeRef,
                            coneIdx,
                            [baseX + 0.25, 0.25 + yOffset, baseZ + 0.2],
                            0.15,
                            0.3,
                            '#2d6a4f'
                        );
                    }
                    break;
                }

                case ZoneType.BUS_STOP: {
                    const color = isSelected ? '#8999a8' : '#718096';

                    boxIdx = setBox(buildingBoxRef, boxIdx, [baseX, 0.025 + yOffset, baseZ], [0.8, 0.05, 0.8], color);
                    boxIdx = setBox(
                        buildingBoxRef,
                        boxIdx,
                        [baseX, 0.25 + yOffset, baseZ - 0.3],
                        [0.6, 0.5, 0.05],
                        '#4a5568'
                    );
                    boxIdx = setBox(
                        buildingBoxRef,
                        boxIdx,
                        [baseX, 0.5 + yOffset, baseZ - 0.15],
                        [0.7, 0.05, 0.4],
                        '#2d3748',
                        [0.1, 0, 0]
                    );
                    boxIdx = setBox(
                        buildingBoxRef,
                        boxIdx,
                        [baseX, 0.1 + yOffset, baseZ - 0.15],
                        [0.4, 0.1, 0.15],
                        '#744210'
                    );
                    cylinderIdx = setCylinder(
                        buildingCylinderRef,
                        cylinderIdx,
                        [baseX + 0.3, 0.3 + yOffset, baseZ + 0.2],
                        0.02,
                        0.6,
                        '#a0aec0'
                    );
                    boxIdx = setBox(
                        buildingBoxRef,
                        boxIdx,
                        [baseX + 0.3, 0.55 + yOffset, baseZ + 0.2],
                        [0.15, 0.1, 0.02],
                        '#f6ad55'
                    );
                    break;
                }
            }
        });

        // Update instance matrices
        [
            roadBaseRef,
            sidewalkRef,
            roadLinesRef,
            zebraRef,
            curbRef,
            buildingBoxRef,
            buildingConeRef,
            buildingCylinderRef,
            buildingSphereRef
        ].forEach((ref) => {
            if (ref.current) {
                ref.current.instanceMatrix.needsUpdate = true;
                if (ref.current.instanceColor) {
                    ref.current.instanceColor.needsUpdate = true;
                }
            }
        });
    }, [cityData, selectedBuilding, isRoad]);

    // Animate selected building
    useFrame((state) => {
        if (selectedBuilding) {
            selectedAnimRef.current.targetY = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 0.1;
        } else {
            selectedAnimRef.current.targetY = 0;
        }
        selectedAnimRef.current.y = THREE.MathUtils.lerp(
            selectedAnimRef.current.y,
            selectedAnimRef.current.targetY,
            0.1
        );
    });

    return (
        <group>
            {/* Road parts - using pre-created materials */}
            <instancedMesh ref={roadBaseRef} args={[boxGeo, roadMaterials.asphalt, MAX_ROAD_PARTS]} receiveShadow />
            <instancedMesh
                ref={sidewalkRef}
                args={[boxGeo, roadMaterials.sidewalk, MAX_ROAD_PARTS * 4]}
                receiveShadow
            />
            <instancedMesh ref={roadLinesRef} args={[boxGeo, roadMaterials.yellowLine, MAX_ROAD_PARTS * 4]} />
            <instancedMesh ref={zebraRef} args={[boxGeo, roadMaterials.zebra, MAX_ROAD_PARTS * 20]} />
            <instancedMesh ref={curbRef} args={[boxGeo, roadMaterials.curb, MAX_ROAD_PARTS * 4]} />

            {/* Building parts - using instance colors with white base material */}
            <instancedMesh
                ref={buildingBoxRef}
                args={[boxGeo, buildingMaterials.box, MAX_BUILDINGS * 6]}
                castShadow
                receiveShadow
            />
            <instancedMesh ref={buildingConeRef} args={[coneGeo, buildingMaterials.cone, MAX_DECORATIONS]} castShadow />
            <instancedMesh
                ref={buildingCylinderRef}
                args={[cylinderGeo, buildingMaterials.cylinder, MAX_DECORATIONS]}
                castShadow
            />
            <instancedMesh ref={buildingSphereRef} args={[sphereGeo, buildingMaterials.sphere, MAX_DECORATIONS]} />
        </group>
    );
};

export default BuildingsInstanced;
