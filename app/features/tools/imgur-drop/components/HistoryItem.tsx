import React, { useState } from 'react';
import type { UploadedItem } from '../types';
import { Copy, Check, ExternalLink, Clock } from 'lucide-react';

interface HistoryItemProps {
    item: UploadedItem;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(item.link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row h-full">
                {/* Image Preview Side */}
                <div className="relative sm:w-48 h-48 sm:h-auto bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-200">
                    <img src={item.link} alt="Upload preview" className="w-full h-full object-cover" loading="lazy" />
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group">
                        <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transform scale-75 group-hover:scale-100 transition-all" />
                    </a>
                </div>

                {/* Details Side */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">
                                {item.id}.{item.type.split('/')[1]}
                            </h4>
                            <span className="flex items-center text-xs text-slate-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(item.timestamp)}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">
                                    Direct Link
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        readOnly
                                        value={item.link}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className={`ml-2 p-2 rounded-lg transition-all duration-200 shrink-0 border ${
                                            copied
                                                ? 'bg-green-50 border-green-200 text-green-600'
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200'
                                        }`}
                                        title="Copy to clipboard">
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-xs text-slate-400">
                            {Math.round(item.size / 1024)} KB • {item.width}x{item.height}
                        </div>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                            View on Imgur &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
