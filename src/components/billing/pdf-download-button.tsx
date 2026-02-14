/**
 * PDF Download Button
 * 
 * Generates and downloads invoice PDF
 */

"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from "./invoice-pdf";
import { useBillingStore } from "@/lib/billing-store";
import { toast } from "sonner";

interface PDFDownloadButtonProps {
    patientName: string;
    patientPhone?: string;
    patientHealthFloId?: string;
}

export function PDFDownloadButton({
    patientName,
    patientPhone,
    patientHealthFloId
}: PDFDownloadButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const { items, invoiceNumber, invoiceDate, getTotals, prepareForPayment } = useBillingStore();

    const handleDownloadPDF = async () => {
        if (items.length === 0) {
            toast.error('No items in invoice');
            return;
        }

        setIsGenerating(true);

        try {
            // Prepare invoice metadata if not already done
            if (!invoiceNumber) {
                prepareForPayment();
            }

            const totals = getTotals();
            const finalInvoiceNumber = invoiceNumber || useBillingStore.getState().generateInvoiceNumber();
            const finalInvoiceDate = invoiceDate || new Date().toISOString();

            // Generate PDF
            const doc = <InvoicePDF
                invoiceNumber={finalInvoiceNumber}
                invoiceDate={finalInvoiceDate}
                patient={{
                    name: patientName,
                    phone: patientPhone,
                    healthFloId: patientHealthFloId
                }}
                clinic={{
                    name: 'Noble Dental Care',
                    address: '1ST Floor, ICA CLINIC, HUDA LAYOUT, NALLAGANDLA, HYDERABAD -500019',
                    phone: '+91-8610-425342',
                    email: 'contact@nobledental.in',
                    gstin: 'XXXXXXXXXXXXX' // Update with actual GSTIN
                }}
                items={items}
                subtotal={totals.subtotal}
                tax={totals.tax}
                total={totals.total}
                paymentMethod="UPI/Cash" // Can be made dynamic
            />;

            const blob = await pdf(doc).toBlob();

            // Download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice_${finalInvoiceNumber}_${patientName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Invoice PDF downloaded!');
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating || items.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
        >
            {isGenerating ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                </>
            ) : (
                <>
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                </>
            )}
        </Button>
    );
}
