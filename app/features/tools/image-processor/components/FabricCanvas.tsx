import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

interface FabricCanvasProps {
    imageUrl: string | null;
    onCanvasReady: (canvas: fabric.Canvas) => void;
    width: number;
    height: number;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({
    imageUrl,
    onCanvasReady,
    width: initialWidth,
    height: initialHeight
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Fabric Canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: initialWidth,
            height: initialHeight,
            backgroundColor: '#f3f4f6',
            preserveObjectStacking: true
        });

        fabricRef.current = canvas;
        onCanvasReady(canvas);

        return () => {
            canvas.dispose();
        };
    }, []); // Run only once

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !imageUrl) return;

        // Load Image
        fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
            // Get original image dimensions
            const imgWidth = img.width!;
            const imgHeight = img.height!;

            // Define maximum container dimensions (e.g., 800x600 or responsive)
            const maxWidth = 800;
            const maxHeight = 600;

            // Calculate scale to fit within max bounds
            const scaleX = maxWidth / imgWidth;
            const scaleY = maxHeight / imgHeight;
            const scale = Math.min(scaleX, scaleY, 1);

            // Calculate final dimensions for the canvas to match image aspect ratio
            const finalWidth = imgWidth * scale;
            const finalHeight = imgHeight * scale;

            // Resize canvas to match the scaled image exactly
            canvas.setDimensions({ width: finalWidth, height: finalHeight });

            canvas.clear();

            img.set({
                scaleX: scale,
                scaleY: scale,
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                selectable: false,
                hoverCursor: 'default',
                name: 'mainImage'
            });

            canvas.add(img);
            canvas.sendObjectToBack(img);
            canvas.renderAll();
        });
    }, [imageUrl]);

    return (
        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow-inner overflow-auto max-h-[70vh]">
            <div className="shadow-lg bg-white">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default FabricCanvas;
