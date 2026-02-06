"use client";

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
    onSave: (base64: string) => void;
    label: string;
    className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, label, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.strokeStyle = "#4f46e5"; // indigo-600
        context.lineWidth = 2;
        context.lineCap = "round";
        setCtx(context);

        // Adjust for DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context.scale(dpr, dpr);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctx?.beginPath();
        if (canvasRef.current) {
            onSave(canvasRef.current.toDataURL());
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !ctx || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clear = () => {
        if (!ctx || !canvasRef.current) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        onSave('');
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <PenTool className="w-3 h-3" /> {label}
                </label>
                <button
                    onClick={clear}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                    <RotateCcw className="w-3 h-3" /> Clear
                </button>
            </div>
            <div className="relative aspect-[3/1] bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden cursor-crosshair touch-none">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};
