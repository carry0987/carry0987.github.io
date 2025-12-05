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
                <div className="fixed inset-0 z-50 bg-indigo-600/10 backdrop-blur-sm border-4 border-indigo-600 border-dashed m-4 rounded-3xl flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce">
                        <UploadCloud className="w-10 h-10 text-indigo-600" />
                        <span className="text-2xl font-bold text-indigo-900">Drop image to upload!</span>
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
                  ? 'border-indigo-500 bg-indigo-50 scale-[1.02] shadow-xl ring-4 ring-indigo-200'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 bg-white hover:shadow-lg'
          }
          ${isUploading ? 'border-indigo-200 cursor-default' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
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
                    <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-white">
                        {previewUrl && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={previewUrl}
                                    alt="Uploading preview"
                                    className="w-full h-full object-cover opacity-30 blur-sm scale-105"
                                />
                                <div className="absolute inset-0 bg-indigo-900/10" />
                            </div>
                        )}

                        <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-indigo-100 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <UploadCloud className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mt-4">Uploading...</h3>
                            <p className="text-sm text-slate-500 mt-1">Hold tight, almost there!</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 flex flex-col items-center">
                        <div
                            className={`
               w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500
               ${isDragActive ? 'bg-indigo-100 scale-110 rotate-3' : 'bg-slate-50 group-hover:bg-indigo-50 group-hover:scale-105'}
               ${error ? 'bg-red-100' : ''}
             `}>
                            {error ? (
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            ) : (
                                <UploadCloud
                                    className={`w-12 h-12 transition-colors duration-300 ${isDragActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}
                                />
                            )}
                        </div>

                        {error ? (
                            <div className="text-red-600 mb-2 font-medium bg-red-100 px-4 py-2 rounded-lg">{error}</div>
                        ) : (
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                {isDragActive ? "Drop it like it's hot!" : 'Drag & Drop your image'}
                            </h3>
                        )}

                        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed text-base">
                            Supports JPG, PNG, GIF up to 10MB.
                            <br />
                            Or{' '}
                            <span className="text-indigo-600 font-semibold underline decoration-indigo-300 underline-offset-4 decoration-2">
                                browse
                            </span>{' '}
                            to choose a file.
                        </p>

                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 border border-slate-200">
                                JPG
                            </span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 border border-slate-200">
                                PNG
                            </span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 border border-slate-200">
                                GIF
                            </span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 border border-slate-200">
                                WEBP
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
