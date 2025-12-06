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
