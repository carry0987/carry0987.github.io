import React, { useState, useEffect, useCallback } from 'react';
import { getLocalValue, setLocalValue } from '@carry0987/utils';
import * as fabric from 'fabric';
import { useFileUpload } from './hooks/useFileUpload';
import { useHydrated } from '@/hooks/useHydrated';
import FabricCanvas from './components/FabricCanvas';
import type { WatermarkSettings } from './types';

const ImageProcessor: React.FC = () => {
    const [imageState, setImageState] = useState<{ url: string | null; file: File | null }>({ url: null, file: null });
    const [canvas, setCanvas] = useState<any | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const isHydrated = useHydrated();
    const { processFile, isProcessing, error } = useFileUpload();

    const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
        text: '僅供身分驗證，他用無效',
        fontSize: 0,
        fontColor: '#000000',
        opacity: 0.3,
        angle: 45,
        lineHeight: 1.2,
        gutter: 20,
        isRepeat: true,
        file: null,
        originalUrl: null,
        width: 0,
        height: 0
    });

    const resetSettings = useCallback(() => {
        setWatermarkSettings((prev) => ({
            ...prev,
            text: '僅供身分驗證，他用無效',
            fontSize: 0,
            fontColor: '#000000',
            opacity: 0.3,
            angle: 45,
            lineHeight: 1.2,
            gutter: 20,
            isRepeat: true
        }));
    }, []);

    // Load settings from LocalStorage after hydration
    useEffect(() => {
        if (!isHydrated) return;
        const saved = getLocalValue('image-processor-settings');
        if (saved) {
            setWatermarkSettings((prev) => ({ ...prev, ...saved }));
        }
    }, [isHydrated]);

    // Save settings to LocalStorage
    useEffect(() => {
        if (!isHydrated) return;
        const { file, originalUrl, ...serializableSettings } = watermarkSettings;
        setLocalValue('image-processor-settings', serializableSettings);
    }, [watermarkSettings, isHydrated]);

    const saveHistory = useCallback(() => {
        if (!canvas) return;
        const json = JSON.stringify(canvas.toJSON(['name', 'selectable', 'name']));
        setHistory((prev) => {
            const newHistory = [...prev, json];
            if (newHistory.length > 20) newHistory.shift(); // Keep last 20 steps
            return newHistory;
        });
    }, [canvas]);

    const undo = useCallback(() => {
        if (!canvas || history.length <= 1) return;
        const newHistory = [...history];
        newHistory.pop(); // Remove current state
        const prevState = newHistory[newHistory.length - 1]; // Get previous state

        canvas.loadFromJSON(prevState, () => {
            canvas.renderAll();
            setHistory(newHistory);
        });
    }, [canvas, history]);

    const handleCanvasReady = useCallback(
        (fabricCanvas: any) => {
            setCanvas(fabricCanvas);
            // Initial history save
            const json = JSON.stringify(fabricCanvas.toJSON(['name', 'selectable', 'name']));
            setHistory([json]);

            // Auto-save history on specific events
            fabricCanvas.on('object:modified', () => saveHistory());
            fabricCanvas.on('object:added', (e: any) => {
                if (e.target && e.target.name === 'watermark') saveHistory();
            });
            fabricCanvas.on('object:removed', () => saveHistory());
        },
        [saveHistory]
    );

    // Keyboard shortcuts
    useEffect(() => {
        if (!isHydrated) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            // Undo: Ctrl+Z or Cmd+Z
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                undo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, isHydrated]);

    const handleFileChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const result = await processFile(file);
            if (result) {
                setImageState(result);
            }
        },
        [processFile]
    );

    const generateIDWatermark = useCallback(() => {
        if (!canvas) return;

        // Remove existing watermarks if any
        const objects = canvas.getObjects();
        const existingWatermarks = objects.filter((obj: any) => obj.name === 'watermark');
        canvas.remove(...existingWatermarks);

        const canvasWidth = canvas.width || 800;
        const canvasHeight = canvas.height || 600;

        // Dynamic base font size calculation based on image height (matches iOS Shortcut)
        const baseFontSize = Math.round(canvasHeight / 15);
        const standardFontSize = baseFontSize >= 15 ? baseFontSize : 15;
        // Apply offset: fontSize in settings acts as % change or simple addition
        let finalFontSize = standardFontSize * (1 + watermarkSettings.fontSize / 50);
        finalFontSize = finalFontSize >= 12 ? finalFontSize : 12;

        if (watermarkSettings.isRepeat) {
            // Create a temporary text object to measure dimensions
            const tempText = new fabric.IText(watermarkSettings.text + '  ', {
                fontSize: finalFontSize,
                lineHeight: watermarkSettings.lineHeight
            });
            const textWidth = tempText.width || 100;
            const textHeight = finalFontSize * 1.2 + watermarkSettings.gutter * 5;

            // Tiling Logic from iOS Shortcut:
            const angleRad = (watermarkSettings.angle * Math.PI) / 180;
            const cosA = Math.abs(Math.cos(angleRad));
            const sinA = Math.abs(Math.sin(angleRad));

            // Calculate the area needed to fill
            const newW = canvasWidth * cosA + canvasHeight * sinA;
            const newH = canvasWidth * sinA + canvasHeight * cosA;

            // Coordinate system transformation: Center of rotation
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;

            // Ranges for filling
            const xOver = Math.ceil((newW - canvasWidth) / textWidth / 2);
            const yOver = Math.ceil((newH - canvasHeight) / textHeight / 2);
            const xStep = Math.ceil(newW / textWidth);
            const yStep = Math.ceil(newH / textHeight);

            for (let i = -xOver; i <= xStep + xOver; i++) {
                for (let j = -yOver; j <= yStep + yOver; j++) {
                    // Translate local grid (i, j) to canvas space with rotation
                    const localX = i * textWidth - newW / 2;
                    const localY = j * textHeight - newH / 2;

                    // Standard rotation matrix:
                    // x' = x*cos - y*sin
                    // y' = x*sin + y*cos
                    const canvasX = centerX + localX * Math.cos(angleRad) - localY * Math.sin(angleRad);
                    const canvasY = centerY + localX * Math.sin(angleRad) + localY * Math.cos(angleRad);

                    const text = new fabric.IText(watermarkSettings.text + '  ', {
                        left: canvasX,
                        top: canvasY,
                        fontSize: finalFontSize,
                        fill: watermarkSettings.fontColor,
                        opacity: watermarkSettings.opacity,
                        angle: watermarkSettings.angle,
                        lineHeight: watermarkSettings.lineHeight,
                        selectable: true,
                        name: 'watermark',
                        originX: 'center',
                        originY: 'center'
                    });
                    canvas.add(text);
                }
            }
        } else {
            const text = new fabric.IText(watermarkSettings.text, {
                left: canvasWidth / 2,
                top: canvasHeight / 2,
                originX: 'center',
                originY: 'center',
                fontSize: finalFontSize,
                fill: watermarkSettings.fontColor,
                opacity: watermarkSettings.opacity,
                angle: watermarkSettings.angle,
                lineHeight: watermarkSettings.lineHeight,
                selectable: true,
                name: 'watermark'
            });
            canvas.add(text);
        }

        canvas.renderAll();
        saveHistory();
    }, [canvas, watermarkSettings, saveHistory]);

    // Live update for selected watermark object
    useEffect(() => {
        if (!canvas) return;

        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.name === 'watermark' && activeObject instanceof fabric.IText) {
            // Recalculate size if it's based on dynamic scaling
            const canvasHeight = canvas.height || 600;
            const baseFontSize = Math.round(canvasHeight / 15);
            const standardFontSize = baseFontSize >= 15 ? baseFontSize : 15;
            let finalFontSize = standardFontSize * (1 + watermarkSettings.fontSize / 50);
            finalFontSize = finalFontSize >= 12 ? finalFontSize : 12;

            activeObject.set({
                text: watermarkSettings.text,
                fill: watermarkSettings.fontColor,
                fontSize: finalFontSize,
                opacity: watermarkSettings.opacity,
                angle: watermarkSettings.angle,
                lineHeight: watermarkSettings.lineHeight
            });
            canvas.renderAll();
        }
    }, [watermarkSettings, canvas]);

    const rotateImage = useCallback(() => {
        if (!canvas) return;
        const mainImg = canvas.getObjects().find((obj: any) => obj.name === 'mainImage');
        if (mainImg) {
            mainImg.angle = (mainImg.angle || 0) + 90;
            canvas.renderAll();
            saveHistory();
        }
    }, [canvas, saveHistory]);

    const exportImage = useCallback(async () => {
        if (!canvas) return;

        // De-select any active object before export
        canvas.discardActiveObject();
        canvas.renderAll();

        // Calculate multiplier to export at original image resolution
        const mainImg = canvas.getObjects().find((obj: any) => obj.name === 'mainImage');
        const multiplier = mainImg?.scaleX ? 1 / mainImg.scaleX : 1;

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `processed-image-${Date.now()}.png`;
        link.click();
    }, [canvas]);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">圖片處理工具</h1>
                <p className="text-gray-600">純前端圖片處理，隱私安全，支援身分證影印浮水印、裁切與旋轉</p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 左側預覽區 */}
                <section className="lg:col-span-3 space-y-4">
                    {!imageState.url ? (
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept="image/*,.heic,.heif"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center space-y-4 p-8">
                                <div className="p-4 bg-white rounded-full shadow-sm">
                                    <svg
                                        className="w-12 h-12 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-gray-700">點擊或拖放圖片</p>
                                    <p className="text-sm text-gray-500 mt-1">支援 PNG, JPEG, WebP, HEIC 至 20MB</p>
                                </div>
                            </label>
                            {isProcessing && (
                                <p className="mt-4 text-blue-500 animate-pulse">正在處理檔案並轉換格式...</p>
                            )}
                            {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <FabricCanvas
                                imageUrl={imageState.url}
                                onCanvasReady={handleCanvasReady}
                                width={800}
                                height={600}
                            />
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setImageState({ url: null, file: null })}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                    清除圖片
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* 右側控制區 */}
                <section className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">浮水印設定</h2>
                            <button
                                onClick={resetSettings}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded transition-colors">
                                重置預設
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Text Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">文字內容</label>
                                <input
                                    type="text"
                                    value={watermarkSettings.text}
                                    onChange={(e) =>
                                        setWatermarkSettings({ ...watermarkSettings, text: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white"
                                    placeholder="輸入浮水印文字"
                                />
                            </div>

                            {/* Color & Opacity */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">顏色與透明度</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {['#000000', '#ff2600', '#0433ff', '#00f900', '#fffb00', '#ffffff'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() =>
                                                setWatermarkSettings({ ...watermarkSettings, fontColor: color })
                                            }
                                            className={`w-7 h-7 rounded-full border border-gray-200 transition-transform hover:scale-110 ${
                                                watermarkSettings.fontColor === color
                                                    ? 'ring-2 ring-blue-500 ring-offset-2'
                                                    : ''
                                            }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                    <div className="relative w-7 h-7">
                                        <input
                                            type="color"
                                            value={watermarkSettings.fontColor}
                                            onChange={(e) =>
                                                setWatermarkSettings({
                                                    ...watermarkSettings,
                                                    fontColor: e.target.value
                                                })
                                            }
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div
                                            className="w-full h-full rounded-full border border-gray-200"
                                            style={{
                                                background:
                                                    'conic-gradient(red, #ff4d00, #ff9900, #ffe600, #ccff00, #80ff00, #33ff00, #00ff1a, #00ff66, #00ffb3, cyan, #00b3ff, #0066ff, #001aff, #3300ff, #8000ff, #cc00ff, #ff00e6, #ff0099, #ff004d, red)'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        透明度 ({Math.round(watermarkSettings.opacity * 100)}%)
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1.0"
                                        step="0.1"
                                        value={watermarkSettings.opacity}
                                        onChange={(e) =>
                                            setWatermarkSettings({
                                                ...watermarkSettings,
                                                opacity: parseFloat(e.target.value)
                                            })
                                        }
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Font Size & Angle */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        大小 ({watermarkSettings.fontSize})
                                    </label>
                                    <input
                                        type="range"
                                        min="-50"
                                        max="100"
                                        value={watermarkSettings.fontSize}
                                        onChange={(e) =>
                                            setWatermarkSettings({
                                                ...watermarkSettings,
                                                fontSize: parseInt(e.target.value)
                                            })
                                        }
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        旋轉角度 ({watermarkSettings.angle}°)
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={watermarkSettings.angle}
                                        onChange={(e) =>
                                            setWatermarkSettings({
                                                ...watermarkSettings,
                                                angle: parseInt(e.target.value)
                                            })
                                        }
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3"
                                    />
                                </div>
                            </div>

                            {/* Gutter & Repeat */}
                            <div className="flex items-center space-x-4 border-t border-gray-100 pt-3">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        行高/間距 ({watermarkSettings.gutter})
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={watermarkSettings.gutter}
                                        onChange={(e) =>
                                            setWatermarkSettings({
                                                ...watermarkSettings,
                                                gutter: parseInt(e.target.value)
                                            })
                                        }
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-[10px] text-gray-500 mb-1">重複鋪滿</label>
                                    <input
                                        id="repeat-checkbox"
                                        type="checkbox"
                                        checked={watermarkSettings.isRepeat}
                                        onChange={(e) =>
                                            setWatermarkSettings({ ...watermarkSettings, isRepeat: e.target.checked })
                                        }
                                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    disabled={!imageState.url}
                                    onClick={generateIDWatermark}
                                    className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm">
                                    產生浮水印
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        disabled={!imageState.url || history.length <= 1}
                                        onClick={undo}
                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:bg-gray-50 disabled:text-gray-400 transition-colors">
                                        回復上一步
                                    </button>
                                    <button
                                        disabled={!imageState.url}
                                        onClick={rotateImage}
                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 transition-colors">
                                        旋轉 90°
                                    </button>
                                </div>
                                <button
                                    disabled={!imageState.url}
                                    onClick={exportImage}
                                    className="w-full flex items-center justify-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                                    匯出圖片
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-xs text-center text-gray-500 leading-relaxed font-medium">
                            🔒 您的圖片全程在瀏覽器內處理，不會上傳至伺服器，保障您的資安與隱私權。
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ImageProcessor;
