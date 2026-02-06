"use client";

import { useState, useEffect } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, Save, CreditCard } from "lucide-react";

export function BillingSettings() {
    const [upiId, setUpiId] = useState("");
    const [payeeName, setPayeeName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load from localStorage on mount
        const savedUpi = localStorage.getItem("clinic_upi_id");
        const savedName = localStorage.getItem("clinic_payee_name");
        if (savedUpi) setUpiId(savedUpi);
        if (savedName) setPayeeName(savedName);
    }, []);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem("clinic_upi_id", upiId);
            localStorage.setItem("clinic_payee_name", payeeName);
            toast.success("Payment settings updated successfully");
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Payment Configuration</h3>
                    <p className="text-slate-500 text-sm">Manage payment gateways and UPI details.</p>
                </div>
                <Button onClick={handleSave} disabled={isLoading} className="bg-slate-900 text-white hover:bg-slate-800">
                    {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
            </div>

            <PanzeCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">UPI Payments (One-Tap)</h4>
                        <p className="text-xs text-slate-500">Configure the QR code and One-Tap links shown to patients.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Clinic UPI ID (VPA)</Label>
                        <Input
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. noble.clinic@okaxis"
                            className="font-mono bg-slate-50"
                        />
                        <p className="text-[10px] text-slate-400">This is the VPA that will receive payments.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Payee Name (Merchant Name)</Label>
                        <Input
                            value={payeeName}
                            onChange={(e) => setPayeeName(e.target.value)}
                            placeholder="e.g. Noble Dental Clinic"
                        />
                        <p className="text-[10px] text-slate-400">The name shown to patients during payment.</p>
                    </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-yellow-800">Payment Status Confirmation</p>
                        <p className="text-xs text-yellow-700 leading-relaxed">
                            Currently, this generates a <strong>Direct UPI Link</strong>. Payments go directly bank-to-bank.
                            The system cannot automatically verify these payments without a Payment Gateway (Razorpay/Stripe) integration.
                            Please check your bank app to confirm receipts.
                        </p>
                    </div>
                </div>
            </PanzeCard>
        </div>
    );
}
