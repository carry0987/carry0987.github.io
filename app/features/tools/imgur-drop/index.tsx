import React, { useState } from 'react';
import { DropZone } from './components/DropZone';
import { HistoryItem } from './components/HistoryItem';
import { uploadImageToImgur } from './services/imgurService';
import type { UploadedItem } from './types';
import { Layers, Github, AlertTriangle, Image as ImageIcon } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
            {/* Background decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl translate-y-1/2"></div>
            </div>

            {/* Header */}
            <header className="sticky z-10 bg-white/70 backdrop-blur-lg top-0 border-b border-slate-200/60 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-0">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">
                            Imgur<span className="text-indigo-600">Drop</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold tracking-wide border border-indigo-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            API Connected
                        </div>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-lg">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Intro */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Upload images{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                            instantly
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Simple, fast, and anonymous image hosting powered by Imgur. Just drag, drop, and share your
                        link.
                    </p>
                </div>

                {/* Global Error Banner */}
                {globalError && (
                    <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 text-red-700 shadow-sm animate-fadeIn">
                        <div className="p-2 bg-red-100 rounded-lg shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 py-1">
                            <h3 className="font-bold text-red-800">Upload Failed</h3>
                            <p className="text-sm text-red-600 mt-1 leading-relaxed">{globalError}</p>
                        </div>
                        <button
                            onClick={() => setGlobalError(null)}
                            className="text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg p-1 transition-colors">
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
                    <div className="mt-20 animate-fadeIn">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                <ImageIcon className="w-6 h-6 text-indigo-500" />
                                Your Uploads
                                <span className="bg-indigo-100 text-indigo-700 text-sm py-0.5 px-2.5 rounded-full font-bold">
                                    {history.length}
                                </span>
                            </h3>
                            <button
                                onClick={() => setHistory([])}
                                className="text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-medium">
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

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200 mt-20 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} ImgurDrop.</p>
                    <div className="flex items-center gap-8 text-sm font-medium">
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
