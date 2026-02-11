'use client';

/**
 * Clinic Branding Settings Component
 * 
 * Allows clinic to configure:
 * - Logo & Identity
 * - Registration Hub (Legal assistance)
 * - Website & Social Presence
 * - PDF Layout & Invoice Themes
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
    BadgeCheck,
    AlertCircle,
    LifeBuoy,
    Globe2,
    LayoutTemplate,
    FileUp,
    Instagram,
    Map,
    Globe,
    Search,
    Activity
} from 'lucide-react';
import {
    ClinicBranding,
    PDFColorTheme,
    PDF_COLOR_THEMES,
    ClinicSettings,
    DEFAULT_CLINIC_SETTINGS,
    createPDFConfiguration
} from '@/lib/pdf-config';
import { useSchedulingStore } from '@/lib/scheduling-store'; // Added Store
import { generateFlightTicketInvoice, createSampleInvoice } from '@/lib/billing-invoice-generator';
import { LocationPicker } from '@/components/location-picker';
import { cn } from '@/lib/utils';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const ThemePreviewCard: React.FC<{
    theme: PDFColorTheme;
    themeName: string;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ theme, isSelected, onSelect }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className={cn(
            "relative p-4 rounded-3xl border-2 transition-all duration-300",
            isSelected ? "border-indigo-600 bg-indigo-50/30" : "border-slate-100 bg-white hover:border-slate-300 shadow-sm"
        )}
    >
        {isSelected && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-3 h-3 text-white" />
            </div>
        )}
        <div className="space-y-4">
            <div className="h-10 rounded-2xl flex items-center px-4" style={{ background: theme.headerBg }}>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.headerText }}>Header</span>
            </div>
            <div className="space-y-2 px-1">
                <div className="h-2.5 rounded-full w-full" style={{ background: theme.primary }} />
                <div className="h-2 rounded-full w-2/3" style={{ background: theme.secondary }} />
            </div>
            <div className="flex gap-2 pt-1">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: theme.primary }} />
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: theme.secondary }} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{theme.name}</p>
        </div>
    </motion.button>
);

const LogoUpload: React.FC<{
    currentLogo?: string;
    onLogoChange: (logoBase64: string | undefined) => void;
}> = ({ currentLogo, onLogoChange }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => onLogoChange(e.target?.result as string);
        reader.readAsDataURL(file);
    }, [onLogoChange]);

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinic Identity Logo</label>
            {currentLogo ? (
                <div className="group relative inline-block">
                    <div className="p-4 bg-slate-50 rounded-[2.5rem] border border-slate-200 transition-all group-hover:bg-white group-hover:shadow-xl group-hover:-translate-y-1">
                        <img src={currentLogo} alt="Logo" className="h-24 w-auto object-contain" />
                    </div>
                    <button
                        onClick={() => onLogoChange(undefined)}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                    className={cn(
                        "relative border-2 border-dashed rounded-[2.5rem] p-10 text-center transition-all cursor-pointer",
                        isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                    )}
                >
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Drop clinic logo here</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PNG or JPG • Max 2MB</p>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

import { useTheme } from "next-themes";

export const ClinicBrandingSettings: React.FC<{
    initialSettings?: ClinicSettings;
    onSave?: (settings: ClinicSettings) => void;
    onCancel?: () => void;
}> = ({ initialSettings = DEFAULT_CLINIC_SETTINGS, onSave, onCancel }) => {
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState<ClinicSettings>(initialSettings);
    const [activeTab, setActiveTab] = useState<'branding' | 'registration' | 'website' | 'theme' | 'invoice' | 'marketplace'>('branding');

    const updateBranding = (field: keyof ClinicBranding, value: string | number | undefined) => {
        setSettings(prev => ({ ...prev, branding: { ...prev.branding, [field]: value } }));
    };

    const store = useSchedulingStore();
    const [isImporting, setIsImporting] = useState(false);

    const handleImportFromGoogle = async () => {
        setIsImporting(true);
        try {
            const res = await fetch('/api/business/import');
            const data = await res.json();

            if (!res.ok) {
                if (data.code === 'AUTH_REQUIRED') {
                    // Redirect to Auth if needed, or show simple alert for now
                    window.location.href = '/api/auth/google'; // Re-trigger auth loop with new scope
                    return;
                }
                throw new Error(data.error || 'Failed to import');
            }

            const location = data.locations[0]; // Take first verified location
            if (location) {
                // Update Local Settings State
                setSettings(prev => ({
                    ...prev,
                    branding: {
                        ...prev.branding,
                        clinicName: location.title,
                        phone: location.phoneNumbers?.primaryPhone || prev.branding.phone,
                        address: location.storefrontAddress?.addressLines?.join(', ') || prev.branding.address,
                        latitude: location.latlng?.latitude || prev.branding.latitude,
                        longitude: location.latlng?.longitude || prev.branding.longitude,
                    }
                }));

                // Update Global Store
                store.updateClinicDetails({
                    name: location.title,
                    address: location.storefrontAddress?.addressLines?.join(', ') || '',
                    phone: location.phoneNumbers?.primaryPhone || '',
                    googleMapsUrl: location.metadata?.mapsUri,
                    googleLocationId: location.name,
                    isVerified: true,
                    lat: location.latlng?.latitude,
                    lng: location.latlng?.longitude
                });

                alert('Successfully imported verified clinic details from Google!');
            }

        } catch (error: any) {
            alert(`Import Failed: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    const handlePreview = () => {
        const config = createPDFConfiguration(settings.branding, settings.selectedTheme as keyof typeof PDF_COLOR_THEMES);
        const html = generateFlightTicketInvoice(createSampleInvoice(), config);
        const win = window.open('', '_blank');
        if (win) { win.document.write(html); win.document.close(); }
    };

    const tabs = [
        { id: 'branding' as const, label: 'Identity', icon: Building2 },
        { id: 'registration' as const, label: 'Legal Hub', icon: BadgeCheck },
        { id: 'website' as const, label: 'Digital', icon: Globe2 },
        { id: 'theme' as const, label: 'Visuals', icon: Palette },
        { id: 'invoice' as const, label: 'Billing', icon: FileText },
        { id: 'marketplace' as const, label: 'Growth', icon: Globe },
    ];

    // THEME PREVIEW COMPONENT
    const AppThemePreview = ({ id, name, colors, isActive }: { id: string, name: string, colors: string[], isActive: boolean }) => (
        <button
            onClick={() => setTheme(id)}
            className={cn(
                "group relative w-full aspect-video rounded-3xl border-2 transition-all duration-500 overflow-hidden",
                isActive ? "border-indigo-500 shadow-2xl scale-[1.02]" : "border-slate-200/50 hover:border-indigo-300"
            )}
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br", colors[0])} />
            <div className="absolute inset-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex flex-col p-4 gap-2">
                <div className="h-4 w-1/3 rounded-full bg-white/20" />
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-2/3 rounded-full bg-white/10" />
                <div className="mt-auto flex gap-2">
                    <div className={cn("w-8 h-8 rounded-lg shadow-lg", colors[1])} />
                    <div className={cn("w-8 h-8 rounded-lg shadow-lg", colors[2])} />
                </div>
            </div>
            {isActive && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                    <Check className="w-3.5 h-3.5 text-white" />
                </div>
            )}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <span className="text-white text-xs font-bold uppercase tracking-widest">{name}</span>
            </div>
        </button>
    );

    return (
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-5xl mx-auto border border-slate-100">
            {/* Premium Header */}
            <div className="bg-[#0f172a] px-8 py-10 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-white tracking-tighter">Clinic Core Setup</h2>
                        <p className="text-slate-400 text-sm font-medium">Configure your clinical identity and digital heartbeat.</p>
                    </div>
                    <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center text-indigo-400 shadow-2xl rotate-12">
                        <Activity className="w-8 h-8" />
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]" />
            </div>

            {/* Scrollable Tabs */}
            <div className="border-b border-slate-100 px-4 bg-slate-50/50">
                <div className="flex overflow-x-auto no-scrollbar py-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8 h-[650px] overflow-y-auto custom-scrollbar bg-white">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-10"
                    >
                        {activeTab === 'branding' && (
                            <div className="space-y-10">
                                {/* Google Import Card - Moved to Top */}
                                <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mb-8">
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl"></div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-black text-blue-900">Google Business Profile</h3>
                                                {store.clinicDetails?.isVerified && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-blue-800/70 font-medium">Auto-fill verified details (Name, Address, Maps) from Google.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleImportFromGoogle}
                                        disabled={isImporting}
                                        className="relative z-10 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                    >
                                        {isImporting ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                        {store.clinicDetails?.isVerified ? 'Sync Again' : 'Import verified Data'}
                                    </button>
                                </div>

                                <LogoUpload currentLogo={settings.branding.logo} onLogoChange={(logo) => updateBranding('logo', logo)} />



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Clinic Name</label>
                                        <input type="text" value={settings.branding.clinicName} onChange={(e) => updateBranding('clinicName', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Area / Locality</label>
                                        <input type="text" placeholder="e.g. Nallagandla" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Short Label</label>
                                        <input type="text" value={settings.branding.shortName || ''} onChange={(e) => updateBranding('shortName', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Contact Hotline</label>
                                        <input type="tel" value={settings.branding.phone} onChange={(e) => updateBranding('phone', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold transition-all" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Clinical Address</label>
                                        <textarea value={settings.branding.address} onChange={(e) => updateBranding('address', e.target.value)} rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold transition-all resize-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <LocationPicker latitude={settings.branding.latitude} longitude={settings.branding.longitude} onLocationChange={(lat, lng) => { updateBranding('latitude', lat); updateBranding('longitude', lng); }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'registration' && (
                            <div className="space-y-8">
                                <div className="p-8 bg-amber-50 rounded-[3rem] border border-amber-100 flex items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-amber-900 leading-tight">Registration Status: Under Review</h3>
                                        <p className="text-sm text-amber-800 font-medium opacity-80">Your clinic is currently listed as unregistered. HealthFlo can help expedite your documentation.</p>
                                    </div>
                                    <div className="px-6 py-2 bg-amber-200 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-widest">Action Required</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
                                        <LifeBuoy className="w-10 h-10 text-indigo-400 group-hover:rotate-45 transition-transform" />
                                        <h4 className="text-lg font-black tracking-tighter">Documentation Concierge</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">Need help with Trade License or Medical Registrations? Our experts handle everything.</p>
                                        <button onClick={() => alert("Concierge notified.")} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">Request HealthFlo Assistance</button>
                                    </div>
                                    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] space-y-6 shadow-lg hover:shadow-xl transition-all group">
                                        <FileUp className="w-10 h-10 text-emerald-500" />
                                        <h4 className="text-lg font-black tracking-tighter text-slate-900">Document Vault</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">Upload and verify your existing legal documents (GST, PCB, etc.)</p>
                                        <button className="w-full py-4 bg-slate-50 text-slate-900 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:border-emerald-300 transition-all">Upload New Documents</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'website' && (
                            <div className="space-y-10">
                                <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                    <div className="relative z-10 space-y-6 max-w-xl">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                            <Globe2 className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-4xl font-black leading-[0.9] tracking-tighter">Your Clinic&apos;s Digital Headquarters.</h3>
                                        <p className="text-indigo-100 text-lg font-medium opacity-90">Get a high-converting dental website built by HealthFlo experts. Standard: nobledentalnallagandla.in</p>
                                        <button onClick={() => alert("Website request sent.")} className="px-8 py-5 bg-white text-indigo-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Order Custom Build</button>
                                    </div>
                                    <Globe2 className="absolute -bottom-20 -right-20 w-80 h-80 text-indigo-100/10 rotate-12 blur-[2px]" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2"><Globe className="w-3 h-3" />Existing Domain</label>
                                        <input type="url" value={settings.branding.website || ''} onChange={(e) => updateBranding('website', e.target.value)} placeholder="https://yourclinic.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2"><Instagram className="w-3 h-3 text-pink-500" />Instagram Hook</label>
                                        <input type="text" placeholder="@clinic_handle" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'theme' && (
                            <div className="space-y-8">
                                <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                            <Palette className="w-6 h-6 text-indigo-600" />
                                            Interface Theme
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-2">Customize the visual appearance of the Noble OS command center.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <AppThemePreview
                                            id="dark"
                                            name="Noble Dark"
                                            colors={["from-slate-900 to-slate-950", "bg-slate-800", "bg-indigo-500"]}
                                            isActive={theme === 'dark' || theme === 'system'}
                                        />
                                        <AppThemePreview
                                            id="light"
                                            name="Clinical White"
                                            colors={["from-slate-50 to-white", "bg-white", "bg-indigo-500"]}
                                            isActive={theme === 'light'}
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-slate-200" />

                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">PDF Document Themes</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        {Object.entries(PDF_COLOR_THEMES).map(([key, theme]) => (
                                            <ThemePreviewCard key={key} theme={theme} themeName={key} isSelected={settings.selectedTheme === key} onSelect={() => setSettings(prev => ({ ...prev, selectedTheme: key }))} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'invoice' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Billing Prefix</label>
                                        <input type="text" value={settings.invoicePrefix} onChange={(e) => setSettings(prev => ({ ...prev, invoicePrefix: e.target.value.toUpperCase() }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold font-mono text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Initial Sequence</label>
                                        <input type="number" value={settings.invoiceStartNumber} onChange={(e) => setSettings(prev => ({ ...prev, invoiceStartNumber: parseInt(e.target.value) }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold font-mono text-lg" />
                                    </div>
                                </div>
                                <div className="p-8 bg-slate-900 rounded-[2.5rem] space-y-4">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Invoice Sample</p>
                                    <p className="text-3xl font-mono font-bold text-white tracking-widest">{settings.invoicePrefix}-{new Date().getFullYear().toString().slice(-2)}0001</p>
                                    <button onClick={handlePreview} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all font-bold text-xs"><Eye className="w-4 h-4" /> Preview Live PDF</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'marketplace' && (
                            <div className="space-y-8">
                                <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[3rem] flex items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2"><Globe className="w-5 h-5" /> Marketplace Availability</h3>
                                        <p className="text-sm text-indigo-800 opacity-70 font-medium">Public visibility in the &quot;Discovery&quot; patient portal.</p>
                                    </div>
                                    <button
                                        className={cn("w-16 h-10 rounded-full relative transition-all shadow-inner", settings.isMarketplaceActive ? "bg-indigo-600" : "bg-slate-200")}
                                        onClick={() => setSettings(prev => ({ ...prev, isMarketplaceActive: !prev.isMarketplaceActive }))}
                                    >
                                        <div className={cn("w-8 h-8 bg-white rounded-full absolute top-1 transition-all shadow-xl", settings.isMarketplaceActive ? "left-7" : "left-1")} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Premium Footer */}
            <div className="border-t border-slate-100 px-10 py-8 bg-slate-50/50 flex flex-col md:flex-row gap-6 justify-between items-center">
                <button onClick={() => setSettings(DEFAULT_CLINIC_SETTINGS)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-widest"><RotateCcw className="w-4 h-4" /> Factory Reset</button>
                <div className="flex gap-4 w-full md:w-auto">
                    {onCancel && <button onClick={onCancel} className="flex-1 md:flex-none px-8 py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest">Discard</button>}
                    <button onClick={() => onSave?.(settings)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl shadow-indigo-500/30 transition-all transform active:scale-95"><Save className="w-4 h-4" /> Commit Changes</button>
                </div>
            </div>
        </div>
    );
};

export default ClinicBrandingSettings;
