import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AIGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (topic: string, mood: string) => Promise<void>;
    isLoading: boolean;
}

const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-linear-to-r from-purple-600 to-blue-600 p-6 text-white flex justify-between items-start">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What is the conversation about?
                        </label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Breaking up over text, planning a surprise party, complaining about work..."
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none h-24 resize-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone / Mood</label>
                        <select
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white">
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
                        disabled={isLoading || !topic.trim()}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition">
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
