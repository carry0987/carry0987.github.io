import { forwardRef, useState, useEffect } from 'react';
import type { ChatSettings, Message, Platform } from '../types';
import {
    Wifi,
    Battery,
    Signal,
    ChevronLeft,
    Phone,
    Video,
    MoreVertical,
    Smile,
    Mic,
    Image as ImageIcon,
    ArrowLeft,
    MoreHorizontal,
    Play
} from 'lucide-react';

interface ChatPreviewProps {
    platform: Platform;
    messages: Message[];
    settings: ChatSettings;
    onUpdateMessage: (id: string, updates: Partial<Message>) => void;
}

const INSTAGRAM_REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const ChatPreview = forwardRef<HTMLDivElement, ChatPreviewProps>(
    ({ platform, messages, settings, onUpdateMessage }, ref) => {
        const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
        const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

        // --- Interaction Logic ---
        const handleTouchStart = (id: string) => {
            if (platform !== 'instagram') return;
            const timer = setTimeout(() => {
                setActiveReactionId(id);
            }, 500);
            setLongPressTimer(timer);
        };

        const handleTouchEnd = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                setLongPressTimer(null);
            }
        };

        const handleReactionSelect = (reaction: string) => {
            if (activeReactionId) {
                // Toggle reaction: if same clicked, remove it
                const currentMsg = messages.find((m) => m.id === activeReactionId);
                const newReaction = currentMsg?.reaction === reaction ? undefined : reaction;

                onUpdateMessage(activeReactionId, { reaction: newReaction });
                setActiveReactionId(null);
            }
        };

        // Close reaction picker when clicking outside
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (activeReactionId && !(e.target as Element).closest('.reaction-picker')) {
                    setActiveReactionId(null);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [activeReactionId]);

        // --- Platform Specific Styles & Components ---

        const renderHeader = () => {
            switch (platform) {
                case 'instagram':
                    return (
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 text-black">
                            <div className="flex items-center gap-3">
                                <ChevronLeft size={28} />
                                <div className="flex items-center gap-2">
                                    <img
                                        src={settings.partnerAvatar}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                    />
                                    <div>
                                        <h3 className="text-sm font-bold leading-tight">{settings.partnerName}</h3>
                                        <p className="text-[10px] text-gray-400 leading-tight">Active now</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 text-black">
                                <Phone size={24} />
                                <Video size={26} />
                            </div>
                        </div>
                    );
                case 'line':
                    return (
                        <div className="flex items-center justify-between px-4 py-3 bg-[#202732] text-white">
                            <div className="flex items-center gap-3">
                                <ChevronLeft size={24} />
                                <h3 className="text-lg font-medium">{settings.partnerName}</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone size={20} />
                                <MoreVertical size={20} />
                            </div>
                        </div>
                    );
                case 'telegram':
                    return (
                        <div className="flex items-center justify-between px-3 py-2 bg-[#517da2] text-white">
                            <div className="flex items-center gap-3">
                                <ArrowLeft size={24} />
                                <div className="flex items-center gap-2">
                                    <img
                                        src={settings.partnerAvatar}
                                        alt="avatar"
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-sm font-semibold leading-tight">{settings.partnerName}</h3>
                                        <p className="text-[11px] text-gray-200 opacity-80 leading-tight">
                                            last seen recently
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <MoreVertical size={22} />
                        </div>
                    );
                case 'tiktok':
                    return (
                        <div className="flex items-center justify-between px-4 py-3 bg-black text-white border-b border-gray-800">
                            <div className="flex items-center gap-4">
                                <ChevronLeft size={24} />
                                <div className="text-center">
                                    <h3 className="text-sm font-bold">{settings.partnerName}</h3>
                                </div>
                            </div>
                            <MoreHorizontal size={24} />
                        </div>
                    );
            }
        };

        const renderBackground = () => {
            switch (platform) {
                case 'line':
                    return 'bg-[#9BB8DB]'; // Classic Line blue
                case 'telegram':
                    return 'bg-[#89a2b5]'; // Default TG pattern color placeholder
                case 'tiktok':
                    return 'bg-black';
                case 'instagram':
                default:
                    return 'bg-white';
            }
        };

        // Typing Indicator Component
        const renderTypingIndicator = () => {
            const dotClasses = 'w-2 h-2 rounded-full animate-bounce';

            switch (platform) {
                case 'instagram':
                    return (
                        <div className="flex w-full mb-3 justify-start items-end gap-2">
                            <img src={settings.partnerAvatar} className="w-7 h-7 rounded-full object-cover mb-1" />
                            <div className="bg-[#efefef] px-4 py-3 rounded-3xl rounded-bl-md flex items-center gap-1.5">
                                <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '0ms' }} />
                                <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '150ms' }} />
                                <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    );
                case 'line':
                    return (
                        <div className="flex w-full mb-4 justify-start items-start gap-2">
                            <img src={settings.partnerAvatar} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-600 mb-1 ml-1">{settings.partnerName}</span>
                                <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-1.5 relative after:absolute after:top-2 after:-left-1 after:w-3 after:h-3 after:bg-white after:rotate-45">
                                    <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '0ms' }} />
                                    <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '150ms' }} />
                                    <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    );
                case 'telegram':
                    return (
                        <div className="flex w-full mb-2 justify-start gap-2">
                            <img
                                src={settings.partnerAvatar}
                                className="w-8 h-8 rounded-full object-cover self-end mb-1"
                            />
                            <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5">
                                <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '0ms' }} />
                                <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '150ms' }} />
                                <div className={`${dotClasses} bg-gray-400`} style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    );
                case 'tiktok':
                    return (
                        <div className="flex w-full mb-3 justify-start items-end gap-2">
                            <img src={settings.partnerAvatar} className="w-8 h-8 rounded-full object-cover mb-1" />
                            <div className="bg-[#383838] px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                                <div className={`${dotClasses} bg-gray-500`} style={{ animationDelay: '0ms' }} />
                                <div className={`${dotClasses} bg-gray-500`} style={{ animationDelay: '150ms' }} />
                                <div className={`${dotClasses} bg-gray-500`} style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        };

        // Helper to render voice visual
        const renderVoiceVisual = (isSender: boolean, duration: number, style: 'bars' | 'line' | 'wave' = 'bars') => {
            if (style === 'line') {
                return (
                    <div className="flex items-center gap-2 min-w-[120px]">
                        <div className={`p-1.5 rounded-full ${isSender ? 'bg-black/20' : 'bg-gray-200'}`}>
                            <Play size={12} fill="currentColor" />
                        </div>
                        <div className="flex-1 h-1 bg-gray-300 rounded-full relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-current opacity-50"></div>
                        </div>
                        <span className="text-xs font-medium">{formatDuration(duration)}</span>
                    </div>
                );
            }

            // Wave or bars
            return (
                <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${isSender ? 'text-white' : 'text-black'}`}>
                        <Play size={14} fill="currentColor" />
                    </div>
                    <div className="flex items-end gap-0.5 h-4">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-0.5 rounded-full ${isSender ? 'bg-white/80' : 'bg-black/40'}`}
                                style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                        ))}
                    </div>
                    <span className="text-xs">{formatDuration(duration)}</span>
                </div>
            );
        };

        const renderMessage = (msg: Message) => {
            const isSender = msg.isSender;

            if (platform === 'instagram') {
                const isReacting = activeReactionId === msg.id;

                return (
                    <div
                        key={msg.id}
                        className={`flex w-full mb-3 relative group ${isSender ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                        {!isSender && (
                            <img src={settings.partnerAvatar} className="w-7 h-7 rounded-full object-cover mb-1" />
                        )}

                        <div className="relative">
                            {/* Reaction Picker Overlay */}
                            {isReacting && (
                                <div
                                    className={`reaction-picker absolute -top-14 ${isSender ? 'right-0' : 'left-0'} bg-[#262626] rounded-full px-2 py-1.5 flex gap-1 z-30 shadow-xl animate-in zoom-in duration-200`}>
                                    {INSTAGRAM_REACTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleReactionSelect(emoji)}
                                            className="w-8 h-8 flex items-center justify-center text-xl hover:scale-125 transition-transform">
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div
                                onMouseDown={() => handleTouchStart(msg.id)}
                                onMouseUp={handleTouchEnd}
                                onMouseLeave={handleTouchEnd}
                                onTouchStart={() => handleTouchStart(msg.id)}
                                onTouchEnd={handleTouchEnd}
                                onContextMenu={(e) => e.preventDefault()}
                                className={`max-w-60 px-4 py-2.5 text-[15px] leading-snug rounded-3xl relative select-none cursor-pointer transition-transform active:scale-95 ${
                                    isSender
                                        ? 'bg-[#3797f0] text-white rounded-br-md'
                                        : 'bg-[#efefef] text-black rounded-bl-md'
                                }`}>
                                {msg.image ? (
                                    <img src={msg.image} className="rounded-lg max-w-full" />
                                ) : msg.audioDuration ? (
                                    renderVoiceVisual(isSender, msg.audioDuration, 'bars')
                                ) : (
                                    msg.text
                                )}
                                {/* Timestamp inside bubble */}
                                <div
                                    className={`text-[9px] mt-1 text-right ${isSender ? 'text-blue-100/80' : 'text-gray-400'}`}>
                                    {msg.timestamp}
                                </div>
                            </div>

                            {/* Displayed Reaction */}
                            {msg.reaction && (
                                <div
                                    className={`absolute -bottom-2 ${isSender ? '-left-1' : '-right-1'} bg-white border-2 border-white rounded-full p-0.5 w-[22px] h-[22px] flex items-center justify-center shadow-sm z-10 text-[12px]`}>
                                    {msg.reaction}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            if (platform === 'line') {
                return (
                    <div
                        key={msg.id}
                        className={`flex w-full mb-4 ${isSender ? 'justify-end' : 'justify-start items-start gap-2'}`}>
                        {!isSender && (
                            <img src={settings.partnerAvatar} className="w-10 h-10 rounded-full object-cover" />
                        )}
                        <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                            {!isSender && (
                                <span className="text-xs text-gray-600 mb-1 ml-1">{settings.partnerName}</span>
                            )}
                            <div className="flex items-end gap-1.5">
                                {isSender && (
                                    <div className="flex flex-col items-end text-[10px] text-gray-600 min-w-[30px]">
                                        {msg.isRead && <span>Read</span>}
                                        <span>{msg.timestamp}</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[220px] px-3 py-2 text-[14px] rounded-2xl shadow-sm relative leading-relaxed wrap-break-words ${
                                        isSender
                                            ? 'bg-[#85E249] text-black after:absolute after:top-2 after:-right-1 after:w-3 after:h-3 after:bg-[#85E249] after:rotate-45'
                                            : 'bg-white text-black after:absolute after:top-2 after:-left-1 after:w-3 after:h-3 after:bg-white after:rotate-45'
                                    }`}>
                                    {msg.image ? (
                                        <img src={msg.image} className="rounded-lg max-w-full" />
                                    ) : msg.audioDuration ? (
                                        renderVoiceVisual(isSender, msg.audioDuration, 'line')
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                                {!isSender && (
                                    <span className="text-[10px] text-gray-600 self-end">{msg.timestamp}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }

            if (platform === 'telegram') {
                return (
                    <div
                        key={msg.id}
                        className={`flex w-full mb-2 ${isSender ? 'justify-end' : 'justify-start gap-2'}`}>
                        {!isSender && (
                            <img
                                src={settings.partnerAvatar}
                                className="w-8 h-8 rounded-full object-cover self-end mb-1"
                            />
                        )}
                        <div
                            className={`max-w-[75%] px-3 py-1.5 rounded-lg text-[15px] shadow-sm relative min-w-[60px] ${
                                isSender ? 'bg-[#eeffde] text-black' : 'bg-white text-black'
                            }`}>
                            <div className="wrap-break-words mb-1">
                                {msg.image ? (
                                    <img src={msg.image} className="rounded-lg max-w-full" />
                                ) : msg.audioDuration ? (
                                    renderVoiceVisual(isSender, msg.audioDuration, 'line')
                                ) : (
                                    msg.text
                                )}
                            </div>
                            <div
                                className={`text-[11px] flex items-center justify-end gap-1 ${isSender ? 'text-[#55a060]' : 'text-gray-400'}`}>
                                <span>{msg.timestamp}</span>
                                {isSender && (
                                    // Simple double check mark simulation
                                    <span className="font-bold text-[10px]">✓✓</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }

            if (platform === 'tiktok') {
                return (
                    <div
                        key={msg.id}
                        className={`flex w-full mb-3 ${isSender ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                        {!isSender && (
                            <img src={settings.partnerAvatar} className="w-8 h-8 rounded-full object-cover mb-1" />
                        )}
                        <div
                            className={`max-w-[70%] px-4 py-2.5 text-[15px] rounded-2xl ${
                                isSender
                                    ? 'bg-[#2CB6D3] text-white rounded-br-sm' // Cyan accent for sender
                                    : 'bg-[#383838] text-white rounded-bl-sm'
                            }`}>
                            {msg.image ? (
                                <img src={msg.image} className="rounded-lg max-w-full" />
                            ) : msg.audioDuration ? (
                                renderVoiceVisual(isSender, msg.audioDuration, 'bars')
                            ) : (
                                msg.text
                            )}
                            {/* Timestamp inside bubble */}
                            <div
                                className={`text-[9px] mt-1 text-right ${isSender ? 'text-white/70' : 'text-gray-400'}`}>
                                {msg.timestamp}
                            </div>
                        </div>
                    </div>
                );
            }
        };

        const renderFooter = () => {
            switch (platform) {
                case 'instagram':
                    return (
                        <div className="px-4 py-3 bg-white flex items-center gap-3 border-t border-gray-100">
                            <div className="bg-[#efefef] flex-1 rounded-full px-4 py-2.5 flex items-center gap-2">
                                <div className="bg-blue-500 rounded-full p-1 text-white">
                                    <ImageIcon size={12} fill="white" />
                                </div>
                                <span className="text-gray-400 text-sm">Message...</span>
                                <div className="ml-auto flex gap-3 text-gray-500">
                                    <Mic size={20} />
                                    <ImageIcon size={20} />
                                    <Smile size={20} />
                                </div>
                            </div>
                        </div>
                    );
                case 'line':
                    return (
                        <div className="px-3 py-2 bg-white flex items-center gap-3">
                            <MoreHorizontal size={24} className="text-gray-400" />
                            <ImageIcon size={24} className="text-gray-400" />
                            <div className="flex-1 bg-gray-100 rounded-2xl px-3 py-2 text-sm text-gray-400">Aa</div>
                            <Mic size={20} className="text-gray-400" />
                        </div>
                    );
                case 'telegram':
                    return (
                        <div className="px-2 py-2 bg-white flex items-center gap-2">
                            <Smile size={28} className="text-gray-400 p-1" />
                            <div className="flex-1 text-lg text-gray-400 pl-1">Message</div>
                            <ImageIcon size={28} className="text-gray-400 p-1" />
                            <Mic size={28} className="text-gray-400 p-1" />
                        </div>
                    );
                case 'tiktok':
                    return (
                        <div className="px-4 py-3 bg-black border-t border-gray-800 flex items-center gap-3">
                            <div className="flex-1 bg-[#252525] rounded-full px-4 py-2.5 flex items-center">
                                <span className="text-gray-500 text-sm">Send a message...</span>
                            </div>
                            <div className="text-gray-400">
                                <Smile size={24} />
                            </div>
                        </div>
                    );
            }
        };

        // Common Status Bar
        const statusBarColor =
            platform === 'line'
                ? 'bg-[#202732] text-white'
                : platform === 'tiktok'
                  ? 'bg-black text-white'
                  : platform === 'telegram'
                    ? 'bg-[#517da2] text-white'
                    : 'bg-white text-black';

        return (
            <div className="w-full flex justify-center py-4 bg-gray-100 min-h-full">
                {/* Phone Container */}
                <div
                    ref={ref}
                    className="relative w-[375px] h-[812px] bg-white shadow-2xl overflow-hidden flex flex-col font-sans"
                    style={{ fontFamily: platform === 'line' ? 'sans-serif' : 'inherit' }}>
                    {/* Status Bar */}
                    <div
                        className={`px-5 py-2 flex justify-between items-end text-sm font-semibold h-11 ${statusBarColor} z-10`}>
                        <div className="tracking-wide">{settings.time}</div>
                        <div className="flex gap-1.5 items-center">
                            <Signal size={16} className="fill-current" />
                            <Wifi size={16} />
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-normal">{settings.batteryLevel}%</span>
                                <Battery size={18} className="fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* App Header */}
                    <div className="z-10">{renderHeader()}</div>

                    {/* Chat Area */}
                    <div
                        className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col ${settings.backgroundImage ? 'bg-no-repeat bg-cover bg-center' : renderBackground()}`}
                        style={settings.backgroundImage ? { backgroundImage: `url(${settings.backgroundImage})` } : {}}>
                        {messages.map(renderMessage)}
                        {/* Typing Indicator */}
                        {settings.isTyping && renderTypingIndicator()}
                    </div>

                    {/* Footer / Input */}
                    <div className="z-10 relative">
                        {renderFooter()}
                        {/* Home Indicator */}
                        <div
                            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full ${platform === 'tiktok' || platform === 'line' ? 'bg-white/20' : 'bg-black/20'}`}></div>
                    </div>
                </div>
            </div>
        );
    }
);

ChatPreview.displayName = 'ChatPreview';

export default ChatPreview;
