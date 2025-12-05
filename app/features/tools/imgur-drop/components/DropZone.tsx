import React, { useCallback, useState, useRef, useEffect } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { ALLOWED_TYPES, MAX_SIZE_BYTES } from '../constants';

interface DropZoneProps {
    onFileSelected: (file: File) => void;
    isUploading: boolean;
    previewUrl?: string | null;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelected, isUploading, previewUrl }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);

    const validateFile = (file: File): boolean => {
        setError(null);
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Invalid file type. Please upload PNG, JPG, GIF, or WEBP.');
            return false;
        }
        if (file.size > MAX_SIZE_BYTES) {
            setError(`File is too large. Max size is ${MAX_SIZE_BYTES / 1024 / 1024}MB.`);
            return false;
        }
        return true;
    };

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current += 1;
        if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
            setIsDragActive(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
            setIsDragActive(false);
        }
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);
            dragCounter.current = 0;

            if (isUploading) return;

            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (validateFile(file)) {
                    onFileSelected(file);
                }
            }
        },
        [isUploading, onFileSelected]
    );

    // Global drag events
    useEffect(() => {
        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                onFileSelected(file);
            }
        }
        // Reset value so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 relative">
            {/* Full screen overlay when dragging */}
            {isDragActive && !isUploading && (
                <div className="fixed inset-0 z-50 bg-tech-600/10 backdrop-blur-sm border-4 border-tech-500 border-dashed m-4 rounded-3xl flex items-center justify-center pointer-events-none">
                    <div className="bg-dark-card p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce border border-tech-500/30">
                        <UploadCloud className="w-10 h-10 text-tech-400" />
                        <span className="text-2xl font-bold text-white">Drop image to upload!</span>
                    </div>
                </div>
            )}

            <div
                onClick={triggerFileInput}
                className={`
          relative group cursor-pointer overflow-hidden
          border-3 border-dashed rounded-3xl text-center transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center min-h-80
          ${
              isDragActive
                  ? 'border-tech-500 bg-tech-500/10 scale-[1.02] shadow-xl ring-4 ring-tech-500/20'
                  : 'border-white/20 hover:border-tech-400/50 hover:bg-dark-card/50 bg-dark-card/30 hover:shadow-lg'
          }
          ${isUploading ? 'border-tech-500/30 cursor-default' : ''}
          ${error ? 'border-red-500/50 bg-red-500/10' : ''}
        `}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={ALLOWED_TYPES.join(',')}
                    onChange={handleFileInput}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-dark-card">
                        {previewUrl && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={previewUrl}
                                    alt="Uploading preview"
                                    className="w-full h-full object-cover opacity-20 blur-sm scale-105"
                                />
                                <div className="absolute inset-0 bg-dark-card/50" />
                            </div>
                        )}

                        <div className="relative z-10 bg-dark-card/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-tech-500/30 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-tech-500/20 border-t-tech-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <UploadCloud className="w-6 h-6 text-tech-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mt-4">Uploading...</h3>
                            <p className="text-sm text-slate-400 mt-1">Hold tight, almost there!</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 flex flex-col items-center">
                        <div
                            className={`
               w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500
               ${isDragActive ? 'bg-tech-500/20 scale-110 rotate-3' : 'bg-white/5 group-hover:bg-tech-500/10 group-hover:scale-105'}
               ${error ? 'bg-red-500/20' : ''}
             `}>
                            {error ? (
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            ) : (
                                <UploadCloud
                                    className={`w-12 h-12 transition-colors duration-300 ${isDragActive ? 'text-tech-400' : 'text-slate-500 group-hover:text-tech-400'}`}
                                />
                            )}
                        </div>

                        {error ? (
                            <div className="text-red-400 mb-2 font-medium bg-red-500/20 px-4 py-2 rounded-lg">
                                {error}
                            </div>
                        ) : (
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {isDragActive ? "Drop it like it's hot!" : 'Drag & Drop your image'}
                            </h3>
                        )}

                        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed text-base">
                            Supports JPG, PNG, GIF up to 10MB.
                            <br />
                            Or{' '}
                            <span className="text-tech-400 font-semibold underline decoration-tech-500/50 underline-offset-4 decoration-2">
                                browse
                            </span>{' '}
                            to choose a file.
                        </p>

                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-slate-400 border border-white/10">
                                JPG
                            </span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-slate-400 border border-white/10">
                                PNG
                            </span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-slate-400 border border-white/10">
                                GIF
                            </span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-slate-400 border border-white/10">
                                WEBP
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
