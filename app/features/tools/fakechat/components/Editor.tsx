import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { ChatSettings, Message, Platform, ExportData } from '../types';
import {
    Plus,
    Trash2,
    Wand2,
    Upload,
    Download,
    RefreshCw,
    Mic,
    Type,
    Image as ImageIcon,
    X,
    Save,
    GripVertical,
    FileUp,
    FileDown,
    Smile,
    MessageCircle,
    Clock3,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { PLATFORMS, EMOJI_STICKERS } from '../constants';
import { Modal, AlertDialog, ConfirmDialog, TimeInput } from './ui';

interface EditorProps {
    settings: ChatSettings;
    setSettings: React.Dispatch<React.SetStateAction<ChatSettings>>;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    platform: Platform;
    setPlatform: (p: Platform) => void;
    onGenerateAI: () => void;
    onDownload: () => void;
    onReset: () => void;
}

export interface EditorRef {
    selectMessage: (msg: Message) => void;
}

const Editor = forwardRef<EditorRef, EditorProps>(
    (
        { settings, setSettings, messages, setMessages, platform, setPlatform, onGenerateAI, onDownload, onReset },
        ref
    ) => {
        const [inputType, setInputType] = useState<'text' | 'voice'>('text');
        const [newMessageText, setNewMessageText] = useState('');
        const [voiceDuration, setVoiceDuration] = useState(10);
        const [isSender, setIsSender] = useState(true);
        const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
        const [messageTimestamp, setMessageTimestamp] = useState(settings.time);
        const [showEmojiPicker, setShowEmojiPicker] = useState(false);
        const [showBatchTimeModal, setShowBatchTimeModal] = useState(false);
        const [batchTimeOffset, setBatchTimeOffset] = useState(0);
        const [showMessageList, setShowMessageList] = useState(false);

        // Dialog states
        const [showImportConfirm, setShowImportConfirm] = useState(false);
        const [pendingImportData, setPendingImportData] = useState<ExportData | null>(null);
        const [showInvalidFileAlert, setShowInvalidFileAlert] = useState(false);
        const [showParseErrorAlert, setShowParseErrorAlert] = useState(false);

        // Drag and drop state
        const [draggedId, setDraggedId] = useState<string | null>(null);
        const [dragOverId, setDragOverId] = useState<string | null>(null);

        const fileInputRef = useRef<HTMLInputElement>(null);

        // Sync message timestamp with settings time when not editing and settings time changes
        useEffect(() => {
            if (!editingMessageId) {
                setMessageTimestamp(settings.time);
            }
        }, [settings.time, editingMessageId]);

        // --- Drag and Drop Handlers ---
        const handleDragStart = (e: React.DragEvent, id: string) => {
            setDraggedId(id);
            e.dataTransfer.effectAllowed = 'move';
        };

        const handleDragOver = (e: React.DragEvent, id: string) => {
            e.preventDefault();
            if (draggedId !== id) {
                setDragOverId(id);
            }
        };

        const handleDragLeave = () => {
            setDragOverId(null);
        };

        const handleDrop = (e: React.DragEvent, targetId: string) => {
            e.preventDefault();
            if (!draggedId || draggedId === targetId) {
                setDraggedId(null);
                setDragOverId(null);
                return;
            }

            const newMessages = [...messages];
            const draggedIndex = newMessages.findIndex((m) => m.id === draggedId);
            const targetIndex = newMessages.findIndex((m) => m.id === targetId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const [removed] = newMessages.splice(draggedIndex, 1);
                newMessages.splice(targetIndex, 0, removed);
                setMessages(newMessages);
            }

            setDraggedId(null);
            setDragOverId(null);
        };

        const handleDragEnd = () => {
            setDraggedId(null);
            setDragOverId(null);
        };

        // --- Export/Import Handlers ---
        const handleExport = () => {
            const exportData: ExportData = {
                version: '1.0',
                platform,
                settings,
                messages,
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `fakechat-${platform}-${Date.now()}.json`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        };

        const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target?.result as string) as ExportData;
                        if (data.version && data.messages && data.settings) {
                            setPendingImportData(data);
                            setShowImportConfirm(true);
                        } else {
                            setShowInvalidFileAlert(true);
                        }
                    } catch {
                        setShowParseErrorAlert(true);
                    }
                };
                reader.readAsText(e.target.files[0]);
            }
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        const handleConfirmImport = () => {
            if (pendingImportData) {
                setPlatform(pendingImportData.platform);
                setSettings(pendingImportData.settings);
                setMessages(pendingImportData.messages);
                setPendingImportData(null);
            }
        };

        // --- Batch Time Adjustment ---
        const handleBatchTimeAdjust = () => {
            if (batchTimeOffset === 0) return;

            const updatedMessages = messages.map((msg) => {
                const [hours, minutes] = msg.timestamp.split(':').map(Number);
                const totalMinutes = hours * 60 + minutes + batchTimeOffset;
                const newHours = Math.floor((((totalMinutes % 1440) + 1440) % 1440) / 60);
                const newMinutes = ((totalMinutes % 60) + 60) % 60;
                return {
                    ...msg,
                    timestamp: `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
                };
            });

            setMessages(updatedMessages);
            setShowBatchTimeModal(false);
            setBatchTimeOffset(0);
        };

        // --- Emoji Insert ---
        const handleEmojiInsert = (emoji: string) => {
            setNewMessageText((prev) => prev + emoji);
            setShowEmojiPicker(false);
        };

        const handleSaveMessage = () => {
            if (inputType === 'text' && !newMessageText.trim()) return;

            if (editingMessageId) {
                // Update existing message
                setMessages(
                    messages.map((msg) => {
                        if (msg.id === editingMessageId) {
                            const updatedMsg: Message = {
                                id: msg.id, // Keep ID
                                isSender,
                                timestamp: messageTimestamp, // Update timestamp
                                isRead: msg.isRead,
                                reaction: msg.reaction
                            };

                            if (msg.image && inputType === 'text' && !newMessageText) {
                                // Case: Switching from Image to empty text? Prevent or handle.
                                // If we are in text mode, we use text.
                            }

                            if (inputType === 'text') {
                                updatedMsg.text = newMessageText;
                            } else {
                                updatedMsg.audioDuration = voiceDuration;
                            }
                            return updatedMsg;
                        }
                        return msg;
                    })
                );
                handleCancelEdit();
            } else {
                // Add new message
                const newMsg: Message = {
                    id: Date.now().toString(),
                    isSender,
                    timestamp: messageTimestamp,
                    isRead: true
                };

                if (inputType === 'text') {
                    newMsg.text = newMessageText;
                    setNewMessageText('');
                } else {
                    newMsg.audioDuration = voiceDuration;
                }

                setMessages([...messages, newMsg]);
            }
        };

        const handleSelectMessage = (msg: Message) => {
            setEditingMessageId(msg.id);
            setIsSender(msg.isSender);
            setMessageTimestamp(msg.timestamp);

            if (msg.audioDuration) {
                setInputType('voice');
                setVoiceDuration(msg.audioDuration);
                setNewMessageText('');
            } else {
                setInputType('text');
                setNewMessageText(msg.text || '');
            }
        };

        // Expose selectMessage method via ref
        useImperativeHandle(ref, () => ({
            selectMessage: handleSelectMessage
        }));

        const handleCancelEdit = () => {
            setEditingMessageId(null);
            setNewMessageText('');
            setVoiceDuration(10);
            setInputType('text');
            setIsSender(true);
            setMessageTimestamp(settings.time);
        };

        const handleImageUpload = (
            e: React.ChangeEvent<HTMLInputElement>,
            target: 'message' | 'partner' | 'me' | 'background'
        ) => {
            if (e.target.files && e.target.files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                if (target === 'message') {
                    if (editingMessageId) {
                        // Replace content of editing message with image
                        setMessages(
                            messages.map((m) => {
                                if (m.id === editingMessageId) {
                                    return {
                                        id: m.id,
                                        isSender,
                                        image: url,
                                        timestamp: messageTimestamp,
                                        isRead: m.isRead,
                                        reaction: m.reaction
                                    };
                                }
                                return m;
                            })
                        );
                        handleCancelEdit();
                    } else {
                        const newMsg: Message = {
                            id: Date.now().toString(),
                            image: url,
                            isSender,
                            timestamp: messageTimestamp,
                            isRead: true
                        };
                        setMessages([...messages, newMsg]);
                    }
                } else if (target === 'partner') {
                    setSettings({ ...settings, partnerAvatar: url });
                } else if (target === 'me') {
                    setSettings({ ...settings, myAvatar: url });
                } else if (target === 'background') {
                    setSettings({ ...settings, backgroundImage: url });
                }
            }
        };

        const deleteMessage = (e: React.MouseEvent, id: string) => {
            e.stopPropagation(); // Prevent triggering select
            setMessages(messages.filter((m) => m.id !== id));
            if (editingMessageId === id) {
                handleCancelEdit();
            }
        };

        return (
            <div className="h-full flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto bg-slate-900/50 text-slate-200">
                {/* Title */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">Chat Editor</h1>
                    <div className="flex gap-1">
                        <button
                            onClick={handleExport}
                            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Export Chat">
                            <FileDown size={18} />
                        </button>
                        <label
                            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Import Chat">
                            <FileUp size={18} />
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".json"
                                onChange={handleImport}
                            />
                        </label>
                        <button
                            onClick={onReset}
                            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Reset">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* Platform Selection */}
                <div className="flex p-1 bg-slate-800/50 rounded-xl border border-white/5">
                    {PLATFORMS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPlatform(p.id)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                platform === p.id
                                    ? 'bg-tech-500/20 text-tech-400 border border-tech-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}>
                            {p.name}
                        </button>
                    ))}
                </div>

                {/* Settings Group */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Settings</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                            <TimeInput
                                value={settings.time}
                                onChange={(time) => setSettings({ ...settings, time })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Battery %</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={settings.batteryLevel}
                                onChange={(e) => setSettings({ ...settings, batteryLevel: parseInt(e.target.value) })}
                                className="w-full p-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-tech-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Partner Name</label>
                        <input
                            type="text"
                            value={settings.partnerName}
                            onChange={(e) => setSettings({ ...settings, partnerName: e.target.value })}
                            className="w-full p-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-tech-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Partner Avatar</label>
                            <div className="flex items-center gap-3">
                                <img
                                    src={settings.partnerAvatar}
                                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                                />
                                <label className="cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 px-3 py-1.5 rounded-md text-xs border border-white/10 transition">
                                    Change
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'partner')}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Chat Background</label>
                            <div className="flex items-center gap-3">
                                {settings.backgroundImage ? (
                                    <div className="relative w-10 h-10">
                                        <img
                                            src={settings.backgroundImage}
                                            className="w-full h-full rounded-lg object-cover border border-white/10"
                                        />
                                        <button
                                            onClick={() => setSettings({ ...settings, backgroundImage: undefined })}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-lg border border-dashed border-white/20 flex items-center justify-center bg-slate-800/50">
                                        <ImageIcon size={16} className="text-slate-500" />
                                    </div>
                                )}
                                <label className="cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 px-3 py-1.5 rounded-md text-xs border border-white/10 transition">
                                    Upload
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'background')}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Typing Indicator Toggle */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-300">Show Typing Indicator</span>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, isTyping: !settings.isTyping })}
                            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.isTyping ? 'bg-tech-500' : 'bg-slate-700'}`}>
                            <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.isTyping ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                </div>

                <hr className="border-white/10" />

                {/* Message Editor */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                            {editingMessageId ? 'Editing Message' : 'Messages'}
                        </h3>
                        <button
                            onClick={onGenerateAI}
                            className="flex items-center gap-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-full transition-colors border border-purple-500/20 cursor-pointer">
                            <Wand2 size={14} />
                            AI Generate
                        </button>
                    </div>

                    {/* Editor Input Area */}
                    <div
                        className={`p-4 rounded-xl border space-y-3 transition-colors ${editingMessageId ? 'bg-tech-500/10 border-tech-500/30' : 'bg-slate-800/50 border-white/10'}`}>
                        {/* Top Row: Sender & Time */}
                        <div className="flex gap-3">
                            {/* Sender Toggle */}
                            <div className="flex-1 bg-slate-900/50 p-1 rounded-lg flex gap-1 border border-white/10">
                                <button
                                    onClick={() => setIsSender(false)}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${!isSender ? 'bg-slate-700 shadow text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                                    Them
                                </button>
                                <button
                                    onClick={() => setIsSender(true)}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${isSender ? 'bg-tech-500/20 shadow text-tech-400' : 'text-slate-400 hover:bg-slate-800'}`}>
                                    Me
                                </button>
                            </div>

                            {/* Message Time Input */}
                            <TimeInput
                                value={messageTimestamp}
                                onChange={setMessageTimestamp}
                                className="w-28"
                            />
                        </div>

                        {/* Input Type Toggle */}
                        <div
                            className={`flex items-center gap-2 border-b pb-2 ${editingMessageId ? 'border-tech-500/30' : 'border-white/10'}`}>
                            <button
                                onClick={() => setInputType('text')}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition ${inputType === 'text' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                                <Type size={14} /> Text
                            </button>
                            <button
                                onClick={() => setInputType('voice')}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition ${inputType === 'voice' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                                <Mic size={14} /> Voice
                            </button>
                        </div>

                        {/* Input Area */}
                        {inputType === 'text' ? (
                            <div className="relative">
                                <textarea
                                    value={newMessageText}
                                    onChange={(e) => setNewMessageText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-tech-500 outline-none resize-none h-20"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSaveMessage();
                                        }
                                    }}
                                />
                                <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">
                                    {newMessageText.length} chars
                                </div>
                            </div>
                        ) : (
                            <div className="h-20 flex flex-col justify-center px-2 space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Duration: {voiceDuration}s</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    value={voiceDuration}
                                    onChange={(e) => setVoiceDuration(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-tech-500"
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-1">
                                <label
                                    className="cursor-pointer text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Upload Image">
                                    <Upload size={18} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'message')}
                                    />
                                </label>
                                {/* Emoji Picker */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Insert Emoji">
                                        <Smile size={18} />
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full left-0 mb-2 p-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-50 w-64">
                                            <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                                                {EMOJI_STICKERS.map((emoji, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleEmojiInsert(emoji)}
                                                        className="w-7 h-7 flex items-center justify-center text-lg hover:bg-white/10 rounded transition cursor-pointer">
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {editingMessageId && (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-slate-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer">
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleSaveMessage}
                                    disabled={inputType === 'text' && !newMessageText.trim()}
                                    className={`${editingMessageId ? 'bg-tech-600 hover:bg-tech-500 hover:shadow-lg hover:shadow-tech-500/20' : 'bg-tech-600 hover:bg-tech-500 hover:shadow-lg hover:shadow-tech-500/20'} text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 cursor-pointer border border-tech-500/30 hover:border-tech-400/50`}>
                                    {editingMessageId ? <Save size={16} /> : <Plus size={16} />}
                                    {editingMessageId ? 'Update' : inputType === 'voice' ? 'Add Voice' : 'Add Message'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Message List Header - Collapsible */}
                    <div
                        onClick={() => setShowMessageList(!showMessageList)}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2">
                            {showMessageList ? (
                                <ChevronUp size={16} className="text-slate-400" />
                            ) : (
                                <ChevronDown size={16} className="text-slate-400" />
                            )}
                            <span className="text-sm font-medium text-slate-300">Message List</span>
                            <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">
                                {messages.length}
                            </span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowBatchTimeModal(true);
                            }}
                            disabled={messages.length === 0}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Batch adjust timestamps">
                            <Clock3 size={12} />
                            Batch Time
                        </button>
                    </div>

                    {/* Message List (Compact) with Drag & Drop - Collapsible */}
                    {showMessageList && (
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 animate-in slide-in-from-top-2 duration-200">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, msg.id)}
                                    onDragOver={(e) => handleDragOver(e, msg.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, msg.id)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => handleSelectMessage(msg)}
                                    className={`group flex items-center justify-between p-2 rounded-lg border transition cursor-pointer ${
                                        editingMessageId === msg.id
                                            ? 'bg-tech-500/10 border-tech-500/30 ring-1 ring-tech-500/30'
                                            : dragOverId === msg.id
                                              ? 'bg-tech-500/5 border-tech-500/20'
                                              : draggedId === msg.id
                                                ? 'opacity-50'
                                                : 'hover:bg-white/5 border-transparent hover:border-white/10'
                                    }`}>
                                    {/* Drag Handle */}
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <GripVertical
                                            size={14}
                                            className="text-slate-600 cursor-grab active:cursor-grabbing shrink-0"
                                        />
                                        <span
                                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${msg.isSender ? 'bg-tech-500/20 text-tech-400' : 'bg-slate-700 text-slate-300'}`}>
                                            {msg.isSender ? 'Me' : 'Them'}
                                        </span>
                                        <div className="flex flex-col overflow-hidden">
                                            <p className="text-sm text-slate-300 truncate max-w-[120px]">
                                                {msg.image
                                                    ? '📷 [Image]'
                                                    : msg.audioDuration
                                                      ? `🎤 Voice (${msg.audioDuration}s)`
                                                      : msg.text}
                                            </p>
                                            {editingMessageId === msg.id && (
                                                <span className="text-[10px] text-tech-400 font-medium">
                                                    Editing...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => deleteMessage(e, msg.id)}
                                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition opacity-0 group-hover:opacity-100"
                                            title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <p className="text-center text-xs text-slate-500 py-4">No messages yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Batch Time Adjustment Modal */}
                <Modal
                    isOpen={showBatchTimeModal}
                    onClose={() => {
                        setShowBatchTimeModal(false);
                        setBatchTimeOffset(0);
                    }}
                    title={
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock3 size={20} className="text-tech-400" />
                            Batch Time Adjust
                        </h3>
                    }
                    maxWidth="sm">
                    <div className="p-6 pt-0">
                        <p className="text-sm text-slate-400 mb-4">Adjust all message timestamps by a fixed amount.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">
                                    Time Offset (minutes)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="-120"
                                        max="120"
                                        value={batchTimeOffset}
                                        onChange={(e) => setBatchTimeOffset(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-tech-500"
                                    />
                                    <span
                                        className={`w-16 text-center text-sm font-medium ${batchTimeOffset > 0 ? 'text-green-400' : batchTimeOffset < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                        {batchTimeOffset > 0 ? '+' : ''}
                                        {batchTimeOffset}m
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowBatchTimeModal(false);
                                        setBatchTimeOffset(0);
                                    }}
                                    className="flex-1 py-2 rounded-lg text-slate-300 hover:bg-white/10 transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBatchTimeAdjust}
                                    disabled={batchTimeOffset === 0}
                                    className="flex-1 py-2 rounded-lg bg-tech-600 text-white hover:bg-tech-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Import Confirm Dialog */}
                <ConfirmDialog
                    isOpen={showImportConfirm}
                    onClose={() => {
                        setShowImportConfirm(false);
                        setPendingImportData(null);
                    }}
                    onConfirm={handleConfirmImport}
                    title="Import Chat"
                    message="Import will replace current chat. Continue?"
                    confirmText="Import"
                    cancelText="Cancel"
                    type="warning"
                />

                {/* Invalid File Format Alert */}
                <AlertDialog
                    isOpen={showInvalidFileAlert}
                    onClose={() => setShowInvalidFileAlert(false)}
                    title="Invalid File"
                    message="Invalid file format. Please select a valid FakeChat export file."
                    type="error"
                />

                {/* Parse Error Alert */}
                <AlertDialog
                    isOpen={showParseErrorAlert}
                    onClose={() => setShowParseErrorAlert(false)}
                    title="Parse Error"
                    message="Failed to parse JSON file. Please check if the file is valid."
                    type="error"
                />

                <div className="mt-auto pt-6">
                    <button
                        onClick={onDownload}
                        className="w-full bg-tech-600 hover:bg-tech-500 hover:shadow-xl hover:shadow-tech-500/20 hover:-translate-y-0.5 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-tech-900/30 transition-all duration-200 transform active:scale-95 border border-tech-500/30 hover:border-tech-400/50 cursor-pointer">
                        <Download size={20} />
                        Download Screenshot
                    </button>
                </div>
            </div>
        );
    }
);

export default Editor;
