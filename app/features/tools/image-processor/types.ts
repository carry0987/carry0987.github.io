export interface ImageAdjustment {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
}

export interface WatermarkSettings {
    text: string;
    fontSize: number;
    fontColor: string;
    opacity: number;
    angle: number;
    lineHeight: number;
    isRepeat: boolean;
    file: File | null;
    originalUrl: string | null;
    width: number;
    height: number;
}
