import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type TileData, ZoneType } from '../types';
import { GRID_SIZE } from '../constants';

const LANE_OFFSETS = [0.14, 0.32];
const SIDEWALK_OFFSET = 0.42; // 微調人行道偏移量以完美對齊新斑馬線
const SAFE_FOLLOW_DISTANCE = 0.85;
const DETECTION_RADIUS = 1.6;
const MAX_CARS = 24;
const MAX_PEOPLE = 40;
const MAX_BUSES = 6;
const STUCK_THRESHOLD = 3.0;
const LANE_CHANGE_COOLDOWN = 2.0;
const BUS_STOP_WAIT_TIME = 2.5;

const TEMP_OBJ = new THREE.Object3D();
const SUB_OBJ = new THREE.Object3D();
const TEMP_COLOR = new THREE.Color();
const HIDDEN_MATRIX = new THREE.Matrix4().makeScale(0, 0, 0);

interface AgentData {
    id: number;
    type: 'car' | 'person' | 'bus';
    prevPos: THREE.Vector3;
    currentPos: THREE.Vector3;
    targetPos: THREE.Vector3;
    actualWorldPos: THREE.Vector3;
    progress: number;
    baseSpeed: number;
    currentSpeed: number;
    color: string;
    headColor?: string;
    scale?: number;
    waitTimer: number;
    lastDirection: THREE.Vector3;
    targetRotation: THREE.Quaternion;
    currentRotation: THREE.Quaternion;
    laneIndex: number;
    visualLaneOffset: number;
    laneChangeTimer: number;
    preferredSide: number;
    isStoppedAtStation: boolean;
}

const CAR_COLORS = ['#f56565', '#4299e1', '#f6e05e', '#ffffff', '#2d3748', '#38b2ac', '#9f7aea'];
const BUS_COLORS = ['#f6ad55', '#4fd1c5', '#6366f1'];
const SKIN_COLORS = ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac'];
const CLOTHING_COLORS = [
    '#2563eb',
    '#dc2626',
    '#16a34a',
    '#d97706',
    '#7c3aed',
    '#db2777',
    '#4b5563',
    '#1e293b',
    '#f97316',
    '#06b6d4',
    '#84cc16',
    '#6366f1'
];

const CityLife: React.FC<{ cityData: TileData[] }> = ({ cityData }) => {
    const carBodyRef = useRef<THREE.InstancedMesh>(null);
    const carCabinRef = useRef<THREE.InstancedMesh>(null);
    const carWindowRef = useRef<THREE.InstancedMesh>(null);
    const carHeadlightRef = useRef<THREE.InstancedMesh>(null);
    const carTaillightRef = useRef<THREE.InstancedMesh>(null);

    const busBodyRef = useRef<THREE.InstancedMesh>(null);
    const busWindowRef = useRef<THREE.InstancedMesh>(null);

    const peopleBodyRef = useRef<THREE.InstancedMesh>(null);
    const peopleHeadRef = useRef<THREE.InstancedMesh>(null);

    const agentsRef = useRef<AgentData[]>([]);

    useEffect(() => {
        const roadTiles = cityData.filter((t) => t.type === ZoneType.ROAD);
        const busStopTiles = cityData.filter((t) => t.type === ZoneType.BUS_STOP);
        const activeTiles = cityData.filter((t) => t.type !== ZoneType.EMPTY && t.type !== ZoneType.ROAD);

        const existingCars = agentsRef.current.filter((a) => a.type === 'car');
        const existingPeople = agentsRef.current.filter((a) => a.type === 'person');
        const existingBuses = agentsRef.current.filter((a) => a.type === 'bus');

        let updatedAgents = [...agentsRef.current];

        updatedAgents = updatedAgents.filter((agent) => {
            const gridX = Math.floor(agent.targetPos.x + GRID_SIZE / 2);
            const gridZ = Math.floor(agent.targetPos.z + GRID_SIZE / 2);
            const tile = cityData.find((t) => t.x === gridX && t.z === gridZ);

            if (agent.type === 'car' || agent.type === 'bus') {
                return tile && tile.type === ZoneType.ROAD;
            } else {
                return tile && tile.type !== ZoneType.EMPTY;
            }
        });

        const carDeficit = Math.min(MAX_CARS, roadTiles.length) - existingCars.length;
        if (carDeficit > 0) {
            for (let i = 0; i < carDeficit; i++) {
                const t = roadTiles[Math.floor(Math.random() * roadTiles.length)];
                const pos = new THREE.Vector3(t.x - GRID_SIZE / 2 + 0.5, 0.08, t.z - GRID_SIZE / 2 + 0.5);
                const laneIdx = Math.floor(Math.random() * LANE_OFFSETS.length);
                updatedAgents.push({
                    id: Math.random(),
                    type: 'car',
                    prevPos: pos.clone(),
                    currentPos: pos.clone(),
                    targetPos: pos.clone(),
                    actualWorldPos: pos.clone(),
                    progress: 1,
                    baseSpeed: 0.5 + Math.random() * 0.4,
                    currentSpeed: 0.5,
                    color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
                    waitTimer: 0,
                    lastDirection: new THREE.Vector3(0, 0, 1),
                    targetRotation: new THREE.Quaternion(),
                    currentRotation: new THREE.Quaternion(),
                    laneIndex: laneIdx,
                    visualLaneOffset: LANE_OFFSETS[laneIdx],
                    laneChangeTimer: 0,
                    preferredSide: 0,
                    isStoppedAtStation: false
                });
            }
        }

        const busDeficit = Math.min(MAX_BUSES, busStopTiles.length * 2) - existingBuses.length;
        if (busDeficit > 0 && roadTiles.length > 0) {
            for (let i = 0; i < busDeficit; i++) {
                const t = roadTiles[Math.floor(Math.random() * roadTiles.length)];
                const pos = new THREE.Vector3(t.x - GRID_SIZE / 2 + 0.5, 0.12, t.z - GRID_SIZE / 2 + 0.5);
                updatedAgents.push({
                    id: Math.random(),
                    type: 'bus',
                    prevPos: pos.clone(),
                    currentPos: pos.clone(),
                    targetPos: pos.clone(),
                    actualWorldPos: pos.clone(),
                    progress: 1,
                    baseSpeed: 0.35,
                    currentSpeed: 0.35,
                    color: BUS_COLORS[Math.floor(Math.random() * BUS_COLORS.length)],
                    waitTimer: 0,
                    lastDirection: new THREE.Vector3(0, 0, 1),
                    targetRotation: new THREE.Quaternion(),
                    currentRotation: new THREE.Quaternion(),
                    laneIndex: 1,
                    visualLaneOffset: LANE_OFFSETS[1],
                    laneChangeTimer: 0,
                    preferredSide: 0,
                    isStoppedAtStation: false
                });
            }
        }

        const personDeficit = Math.min(MAX_PEOPLE, activeTiles.length) - existingPeople.length;
        if (personDeficit > 0) {
            for (let i = 0; i < personDeficit; i++) {
                const t = activeTiles[Math.floor(Math.random() * activeTiles.length)];
                const pos = new THREE.Vector3(t.x - GRID_SIZE / 2 + 0.5, 0.05, t.z - GRID_SIZE / 2 + 0.5);
                updatedAgents.push({
                    id: Math.random(),
                    type: 'person',
                    prevPos: pos.clone(),
                    currentPos: pos.clone(),
                    targetPos: pos.clone(),
                    actualWorldPos: pos.clone(),
                    progress: 1,
                    baseSpeed: 0.12 + Math.random() * 0.1,
                    currentSpeed: 0.12,
                    color: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)],
                    headColor: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
                    scale: 0.85 + Math.random() * 0.3,
                    waitTimer: 0,
                    lastDirection: new THREE.Vector3(0, 0, 1),
                    targetRotation: new THREE.Quaternion(),
                    currentRotation: new THREE.Quaternion(),
                    laneIndex: 0,
                    visualLaneOffset: 0,
                    laneChangeTimer: 0,
                    preferredSide: Math.random() > 0.5 ? 1 : -1,
                    isStoppedAtStation: false
                });
            }
        }

        agentsRef.current = updatedAgents;

        if (carBodyRef.current) {
            const cars = updatedAgents.filter((a) => a.type === 'car');
            for (let i = 0; i < MAX_CARS; i++) {
                if (i < cars.length) {
                    carBodyRef.current.setColorAt(i, TEMP_COLOR.set(cars[i].color));
                    carCabinRef.current?.setColorAt(i, TEMP_COLOR.set(cars[i].color));
                }
            }
            if (carBodyRef.current.instanceColor) carBodyRef.current.instanceColor.needsUpdate = true;
            if (carCabinRef.current?.instanceColor) carCabinRef.current.instanceColor.needsUpdate = true;
        }

        if (busBodyRef.current) {
            const buses = updatedAgents.filter((a) => a.type === 'bus');
            for (let i = 0; i < MAX_BUSES; i++) {
                if (i < buses.length) busBodyRef.current.setColorAt(i, TEMP_COLOR.set(buses[i].color));
            }
            if (busBodyRef.current.instanceColor) busBodyRef.current.instanceColor.needsUpdate = true;
        }

        if (peopleBodyRef.current) {
            const people = updatedAgents.filter((a) => a.type === 'person');
            for (let i = 0; i < MAX_PEOPLE; i++) {
                if (i < people.length) {
                    peopleBodyRef.current.setColorAt(i, TEMP_COLOR.set(people[i].color));
                    peopleHeadRef.current?.setColorAt(i, TEMP_COLOR.set(people[i].headColor!));
                }
            }
            if (peopleBodyRef.current.instanceColor) peopleBodyRef.current.instanceColor.needsUpdate = true;
            if (peopleHeadRef.current?.instanceColor) peopleHeadRef.current.instanceColor.needsUpdate = true;
        }
    }, [cityData]);

    const getNextTile = (
        currX: number,
        currZ: number,
        fromX: number,
        fromZ: number,
        type: 'car' | 'person' | 'bus'
    ) => {
        const neighbors = [
            { x: currX + 1, z: currZ },
            { x: currX - 1, z: currZ },
            { x: currX, z: currZ + 1 },
            { x: currX, z: currZ - 1 }
        ];
        const scored = neighbors
            .map((n) => {
                const tile = cityData.find((t) => t.x === n.x && t.z === n.z);
                if (!tile) return { ...n, score: -Infinity };
                if ((type === 'car' || type === 'bus') && tile.type !== ZoneType.ROAD)
                    return { ...n, score: -Infinity };
                if (type === 'person' && tile.type === ZoneType.EMPTY) return { ...n, score: -Infinity };
                let score = 100;
                if (n.x === fromX && n.z === fromZ) score -= 195;
                score += Math.random() * 20;
                return { ...n, score };
            })
            .filter((n) => n.score !== -Infinity);

        if (scored.length > 0) {
            scored.sort((a, b) => b.score - a.score);
            return scored[0];
        }
        return null;
    };

    useFrame((state, delta) => {
        [
            carBodyRef,
            carCabinRef,
            carWindowRef,
            carHeadlightRef,
            carTaillightRef,
            busBodyRef,
            busWindowRef,
            peopleBodyRef,
            peopleHeadRef
        ].forEach((ref) => {
            if (ref.current) {
                for (let i = 0; i < (ref.current.count || 0); i++) ref.current.setMatrixAt(i, HIDDEN_MATRIX);
            }
        });

        let carIdx = 0;
        let busIdx = 0;
        let personIdx = 0;

        agentsRef.current.forEach((agent) => {
            const isCar = agent.type === 'car';
            const isBus = agent.type === 'bus';
            const isPed = agent.type === 'person';

            if ((isCar || isBus) && agent.currentSpeed < 0.05) {
                agent.waitTimer += delta;
                if (agent.waitTimer > STUCK_THRESHOLD) {
                    const temp = agent.currentPos.clone();
                    agent.currentPos.copy(agent.targetPos);
                    agent.targetPos.copy(temp);
                    agent.progress = 1 - agent.progress;
                    agent.waitTimer = 0;
                }
            } else {
                agent.waitTimer = 0;
            }

            if (agent.progress >= 1) {
                const gridX = Math.floor(agent.targetPos.x + GRID_SIZE / 2);
                const gridZ = Math.floor(agent.targetPos.z + GRID_SIZE / 2);

                if (isBus && !agent.isStoppedAtStation) {
                    const hasNearbyStation = [
                        { x: gridX + 1, z: gridZ },
                        { x: gridX - 1, z: gridZ },
                        { x: gridX, z: gridZ + 1 },
                        { x: gridX, z: gridZ - 1 }
                    ].some((n) => cityData.find((t) => t.x === n.x && t.z === n.z)?.type === ZoneType.BUS_STOP);

                    if (hasNearbyStation) {
                        agent.isStoppedAtStation = true;
                        agent.waitTimer = BUS_STOP_WAIT_TIME;
                    }
                }

                if (isBus && agent.isStoppedAtStation) {
                    agent.waitTimer -= delta;
                    if (agent.waitTimer <= 0) {
                        agent.isStoppedAtStation = false;
                    } else {
                        return;
                    }
                }

                const prevGridX = Math.floor(agent.prevPos.x + GRID_SIZE / 2);
                const prevGridZ = Math.floor(agent.prevPos.z + GRID_SIZE / 2);
                const next = getNextTile(gridX, gridZ, prevGridX, prevGridZ, agent.type);

                if (next) {
                    agent.prevPos.copy(agent.currentPos);
                    agent.currentPos.copy(agent.targetPos);
                    const nextTile = cityData.find((t) => t.x === next.x && t.z === next.z);
                    const nextBase = new THREE.Vector3(
                        next.x - GRID_SIZE / 2 + 0.5,
                        isBus ? 0.12 : isCar ? 0.08 : 0.05,
                        next.z - GRID_SIZE / 2 + 0.5
                    );

                    if (isCar || isBus) {
                        const dir = new THREE.Vector3().subVectors(nextBase, agent.currentPos).normalize();
                        const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(LANE_OFFSETS[agent.laneIndex]);
                        agent.targetPos.copy(nextBase.add(side));
                    } else {
                        if (nextTile?.type === ZoneType.ROAD) {
                            const dir = new THREE.Vector3().subVectors(nextBase, agent.currentPos).normalize();
                            const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(
                                SIDEWALK_OFFSET * agent.preferredSide
                            );
                            agent.targetPos.copy(nextBase.add(side));
                        } else {
                            const jitter = new THREE.Vector3(
                                (Math.random() - 0.5) * 0.45,
                                0,
                                (Math.random() - 0.5) * 0.45
                            );
                            agent.targetPos.copy(nextBase.add(jitter));
                        }
                    }
                    agent.progress = 0;
                } else if (isCar || isBus) {
                    const temp = agent.currentPos.clone();
                    agent.currentPos.copy(agent.targetPos);
                    agent.targetPos.copy(temp);
                    agent.progress = 0;
                }
            }

            let targetSpeed = agent.baseSpeed;
            if (isCar || isBus) {
                agent.laneChangeTimer = Math.max(0, agent.laneChangeTimer - delta);
                const myDir = new THREE.Vector3().subVectors(agent.targetPos, agent.currentPos).normalize();
                let needsLaneSwitch = false;

                for (const other of agentsRef.current) {
                    if ((other.type === 'car' || other.type === 'bus') && other.id !== agent.id) {
                        const dist = agent.actualWorldPos.distanceTo(other.actualWorldPos);
                        if (dist < DETECTION_RADIUS) {
                            const toOther = new THREE.Vector3()
                                .subVectors(other.actualWorldPos, agent.actualWorldPos)
                                .normalize();
                            if (myDir.dot(toOther) > 0.6) {
                                if (agent.laneIndex === other.laneIndex) {
                                    targetSpeed =
                                        dist < (isBus ? 1.2 : SAFE_FOLLOW_DISTANCE) ? 0 : agent.baseSpeed * 0.4;
                                    if (
                                        isCar &&
                                        dist < DETECTION_RADIUS * 0.8 &&
                                        other.currentSpeed < agent.baseSpeed * 0.6
                                    )
                                        needsLaneSwitch = true;
                                }
                            }
                        }
                    }
                }

                if (isCar && needsLaneSwitch && agent.laneChangeTimer <= 0) {
                    const nextLaneIdx = (agent.laneIndex + 1) % LANE_OFFSETS.length;
                    let isTargetLaneClear = true;
                    for (const other of agentsRef.current) {
                        if (
                            (other.type === 'car' || other.type === 'bus') &&
                            other.id !== agent.id &&
                            other.laneIndex === nextLaneIdx
                        ) {
                            if (agent.actualWorldPos.distanceTo(other.actualWorldPos) < DETECTION_RADIUS) {
                                isTargetLaneClear = false;
                                break;
                            }
                        }
                    }
                    if (isTargetLaneClear) {
                        agent.laneIndex = nextLaneIdx;
                        agent.laneChangeTimer = LANE_CHANGE_COOLDOWN;
                        const dir = new THREE.Vector3().subVectors(agent.targetPos, agent.currentPos).normalize();
                        const centerBase = agent.targetPos
                            .clone()
                            .sub(new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(LANE_OFFSETS[1 - nextLaneIdx]));
                        agent.targetPos.copy(
                            centerBase.add(
                                new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(LANE_OFFSETS[nextLaneIdx])
                            )
                        );
                    }
                }
                agent.visualLaneOffset = THREE.MathUtils.lerp(
                    agent.visualLaneOffset,
                    LANE_OFFSETS[agent.laneIndex],
                    0.05
                );
            } else {
                for (const other of agentsRef.current) {
                    if (other.type === 'person' && other.id !== agent.id) {
                        const dist = agent.actualWorldPos.distanceTo(other.actualWorldPos);
                        if (dist < 0.2) targetSpeed *= 0.5;
                    }
                }
            }

            agent.currentSpeed = THREE.MathUtils.lerp(agent.currentSpeed, targetSpeed, 0.1);
            agent.progress = Math.min(1, agent.progress + delta * agent.currentSpeed);

            const lerpedBase = new THREE.Vector3().lerpVectors(agent.currentPos, agent.targetPos, agent.progress);
            if (isCar || isBus) {
                const dir = new THREE.Vector3().subVectors(agent.targetPos, agent.currentPos).normalize();
                const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(
                    agent.visualLaneOffset - LANE_OFFSETS[agent.laneIndex]
                );
                agent.actualWorldPos.copy(lerpedBase.add(side));
            } else {
                agent.actualWorldPos.copy(lerpedBase);
            }

            TEMP_OBJ.position.copy(agent.actualWorldPos);
            const direction = new THREE.Vector3().subVectors(agent.targetPos, agent.currentPos).normalize();
            if (direction.lengthSq() > 0.001) {
                TEMP_OBJ.lookAt(agent.actualWorldPos.clone().add(direction));
                agent.targetRotation.copy(TEMP_OBJ.quaternion);
                agent.lastDirection.copy(direction);
            }
            agent.currentRotation.slerp(agent.targetRotation, isPed ? 0.3 : 0.12);
            TEMP_OBJ.quaternion.copy(agent.currentRotation);

            if (isCar && carIdx < MAX_CARS) {
                TEMP_OBJ.updateMatrix();
                carBodyRef.current?.setMatrixAt(carIdx, TEMP_OBJ.matrix);

                SUB_OBJ.copy(TEMP_OBJ);
                SUB_OBJ.position.y += 0.07;
                SUB_OBJ.position.add(agent.lastDirection.clone().multiplyScalar(-0.04));
                SUB_OBJ.scale.set(0.8, 0.7, 0.5);
                SUB_OBJ.updateMatrix();
                carCabinRef.current?.setMatrixAt(carIdx, SUB_OBJ.matrix);

                SUB_OBJ.scale.set(0.85, 0.75, 0.55);
                SUB_OBJ.updateMatrix();
                carWindowRef.current?.setMatrixAt(carIdx, SUB_OBJ.matrix);

                const sideVec = new THREE.Vector3(-agent.lastDirection.z, 0, agent.lastDirection.x).normalize();
                SUB_OBJ.copy(TEMP_OBJ);
                SUB_OBJ.position
                    .add(agent.lastDirection.clone().multiplyScalar(0.201))
                    .add(sideVec.clone().multiplyScalar(0.06));
                SUB_OBJ.scale.set(1, 1, 1);
                SUB_OBJ.updateMatrix();
                carHeadlightRef.current?.setMatrixAt(carIdx * 2, SUB_OBJ.matrix);
                SUB_OBJ.position.add(sideVec.clone().multiplyScalar(-0.12));
                SUB_OBJ.updateMatrix();
                carHeadlightRef.current?.setMatrixAt(carIdx * 2 + 1, SUB_OBJ.matrix);

                SUB_OBJ.copy(TEMP_OBJ);
                SUB_OBJ.position
                    .add(agent.lastDirection.clone().multiplyScalar(-0.201))
                    .add(sideVec.clone().multiplyScalar(0.06));
                SUB_OBJ.updateMatrix();
                carTaillightRef.current?.setMatrixAt(carIdx * 2, SUB_OBJ.matrix);
                SUB_OBJ.position.add(sideVec.clone().multiplyScalar(-0.12));
                SUB_OBJ.updateMatrix();
                carTaillightRef.current?.setMatrixAt(carIdx * 2 + 1, SUB_OBJ.matrix);
                carIdx++;
            } else if (isBus && busIdx < MAX_BUSES) {
                TEMP_OBJ.updateMatrix();
                busBodyRef.current?.setMatrixAt(busIdx, TEMP_OBJ.matrix);

                SUB_OBJ.copy(TEMP_OBJ);
                SUB_OBJ.position.y += 0.08;
                SUB_OBJ.scale.set(0.9, 0.6, 0.85);
                SUB_OBJ.updateMatrix();
                busWindowRef.current?.setMatrixAt(busIdx, SUB_OBJ.matrix);
                busIdx++;
            } else if (isPed && personIdx < MAX_PEOPLE) {
                const hop = Math.abs(Math.sin(state.clock.elapsedTime * 10 + agent.id)) * 0.03;
                const s = agent.scale || 1.0;
                TEMP_OBJ.scale.set(s, s, s);
                TEMP_OBJ.position.y = agent.actualWorldPos.y + hop + 0.05 * s;
                TEMP_OBJ.updateMatrix();
                peopleBodyRef.current?.setMatrixAt(personIdx, TEMP_OBJ.matrix);
                SUB_OBJ.copy(TEMP_OBJ);
                SUB_OBJ.position.y += 0.09 * s;
                SUB_OBJ.scale.set(s * 0.8, s * 0.8, s * 0.8);
                SUB_OBJ.updateMatrix();
                peopleHeadRef.current?.setMatrixAt(personIdx, SUB_OBJ.matrix);
                personIdx++;
            }
        });

        [
            carBodyRef,
            carCabinRef,
            carWindowRef,
            carHeadlightRef,
            carTaillightRef,
            busBodyRef,
            busWindowRef,
            peopleBodyRef,
            peopleHeadRef
        ].forEach((ref) => {
            if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
        });
    });

    return (
        <group>
            <instancedMesh ref={carBodyRef} args={[undefined, undefined, MAX_CARS]} castShadow>
                <boxGeometry args={[0.2, 0.1, 0.4]} />
                <meshStandardMaterial roughness={0.3} metalness={0.7} />
            </instancedMesh>
            <instancedMesh ref={carCabinRef} args={[undefined, undefined, MAX_CARS]} castShadow>
                <boxGeometry args={[0.2, 0.1, 0.4]} />
                <meshStandardMaterial roughness={0.3} metalness={0.7} />
            </instancedMesh>
            <instancedMesh ref={carWindowRef} args={[undefined, undefined, MAX_CARS]}>
                <boxGeometry args={[0.2, 0.1, 0.4]} />
                <meshStandardMaterial color="#050505" roughness={0} metalness={1} />
            </instancedMesh>
            <instancedMesh ref={carHeadlightRef} args={[undefined, undefined, MAX_CARS * 2]}>
                <boxGeometry args={[0.05, 0.03, 0.01]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
            </instancedMesh>
            <instancedMesh ref={carTaillightRef} args={[undefined, undefined, MAX_CARS * 2]}>
                <boxGeometry args={[0.05, 0.03, 0.01]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={3} />
            </instancedMesh>

            <instancedMesh ref={busBodyRef} args={[undefined, undefined, MAX_BUSES]} castShadow>
                <boxGeometry args={[0.35, 0.25, 0.8]} />
                <meshStandardMaterial roughness={0.4} metalness={0.3} />
            </instancedMesh>
            <instancedMesh ref={busWindowRef} args={[undefined, undefined, MAX_BUSES]}>
                <boxGeometry args={[0.35, 0.25, 0.8]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0} metalness={1} />
            </instancedMesh>

            <instancedMesh ref={peopleBodyRef} args={[undefined, undefined, MAX_PEOPLE]} castShadow>
                <capsuleGeometry args={[0.04, 0.08, 4, 8]} />
                <meshStandardMaterial roughness={0.8} />
            </instancedMesh>
            <instancedMesh ref={peopleHeadRef} args={[undefined, undefined, MAX_PEOPLE]} castShadow>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial roughness={0.6} />
            </instancedMesh>
        </group>
    );
};

export default CityLife;
