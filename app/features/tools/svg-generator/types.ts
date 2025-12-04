export enum GenerationStatus {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface GeneratedSvg {
    id: string;
    content: string;
    prompt: string;
    timestamp: number;
}

export interface ApiError {
    message: string;
    details?: string;
}
