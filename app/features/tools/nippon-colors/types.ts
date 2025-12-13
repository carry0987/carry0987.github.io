export interface NipponColor {
    id: number;
    code: string;
    ja: string; // Japanese name (Kanji)
    en: string; // English/Romaji name
    hex: string; // Hex code
}

// Helper function to convert hex to RGB string
export const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 0, 0';
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
};

// Helper function to convert hex to CMYK string
export const hexToCmyk = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 0, 0, 100';

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const k = 1 - Math.max(r, g, b);
    if (k === 1) return '0, 0, 0, 100';

    const c = Math.round(((1 - r - k) / (1 - k)) * 100);
    const m = Math.round(((1 - g - k) / (1 - k)) * 100);
    const y = Math.round(((1 - b - k) / (1 - k)) * 100);
    const kPercent = Math.round(k * 100);

    return `${c}, ${m}, ${y}, ${kPercent}`;
};
