import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GameState } from '../types';
import { LEVEL_1, TILE_SIZE, BALL_RADIUS, GRAVITY_SCALE, FRICTION, MAX_VELOCITY, SHAKE_THRESHOLD } from '../constants';

interface MazeGameProps {
    gameState: GameState;
    onGameStateChange: (state: GameState) => void;
    hasPermission: boolean;
}

const MazeGame: React.FC<MazeGameProps> = ({ gameState, onGameStateChange, hasPermission }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const ballRef = useRef<THREE.Mesh | null>(null);
    const boardGroupRef = useRef<THREE.Group | null>(null);

    // Physics State refs (mutable for performance in loop)
    const ballVelocity = useRef({ x: 0, z: 0 });
    const ballPosition = useRef({ x: 0, y: BALL_RADIUS, z: 0 });
    const boardTilt = useRef({ x: 0, z: 0 });
    const lastShakeTime = useRef(0);

    // Mouse fallback
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!mountRef.current) return;

        // --- 1. Scene Setup ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);
        scene.fog = new THREE.Fog(0x050505, 10, 50);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 20, 15);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        // Neon lights
        const pointLight = new THREE.PointLight(0x00ffff, 2, 20);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);

        // --- 2. Level Generation ---
        const boardGroup = new THREE.Group();
        scene.add(boardGroup);
        boardGroupRef.current = boardGroup;

        const walls: THREE.Box3[] = [];
        let startPos = { x: 0, z: 0 };
        let goalPos = { x: 0, z: 0 };

        const wallGeo = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.1,
            metalness: 0.8,
            emissive: 0x0f0f2d,
            emissiveIntensity: 0.2
        });

        const floorGeo = new THREE.PlaneGeometry(LEVEL_1[0].length * TILE_SIZE, LEVEL_1.length * TILE_SIZE);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -TILE_SIZE / 2; // Floor below walls
        floor.receiveShadow = true;
        boardGroup.add(floor);

        // Center the board
        const offsetX = (LEVEL_1[0].length * TILE_SIZE) / 2 - TILE_SIZE / 2;
        const offsetZ = (LEVEL_1.length * TILE_SIZE) / 2 - TILE_SIZE / 2;

        LEVEL_1.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const x = colIndex * TILE_SIZE - offsetX;
                const z = rowIndex * TILE_SIZE - offsetZ;

                if (cell === 1) {
                    // Wall
                    const wall = new THREE.Mesh(wallGeo, wallMat);
                    wall.position.set(x, 0, z);
                    wall.castShadow = true;
                    wall.receiveShadow = true;
                    boardGroup.add(wall);

                    // Collision box
                    const box = new THREE.Box3().setFromObject(wall);
                    // Shrink box slightly to allow smooth sliding
                    box.expandByScalar(-0.1);
                    walls.push(box);
                } else if (cell === 2) {
                    // Start
                    startPos = { x, z };

                    // Start Marker
                    const startGeo = new THREE.RingGeometry(0.5, 1, 32);
                    const startMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
                    const startRing = new THREE.Mesh(startGeo, startMat);
                    startRing.rotation.x = -Math.PI / 2;
                    startRing.position.set(x, -TILE_SIZE / 2 + 0.05, z);
                    boardGroup.add(startRing);
                } else if (cell === 3) {
                    // Goal
                    goalPos = { x, z };
                    const goalGeo = new THREE.CylinderGeometry(0.2, 0.2, 100, 16);
                    const goalMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.3 });
                    const beam = new THREE.Mesh(goalGeo, goalMat);
                    beam.position.set(x, 50, z);
                    boardGroup.add(beam);

                    const goalBaseGeo = new THREE.ConeGeometry(0.8, 1, 32);
                    const goalBaseMat = new THREE.MeshStandardMaterial({
                        color: 0xff00ff,
                        emissive: 0xff00ff,
                        emissiveIntensity: 2
                    });
                    const goalBase = new THREE.Mesh(goalBaseGeo, goalBaseMat);
                    goalBase.position.set(x, 0, z);
                    boardGroup.add(goalBase);
                }
            });
        });

        // Ball
        const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
        const ballMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x00aaaa,
            emissiveIntensity: 0.4
        });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.castShadow = true;
        ballPosition.current = { x: startPos.x, y: 0, z: startPos.z };
        ball.position.set(startPos.x, 0, startPos.z);

        // Ball glow light
        const ballLight = new THREE.PointLight(0x00ffff, 1, 8);
        ball.add(ballLight);

        boardGroup.add(ball);
        ballRef.current = ball;

        // --- 3. Logic & Animation Loop ---

        const updatePhysics = () => {
            if (gameState !== GameState.PLAYING) return;

            const tiltX = boardTilt.current.x; // Rotation around X axis (tilts forward/back) -> Affects Z velocity
            const tiltZ = boardTilt.current.z; // Rotation around Z axis (tilts left/right) -> Affects X velocity

            // Update velocity based on tilt (gravity)
            ballVelocity.current.x += tiltZ * GRAVITY_SCALE;
            ballVelocity.current.z += tiltX * GRAVITY_SCALE; // Corrected mapping

            // Apply friction
            ballVelocity.current.x *= FRICTION;
            ballVelocity.current.z *= FRICTION;

            // Limit max velocity
            ballVelocity.current.x = Math.max(Math.min(ballVelocity.current.x, MAX_VELOCITY), -MAX_VELOCITY);
            ballVelocity.current.z = Math.max(Math.min(ballVelocity.current.z, MAX_VELOCITY), -MAX_VELOCITY);

            // Potential new position
            let nextX = ballPosition.current.x + ballVelocity.current.x;
            let nextZ = ballPosition.current.z + ballVelocity.current.z;

            // Collision Detection (Wall AABB vs Sphere)
            // We check X and Z axis separately for better sliding against walls

            const checkCollision = (cx: number, cz: number): boolean => {
                const ballSphere = new THREE.Sphere(new THREE.Vector3(cx, 0, cz), BALL_RADIUS);
                for (const wallBox of walls) {
                    if (wallBox.intersectsSphere(ballSphere)) {
                        return true;
                    }
                }
                return false;
            };

            // X Axis check
            if (checkCollision(nextX, ballPosition.current.z)) {
                ballVelocity.current.x *= -0.5; // Bounce
                nextX = ballPosition.current.x; // Cancel move
            } else {
                ballPosition.current.x = nextX;
            }

            // Z Axis check
            if (checkCollision(ballPosition.current.x, nextZ)) {
                ballVelocity.current.z *= -0.5; // Bounce
                nextZ = ballPosition.current.z; // Cancel move
            } else {
                ballPosition.current.z = nextZ;
            }

            // Update Mesh
            if (ballRef.current) {
                ballRef.current.position.set(ballPosition.current.x, 0, ballPosition.current.z);
                // Roll the ball visually
                ballRef.current.rotation.x -= ballVelocity.current.z * 0.2;
                ballRef.current.rotation.z += ballVelocity.current.x * 0.2;
            }

            // Check Win
            const distToGoal = Math.sqrt(
                Math.pow(ballPosition.current.x - goalPos.x, 2) + Math.pow(ballPosition.current.z - goalPos.z, 2)
            );

            if (distToGoal < 1.0) {
                onGameStateChange(GameState.WON);
            }

            // Check falling off map (simple bounds)
            if (Math.abs(ballPosition.current.x) > offsetX + 5 || Math.abs(ballPosition.current.z) > offsetZ + 5) {
                // Reset ball
                ballPosition.current = { x: startPos.x, y: 0, z: startPos.z };
                ballVelocity.current = { x: 0, z: 0 };
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);

            if (boardGroupRef.current) {
                // Visual board tilt
                // Smoothly interpolate current tilt to target tilt
                boardGroupRef.current.rotation.x +=
                    (boardTilt.current.x * 0.5 - boardGroupRef.current.rotation.x) * 0.1;
                boardGroupRef.current.rotation.z +=
                    (-boardTilt.current.z * 0.5 - boardGroupRef.current.rotation.z) * 0.1;
            }

            updatePhysics();
            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animId);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [gameState, onGameStateChange]);

    // --- 4. Sensor Logic Hooks ---

    useEffect(() => {
        // Reset function
        const resetGame = () => {
            // We can't easily reset internal animation loop vars from here without refs,
            // but we can manipulate the position ref which the loop reads.
            // For a full reset, we might want to reload the component, but here we just teleport the ball.
            // The main loop handles the actual position logic.
            const offsetX = (LEVEL_1[0].length * TILE_SIZE) / 2 - TILE_SIZE / 2;
            const offsetZ = (LEVEL_1.length * TILE_SIZE) / 2 - TILE_SIZE / 2;
            let startPos = { x: 0, z: 0 };
            LEVEL_1.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell === 2) {
                        startPos = {
                            x: colIndex * TILE_SIZE - offsetX,
                            z: rowIndex * TILE_SIZE - offsetZ
                        };
                    }
                });
            });
            ballPosition.current = { x: startPos.x, y: 0, z: startPos.z };
            ballVelocity.current = { x: 0, z: 0 };
        };

        if (gameState === GameState.PLAYING) {
            // On Game Start, ensure ball is at start
            resetGame();
        }

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!hasPermission) return;

            let { beta, gamma } = event;
            // Beta: Front/Back tilt [-180, 180]
            // Gamma: Left/Right tilt [-90, 90]

            if (beta === null || gamma === null) return;

            // Clamp values to avoid extreme tilting
            const maxTilt = 30; // degrees

            // Fix for holding device landscape vs portrait?
            // For this simplified version, we assume Portrait mode interaction usually,
            // but games often lock orientation.
            // Let's assume standard portrait hold:
            // Beta > 0 is tilting towards user, Beta < 0 away.

            if (beta > 90) beta = 90;
            if (beta < -90) beta = -90;

            // Normalize to -1 to 1 range based on maxTilt
            const x = Math.min(Math.max(beta / maxTilt, -1), 1);
            const z = Math.min(Math.max(gamma / maxTilt, -1), 1);

            boardTilt.current = { x: x, z: z };
        };

        const handleMotion = (event: DeviceMotionEvent) => {
            if (!hasPermission) return;

            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            // Simple shake detection
            const totalAcc = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);

            if (totalAcc > SHAKE_THRESHOLD) {
                const now = Date.now();
                if (now - lastShakeTime.current > 1000) {
                    lastShakeTime.current = now;
                    resetGame();
                    // Visual feedback?
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Fallback for desktop debugging
            if (hasPermission) return; // If we have sensors, ignore mouse

            const x = (e.clientY / window.innerHeight) * 2 - 1; // Up/Down maps to X tilt
            const z = (e.clientX / window.innerWidth) * 2 - 1; // Left/Right maps to Z tilt

            boardTilt.current = { x: x, z: z };
        };

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('devicemotion', handleMotion);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [hasPermission, gameState]);

    return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default MazeGame;
