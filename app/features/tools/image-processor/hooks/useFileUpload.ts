import { useState, useCallback } from 'react';

export const useFileUpload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback(async (file: File): Promise<{ url: string; file: File } | null> => {
        if (typeof window === 'undefined') return null;

        setIsProcessing(true);
        setError(null);

        try {
            let targetFile = file;

            // Handle HEIC/HEIF
            if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
                const heic2any = (await import('heic2any')).default;
                const convertedBlob = await (heic2any as any)({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.8
                });

                const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                targetFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
            }

            const url = URL.createObjectURL(targetFile);
            return { url, file: targetFile };
        } catch (err) {
            console.error('File processing error:', err);
            setError('無法處理此檔案格式，請確認是否為支援的圖片。');
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return { processFile, isProcessing, error };
};
