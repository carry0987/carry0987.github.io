import React, { useState } from 'react';
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface AIGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (topic: string, mood: string) => Promise<void>;
    isLoading: boolean;
    hasApiKey: boolean;
}

const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose, onGenerate, isLoading, hasApiKey }) => {
    const [topic, setTopic] = useState('');
    const [mood, setMood] = useState('Casual');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate(topic, mood);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/10">
                <div className="bg-linear-to-r from-purple-600 to-tech-600 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Sparkles size={20} />
                            AI Script Generator
                        </h2>
                        <p className="text-purple-100 text-sm mt-1">Powered by Google Gemini</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {!hasApiKey && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-amber-200">
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-amber-400">API Key Required</h4>
                                <p className="text-sm text-amber-300/70 mt-1">
                                    Please configure your Gemini API key in the settings above before generating.
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            What is the conversation about?
                        </label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Breaking up over text, planning a surprise party, complaining about work..."
                            className="w-full p-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none h-24 resize-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Tone / Mood</label>
                        <select
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="w-full p-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none">
                            <option>Casual & Funny</option>
                            <option>Romantic</option>
                            <option>Angry / Argument</option>
                            <option>Formal / Business</option>
                            <option>Sad / Emotional</option>
                            <option>Sarcastic</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim() || !hasApiKey}
                        className="w-full bg-tech-600 text-white py-3 rounded-xl font-medium hover:bg-tech-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition border border-tech-500/30">
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Generating Magic...
                            </>
                        ) : (
                            'Generate Script'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIGeneratorModal;
