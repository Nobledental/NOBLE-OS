"use client";

import { useBillingStore } from "@/lib/billing-store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Printer, Share2, CreditCard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpiPaymentCard } from "@/components/billing/upi-payment-card";

export function InvoiceGenerator() {
    const { items, removeItem, enableEmi, toggleEmi, getTotals } = useBillingStore();
    const { subtotal, tax, total, monthlyEmi } = getTotals();

    const handleFinalize = () => {
        // 1. Generate UPI Intent Link (Standard Format)
        const clinicVpa = "noble.clinic@okaxis";
        const clinicName = "Noble Dental Clinic";
        const invoiceId = "INV-2024-001";
        // This link opens GPay/PhonePe directly when clicked on mobile
        const upiLink = `upi://pay?pa=${clinicVpa}&pn=${encodeURIComponent(clinicName)}&am=${total}&tn=${invoiceId}&cu=INR`;

        // 2. Construct WhatsApp Message
        const message = `🧾 *Invoice Generated*\n\n*Clinic:* ${clinicName}\n*Invoice:* ${invoiceId}\n*Amount:* ₹${total.toLocaleString()}\n\n🔗 *Tap to Pay (UPI):*\n${upiLink}\n\nOr scan the QR code at the desk.`;

        // 3. Open WhatsApp
        // In a real app, 'phone' would come from patient details. Using blank to open contact picker.
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');

        console.log("BILL_FINALIZED", { items, total, upiLink });
        // toast.success("Invoice shared via WhatsApp!"); 
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-black/20">
            {/* Header */}
            <div className="p-4 border-b bg-white dark:bg-slate-900">
                <h3 className="font-semibold text-lg">Invoice #INV-2024-001</h3>
                <p className="text-xs text-muted-foreground">Dr. Dhivakaran • <span className="text-green-600">Active Session</span></p>
            </div>

            {/* Line Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm flex-col border-2 border-dashed rounded-lg">
                        <p>No items added.</p>
                        <p className="text-xs opacity-50">Select procedures from the left.</p>
                    </div>
                ) : items.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border shadow-sm group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <div className="text-xs text-muted-foreground flex items-center space-x-2 mt-1">
                                    <span>₹{item.baseCost} x {item.quantity}</span>
                                    {item.taxRate > 0 && <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-[10px]">{item.taxRate}% GST</span>}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm">₹{(item.baseCost * item.quantity).toLocaleString()}</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Bundle Details Expansion */}
                        {item.isBundle && (
                            <div className="mt-2 pt-2 border-t border-dashed text-xs text-slate-500">
                                <div className="flex items-center cursor-pointer hover:text-indigo-600">
                                    <ChevronDown className="w-3 h-3 mr-1" />
                                    Includes {item.bundleItems?.length} items
                                </div>
                                <ul className="list-disc list-inside mt-1 pl-1 text-[10px] opacity-70">
                                    {item.bundleItems?.map((b, i) => <li key={i}>{b}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer / Calculation */}
            <div className="bg-white dark:bg-slate-900 border-t p-4 space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                {/* One-Tap Payment Integration */}
                {total > 0 && <UpiPaymentCard amount={total} />}

                {/* Fintech Toggles */}
                <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <Label htmlFor="emi-toggle" className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Enable EMI (0% Interest)</Label>
                    </div>
                    <Switch id="emi-toggle" checked={enableEmi} onCheckedChange={toggleEmi} />
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>GST Total</span>
                        <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Payable</span>
                        <span>₹{total.toLocaleString()}</span>
                    </div>

                    {/* EMI Calculation */}
                    {enableEmi && (
                        <div className="flex justify-between items-center text-xs bg-green-50 text-green-700 p-2 rounded animate-in fade-in slide-in-from-bottom-2">
                            <span>12-Month EMI @ 0%</span>
                            <span className="font-bold">₹{Math.ceil(monthlyEmi).toLocaleString()}/mo</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" className="col-span-1" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleFinalize} className={cn("col-span-3", enableEmi ? "bg-indigo-600 hover:bg-indigo-700" : "bg-black hover:bg-slate-800")}>
                        <Share2 className="w-4 h-4 mr-2" />
                        {enableEmi ? "Start EMI Application" : "Finalize & WhatsApp"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
