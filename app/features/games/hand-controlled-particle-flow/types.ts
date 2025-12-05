export enum ShapeType {
    NEBULA = 'NEBULA',
    HEART = 'HEART',
    SPHERE = 'SPHERE',
    RING = 'RING'
}

export interface HandData {
    isOpen: boolean; // True if hand is open (explode), False if closed (attract)
    position: { x: number; y: number; z: number }; // Normalized -1 to 1
    pinchStrength: number; // 0 to 1
    isPresent: boolean;
}

export interface ParticleConfig {
    count: number;
    size: number;
    shape: ShapeType;
    color: string;
}

export const THEME_COLORS = {
    primary: '#00f2ff',
    secondary: '#ff0055',
    glass: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)'
};
