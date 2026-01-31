"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

interface Transaction {
    id: string;
    total_amount: string;
    payment_mode: string;
    is_verified: boolean;
    appointment: {
        patient: {
            first_name: string;
            last_name: string;
        };
    };
    invoice?: {
        invoice_no: string;
    };
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
    const queryClient = useQueryClient();

    const verifyMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.post(`/settlement/verify/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-transactions"] });
            toast.success("Transaction verified successfully");
        }
    });

    return (
        <div className="rounded-2xl border bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                        <TableHead className="font-bold">Patient</TableHead>
                        <TableHead className="font-bold">Invoice</TableHead>
                        <TableHead className="font-bold text-right">Amount</TableHead>
                        <TableHead className="font-bold">Mode</TableHead>
                        <TableHead className="font-bold text-center">Status</TableHead>
                        <TableHead className="font-bold text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                                No transactions found for today.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((tx) => (
                            <TableRow key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                                <TableCell>
                                    <div className="font-medium">
                                        {tx.appointment.patient.first_name} {tx.appointment.patient.last_name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono text-xs text-muted-foreground uppercase">{tx.invoice?.invoice_no || "N/A"}</span>
                                </TableCell>
                                <TableCell className="text-right font-black">
                                    ₹{tx.total_amount}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-indigo-50/50 text-indigo-600 border-indigo-100 uppercase tracking-tighter text-[10px]">
                                        {tx.payment_mode || "PNDG"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {tx.is_verified ? (
                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 gap-1 rounded-full px-2">
                                            <CheckCircle2 className="h-3 w-3" /> VERIFIED
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 gap-1 rounded-full px-2">
                                            <Clock className="h-3 w-3" /> PENDING
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {!tx.is_verified && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold px-4 rounded-full"
                                            onClick={() => verifyMutation.mutate(tx.id)}
                                            disabled={verifyMutation.isPending}
                                        >
                                            Verify Cash/Bank
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
