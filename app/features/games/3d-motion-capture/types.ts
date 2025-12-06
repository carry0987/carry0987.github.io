// Data structure for a single landmark (x, y, z, visibility)
export interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

// MediaPipe Pose results structure
export interface PoseResults {
    poseLandmarks: Landmark[];
    faceLandmarks?: Landmark[]; // In full Holistic, but Pose provides 33 landmarks including face
}

// Added GameChallenge interface for Gemini generated challenges
export interface GameChallenge {
    title: string;
    description: string;
    difficulty: string;
}

// Added GameScore interface for Gemini scoring
export interface GameScore {
    score: number;
    comment: string;
}

// Avatar configuration
export interface AvatarConfig {
    smoothing: number; // 0.1 - 0.9
    scale: number; // 0.5 - 2.0
    boneThickness: number; // 0.03 - 0.12
    jointSize: number; // 0.05 - 0.15
    colorScheme: AvatarColorScheme;
}

// Color scheme options
export enum AvatarColorScheme {
    CYAN = 'cyan',
    NEON = 'neon',
    SUNSET = 'sunset',
    MATRIX = 'matrix'
}

// Theme colors for each scheme
export const AVATAR_COLORS: Record<AvatarColorScheme, { bone: string; emissive: string; joint: string }> = {
    [AvatarColorScheme.CYAN]: { bone: '#00e5ff', emissive: '#0044aa', joint: '#ffffff' },
    [AvatarColorScheme.NEON]: { bone: '#ff00ff', emissive: '#aa0066', joint: '#00ffff' },
    [AvatarColorScheme.SUNSET]: { bone: '#ff6b35', emissive: '#cc3300', joint: '#ffd93d' },
    [AvatarColorScheme.MATRIX]: { bone: '#00ff41', emissive: '#008f11', joint: '#39ff14' }
};
