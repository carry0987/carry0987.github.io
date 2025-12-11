import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { toPng } from 'html-to-image';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ArrowLeft, MessageCircle, Smartphone, Wand2, Download, ChevronDown, Check } from 'lucide-react';
import { getLocalValue, setLocalValue } from '@carry0987/utils';
import type { ChatSettings, Message, Platform, PhoneModel } from './types';
import { DEFAULT_SETTINGS, INITIAL_MESSAGES, PHONE_MODELS, DEFAULT_PHONE_MODEL } from './constants';
import ChatPreview from './components/ChatPreview';
import Editor, { type EditorRef } from './components/Editor';
import AIGeneratorModal from './components/AIGeneratorModal';
import ApiKeyInput from './components/ApiKeyInput';
import { AlertDialog, ConfirmDialog } from './components/ui';
import { generateConversation } from './services/geminiService';
import { saveChatData, loadChatData, clearChatData } from './services/storageService';

// Import styles
import './style.css';

const API_KEY_STORAGE_KEY = 'fakechat_gemini_api_key';

const App: React.FC = () => {
    const [platform, setPlatform] = useState<Platform>('instagram');
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
    const [phoneModel, setPhoneModel] = useState<PhoneModel>(DEFAULT_PHONE_MODEL);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiKey, setApiKey] = useState<string>('');

    // Dialog states
    const [showImageErrorAlert, setShowImageErrorAlert] = useState(false);
    const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);
    const [showAIErrorAlert, setShowAIErrorAlert] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<EditorRef>(null);

    // Load saved data from IndexedDB on mount
    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const savedData = await loadChatData();
                if (savedData) {
                    setPlatform(savedData.platform);
                    setSettings(savedData.settings);
                    setMessages(savedData.messages);
                }
            } catch (error) {
                console.error('Failed to load saved chat data:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadSavedData();
    }, []);

    // Save data to IndexedDB whenever it changes
    useEffect(() => {
        if (!isLoaded) return;
        saveChatData(platform, settings, messages);
    }, [platform, settings, messages, isLoaded]);

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
                setShowImageErrorAlert(true);
            }
        }
    };

    const handleGenerateAI = async (topic: string, mood: string) => {
        if (!apiKey) {
            setShowApiKeyAlert(true);
            return;
        }
        setIsGenerating(true);
        try {
            const newMessages = await generateConversation(topic, platform, mood, apiKey);
            setMessages(newMessages);
            setIsAIModalOpen(false);
        } catch (error) {
            setShowAIErrorAlert(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateMessage = (id: string, updates: Partial<Message>) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    };

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const handleConfirmReset = async () => {
        setMessages(INITIAL_MESSAGES);
        setSettings(DEFAULT_SETTINGS);
        setPlatform('instagram');
        await clearChatData();
    };

    return (
        <div className="animate-slide-up">
            {/* Back Link */}
            <Link
                to="/tools"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-tech-400 transition-colors mb-8 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Tools</span>
            </Link>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-tech-500/10 rounded-xl text-tech-400 border border-tech-500/20">
                    <MessageCircle size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Fake Chat</h1>
                    <p className="text-slate-400 text-sm mt-1">Create realistic chat screenshots for mockups</p>
                </div>
            </div>

            {/* Main Content - Editor and Preview */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-dark-card/30">
                <div className="flex flex-col lg:flex-row min-h-[700px]">
                    {/* Left Panel - Editor */}
                    <div className="w-full lg:w-[420px] lg:shrink-0 border-b lg:border-b-0 lg:border-r border-white/10">
                        <Editor
                            ref={editorRef}
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
                    <div className="flex-1 bg-linear-to-br from-slate-900/80 via-slate-900/50 to-slate-800/30 flex flex-col items-center justify-center p-4 lg:p-8 relative min-h-[500px] lg:min-h-0 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.03)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none"></div>

                        {/* Preview Header with Phone Model Selector */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Smartphone size={14} />
                                <span className="text-xs font-medium uppercase tracking-wider">Preview</span>
                            </div>
                            <Listbox value={phoneModel} onChange={setPhoneModel}>
                                <ListboxButton className="relative w-50 bg-slate-800/80 text-slate-300 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg border border-white/10 hover:border-white/20 focus:outline-none data-focus:border-tech-500/50 data-focus:ring-2 data-focus:ring-tech-500/20 cursor-pointer transition-all text-left">
                                    <span className="truncate block">{phoneModel.name}</span>
                                    <ChevronDown
                                        size={12}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                                    />
                                </ListboxButton>
                                <ListboxOptions
                                    anchor="bottom"
                                    transition
                                    className="w-(--button-width) rounded-xl border border-white/10 bg-slate-800 p-1 shadow-xl [--anchor-gap:4px] focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0 z-50">
                                    {PHONE_MODELS.map((model) => (
                                        <ListboxOption
                                            key={model.id}
                                            value={model}
                                            className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 select-none data-focus:bg-tech-500/20 text-slate-300 data-selected:text-tech-400 text-xs">
                                            <Check
                                                size={14}
                                                className="invisible text-tech-400 group-data-selected:visible"
                                            />
                                            <span>{model.name}</span>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>

                        {/* Phone Preview with Shadow */}
                        <div className="relative transform scale-[0.55] sm:scale-[0.65] md:scale-75 lg:scale-90 xl:scale-100 origin-top">
                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-linear-to-b from-tech-500/10 via-purple-500/5 to-transparent blur-2xl rounded-[3rem] pointer-events-none"></div>
                            <ChatPreview
                                ref={previewRef}
                                platform={platform}
                                phoneModel={phoneModel}
                                messages={messages}
                                settings={settings}
                                onUpdateMessage={handleUpdateMessage}
                                onSelectMessage={(msg) => editorRef.current?.selectMessage(msg)}
                            />
                        </div>

                        {/* Hint Text */}
                        <p className="mt-4 text-xs text-slate-600 text-center">
                            Click on a message to edit • Long press for reactions (Instagram)
                        </p>
                    </div>
                </div>
            </div>

            {/* API Key Input - For AI Generation */}
            <div className="mt-8">
                <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
            </div>

            <AIGeneratorModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onGenerate={handleGenerateAI}
                isLoading={isGenerating}
                hasApiKey={!!apiKey}
            />

            {/* Image Error Alert */}
            <AlertDialog
                isOpen={showImageErrorAlert}
                onClose={() => setShowImageErrorAlert(false)}
                title="Image Generation Failed"
                message="Could not generate image. Please try again."
                type="error"
            />

            {/* API Key Alert */}
            <AlertDialog
                isOpen={showApiKeyAlert}
                onClose={() => setShowApiKeyAlert(false)}
                title="API Key Required"
                message="Please enter your Gemini API key first."
                type="warning"
            />

            {/* AI Generation Error Alert */}
            <AlertDialog
                isOpen={showAIErrorAlert}
                onClose={() => setShowAIErrorAlert(false)}
                title="AI Generation Failed"
                message="AI Generation failed. Please check your API key or try again."
                type="error"
            />

            {/* Reset Confirm Dialog */}
            <ConfirmDialog
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={handleConfirmReset}
                title="Reset Chat"
                message="Reset all messages and settings?"
                confirmText="Reset"
                cancelText="Cancel"
                type="danger"
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
