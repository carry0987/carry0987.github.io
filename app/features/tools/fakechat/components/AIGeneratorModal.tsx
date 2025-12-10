import React, { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Sparkles, Loader2, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { Modal } from './ui';

const MOOD_OPTIONS = [
    { id: 'casual', label: 'Casual & Funny', emoji: '😄' },
    { id: 'romantic', label: 'Romantic', emoji: '💕' },
    { id: 'angry', label: 'Angry / Argument', emoji: '😡' },
    { id: 'formal', label: 'Formal / Business', emoji: '💼' },
    { id: 'sad', label: 'Sad / Emotional', emoji: '😢' },
    { id: 'sarcastic', label: 'Sarcastic', emoji: '😏' }
];

interface AIGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (topic: string, mood: string) => Promise<void>;
    isLoading: boolean;
    hasApiKey: boolean;
}

const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose, onGenerate, isLoading, hasApiKey }) => {
    const [topic, setTopic] = useState('');
    const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate(topic, selectedMood.label);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles size={20} />
                        AI Script Generator
                    </h2>
                    <p className="text-purple-100 text-sm mt-1">Powered by Google Gemini</p>
                </div>
            }
            headerClassName="bg-linear-to-r from-purple-600 to-tech-600 text-white">
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
                    <Listbox value={selectedMood} onChange={setSelectedMood}>
                        <ListboxButton className="relative w-full p-3 pr-10 bg-slate-800/50 border border-white/10 rounded-xl text-left text-white focus:outline-none data-[focus]:ring-2 data-[focus]:ring-purple-500 cursor-pointer hover:bg-slate-800/70 transition-colors">
                            <span className="flex items-center gap-2">
                                <span>{selectedMood.emoji}</span>
                                <span>{selectedMood.label}</span>
                            </span>
                            <ChevronDown
                                size={18}
                                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                            />
                        </ListboxButton>
                        <ListboxOptions
                            anchor="bottom"
                            transition
                            className="w-[var(--button-width)] rounded-xl border border-white/10 bg-slate-800 p-1 shadow-xl [--anchor-gap:4px] focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0">
                            {MOOD_OPTIONS.map((mood) => (
                                <ListboxOption
                                    key={mood.id}
                                    value={mood}
                                    className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 select-none data-[focus]:bg-purple-500/20 text-slate-300 data-[selected]:text-purple-400">
                                    <Check
                                        size={16}
                                        className="invisible text-purple-400 group-data-[selected]:visible"
                                    />
                                    <span>{mood.emoji}</span>
                                    <span>{mood.label}</span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !topic.trim() || !hasApiKey}
                    className="w-full bg-tech-600 text-white py-3 rounded-xl font-medium hover:bg-tech-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition border border-tech-500/30 cursor-pointer">
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
        </Modal>
    );
};

export default AIGeneratorModal;
