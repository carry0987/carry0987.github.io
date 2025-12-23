import React, { useState, useRef, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ZoneType, type CityStats, type TileData, type SaveSettings, type PerformanceLevel } from '../types';
import { BUILDINGS } from '../constants';
import {
    Pencil,
    Wallet,
    Users,
    Calendar,
    TrendingUp,
    Save,
    RefreshCw,
    X,
    ChevronUp,
    ChevronDown,
    Clock,
    Gauge,
    Check,
    MousePointer2
} from 'lucide-react';

const PERFORMANCE_OPTIONS: { value: PerformanceLevel; label: string; icon: string; description: string }[] = [
    { value: 'low', label: 'Low', icon: '🔋', description: 'Best FPS' },
    { value: 'medium', label: 'Medium', icon: '⚡', description: 'Balanced' },
    { value: 'high', label: 'High', icon: '🎨', description: 'Best visuals' }
];

interface UIOverlayProps {
    stats: CityStats;
    cityName: string;
    onRenameCity: (name: string) => void;
    selectedType: ZoneType | null;
    onSelectType: (type: ZoneType | null) => void;
    selectedBuildingInfo: TileData | null;
    onDeselect: () => void;
    isFeedVisible: boolean;
    onToggleFeed: () => void;
    saveSettings: SaveSettings;
    onSave: () => void;
    onToggleAutoSave: () => void;
    gameTime: number;
    performanceLevel?: PerformanceLevel;
    onPerformanceChange?: (level: PerformanceLevel) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
    stats,
    cityName,
    onRenameCity,
    selectedType,
    onSelectType,
    selectedBuildingInfo,
    onDeselect,
    isFeedVisible,
    onToggleFeed,
    saveSettings,
    onSave,
    onToggleAutoSave,
    gameTime,
    performanceLevel = 'medium',
    onPerformanceChange
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(cityName);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeType = selectedBuildingInfo ? selectedBuildingInfo.type : selectedType;
    const buildingMeta = activeType ? BUILDINGS[activeType] : null;

    // Format game time (0-24) to HH:MM
    const formatGameTime = (time: number) => {
        const hours = Math.floor(time);
        const minutes = Math.floor((time % 1) * 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    useEffect(() => {
        if (isEditingName && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditingName]);

    const handleNameSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const finalName = tempName.trim() || cityName;
        onRenameCity(finalName);
        setTempName(finalName);
        setIsEditingName(false);
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Top Section - Stats & Save */}
            <div className="flex flex-row justify-between items-start w-full relative">
                {/* Left Side: City Name & Stats */}
                <div className="flex flex-col space-y-4 items-start">
                    {/* City Name Header */}
                    <div className="pointer-events-auto group">
                        {isEditingName ? (
                            <form onSubmit={handleNameSubmit} className="flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={() => handleNameSubmit()}
                                    className="bg-gray-800/80 backdrop-blur-md border-2 border-blue-500 rounded-lg px-4 py-1 text-2xl font-black text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] focus:outline-none tracking-tight"
                                    maxLength={24}
                                />
                            </form>
                        ) : (
                            <div
                                onClick={() => setIsEditingName(true)}
                                className="flex items-center space-x-3 cursor-pointer hover:translate-x-1 transition-transform duration-200">
                                <h1 className="text-3xl font-black italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white bg-linear-to-br from-white to-gray-400 bg-clip-text">
                                    {cityName}
                                </h1>
                                <Pencil className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>

                    {/* Stats Row - Left Aligned */}
                    <div className="flex justify-start items-start pointer-events-auto w-full">
                        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-4 rounded-xl shadow-2xl flex space-x-8">
                            <StatItem
                                icon={Wallet}
                                label="Budget"
                                value={`$${stats.money.toLocaleString()}`}
                                color="text-yellow-400"
                            />
                            <StatItem
                                icon={Users}
                                label="Population"
                                value={stats.population.toLocaleString()}
                                color="text-green-400"
                            />
                            <StatItem icon={Calendar} label="Day" value={stats.day.toString()} color="text-blue-400" />
                            <StatItem
                                icon={Clock}
                                label="Time"
                                value={formatGameTime(gameTime)}
                                color="text-indigo-400"
                            />
                            <StatItem
                                icon={TrendingUp}
                                label="Cashflow"
                                value={`$${stats.income - stats.expense}/m`}
                                color={stats.income - stats.expense >= 0 ? 'text-green-400' : 'text-red-400'}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Save Controls & Performance (Sky Metropolis Style) */}
                <div className="bg-black/40 text-white p-2 md:p-3 rounded-xl border border-white/10 shadow-2xl backdrop-blur-2xl flex gap-2 md:gap-3 items-center pointer-events-auto">
                    {/* Performance Toggle */}
                    {onPerformanceChange && (
                        <div className="relative flex items-center gap-1.5 border-r border-gray-700 pr-3">
                            <Gauge
                                className={`w-4 h-4 ${
                                    performanceLevel === 'low'
                                        ? 'text-green-400'
                                        : performanceLevel === 'medium'
                                          ? 'text-yellow-400'
                                          : 'text-red-400'
                                }`}
                            />
                            <Listbox value={performanceLevel} onChange={onPerformanceChange}>
                                <ListboxButton
                                    className={`relative flex items-center gap-1.5 bg-white/10 border rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                                        performanceLevel === 'low'
                                            ? 'border-green-500/50 text-green-400'
                                            : performanceLevel === 'medium'
                                              ? 'border-yellow-500/50 text-yellow-400'
                                              : 'border-red-500/50 text-red-400'
                                    }`}>
                                    <span>{PERFORMANCE_OPTIONS.find((o) => o.value === performanceLevel)?.icon}</span>
                                    <span>{performanceLevel}</span>
                                    <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                                </ListboxButton>
                                <ListboxOptions
                                    anchor="bottom end"
                                    transition
                                    className="z-50 mt-1 w-44 origin-top-right rounded-xl bg-black/80 backdrop-blur-2xl border border-white/20 p-1 shadow-xl focus:outline-none transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0">
                                    {PERFORMANCE_OPTIONS.map((option) => (
                                        <ListboxOption
                                            key={option.value}
                                            value={option.value}
                                            className={`group flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors data-focus:bg-gray-700 ${
                                                option.value === 'low'
                                                    ? 'data-selected:text-green-400'
                                                    : option.value === 'medium'
                                                      ? 'data-selected:text-yellow-400'
                                                      : 'data-selected:text-red-400'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{option.icon}</span>
                                                <div>
                                                    <div className="text-xs font-bold uppercase">{option.label}</div>
                                                    <div className="text-[10px] text-gray-400">
                                                        {option.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <Check className="w-4 h-4 opacity-0 group-data-selected:opacity-100" />
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={onSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide"
                        title="Save City">
                        <Save className="w-4 h-4" />
                        <span className="hidden md:inline">Save</span>
                    </button>

                    {/* Auto-Save Toggle */}
                    <button
                        onClick={onToggleAutoSave}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide ${
                            saveSettings.autoSaveEnabled
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                        title={saveSettings.autoSaveEnabled ? 'Disable Auto-save' : 'Enable Auto-save'}>
                        <RefreshCw className={`w-4 h-4 ${saveSettings.autoSaveEnabled ? 'animate-spin' : ''}`} />
                        <span className="hidden md:inline">Auto</span>
                    </button>

                    {/* Last Saved Info */}
                    {saveSettings.lastSavedAt && (
                        <div className="hidden lg:flex flex-col items-end border-l border-gray-700 pl-3">
                            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">
                                Last Sync
                            </span>
                            <span className="text-[10px] font-mono text-blue-400">
                                {new Date(saveSettings.lastSavedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Building Info Panel - Now on the LEFT */}
            {buildingMeta && (
                <div className="absolute top-1/2 left-6 -translate-y-1/2 w-72 bg-black/60 backdrop-blur-2xl border border-blue-500/40 rounded-2xl shadow-2xl p-6 pointer-events-auto animate-in slide-in-from-left duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg bg-gray-800`}>
                            <buildingMeta.icon className="w-6 h-6" style={{ color: buildingMeta.color }} />
                        </div>
                        {(selectedBuildingInfo || selectedType) && (
                            <button onClick={onDeselect} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <h3 className="text-xl font-bold mb-1">{buildingMeta.label}</h3>
                    <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">
                        {selectedBuildingInfo ? 'Building Inspector' : 'Construction Tool'}
                    </p>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-300 leading-relaxed italic">"{buildingMeta.description}"</p>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                            <div>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Cost</span>
                                <p
                                    className={`text-sm ${stats.money >= buildingMeta.cost ? 'text-green-400' : 'text-red-400'}`}>
                                    ${buildingMeta.cost.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Status</span>
                                <p className="text-sm text-green-400">
                                    {selectedBuildingInfo ? 'Operational' : 'Ready'}
                                </p>
                            </div>
                            {selectedBuildingInfo && (
                                <div className="col-span-2">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Coordinates</span>
                                    <p className="text-sm text-gray-400">
                                        X: {selectedBuildingInfo.x}, Z: {selectedBuildingInfo.z}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Toolbelt - Centered & Beautified */}
            <div className="flex justify-center pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-2xl border border-white/20 p-1.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center space-x-1">
                    {/* Select Tool */}
                    <button
                        onClick={() => onSelectType(null)}
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${
                            selectedType === null
                                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}>
                        <MousePointer2 className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">Select</span>
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    {Object.values(BUILDINGS).map((b) => (
                        <button
                            key={b.type}
                            onClick={() => onSelectType(b.type)}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${
                                selectedType === b.type
                                    ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}>
                            <b.icon className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter">{b.label}</span>
                            <span className="text-[8px] font-medium opacity-80">${b.cost}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{label}</span>
        <div className="flex items-center space-x-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className={`text-xl font-bold tabular-nums`}>{value}</span>
        </div>
    </div>
);

export default UIOverlay;
