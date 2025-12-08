export enum EffectType {
    FIREBALL = 'FIREBALL',
    TERRAIN = 'TERRAIN',
    SPHERE_BLOB = 'SPHERE_BLOB',
    PARTICLES = 'PARTICLES'
}

export interface EffectParams {
    colorA: string;
    colorB: string;
    wireframe: boolean;
}

// Main parameters (used by all effects)
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
