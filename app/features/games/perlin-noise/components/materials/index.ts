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

// Classic Perlin Noise GLSL (for Fireball effect)
const CLASSIC_PERLIN_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

float pnoise(vec3 P, vec3 rep) {
    vec3 Pi0 = mod(floor(P), rep);
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 1.5 * n_xyz;
}

float turbulence(vec3 p) {
    float t = -0.1;
    for (float f = 1.0; f <= 3.0; f++) {
        float power = pow(2.0, f);
        t += abs(pnoise(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);
    }
    return t;
}
`;

// Fireball Material
export const FireballMaterial = shaderMaterial(
    {
        uTime: 0,
        uPointScale: 1.0,
        uDecay: 0.1,
        uComplex: 0.3,
        uWaves: 20.0,
        uEqColor: 11.0,
        uFragment: true,
        uElectroflow: true
    },
    // Vertex Shader
    `
    ${CLASSIC_PERLIN_GLSL}
    
    varying float vQnoise;
    
    uniform float uTime;
    uniform float uPointScale;
    uniform float uDecay;
    uniform float uComplex;
    uniform float uWaves;
    uniform float uEqColor;
    uniform bool uFragment;

    void main() {
        float noise = (1.0 - uWaves) * turbulence(uDecay * abs(normal + uTime));
        vQnoise = (2.0 - uEqColor) * turbulence(uDecay * abs(normal + uTime));
        float b = pnoise(uComplex * position + vec3(1.0 * uTime), vec3(100.0));
        
        float displacement;
        if (uFragment) {
            displacement = -sin(noise) + normalize(b * 0.5);
        } else {
            displacement = -sin(noise) + cos(b * 0.5);
        }

        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        gl_PointSize = uPointScale;
    }
    `,
    // Fragment Shader
    `
    varying float vQnoise;
    uniform bool uElectroflow;

    void main() {
        float r, g, b;
        
        if (!uElectroflow) {
            r = cos(vQnoise + 0.5);
            g = cos(vQnoise - 0.5);
            b = 0.0;
        } else {
            r = cos(vQnoise + 0.5);
            g = cos(vQnoise - 0.5);
            b = abs(vQnoise);
        }
        gl_FragColor = vec4(r, g, b, 1.0);
    }
    `
);
