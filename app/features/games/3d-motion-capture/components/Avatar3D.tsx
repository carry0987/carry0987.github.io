import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import type { PoseResults, Landmark, AvatarConfig } from '../types';
import { AVATAR_COLORS, AvatarColorScheme } from '../types';
import { usePageVisibility } from '@/hooks';

interface Avatar3DProps {
    poseResults: PoseResults | null;
    config: AvatarConfig;
}

// Map MediaPipe landmarks to connections for "bones"
// Format: [start_index, end_index]
const BONE_CONNECTIONS = [
    [11, 12], // Shoulders
    [11, 13],
    [13, 15], // Left Arm
    [12, 14],
    [14, 16], // Right Arm
    [11, 23],
    [12, 24], // Torso sides
    [23, 24], // Hips
    [23, 25],
    [25, 27], // Left Leg
    [24, 26],
    [26, 28], // Right Leg
    [0, 11],
    [0, 12] // Neck/Head approximate
];

// Define maximum bone lengths (in 3D units) to prevent unrealistic stretching
// These are based on human body proportions scaled to a ~2 unit tall figure
const BONE_MAX_LENGTHS: Record<string, number> = {
    '11-12': 0.6, // Shoulders width
    '11-13': 0.5, // Upper arm
    '13-15': 0.5, // Forearm
    '12-14': 0.5, // Upper arm
    '14-16': 0.5, // Forearm
    '11-23': 0.7, // Torso side
    '12-24': 0.7, // Torso side
    '23-24': 0.4, // Hips width
    '23-25': 0.6, // Upper leg
    '25-27': 0.6, // Lower leg
    '24-26': 0.6, // Upper leg
    '26-28': 0.6, // Lower leg
    '0-11': 0.5, // Neck to shoulder
    '0-12': 0.5 // Neck to shoulder
};

// Get bone key for lookup
const getBoneKey = (start: number, end: number): string => {
    return start < end ? `${start}-${end}` : `${end}-${start}`;
};

// Helper to interpolate position smoothly
const lerpVector = (v1: THREE.Vector3, v2: THREE.Vector3, alpha: number) => {
    v1.lerp(v2, alpha);
};

// A generic "Bone" cylinder
const Bone: React.FC<{
    start: THREE.Vector3;
    end: THREE.Vector3;
    thickness: number;
    colorScheme: AvatarColorScheme;
}> = ({ start, end, thickness, colorScheme }) => {
    const ref = useRef<THREE.Mesh>(null);
    const colors = AVATAR_COLORS[colorScheme];

    useFrame(() => {
        if (ref.current) {
            const dist = start.distanceTo(end);

            // Prevent visual artifacts when bones are extremely short
            if (dist < 0.01) {
                ref.current.scale.set(0, 0, 0);
                return;
            }

            // Position at midpoint using lerpVectors to avoid new object allocation
            ref.current.position.lerpVectors(start, end, 0.5);

            // Align orientation: Look at the end point
            ref.current.lookAt(end);
            // Rotate 90 degrees on X to align the cylinder (which is Y-up) with the lookAt vector (which is Z-forward)
            ref.current.rotateX(Math.PI / 2);

            // Scale height only (Y-axis), keeping thickness (X and Z axes) constant at 1
            // This ensures the bone radius stays the same regardless of length
            ref.current.scale.set(1, dist, 1);
        }
    });

    return (
        <mesh ref={ref}>
            <cylinderGeometry args={[thickness, thickness, 1, 8]} />
            <meshStandardMaterial color={colors.bone} emissive={colors.emissive} metalness={0.8} roughness={0.2} />
        </mesh>
    );
};

// A "Joint" sphere
const Joint: React.FC<{ position: THREE.Vector3; size: number; colorScheme: AvatarColorScheme }> = ({
    position,
    size,
    colorScheme
}) => {
    const ref = useRef<THREE.Mesh>(null);
    const colors = AVATAR_COLORS[colorScheme];

    useFrame(() => {
        if (ref.current) ref.current.position.copy(position);
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={colors.joint} metalness={0.5} roughness={0.1} />
        </mesh>
    );
};

// Head with expression cues
const Head = ({
    nose,
    leftEar,
    rightEar,
    colorScheme
}: {
    nose: THREE.Vector3;
    leftEar: THREE.Vector3;
    rightEar: THREE.Vector3;
    mouthLeft: THREE.Vector3;
    mouthRight: THREE.Vector3;
    colorScheme: AvatarColorScheme;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const colors = AVATAR_COLORS[colorScheme];

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(nose);

            // Simple rotation based on ears
            const earVector = new THREE.Vector3().subVectors(rightEar, leftEar).normalize();
            const up = new THREE.Vector3(0, 1, 0);

            // Create a rotation matrix where X axis matches ears
            // This is a simplified "look at" for the head
            const matrix = new THREE.Matrix4();
            const zAxis = new THREE.Vector3().crossVectors(earVector, up).normalize();
            const yAxis = new THREE.Vector3().crossVectors(zAxis, earVector).normalize();

            matrix.makeBasis(earVector, yAxis, zAxis);
            // groupRef.current.setRotationFromMatrix(matrix);
            // Simplified: Just position for now, full head rotation from MP points is complex math
        }
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color={colors.joint} transparent opacity={0.9} />
            </mesh>
            {/* Eyes */}
            <mesh position={[-0.1, 0.05, 0.2]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[0.1, 0.05, 0.2]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial color="black" />
            </mesh>
        </group>
    );
};

const Robot = ({ landmarks, config }: { landmarks: Landmark[]; config: AvatarConfig }) => {
    // Convert landmarks to Vector3s.
    // MP coords: x (0-1), y (0-1), z (approx meters).
    // We flip Y and scale to World units.

    // Create stable Vector3 objects to avoid re-allocation every frame
    const vectors = useMemo(() => {
        return Array.from({ length: 33 }, () => new THREE.Vector3());
    }, []);

    // Temporary vectors for raw positions before constraint
    const rawVectors = useMemo(() => {
        return Array.from({ length: 33 }, () => new THREE.Vector3());
    }, []);

    // Target height for the figure in 3D units (head to feet)
    const targetHeight = 2.0;

    // Helper to constrain bone length
    const constrainBoneLength = (
        parentIdx: number,
        childIdx: number,
        maxLength: number,
        constrainedVectors: THREE.Vector3[]
    ) => {
        const parent = constrainedVectors[parentIdx];
        const child = constrainedVectors[childIdx];
        const dist = parent.distanceTo(child);

        if (dist > maxLength) {
            // Move child toward parent to maintain max length
            const direction = new THREE.Vector3().subVectors(child, parent).normalize();
            child.copy(parent).addScaledVector(direction, maxLength);
        }
    };

    useFrame(() => {
        // Calculate body height from head (nose) to feet (ankles) in MediaPipe coords
        const noseY = landmarks[0]?.y ?? 0.17;
        const leftAnkleY = landmarks[27]?.y ?? 0.83;
        const rightAnkleY = landmarks[28]?.y ?? 0.83;
        const lowestY = Math.max(leftAnkleY, rightAnkleY);

        // Height in MP coords (higher y value = lower position)
        const bodyHeightMP = lowestY - noseY;

        // Calculate scale factor to normalize body height
        // Avoid division by zero
        const heightScale = bodyHeightMP > 0.1 ? targetHeight / (bodyHeightMP * 3) : 1;

        // First pass: calculate raw positions
        landmarks.forEach((l, i) => {
            if (i < 33) {
                // Mapping:
                // MediaPipe: x (0-1 left to right), y (0-1 top to bottom), z (depth)
                // Three.js: x (left-right), y (up-down), z (forward-back)
                //
                // x: flip for mirror effect, apply height normalization
                // y: invert, normalize height, and anchor feet to ground
                // z: invert for ThreeJS camera orientation
                const rawY = (0.5 - l.y) * 3 * heightScale;
                const feetY = (0.5 - lowestY) * 3 * heightScale;

                const x = (0.5 - l.x) * 3 * heightScale * config.scale;
                const y = (rawY - feetY) * config.scale; // Anchor feet to y=0
                const z = -l.z * 2 * heightScale * config.scale;

                rawVectors[i].set(x, y, z);
            }
        });

        // Second pass: apply bone length constraints
        // We need to process bones in a hierarchical order (from core to extremities)
        // Copy raw positions to a working array first
        rawVectors.forEach((v, i) => {
            if (i < 33) {
                vectors[i].lerp(v, config.smoothing);
            }
        });

        // Apply constraints in hierarchical order:
        // 1. Core body (shoulders, hips)
        const scaledMaxLengths: Record<string, number> = {};
        Object.entries(BONE_MAX_LENGTHS).forEach(([key, length]) => {
            scaledMaxLengths[key] = length * config.scale;
        });

        // Head to shoulders
        constrainBoneLength(0, 11, scaledMaxLengths['0-11'], vectors);
        constrainBoneLength(0, 12, scaledMaxLengths['0-12'], vectors);

        // Shoulders width
        constrainBoneLength(11, 12, scaledMaxLengths['11-12'], vectors);

        // Torso (shoulders to hips)
        constrainBoneLength(11, 23, scaledMaxLengths['11-23'], vectors);
        constrainBoneLength(12, 24, scaledMaxLengths['12-24'], vectors);

        // Hips width
        constrainBoneLength(23, 24, scaledMaxLengths['23-24'], vectors);

        // Arms (from shoulder outward)
        constrainBoneLength(11, 13, scaledMaxLengths['11-13'], vectors); // L upper arm
        constrainBoneLength(13, 15, scaledMaxLengths['13-15'], vectors); // L forearm
        constrainBoneLength(12, 14, scaledMaxLengths['12-14'], vectors); // R upper arm
        constrainBoneLength(14, 16, scaledMaxLengths['14-16'], vectors); // R forearm

        // Legs (from hip downward)
        constrainBoneLength(23, 25, scaledMaxLengths['23-25'], vectors); // L upper leg
        constrainBoneLength(25, 27, scaledMaxLengths['25-27'], vectors); // L lower leg
        constrainBoneLength(24, 26, scaledMaxLengths['24-26'], vectors); // R upper leg
        constrainBoneLength(26, 28, scaledMaxLengths['26-28'], vectors); // R lower leg
    });

    // Check if we have enough confidence (basic check using nose visibility)
    if (landmarks[0].visibility && landmarks[0].visibility < 0.5) return null;

    return (
        <group>
            {BONE_CONNECTIONS.map(([start, end], idx) => (
                <Bone
                    key={`bone-${idx}`}
                    start={vectors[start]}
                    end={vectors[end]}
                    thickness={config.boneThickness}
                    colorScheme={config.colorScheme}
                />
            ))}
            {[11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].map((idx) => (
                <Joint
                    key={`joint-${idx}`}
                    position={vectors[idx]}
                    size={config.jointSize}
                    colorScheme={config.colorScheme}
                />
            ))}
            <Head
                nose={vectors[0]}
                leftEar={vectors[7]}
                rightEar={vectors[8]}
                mouthLeft={vectors[9]}
                mouthRight={vectors[10]}
                colorScheme={config.colorScheme}
            />
        </group>
    );
};

// Component to handle visibility-based rendering control
const SceneController: React.FC<{ isPaused: boolean }> = ({ isPaused }) => {
    const { gl, scene } = useThree();

    useEffect(() => {
        if (isPaused) {
            // Stop the render loop when paused
            gl.setAnimationLoop(null);
        } else {
            // Resume rendering - the Canvas will handle this automatically
            // by re-enabling the animation loop
        }
    }, [isPaused, gl]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Dispose of all geometries and materials in the scene
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry?.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => mat.dispose());
                    } else if (object.material) {
                        object.material.dispose();
                    }
                }
            });
            // Dispose of render target and other WebGL resources
            gl.dispose();
        };
    }, [gl, scene]);

    return null;
};

const Avatar3D: React.FC<Avatar3DProps> = ({ poseResults, config }) => {
    const { isVisible } = usePageVisibility();
    const isPaused = !isVisible;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Callback to dispose resources when component unmounts or visibility changes
    const onCreated = useCallback((state: { gl: THREE.WebGLRenderer }) => {
        // Store reference to renderer for potential manual cleanup
        const { gl } = state;

        // Configure renderer for better performance
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, []);

    return (
        <div className="w-full h-full bg-slate-900 relative">
            {/* Paused overlay */}
            {isPaused && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="text-cyan-400 text-lg font-semibold">Paused</div>
                        <div className="text-gray-400 text-sm">3D rendering suspended</div>
                    </div>
                </div>
            )}
            <Canvas
                ref={canvasRef}
                shadows
                camera={{ position: [0, 2, 6], fov: 50 }}
                frameloop={isPaused ? 'never' : 'always'}
                onCreated={onCreated}>
                <SceneController isPaused={isPaused} />
                <fog attach="fog" args={['#0f172a', 5, 20]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* Dynamic Character */}
                {poseResults && poseResults.poseLandmarks && (
                    <Robot landmarks={poseResults.poseLandmarks} config={config} />
                )}

                {/* Environment */}
                <Grid infiniteGrid fadeDistance={30} sectionColor="#4f46e5" cellColor="#0f172a" />
                <Environment preset="city" />
                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.5}
                    enableDamping={true}
                    dampingFactor={0.03}
                    autoRotate={!poseResults}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};

export default Avatar3D;
