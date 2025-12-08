import React, { useState } from 'react';
import { FireIcon, GlobeAltIcon, CubeIcon, SparklesIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { EffectType, type EffectParams, type FireballParams } from '../types';

interface ControlsProps {
    effectType: EffectType;
    params: EffectParams;
    setEffectType: (t: EffectType) => void;
    setParams: (p: EffectParams) => void;
    fireballParams: FireballParams;
    setFireballParams: (p: FireballParams) => void;
}

// Effect configuration with icons and colors
const EFFECT_CONFIG = {
    [EffectType.FIREBALL]: {
        icon: FireIcon,
        label: 'Fireball',
        activeClass: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
        color: '#f97316'
    },
    [EffectType.TERRAIN]: {
        icon: GlobeAltIcon,
        label: 'Terrain',
        activeClass: 'bg-green-500/20 border-green-500/50 text-green-400',
        color: '#22c55e'
    },
    [EffectType.SPHERE_BLOB]: {
        icon: CubeIcon,
        label: 'Blob',
        activeClass: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
        color: '#a855f7'
    },
    [EffectType.PARTICLES]: {
        icon: SparklesIcon,
        label: 'Particles',
        activeClass: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
        color: '#06b6d4'
    }
};

// Helper function to calculate slider gradient
const getSliderGradient = (value: number, min: number, max: number, color: string) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
};

const Controls: React.FC<ControlsProps> = ({
    effectType,
    params,
    setEffectType,
    setParams,
    fireballParams,
    setFireballParams
}) => {
    const [panelOpen, setPanelOpen] = useState(false);

    const handleChange = (key: keyof EffectParams, value: any) => {
        setParams({ ...params, [key]: value });
    };

    const handleFireballChange = (key: keyof FireballParams, value: any) => {
        setFireballParams({ ...fireballParams, [key]: value });
    };

    const effectOptions = Object.values(EffectType);

    // Shared panel content
    const renderPanelContent = (isMobile: boolean = false) => (
        <>
            {/* Header */}
            <div className={`${isMobile ? 'flex items-center justify-between mb-4' : 'mb-6'}`}>
                <div>
                    <h1
                        className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-pink-500`}>
                        Noise Lab
                    </h1>
                    <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 font-mono tracking-wider`}>
                        PERLIN EXPERIMENTS
                    </p>
                </div>
                {isMobile && (
                    <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg">
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: EFFECT_CONFIG[effectType].color }}
                        />
                        <span className="text-xs text-white">{EFFECT_CONFIG[effectType].label}</span>
                    </div>
                )}
            </div>

            {/* Effect Selector */}
            <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
                <span
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-gray-500 uppercase tracking-widest mb-2 block`}>
                    Mode
                </span>
                <div
                    className={`${isMobile ? 'flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1' : 'grid grid-cols-2 gap-2'}`}>
                    {effectOptions.map((eff) => {
                        const config = EFFECT_CONFIG[eff];
                        const Icon = config.icon;
                        const isActive = effectType === eff;
                        return (
                            <button
                                key={eff}
                                onClick={() => setEffectType(eff)}
                                className={`${isMobile ? 'shrink-0 flex items-center justify-center px-4 py-2.5' : 'flex items-center justify-center p-3'} rounded-xl transition-all ${
                                    isActive
                                        ? config.activeClass
                                        : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'
                                } border`}>
                                <Icon className={`${isMobile ? 'w-4 h-4 mr-1.5' : 'w-5 h-5 mr-2'}`} />
                                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{config.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Common Sliders */}
            <div className={`space-y-${isMobile ? '4' : '5'}`}>
                {/* Colors */}
                <div className={`grid grid-cols-2 gap-${isMobile ? '3' : '4'} pt-2`}>
                    <div>
                        <label className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 mb-2`}>
                            Color A
                        </label>
                        <div className="relative">
                            <input
                                type="color"
                                value={params.colorA}
                                onChange={(e) => handleChange('colorA', e.target.value)}
                                className="w-full h-8 rounded-lg cursor-pointer opacity-0 absolute top-0 left-0"
                            />
                            <div
                                className="w-full h-8 rounded-lg border border-white/20 transition-colors"
                                style={{ backgroundColor: params.colorA }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 mb-2`}>
                            Color B
                        </label>
                        <div className="relative">
                            <input
                                type="color"
                                value={params.colorB}
                                onChange={(e) => handleChange('colorB', e.target.value)}
                                className="w-full h-8 rounded-lg cursor-pointer opacity-0 absolute top-0 left-0"
                            />
                            <div
                                className="w-full h-8 rounded-lg border border-white/20 transition-colors"
                                style={{ backgroundColor: params.colorB }}
                            />
                        </div>
                    </div>
                </div>

                {/* Wireframe Toggle */}
                {effectType !== EffectType.PARTICLES && effectType !== EffectType.FIREBALL && (
                    <div className="flex items-center justify-between pt-2">
                        <label className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>Wireframe</label>
                        <button
                            onClick={() => handleChange('wireframe', !params.wireframe)}
                            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${params.wireframe ? 'bg-purple-600' : 'bg-gray-700'}`}>
                            <div
                                className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${params.wireframe ? 'left-6' : 'left-1'}`}
                            />
                        </button>
                    </div>
                )}

                {/* Noise Settings (for all effects) */}
                <>
                    <div className="border-t border-white/10 pt-4 mt-4">
                        <span
                            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-orange-400 uppercase tracking-widest`}>
                            Noise Settings
                        </span>
                    </div>

                    {/* Velocity */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Velocity</span>
                            <span>{fireballParams.velocity.toFixed(4)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="0.02"
                            step="0.0001"
                            value={fireballParams.velocity}
                            onChange={(e) => handleFireballChange('velocity', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.velocity, 0, 0.02, '#f97316') }}
                        />
                    </div>

                    {/* Speed */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Anim Speed</span>
                            <span>{fireballParams.speed.toFixed(5)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="0.0005"
                            step="0.00001"
                            value={fireballParams.speed}
                            onChange={(e) => handleFireballChange('speed', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.speed, 0, 0.0005, '#fb923c') }}
                        />
                    </div>

                    {/* Point Scale */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Point Size</span>
                            <span>{fireballParams.pointScale.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.1"
                            value={fireballParams.pointScale}
                            onChange={(e) => handleFireballChange('pointScale', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.pointScale, 1, 5, '#eab308') }}
                        />
                    </div>

                    {/* Decay */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Decay</span>
                            <span>{fireballParams.decay.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={fireballParams.decay}
                            onChange={(e) => handleFireballChange('decay', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.decay, 0, 1, '#ef4444') }}
                        />
                    </div>

                    {/* Complex */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Complexity</span>
                            <span>{fireballParams.complex.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.01"
                            value={fireballParams.complex}
                            onChange={(e) => handleFireballChange('complex', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.complex, 0.1, 1, '#a855f7') }}
                        />
                    </div>

                    {/* Waves */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Waves</span>
                            <span>{fireballParams.waves.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="0.5"
                            value={fireballParams.waves}
                            onChange={(e) => handleFireballChange('waves', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.waves, 0, 20, '#3b82f6') }}
                        />
                    </div>

                    {/* Hue */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Hue</span>
                            <span>{fireballParams.hue.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="15"
                            step="0.1"
                            value={fireballParams.hue}
                            onChange={(e) => handleFireballChange('hue', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.hue, 0, 15, '#ec4899') }}
                        />
                    </div>

                    {/* Spin Settings */}
                    <div className="border-t border-white/10 pt-4 mt-4">
                        <span
                            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-cyan-400 uppercase tracking-widest`}>
                            Spin Settings
                        </span>
                    </div>

                    {/* Sine Velocity */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Sine</span>
                            <span>{fireballParams.sinVel.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="0.5"
                            step="0.01"
                            value={fireballParams.sinVel}
                            onChange={(e) => handleFireballChange('sinVel', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.sinVel, 0, 0.5, '#06b6d4') }}
                        />
                    </div>

                    {/* Amplitude */}
                    <div className="space-y-2">
                        <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                            <span>Amplitude</span>
                            <span>{fireballParams.ampVel.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="90"
                            step="1"
                            value={fireballParams.ampVel}
                            onChange={(e) => handleFireballChange('ampVel', parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: getSliderGradient(fireballParams.ampVel, 0, 90, '#22d3ee') }}
                        />
                    </div>

                    {/* Toggle Switches */}
                    <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'space-y-3'} pt-3`}>
                        {/* Fragment Toggle */}
                        <div className="flex items-center justify-between">
                            <label className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>Fragment</label>
                            <button
                                onClick={() => handleFireballChange('fragment', !fireballParams.fragment)}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${fireballParams.fragment ? 'bg-orange-500' : 'bg-gray-700'}`}>
                                <div
                                    className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${fireballParams.fragment ? 'left-6' : 'left-1'}`}
                                />
                            </button>
                        </div>

                        {/* Electroflow Toggle */}
                        <div className="flex items-center justify-between">
                            <label className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                                Electroflow
                            </label>
                            <button
                                onClick={() => handleFireballChange('electroflow', !fireballParams.electroflow)}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${fireballParams.electroflow ? 'bg-purple-500' : 'bg-gray-700'}`}>
                                <div
                                    className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${fireballParams.electroflow ? 'left-6' : 'left-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                </>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Panel */}
            <div className="hidden md:block absolute top-4 right-4 w-80 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh] z-20">
                {/* Status indicator for desktop */}
                <div className="absolute top-6 right-6 flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg">
                    <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: EFFECT_CONFIG[effectType].color }}
                    />
                    <span className="text-[10px] text-gray-400">{EFFECT_CONFIG[effectType].label}</span>
                </div>
                {renderPanelContent(false)}
            </div>

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setPanelOpen(!panelOpen)}
                className="md:hidden fixed right-4 bottom-4 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-lg z-60 transition-all duration-300">
                {panelOpen ? (
                    <XMarkIcon className="w-6 h-6 text-white" />
                ) : (
                    <Bars3Icon className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Mobile Panel */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div
                    className={`transform transition-transform duration-300 ease-out ${
                        panelOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}>
                    <div className="bg-black/70 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-4 pb-8 shadow-2xl max-h-[70vh] overflow-y-auto text-white">
                        {renderPanelContent(true)}

                        {/* Mobile Instructions */}
                        <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-gray-500 text-center">
                            Interactive Perlin noise visualization • Scroll for more controls
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Controls;
