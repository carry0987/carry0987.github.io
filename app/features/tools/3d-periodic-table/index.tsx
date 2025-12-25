import React, { useState, useMemo, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ELEMENTS } from './constants';
import { type ElementData, LayoutMode, type Vector3D, ElementViewMode, PerformanceLevel } from './types';
import { saveManager } from './utils/saveManager';
import { usePageVisibility, useIsMobile } from '@/hooks';
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

const PerformanceMenu: React.FC<{
    performance: PerformanceLevel;
    onPerformanceChange: (level: PerformanceLevel) => void;
    isMobile: boolean;
}> = ({ performance, onPerformanceChange, isMobile }) => (
    <Menu as="div" className="relative">
        <MenuButton className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold hover:bg-slate-800 transition-colors">
            <Cpu className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
            <span>{isMobile ? performance : `Performance: ${performance}`}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
        </MenuButton>
        <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl focus:outline-none z-50">
            {[PerformanceLevel.LOW, PerformanceLevel.MEDIUM, PerformanceLevel.HIGH].map((level) => (
                <MenuItem key={level}>
                    {({ focus }) => (
                        <button
                            onClick={() => onPerformanceChange(level)}
                            className={`${
                                focus || performance === level ? 'bg-blue-600 text-white' : 'text-slate-400'
                            } group flex w-full items-center rounded-xl px-3 py-2 text-xs font-bold transition-colors mb-1 last:mb-0`}>
                            {level}
                        </button>
                    )}
                </MenuItem>
            ))}
        </MenuItems>
    </Menu>
);

const App: React.FC = () => {
    const savedSettings = useMemo(() => saveManager.getSettings(), []);
    const [layout, setLayout] = useState<LayoutMode>(savedSettings.layout);
    const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

    const [isPanelOpen, setIsPanelOpen] = useState(savedSettings.isPanelOpen);

    const [viewMode, setViewMode] = useState<ElementViewMode>(ElementViewMode.ATOMIC);
    const [performance, setPerformance] = useState<PerformanceLevel>(savedSettings.performance);
    const [searchQuery, setSearchQuery] = useState('');
    const { isVisible } = usePageVisibility();
    const isMobile = useIsMobile();
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
        saveManager.save({ isPanelOpen: open });
    };

    const handleLayoutChange = (mode: LayoutMode) => {
        setLayout(mode);
        saveManager.save({ layout: mode });
    };

    const handlePerformanceChange = (level: PerformanceLevel) => {
        setPerformance(level);
        saveManager.save({ performance: level });
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
            <div className="absolute top-0 left-0 w-full z-40 p-3 md:p-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 pointer-events-none">
                <div className="pointer-events-auto flex items-center justify-between w-full md:w-auto gap-4">
                    <div className="flex items-center gap-4">
                        {selectedElement ? (
                            <button
                                onClick={() => handleSelect(null)}
                                className="flex items-center gap-2 text-white bg-blue-600/90 hover:bg-blue-500 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 group">
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold tracking-wide text-xs md:text-sm">Back</span>
                            </button>
                        ) : (
                            <div className="bg-slate-900/40 p-2 md:p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl flex items-center gap-3 md:gap-4">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-[10px] md:text-xs shadow-lg font-mono">
                                        P
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-lg md:text-2xl font-black text-white tracking-tighter">
                                            ELEMENTAL<span className="text-blue-500">3D</span>
                                        </h1>
                                        <p className="text-[7px] md:text-[10px] text-blue-400/80 uppercase tracking-[0.3em] font-bold hidden xs:block">
                                            Interactive 3D Explorer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <PerformanceMenu
                            performance={performance}
                            onPerformanceChange={handlePerformanceChange}
                            isMobile={true}
                        />
                    </div>
                </div>

                <div className="hidden md:block pointer-events-auto">
                    <PerformanceMenu
                        performance={performance}
                        onPerformanceChange={handlePerformanceChange}
                        isMobile={false}
                    />
                </div>

                {!selectedElement && (
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-1.5 md:p-2.5 rounded-full pointer-events-auto shadow-2xl transition-all hover:border-blue-500/30">
                        <div className="relative group px-1 md:px-2">
                            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-950/80 border border-slate-700/50 rounded-full py-2 md:py-2.5 pl-9 md:pl-11 pr-4 md:pr-5 text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-36 md:w-64 transition-all"
                            />
                        </div>
                        <div className="h-6 md:h-8 w-px bg-white/10 mx-0.5 md:mx-1" />
                        <div className="flex gap-0.5 md:gap-1">
                            {[
                                { id: LayoutMode.TABLE, icon: TableIcon, label: 'Table' },
                                { id: LayoutMode.GRID, icon: LayoutGrid, label: 'Grid' },
                                { id: LayoutMode.SPHERE, icon: CircleDot, label: 'Sphere' },
                                { id: LayoutMode.HELIX, icon: Database, label: 'Helix' }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleLayoutChange(mode.id)}
                                    className={`p-1.5 md:p-2 rounded-full transition-all flex items-center gap-2 px-2 md:px-3 ${
                                        layout === mode.id
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}>
                                    <mode.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
                        className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 md:p-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full transition-all active:scale-90 group shadow-2xl">
                        <ChevronLeft className="w-8 h-8 md:w-12 md:h-12 text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                    </button>

                    <button
                        onClick={handleNext}
                        className={`fixed ${isPanelOpen ? 'right-110' : 'right-8'} top-1/2 -translate-y-1/2 z-40 p-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full active:scale-90 group hidden md:block shadow-2xl transition-all duration-300`}>
                        <ChevronRight className="w-12 h-12 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>

                    {!isPanelOpen && (
                        <button
                            onClick={handleNext}
                            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full transition-all active:scale-90 group md:hidden shadow-2xl">
                            <ChevronRight className="w-8 h-8 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                    )}
                </>
            )}

            {/* View Mode Switcher */}
            {selectedElement && (
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 md:gap-4 bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-2 md:p-4 rounded-3xl md:rounded-4xl shadow-2xl">
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
                            className={`flex items-center gap-2 md:gap-2.5 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                                viewMode === mode.id
                                    ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] scale-105'
                                    : !mode.available
                                      ? 'opacity-20 cursor-not-allowed'
                                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}>
                            <mode.icon className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-bold text-xs md:text-sm hidden sm:block">{mode.label}</span>
                        </button>
                    ))}

                    <div className="w-px h-6 bg-white/10 mx-1 md:mx-2" />
                    <button
                        onClick={() => togglePanel(!isPanelOpen)}
                        className={`flex items-center gap-2 md:gap-2.5 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                            isPanelOpen
                                ? 'bg-white/10 text-white'
                                : 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                        }`}>
                        <Info className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-bold text-xs md:text-sm hidden sm:block">Info</span>
                    </button>
                </div>
            )}

            <Canvas shadows dpr={[1, 2]} frameloop={isVisible ? 'always' : 'never'}>
                <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, isMobile ? 100 : 60]} fov={40} />
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
                    <CameraFocus
                        orbitRef={orbitRef}
                        isSelected={!!selectedElement}
                        selectedElementId={selectedElement?.number}
                    />

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
        { title: '3D Periodic Table | Elemental3D' },
        {
            property: 'og:title',
            content: '3D Periodic Table | Elemental3D'
        },
        {
            name: 'description',
            content:
                'An interactive 3D Periodic Table explorer built with React Three Fiber. Explore elements in 3D space with atomic, crystal, and reaction views.'
        }
    ];
}

export default App;
