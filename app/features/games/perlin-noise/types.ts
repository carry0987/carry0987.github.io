export enum EffectType {
    TERRAIN = 'TERRAIN',
    SPHERE_BLOB = 'SPHERE_BLOB',
    PARTICLES = 'PARTICLES',
    PLASMA = 'PLASMA'
}

export interface EffectParams {
    speed: number;
    noiseScale: number;
    displacement: number;
    colorA: string;
    colorB: string;
    wireframe: boolean;
}

export interface SceneProps {
    effectType: EffectType;
    params: EffectParams;
}
