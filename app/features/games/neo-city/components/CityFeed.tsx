import React, { useState } from 'react';
import type { FeedMessage } from '../types';

interface CityFeedProps {
    messages: FeedMessage[];
    isVisible: boolean;
    onClear: () => void;
}

const CityFeed: React.FC<CityFeedProps> = ({ messages, isVisible, onClear }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 w-70 z-50 flex flex-col pointer-events-auto">
            {/* 控制台外殼 */}
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* 標題列 Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            City Feed
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onClear}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                            title="Clear all logs">
                            <i className="fas fa-trash-can text-xs"></i>
                        </button>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-slate-500 hover:text-white transition-colors">
                            <i className={`fas ${isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs`}></i>
                        </button>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    </div>
                </div>

                {/* 內容區域 Body */}
                {!isMinimized && (
                    <div className="h-64 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-600 italic text-xs font-mono">
                                Waiting for citizen feedback...
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-slate-800/40 border-l-2 border-green-500/80 p-3 pl-4 rounded-r-lg hover:bg-slate-800/60 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tight">
                                                @{msg.user}
                                            </span>
                                            <span className="text-[9px] text-slate-600 font-mono uppercase">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-200 font-mono leading-relaxed pr-8">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.8);
        }
      `
                }}
            />
        </div>
    );
};

export default CityFeed;
