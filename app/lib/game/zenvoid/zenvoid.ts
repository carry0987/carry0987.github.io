import * as THREE from 'three';

// --- Constants ---
const STAR_COUNT = 6000;
const FLOATING_OBJECTS_COUNT = 30;
const TRASH_TALK_SPAWN_RATE = 0.008;
const SYSTEM_MESSAGE_INTERVAL = 5000;
const MAX_TEXT_SPRITES = 50; // Limit to prevent memory issues

// --- Theme Configuration ---
export interface Theme {
    name: string;
    bg: number;
    fog: number;
    main: number;
    sec: number;
    grid: number;
}

const themes: Theme[] = [
    { name: 'CYBERPUNK', bg: 0x050510, fog: 0x050510, main: 0x00ffff, sec: 0xff00ff, grid: 0x111133 },
    { name: 'MATRIX', bg: 0x000500, fog: 0x000500, main: 0x00ff00, sec: 0x008800, grid: 0x001100 },
    { name: 'VAPORWAVE', bg: 0x100010, fog: 0x100010, main: 0xff00aa, sec: 0x00ddee, grid: 0x220022 },
    { name: 'GOLDEN', bg: 0x050300, fog: 0x050300, main: 0xffaa00, sec: 0xffdd55, grid: 0x221100 },
    { name: 'ICE', bg: 0x000508, fog: 0x000508, main: 0xaaddff, sec: 0xffffff, grid: 0x001122 }
];

// --- Text Database ---
const trashTalks = [
    '我就廢',
    '薪水呢?',
    '不想努力了',
    '404 ERROR',
    '人生好難',
    '吃飽沒?',
    '週一症候群',
    '快逃啊',
    'SYSTEM FAIL',
    '腦袋過載',
    '我是誰我在哪',
    '歸剛欸',
    '躺平模式',
    '貓咪在哪',
    '錢包已空',
    '?????',
    'BUG DETECTED',
    '想回家了',
    '不要問',
    '心好累',
    '人類太可惡',
    '午餐吃啥',
    '好想睡覺',
    '這專案會爆',
    '可以下班了嗎',
    '意義不明'
];

const slapTexts = ['啪!', '醒醒!', '摸魚?', '還敢混啊', '吃我一拳', '振作點!', '看哪裡!', '是在哈囉'];

interface TextSprite extends THREE.Sprite {
    isSlap?: boolean;
}

/**
 * ZenVoid - A relaxing cyberpunk-themed 3D experience with slap mechanics
 *
 * Features:
 * - 5 different visual themes (CYBERPUNK, MATRIX, VAPORWAVE, GOLDEN, ICE)
 * - Floating geometric objects and text sprites
 * - Interactive camera controls (mouse movement, click for slap effect)
 * - Keyboard shortcuts (Space for speed boost, C for theme change)
 * - Memory-efficient sprite management with automatic cleanup
 */
export class ZenVoid {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private cameraHolder: THREE.Group;
    private renderer: THREE.WebGLRenderer;
    private starField: THREE.Points;
    private gridMesh: THREE.Mesh;
    private objects: THREE.Mesh[] = [];
    private textSprites: TextSprite[] = [];

    private currentThemeIdx = 0;
    private speed = 0.05;
    private targetSpeed = 0.05;
    private mouseX = 0;
    private mouseY = 0;
    private shakeIntensity = 0;

    private animationId: number | null = null;
    private systemMessageInterval: number | null = null;
    private logCallback?: (msg: string) => void;
    private themeCallback?: (name: string) => void;

    // Event listener references for cleanup
    private handleMouseMove!: (e: MouseEvent) => void;
    private handleMouseDown!: () => void;
    private handleKeyDown!: (e: KeyboardEvent) => void;
    private handleKeyUp!: (e: KeyboardEvent) => void;
    private handleResize!: () => void;

    constructor() {
        // --- 1. Initialize Scene ---
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.008);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        // Camera position will be relative to holder, so keep it at origin
        this.camera.position.set(0, 0, 0);

        // Camera holder for shake effect - set the actual view position here
        this.cameraHolder = new THREE.Group();
        this.cameraHolder.position.set(0, 2, 10);
        this.cameraHolder.add(this.camera);
        this.scene.add(this.cameraHolder);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // --- 2. Create Scene Objects ---
        this.starField = this.createStarField();
        this.gridMesh = this.createGrid();
        this.createFloatingObjects();

        // --- 3. Setup Event Listeners ---
        this.setupEventListeners();

        // --- 4. Apply Initial Theme ---
        this.applyTheme(0);

        // --- 5. Start System Messages ---
        this.startSystemMessages();
    }

    private createStarField(): THREE.Points {
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(STAR_COUNT * 3);

        for (let i = 0; i < STAR_COUNT * 3; i += 3) {
            starPos[i] = (Math.random() - 0.5) * 800;
            starPos[i + 1] = (Math.random() - 0.5) * 800;
            starPos[i + 2] = -Math.random() * 1000;
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true
        });
        const starField = new THREE.Points(starGeo, starMaterial);
        this.scene.add(starField);

        return starField;
    }

    private createGrid(): THREE.Mesh {
        const gridGeo = new THREE.PlaneGeometry(1000, 1000, 50, 50);
        const gridMat = new THREE.MeshBasicMaterial({
            color: 0x111133,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        gridMesh.rotation.x = -Math.PI / 2;
        gridMesh.position.y = -10;
        this.scene.add(gridMesh);

        return gridMesh;
    }

    private createFloatingObjects(): void {
        const geoms = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.TorusGeometry(3, 0.2, 8, 50),
            new THREE.BoxGeometry(1, 10, 1),
            new THREE.OctahedronGeometry(2)
        ];

        const glowingMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < FLOATING_OBJECTS_COUNT; i++) {
            const mesh = new THREE.Mesh(geoms[Math.floor(Math.random() * geoms.length)], glowingMat.clone());
            this.resetObject(mesh);
            this.scene.add(mesh);
            this.objects.push(mesh);
        }
    }

    private resetObject(mesh: THREE.Mesh): void {
        mesh.position.z = -500 - Math.random() * 200;
        mesh.position.x = (Math.random() - 0.5) * 150;
        mesh.position.y = (Math.random() - 0.5) * 80;
        const s = 1 + Math.random() * 5;
        mesh.scale.set(s, s, s);
        mesh.rotation.set(Math.random(), Math.random(), Math.random());
    }

    private createTextTexture(message: string, color: string, isBold: boolean): THREE.CanvasTexture {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 1536;
        canvas.height = 384;

        const fontWeight = isBold ? '900' : 'bold';
        ctx.font = `${fontWeight} 60px Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isBold ? 30 : 20;

        ctx.fillText(message, canvas.width / 2, canvas.height / 2);

        return new THREE.CanvasTexture(canvas);
    }

    private spawnTrashTalk(): void {
        const msg = trashTalks[Math.floor(Math.random() * trashTalks.length)];
        const theme = themes[this.currentThemeIdx];
        const colorStr = Math.random() > 0.3 ? new THREE.Color(theme.sec).getStyle() : '#ffffff';

        const texture = this.createTextTexture(msg, colorStr, false);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material) as TextSprite;

        sprite.scale.set(25, 6, 1);
        sprite.position.z = -300;
        sprite.position.x = (Math.random() - 0.5) * 50;
        sprite.position.y = (Math.random() - 0.5) * 20;
        sprite.isSlap = false;

        this.scene.add(sprite);
        this.textSprites.push(sprite);
    }

    private spawnSlapText(): void {
        const msg = slapTexts[Math.floor(Math.random() * slapTexts.length)];
        const theme = themes[this.currentThemeIdx];
        const colorStr = new THREE.Color(theme.main).getStyle();

        const texture = this.createTextTexture(msg, colorStr, true);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material) as TextSprite;

        sprite.scale.set(50, 12, 1);
        sprite.position.z = -20;
        sprite.position.x = 0;
        sprite.position.y = 0;
        sprite.isSlap = true;

        this.scene.add(sprite);
        this.textSprites.push(sprite);
    }

    private applyTheme(idx: number): void {
        const theme = themes[idx];
        this.scene.background = new THREE.Color(theme.bg);
        (this.scene.fog as THREE.FogExp2).color.setHex(theme.fog);

        this.objects.forEach((obj) => {
            (obj.material as THREE.MeshBasicMaterial).color.setHex(Math.random() > 0.5 ? theme.main : theme.sec);
        });

        (this.starField.material as THREE.PointsMaterial).color.setHex(theme.sec);
        (this.gridMesh.material as THREE.MeshBasicMaterial).color.setHex(theme.grid);

        if (this.themeCallback) {
            this.themeCallback(theme.name);
        }
    }

    private setupEventListeners(): void {
        this.handleMouseMove = (e: MouseEvent) => {
            this.mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
            this.mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
        };

        this.handleMouseDown = () => {
            this.spawnSlapText();
            this.shakeIntensity = 1.5;
            if (this.logCallback) {
                this.logCallback('ACTION: SLAP!');
            }
        };

        this.handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') this.targetSpeed = 0.8;
            if (e.code === 'KeyC') {
                this.currentThemeIdx = (this.currentThemeIdx + 1) % themes.length;
                this.applyTheme(this.currentThemeIdx);
                if (this.logCallback) {
                    this.logCallback(`THEME: ${themes[this.currentThemeIdx].name}`);
                }
            }
        };

        this.handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') this.targetSpeed = 0.05;
        };

        this.handleResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('resize', this.handleResize);
    }

    private removeEventListeners(): void {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('resize', this.handleResize);
    }

    private startSystemMessages(): void {
        this.systemMessageInterval = window.setInterval(() => {
            const sysMsgs = ['CPU: CHILLING', 'GPU: RELAXED', 'SPEED: SLOW', 'MOOD: LAZY'];
            if (Math.random() > 0.7 && this.logCallback) {
                this.logCallback(sysMsgs[Math.floor(Math.random() * sysMsgs.length)]);
            }
        }, SYSTEM_MESSAGE_INTERVAL);
    }

    private animate = (): void => {
        this.animationId = requestAnimationFrame(this.animate);

        this.speed += (this.targetSpeed - this.speed) * 0.05;

        // Camera holder smooth movement
        this.cameraHolder.position.x += (this.mouseX * 30 - this.cameraHolder.position.x) * 0.02;
        this.cameraHolder.position.y += (-this.mouseY * 15 + 2 - this.cameraHolder.position.y) * 0.02;
        this.cameraHolder.rotation.z = -this.mouseX * 0.15;
        this.cameraHolder.rotation.x = this.mouseY * 0.1;

        // Handle shake
        if (this.shakeIntensity > 0) {
            this.camera.position.x = (Math.random() - 0.5) * this.shakeIntensity;
            this.camera.position.y = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity -= 0.1;
        } else {
            // Reset to local position within holder (holder already has y=2, z=10)
            this.camera.position.set(0, 0, 0);
        }

        const moveScale = 5;

        // Update stars
        const positions = this.starField.geometry.attributes.position.array as Float32Array;
        for (let i = 2; i < positions.length; i += 3) {
            positions[i] += this.speed * moveScale;
            if (positions[i] > 10) positions[i] = -1000;
        }
        this.starField.geometry.attributes.position.needsUpdate = true;

        // Update grid
        this.gridMesh.position.z += this.speed * moveScale;
        if (this.gridMesh.position.z > 20) this.gridMesh.position.z = 0;

        // Update objects
        this.objects.forEach((obj) => {
            obj.position.z += this.speed * moveScale;
            obj.rotation.x += 0.005;
            obj.rotation.y += 0.005;
            if (obj.position.z > 10) this.resetObject(obj);
        });

        // Spawn trash talk
        if (Math.random() < TRASH_TALK_SPAWN_RATE && this.textSprites.length < MAX_TEXT_SPRITES) {
            this.spawnTrashTalk();
        }

        // Update text sprites
        for (let i = this.textSprites.length - 1; i >= 0; i--) {
            const sprite = this.textSprites[i];
            sprite.position.z += this.speed * moveScale;

            if (sprite.isSlap) {
                sprite.material.opacity -= 0.01;
                sprite.scale.x += 0.5;
                sprite.scale.y += 0.12;
            } else {
                if (sprite.position.z > -10) {
                    const distToCamera = 5 - sprite.position.z;
                    sprite.material.opacity = Math.max(0, distToCamera / 15);
                }
            }

            if (sprite.position.z > 10 || sprite.material.opacity <= 0) {
                // Properly dispose of sprite resources
                if (sprite.material.map) {
                    sprite.material.map.dispose();
                }
                sprite.material.dispose();
                this.scene.remove(sprite);
                this.textSprites.splice(i, 1);
            }
        }

        this.renderer.render(this.scene, this.camera);
    };

    public setLogCallback(callback: (msg: string) => void): void {
        this.logCallback = callback;
    }

    public setThemeCallback(callback: (name: string) => void): void {
        this.themeCallback = callback;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.renderer.domElement;
    }

    public getCurrentTheme(): Theme {
        return themes[this.currentThemeIdx];
    }

    public getThemeList(): readonly Theme[] {
        return themes;
    }

    public start(): void {
        if (!this.animationId) {
            this.animate();
        }
    }

    public stop(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    public dispose(): void {
        this.stop();

        // Clear system message interval
        if (this.systemMessageInterval !== null) {
            clearInterval(this.systemMessageInterval);
            this.systemMessageInterval = null;
        }

        // Remove event listeners
        this.removeEventListeners();

        // Cleanup geometries and materials
        this.objects.forEach((obj) => {
            obj.geometry.dispose();
            (obj.material as THREE.Material).dispose();
        });

        // Cleanup text sprites and their textures
        this.textSprites.forEach((sprite) => {
            if (sprite.material.map) {
                sprite.material.map.dispose();
            }
            sprite.material.dispose();
            this.scene.remove(sprite);
        });
        this.textSprites = [];

        this.starField.geometry.dispose();
        (this.starField.material as THREE.Material).dispose();

        this.gridMesh.geometry.dispose();
        (this.gridMesh.material as THREE.Material).dispose();

        this.renderer.dispose();
    }
}
