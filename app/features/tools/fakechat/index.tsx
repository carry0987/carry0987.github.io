import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import type { ChatSettings, Message, Platform } from './types';
import { DEFAULT_SETTINGS, INITIAL_MESSAGES } from './constants';
import ChatPreview from './components/ChatPreview';
import Editor from './components/Editor';
import AIGeneratorModal from './components/AIGeneratorModal';
import { generateConversation } from './services/geminiService';

const App: React.FC = () => {
    const [platform, setPlatform] = useState<Platform>('instagram');
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (previewRef.current) {
            try {
                // cacheBust is removed because it appends query parameters that break Google Fonts URLs
                // and can cause CORS issues with other external resources.
                const dataUrl = await toPng(previewRef.current, {
                    pixelRatio: 2,
                    skipAutoScale: true
                });
                const link = document.createElement('a');
                link.download = `fakechat-${platform}-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Failed to generate image', err);
                alert('Could not generate image. Please try again.');
            }
        }
    };

    const handleGenerateAI = async (topic: string, mood: string) => {
        setIsGenerating(true);
        try {
            const newMessages = await generateConversation(topic, platform, mood);
            setMessages(newMessages);
            setIsAIModalOpen(false);
        } catch (error) {
            alert('AI Generation failed. Please check your API key or try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateMessage = (id: string, updates: Partial<Message>) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    };

    const handleReset = () => {
        if (confirm('Reset all messages and settings?')) {
            setMessages(INITIAL_MESSAGES);
            setSettings(DEFAULT_SETTINGS);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
            {/* Left Panel - Editor */}
            <div className="w-full lg:w-[450px] lg:shrink-0 h-[50vh] lg:h-full z-20 shadow-xl">
                <Editor
                    settings={settings}
                    setSettings={setSettings}
                    messages={messages}
                    setMessages={setMessages}
                    platform={platform}
                    setPlatform={setPlatform}
                    onGenerateAI={() => setIsAIModalOpen(true)}
                    onDownload={handleDownload}
                    onReset={handleReset}
                />
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 h-[50vh] lg:h-full bg-[#f0f2f5] flex items-center justify-center p-4 lg:p-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-50 pointer-events-none"></div>
                <ChatPreview
                    ref={previewRef}
                    platform={platform}
                    messages={messages}
                    settings={settings}
                    onUpdateMessage={handleUpdateMessage}
                />
            </div>

            <AIGeneratorModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onGenerate={handleGenerateAI}
                isLoading={isGenerating}
            />
        </div>
    );
};

export function meta() {
    return [
        { title: 'Fake Chat | Carry' },
        {
            property: 'og:title',
            content: 'Fake Chat'
        },
        {
            name: 'description',
            content: 'Fake Chat - Create realistic fake chat screenshots for Instagram, LINE, and Messenger.'
        }
    ];
}

export default App;
