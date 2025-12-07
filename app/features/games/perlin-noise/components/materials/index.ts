import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { NOISE_GLSL } from '../../constants';

// Terrain Material
export const TerrainMaterial = shaderMaterial(
    {
        uTime: 0,
        uSpeed: 0.2,
        uNoiseScale: 0.8,
        uDisplacement: 1.5,
        uColorA: new THREE.Color('#0d1b2a'),
        uColorB: new THREE.Color('#00ffcc')
    },
    // Vertex Shader
    `
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
        float noiseVal = snoise(vec3(pos.x * uNoiseScale, pos.y * uNoiseScale, uTime * uSpeed));
        vElevation = noiseVal;
        pos.z += noiseVal * uDisplacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
        float mixStrength = (vElevation + 1.0) * 0.5;
        vec3 color = mix(uColorA, uColorB, mixStrength);
        gl_FragColor = vec4(color, 1.0);
    }
    `
);

// Sphere Blob Material
export const SphereBlobMaterial = shaderMaterial(
    {
        uTime: 0,
        uSpeed: 0.5,
        uNoiseScale: 1.5,
        uDisplacement: 0.8,
        uColorA: new THREE.Color('#ff0055'),
        uColorB: new THREE.Color('#220033')
    },
    // Vertex Shader
    `
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
    // Fragment Shader
    `
    varying float vNoise;
    varying vec3 vNormal;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
        float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
        float mixStrength = (vNoise + 1.0) * 0.5;
        vec3 baseColor = mix(uColorA, uColorB, mixStrength);
        vec3 finalColor = mix(baseColor, vec3(1.0), pow(1.0 - abs(intensity), 3.0) * 0.5);
        gl_FragColor = vec4(finalColor, 1.0);
    }
    `
);

// Plasma Material
export const PlasmaMaterial = shaderMaterial(
    {
        uTime: 0,
        uSpeed: 0.3,
        uNoiseScale: 1.0,
        uColorA: new THREE.Color('#1a0b2e'),
        uColorB: new THREE.Color('#ff00ff')
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
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
        
        float rings = sin(combined * 10.0 + uTime);
        vec3 color = mix(uColorA, uColorB, rings * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0);
    }
    `
);

// Particles Material
export const ParticlesMaterial = shaderMaterial(
    {
        uTime: 0,
        uSpeed: 0.1,
        uNoiseScale: 0.5,
        uDisplacement: 2.0,
        uColorA: new THREE.Color('#ffffff'),
        uColorB: new THREE.Color('#4444ff')
    },
    // Vertex Shader
    `
    varying float vNoise;
    attribute float aRandom;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${NOISE_GLSL}

    void main() {
        vec3 pos = position;
        float n1 = snoise(vec3(pos * uNoiseScale + uTime * uSpeed * 0.2));
        float n2 = snoise(vec3(pos * uNoiseScale + 100.0 + uTime * uSpeed * 0.2));
        float n3 = snoise(vec3(pos * uNoiseScale + 200.0 + uTime * uSpeed * 0.2));
        
        pos += vec3(n1, n2, n3) * uDisplacement * aRandom;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (48.0 / -mvPosition.z);
        vNoise = n1;
    }
    `,
    // Fragment Shader
    `
    varying float vNoise;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        
        vec3 color = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0 - dist * 2.0);
    }
    `
);
