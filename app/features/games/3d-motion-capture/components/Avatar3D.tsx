import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import type { PoseResults, Landmark, AvatarConfig } from '../types';
import { AVATAR_COLORS, AvatarColorScheme } from '../types';

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

    useFrame(() => {
        // First pass: calculate the lowest point (feet) to anchor the figure to ground
        // Use ankle landmarks (27 = left ankle, 28 = right ankle)
        const leftAnkleY = landmarks[27]?.y ?? 0.83;
        const rightAnkleY = landmarks[28]?.y ?? 0.83;
        const lowestY = Math.max(leftAnkleY, rightAnkleY); // Higher value = lower position in MP coords

        // Calculate offset to place feet at ground level (3D y = 0)
        // Formula: ((0.5 - lowestY) * 3 + offset) * scale = 0
        // Solving for offset: offset = (lowestY - 0.5) * 3
        const groundOffset = (lowestY - 0.5) * 3;

        landmarks.forEach((l, i) => {
            if (i < 33) {
                // Mapping:
                // MediaPipe: x (0-1 left to right), y (0-1 top to bottom), z (depth)
                // Three.js: x (left-right), y (up-down), z (forward-back)
                //
                // x: flip for mirror effect
                // y: invert and apply dynamic offset to keep feet on ground
                // z: invert for ThreeJS camera orientation
                const x = (0.5 - l.x) * 3 * config.scale;
                const y = ((0.5 - l.y) * 3 + groundOffset) * config.scale;
                const z = -l.z * 2 * config.scale;

                // Smoothly interpolate for less jitter (use config smoothing)
                lerpVector(vectors[i], new THREE.Vector3(x, y, z), config.smoothing);
            }
        });
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

const Avatar3D: React.FC<Avatar3DProps> = ({ poseResults, config }) => {
    return (
        <div className="w-full h-full bg-slate-900 relative">
            <Canvas shadows camera={{ position: [0, 2, 6], fov: 50 }}>
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
