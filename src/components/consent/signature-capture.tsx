'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileSignature, Check, AlertTriangle,
    Fingerprint, Clock, Shield
} from 'lucide-react';
import { ConsentTemplate, SignedConsent } from '@/lib/digital-consent';

interface SignatureCaptureProps {
    template: ConsentTemplate;
    patientData: Record<string, string>;
    onSign: (signatureBase64: string) => void;
    onCancel: () => void;
}

export default function SignatureCapture({
    template,
    patientData,
    onSign,
    onCancel
}: SignatureCaptureProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsDrawing(true);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            e.preventDefault();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.strokeStyle = '#1a365d';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasSignature || !agreedToTerms) return;
        const signatureBase64 = canvas.toDataURL('image/png');
        onSign(signatureBase64);
    };

    // Fill template content
    const filledContent = Object.entries(patientData).reduce(
        (content, [key, value]) => content.replace(new RegExp(`{{${key}}}`, 'g'), value),
        template.content
    );

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Header */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="flex items-center gap-3">
                    <FileSignature className="w-8 h-8 text-blue-600" />
                    <div>
                        <h2 className="text-xl font-bold">{template.title}</h2>
                        <p className="text-sm text-muted-foreground">
                            Digital Consent • Version {template.version}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Consent Content */}
            <Card className="p-4 max-h-64 overflow-y-auto">
                <div
                    className="prose prose-sm dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: filledContent }}
                />
            </Card>

            {/* Risks Section */}
            <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                <h3 className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risks & Complications
                </h3>
                <ul className="text-sm space-y-1">
                    {template.risks.map((risk, i) => (
                        <li key={i} className="text-amber-900 dark:text-amber-100">• {risk}</li>
                    ))}
                </ul>
            </Card>

            {/* Signature Pad */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold flex items-center gap-2">
                        <Fingerprint className="w-5 h-5 text-purple-600" />
                        Your Signature
                    </h3>
                    <Button variant="ghost" size="sm" onClick={clearSignature}>
                        Clear
                    </Button>
                </div>

                <div className="border-2 border-dashed rounded-lg bg-white dark:bg-slate-900">
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={150}
                        className="w-full cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Sign above using your finger or mouse
                </p>
            </Card>

            {/* Agreement Checkbox */}
            <Card className="p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-5 h-5"
                    />
                    <span className="text-sm">
                        I confirm that I have read, understood, and agree to the above consent form.
                        I have had the opportunity to ask questions, and all my queries have been
                        answered to my satisfaction. I voluntarily consent to the proposed treatment.
                    </span>
                </label>
            </Card>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Shield className="w-4 h-4" />
                <span>This signature is encrypted and timestamped for legal validity</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{new Date().toLocaleString('en-IN')}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    disabled={!hasSignature || !agreedToTerms}
                    onClick={handleSubmit}
                    className="gap-2"
                >
                    <Check className="w-4 h-4" />
                    Submit Consent
                </Button>
            </div>
        </div>
    );
}
