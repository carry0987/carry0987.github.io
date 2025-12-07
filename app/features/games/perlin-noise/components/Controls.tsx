import React from 'react';
import { EffectType, type EffectParams, type FireballParams } from '../types';

interface ControlsProps {
    effectType: EffectType;
    params: EffectParams;
    setEffectType: (t: EffectType) => void;
    setParams: (p: EffectParams) => void;
    fireballParams: FireballParams;
    setFireballParams: (p: FireballParams) => void;
}

const Controls: React.FC<ControlsProps> = ({
    effectType,
    params,
    setEffectType,
    setParams,
    fireballParams,
    setFireballParams
}) => {
    const handleChange = (key: keyof EffectParams, value: any) => {
        setParams({ ...params, [key]: value });
    };

    const handleFireballChange = (key: keyof FireballParams, value: any) => {
        setFireballParams({ ...fireballParams, [key]: value });
    };

    const effectOptions = Object.values(EffectType);

    return (
        <div className="absolute top-4 right-4 w-80 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh] z-20">
            <div className="mb-6">
                <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    Noise Lab
                </h1>
                <p className="text-xs text-gray-400">Interactive Perlin Experiments</p>
            </div>

            {/* Effect Selector */}
            <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">Mode</label>
                <div className="grid grid-cols-2 gap-2">
                    {effectOptions.map((eff) => (
                        <button
                            key={eff}
                            onClick={() => setEffectType(eff)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                                effectType === eff
                                    ? 'bg-white/20 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                                    : 'bg-transparent border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                            }`}>
                            {eff.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
                {/* Speed */}
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-300">Speed</label>
                        <span className="text-xs text-gray-500">{params.speed.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.01"
                        value={params.speed}
                        onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>

                {/* Noise Scale */}
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-300">Noise Scale</label>
                        <span className="text-xs text-gray-500">{params.noiseScale.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="5.0"
                        step="0.1"
                        value={params.noiseScale}
                        onChange={(e) => handleChange('noiseScale', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Displacement */}
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-300">Displacement / Intensity</label>
                        <span className="text-xs text-gray-500">{params.displacement.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={params.displacement}
                        onChange={(e) => handleChange('displacement', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-xs text-gray-300 mb-2">Color A</label>
                        <div className="relative">
                            <input
                                type="color"
                                value={params.colorA}
                                onChange={(e) => handleChange('colorA', e.target.value)}
                                className="w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"
                            />
                            <div
                                className="w-full h-8 rounded border border-white/20"
                                style={{ backgroundColor: params.colorA }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-300 mb-2">Color B</label>
                        <div className="relative">
                            <input
                                type="color"
                                value={params.colorB}
                                onChange={(e) => handleChange('colorB', e.target.value)}
                                className="w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"
                            />
                            <div
                                className="w-full h-8 rounded border border-white/20"
                                style={{ backgroundColor: params.colorB }}
                            />
                        </div>
                    </div>
                </div>

                {/* Wireframe Toggle */}
                {effectType !== EffectType.PARTICLES && effectType !== EffectType.FIREBALL && (
                    <div className="flex items-center justify-between pt-2">
                        <label className="text-xs text-gray-300">Wireframe Mode</label>
                        <button
                            onClick={() => handleChange('wireframe', !params.wireframe)}
                            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${params.wireframe ? 'bg-purple-600' : 'bg-gray-700'}`}>
                            <div
                                className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${params.wireframe ? 'left-6' : 'left-1'}`}
                            />
                        </button>
                    </div>
                )}

                {/* Fireball-specific Controls */}
                {effectType === EffectType.FIREBALL && (
                    <>
                        <div className="border-t border-white/10 pt-4 mt-4">
                            <h3 className="text-xs uppercase tracking-wider text-orange-400 mb-4 font-semibold">
                                Fireball Settings
                            </h3>
                        </div>

                        {/* Velocity (Rotation Speed) */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Velocity</label>
                                <span className="text-xs text-gray-500">{fireballParams.velocity.toFixed(4)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="0.02"
                                step="0.0001"
                                value={fireballParams.velocity}
                                onChange={(e) => handleFireballChange('velocity', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>

                        {/* Animation Speed */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Speed</label>
                                <span className="text-xs text-gray-500">{fireballParams.speed.toFixed(5)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="0.0005"
                                step="0.00001"
                                value={fireballParams.speed}
                                onChange={(e) => handleFireballChange('speed', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>

                        {/* Point Scale */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Point Size</label>
                                <span className="text-xs text-gray-500">{fireballParams.pointScale.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.1"
                                value={fireballParams.pointScale}
                                onChange={(e) => handleFireballChange('pointScale', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                        </div>

                        {/* Decay */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Decay</label>
                                <span className="text-xs text-gray-500">{fireballParams.decay.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={fireballParams.decay}
                                onChange={(e) => handleFireballChange('decay', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>

                        {/* Complex */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Complexity</label>
                                <span className="text-xs text-gray-500">{fireballParams.complex.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.01"
                                value={fireballParams.complex}
                                onChange={(e) => handleFireballChange('complex', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>

                        {/* Waves */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Waves</label>
                                <span className="text-xs text-gray-500">{fireballParams.waves.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="0.5"
                                value={fireballParams.waves}
                                onChange={(e) => handleFireballChange('waves', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Hue */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Hue</label>
                                <span className="text-xs text-gray-500">{fireballParams.hue.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="15"
                                step="0.1"
                                value={fireballParams.hue}
                                onChange={(e) => handleFireballChange('hue', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>

                        {/* Spin Settings */}
                        <div className="border-t border-white/10 pt-4 mt-4">
                            <h3 className="text-xs uppercase tracking-wider text-cyan-400 mb-4 font-semibold">
                                Spin Settings
                            </h3>
                        </div>

                        {/* Sine Velocity */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Sine</label>
                                <span className="text-xs text-gray-500">{fireballParams.sinVel.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="0.5"
                                step="0.01"
                                value={fireballParams.sinVel}
                                onChange={(e) => handleFireballChange('sinVel', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                        {/* Amplitude */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-gray-300">Amplitude</label>
                                <span className="text-xs text-gray-500">{fireballParams.ampVel.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="90"
                                step="1"
                                value={fireballParams.ampVel}
                                onChange={(e) => handleFireballChange('ampVel', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                        {/* Toggle Switches */}
                        <div className="space-y-3 pt-2">
                            {/* Fragment Toggle */}
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-300">Fragment Mode</label>
                                <button
                                    onClick={() => handleFireballChange('fragment', !fireballParams.fragment)}
                                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${fireballParams.fragment ? 'bg-orange-600' : 'bg-gray-700'}`}>
                                    <div
                                        className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${fireballParams.fragment ? 'left-6' : 'left-1'}`}
                                    />
                                </button>
                            </div>

                            {/* Electroflow Toggle */}
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-300">Electroflow</label>
                                <button
                                    onClick={() => handleFireballChange('electroflow', !fireballParams.electroflow)}
                                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${fireballParams.electroflow ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                    <div
                                        className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${fireballParams.electroflow ? 'left-6' : 'left-1'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Controls;
