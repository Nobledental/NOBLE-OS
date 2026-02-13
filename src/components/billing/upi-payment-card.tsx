"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UpiPaymentCardProps {
    amount: number;
    payeeName?: string;
    payeeVpa?: string;
    invoiceId?: string;
}

export function UpiPaymentCard({
    amount,
    payeeName = "Noble Dental Clinic",
    payeeVpa = "noble.clinic@okaxis",
    invoiceId = "INV-2024-001"
}: UpiPaymentCardProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [dynamicVpa, setDynamicVpa] = useState(payeeVpa);
    const [dynamicName, setDynamicName] = useState(payeeName);

    useEffect(() => {
        // Hydrate from settings if available
        const savedUpi = localStorage.getItem("clinic_upi_id");
        const savedName = localStorage.getItem("clinic_payee_name");

        if (savedUpi) setDynamicVpa(savedUpi);
        if (savedName) setDynamicName(savedName);
    }, []);

    // Construct the UPI Deep Link
    // Format: upi://pay?pa=<vpa>&pn=<name>&am=<amount>&tn=<note>
    const upiLink = `upi://pay?pa=${dynamicVpa}&pn=${encodeURIComponent(dynamicName)}&am=${amount}&tn=${invoiceId}&cu=INR`;

    const handleCopyVpa = () => {
        navigator.clipboard.writeText(dynamicVpa);
        setIsCopied(true);
        toast.success("UPI ID copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const openUpiApp = (appName: string) => {
        // Deep linking works best on mobile. 
        // On desktop, this will usually try to open a handler or fail gracefully.
        window.location.href = upiLink;
        toast.info(`Opening ${appName}... Check your phone.`);
    };

    return (
        <Card className="glass-panze p-6 w-full max-w-sm mx-auto overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">One-Tap Payment</h3>
                <p className="text-xs text-slate-500">Secure UPI via NPCI Gateway</p>
            </div>

            <div className="flex flex-col items-center gap-6">
                {/* Visual Amount */}
                <div className="text-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">₹{amount.toLocaleString('en-IN')}</span>
                    <div className="flex items-center justify-center gap-2 mt-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 transition-colors" onClick={handleCopyVpa}>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{dynamicVpa}</span>
                        {isCopied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <Button
                        variant="outline"
                        className="h-12 border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all flex items-center justify-center gap-2 group"
                        onClick={() => openUpiApp("GPay")}
                    >
                        {/* GPay Logo Simulation */}
                        <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center bg-white border border-slate-100 shadow-sm">
                            <span className="font-bold text-[10px] text-blue-600">G</span>
                        </div>
                        GPay
                    </Button>
                    <Button
                        variant="outline"
                        className="h-12 border-slate-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all flex items-center justify-center gap-2 group"
                        onClick={() => openUpiApp("PhonePe")}
                    >
                        {/* PhonePe Logo Simulation */}
                        <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center bg-purple-600 text-white shadow-sm">
                            <span className="font-bold text-[10px]">Pe</span>
                        </div>
                        PhonePe
                    </Button>
                    <Button
                        variant="outline"
                        className="h-12 border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all flex items-center justify-center gap-2 group"
                        onClick={() => openUpiApp("Paytm")}
                    >
                        Paytm
                    </Button>
                    <Button
                        variant="outline"
                        className="h-12 border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-800 transition-all flex items-center justify-center gap-2 group"
                        onClick={() => openUpiApp("BHIM")}
                    >
                        BHIM
                    </Button>
                </div>

                <div className="relative flex items-center justify-center w-full py-2">
                    <div className="h-px bg-slate-200 w-full absolute" />
                    <span className="bg-white dark:bg-slate-900 px-2 text-xs text-slate-400 relative z-10">or scan code</span>
                </div>

                {/* QR Code Placeholder (Using API for Realism) */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2">
                    <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`}
                        alt="UPI QR Code"
                        width={128}
                        height={128}
                        unoptimized
                        className="object-contain mix-blend-multiply opacity-90"
                    />
                    <span className="text-[10px] text-slate-400 font-medium">Scan with any UPI App</span>
                </div>

            </div>
        </Card>
    );
}
