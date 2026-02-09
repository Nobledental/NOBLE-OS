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
            isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50 shadow-sm"
        )}
    >
        {isSelected && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-3 h-3 text-primary-foreground" />
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
                <div className="w-6 h-6 rounded-full border-2 border-background shadow-sm" style={{ background: theme.primary }} />
                <div className="w-6 h-6 rounded-full border-2 border-background shadow-sm" style={{ background: theme.secondary }} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{theme.name}</p>
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
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clinic Identity Logo</label>
            {currentLogo ? (
                <div className="group relative inline-block">
                    <div className="p-4 bg-muted/30 rounded-[2.5rem] border border-border transition-all group-hover:bg-card group-hover:shadow-xl group-hover:-translate-y-1">
                        <img src={currentLogo} alt="Logo" className="h-24 w-auto object-contain" />
                    </div>
                    <button
                        onClick={() => onLogoChange(undefined)}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
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
                        isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/10 hover:bg-muted/20 hover:border-border/80"
                    )}
                >
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-muted-foreground">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-foreground">Drop clinic logo here</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">PNG or JPG • Max 2MB</p>
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
            <div className="bg-primary/10 px-8 py-10 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-foreground italic tracking-tighter">Clinic Core Setup</h2>
                        <p className="text-muted-foreground text-sm font-medium">Configure your clinical identity and digital heartbeat.</p>
                    </div>
                    <div className="w-16 h-16 bg-card rounded-3xl flex items-center justify-center text-primary shadow-2xl rotate-12">
                        <Activity className="w-8 h-8" />
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />
            </div>

            {/* Scrollable Tabs */}
            <div className="border-b border-border px-4 bg-muted/20">
                <div className="flex overflow-x-auto no-scrollbar py-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8 h-[650px] overflow-y-auto custom-scrollbar bg-card">
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
                                <LogoUpload currentLogo={settings.branding.logo} onLogoChange={(logo) => updateBranding('logo', logo)} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Full Clinic Name</label>
                                        <input type="text" value={settings.branding.clinicName} onChange={(e) => updateBranding('clinicName', e.target.value)} className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl focus:bg-card focus:ring-4 focus:ring-primary/20 outline-none font-bold transition-all text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Area / Locality</label>
                                        <input type="text" placeholder="e.g. Nallagandla" className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl focus:bg-card focus:ring-4 focus:ring-primary/20 outline-none font-bold transition-all text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Short Label</label>
                                        <input type="text" value={settings.branding.shortName || ''} onChange={(e) => updateBranding('shortName', e.target.value)} className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl focus:bg-card focus:ring-4 focus:ring-primary/20 outline-none font-bold transition-all text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Contact Hotline</label>
                                        <input type="tel" value={settings.branding.phone} onChange={(e) => updateBranding('phone', e.target.value)} className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl focus:bg-card focus:ring-4 focus:ring-primary/20 outline-none font-bold transition-all text-foreground" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Clinical Address</label>
                                        <textarea value={settings.branding.address} onChange={(e) => updateBranding('address', e.target.value)} rows={3} className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-[2rem] focus:bg-card focus:ring-4 focus:ring-primary/20 outline-none font-bold transition-all resize-none text-foreground" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <LocationPicker latitude={settings.branding.latitude} longitude={settings.branding.longitude} onLocationChange={(lat, lng) => { updateBranding('latitude', lat); updateBranding('longitude', lng); }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'registration' && (
                            <div className="space-y-8">
                                <div className="p-8 bg-amber-500/10 rounded-[3rem] border border-amber-500/20 flex items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-amber-600 leading-tight italic">Registration Status: Under Review</h3>
                                        <p className="text-sm text-amber-600/80 font-medium">Your clinic is currently listed as unregistered. HealthFlo can help expedite your documentation.</p>
                                    </div>
                                    <div className="px-6 py-2 bg-amber-500/20 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">Action Required</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-foreground text-background rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
                                        <LifeBuoy className="w-10 h-10 text-primary group-hover:rotate-45 transition-transform" />
                                        <h4 className="text-lg font-black italic tracking-tighter">Documentation Concierge</h4>
                                        <p className="text-sm text-muted/60 leading-relaxed font-medium">Need help with Trade License or Medical Registrations? Our experts handle everything.</p>
                                        <button onClick={() => alert("Concierge notified.")} className="w-full py-4 bg-background text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all">Request HealthFlo Assistance</button>
                                    </div>
                                    <div className="p-8 bg-card border border-border rounded-[2.5rem] space-y-6 shadow-sm hover:shadow-md transition-all group">
                                        <FileUp className="w-10 h-10 text-emerald-500" />
                                        <h4 className="text-lg font-black italic tracking-tighter text-foreground">Document Vault</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">Upload and verify your existing legal documents (GST, PCB, etc.)</p>
                                        <button className="w-full py-4 bg-muted/50 text-foreground border border-border rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-card hover:border-emerald-500/50 transition-all">Upload New Documents</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'website' && (
                            <div className="space-y-10">
                                <div className="bg-gradient-to-br from-primary to-blue-700 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-xl">
                                    <div className="relative z-10 space-y-6 max-w-xl">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                            <Globe2 className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-4xl font-black leading-[0.9] italic tracking-tighter">Your Clinic&apos;s Digital Headquarters.</h3>
                                        <p className="text-white/80 text-lg font-medium">Get a high-converting dental website built by HealthFlo experts. Standard: nobledentalnallagandla.in</p>
                                        <button onClick={() => alert("Website request sent.")} className="px-8 py-5 bg-white text-primary rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">Order Custom Build</button>
                                    </div>
                                    <Globe2 className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12 blur-[2px]" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2"><Globe className="w-3 h-3" />Existing Domain</label>
                                        <input type="url" value={settings.branding.website || ''} onChange={(e) => updateBranding('website', e.target.value)} placeholder="https://yourclinic.com" className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl outline-none font-bold transition-all text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2"><Instagram className="w-3 h-3 text-pink-500" />Instagram Hook</label>
                                        <input type="text" placeholder="@clinic_handle" className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl outline-none font-bold transition-all text-foreground" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'theme' && (
                            <div className="space-y-8">
                                <div className="bg-muted/30 border border-border rounded-[2.5rem] p-8 space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                            <Palette className="w-6 h-6 text-primary" />
                                            Interface Theme
                                        </h3>
                                        <p className="text-muted-foreground text-sm mt-2">Customize the visual appearance of the Noble OS command center.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <AppThemePreview
                                            id="dark"
                                            name="Noble Dark"
                                            colors={["from-slate-900 to-slate-800", "bg-indigo-500", "bg-slate-700"]}
                                            isActive={theme === 'dark' || theme === 'system'}
                                        />
                                        <AppThemePreview
                                            id="light"
                                            name="Clinical White"
                                            colors={["from-slate-50 to-white", "bg-blue-600", "bg-slate-200"]}
                                            isActive={theme === 'light'}
                                        />
                                        <AppThemePreview
                                            id="neo-rose"
                                            name="Neo Rose"
                                            colors={["from-rose-950 to-slate-900", "bg-rose-500", "bg-rose-900/50"]}
                                            isActive={theme === 'neo-rose'}
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-border/50" />

                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">PDF Document Themes</h3>
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
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Billing Prefix</label>
                                        <input type="text" value={settings.invoicePrefix} onChange={(e) => setSettings(prev => ({ ...prev, invoicePrefix: e.target.value.toUpperCase() }))} className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl outline-none font-bold font-mono text-lg text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Initial Sequence</label>
                                        <input type="number" value={settings.invoiceStartNumber} onChange={(e) => setSettings(prev => ({ ...prev, invoiceStartNumber: parseInt(e.target.value) }))} className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-3xl outline-none font-bold font-mono text-lg text-foreground" />
                                    </div>
                                </div>
                                <div className="p-8 bg-foreground rounded-[2.5rem] space-y-4">
                                    <p className="text-[10px] font-black text-background/60 uppercase tracking-widest">Next Invoice Sample</p>
                                    <p className="text-3xl font-mono font-bold text-background tracking-widest">{settings.invoicePrefix}-{new Date().getFullYear().toString().slice(-2)}0001</p>
                                    <button onClick={handlePreview} className="inline-flex items-center gap-2 px-6 py-3 bg-background/10 text-background rounded-2xl hover:bg-background/20 transition-all font-bold text-xs"><Eye className="w-4 h-4" /> Preview Live PDF</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'marketplace' && (
                            <div className="space-y-8">
                                <div className="p-8 bg-primary/5 border border-primary/10 rounded-[3rem] flex items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-primary flex items-center gap-2"><Globe className="w-5 h-5" /> Marketplace Availability</h3>
                                        <p className="text-sm text-primary/70 font-medium">Public visibility in the &quot;Discovery&quot; patient portal.</p>
                                    </div>
                                    <button
                                        className={cn("w-16 h-10 rounded-full relative transition-all shadow-inner", settings.isMarketplaceActive ? "bg-primary" : "bg-muted")}
                                        onClick={() => setSettings(prev => ({ ...prev, isMarketplaceActive: !prev.isMarketplaceActive }))}
                                    >
                                        <div className={cn("w-8 h-8 bg-card rounded-full absolute top-1 transition-all shadow-sm", settings.isMarketplaceActive ? "left-7" : "left-1")} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Premium Footer */}
            <div className="border-t border-border px-10 py-8 bg-muted/10 flex flex-col md:flex-row gap-6 justify-between items-center">
                <button onClick={() => setSettings(DEFAULT_CLINIC_SETTINGS)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all font-black text-[10px] uppercase tracking-widest"><RotateCcw className="w-4 h-4" /> Factory Reset</button>
                <div className="flex gap-4 w-full md:w-auto">
                    {onCancel && <button onClick={onCancel} className="flex-1 md:flex-none px-8 py-4 text-muted-foreground font-black text-[10px] uppercase tracking-widest">Discard</button>}
                    <button onClick={() => onSave?.(settings)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 hover:shadow-lg shadow-primary/30 transition-all transform active:scale-95"><Save className="w-4 h-4" /> Commit Changes</button>
                </div>
            </div>
        </div>
    );
};

export default ClinicBrandingSettings;
