import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimeInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse time value
    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return { hours: hours || 0, minutes: minutes || 0 };
    };

    const { hours, minutes } = parseTime(value);

    // Format time to HH:MM
    const formatTime = (h: number, m: number) => {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    // Handle hour change
    const handleHourChange = (delta: number) => {
        const newHours = (hours + delta + 24) % 24;
        onChange(formatTime(newHours, minutes));
    };

    // Handle minute change
    const handleMinuteChange = (delta: number) => {
        const newMinutes = (minutes + delta + 60) % 60;
        onChange(formatTime(hours, newMinutes));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format display time (12-hour format with AM/PM)
    const formatDisplayTime = () => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Main Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                    w-full h-full flex items-center gap-2 px-3 py-2
                    bg-linear-to-br from-slate-800/80 to-slate-900/80
                    border rounded-xl transition-all duration-200
                    ${isFocused || isOpen 
                        ? 'border-tech-500/50 shadow-lg shadow-tech-500/10 ring-2 ring-tech-500/20' 
                        : 'border-white/10 hover:border-white/20'
                    }
                `}
            >
                <div className={`
                    p-1.5 rounded-lg transition-colors duration-200
                    ${isOpen ? 'bg-tech-500/20 text-tech-400' : 'bg-slate-700/50 text-slate-400'}
                `}>
                    <Clock size={12} />
                </div>
                <span className="text-xs font-medium text-white tracking-wide">
                    {formatDisplayTime()}
                </span>
            </button>

            {/* Dropdown Picker */}
            {isOpen && (
                <div className="
                    absolute top-full left-0 mt-2 z-50
                    bg-linear-to-br from-slate-800 to-slate-900
                    border border-white/10 rounded-xl
                    shadow-2xl shadow-black/50
                    p-4 min-w-[180px]
                    animate-in fade-in slide-in-from-top-2 duration-200
                ">
                    {/* Time Display Header */}
                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white tracking-wider">
                            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                            {hours >= 12 ? 'PM' : 'AM'}
                        </div>
                    </div>

                    {/* Time Spinners */}
                    <div className="flex items-center justify-center gap-4">
                        {/* Hours Spinner */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => handleHourChange(1)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronUp size={16} />
                            </button>
                            <div className="w-12 h-10 flex items-center justify-center bg-slate-700/50 rounded-lg border border-white/10">
                                <span className="text-lg font-semibold text-tech-400">
                                    {hours.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <button
                                onClick={() => handleHourChange(-1)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronDown size={16} />
                            </button>
                            <span className="text-[10px] text-slate-500 mt-1">Hours</span>
                        </div>

                        {/* Separator */}
                        <div className="text-2xl font-bold text-slate-500 mb-6">:</div>

                        {/* Minutes Spinner */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => handleMinuteChange(1)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronUp size={16} />
                            </button>
                            <div className="w-12 h-10 flex items-center justify-center bg-slate-700/50 rounded-lg border border-white/10">
                                <span className="text-lg font-semibold text-tech-400">
                                    {minutes.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <button
                                onClick={() => handleMinuteChange(-1)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronDown size={16} />
                            </button>
                            <span className="text-[10px] text-slate-500 mt-1">Minutes</span>
                        </div>
                    </div>

                    {/* Quick Time Presets */}
                    <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="text-[10px] text-slate-500 mb-2 text-center">Quick Select</div>
                        <div className="grid grid-cols-4 gap-1.5">
                            {['09:00', '12:00', '15:00', '18:00'].map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => {
                                        onChange(preset);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        px-2 py-1.5 text-[10px] font-medium rounded-lg transition-all
                                        ${value === preset 
                                            ? 'bg-tech-500/20 text-tech-400 border border-tech-500/30' 
                                            : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-transparent'
                                        }
                                    `}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Now Button */}
                    <button
                        onClick={() => {
                            const now = new Date();
                            onChange(formatTime(now.getHours(), now.getMinutes()));
                            setIsOpen(false);
                        }}
                        className="
                            w-full mt-3 py-2 px-3
                            bg-linear-to-r from-tech-500/20 to-purple-500/20
                            hover:from-tech-500/30 hover:to-purple-500/30
                            border border-tech-500/30 rounded-lg
                            text-xs font-medium text-tech-400
                            transition-all duration-200
                            flex items-center justify-center gap-2
                        "
                    >
                        <Clock size={12} />
                        Set to Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimeInput;
