import React from 'react';

interface ProgressBarProps {
    progress: number;
    isActive: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, isActive }) => {
    // Calculate color based on state and progress
    const getBarColor = () => {
        if (progress >= 100) return 'bg-emerald-500';
        if (!isActive) return 'bg-slate-500';
        return 'bg-indigo-500';
    };

    const getGlowColor = () => {
        if (progress >= 100) return 'shadow-[0_0_20px_rgba(16,185,129,0.5)]';
        if (!isActive) return '';
        return 'shadow-[0_0_20px_rgba(99,102,241,0.5)]';
    };

    return (
        <div className="relative h-6 w-full bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600/50">
            <div
                className={`h-full transition-all duration-300 ease-linear rounded-full ${getBarColor()} ${getGlowColor()}`}
                style={{ width: `${progress}%` }}>
                {isActive && progress < 100 && (
                    <div
                        className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12"
                        style={{
                            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transform: 'translateX(-100%)'
                        }}
                    />
                )}
            </div>

            {/* Text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-md">{Math.round(progress)}%</span>
            </div>

            <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
        </div>
    );
};
