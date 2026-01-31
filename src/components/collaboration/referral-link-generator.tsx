'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
    Link2, Copy, Check, Clock, Shield, Eye,
    XRay, Activity, AlertTriangle, Calendar
} from 'lucide-react';
import {
    ReferralLink,
    createReferralLink,
    isReferralTokenValid
} from '@/types/consultant.types';

interface ReferralLinkGeneratorProps {
    patientId: string;
    patientName: string;
    referringDoctor: string;
    onLinkGenerated?: (link: ReferralLink) => void;
}

export default function ReferralLinkGenerator({
    patientId,
    patientName,
    referringDoctor,
    onLinkGenerated
}: ReferralLinkGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<ReferralLink | null>(null);
    const [copied, setCopied] = useState(false);

    // Options
    const [includeTimeline, setIncludeTimeline] = useState(true);
    const [includeXrays, setIncludeXrays] = useState(true);
    const [includeSmartAnalysis, setIncludeSmartAnalysis] = useState(true);
    const [includeRiskPredictor, setIncludeRiskPredictor] = useState(true);
    const [customMessage, setCustomMessage] = useState('');

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            // In production, this would call an API endpoint
            const link = createReferralLink(patientId, referringDoctor, {
                includeTimeline,
                includeXrays,
                includeSmartAnalysis,
                includeRiskPredictor,
                customMessage: customMessage || undefined
            });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setGeneratedLink(link);
            onLinkGenerated?.(link);
            toast.success('Secure referral link generated');
        } catch (error) {
            toast.error('Failed to generate link');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async () => {
        if (!generatedLink) return;

        const url = `${window.location.origin}/referral/${generatedLink.token}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copied to clipboard');

        setTimeout(() => setCopied(false), 2000);
    };

    const getExpirationText = () => {
        if (!generatedLink) return '';
        const expires = new Date(generatedLink.expiresAt);
        const now = new Date();
        const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return `Expires in ${daysLeft} days`;
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-blue-500" />
                        Generate Secure Referral Link
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        DPDPA Compliant • 7-Day Auto-Expiration • Encrypted
                    </p>
                </div>
                <Badge variant="outline" className="text-lg">
                    {patientName}
                </Badge>
            </div>

            {/* Security Notice */}
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-sm">
                <div className="flex items-center gap-2 font-medium text-green-800 dark:text-green-200">
                    <Shield className="w-4 h-4" />
                    Zero Data Footprint
                </div>
                <p className="text-green-700 dark:text-green-300 mt-1">
                    Unlike WhatsApp, this link doesn't store data on third-party servers.
                    X-rays load via signed URLs that expire in 60 minutes.
                </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Include in Referral:</h4>

                <label className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Clinical Timeline
                    </span>
                    <Switch checked={includeTimeline} onCheckedChange={setIncludeTimeline} />
                </label>

                <label className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <XRay className="w-4 h-4" />
                        X-rays (IOPA/OPG)
                    </span>
                    <Switch checked={includeXrays} onCheckedChange={setIncludeXrays} />
                </label>

                <label className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        8-Department Smart Analysis
                    </span>
                    <Switch checked={includeSmartAnalysis} onCheckedChange={setIncludeSmartAnalysis} />
                </label>

                <label className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Risk Predictor Scores
                    </span>
                    <Switch checked={includeRiskPredictor} onCheckedChange={setIncludeRiskPredictor} />
                </label>

                <div className="pt-2">
                    <label className="text-sm font-medium mb-1 block">
                        Custom Message (Optional)
                    </label>
                    <Input
                        placeholder="e.g., Please assess for surgical extraction"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                    />
                </div>
            </div>

            {/* Generate Button */}
            {!generatedLink && (
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                >
                    <Link2 className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating Secure Link...' : 'Generate Referral Link'}
                </Button>
            )}

            {/* Generated Link Display */}
            {generatedLink && (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-blue-800 dark:text-blue-200">
                                Secure Link Generated
                            </span>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {getExpirationText()}
                            </Badge>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={`${window.location.origin}/referral/${generatedLink.token.substring(0, 12)}...`}
                                className="bg-white dark:bg-slate-900"
                            />
                            <Button onClick={handleCopy} variant="outline">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="flex gap-2 mt-2">
                            {includeTimeline && <Badge variant="secondary">Timeline</Badge>}
                            {includeXrays && <Badge variant="secondary">X-rays</Badge>}
                            {includeSmartAnalysis && <Badge variant="secondary">Analysis</Badge>}
                            {includeRiskPredictor && <Badge variant="secondary">Risk Scores</Badge>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-2 bg-muted rounded">
                            <Eye className="w-4 h-4 mx-auto mb-1" />
                            <div className="font-medium">{generatedLink.accessCount}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div className="p-2 bg-muted rounded">
                            <Shield className="w-4 h-4 mx-auto mb-1" />
                            <div className="font-medium">256-bit</div>
                            <div className="text-xs text-muted-foreground">Encrypted</div>
                        </div>
                        <div className="p-2 bg-muted rounded">
                            <Clock className="w-4 h-4 mx-auto mb-1" />
                            <div className="font-medium">7 Days</div>
                            <div className="text-xs text-muted-foreground">Auto-Expire</div>
                        </div>
                    </div>

                    <Button
                        onClick={() => setGeneratedLink(null)}
                        variant="outline"
                        className="w-full"
                    >
                        Generate New Link
                    </Button>
                </div>
            )}
        </Card>
    );
}
