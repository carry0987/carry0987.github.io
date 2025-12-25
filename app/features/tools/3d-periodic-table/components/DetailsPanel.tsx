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
            className={`fixed inset-y-0 right-0 w-full md:w-100 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-500 ease-in-out p-8 text-slate-100 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-5xl font-black tracking-tighter" style={{ color }}>
                        {element.symbol}
                    </span>
                    <h2 className="text-3xl font-bold mt-2 text-white">{element.name}</h2>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-[0.2em] mt-1">{element.category}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
                    title="Hide Details">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Atomic No.
                    </p>
                    <p className="text-xl font-mono font-bold">{renderValue(element.number)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Atomic Mass</p>
                    <p className="text-xl font-mono font-bold truncate">
                        {renderValue(element.atomic_mass)} <span className="text-[10px] text-slate-400">u</span>
                    </p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Phase (STP)</p>
                    <p className="text-xl font-mono font-bold">{renderValue(element.phase)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Discoverer
                    </p>
                    <p className="text-sm truncate font-mono font-bold">{renderValue(element.discovered_by)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <Box className="w-3 h-3" /> Crystal
                    </p>
                    <p className="text-sm font-mono font-bold">{renderValue(element.crystal_structure)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Reactivity
                    </p>
                    <p className="text-sm font-mono font-bold">{renderValue(element.reaction_type)}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4 text-slate-400">
                    <FlaskConical className="w-4 h-4 text-blue-400" />
                    Chemical Summary
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner italic">
                    "{element.summary || 'Scientific information currently unavailable for this element.'}"
                </p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[11px] text-blue-300/80 text-center font-medium">
                The model remains active. Click "Back to Elements" in the top bar to return to the periodic table.
            </div>
        </div>
    );
};

export default DetailsPanel;
