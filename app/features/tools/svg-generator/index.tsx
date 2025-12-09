import { InputSection } from './components/InputSection';
import { ApiKeyInput } from './components/ApiKeyInput';
import { SvgPreview } from './components/SvgPreview';
import { generateSvgFromPrompt } from './services/geminiService';
import { type GeneratedSvg, GenerationStatus, type ApiError } from './types';
import React, { useState, useEffect } from 'react';
import { getLocalValue, setLocalValue } from '@carry0987/utils';
import { AlertCircle } from 'lucide-react';

// Import CSS
import './style.css';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

const App: React.FC = () => {
    const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
    const [currentSvg, setCurrentSvg] = useState<GeneratedSvg | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const [apiKey, setApiKey] = useState<string>('');

    // Load API key from localStorage on mount
    useEffect(() => {
        const savedKey = getLocalValue<string>(API_KEY_STORAGE_KEY);
        if (savedKey) {
            setApiKey(savedKey);
        }
    }, []);

    const handleApiKeyChange = (key: string) => {
        setApiKey(key);
        setLocalValue(API_KEY_STORAGE_KEY, key || null);
    };

    const handleGenerate = async (prompt: string) => {
        if (!apiKey) {
            setError({
                message: 'API Key Required',
                details: 'Please enter your Gemini API key in the settings above before generating.'
            });
            return;
        }

        setStatus(GenerationStatus.LOADING);
        setError(null);
        setCurrentSvg(null);

        try {
            const svgContent = await generateSvgFromPrompt(prompt, apiKey);

            const newSvg: GeneratedSvg = {
                id: crypto.randomUUID(),
                content: svgContent,
                prompt: prompt,
                timestamp: Date.now()
            };

            setCurrentSvg(newSvg);
            setStatus(GenerationStatus.SUCCESS);
        } catch (err: any) {
            setStatus(GenerationStatus.ERROR);
            setError({
                message: 'Generation Failed',
                details: err.message || 'An unexpected error occurred while contacting Gemini.'
            });
        }
    };

    return (
        <div className="min-h-screen text-slate-200 font-sans selection:bg-tech-500/30">
            <main className="pb-20">
                <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
                <InputSection onGenerate={handleGenerate} status={status} hasApiKey={!!apiKey} />

                {status === GenerationStatus.ERROR && error && (
                    <div className="max-w-2xl mx-auto mt-8 px-4">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-200">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-red-400">{error.message}</h4>
                                <p className="text-sm text-red-300/70 mt-1">{error.details}</p>
                            </div>
                        </div>
                    </div>
                )}

                {status === GenerationStatus.SUCCESS && currentSvg && <SvgPreview data={currentSvg} />}

                {/* Empty State / Placeholder */}
                {status === GenerationStatus.IDLE && (
                    <div className="max-w-2xl mx-auto mt-16 text-center px-4 opacity-50 pointer-events-none select-none">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-dark-card/50 border border-dark-border mb-4">
                            <svg
                                className="w-12 h-12 text-slate-700"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                        <p className="text-slate-600 text-sm">Generated artwork will appear here</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export function meta() {
    return [
        { title: 'SVG Generator | Carry' },
        {
            property: 'og:title',
            content: 'SVG Generator'
        },
        {
            name: 'description',
            content: 'SVG Generator - Generate custom SVG graphics using AI-powered prompts with Gemini API.'
        }
    ];
}

export default App;
