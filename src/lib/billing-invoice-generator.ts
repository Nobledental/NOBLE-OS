/**
 * Flight-Ticket Style Billing Invoice PDF Generator
 * 
 * Premium invoice design inspired by airline boarding passes:
 * - Pre-numbered invoice with auto-increment
 * - Tear-off patient stub
 * - Barcode/QR for verification
 * - Payment mode indicators
 * - Modern gradient design
 */

import {
    ClinicBranding,
    PDFColorTheme,
    PDFConfiguration,
    generateThemeCSS,
    generateInvoiceNumber,
    ClinicSettings
} from './pdf-config';

// =============================================================================
// BILLING INVOICE TYPES
// =============================================================================

export interface PatientBillingInfo {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    uhid: string;
    contactNumber: string;
    email?: string;
    address?: string;
}

export interface InvoiceLineItem {
    slNo: number;
    description: string;
    hsn?: string;          // HSN/SAC code
    quantity: number;
    rate: number;
    discount?: number;
    taxPercent?: number;
    amount: number;
}

export interface PaymentDetails {
    mode: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'CHEQUE' | 'INSURANCE' | 'CREDIT';
    transactionId?: string;
    cardLast4?: string;
    upiId?: string;
    chequeName?: string;
    chequeNumber?: string;
    insuranceProvider?: string;
    insurancePolicyNo?: string;
    amountPaid: number;
    balance: number;
}

export interface BillingInvoice {
    // Invoice Details
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate?: Date;

    // Patient Info
    patient: PatientBillingInfo;

    // Billing Details
    lineItems: InvoiceLineItem[];
    subtotal: number;
    discountTotal: number;
    taxableAmount: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    totalTax: number;
    grandTotal: number;
    roundOff?: number;

    // Payment
    payment: PaymentDetails;

    // Additional
    notes?: string;
    termsAndConditions?: string[];
    visitId?: string;
    doctorName: string;
}

// =============================================================================
// FLIGHT TICKET INVOICE GENERATOR
// =============================================================================

export function generateFlightTicketInvoice(
    invoice: BillingInvoice,
    config: PDFConfiguration
): string {
    const { branding, theme } = config;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const getPaymentModeIcon = (mode: PaymentDetails['mode']) => {
        const icons: Record<string, string> = {
            CASH: '💵',
            CARD: '💳',
            UPI: '📱',
            NET_BANKING: '🏦',
            CHEQUE: '📝',
            INSURANCE: '🏥',
            CREDIT: '📋',
        };
        return icons[mode] || '💰';
    };

    const getPaymentModeLabel = (mode: PaymentDetails['mode']) => {
        const labels: Record<string, string> = {
            CASH: 'Cash Payment',
            CARD: 'Card Payment',
            UPI: 'UPI Payment',
            NET_BANKING: 'Net Banking',
            CHEQUE: 'Cheque',
            INSURANCE: 'Insurance',
            CREDIT: 'Credit',
        };
        return labels[mode] || mode;
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoiceNumber} - ${invoice.patient.name}</title>
        <style>
            ${generateThemeCSS(theme)}
            
            @page {
                size: A4 portrait;
                margin: 10mm;
            }
            
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            
            body {
                font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
                font-size: 11px;
                color: ${theme.textPrimary};
                background: #F3F4F6;
                padding: 20px;
            }
            
            .invoice-ticket {
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            }
            
            /* Header Section - Airline Style */
            .ticket-header {
                background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
                color: white;
                padding: 25px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
            }
            
            .ticket-header::after {
                content: '';
                position: absolute;
                bottom: -15px;
                left: 0;
                right: 0;
                height: 30px;
                background: white;
                border-radius: 100% 100% 0 0;
            }
            
            .clinic-info h1 {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 4px;
            }
            
            .clinic-info p {
                font-size: 11px;
                opacity: 0.9;
            }
            
            .invoice-badge {
                text-align: center;
                background: rgba(255,255,255,0.2);
                padding: 15px 25px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }
            
            .invoice-label {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                opacity: 0.8;
            }
            
            .invoice-number {
                font-size: 20px;
                font-weight: 700;
                font-family: 'SF Mono', 'Consolas', monospace;
                letter-spacing: 1px;
                margin-top: 4px;
            }
            
            /* Main Content */
            .ticket-body {
                padding: 30px;
                position: relative;
            }
            
            /* Patient Card - Boarding Pass Style */
            .patient-card {
                display: flex;
                background: ${theme.cardBg};
                border-radius: 12px;
                overflow: hidden;
                margin-bottom: 25px;
                border: 1px solid ${theme.cardBorder};
            }
            
            .patient-main {
                flex: 1;
                padding: 20px;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
            }
            
            .patient-field {
                display: flex;
                flex-direction: column;
            }
            
            .field-label {
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: ${theme.textMuted};
                margin-bottom: 4px;
            }
            
            .field-value {
                font-size: 13px;
                font-weight: 600;
                color: ${theme.textPrimary};
            }
            
            .field-value.large {
                font-size: 16px;
            }
            
            .field-value.mono {
                font-family: 'SF Mono', 'Consolas', monospace;
                letter-spacing: 1px;
            }
            
            .patient-stub {
                width: 140px;
                background: linear-gradient(180deg, ${theme.primary}15 0%, ${theme.secondary}15 100%);
                border-left: 2px dashed ${theme.cardBorder};
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            
            .patient-stub::before,
            .patient-stub::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                left: -11px;
            }
            
            .patient-stub::before { top: -10px; }
            .patient-stub::after { bottom: -10px; }
            
            .stub-uhid {
                font-size: 14px;
                font-weight: 700;
                color: ${theme.primary};
                font-family: 'SF Mono', 'Consolas', monospace;
                writing-mode: vertical-lr;
                transform: rotate(180deg);
                letter-spacing: 2px;
            }
            
            /* Date & Payment Row */
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 25px;
                gap: 20px;
            }
            
            .info-box {
                flex: 1;
                background: ${theme.cardBg};
                border-radius: 12px;
                padding: 15px 20px;
                border: 1px solid ${theme.cardBorder};
            }
            
            .info-box.payment {
                background: linear-gradient(135deg, ${theme.successBg} 0%, ${theme.cardBg} 100%);
                border-color: ${theme.positive}40;
            }
            
            .info-box.unpaid {
                background: linear-gradient(135deg, #FEF2F2 0%, ${theme.cardBg} 100%);
                border-color: ${theme.danger}40;
            }
            
            .payment-mode-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: ${theme.primary};
                color: white;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
            }
            
            /* Items Table */
            .items-section {
                margin-bottom: 25px;
            }
            
            .section-title {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: ${theme.primary};
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid ${theme.primary};
            }
            
            .items-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .items-table thead {
                background: ${theme.sectionBarBg};
                color: ${theme.sectionBarText};
            }
            
            .items-table th {
                padding: 12px 10px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                text-align: left;
            }
            
            .items-table th:last-child {
                text-align: right;
            }
            
            .items-table td {
                padding: 12px 10px;
                border-bottom: 1px solid ${theme.cardBorder};
                font-size: 11px;
            }
            
            .items-table td:last-child {
                text-align: right;
                font-weight: 600;
            }
            
            .items-table tr:hover {
                background: ${theme.cardBg};
            }
            
            /* Totals Section */
            .totals-section {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 25px;
            }
            
            .totals-box {
                width: 280px;
                background: ${theme.cardBg};
                border-radius: 12px;
                padding: 20px;
                border: 1px solid ${theme.cardBorder};
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 12px;
            }
            
            .total-row.subtotal {
                border-bottom: 1px solid ${theme.cardBorder};
            }
            
            .total-row.grand-total {
                border-top: 2px solid ${theme.primary};
                margin-top: 10px;
                padding-top: 15px;
                font-size: 16px;
                font-weight: 700;
                color: ${theme.primary};
            }
            
            .total-row.paid {
                color: ${theme.positive};
            }
            
            .total-row.balance {
                color: ${theme.danger};
                font-weight: 600;
            }
            
            /* QR & Barcode Section */
            .verification-strip {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: ${theme.cardBg};
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
                border: 1px solid ${theme.cardBorder};
            }
            
            .barcode-section {
                flex: 1;
            }
            
            .barcode {
                font-family: 'Libre Barcode 39', cursive;
                font-size: 48px;
                letter-spacing: 2px;
                color: ${theme.textPrimary};
            }
            
            .barcode-text {
                font-size: 10px;
                color: ${theme.textMuted};
                letter-spacing: 2px;
                margin-top: 5px;
            }
            
            .qr-section {
                text-align: center;
            }
            
            .qr-placeholder {
                width: 80px;
                height: 80px;
                background: ${theme.primary}10;
                border: 1px dashed ${theme.primary}40;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${theme.textMuted};
                font-size: 10px;
            }
            
            /* Footer */
            .ticket-footer {
                background: ${theme.footerBg};
                padding: 20px 30px;
                border-top: 1px dashed ${theme.cardBorder};
            }
            
            .footer-info {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: ${theme.footerText};
            }
            
            .footer-clinic {
                font-weight: 600;
            }
            
            .electronic-notice {
                text-align: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px dashed ${theme.cardBorder};
            }
            
            .electronic-notice span {
                display: block;
            }
            
            .notice-text {
                font-size: 9px;
                color: ${theme.textMuted};
            }
            
            .system-brand {
                font-size: 11px;
                font-weight: 600;
                color: ${theme.secondary};
                margin-top: 4px;
            }
            
            /* Print Styles */
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                
                .invoice-ticket {
                    box-shadow: none;
                    border-radius: 0;
                }
                
                * {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-ticket">
            <!-- Header -->
            <div class="ticket-header">
                <div class="clinic-info">
                    ${branding.logo ? `<img src="${branding.logo}" alt="${branding.clinicName}" style="height: 40px; margin-bottom: 8px;" />` : ''}
                    <h1>${branding.clinicName}</h1>
                    <p>${branding.tagline || ''}</p>
                </div>
                <div class="invoice-badge">
                    <div class="invoice-label">Invoice No.</div>
                    <div class="invoice-number">${invoice.invoiceNumber}</div>
                </div>
            </div>
            
            <!-- Body -->
            <div class="ticket-body">
                <!-- Patient Card -->
                <div class="patient-card">
                    <div class="patient-main">
                        <div class="patient-field" style="grid-column: span 2;">
                            <span class="field-label">Patient Name</span>
                            <span class="field-value large">${invoice.patient.name.toUpperCase()}</span>
                        </div>
                        <div class="patient-field">
                            <span class="field-label">Age / Gender</span>
                            <span class="field-value">${invoice.patient.age} Yrs / ${invoice.patient.gender}</span>
                        </div>
                        <div class="patient-field">
                            <span class="field-label">Contact Number</span>
                            <span class="field-value mono">${invoice.patient.contactNumber}</span>
                        </div>
                        <div class="patient-field">
                            <span class="field-label">UHID</span>
                            <span class="field-value mono" style="color: ${theme.primary};">${invoice.patient.uhid}</span>
                        </div>
                        <div class="patient-field">
                            <span class="field-label">Consulting Doctor</span>
                            <span class="field-value">${invoice.doctorName}</span>
                        </div>
                    </div>
                    <div class="patient-stub">
                        <div class="stub-uhid">${invoice.patient.uhid}</div>
                    </div>
                </div>
                
                <!-- Date & Payment Row -->
                <div class="info-row">
                    <div class="info-box">
                        <div class="patient-field">
                            <span class="field-label">Invoice Date</span>
                            <span class="field-value">${formatDate(invoice.invoiceDate)}</span>
                        </div>
                    </div>
                    ${invoice.dueDate ? `
                    <div class="info-box">
                        <div class="patient-field">
                            <span class="field-label">Due Date</span>
                            <span class="field-value">${formatDate(invoice.dueDate)}</span>
                        </div>
                    </div>
                    ` : ''}
                    <div class="info-box ${invoice.payment.balance > 0 ? 'unpaid' : 'payment'}">
                        <div class="patient-field">
                            <span class="field-label">Payment Status</span>
                            <span class="payment-mode-badge">
                                ${getPaymentModeIcon(invoice.payment.mode)} ${getPaymentModeLabel(invoice.payment.mode)}
                            </span>
                        </div>
                        ${invoice.payment.transactionId ? `
                        <div style="margin-top: 8px; font-size: 10px; color: ${theme.textMuted};">
                            Txn: ${invoice.payment.transactionId}
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Items Table -->
                <div class="items-section">
                    <div class="section-title">Services & Charges</div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th style="width: 40px;">S.No</th>
                                <th>Description</th>
                                <th style="width: 60px;">Qty</th>
                                <th style="width: 80px;">Rate</th>
                                <th style="width: 70px;">Disc</th>
                                <th style="width: 90px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.lineItems.map(item => `
                            <tr>
                                <td>${item.slNo}</td>
                                <td>
                                    ${item.description}
                                    ${item.hsn ? `<br><span style="font-size: 9px; color: ${theme.textMuted};">HSN: ${item.hsn}</span>` : ''}
                                </td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.rate)}</td>
                                <td>${item.discount ? formatCurrency(item.discount) : '-'}</td>
                                <td>${formatCurrency(item.amount)}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Totals -->
                <div class="totals-section">
                    <div class="totals-box">
                        <div class="total-row subtotal">
                            <span>Subtotal</span>
                            <span>${formatCurrency(invoice.subtotal)}</span>
                        </div>
                        ${invoice.discountTotal > 0 ? `
                        <div class="total-row">
                            <span>Discount</span>
                            <span style="color: ${theme.positive};">- ${formatCurrency(invoice.discountTotal)}</span>
                        </div>
                        ` : ''}
                        ${invoice.cgst ? `
                        <div class="total-row">
                            <span>CGST (9%)</span>
                            <span>${formatCurrency(invoice.cgst)}</span>
                        </div>
                        ` : ''}
                        ${invoice.sgst ? `
                        <div class="total-row">
                            <span>SGST (9%)</span>
                            <span>${formatCurrency(invoice.sgst)}</span>
                        </div>
                        ` : ''}
                        ${invoice.roundOff ? `
                        <div class="total-row">
                            <span>Round Off</span>
                            <span>${invoice.roundOff > 0 ? '+' : ''}${formatCurrency(invoice.roundOff)}</span>
                        </div>
                        ` : ''}
                        <div class="total-row grand-total">
                            <span>Grand Total</span>
                            <span>${formatCurrency(invoice.grandTotal)}</span>
                        </div>
                        <div class="total-row paid">
                            <span>Amount Paid</span>
                            <span>${formatCurrency(invoice.payment.amountPaid)}</span>
                        </div>
                        ${invoice.payment.balance > 0 ? `
                        <div class="total-row balance">
                            <span>Balance Due</span>
                            <span>${formatCurrency(invoice.payment.balance)}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Verification Strip -->
                <div class="verification-strip">
                    <div class="barcode-section">
                        <div class="barcode">*${invoice.invoiceNumber}*</div>
                        <div class="barcode-text">${invoice.invoiceNumber}</div>
                    </div>
                    <div class="qr-section">
                        <div class="qr-placeholder">QR Code</div>
                    </div>
                </div>
                
                ${invoice.notes ? `
                <div style="margin-bottom: 20px; font-size: 11px; color: ${theme.textSecondary};">
                    <strong>Notes:</strong> ${invoice.notes}
                </div>
                ` : ''}
            </div>
            
            <!-- Footer -->
            <div class="ticket-footer">
                <div class="footer-info">
                    <div class="footer-clinic">
                        ${branding.clinicName} | ${branding.phone}
                    </div>
                    <div>
                        ${branding.registrationNumber ? `Reg: ${branding.registrationNumber} | ` : ''}
                        ${branding.gstNumber ? `GST: ${branding.gstNumber}` : ''}
                    </div>
                </div>
                <div style="font-size: 9px; color: ${theme.textMuted}; margin-top: 10px;">
                    ${branding.address}
                </div>
                <div class="electronic-notice">
                    <span class="notice-text">This is a Computer Generated Invoice - No Signature Required</span>
                    <span class="system-brand">HealthFlo Dental-OS</span>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// =============================================================================
// INVOICE NUMBER GENERATOR
// =============================================================================

export function generateNextInvoiceNumber(
    prefix: string = 'INV',
    currentNumber: number = 1001
): { number: string; nextSequence: number } {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const sequence = currentNumber.toString().padStart(6, '0');

    return {
        number: `${prefix}-${year}${month}${day}-${sequence}`,
        nextSequence: currentNumber + 1,
    };
}

// =============================================================================
// SAMPLE INVOICE FOR TESTING
// =============================================================================

export function createSampleInvoice(): BillingInvoice {
    return {
        invoiceNumber: 'INV-250131-001001',
        invoiceDate: new Date(),
        patient: {
            name: 'SHARAD KUMAR',
            age: 72,
            gender: 'Female',
            uhid: 'NDC0106202509',
            contactNumber: '+91-9876543210',
        },
        lineItems: [
            { slNo: 1, description: 'Root Canal Treatment - 46', quantity: 1, rate: 8000, amount: 8000 },
            { slNo: 2, description: 'Dental Crown - PFM', quantity: 1, rate: 5000, discount: 500, amount: 4500 },
            { slNo: 3, description: 'X-Ray - IOPA', quantity: 2, rate: 200, amount: 400 },
            { slNo: 4, description: 'Consultation', quantity: 1, rate: 500, amount: 500 },
        ],
        subtotal: 13400,
        discountTotal: 500,
        taxableAmount: 12900,
        cgst: 0,
        sgst: 0,
        totalTax: 0,
        grandTotal: 12900,
        payment: {
            mode: 'UPI',
            transactionId: 'UPI123456789',
            amountPaid: 12900,
            balance: 0,
        },
        doctorName: 'DR DHIVAKARAN',
    };
}
