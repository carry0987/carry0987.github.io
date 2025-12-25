import React, { useState, useMemo, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ELEMENTS } from './constants';
import { type ElementData, LayoutMode, type Vector3D, ElementViewMode, PerformanceLevel } from './types';
import ElementCard from './components/ElementCard';
import DetailsPanel from './components/DetailsPanel';
import AtomModel from './components/AtomModel';
import CrystalModel from './components/CrystalModel';
import ReactionModel from './components/ReactionModel';
import CameraFocus from './components/CameraFocus';
import {
    LayoutGrid,
    Table as TableIcon,
    CircleDot,
    Database,
    Search,
    ArrowLeft,
    Atom,
    Box,
    Flame,
    Cpu,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info
} from 'lucide-react';

// Import styles
import './style.css';

const PANEL_STORAGE_KEY = 'elemental3d_panel_open';

const App: React.FC = () => {
    const [layout, setLayout] = useState<LayoutMode>(LayoutMode.TABLE);
    const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

    // Use native localStorage to ensure 100% stability
    const [isPanelOpen, setIsPanelOpen] = useState(() => {
        try {
            const saved = localStorage.getItem(PANEL_STORAGE_KEY);
            return saved === null ? true : saved === 'true';
        } catch (e) {
            return true;
        }
    });

    const [viewMode, setViewMode] = useState<ElementViewMode>(ElementViewMode.ATOMIC);
    const [performance, setPerformance] = useState<PerformanceLevel>(PerformanceLevel.MEDIUM);
    const [searchQuery, setSearchQuery] = useState('');
    const orbitRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);

    const matchedNumbers = useMemo(() => {
        if (!searchQuery) return new Set(ELEMENTS.map((e) => e.number));
        const query = searchQuery.toLowerCase();
        return new Set(
            ELEMENTS.filter(
                (el) =>
                    el.name.toLowerCase().includes(query) ||
                    el.symbol.toLowerCase().includes(query) ||
                    el.number.toString().includes(query)
            ).map((e) => e.number)
        );
    }, [searchQuery]);

    const positions = useMemo(() => {
        const map = new Map<number, Vector3D>();
        ELEMENTS.forEach((el, i) => {
            let x = 0,
                y = 0,
                z = 0;
            switch (layout) {
                case LayoutMode.TABLE:
                    x = (el.xpos - 9.5) * 2.0;
                    y = (5 - el.ypos) * 2.5;
                    z = 0;
                    break;
                case LayoutMode.GRID:
                    const cols = 15;
                    x = ((i % cols) - cols / 2) * 2.2;
                    y = (Math.floor(i / cols) - 4) * -2.8;
                    z = 0;
                    break;
                case LayoutMode.SPHERE:
                    const phi = Math.acos(-1 + (2 * i) / ELEMENTS.length);
                    const theta = Math.sqrt(ELEMENTS.length * Math.PI) * phi;
                    const radius = 22;
                    x = radius * Math.cos(theta) * Math.sin(phi);
                    y = radius * Math.sin(theta) * Math.sin(phi);
                    z = radius * Math.cos(phi);
                    break;
                case LayoutMode.HELIX:
                    const angle = i * 0.18 + Math.PI;
                    const height = (i - ELEMENTS.length / 2) * 0.45;
                    x = Math.cos(angle) * 18;
                    z = Math.sin(angle) * 18;
                    y = height;
                    break;
            }
            map.set(el.number, { x, y, z });
        });
        return map;
    }, [layout]);

    const togglePanel = (open: boolean) => {
        setIsPanelOpen(open);
        try {
            localStorage.setItem(PANEL_STORAGE_KEY, open ? 'true' : 'false');
        } catch (e) {}
    };

    const handleSelect = (el: ElementData | null) => {
        setSelectedElement(el);
        if (el) {
            setViewMode(ElementViewMode.ATOMIC);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedElement) return;
        const currentIndex = ELEMENTS.findIndex((e) => e.number === selectedElement.number);
        const nextIndex = (currentIndex - 1 + ELEMENTS.length) % ELEMENTS.length;
        handleSelect(ELEMENTS[nextIndex]);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedElement) return;
        const currentIndex = ELEMENTS.findIndex((e) => e.number === selectedElement.number);
        const nextIndex = (currentIndex + 1) % ELEMENTS.length;
        handleSelect(ELEMENTS[nextIndex]);
    };

    const starConfig = useMemo(() => {
        switch (performance) {
            case PerformanceLevel.LOW:
                return { count: 3000, factor: 4 };
            case PerformanceLevel.HIGH:
                return { count: 20000, factor: 8 };
            default:
                return { count: 12000, factor: 7 };
        }
    }, [performance]);

    return (
        <div className="relative w-full h-screen bg-dark-bg overflow-hidden text-white">
            {/* Top UI */}
            <div className="absolute top-0 left-0 w-full z-40 p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">
                <div className="pointer-events-auto flex flex-col md:flex-row items-center gap-4">
                    {selectedElement ? (
                        <button
                            onClick={() => handleSelect(null)}
                            className="flex items-center gap-2 text-white bg-blue-600/90 hover:bg-blue-500 backdrop-blur-md px-6 py-3 rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold tracking-wide text-sm">Back to Elements</span>
                        </button>
                    ) : (
                        <div className="bg-slate-900/40 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xs shadow-lg font-mono">
                                        P
                                    </div>
                                    ELEMENTAL<span className="text-blue-500">3D</span>
                                </h1>
                                <p className="text-[10px] text-blue-400/80 uppercase tracking-[0.3em] mt-1 font-bold">
                                    Interactive 3D Element Explorer
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pointer-events-auto flex gap-2">
                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-slate-800 transition-colors">
                            <Cpu className="w-4 h-4 text-blue-400" />
                            <span>Performance: {performance}</span>
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </MenuButton>
                        <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl focus:outline-none z-50">
                            {[PerformanceLevel.LOW, PerformanceLevel.MEDIUM, PerformanceLevel.HIGH].map((level) => (
                                <MenuItem key={level}>
                                    {({ focus }) => (
                                        <button
                                            onClick={() => setPerformance(level)}
                                            className={`${
                                                focus || performance === level
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-400'
                                            } group flex w-full items-center rounded-xl px-3 py-2 text-xs font-bold transition-colors mb-1 last:mb-0`}>
                                            {level}
                                        </button>
                                    )}
                                </MenuItem>
                            ))}
                        </MenuItems>
                    </Menu>
                </div>

                {!selectedElement && (
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2.5 rounded-full pointer-events-auto shadow-2xl transition-all hover:border-blue-500/30">
                        <div className="relative group px-2">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search elements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-950/80 border border-slate-700/50 rounded-full py-2.5 pl-11 pr-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-48 md:w-64 transition-all"
                            />
                        </div>
                        <div className="h-8 w-px bg-white/10 mx-1" />
                        <div className="flex gap-1">
                            {[
                                { id: LayoutMode.TABLE, icon: TableIcon, label: 'Table' },
                                { id: LayoutMode.GRID, icon: LayoutGrid, label: 'Grid' },
                                { id: LayoutMode.SPHERE, icon: CircleDot, label: 'Sphere' },
                                { id: LayoutMode.HELIX, icon: Database, label: 'Helix' }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setLayout(mode.id)}
                                    className={`p-2 rounded-full transition-all flex items-center gap-2 px-3 ${
                                        layout === mode.id
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}>
                                    <mode.icon className="w-4 h-4" />
                                    <span className="text-[10px] font-bold hidden xl:block">{mode.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Arrows */}
            {selectedElement && (
                <>
                    <button
                        onClick={handlePrev}
                        className="fixed left-8 top-1/2 -translate-y-1/2 z-40 p-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full transition-all active:scale-90 group shadow-2xl">
                        <ChevronLeft className="w-12 h-12 text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                    </button>

                    <button
                        onClick={handleNext}
                        className={`fixed ${isPanelOpen ? 'right-110' : 'right-8'} top-1/2 -translate-y-1/2 z-40 p-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full active:scale-90 group hidden md:block shadow-2xl transition-all duration-300`}>
                        <ChevronRight className="w-12 h-12 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="fixed right-8 top-1/2 -translate-y-1/2 z-40 p-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full transition-all active:scale-90 group md:hidden shadow-2xl">
                        <ChevronRight className="w-12 h-12 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                </>
            )}

            {/* View Mode Switcher */}
            {selectedElement && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-4 rounded-4xl shadow-2xl">
                    {[
                        { id: ElementViewMode.ATOMIC, icon: Atom, label: 'Atomic', available: true },
                        {
                            id: ElementViewMode.CRYSTAL,
                            icon: Box,
                            label: 'Crystal',
                            available: !!selectedElement.crystal_structure
                        },
                        {
                            id: ElementViewMode.REACTION,
                            icon: Flame,
                            label: 'Reactivity',
                            available: !!selectedElement.reaction_type
                        }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            disabled={!mode.available}
                            onClick={() => setViewMode(mode.id)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all duration-300 ${
                                viewMode === mode.id
                                    ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] scale-105'
                                    : !mode.available
                                      ? 'opacity-20 cursor-not-allowed'
                                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}>
                            <mode.icon className="w-5 h-5" />
                            <span className="font-bold text-sm hidden sm:block">{mode.label}</span>
                        </button>
                    ))}

                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button
                        onClick={() => togglePanel(!isPanelOpen)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all duration-300 ${
                            isPanelOpen
                                ? 'bg-white/10 text-white'
                                : 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                        }`}>
                        <Info className="w-5 h-5" />
                        <span className="font-bold text-sm hidden sm:block">Info</span>
                    </button>
                </div>
            )}

            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 60]} fov={40} />
                <OrbitControls
                    ref={orbitRef}
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={5}
                    maxDistance={250}
                    enablePan={false}
                />
                <ambientLight intensity={0.5} />
                <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[20, 20, 20]} intensity={1.5} color="#3b82f6" />
                <Stars
                    radius={250}
                    depth={60}
                    count={starConfig.count}
                    factor={starConfig.factor}
                    saturation={0.5}
                    fade
                    speed={2}
                />

                <Suspense fallback={null}>
                    <CameraFocus orbitRef={orbitRef} isSelected={!!selectedElement} />

                    {!selectedElement && (
                        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                            {ELEMENTS.map((el) => {
                                const pos = positions.get(el.number);
                                if (!pos) return null;
                                return (
                                    <ElementCard
                                        key={el.number}
                                        element={el}
                                        position={pos}
                                        isSelected={false}
                                        isMatched={matchedNumbers.has(el.number)}
                                        onSelect={handleSelect}
                                    />
                                );
                            })}
                        </Float>
                    )}

                    {selectedElement && (
                        <group position={[0, 0, 0]}>
                            {viewMode === ElementViewMode.ATOMIC && (
                                <AtomModel element={selectedElement} performance={performance} />
                            )}
                            {viewMode === ElementViewMode.CRYSTAL && <CrystalModel element={selectedElement} />}
                            {viewMode === ElementViewMode.REACTION && (
                                <ReactionModel element={selectedElement} performance={performance} />
                            )}
                        </group>
                    )}
                </Suspense>
            </Canvas>

            <DetailsPanel element={selectedElement} isOpen={isPanelOpen} onClose={() => togglePanel(false)} />
        </div>
    );
};

// Mark this route as fullscreen (no navbar, footer, background)
export const handle = { fullscreen: true };

export function meta() {
    return [
        { title: 'Nippon Colors | 日本の伝統色' },
        {
            property: 'og:title',
            content: 'Nippon Colors | 日本の伝統色'
        },
        {
            name: 'description',
            content: 'Browse traditional Japanese colors (日本の伝統色), search by name, and copy HEX/RGB/CMYK values.'
        }
    ];
}

export default App;
