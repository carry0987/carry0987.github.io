export interface ImageAdjustment {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
}

export interface WatermarkSettings {
    text: string;
    fontSize: number; // This will now act as an offset/increment from base
    fontColor: string;
    opacity: number;
    angle: number;
    lineHeight: number;
    gutter: number; // Added for spacing control
    isRepeat: boolean;
    file: File | null;
    originalUrl: string | null;
    width: number;
    height: number;
}
