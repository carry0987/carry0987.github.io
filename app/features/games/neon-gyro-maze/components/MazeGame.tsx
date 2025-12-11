import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GameState } from '../types';
import { LEVEL_1, TILE_SIZE, BALL_RADIUS, GRAVITY_SCALE, FRICTION, MAX_VELOCITY, SHAKE_THRESHOLD } from '../constants';

interface MazeGameProps {
    gameState: GameState;
    onGameStateChange: (state: GameState) => void;
    hasPermission: boolean;
}

// Particle System Constants
const MAX_PARTICLES = 1000;
const PARTICLE_SIZE = 0.3;

// Trail Constants
const TRAIL_LENGTH = 40;
const TRAIL_WIDTH = 0.4;

interface ParticleData {
    active: boolean;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    life: number;
    maxLife: number;
    color: THREE.Color;
    sizeScale: number;
}

const createGlowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};

const MazeGame: React.FC<MazeGameProps> = ({ gameState, onGameStateChange, hasPermission }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const ballRef = useRef<THREE.Mesh | null>(null);
    const boardGroupRef = useRef<THREE.Group | null>(null);

    // Physics State refs
    const ballVelocity = useRef({ x: 0, y: 0, z: 0 });
    const ballPosition = useRef({ x: 0, y: BALL_RADIUS, z: 0 });
    const boardTilt = useRef({ x: 0, z: 0 });
    const lastShakeTime = useRef(0);

    // Animation Refs
    const globalLightRef = useRef<THREE.PointLight | null>(null);
    const ballLightRef = useRef<THREE.PointLight | null>(null);
    const goalMatRef = useRef<THREE.Material | null>(null);
    const gridHelperRef = useRef<THREE.GridHelper | null>(null);

    // Particle System Refs
    const particlesRef = useRef<ParticleData[]>([]);
    const particleGeometryRef = useRef<THREE.BufferGeometry | null>(null);

    // Trail Refs
    const trailPositions = useRef<THREE.Vector3[]>([]);
    const trailMeshRef = useRef<THREE.Mesh | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // --- 1. Scene Setup ---
        const scene = new THREE.Scene();
        const bgColor = new THREE.Color(0x020205);
        scene.background = bgColor;
        scene.fog = new THREE.Fog(bgColor, 10, 60);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 22, 18);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const mainLight = new THREE.PointLight(0x00ffff, 1.5, 50);
        mainLight.position.set(0, 15, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.bias = -0.0001;
        scene.add(mainLight);
        globalLightRef.current = mainLight;

        const gridHelper = new THREE.GridHelper(100, 40, 0x004444, 0x001111);
        gridHelper.position.y = -8;
        scene.add(gridHelper);
        gridHelperRef.current = gridHelper;

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
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x0000ff,
            emissiveIntensity: 0.1
        });

        // Instead of one big plane, we use individual tiles to allow for holes
        const floorGeo = new THREE.BoxGeometry(TILE_SIZE, 0.5, TILE_SIZE);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.5,
            metalness: 0.5
        });

        const offsetX = (LEVEL_1[0].length * TILE_SIZE) / 2 - TILE_SIZE / 2;
        const offsetZ = (LEVEL_1.length * TILE_SIZE) / 2 - TILE_SIZE / 2;

        LEVEL_1.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const x = colIndex * TILE_SIZE - offsetX;
                const z = rowIndex * TILE_SIZE - offsetZ;

                if (cell !== 4) {
                    const floorTile = new THREE.Mesh(floorGeo, floorMat);
                    floorTile.position.set(x, -0.25, z);
                    floorTile.receiveShadow = true;
                    boardGroup.add(floorTile);
                }

                if (cell === 1) {
                    const wall = new THREE.Mesh(wallGeo, wallMat);
                    wall.position.set(x, 0, z);
                    wall.castShadow = true;
                    wall.receiveShadow = true;
                    boardGroup.add(wall);

                    const box = new THREE.Box3().setFromObject(wall);
                    box.expandByScalar(-0.1);
                    walls.push(box);
                } else if (cell === 2) {
                    startPos = { x, z };
                    const startGeo = new THREE.RingGeometry(0.5, 0.8, 32);
                    const startMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
                    const startRing = new THREE.Mesh(startGeo, startMat);
                    startRing.rotation.x = -Math.PI / 2;
                    startRing.position.set(x, -TILE_SIZE / 2 + 0.3, z);
                    boardGroup.add(startRing);
                } else if (cell === 3) {
                    goalPos = { x, z };
                    const goalGeo = new THREE.CylinderGeometry(0.3, 0.3, 40, 16, 1, true);
                    const goalMat = new THREE.MeshBasicMaterial({
                        color: 0xff00ff,
                        transparent: true,
                        opacity: 0.3,
                        blending: THREE.AdditiveBlending,
                        side: THREE.DoubleSide,
                        depthWrite: false
                    });
                    const beam = new THREE.Mesh(goalGeo, goalMat);
                    beam.position.set(x, 20, z);
                    boardGroup.add(beam);
                    goalMatRef.current = goalMat;

                    const goalBaseGeo = new THREE.CylinderGeometry(0.8, 1, 0.2, 32);
                    const goalBaseMat = new THREE.MeshStandardMaterial({
                        color: 0xff00ff,
                        emissive: 0xff00ff,
                        emissiveIntensity: 2
                    });
                    const goalBase = new THREE.Mesh(goalBaseGeo, goalBaseMat);
                    goalBase.position.set(x, -TILE_SIZE / 2 + 0.3, z);
                    boardGroup.add(goalBase);

                    const goalLight = new THREE.PointLight(0xff00ff, 2, 8);
                    goalLight.position.set(x, 1, z);
                    boardGroup.add(goalLight);
                }
            });
        });

        const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
        const ballMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.6,
            roughness: 0.2,
            emissive: 0x0088ff,
            emissiveIntensity: 0.5
        });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.castShadow = true;
        ballPosition.current = { x: startPos.x, y: 0, z: startPos.z };
        ball.position.set(startPos.x, 0, startPos.z);

        const ballLight = new THREE.PointLight(0x0088ff, 2, 12);
        ball.add(ballLight);
        ballLightRef.current = ballLight;

        boardGroup.add(ball);
        ballRef.current = ball;

        // --- Particle System Init ---
        const pData: ParticleData[] = [];
        for (let i = 0; i < MAX_PARTICLES; i++) {
            pData.push({
                active: false,
                x: 0,
                y: 0,
                z: 0,
                vx: 0,
                vy: 0,
                vz: 0,
                life: 0,
                maxLife: 1,
                color: new THREE.Color(),
                sizeScale: 1
            });
        }
        particlesRef.current = pData;

        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(MAX_PARTICLES * 3);
        const pColor = new Float32Array(MAX_PARTICLES * 3);

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));

        const pMat = new THREE.PointsMaterial({
            size: PARTICLE_SIZE,
            vertexColors: true,
            map: createGlowTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.8
        });

        const particleSystem = new THREE.Points(pGeo, pMat);
        boardGroup.add(particleSystem);
        particleGeometryRef.current = pGeo;

        // --- Trail System Init ---
        const tGeo = new THREE.BufferGeometry();
        const tPositions = new Float32Array(TRAIL_LENGTH * 2 * 3); // 2 vertices per segment step
        const tAlphas = new Float32Array(TRAIL_LENGTH * 2);

        tGeo.setAttribute('position', new THREE.BufferAttribute(tPositions, 3));
        tGeo.setAttribute('alpha', new THREE.BufferAttribute(tAlphas, 1));

        const tMat = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(color, vAlpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        const trailMesh = new THREE.Mesh(tGeo, tMat);
        trailMesh.frustumCulled = false;
        boardGroup.add(trailMesh);
        trailMeshRef.current = trailMesh;

        // --- 3. Logic & Animation Loop ---

        const spawnParticle = (
            x: number,
            y: number,
            z: number,
            color: THREE.Color,
            count: number,
            speed: number,
            spread: number
        ) => {
            let spawned = 0;
            for (let i = 0; i < MAX_PARTICLES; i++) {
                if (!particlesRef.current[i].active) {
                    const p = particlesRef.current[i];
                    p.active = true;
                    p.x = x;
                    p.y = y;
                    p.z = z;

                    // Random spherical direction
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    const v = Math.random() * speed;

                    p.vx = Math.sin(phi) * Math.cos(theta) * v + (Math.random() - 0.5) * spread;
                    p.vy = Math.cos(phi) * v + (Math.random() - 0.5) * spread;
                    p.vz = Math.sin(phi) * Math.sin(theta) * v + (Math.random() - 0.5) * spread;

                    p.life = 1.0;
                    p.maxLife = 0.5 + Math.random() * 0.5;
                    p.color.copy(color);

                    spawned++;
                    if (spawned >= count) break;
                }
            }
        };

        const updatePhysics = () => {
            if (gameState !== GameState.PLAYING) return;

            const tiltX = boardTilt.current.x;
            const tiltZ = boardTilt.current.z;

            const col = Math.round((ballPosition.current.x + offsetX) / TILE_SIZE);
            const row = Math.round((ballPosition.current.z + offsetZ) / TILE_SIZE);
            const rows = LEVEL_1.length;
            const cols = LEVEL_1[0].length;

            let isOverVoid = false;
            if (row < 0 || row >= rows || col < 0 || col >= cols) {
                isOverVoid = true;
            } else if (LEVEL_1[row][col] === 4) {
                isOverVoid = true;
            }

            if (isOverVoid) {
                ballVelocity.current.y -= 0.05;
                ballPosition.current.y += ballVelocity.current.y;
                ballPosition.current.x += ballVelocity.current.x;
                ballPosition.current.z += ballVelocity.current.z;

                if (ballPosition.current.y < -10) {
                    onGameStateChange(GameState.GAME_OVER);
                }
            } else {
                ballPosition.current.y = 0;
                ballVelocity.current.y = 0;

                ballVelocity.current.x += tiltZ * GRAVITY_SCALE;
                ballVelocity.current.z += tiltX * GRAVITY_SCALE;

                ballVelocity.current.x *= FRICTION;
                ballVelocity.current.z *= FRICTION;

                ballVelocity.current.x = Math.max(Math.min(ballVelocity.current.x, MAX_VELOCITY), -MAX_VELOCITY);
                ballVelocity.current.z = Math.max(Math.min(ballVelocity.current.z, MAX_VELOCITY), -MAX_VELOCITY);

                let nextX = ballPosition.current.x + ballVelocity.current.x;
                let nextZ = ballPosition.current.z + ballVelocity.current.z;

                const checkCollision = (cx: number, cz: number): boolean => {
                    const ballSphere = new THREE.Sphere(new THREE.Vector3(cx, 0, cz), BALL_RADIUS);
                    for (const wallBox of walls) {
                        if (wallBox.intersectsSphere(ballSphere)) {
                            return true;
                        }
                    }
                    return false;
                };

                if (checkCollision(nextX, ballPosition.current.z)) {
                    // Collision X
                    const impactX = ballPosition.current.x + (ballVelocity.current.x > 0 ? BALL_RADIUS : -BALL_RADIUS);
                    spawnParticle(impactX, 0, ballPosition.current.z, new THREE.Color(0xff00ff), 15, 0.2, 0.1);

                    ballVelocity.current.x *= -0.5;
                    nextX = ballPosition.current.x;
                } else {
                    ballPosition.current.x = nextX;
                }

                if (checkCollision(ballPosition.current.x, nextZ)) {
                    // Collision Z
                    const impactZ = ballPosition.current.z + (ballVelocity.current.z > 0 ? BALL_RADIUS : -BALL_RADIUS);
                    spawnParticle(ballPosition.current.x, 0, impactZ, new THREE.Color(0xff00ff), 15, 0.2, 0.1);

                    ballVelocity.current.z *= -0.5;
                    nextZ = ballPosition.current.z;
                } else {
                    ballPosition.current.z = nextZ;
                }
            }

            // Update Mesh
            if (ballRef.current) {
                ballRef.current.position.set(ballPosition.current.x, ballPosition.current.y, ballPosition.current.z);
                ballRef.current.rotation.x -= ballVelocity.current.z * 0.2;
                ballRef.current.rotation.z += ballVelocity.current.x * 0.2;
            }

            // Check Win
            if (!isOverVoid) {
                const distToGoal = Math.sqrt(
                    Math.pow(ballPosition.current.x - goalPos.x, 2) + Math.pow(ballPosition.current.z - goalPos.z, 2)
                );

                if (distToGoal < 1.0) {
                    onGameStateChange(GameState.WON);
                }
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Board visuals
            if (boardGroupRef.current) {
                boardGroupRef.current.rotation.x +=
                    (boardTilt.current.x * 0.5 - boardGroupRef.current.rotation.x) * 0.1;
                boardGroupRef.current.rotation.z +=
                    (-boardTilt.current.z * 0.5 - boardGroupRef.current.rotation.z) * 0.1;
            }

            // Lighting & Parallax
            if (globalLightRef.current) {
                const pulse = Math.sin(time * 0.8) * 0.3;
                globalLightRef.current.intensity = 1.5 + pulse;

                const targetLightX = -boardTilt.current.z * 25;
                const targetLightZ = -boardTilt.current.x * 25;

                globalLightRef.current.position.x += (targetLightX - globalLightRef.current.position.x) * 0.05;
                globalLightRef.current.position.z += (targetLightZ - globalLightRef.current.position.z) * 0.05;
            }

            if (gridHelperRef.current) {
                const targetGridX = boardTilt.current.z * 8;
                const targetGridZ = -boardTilt.current.x * 8;

                gridHelperRef.current.position.x += (targetGridX - gridHelperRef.current.position.x) * 0.05;
                gridHelperRef.current.position.z += (targetGridZ - gridHelperRef.current.position.z) * 0.05;

                gridHelperRef.current.rotation.z = -boardTilt.current.z * 0.15;
                gridHelperRef.current.rotation.x = boardTilt.current.x * 0.15;
            }

            const pulseFast = Math.sin(time * 3);
            if (ballLightRef.current) {
                ballLightRef.current.intensity = 2 + pulseFast * 0.5;
                ballLightRef.current.distance = 12 + pulseFast * 2;
            }
            if (ballRef.current) {
                const mat = (ballRef.current as THREE.Mesh).material as THREE.MeshStandardMaterial;
                mat.emissiveIntensity = 0.6 + pulseFast * 0.2;
            }

            if (goalMatRef.current) {
                (goalMatRef.current as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 4) * 0.15;
            }

            // Update Particles
            if (particleGeometryRef.current) {
                const positions = particleGeometryRef.current.attributes.position.array as Float32Array;
                const colors = particleGeometryRef.current.attributes.color.array as Float32Array;
                let activeCount = 0;

                for (let i = 0; i < MAX_PARTICLES; i++) {
                    const p = particlesRef.current[i];
                    if (p.active) {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.z += p.vz;
                        p.life -= 0.02; // Decay

                        positions[i * 3] = p.x;
                        positions[i * 3 + 1] = p.y;
                        positions[i * 3 + 2] = p.z;

                        // Fade color based on life
                        const alpha = p.life / p.maxLife;
                        colors[i * 3] = p.color.r * alpha;
                        colors[i * 3 + 1] = p.color.g * alpha;
                        colors[i * 3 + 2] = p.color.b * alpha;

                        if (p.life <= 0) {
                            p.active = false;
                            // Hide
                            positions[i * 3] = 0;
                            positions[i * 3 + 1] = -1000;
                            positions[i * 3 + 2] = 0;
                        } else {
                            activeCount++;
                        }
                    } else {
                        positions[i * 3] = 0;
                        positions[i * 3 + 1] = -1000;
                        positions[i * 3 + 2] = 0;
                    }
                }
                particleGeometryRef.current.attributes.position.needsUpdate = true;
                particleGeometryRef.current.attributes.color.needsUpdate = true;
            }

            // Update Trail
            if (gameState === GameState.PLAYING && ballRef.current) {
                // Push new point
                const pos = ballRef.current.position.clone();
                pos.y += 0.05; // Slightly above floor
                trailPositions.current.push(pos);
                if (trailPositions.current.length > TRAIL_LENGTH) {
                    trailPositions.current.shift();
                }
            }

            if (trailMeshRef.current && trailPositions.current.length > 1) {
                const geo = trailMeshRef.current.geometry;
                const posAttr = geo.attributes.position as THREE.BufferAttribute;
                const alphaAttr = geo.attributes.alpha as THREE.BufferAttribute;
                const points = trailPositions.current;
                const count = points.length;

                for (let i = 0; i < count; i++) {
                    const p = points[i];
                    const nextP = i < count - 1 ? points[i + 1] : null;
                    const prevP = i > 0 ? points[i - 1] : null;

                    let dir = new THREE.Vector3(1, 0, 0);
                    if (nextP) {
                        dir.subVectors(nextP, p);
                    } else if (prevP) {
                        dir.subVectors(p, prevP);
                    }
                    dir.normalize();

                    // Perpendicular vector for ribbon width
                    const perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(TRAIL_WIDTH * 0.5);

                    const v1 = new THREE.Vector3().addVectors(p, perp);
                    const v2 = new THREE.Vector3().subVectors(p, perp);

                    const idx = i * 2;
                    posAttr.setXYZ(idx, v1.x, v1.y, v1.z);
                    posAttr.setXYZ(idx + 1, v2.x, v2.y, v2.z);

                    const alpha = i / (count - 1); // Fade out tail
                    alphaAttr.setX(idx, alpha);
                    alphaAttr.setX(idx + 1, alpha);
                }

                // Zero out unused
                for (let k = count * 2; k < TRAIL_LENGTH * 2; k++) {
                    posAttr.setXYZ(k, 0, 0, 0);
                    alphaAttr.setX(k, 0);
                }

                geo.setDrawRange(0, count * 2);
                posAttr.needsUpdate = true;
                alphaAttr.needsUpdate = true;
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
            // Cleanup geometry
            if (particleGeometryRef.current) particleGeometryRef.current.dispose();
            if (trailMeshRef.current) {
                trailMeshRef.current.geometry.dispose();
                (trailMeshRef.current.material as THREE.Material).dispose();
            }
        };
    }, [gameState, onGameStateChange]);

    // Sensor Logic
    useEffect(() => {
        const resetGame = () => {
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
            ballVelocity.current = { x: 0, y: 0, z: 0 };
            // Clear particles
            if (particlesRef.current) {
                particlesRef.current.forEach((p) => (p.active = false));
            }
            // Clear trail
            trailPositions.current = [];
        };

        if (gameState === GameState.PLAYING) {
            resetGame();
        }

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!hasPermission) return;
            let { beta, gamma } = event;
            if (beta === null || gamma === null) return;
            const maxTilt = 30;
            if (beta > 90) beta = 90;
            if (beta < -90) beta = -90;
            const x = Math.min(Math.max(beta / maxTilt, -1), 1);
            const z = Math.min(Math.max(gamma / maxTilt, -1), 1);
            boardTilt.current = { x: x, z: z };
        };

        const handleMotion = (event: DeviceMotionEvent) => {
            if (!hasPermission) return;
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;
            const totalAcc = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
            if (totalAcc > SHAKE_THRESHOLD) {
                const now = Date.now();
                if (now - lastShakeTime.current > 1000) {
                    lastShakeTime.current = now;
                    resetGame();
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (hasPermission) return;
            const x = (e.clientY / window.innerHeight) * 2 - 1;
            const z = (e.clientX / window.innerWidth) * 2 - 1;
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
