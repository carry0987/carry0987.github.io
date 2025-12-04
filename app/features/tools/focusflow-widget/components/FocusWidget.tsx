import React, { useState, useEffect, useCallback } from 'react';
import { usePageVisibility } from '../hooks/usePageVisibility';
import { ProgressBar } from './ProgressBar';
import { PlayIcon, PauseIcon, CheckCircleIcon, RefreshIcon, ChevronDownIcon, SparklesIcon } from './Icons';

const INCREMENT_AMOUNT = 0.5; // Percent per tick
const TICK_RATE = 100; // Milliseconds
const COMPLETION_DELAY = 1500; // Time to show "Complete" before resetting

export const FocusWidget: React.FC = () => {
    const isPageVisible = usePageVisibility();
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    // Determine active state: visible and not in the momentary completion phase
    const isActive = isPageVisible && !isComplete;

    // Progress Timer Logic
    useEffect(() => {
        let interval: number;

        if (isActive) {
            interval = window.setInterval(() => {
                setProgress((prev) => {
                    // If we hit 100, clamping happens here, effect below handles the reset cycle
                    if (prev >= 100) return 100;
                    return prev + INCREMENT_AMOUNT;
                });
            }, TICK_RATE);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    // Completion & Loop Logic
    useEffect(() => {
        if (progress >= 100 && !isComplete) {
            // Trigger completion state
            setIsComplete(true);

            // Wait a moment to show the "Full Bar" success state, then reset
            const timer = setTimeout(() => {
                setSessionCount((prev) => prev + 1);
                setProgress(0);
                setIsComplete(false);
            }, COMPLETION_DELAY);

            return () => clearTimeout(timer);
        }
    }, [progress, isComplete]);

    const handleReset = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setProgress(0);
        setIsComplete(false);
        setSessionCount(0); // Resetting manually clears the count too
    }, []);

    // Dynamic status text and color
    const getStatusConfig = () => {
        if (isComplete)
            return {
                text: 'Session Complete!',
                color: 'text-emerald-400',
                borderColor: 'border-emerald-500',
                icon: <CheckCircleIcon className="w-6 h-6" />
            };
        if (isActive)
            return {
                text: 'Focusing',
                color: 'text-tech-400',
                borderColor: 'border-tech-500',
                icon: <PlayIcon className="w-5 h-5 animate-pulse" />
            };
        return {
            text: 'Paused',
            color: 'text-amber-400',
            borderColor: 'border-amber-500',
            icon: <PauseIcon className="w-5 h-5" />
        };
    };

    const status = getStatusConfig();

    // Collapsed State (Mini Widget)
    if (!isExpanded) {
        const radius = 18;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (progress / 100) * circumference;

        // Color logic for the ring
        const strokeColor = isComplete ? '#34d399' : isActive ? '#818cf8' : '#fbbf24';

        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 z-50 group transition-all duration-300 hover:scale-105 focus:outline-none"
                aria-label="Expand Focus Widget">
                <div className="relative w-16 h-16 bg-slate-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-700 flex items-center justify-center backdrop-blur-xl">
                    {/* Radial Progress */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
                        {/* Track */}
                        <circle cx="24" cy="24" r={radius} fill="none" className="stroke-slate-700" strokeWidth="3" />
                        {/* Progress */}
                        <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-300 ease-linear"
                        />
                    </svg>

                    <div
                        className={`text-slate-200 ${isComplete ? 'text-emerald-400' : isActive ? 'text-indigo-400' : 'text-amber-400'}`}>
                        {isComplete ? (
                            <CheckCircleIcon className="w-6 h-6" />
                        ) : isActive ? (
                            <PlayIcon className="w-6 h-6" />
                        ) : (
                            <PauseIcon className="w-6 h-6" />
                        )}
                    </div>

                    {/* Badge for Session Count */}
                    {sessionCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-lg animate-in zoom-in duration-300">
                            {sessionCount}
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-slate-400 bg-slate-900/90 px-2 py-1 rounded pointer-events-none">
                    {status.text}
                </div>
            </button>
        );
    }

    // Expanded State (Full Widget)
    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="relative group">
                {/* Decorative blur behind the card */}
                <div
                    className={`absolute -inset-0.5 rounded-2xl opacity-75 blur transition duration-500 
          ${isComplete ? 'bg-emerald-600/20' : isActive ? 'bg-indigo-600/20' : 'bg-slate-600/20'}`}
                />

                <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div
                                className={`p-2 rounded-lg bg-slate-800 border border-slate-700 transition-colors duration-300 ${status.color}`}>
                                {status.icon}
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">Focus Session</h2>
                                <p className={`text-xs font-medium transition-colors duration-300 ${status.color}`}>
                                    {status.text}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            <button
                                onClick={handleReset}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                title="Reset All">
                                <RefreshIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                title="Minimize">
                                <ChevronDownIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 mb-2">
                        <ProgressBar progress={progress} isActive={isActive} />
                        <div className="flex justify-between items-center text-xs text-slate-500 px-1">
                            <span>Current Cycle</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800 flex items-center space-x-2">
                            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
                                <SparklesIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                    Completed
                                </div>
                                <div className="text-sm font-bold text-slate-200">
                                    {sessionCount} {sessionCount === 1 ? 'Session' : 'Sessions'}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800 flex items-center space-x-2">
                            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-md">
                                <PlayIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                    Status
                                </div>
                                <div className="text-sm font-bold text-slate-200">{isActive ? 'Active' : 'Idle'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contextual Tip */}
                    <div className="mt-4 pt-3 border-t border-slate-800">
                        {!isActive && !isComplete && (
                            <div className="flex items-start space-x-2 text-amber-400/90 text-xs animate-in fade-in slide-in-from-top-1 duration-300 bg-amber-900/20 p-2 rounded-md border border-amber-900/50">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-4 h-4 shrink-0 mt-0.5">
                                    <path
                                        fillRule="evenodd"
                                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p>Widget paused. Focus on this window to continue.</p>
                            </div>
                        )}
                        {isActive && (
                            <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs py-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                <p>Tracking your engagement...</p>
                            </div>
                        )}
                        {isComplete && (
                            <div className="text-emerald-400/90 text-xs text-center bg-emerald-900/20 p-2 rounded-md border border-emerald-900/50 font-medium animate-pulse">
                                Session Completed! Resetting...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
