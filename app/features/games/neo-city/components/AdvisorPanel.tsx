import React from 'react';
import { Bot, X, Zap } from 'lucide-react';

interface AdvisorPanelProps {
    advice: string | null;
    onClose: () => void;
}

const AdvisorPanel: React.FC<AdvisorPanelProps> = ({ advice, onClose }) => {
    if (!advice) return null;

    return (
        <div className="absolute top-24 right-6 w-80 bg-gray-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl p-6 pointer-events-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 text-indigo-400">
                    <Bot className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider">Planning Advisor</h3>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-line border-t border-gray-800 pt-4">
                {advice}
            </div>
            <div className="mt-4 flex items-center space-x-2 text-[10px] text-gray-500 italic">
                <Zap className="w-3 h-3" />
                <span>Powered by Gemini 3 Flash</span>
            </div>
        </div>
    );
};

export default AdvisorPanel;
