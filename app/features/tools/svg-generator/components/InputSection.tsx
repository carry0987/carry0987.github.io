import React, { useState, useCallback } from 'react';
import { Send, Loader2, Wand2 } from 'lucide-react';
import { GenerationStatus } from '../types';

interface InputSectionProps {
    onGenerate: (prompt: string) => void;
    status: GenerationStatus;
    hasApiKey: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status, hasApiKey }) => {
    const [input, setInput] = useState('');

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (input.trim() && status !== GenerationStatus.LOADING && hasApiKey) {
                onGenerate(input.trim());
            }
        },
        [input, status, onGenerate, hasApiKey]
    );

    const isLoading = status === GenerationStatus.LOADING;

    return (
        <div className="w-full max-w-2xl mx-auto mt-12 px-4">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-tech-100 to-tech-400 mb-3">
                    What do you want to create?
                </h2>
                <p className="text-slate-400 text-lg">
                    Describe an object, icon, or scene, and we'll render it as vector art.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-tech-500 via-purple-500 to-tech-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg"></div>
                <div className="relative flex items-center glass-panel rounded-xl shadow-2xl overflow-hidden p-2">
                    <div className="pl-4 text-tech-400">
                        <Wand2 className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. A futuristic cyberpunk helmet with neon lights..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 px-4 py-3 text-lg"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || !hasApiKey}
                        title={!hasApiKey ? 'Please enter your API key first' : ''}
                        className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${
                  !input.trim() || isLoading || !hasApiKey
                      ? 'bg-dark-card text-slate-500 cursor-not-allowed'
                      : 'bg-tech-500 text-white hover:bg-tech-600 active:scale-95 shadow-lg shadow-tech-500/20'
              }
            `}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="hidden sm:inline">Crafting...</span>
                            </>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Generate</span>
                                <Send className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Quick suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Retro Camera', 'Space Rocket', 'Origami Bird', 'Isometric House'].map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-dark-card/50 border border-dark-border rounded-full hover:bg-dark-card hover:text-tech-400 hover:border-tech-500/30 transition-all"
                        disabled={isLoading}>
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};
