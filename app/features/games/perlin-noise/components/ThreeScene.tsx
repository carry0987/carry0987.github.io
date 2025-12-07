import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectType, type EffectParams } from '../types';
import { NOISE_GLSL } from '../constants';

interface ThreeSceneProps {
    effectType: EffectType;
    params: EffectParams;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ effectType, params }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const pointsRef = useRef<THREE.Points | null>(null);
    const frameIdRef = useRef<number>(0);
    const uniformsRef = useRef<any>(null);

    // Initialize Scene
    useEffect(() => {
        if (!containerRef.current) return;

        // Setup basic Three.js components
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);

        // Add some fog for depth
        scene.fog = new THREE.FogExp2(0x050505, 0.02);

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        containerRef.current.innerHTML = ''; // Clear existing canvas if any
        containerRef.current.appendChild(renderer.domElement);

        // Setup OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controlsRef.current = controls;

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (rendererRef.current && containerRef.current) {
                // Safe check before removal
                if (containerRef.current.contains(rendererRef.current.domElement)) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current.dispose();
            }
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
            cancelAnimationFrame(frameIdRef.current);
        };
    }, []);

    // Handle Effect Switching
    useEffect(() => {
        if (!sceneRef.current) return;

        const scene = sceneRef.current;

        // Cleanup old meshes
        if (meshRef.current) {
            scene.remove(meshRef.current);
            meshRef.current.geometry.dispose();
            if (Array.isArray(meshRef.current.material)) {
                meshRef.current.material.forEach((m) => m.dispose());
            } else {
                (meshRef.current.material as THREE.Material).dispose();
            }
            meshRef.current = null;
        }
        if (pointsRef.current) {
            scene.remove(pointsRef.current);
            pointsRef.current.geometry.dispose();
            (pointsRef.current.material as THREE.Material).dispose();
            pointsRef.current = null;
        }

        // Shared Uniforms
        const uniforms = {
            uTime: { value: 0 },
            uSpeed: { value: params.speed },
            uNoiseScale: { value: params.noiseScale },
            uDisplacement: { value: params.displacement },
            uColorA: { value: new THREE.Color(params.colorA) },
            uColorB: { value: new THREE.Color(params.colorB) }
        };
        uniformsRef.current = uniforms;

        if (effectType === EffectType.TERRAIN) {
            const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
            geometry.rotateX(-Math.PI / 2);

            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          uniform float uSpeed;
          uniform float uNoiseScale;
          uniform float uDisplacement;
          
          ${NOISE_GLSL}

          void main() {
            vUv = uv;
            vec3 pos = position;
            float noiseVal = snoise(vec3(pos.x * uNoiseScale, pos.z * uNoiseScale, uTime * uSpeed));
            vElevation = noiseVal;
            pos.y += noiseVal * uDisplacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
                fragmentShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            float mixStrength = (vElevation + 1.0) * 0.5;
            vec3 color = mix(uColorA, uColorB, mixStrength);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
                wireframe: params.wireframe,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            meshRef.current = mesh;
            if (cameraRef.current) {
                cameraRef.current.position.set(0, 3, 4);
                cameraRef.current.lookAt(0, 0, 0);
            }
        } else if (effectType === EffectType.SPHERE_BLOB) {
            const geometry = new THREE.IcosahedronGeometry(2, 64);
            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: `
          varying vec2 vUv;
          varying float vNoise;
          varying vec3 vNormal;
          uniform float uTime;
          uniform float uSpeed;
          uniform float uNoiseScale;
          uniform float uDisplacement;
          
          ${NOISE_GLSL}

          void main() {
            vUv = uv;
            vNormal = normal;
            vec3 pos = position;
            float noiseVal = snoise(vec3(pos * uNoiseScale + uTime * uSpeed));
            vNoise = noiseVal;
            pos += normal * noiseVal * uDisplacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
                fragmentShader: `
          varying float vNoise;
          varying vec3 vNormal;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
            float mixStrength = (vNoise + 1.0) * 0.5;
            vec3 baseColor = mix(uColorA, uColorB, mixStrength);
            // Add some rim lighting effect
            vec3 finalColor = mix(baseColor, vec3(1.0), pow(1.0 - abs(intensity), 3.0) * 0.5);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
                wireframe: params.wireframe
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            meshRef.current = mesh;
            if (cameraRef.current) {
                cameraRef.current.position.set(0, 0, 6);
                cameraRef.current.lookAt(0, 0, 0);
            }
        } else if (effectType === EffectType.PLASMA) {
            // Plasma Plane effect
            const geometry = new THREE.PlaneGeometry(8, 8, 32, 32);
            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: `
           varying vec2 vUv;
           void main() {
             vUv = uv;
             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
           }
         `,
                fragmentShader: `
           varying vec2 vUv;
           uniform float uTime;
           uniform float uSpeed;
           uniform float uNoiseScale;
           uniform vec3 uColorA;
           uniform vec3 uColorB;
           
           ${NOISE_GLSL}

           void main() {
             float noise1 = snoise(vec3(vUv * uNoiseScale * 2.0, uTime * uSpeed));
             float noise2 = snoise(vec3(vUv * uNoiseScale * 5.0 + vec2(10.0), uTime * uSpeed * 0.5));
             float combined = (noise1 + noise2) * 0.5;
             
             // Create plasma rings
             float rings = sin(combined * 10.0 + uTime);
             vec3 color = mix(uColorA, uColorB, rings * 0.5 + 0.5);
             gl_FragColor = vec4(color, 1.0);
           }
         `,
                side: THREE.DoubleSide,
                wireframe: params.wireframe
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            meshRef.current = mesh;
            if (cameraRef.current) {
                cameraRef.current.position.set(0, 0, 5);
                cameraRef.current.lookAt(0, 0, 0);
            }
        } else if (effectType === EffectType.PARTICLES) {
            const particleCount = 20000;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const randoms = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const r = 3.5 + (Math.random() - 0.5) * 0.5;

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);

                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
                randoms[i] = Math.random();
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: `
          varying float vNoise;
          attribute float aRandom;
          uniform float uTime;
          uniform float uSpeed;
          uniform float uNoiseScale;
          uniform float uDisplacement;
          
          ${NOISE_GLSL}

          void main() {
            vec3 pos = position;
            // Curl-ish noise movement
            float n1 = snoise(vec3(pos * uNoiseScale + uTime * uSpeed * 0.2));
            float n2 = snoise(vec3(pos * uNoiseScale + 100.0 + uTime * uSpeed * 0.2));
            float n3 = snoise(vec3(pos * uNoiseScale + 200.0 + uTime * uSpeed * 0.2));
            
            pos += vec3(n1, n2, n3) * uDisplacement * aRandom;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (4.0 / -mvPosition.z);
            vNoise = n1;
          }
        `,
                fragmentShader: `
          varying float vNoise;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            vec3 color = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);
            gl_FragColor = vec4(color, 1.0 - dist * 2.0);
          }
        `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const points = new THREE.Points(geometry, material);
            scene.add(points);
            pointsRef.current = points;
            if (cameraRef.current) {
                cameraRef.current.position.set(0, 0, 8);
                cameraRef.current.lookAt(0, 0, 0);
            }
        }

        // Reset controls target when effect changes to ensure user is looking at the center
        if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    }, [effectType]);

    // Animation Loop
    useEffect(() => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);

            if (controlsRef.current) {
                controlsRef.current.update();
            }

            if (uniformsRef.current) {
                uniformsRef.current.uTime.value += 0.01;
                uniformsRef.current.uSpeed.value = params.speed;
                uniformsRef.current.uNoiseScale.value = params.noiseScale;
                uniformsRef.current.uDisplacement.value = params.displacement;
                uniformsRef.current.uColorA.value.set(params.colorA);
                uniformsRef.current.uColorB.value.set(params.colorB);
            }

            const activeObject = meshRef.current || pointsRef.current;
            if (activeObject) {
                // Slow auto-rotation, but allow user override effectively via orbit controls
                activeObject.rotation.y += 0.002;
            }

            rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
        };

        animate();

        return () => {
            cancelAnimationFrame(frameIdRef.current);
        };
    }, [params]);

    return <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default ThreeScene;
