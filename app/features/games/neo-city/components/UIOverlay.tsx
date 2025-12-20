import React, { useState, useRef, useEffect } from 'react';
import { ZoneType, type CityStats, type TileData } from '../types';
import { BUILDINGS } from '../constants';

interface UIOverlayProps {
    stats: CityStats;
    cityName: string;
    onRenameCity: (name: string) => void;
    selectedType: ZoneType;
    onSelectType: (type: ZoneType) => void;
    selectedBuildingInfo: TileData | null;
    onDeselect: () => void;
    isFeedVisible: boolean;
    onToggleFeed: () => void;
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
    onToggleFeed
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(cityName);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeType = selectedBuildingInfo ? selectedBuildingInfo.type : selectedType;
    const buildingMeta = activeType !== ZoneType.EMPTY ? BUILDINGS[activeType] : null;

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
            {/* Top Section - Left Aligned */}
            <div className="flex flex-col space-y-4 items-start w-full relative">
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
                            <i className="fas fa-pen text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                    )}
                </div>

                {/* Stats Row - Left Aligned */}
                <div className="flex justify-start items-start pointer-events-auto w-full">
                    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl flex space-x-8">
                        <StatItem
                            icon="fa-wallet"
                            label="Budget"
                            value={`$${stats.money.toLocaleString()}`}
                            color="text-yellow-400"
                        />
                        <StatItem
                            icon="fa-users"
                            label="Population"
                            value={stats.population.toLocaleString()}
                            color="text-green-400"
                        />
                        <StatItem
                            icon="fa-smile"
                            label="Happiness"
                            value={`${stats.happiness}%`}
                            color="text-blue-400"
                        />
                        <StatItem
                            icon="fa-chart-line"
                            label="Cashflow"
                            value={`$${stats.income - stats.expense}/m`}
                            color={stats.income - stats.expense >= 0 ? 'text-green-400' : 'text-red-400'}
                        />
                    </div>
                </div>
            </div>

            {/* Building Info Panel - Now on the LEFT */}
            {buildingMeta && (
                <div className="absolute top-1/2 left-6 -translate-y-1/2 w-72 bg-gray-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl p-6 pointer-events-auto animate-in slide-in-from-left duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg bg-gray-800`}>
                            <i
                                className={`fas ${buildingMeta.icon} text-2xl`}
                                style={{ color: buildingMeta.color }}></i>
                        </div>
                        {selectedBuildingInfo && (
                            <button onClick={onDeselect} className="text-gray-500 hover:text-white transition-colors">
                                <i className="fas fa-times"></i>
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

            {/* Bottom Toolbelt - Left Aligned */}
            <div className="flex justify-start pointer-events-auto">
                <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 p-2 rounded-2xl shadow-2xl flex space-x-2">
                    {Object.values(BUILDINGS).map((b) => (
                        <button
                            key={b.type}
                            onClick={() => onSelectType(b.type)}
                            className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all ${
                                selectedType === b.type
                                    ? 'bg-blue-600 ring-2 ring-white scale-105'
                                    : 'bg-gray-800 hover:bg-gray-700'
                            }`}>
                            <i className={`fas ${b.icon} text-2xl mb-1`}></i>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{b.label}</span>
                            <span className="text-[10px] opacity-70">${b.cost}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{label}</span>
        <div className="flex items-center space-x-2">
            <i className={`fas ${icon} ${color}`}></i>
            <span className={`text-xl font-bold tabular-nums`}>{value}</span>
        </div>
    </div>
);

export default UIOverlay;
