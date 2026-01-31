'use client';

/**
 * Editable Billing Interface
 * 
 * Features:
 * - Auto-populate from treatment records
 * - Manual edit of line items
 * - Tariff lookup and mapping
 * - Live total calculation
 * - PDF preview and export
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Search,
    Edit2,
    Save,
    X,
    FileText,
    Printer,
    Download,
    Eye,
    AlertCircle,
    Check,
    RefreshCw,
    IndianRupee,
    Percent,
    Calculator,
    Package,
    CreditCard,
    Wallet,
    Smartphone,
    Building2,
    FileCheck,
    Shield
} from 'lucide-react';
import {
    BillingInvoice,
    InvoiceLineItem,
    PaymentDetails,
    PatientBillingInfo,
    generateFlightTicketInvoice,
    generateNextInvoiceNumber
} from '@/lib/billing-invoice-generator';
import {
    createPDFConfiguration,
    ClinicSettings,
    DEFAULT_CLINIC_SETTINGS
} from '@/lib/pdf-config';

// =============================================================================
// TARIFF TYPES
// =============================================================================

export interface TariffItem {
    id: string;
    code: string;
    name: string;
    category: string;
    subcategory?: string;
    baseRate: number;
    hsnSac?: string;
    taxPercent?: number;
    isActive: boolean;
}

export interface TariffCategory {
    id: string;
    name: string;
    items: TariffItem[];
}

// =============================================================================
// MOCK TARIFF DATA (Replace with API call)
// =============================================================================

const MOCK_TARIFF_DATA: TariffItem[] = [
    { id: 't1', code: 'RCT-01', name: 'Root Canal Treatment - Single Canal', category: 'Endodontics', baseRate: 5000, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't2', code: 'RCT-02', name: 'Root Canal Treatment - Multi Canal', category: 'Endodontics', baseRate: 8000, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't3', code: 'CRW-PFM', name: 'Crown - PFM (Porcelain Fused Metal)', category: 'Prosthetics', baseRate: 5000, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't4', code: 'CRW-ZIR', name: 'Crown - Zirconia', category: 'Prosthetics', baseRate: 12000, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't5', code: 'EXT-SMP', name: 'Extraction - Simple', category: 'Oral Surgery', baseRate: 800, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't6', code: 'EXT-SUR', name: 'Extraction - Surgical', category: 'Oral Surgery', baseRate: 3000, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't7', code: 'FIL-COM', name: 'Composite Filling', category: 'Restorative', baseRate: 800, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't8', code: 'FIL-GIC', name: 'GIC Filling', category: 'Restorative', baseRate: 500, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't9', code: 'SCA-FMD', name: 'Scaling - Full Mouth', category: 'Preventive', baseRate: 1500, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't10', code: 'XRY-IOPA', name: 'X-Ray - IOPA', category: 'Radiology', baseRate: 200, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't11', code: 'XRY-OPG', name: 'X-Ray - OPG', category: 'Radiology', baseRate: 500, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't12', code: 'CON-01', name: 'Consultation', category: 'Consultation', baseRate: 500, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't13', code: 'IMP-01', name: 'Dental Implant - Standard', category: 'Implantology', baseRate: 35000, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't14', code: 'ORT-BRC', name: 'Orthodontic Braces - Metal', category: 'Orthodontics', baseRate: 40000, hsnSac: '999312', taxPercent: 0, isActive: true },
    { id: 't15', code: 'BLE-01', name: 'Teeth Whitening', category: 'Cosmetic', baseRate: 8000, hsnSac: '999312', taxPercent: 0, isActive: true },
];

// =============================================================================
// EDITABLE LINE ITEM ROW
// =============================================================================

interface LineItemRowProps {
    item: InvoiceLineItem;
    index: number;
    onUpdate: (index: number, item: InvoiceLineItem) => void;
    onDelete: (index: number) => void;
    onTariffSearch: (index: number) => void;
    isEditing: boolean;
}

const LineItemRow: React.FC<LineItemRowProps> = ({
    item,
    index,
    onUpdate,
    onDelete,
    onTariffSearch,
    isEditing
}) => {
    const handleFieldChange = (field: keyof InvoiceLineItem, value: string | number) => {
        const updatedItem = { ...item, [field]: value };

        // Recalculate amount
        if (field === 'quantity' || field === 'rate' || field === 'discount') {
            const qty = field === 'quantity' ? Number(value) : item.quantity;
            const rate = field === 'rate' ? Number(value) : item.rate;
            const discount = field === 'discount' ? Number(value) : (item.discount || 0);
            updatedItem.amount = (qty * rate) - discount;
        }

        onUpdate(index, updatedItem);
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    return (
        <motion.tr
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
        >
            {/* S.No */}
            <td className="px-3 py-3 text-center text-sm text-gray-500 font-medium">
                {item.slNo}
            </td>

            {/* Description */}
            <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Service description"
                        />
                    ) : (
                        <span className="text-sm text-gray-800">{item.description}</span>
                    )}
                    {isEditing && (
                        <button
                            onClick={() => onTariffSearch(index)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Search Tariff"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {item.hsn && (
                    <span className="text-xs text-gray-400 mt-1 block">HSN: {item.hsn}</span>
                )}
            </td>

            {/* Quantity */}
            <td className="px-3 py-3 text-center">
                {isEditing ? (
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-700">{item.quantity}</span>
                )}
            </td>

            {/* Rate */}
            <td className="px-3 py-3 text-right">
                {isEditing ? (
                    <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleFieldChange('rate', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1.5 text-sm text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-700">{formatCurrency(item.rate)}</span>
                )}
            </td>

            {/* Discount */}
            <td className="px-3 py-3 text-right">
                {isEditing ? (
                    <input
                        type="number"
                        min="0"
                        value={item.discount || 0}
                        onChange={(e) => handleFieldChange('discount', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1.5 text-sm text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                ) : (
                    <span className="text-sm text-gray-500">
                        {item.discount ? `-${formatCurrency(item.discount)}` : '-'}
                    </span>
                )}
            </td>

            {/* Amount */}
            <td className="px-3 py-3 text-right">
                <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                </span>
            </td>

            {/* Actions */}
            {isEditing && (
                <td className="px-3 py-3 text-center">
                    <button
                        onClick={() => onDelete(index)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </td>
            )}
        </motion.tr>
    );
};

// =============================================================================
// TARIFF SEARCH MODAL
// =============================================================================

interface TariffSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (tariff: TariffItem) => void;
    tariffData: TariffItem[];
}

const TariffSearchModal: React.FC<TariffSearchModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    tariffData
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = new Set(tariffData.map(t => t.category));
        return Array.from(cats).sort();
    }, [tariffData]);

    const filteredTariffs = useMemo(() => {
        return tariffData.filter(t => {
            const matchesSearch = searchQuery === '' ||
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || t.category === selectedCategory;
            return matchesSearch && matchesCategory && t.isActive;
        });
    }, [tariffData, searchQuery, selectedCategory]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Select from Tariff</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="px-6 py-4 border-b border-gray-100 space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or code..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${!selectedCategory
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${selectedCategory === cat
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                    {filteredTariffs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Package className="w-12 h-12 mb-3" />
                            <p className="text-sm">No tariffs found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredTariffs.map(tariff => (
                                <button
                                    key={tariff.id}
                                    onClick={() => {
                                        onSelect(tariff);
                                        onClose();
                                    }}
                                    className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                                {tariff.code}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {tariff.name}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 block">
                                            {tariff.category}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600">
                                        {formatCurrency(tariff.baseRate)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// =============================================================================
// PAYMENT MODE SELECTOR
// =============================================================================

interface PaymentModeSelectorProps {
    value: PaymentDetails['mode'];
    onChange: (mode: PaymentDetails['mode']) => void;
}

const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({ value, onChange }) => {
    const modes: Array<{ mode: PaymentDetails['mode']; label: string; icon: React.ReactNode }> = [
        { mode: 'CASH', label: 'Cash', icon: <Wallet className="w-4 h-4" /> },
        { mode: 'CARD', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
        { mode: 'UPI', label: 'UPI', icon: <Smartphone className="w-4 h-4" /> },
        { mode: 'NET_BANKING', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
        { mode: 'CHEQUE', label: 'Cheque', icon: <FileCheck className="w-4 h-4" /> },
        { mode: 'INSURANCE', label: 'Insurance', icon: <Shield className="w-4 h-4" /> },
    ];

    return (
        <div className="grid grid-cols-3 gap-2">
            {modes.map(({ mode, label, icon }) => (
                <button
                    key={mode}
                    onClick={() => onChange(mode)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${value === mode
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                >
                    {icon}
                    <span className="text-sm font-medium">{label}</span>
                </button>
            ))}
        </div>
    );
};

// =============================================================================
// MAIN BILLING EDITOR COMPONENT
// =============================================================================

interface BillingEditorProps {
    patientInfo: PatientBillingInfo;
    initialLineItems?: InvoiceLineItem[];
    onSave?: (invoice: BillingInvoice) => void;
    clinicSettings?: ClinicSettings;
    doctorName?: string;
}

export const BillingEditor: React.FC<BillingEditorProps> = ({
    patientInfo,
    initialLineItems = [],
    onSave,
    clinicSettings = DEFAULT_CLINIC_SETTINGS,
    doctorName = 'DR DHIVAKARAN'
}) => {
    // State
    const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(
        initialLineItems.length > 0 ? initialLineItems : []
    );
    const [isEditing, setIsEditing] = useState(true);
    const [showTariffModal, setShowTariffModal] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [paymentMode, setPaymentMode] = useState<PaymentDetails['mode']>('CASH');
    const [transactionId, setTransactionId] = useState('');
    const [amountPaid, setAmountPaid] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [notes, setNotes] = useState('');

    // Calculate totals
    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const itemDiscounts = lineItems.reduce((sum, item) => sum + (item.discount || 0), 0);
        const overallDiscount = subtotal * (discountPercent / 100);
        const discountTotal = itemDiscounts + overallDiscount;
        const taxableAmount = subtotal - discountTotal;
        const cgst = 0; // Set based on GST rules
        const sgst = 0;
        const totalTax = cgst + sgst;
        const grandTotal = taxableAmount + totalTax;
        const roundOff = Math.round(grandTotal) - grandTotal;
        const finalTotal = Math.round(grandTotal);
        const balance = finalTotal - amountPaid;

        return {
            subtotal,
            itemDiscounts,
            overallDiscount,
            discountTotal,
            taxableAmount,
            cgst,
            sgst,
            totalTax,
            grandTotal,
            roundOff,
            finalTotal,
            balance
        };
    }, [lineItems, discountPercent, amountPaid]);

    // Add new line item
    const addLineItem = () => {
        const newItem: InvoiceLineItem = {
            slNo: lineItems.length + 1,
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        };
        setLineItems([...lineItems, newItem]);
    };

    // Update line item
    const updateLineItem = (index: number, updatedItem: InvoiceLineItem) => {
        const newItems = [...lineItems];
        newItems[index] = updatedItem;
        setLineItems(newItems);
    };

    // Delete line item
    const deleteLineItem = (index: number) => {
        const newItems = lineItems.filter((_, i) => i !== index);
        // Renumber
        newItems.forEach((item, i) => { item.slNo = i + 1; });
        setLineItems(newItems);
    };

    // Handle tariff selection
    const handleTariffSelect = (tariff: TariffItem) => {
        if (editingItemIndex !== null) {
            const updatedItem: InvoiceLineItem = {
                ...lineItems[editingItemIndex],
                description: tariff.name,
                hsn: tariff.hsnSac,
                rate: tariff.baseRate,
                taxPercent: tariff.taxPercent,
                amount: lineItems[editingItemIndex].quantity * tariff.baseRate
            };
            updateLineItem(editingItemIndex, updatedItem);
        }
        setEditingItemIndex(null);
    };

    // Open tariff search for specific item
    const openTariffSearch = (index: number) => {
        setEditingItemIndex(index);
        setShowTariffModal(true);
    };

    // Generate invoice object
    const generateInvoice = (): BillingInvoice => {
        const { number: invoiceNumber, nextSequence } = generateNextInvoiceNumber(
            clinicSettings.invoicePrefix,
            clinicSettings.currentInvoiceNumber
        );

        return {
            invoiceNumber,
            invoiceDate: new Date(),
            patient: patientInfo,
            lineItems,
            subtotal: totals.subtotal,
            discountTotal: totals.discountTotal,
            taxableAmount: totals.taxableAmount,
            cgst: totals.cgst,
            sgst: totals.sgst,
            totalTax: totals.totalTax,
            grandTotal: totals.finalTotal,
            roundOff: totals.roundOff,
            payment: {
                mode: paymentMode,
                transactionId: transactionId || undefined,
                amountPaid,
                balance: totals.balance
            },
            notes: notes || undefined,
            doctorName
        };
    };

    // Preview invoice
    const handlePreview = () => {
        const invoice = generateInvoice();
        const config = createPDFConfiguration(
            clinicSettings.branding,
            clinicSettings.selectedTheme as any
        );
        const html = generateFlightTicketInvoice(invoice, config);

        // Open in new window
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
            previewWindow.document.write(html);
            previewWindow.document.close();
        }
    };

    // Export as PDF
    const handleExportPDF = () => {
        const invoice = generateInvoice();
        const config = createPDFConfiguration(
            clinicSettings.branding,
            clinicSettings.selectedTheme as any
        );
        const html = generateFlightTicketInvoice(invoice, config);

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    // Save invoice
    const handleSave = () => {
        const invoice = generateInvoice();
        onSave?.(invoice);
        setIsEditing(false);
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Billing</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {patientInfo.name} | {patientInfo.uhid}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handlePreview}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Printer className="w-4 h-4" />
                                    Print
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Patient Info Bar */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2 font-medium text-gray-900">{patientInfo.name}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Age/Gender:</span>
                        <span className="ml-2 font-medium text-gray-900">{patientInfo.age}Y / {patientInfo.gender}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">UHID:</span>
                        <span className="ml-2 font-mono font-medium text-blue-600">{patientInfo.uhid}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Contact:</span>
                        <span className="ml-2 font-medium text-gray-900">{patientInfo.contactNumber}</span>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Services & Charges
                    </h3>
                    {isEditing && (
                        <button
                            onClick={addLineItem}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    )}
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-12">
                                    #
                                </th>
                                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Description
                                </th>
                                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-20">
                                    Qty
                                </th>
                                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-28">
                                    Rate
                                </th>
                                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-24">
                                    Discount
                                </th>
                                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-28">
                                    Amount
                                </th>
                                {isEditing && (
                                    <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-12">
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {lineItems.map((item, index) => (
                                    <LineItemRow
                                        key={`${item.slNo}-${index}`}
                                        item={item}
                                        index={index}
                                        onUpdate={updateLineItem}
                                        onDelete={deleteLineItem}
                                        onTariffSearch={openTariffSearch}
                                        isEditing={isEditing}
                                    />
                                ))}
                            </AnimatePresence>
                            {lineItems.length === 0 && (
                                <tr>
                                    <td colSpan={isEditing ? 7 : 6} className="px-6 py-12 text-center text-gray-400">
                                        <Package className="w-10 h-10 mx-auto mb-3" />
                                        <p className="text-sm">No items added yet</p>
                                        {isEditing && (
                                            <button
                                                onClick={addLineItem}
                                                className="mt-3 text-blue-500 hover:text-blue-600 text-sm font-medium"
                                            >
                                                + Add your first item
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Discount & Payment */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-6">
                {/* Left Column - Payment Mode */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Payment Details
                    </h3>

                    <PaymentModeSelector
                        value={paymentMode}
                        onChange={setPaymentMode}
                    />

                    {(paymentMode === 'UPI' || paymentMode === 'CARD' || paymentMode === 'NET_BANKING') && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 block mb-1">
                                Transaction ID
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter transaction ID"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">
                            Amount Paid
                        </label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => setAmountPaid(totals.finalTotal)}
                            className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                        >
                            Pay full amount ({formatCurrency(totals.finalTotal)})
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Add any notes..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                    </div>
                </div>

                {/* Right Column - Totals */}
                <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                        Summary
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                        </div>

                        {/* Overall Discount */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Discount</span>
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discountPercent}
                                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 text-sm text-center border border-gray-200 rounded-lg"
                                    disabled={!isEditing}
                                />
                                <Percent className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-green-600">
                                -{formatCurrency(totals.discountTotal)}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Taxable Amount</span>
                            <span className="font-medium">{formatCurrency(totals.taxableAmount)}</span>
                        </div>

                        {totals.cgst > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">CGST (9%)</span>
                                <span className="font-medium">{formatCurrency(totals.cgst)}</span>
                            </div>
                        )}

                        {totals.sgst > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">SGST (9%)</span>
                                <span className="font-medium">{formatCurrency(totals.sgst)}</span>
                            </div>
                        )}

                        {totals.roundOff !== 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Round Off</span>
                                <span className="font-medium">
                                    {totals.roundOff > 0 ? '+' : ''}{formatCurrency(totals.roundOff)}
                                </span>
                            </div>
                        )}

                        <div className="pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-gray-800">Grand Total</span>
                                <span className="text-blue-600">{formatCurrency(totals.finalTotal)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount Paid</span>
                            <span className="font-medium text-green-600">{formatCurrency(amountPaid)}</span>
                        </div>

                        {totals.balance > 0 && (
                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                                <span className="text-red-600 font-medium">Balance Due</span>
                                <span className="font-bold text-red-600">{formatCurrency(totals.balance)}</span>
                            </div>
                        )}

                        {totals.balance === 0 && amountPaid > 0 && (
                            <div className="flex items-center justify-center gap-2 pt-3 text-green-600">
                                <Check className="w-5 h-5" />
                                <span className="font-semibold">Fully Paid</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tariff Search Modal */}
            <TariffSearchModal
                isOpen={showTariffModal}
                onClose={() => setShowTariffModal(false)}
                onSelect={handleTariffSelect}
                tariffData={MOCK_TARIFF_DATA}
            />
        </div>
    );
};

export default BillingEditor;
