export interface ElementData {
    number: number;
    symbol: string;
    name: string;
    atomic_mass: number;
    category: string;
    cpk_hex: string | null;
    xpos: number;
    ypos: number;
    summary: string;
    phase: string;
    discovered_by: string | null;
    crystal_structure?: 'BCC' | 'FCC' | 'HCP' | 'Diamond' | 'SimpleCubic';
    reaction_type?: 'Combustion' | 'Oxidation' | 'Inert';
}

export enum LayoutMode {
    TABLE = 'Table',
    SPHERE = 'Sphere',
    HELIX = 'Helix',
    GRID = 'Grid'
}

export enum ElementViewMode {
    ATOMIC = 'Atomic',
    CRYSTAL = 'Crystal',
    REACTION = 'Reaction'
}

export enum PerformanceLevel {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface Vector3D {
    x: number;
    y: number;
    z: number;
}
