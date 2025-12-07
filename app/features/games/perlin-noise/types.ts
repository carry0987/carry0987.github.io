export enum EffectType {
    TERRAIN = 'TERRAIN',
    SPHERE_BLOB = 'SPHERE_BLOB',
    PARTICLES = 'PARTICLES',
    PLASMA = 'PLASMA',
    FIREBALL = 'FIREBALL'
}

export interface EffectParams {
    speed: number;
    noiseScale: number;
    displacement: number;
    colorA: string;
    colorB: string;
    wireframe: boolean;
}

// Fireball-specific parameters
export interface FireballParams {
    velocity: number; // Rotation velocity
    speed: number; // Animation speed
    pointScale: number; // Point size
    decay: number; // Noise decay
    complex: number; // Complexity
    waves: number; // Wave intensity
    hue: number; // Color hue (eqcolor)
    fragment: boolean; // Fragment mode
    electroflow: boolean; // Electroflow color mode
    sinVel: number; // Sine velocity for rotation
    ampVel: number; // Amplitude for rotation
}

export interface SceneProps {
    effectType: EffectType;
    params: EffectParams;
}
