import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cone, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ZoneType } from '../types';

interface BuildingProps {
    type: ZoneType;
    variant?: number; // 0, 1, or 2
    position: [number, number, number];
    isSelected?: boolean;
    connections?: { n: boolean; s: boolean; e: boolean; w: boolean };
}

const Building: React.FC<BuildingProps> = ({ type, variant = 0, position, isSelected, connections }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current && isSelected) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 0.1;
        } else if (groupRef.current) {
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
        }
    });

    const mesh = useMemo(() => {
        const selectionEmissive = isSelected ? '#ffffff' : '#000000';
        const emissiveIntensity = isSelected ? 0.5 : 0;
        const yellowLineColor = '#fbbf24';
        const zebraWhite = '#ffffff';
        const asphaltColor = '#1a1a1a';
        const sidewalkColor = '#a0aec0';
        const curbColor = '#2d3748';

        switch (type) {
            case ZoneType.ROAD: {
                const { n = false, s = false, e = false, w = false } = connections || {};
                const connectionCount = [n, s, e, w].filter(Boolean).length;
                const isStraightNS = n && s && !e && !w;
                const isStraightEW = e && w && !n && !s;
                const isIntersection = connectionCount > 2;

                const LaneMarking = ({
                    type = 'double',
                    rotation = 0,
                    length = 0.5,
                    position = [0, 0.081, 0] as [number, number, number]
                }) => {
                    if (type === 'double') {
                        return (
                            <group rotation={[0, rotation, 0]} position={position}>
                                <Box args={[0.02, 0.005, length]}>
                                    <meshStandardMaterial color={yellowLineColor} />
                                </Box>
                                <Box args={[0.02, 0.005, length]} position={[0.04, 0, 0]}>
                                    <meshStandardMaterial color={yellowLineColor} />
                                </Box>
                            </group>
                        );
                    }
                    if (type === 'dashed') {
                        return (
                            <group rotation={[0, rotation, 0]} position={position}>
                                <Box args={[0.02, 0.005, length * 0.3]} position={[0.02, 0, length * 0.3]}>
                                    <meshStandardMaterial color={yellowLineColor} />
                                </Box>
                                <Box args={[0.02, 0.005, length * 0.3]} position={[0.02, 0, -length * 0.3]}>
                                    <meshStandardMaterial color={yellowLineColor} />
                                </Box>
                            </group>
                        );
                    }
                    return (
                        <Box args={[0.03, 0.005, length]} rotation={[0, rotation, 0]} position={position}>
                            <meshStandardMaterial color={yellowLineColor} />
                        </Box>
                    );
                };

                const ZebraCrossing = ({ rotation = 0, position = [0, 0.083, 0] as [number, number, number] }) => (
                    <group rotation={[0, rotation, 0]} position={position}>
                        {[-0.24, -0.12, 0, 0.12, 0.24].map((offset, i) => (
                            <Box key={i} args={[0.08, 0.004, 0.22]} position={[offset, 0, 0]}>
                                <meshStandardMaterial color={zebraWhite} roughness={0.4} />
                            </Box>
                        ))}
                    </group>
                );

                const Curb = ({
                    rotation = 0,
                    position = [0, 0, 0] as [number, number, number],
                    args = [1, 0.03, 0.04] as [number, number, number]
                }) => (
                    <Box args={args} rotation={[0, rotation, 0]} position={position}>
                        <meshStandardMaterial color={curbColor} roughness={0.7} />
                    </Box>
                );

                return (
                    <group>
                        <Box args={[1.0, 0.08, 1.0]} position={[0, 0.04, 0]}>
                            <meshStandardMaterial
                                color={asphaltColor}
                                emissive={selectionEmissive}
                                emissiveIntensity={emissiveIntensity}
                                roughness={0.9}
                            />
                        </Box>
                        <Box args={[0.1, 0.022, 1.0]} position={[-0.45, 0.08, 0]} receiveShadow>
                            <meshStandardMaterial color={sidewalkColor} />
                        </Box>
                        <Box args={[0.1, 0.022, 1.0]} position={[0.45, 0.08, 0]} receiveShadow>
                            <meshStandardMaterial color={sidewalkColor} />
                        </Box>
                        <Box args={[1.0, 0.022, 0.1]} position={[0, 0.08, -0.45]} receiveShadow>
                            <meshStandardMaterial color={sidewalkColor} />
                        </Box>
                        <Box args={[1.0, 0.022, 0.1]} position={[0, 0.08, 0.45]} receiveShadow>
                            <meshStandardMaterial color={sidewalkColor} />
                        </Box>

                        {n && (!isStraightNS || isIntersection) && <ZebraCrossing position={[0, 0.083, -0.36]} />}
                        {s && (!isStraightNS || isIntersection) && <ZebraCrossing position={[0, 0.083, 0.36]} />}
                        {w && (!isStraightEW || isIntersection) && (
                            <ZebraCrossing rotation={Math.PI / 2} position={[-0.36, 0.083, 0]} />
                        )}
                        {e && (!isStraightEW || isIntersection) && (
                            <ZebraCrossing rotation={Math.PI / 2} position={[0.36, 0.083, 0]} />
                        )}

                        <group position={[-0.01, 0, 0]}>
                            {n && (
                                <LaneMarking
                                    type={isStraightNS ? 'dashed' : 'double'}
                                    length={0.4}
                                    position={[0, 0.081, -0.25]}
                                />
                            )}
                            {s && (
                                <LaneMarking
                                    type={isStraightNS ? 'dashed' : 'double'}
                                    length={0.4}
                                    position={[0, 0.081, 0.25]}
                                />
                            )}
                            {w && (
                                <LaneMarking
                                    type={isStraightEW ? 'dashed' : 'double'}
                                    rotation={Math.PI / 2}
                                    length={0.4}
                                    position={[-0.25, 0.081, 0]}
                                />
                            )}
                            {e && (
                                <LaneMarking
                                    type={isStraightEW ? 'dashed' : 'double'}
                                    rotation={Math.PI / 2}
                                    length={0.4}
                                    position={[0.25, 0.081, 0]}
                                />
                            )}
                        </group>

                        {!n && <Curb position={[0, 0.09, -0.48]} args={[1, 0.04, 0.04]} />}
                        {!s && <Curb position={[0, 0.09, 0.48]} args={[1, 0.04, 0.04]} />}
                        {!e && <Curb position={[0.48, 0.09, 0]} args={[0.04, 0.04, 1]} />}
                        {!w && <Curb position={[-0.48, 0.09, 0]} args={[0.04, 0.04, 1]} />}
                    </group>
                );
            }
            case ZoneType.RESIDENTIAL: {
                const resColor = '#48bb78';
                if (variant === 1) {
                    // 現代雙層公寓
                    return (
                        <group>
                            <Box args={[0.4, 0.7, 0.6]} position={[-0.15, 0.35, 0]} castShadow>
                                <meshStandardMaterial
                                    color={resColor}
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                />
                            </Box>
                            <Box args={[0.4, 0.4, 0.6]} position={[0.15, 0.2, 0]} castShadow>
                                <meshStandardMaterial color="#c6f6d5" />
                            </Box>
                            <Box args={[0.8, 0.05, 0.7]} position={[0, 0.7, 0]}>
                                <meshStandardMaterial color="#2d3748" />
                            </Box>
                        </group>
                    );
                }
                if (variant === 2) {
                    // 長型平房
                    return (
                        <group>
                            <Box args={[0.8, 0.35, 0.4]} position={[0, 0.175, 0]} castShadow>
                                <meshStandardMaterial
                                    color={resColor}
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                />
                            </Box>
                            <Box args={[0.9, 0.1, 0.5]} position={[0, 0.35, 0]} rotation={[0.05, 0, 0]}>
                                <meshStandardMaterial color="#22543d" />
                            </Box>
                        </group>
                    );
                }
                // 原版
                return (
                    <group>
                        <Box args={[0.6, 0.5, 0.6]} position={[0, 0.25, 0]} castShadow>
                            <meshStandardMaterial
                                color={resColor}
                                emissive={selectionEmissive}
                                emissiveIntensity={emissiveIntensity}
                            />
                        </Box>
                        <Cone args={[0.5, 0.4, 4]} position={[0, 0.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                            <meshStandardMaterial color="#276749" />
                        </Cone>
                    </group>
                );
            }
            case ZoneType.COMMERCIAL: {
                const commColor = '#4299e1';
                if (variant === 1) {
                    // 玻璃帷幕大樓樣式
                    return (
                        <group>
                            <Box args={[0.6, 1.2, 0.6]} position={[0, 0.6, 0]} castShadow>
                                <meshStandardMaterial
                                    color={commColor}
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                    transparent
                                    opacity={0.9}
                                    metalness={1}
                                    roughness={0}
                                />
                            </Box>
                            <Box args={[0.65, 0.05, 0.65]} position={[0, 1.2, 0]}>
                                <meshStandardMaterial color="#2b6cb0" />
                            </Box>
                        </group>
                    );
                }
                if (variant === 2) {
                    // 帶招牌的零售商場
                    return (
                        <group>
                            <Box args={[0.8, 0.4, 0.8]} position={[0, 0.2, 0]} castShadow>
                                <meshStandardMaterial
                                    color={commColor}
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                />
                            </Box>
                            <Box args={[0.2, 0.5, 0.1]} position={[0.2, 0.45, 0.35]}>
                                <meshStandardMaterial color="#f6e05e" emissive="#f6e05e" emissiveIntensity={0.5} />
                            </Box>
                            <Box args={[0.9, 0.05, 0.9]} position={[0, 0.4, 0]}>
                                <meshStandardMaterial color="#2c5282" />
                            </Box>
                        </group>
                    );
                }
                return (
                    <group>
                        <Box args={[0.7, 0.8, 0.7]} position={[0, 0.4, 0]} castShadow>
                            <meshStandardMaterial
                                color={commColor}
                                emissive={selectionEmissive}
                                emissiveIntensity={emissiveIntensity}
                            />
                        </Box>
                        <Box args={[0.75, 0.1, 0.75]} position={[0, 0.85, 0]} castShadow>
                            <meshStandardMaterial color="#2b6cb0" />
                        </Box>
                    </group>
                );
            }
            case ZoneType.INDUSTRIAL: {
                const indColor = '#ecc94b';
                if (variant === 1) {
                    // 儲油罐群
                    return (
                        <group>
                            <Cylinder args={[0.2, 0.2, 0.5, 12]} position={[-0.2, 0.25, -0.2]} castShadow>
                                <meshStandardMaterial
                                    color="#cbd5e0"
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                />
                            </Cylinder>
                            <Cylinder args={[0.2, 0.2, 0.5, 12]} position={[0.2, 0.25, 0.2]} castShadow>
                                <meshStandardMaterial color="#cbd5e0" />
                            </Cylinder>
                            <Box args={[0.8, 0.1, 0.8]} position={[0, 0.05, 0]}>
                                <meshStandardMaterial color="#4a5568" />
                            </Box>
                        </group>
                    );
                }
                if (variant === 2) {
                    // 複雜化加工廠 (多煙囪)
                    return (
                        <group>
                            <Box args={[0.7, 0.4, 0.7]} position={[0, 0.2, 0]} castShadow>
                                <meshStandardMaterial
                                    color={indColor}
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                />
                            </Box>
                            <Cylinder args={[0.05, 0.05, 0.8, 6]} position={[0.2, 0.4, 0.2]}>
                                <meshStandardMaterial color="#744210" />
                            </Cylinder>
                            <Cylinder args={[0.05, 0.05, 0.8, 6]} position={[-0.2, 0.4, 0.2]}>
                                <meshStandardMaterial color="#744210" />
                            </Cylinder>
                            <Cylinder args={[0.05, 0.05, 0.8, 6]} position={[0, 0.4, -0.2]}>
                                <meshStandardMaterial color="#744210" />
                            </Cylinder>
                        </group>
                    );
                }
                return (
                    <group>
                        <Box args={[0.8, 0.6, 0.8]} position={[0, 0.3, 0]} castShadow>
                            <meshStandardMaterial
                                color={indColor}
                                emissive={selectionEmissive}
                                emissiveIntensity={emissiveIntensity}
                            />
                        </Box>
                        <Cylinder args={[0.1, 0.1, 1, 8]} position={[0.2, 0.6, 0.2]} castShadow>
                            <meshStandardMaterial color="#744210" />
                        </Cylinder>
                    </group>
                );
            }
            case ZoneType.PARK: {
                const parkColor = '#38b2ac';
                if (variant === 1) {
                    // 噴泉水池
                    return (
                        <group>
                            <Box args={[0.9, 0.1, 0.9]} position={[0, 0.05, 0]} receiveShadow>
                                <meshStandardMaterial
                                    color={parkColor}
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                />
                            </Box>
                            <Cylinder args={[0.3, 0.3, 0.05, 16]} position={[0, 0.1, 0]}>
                                <meshStandardMaterial color="#63b3ed" metalness={1} roughness={0} />
                            </Cylinder>
                            <Sphere args={[0.1, 8, 8]} position={[0, 0.2, 0]}>
                                <meshStandardMaterial color="#ebf8ff" transparent opacity={0.6} />
                            </Sphere>
                        </group>
                    );
                }
                if (variant === 2) {
                    // 彩色遊樂場
                    return (
                        <group>
                            <Box args={[0.9, 0.1, 0.9]} position={[0, 0.05, 0]} receiveShadow>
                                <meshStandardMaterial
                                    color={parkColor}
                                    emissive={selectionEmissive}
                                    emissiveIntensity={emissiveIntensity}
                                />
                            </Box>
                            <Box args={[0.2, 0.2, 0.2]} position={[-0.2, 0.2, 0.2]}>
                                <meshStandardMaterial color="#f56565" />
                            </Box>
                            <Cylinder args={[0.02, 0.2, 0.4, 4]} position={[0.2, 0.2, -0.2]} rotation={[0, 0, 0.5]}>
                                <meshStandardMaterial color="#4299e1" />
                            </Cylinder>
                        </group>
                    );
                }
                return (
                    <group>
                        <Box args={[0.9, 0.1, 0.9]} position={[0, 0.05, 0]} receiveShadow>
                            <meshStandardMaterial
                                color={parkColor}
                                emissive={selectionEmissive}
                                emissiveIntensity={emissiveIntensity}
                            />
                        </Box>
                        <Cone args={[0.2, 0.5, 8]} position={[0, 0.4, 0]} castShadow>
                            <meshStandardMaterial color="#234e52" />
                        </Cone>
                        <Cone args={[0.15, 0.3, 8]} position={[0.25, 0.25, 0.2]} castShadow>
                            <meshStandardMaterial color="#2d6a4f" />
                        </Cone>
                    </group>
                );
            }
            case ZoneType.BUS_STOP:
                return (
                    <group>
                        <Box args={[0.8, 0.05, 0.8]} position={[0, 0.025, 0]} receiveShadow>
                            <meshStandardMaterial
                                color="#718096"
                                emissive={selectionEmissive}
                                emissiveIntensity={emissiveIntensity}
                            />
                        </Box>
                        <Box args={[0.6, 0.5, 0.05]} position={[0, 0.25, -0.3]} castShadow>
                            <meshStandardMaterial color="#4a5568" transparent opacity={0.8} />
                        </Box>
                        <Box args={[0.7, 0.05, 0.4]} position={[0, 0.5, -0.15]} rotation={[0.1, 0, 0]} castShadow>
                            <meshStandardMaterial color="#2d3748" />
                        </Box>
                        <Box args={[0.4, 0.1, 0.15]} position={[0, 0.1, -0.15]} castShadow>
                            <meshStandardMaterial color="#744210" />
                        </Box>
                        <Cylinder args={[0.02, 0.02, 0.6, 8]} position={[0.3, 0.3, 0.2]} castShadow>
                            <meshStandardMaterial color="#a0aec0" />
                        </Cylinder>
                        <Box args={[0.15, 0.1, 0.02]} position={[0.3, 0.55, 0.2]} castShadow>
                            <meshStandardMaterial color="#f6ad55" />
                        </Box>
                    </group>
                );
            default:
                return null;
        }
    }, [type, variant, isSelected, connections]);

    return (
        <group position={position} ref={groupRef}>
            {mesh}
        </group>
    );
};

export default Building;
