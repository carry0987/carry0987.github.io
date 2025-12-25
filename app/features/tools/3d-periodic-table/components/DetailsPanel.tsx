import React from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { X, FlaskConical, Info, User, Box, Flame } from 'lucide-react';

interface Props {
    element: ElementData | null;
    isOpen: boolean;
    onClose: () => void;
}

const DetailsPanel: React.FC<Props> = ({ element, isOpen, onClose }) => {
    if (!element) return null;

    const color = CATEGORY_COLORS[element.category] || CATEGORY_COLORS.unknown;

    const renderValue = (value: string | number | null | undefined) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-slate-600 italic">N/A</span>;
        }
        return <span className="text-white">{value}</span>;
    };

    return (
        <div
            className={`fixed z-50 bg-slate-900/95 backdrop-blur-3xl shadow-2xl transition-all duration-500 ease-in-out text-slate-100 overflow-y-auto details-scrollbar
                md:top-1/2 md:-translate-y-1/2 md:right-8 md:left-auto md:w-[450px] md:h-[90vh] md:border md:border-white/10 md:p-10 md:rounded-2xl
                bottom-0 left-0 right-0 w-full max-h-[75vh] rounded-t-2xl p-6 border-t border-white/10
                ${isOpen ? 'translate-y-0 opacity-100 md:translate-x-0' : 'translate-y-full opacity-0 md:translate-x-[calc(100%+2rem)]'}`}>
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden shrink-0" />

            <div className="flex justify-between items-start mb-8 md:mb-12">
                <div>
                    <span className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color }}>
                        {element.symbol}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold mt-3 text-white">{element.name}</h2>
                    <p className="text-[10px] md:text-xs font-bold opacity-50 uppercase tracking-[0.2em] mt-2">
                        {element.category}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
                    title="Hide Details">
                    <X className="w-5 h-5 md:w-7 md:h-7" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-5 mb-8 md:mb-12">
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10">
                    <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Atomic No.
                    </p>
                    <p className="text-lg md:text-2xl font-mono font-bold">{renderValue(element.number)}</p>
                </div>
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10">
                    <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase mb-2">Atomic Mass</p>
                    <p className="text-lg md:text-2xl font-mono font-bold truncate">
                        {renderValue(element.atomic_mass)} <span className="text-[10px] text-slate-400">u</span>
                    </p>
                </div>
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10">
                    <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase mb-2">Phase (STP)</p>
                    <p className="text-lg md:text-2xl font-mono font-bold">{renderValue(element.phase)}</p>
                </div>
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10">
                    <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-1">
                        <User className="w-3 h-3" /> Discoverer
                    </p>
                    <p className="text-xs md:text-base truncate font-mono font-bold">
                        {renderValue(element.discovered_by)}
                    </p>
                </div>
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10">
                    <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-1">
                        <Box className="w-3 h-3" /> Crystal
                    </p>
                    <p className="text-xs md:text-base font-mono font-bold">{renderValue(element.crystal_structure)}</p>
                </div>
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10">
                    <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Reactivity
                    </p>
                    <p className="text-xs md:text-base font-mono font-bold">{renderValue(element.reaction_type)}</p>
                </div>
            </div>

            <div className="mb-8 md:mb-12">
                <h3 className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 text-slate-400">
                    <FlaskConical className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-400" />
                    Chemical Summary
                </h3>
                <p className="text-slate-300 leading-relaxed text-xs md:text-base bg-black/40 p-5 md:p-7 rounded-2xl border border-white/5 shadow-inner italic">
                    "{element.summary || 'Scientific information currently unavailable for this element.'}"
                </p>
            </div>

            <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[10px] md:text-xs text-blue-300/80 text-center font-medium">
                The model remains active. Click "Back to Elements" in the top bar to return to the periodic table.
            </div>
        </div>
    );
};

export default DetailsPanel;
