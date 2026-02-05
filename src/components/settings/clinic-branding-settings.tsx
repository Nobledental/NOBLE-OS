'use client';

/**
 * Clinic Branding Settings Component
 * 
 * Allows clinic to configure:
 * - Logo upload
 * - Clinic name & details
 * - PDF color theme selection
 * - Invoice numbering preferences
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Palette,
    Upload,
    Check,
    X,
    FileText,
    Hash,
    Phone,
    Mail,
    MapPin,
    User,
    Save,
    RotateCcw,
    Eye,
    Printer
} from 'lucide-react';
import {
    ClinicBranding,
    PDFColorTheme,
    PDF_COLOR_THEMES,
    ClinicSettings,
    DEFAULT_CLINIC_SETTINGS,
    createPDFConfiguration
} from '@/lib/pdf-config';
import { generateFlightTicketInvoice, createSampleInvoice } from '@/lib/billing-invoice-generator';
import { LocationPicker } from '@/components/location-picker';
import { Globe, Search } from 'lucide-react';

// =============================================================================
// COMPONENT TYPES
// =============================================================================

interface ClinicBrandingSettingsProps {
    initialSettings?: ClinicSettings;
    onSave?: (settings: ClinicSettings) => void;
    onCancel?: () => void;
}

// =============================================================================
// COLOR THEME PREVIEW CARD
// =============================================================================

const ThemePreviewCard: React.FC<{
    theme: PDFColorTheme;
    themeName: string;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ theme, themeName, isSelected, onSelect }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            style={{ background: 'white' }}
        >
            {/* Selected indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                    <Check className="w-4 h-4 text-white" />
                </motion.div>
            )}

            {/* Theme preview */}
            <div className="space-y-3">
                {/* Header bar preview */}
                <div
                    className="h-8 rounded-md flex items-center px-3"
                    style={{ background: theme.headerBg }}
                >
                    <span className="text-xs font-medium" style={{ color: theme.headerText }}>
                        Header
                    </span>
                </div>

                {/* Content preview */}
                <div className="space-y-2">
                    <div
                        className="h-3 rounded-sm w-3/4"
                        style={{ background: theme.primary }}
                    />
                    <div
                        className="h-2 rounded-sm w-1/2"
                        style={{ background: theme.secondary }}
                    />
                </div>

                {/* Color dots */}
                <div className="flex gap-2 pt-2">
                    <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ background: theme.primary }}
                        title="Primary"
                    />
                    <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ background: theme.secondary }}
                        title="Secondary"
                    />
                    <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ background: theme.accent }}
                        title="Accent"
                    />
                </div>

                {/* Theme name */}
                <p className="text-sm font-medium text-gray-700 pt-1">
                    {theme.name}
                </p>
            </div>
        </motion.button>
    );
};

// =============================================================================
// LOGO UPLOAD COMPONENT
// =============================================================================

const LogoUpload: React.FC<{
    currentLogo?: string;
    onLogoChange: (logoBase64: string | undefined) => void;
}> = ({ currentLogo, onLogoChange }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            onLogoChange(base64);
        };
        reader.readAsDataURL(file);
    }, [onLogoChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Clinic Logo</label>

            {currentLogo ? (
                <div className="relative inline-block">
                    <img
                        src={currentLogo}
                        alt="Clinic Logo"
                        className="h-20 object-contain border border-gray-200 rounded-lg p-2 bg-white"
                    />
                    <button
                        onClick={() => onLogoChange(undefined)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                        Drag & drop your logo here, or <span className="text-blue-500">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 2MB
                    </p>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// MAIN SETTINGS COMPONENT
// =============================================================================

export const ClinicBrandingSettings: React.FC<ClinicBrandingSettingsProps> = ({
    initialSettings = DEFAULT_CLINIC_SETTINGS,
    onSave,
    onCancel
}) => {
    const [settings, setSettings] = useState<ClinicSettings>(initialSettings);
    const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'invoice' | 'marketplace'>('branding');
    const [showPreview, setShowPreview] = useState(false);

    // Update branding field
    const updateBranding = (field: keyof ClinicBranding, value: string | number | undefined) => {
        setSettings(prev => ({
            ...prev,
            branding: { ...prev.branding, [field]: value }
        }));
    };

    // Handle save
    const handleSave = () => {
        onSave?.(settings);
    };

    // Handle reset
    const handleReset = () => {
        setSettings(DEFAULT_CLINIC_SETTINGS);
    };

    // Preview invoice
    const handlePreview = () => {
        const config = createPDFConfiguration(settings.branding, settings.selectedTheme as any);
        const invoice = createSampleInvoice();
        const html = generateFlightTicketInvoice(invoice, config);

        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
        }
    };

    const tabs = [
        { id: 'branding' as const, label: 'Clinic Info', icon: Building2 },
        { id: 'theme' as const, label: 'Color Theme', icon: Palette },
        { id: 'invoice' as const, label: 'Invoice Settings', icon: FileText },
        { id: 'marketplace' as const, label: 'HealthFlo Discovery', icon: Globe },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
                <h2 className="text-xl font-semibold text-white">PDF Branding Settings</h2>
                <p className="text-slate-400 text-sm mt-1">
                    Customize how your clinic appears on PDFs, invoices, and reports
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {/* Branding Tab */}
                    {activeTab === 'branding' && (
                        <motion.div
                            key="branding"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Logo Upload */}
                            <LogoUpload
                                currentLogo={settings.branding.logo}
                                onLogoChange={(logo) => updateBranding('logo', logo)}
                            />

                            {/* Clinic Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Clinic Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        Clinic Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.branding.clinicName}
                                        onChange={(e) => updateBranding('clinicName', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Noble Dental Care"
                                    />
                                </div>

                                {/* Short Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Short Name (for headers)
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.branding.shortName || ''}
                                        onChange={(e) => updateBranding('shortName', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="NOBLE CLINIC"
                                    />
                                </div>

                                {/* Tagline */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Tagline</label>
                                    <input
                                        type="text"
                                        value={settings.branding.tagline || ''}
                                        onChange={(e) => updateBranding('tagline', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="PIONEERING BETTER HEALTH"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={settings.branding.phone}
                                        onChange={(e) => updateBranding('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="+91-8610-425342"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.branding.email || ''}
                                        onChange={(e) => updateBranding('email', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="info@clinic.com"
                                    />
                                </div>

                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Address
                                    </label>
                                    <textarea
                                        value={settings.branding.address}
                                        onChange={(e) => updateBranding('address', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        placeholder="1ST Floor, ICA CLINIC, HUDA LAYOUT, NALLAGANDLA, HYDERABAD -500019"
                                    />
                                </div>

                                {/* Location Picker */}
                                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <LocationPicker
                                        latitude={settings.branding.latitude}
                                        longitude={settings.branding.longitude}
                                        onLocationChange={(lat, lng) => {
                                            updateBranding('latitude', lat);
                                            updateBranding('longitude', lng);
                                        }}
                                    />
                                </div>

                                {/* Primary Doctor */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Primary Doctor
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.branding.primaryDoctor}
                                        onChange={(e) => updateBranding('primaryDoctor', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="DR DHIVAKARAN"
                                    />
                                </div>

                                {/* Registration Number */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Hash className="w-4 h-4" />
                                        Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.branding.registrationNumber || ''}
                                        onChange={(e) => updateBranding('registrationNumber', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="DENTAL-REG-12345"
                                    />
                                </div>

                                {/* GST Number */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">GST Number</label>
                                    <input
                                        type="text"
                                        value={settings.branding.gstNumber || ''}
                                        onChange={(e) => updateBranding('gstNumber', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="36XXXXX1234X1ZX"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Theme Tab */}
                    {activeTab === 'theme' && (
                        <motion.div
                            key="theme"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-4">
                                    Select a color theme for your PDFs
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Object.entries(PDF_COLOR_THEMES).map(([key, theme]) => (
                                        <ThemePreviewCard
                                            key={key}
                                            theme={theme}
                                            themeName={key}
                                            isSelected={settings.selectedTheme === key}
                                            onSelect={() => setSettings(prev => ({ ...prev, selectedTheme: key }))}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Selected Theme Preview */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
                                    {/* Mini header preview */}
                                    <div
                                        className="p-4"
                                        style={{ background: PDF_COLOR_THEMES[settings.selectedTheme as keyof typeof PDF_COLOR_THEMES]?.headerBg }}
                                    >
                                        <div
                                            className="text-sm font-medium"
                                            style={{ color: PDF_COLOR_THEMES[settings.selectedTheme as keyof typeof PDF_COLOR_THEMES]?.headerText }}
                                        >
                                            {settings.branding.clinicName}
                                        </div>
                                    </div>
                                    {/* Mini content preview */}
                                    <div className="p-4 space-y-2">
                                        <div
                                            className="h-2 rounded w-3/4"
                                            style={{ background: PDF_COLOR_THEMES[settings.selectedTheme as keyof typeof PDF_COLOR_THEMES]?.primary }}
                                        />
                                        <div
                                            className="h-2 rounded w-1/2"
                                            style={{ background: PDF_COLOR_THEMES[settings.selectedTheme as keyof typeof PDF_COLOR_THEMES]?.textSecondary }}
                                        />
                                    </div>
                                    {/* Mini footer preview */}
                                    <div
                                        className="p-3 text-xs"
                                        style={{
                                            background: PDF_COLOR_THEMES[settings.selectedTheme as keyof typeof PDF_COLOR_THEMES]?.footerBg,
                                            color: PDF_COLOR_THEMES[settings.selectedTheme as keyof typeof PDF_COLOR_THEMES]?.footerText
                                        }}
                                    >
                                        HealthFlo Dental-OS
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Invoice Tab */}
                    {activeTab === 'invoice' && (
                        <motion.div
                            key="invoice"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Invoice Prefix */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Invoice Prefix
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.invoicePrefix}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            invoicePrefix: e.target.value.toUpperCase().slice(0, 5)
                                        }))}
                                        maxLength={5}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                        placeholder="INV"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Max 5 characters. Example: INV, BILL, NDC
                                    </p>
                                </div>

                                {/* Starting Number */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Starting Invoice Number
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.invoiceStartNumber}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            invoiceStartNumber: parseInt(e.target.value) || 1,
                                            currentInvoiceNumber: parseInt(e.target.value) || 1
                                        }))}
                                        min={1}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                        placeholder="1001"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Invoices will start from this number
                                    </p>
                                </div>
                            </div>

                            {/* Preview Invoice Number */}
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                                    Next Invoice Number
                                </p>
                                <p className="text-2xl font-mono font-bold tracking-wider">
                                    {settings.invoicePrefix}-{new Date().getFullYear().toString().slice(-2)}{(new Date().getMonth() + 1).toString().padStart(2, '0')}{new Date().getDate().toString().padStart(2, '0')}-{settings.currentInvoiceNumber.toString().padStart(6, '0')}
                                </p>
                                <p className="text-xs text-slate-400 mt-3">
                                    Format: PREFIX-YYMMDD-SEQUENCE
                                </p>
                            </div>

                            {/* Preview Invoice Button */}
                            <button
                                onClick={handlePreview}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                Preview Sample Invoice
                            </button>
                        </motion.div>
                    )}

                    {/* Marketplace Tab */}
                    {activeTab === 'marketplace' && (
                        <motion.div
                            key="marketplace"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                        <Globe className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">HealthFlo Marketplace</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Join the HealthFlo network to be discovered by patients in your area.
                                            Enable discovery to appear in search results.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Toggle Marketplace */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <div className="space-y-1">
                                        <label className="text-base font-medium text-gray-900 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-blue-500" />
                                            Active on Marketplace
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Allow your clinic profile to be public on HealthFlo.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.isMarketplaceActive}
                                            onChange={(e) => setSettings(prev => ({ ...prev, isMarketplaceActive: e.target.checked }))}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                {/* Toggle Discovery */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <div className="space-y-1">
                                        <label className="text-base font-medium text-gray-900 flex items-center gap-2">
                                            <Search className="w-4 h-4 text-purple-500" />
                                            Enable Discovery ("Near Me")
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Appear in "Clinics Near Me" searches. Requires valid location.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.discoveryEnabled}
                                            onChange={(e) => setSettings(prev => ({ ...prev, discoveryEnabled: e.target.checked }))}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                </button>

                <div className="flex gap-3">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                    >
                        <Save className="w-4 h-4" />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClinicBrandingSettings;
