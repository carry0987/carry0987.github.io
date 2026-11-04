import { useState, useCallback } from 'react';

export const useFileUpload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback(async (file: File): Promise<{ url: string; file: File } | null> => {
        if (typeof window === 'undefined') return null;

        setIsProcessing(true);
        setError(null);

        try {
            const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || /\.hei[cf]$/i.test(file.name);
            const isImage =
                file.type.startsWith('image/') || isHeic || (!file.type && /\.(png|jpe?g|webp)$/i.test(file.name));

            if (!isImage) {
                setError('請選擇支援的圖片檔案。');
                return null;
            }
            if (file.size > 20 * 1024 * 1024) {
                setError('圖片大小不可超過 20 MB。');
                return null;
            }

            let targetFile = file;

            // Handle HEIC/HEIF
            if (isHeic) {
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
