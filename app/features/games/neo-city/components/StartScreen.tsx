import React from 'react';

interface StartScreenProps {
    onStart: (continueGame?: boolean) => void;
    hasSavedGame: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, hasSavedGame }) => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-white font-sans p-6 bg-black/30 backdrop-blur-sm transition-all duration-1000">
            <div className="max-w-md w-full bg-slate-900/90 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fade-in">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 bg-linear-to-br from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent tracking-tight">
                        Neo City
                    </h1>
                    <p className="text-slate-400 mb-8 text-sm font-medium uppercase tracking-widest">
                        Cyberpunk City Simulation
                    </p>

                    <div className="space-y-3">
                        {hasSavedGame && (
                            <button
                                onClick={() => onStart(true)}
                                className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] text-lg tracking-wide flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Continue
                            </button>
                        )}
                        <button
                            onClick={() => onStart(false)}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] text-lg tracking-wide ${
                                hasSavedGame
                                    ? 'bg-linear-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 shadow-slate-900/20'
                                    : 'bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/20'
                            }`}>
                            {hasSavedGame ? 'New Game' : 'Start Building'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;
