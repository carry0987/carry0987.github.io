import type { Object3DNode, MaterialNode } from '@react-three/fiber';
import type { ShaderMaterial } from 'three';
import type {
    TerrainMaterial,
    SphereBlobMaterial,
    PlasmaMaterial,
    ParticlesMaterial,
    FireballMaterial
} from './materials';

declare module '@react-three/fiber' {
    interface ThreeElements {
        terrainMaterial: MaterialNode<ShaderMaterial, typeof TerrainMaterial>;
        sphereBlobMaterial: MaterialNode<ShaderMaterial, typeof SphereBlobMaterial>;
        plasmaMaterial: MaterialNode<ShaderMaterial, typeof PlasmaMaterial>;
        particlesMaterial: MaterialNode<ShaderMaterial, typeof ParticlesMaterial>;
        fireballMaterial: MaterialNode<ShaderMaterial, typeof FireballMaterial>;
    }
}
