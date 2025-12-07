import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { BuildingType, type CityStats, type NewsItem, type SaveSettings } from '../types';
import { BUILDINGS } from '../constants';

interface UIOverlayProps {
    stats: CityStats;
    selectedTool: BuildingType;
    onSelectTool: (type: BuildingType) => void;
    newsFeed: NewsItem[];
    saveSettings: SaveSettings;
    onSave: () => void;
    onToggleAutoSave: () => void;
    onClearNewsFeed: () => void;
}

const tools = [
    BuildingType.None, // Bulldoze
    BuildingType.Road,
    BuildingType.Residential,
    BuildingType.Commercial,
    BuildingType.Industrial,
    BuildingType.Park
];

const ToolButton: React.FC<{
    type: BuildingType;
    isSelected: boolean;
    onClick: () => void;
    money: number;
}> = ({ type, isSelected, onClick, money }) => {
    const config = BUILDINGS[type];
    const canAfford = money >= config.cost;
    const isBulldoze = type === BuildingType.None;

    // Use 3D color for preview
    const bgColor = isBulldoze ? config.color : config.color;

    return (
        <button
            onClick={onClick}
            disabled={!isBulldoze && !canAfford}
            className={`
        relative flex flex-col items-center justify-center rounded-lg border-2 transition-all shadow-lg backdrop-blur-sm shrink-0
        w-14 h-14 md:w-16 md:h-16
        ${isSelected ? 'border-white bg-white/20 scale-110 z-10' : 'border-gray-600 bg-gray-900/80 hover:bg-gray-800'}
        ${!isBulldoze && !canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
            title={config.description}>
            <div
                className="w-6 h-6 md:w-8 md:h-8 rounded mb-0.5 md:mb-1 border border-black/30 shadow-inner flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: isBulldoze ? 'transparent' : bgColor }}>
                {isBulldoze && (
                    <div className="w-full h-full bg-red-600 text-white flex justify-center items-center font-bold text-base md:text-lg">
                        ✕
                    </div>
                )}
                {type === BuildingType.Road && <div className="w-full h-2 bg-gray-800 transform -rotate-45"></div>}
            </div>
            <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md leading-none">
                {config.name}
            </span>
            {config.cost > 0 && (
                <span
                    className={`text-[8px] md:text-[10px] font-mono leading-none ${canAfford ? 'text-green-300' : 'text-red-400'}`}>
                    ${config.cost}
                </span>
            )}
        </button>
    );
};

const UIOverlay: React.FC<UIOverlayProps> = ({
    stats,
    selectedTool,
    onSelectTool,
    newsFeed,
    saveSettings,
    onSave,
    onToggleAutoSave,
    onClearNewsFeed
}) => {
    const newsRef = useRef<HTMLDivElement>(null);

    // Auto-scroll news
    useEffect(() => {
        if (newsRef.current) {
            newsRef.current.scrollTop = newsRef.current.scrollHeight;
        }
    }, [newsFeed]);

    // Format last saved time
    const formatLastSaved = () => {
        if (!saveSettings.lastSavedAt) return 'Never';
        const date = new Date(saveSettings.lastSavedAt);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 md:p-4 font-sans z-10">
            {/* Top Bar: Stats & Goal */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start pointer-events-auto gap-2 w-full max-w-full">
                {/* Stats */}
                <div className="bg-gray-900/90 text-white p-2 md:p-3 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-md flex gap-3 md:gap-6 items-center justify-between md:justify-start w-full md:w-auto">
                    <div className="flex flex-col">
                        <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Treasury
                        </span>
                        <span className="text-lg md:text-2xl font-black text-green-400 font-mono drop-shadow-md">
                            ${stats.money.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-px h-6 md:h-8 bg-gray-700"></div>
                    <div className="flex flex-col">
                        <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Citizens
                        </span>
                        <span className="text-base md:text-xl font-bold text-blue-300 font-mono drop-shadow-md">
                            {stats.population.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-px h-6 md:h-8 bg-gray-700"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Day
                        </span>
                        <span className="text-base md:text-lg font-bold text-white font-mono">{stats.day}</span>
                    </div>
                </div>

                {/* Save Controls */}
                <div className="bg-gray-900/90 text-white p-2 md:p-3 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-md flex gap-2 md:gap-3 items-center">
                    {/* Save Button */}
                    <button
                        onClick={onSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide"
                        title="Save Game">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                        </svg>
                        <span className="hidden md:inline">Save</span>
                    </button>

                    {/* Auto-Save Toggle */}
                    <button
                        onClick={onToggleAutoSave}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide ${
                            saveSettings.autoSaveEnabled
                                ? 'bg-green-600 hover:bg-green-500'
                                : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        title={saveSettings.autoSaveEnabled ? 'Auto-save ON (every 30s)' : 'Auto-save OFF'}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span className="hidden md:inline">Auto</span>
                    </button>

                    {/* Last Saved Indicator */}
                    <div className="flex flex-col items-end text-[8px] md:text-[10px] leading-tight">
                        <span className="text-gray-400 uppercase font-bold tracking-widest">Saved</span>
                        <span className={`font-mono ${saveSettings.lastSavedAt ? 'text-green-300' : 'text-gray-500'}`}>
                            {formatLastSaved()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Tools & News */}
            <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-end pointer-events-auto mt-auto gap-2 w-full max-w-full">
                {/* Toolbar - Reversed on Mobile so it appears below News (in DOM order is News -> Toolbar with col-reverse, but visually we want Toolbar bottom, News Top on mobile. 
            Actually, visually we want:
            Mobile: 
            [News Feed]
            [Toolbar]
            
            Desktop:
            [Toolbar] ... [News Feed]
            
            If container is flex-col-reverse:
            1. Child (Toolbar) -> Bottom
            2. Child (News) -> Top
            
            If container is md:flex-row:
            1. Child (Toolbar) -> Left
            2. Child (News) -> Right
            
            This works perfectly.
        */}

                <div className="flex gap-1 md:gap-2 bg-gray-900/80 p-1 md:p-2 rounded-2xl border border-gray-600/50 backdrop-blur-xl shadow-2xl w-full md:w-auto overflow-x-auto no-scrollbar justify-start md:justify-start">
                    <div className="flex gap-1 md:gap-2 min-w-max px-1">
                        {tools.map((type) => (
                            <ToolButton
                                key={type}
                                type={type}
                                isSelected={selectedTool === type}
                                onClick={() => onSelectTool(type)}
                                money={stats.money}
                            />
                        ))}
                    </div>
                    <div className="text-[8px] text-gray-500 uppercase writing-mode-vertical flex items-center justify-center font-bold tracking-widest border-l border-gray-700 pl-1 ml-1 select-none">
                        Build
                    </div>
                </div>

                {/* News Feed */}
                <div className="w-full md:w-80 h-32 md:h-48 bg-black/80 text-white rounded-xl border border-gray-700/80 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden relative selection:bg-white/30 selection:text-white">
                    <div className="bg-gray-800/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-300 border-b border-gray-600 flex justify-between items-center">
                        <span>City Feed</span>
                        <div className="flex items-center gap-2">
                            {newsFeed.length > 0 && (
                                <button
                                    onClick={onClearNewsFeed}
                                    className="text-gray-400 hover:text-red-400 transition-colors p-0.5 rounded hover:bg-white/10"
                                    title="Clear feed">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                    </div>

                    {/* Scanline effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] opacity-30 z-20"></div>

                    <div
                        ref={newsRef}
                        className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 text-[10px] md:text-xs font-mono scroll-smooth mask-image-b z-10">
                        {newsFeed.length === 0 && (
                            <div className="text-gray-500 italic text-center mt-10">No active news stream.</div>
                        )}
                        {newsFeed.map((news) => (
                            <div
                                key={news.id}
                                className={`
                border-l-2 pl-2 py-1 transition-all animate-fade-in leading-tight relative
                ${news.type === 'positive' ? 'border-green-500 text-green-200 bg-green-900/20' : ''}
                ${news.type === 'negative' ? 'border-red-500 text-red-200 bg-red-900/20' : ''}
                ${news.type === 'neutral' ? 'border-blue-400 text-blue-100 bg-blue-900/20' : ''}
              `}>
                                <span className="opacity-70 text-[8px] absolute top-0.5 right-1">
                                    {new Date(Number(news.id.split('.')[0])).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                {news.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIOverlay;
