import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, ExternalLink, ChevronDown } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import type { AIProvider } from '../types';

interface AIProviderConfig {
    id: AIProvider;
    name: string;
    placeholder: string;
    getKeyUrl: string;
    keyPrefix: string;
}

const AI_PROVIDERS: AIProviderConfig[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        placeholder: 'Enter your OpenAI API key (sk-...)',
        getKeyUrl: 'https://platform.openai.com/api-keys',
        keyPrefix: 'sk-'
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        placeholder: 'Enter your Gemini API key...',
        getKeyUrl: 'https://aistudio.google.com/app/apikey',
        keyPrefix: 'AI'
    }
];

interface ApiKeyInputProps {
    provider: AIProvider;
    onProviderChange: (provider: AIProvider) => void;
    apiKey: string;
    onApiKeyChange: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ provider, onProviderChange, apiKey, onApiKeyChange }) => {
    const [showKey, setShowKey] = useState(false);
    const [inputValue, setInputValue] = useState(apiKey);
    const [isEditing, setIsEditing] = useState(!apiKey);

    const currentProvider = AI_PROVIDERS.find((p) => p.id === provider) || AI_PROVIDERS[0];

    // Sync inputValue and isEditing when apiKey prop changes (e.g., from localStorage)
    useEffect(() => {
        setInputValue(apiKey);
        setIsEditing(!apiKey);
    }, [apiKey]);

    const handleSave = () => {
        onApiKeyChange(inputValue.trim());
        setIsEditing(false);
    };

    const handleClear = () => {
        setInputValue('');
        onApiKeyChange('');
        setIsEditing(true);
    };

    const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'•'.repeat(20)}${apiKey.slice(-4)}` : '';

    return (
        <div className="w-full mb-6">
            <div className="rounded-xl p-4 bg-dark-card/30 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-tech-400" />
                        <span className="text-sm font-medium text-slate-300">AI Provider</span>
                        {apiKey && !isEditing && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" />
                                Configured
                            </span>
                        )}
                    </div>
                    <a
                        href={currentProvider.getKeyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-tech-400 transition-colors">
                        Get API Key
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                {/* Provider Selector */}
                <div className="mb-3">
                    <Listbox value={provider} onChange={onProviderChange}>
                        <ListboxButton className="relative w-full bg-slate-800/50 text-slate-300 text-sm font-medium pl-4 pr-10 py-2.5 rounded-lg border border-white/10 hover:border-white/20 focus:outline-none data-focus:border-tech-500/50 data-focus:ring-2 data-focus:ring-tech-500/20 cursor-pointer transition-all text-left">
                            <span className="block truncate">{currentProvider.name}</span>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                            />
                        </ListboxButton>
                        <ListboxOptions
                            anchor="bottom"
                            transition
                            className="w-(--button-width) rounded-xl border border-white/10 bg-slate-800 p-1 shadow-xl [--anchor-gap:4px] focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0 z-50">
                            {AI_PROVIDERS.map((p) => (
                                <ListboxOption
                                    key={p.id}
                                    value={p.id}
                                    className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 select-none data-focus:bg-tech-500/20 text-slate-300 data-selected:text-tech-400 text-sm">
                                    <Check size={14} className="invisible text-tech-400 group-data-selected:visible" />
                                    <span>{p.name}</span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </div>

                {isEditing || !apiKey ? (
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={currentProvider.placeholder}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-tech-500/50 focus:ring-1 focus:ring-tech-500/20 transition-all pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!inputValue.trim()}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                inputValue.trim()
                                    ? 'bg-tech-500 text-white hover:bg-tech-600'
                                    : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                            }`}>
                            Save
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-400 font-mono truncate">
                            {showKey ? apiKey : maskedKey}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="p-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-tech-500/30 transition-all">
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => {
                                setInputValue(apiKey);
                                setIsEditing(true);
                            }}
                            className="px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-slate-400 hover:text-white hover:border-tech-500/30 transition-all">
                            Edit
                        </button>
                        <button
                            onClick={handleClear}
                            className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all">
                            Clear
                        </button>
                    </div>
                )}

                <p className="mt-3 text-xs text-slate-500">
                    Your API key is stored locally in your browser and never sent to any server other than{' '}
                    {currentProvider.name}'s API.
                </p>
            </div>
        </div>
    );
};

export default ApiKeyInput;
