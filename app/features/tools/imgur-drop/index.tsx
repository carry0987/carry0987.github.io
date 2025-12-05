import React, { useState } from 'react';
import { DropZone } from './components/DropZone';
import { HistoryItem } from './components/HistoryItem';
import { uploadImageToImgur } from './services/imgurService';
import type { UploadedItem } from './types';
import { AlertTriangle, Image as ImageIcon } from 'lucide-react';

// Import global styles
import './style.css';

const App: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [history, setHistory] = useState<UploadedItem[]>([]);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelected = async (file: File) => {
        setIsUploading(true);
        setGlobalError(null);

        // Create preview
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        try {
            const response = await uploadImageToImgur(file);

            if (response.success) {
                const newItem: UploadedItem = {
                    ...response.data,
                    localId: crypto.randomUUID(),
                    timestamp: Date.now()
                };
                // Add new item to the top of the history
                setHistory((prev) => [newItem, ...prev]);
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred';
            setGlobalError(msg);
        } finally {
            setIsUploading(false);
            // Cleanup preview URL to prevent memory leaks
            URL.revokeObjectURL(url);
            setPreviewUrl(null);
        }
    };

    return (
        <div className="min-h-screen text-slate-200 font-sans selection:bg-tech-500/30">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Intro */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Upload images{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-tech-400 to-cyan-400">
                            instantly
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Simple, fast, and anonymous image hosting powered by Imgur. Just drag, drop, and share your
                        link.
                    </p>
                </div>

                {/* Global Error Banner */}
                {globalError && (
                    <div className="max-w-2xl mx-auto mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-4 text-red-200 animate-fadeIn">
                        <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1 py-1">
                            <h3 className="font-bold text-red-400">Upload Failed</h3>
                            <p className="text-sm text-red-300/70 mt-1 leading-relaxed">{globalError}</p>
                        </div>
                        <button
                            onClick={() => setGlobalError(null)}
                            className="text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded-lg p-1 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Upload Area */}
                <DropZone onFileSelected={handleFileSelected} isUploading={isUploading} previewUrl={previewUrl} />

                {/* History / Results */}
                {history.length > 0 && (
                    <div className="mt-16 animate-fadeIn">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <ImageIcon className="w-6 h-6 text-tech-400" />
                                Your Uploads
                                <span className="bg-tech-500/20 text-tech-400 text-sm py-0.5 px-2.5 rounded-full font-bold">
                                    {history.length}
                                </span>
                            </h3>
                            <button
                                onClick={() => setHistory([])}
                                className="text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all font-medium">
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {history.map((item) => (
                                <HistoryItem key={item.localId} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
