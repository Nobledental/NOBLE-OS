"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TransactionList } from "@/components/settlement/transaction-list";
import { generateSettlementPDF } from "@/components/settlement/settlement-pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Landmark, CreditCard, ShieldCheck, Download, Zap, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export default function SettlementPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
    const clinicId = "noble-dental-primary"; // Simplified for now

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ["daily-transactions", selectedDate],
        queryFn: async () => {
            const res = await api.get(`/settlement/transactions/${clinicId}?date=${selectedDate}`);
            return res.data;
        }
    });

    const { data: settlementStatus } = useQuery({
        queryKey: ["settlement-status", selectedDate],
        queryFn: async () => {
            const res = await api.get(`/settlement/status/${clinicId}?date=${selectedDate}`);
            return res.data;
        }
    });

    const closeDayMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/settlement/close/${clinicId}`, {
                date: selectedDate,
                userId: user?.id || "admin"
            });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["settlement-status"] });
            toast.success("Day closed and revenue locked!");
            generateSettlementPDF(data, transactions);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to close day");
        }
    });

    const isAllVerified = transactions.length > 0 && transactions.every((tx: any) => tx.is_verified);
    const isClosed = settlementStatus?.status === "CLOSED";

    // Summary Calculations
    const totalCash = transactions.filter((t: any) => t.payment_mode === "CASH").reduce((acc: number, t: any) => acc + Number(t.total_amount), 0);
    const totalUPI = transactions.filter((t: any) => t.payment_mode === "UPI").reduce((acc: number, t: any) => acc + Number(t.total_amount), 0);
    const totalCard = transactions.filter((t: any) => t.payment_mode === "CARD").reduce((acc: number, t: any) => acc + Number(t.total_amount), 0);
    const totalRevenue = totalCash + totalUPI + totalCard;

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tighter">EOD SETTLEMENT</h1>
                        {isClosed ? (
                            <Badge className="bg-emerald-500 text-white font-bold border-none px-3">
                                LOCKED & CLOSED
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 animate-pulse font-bold">
                                OPEN SESSION
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground font-medium">Verified audit trail for {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="flex gap-3">
                    {isClosed ? (
                        <Button
                            variant="outline"
                            className="bg-white hover:bg-slate-50 border-2 gap-2 h-12 px-6 rounded-2xl font-bold shadow-sm"
                            onClick={() => generateSettlementPDF(settlementStatus, transactions)}
                        >
                            <Download className="h-5 w-5" /> Download Report
                        </Button>
                    ) : (
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-12 px-8 rounded-2xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50"
                            disabled={!isAllVerified || transactions.length === 0 || closeDayMutation.isPending}
                            onClick={() => closeDayMutation.mutate()}
                        >
                            <ShieldCheck className="h-5 w-5" /> Execute Day Close Ritual
                        </Button>
                    )}
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Cash in Box</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">₹{totalCash.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase text-muted-foreground">UPI / Digital</CardTitle>
                        <Landmark className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">₹{totalUPI.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Card Swipes</CardTitle>
                        <CreditCard className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">₹{totalCard.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-slate-100 bg-white dark:bg-slate-950 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase text-indigo-600">Total Revenue</CardTitle>
                        <Zap className="h-4 w-4 text-indigo-600 fill-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Verification Alert */}
            {!isClosed && !isAllVerified && transactions.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900">Verification Required</h4>
                        <p className="text-sm text-amber-700">Please verify all cash and digital transactions before closing the day. {transactions.filter((t: any) => !t.is_verified).length} pending items.</p>
                    </div>
                </div>
            )}

            {/* Transaction Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Transaction Audit Trail</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> VERIFIED</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> PENDING</span>
                    </div>
                </div>
                <TransactionList transactions={transactions} />
            </div>

            {/* Leapfrog Tip */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-indigo-400" />
                        <h4 className="font-bold uppercase tracking-widest text-xs">Security Protocol Active</h4>
                    </div>
                    <p className="text-slate-300 text-sm max-w-2xl">
                        Closing the day executes an **Immutable Ledger Lockdown**. Once verified and closed, today&apos;s billing records will be locked to prevent unauthorized modifications.
                        Any corrections post-closing will require an Admin override and will be logged in the Master Audit Trail.
                    </p>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-slate-700/10 skew-x-12 transform translate-x-1/2" />
            </div>
        </div>
    );
}
