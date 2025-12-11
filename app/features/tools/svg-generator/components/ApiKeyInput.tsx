import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, ExternalLink } from 'lucide-react';

interface ApiKeyInputProps {
    apiKey: string;
    onApiKeyChange: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
    const [showKey, setShowKey] = useState(false);
    const [inputValue, setInputValue] = useState(apiKey);
    const [isEditing, setIsEditing] = useState(!apiKey);

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
        <div className="w-full max-w-2xl mx-auto px-4 mb-8">
            <div className="glass-panel rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-tech-400" />
                        <span className="text-sm font-medium text-slate-300">Gemini API Key</span>
                        {apiKey && !isEditing && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" />
                                Configured
                            </span>
                        )}
                    </div>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-tech-400 transition-colors">
                        Get API Key
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                {isEditing || !apiKey ? (
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter your Gemini API key..."
                                autoComplete="off"
                                data-form-type="other"
                                className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-tech-500/50 focus:ring-1 focus:ring-tech-500/20 transition-all pr-10"
                                style={!showKey ? ({ WebkitTextSecurity: 'disc' } as React.CSSProperties) : undefined}
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
                                    : 'bg-dark-card text-slate-500 cursor-not-allowed'
                            }`}>
                            Save
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-sm text-slate-400 font-mono">
                            {showKey ? apiKey : maskedKey}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="p-2.5 bg-dark-card border border-dark-border rounded-lg text-slate-400 hover:text-white hover:border-tech-500/30 transition-all">
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => {
                                setInputValue(apiKey);
                                setIsEditing(true);
                            }}
                            className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-slate-400 hover:text-white hover:border-tech-500/30 transition-all">
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
                    Your API key is stored locally in your browser and never sent to any server other than Google's
                    Gemini API.
                </p>
            </div>
        </div>
    );
};
