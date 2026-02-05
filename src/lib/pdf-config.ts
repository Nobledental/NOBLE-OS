/**
 * Configurable PDF Branding System
 * 
 * Allows clinics to customize:
 * - Clinic name, tagline, address
 * - Logo (Base64 or URL)
 * - Color themes for headers, footers, accents
 * - Contact information
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ClinicBranding {
    // Basic Info
    clinicName: string;
    shortName?: string;
    tagline?: string;
    facility?: string;

    // Contact
    address: string;
    phone: string;
    email?: string;
    website?: string;

    // Doctor Info
    primaryDoctor: string;
    doctorTitle?: string;
    doctorSignature?: string;  // Base64 or URL
    clinicSeal?: string;       // Base64 or URL

    // Logo
    logo?: string;             // Base64 or URL
    logoWidth?: number;        // in pixels
    logoHeight?: number;

    // Registration
    registrationNumber?: string;
    gstNumber?: string;
    // Location (HealthFlo Pivot)
    latitude?: number;
    longitude?: number;
}

export interface PDFColorTheme {
    name: string;

    // Primary colors
    primary: string;           // Main brand color
    secondary: string;         // Secondary accent
    accent: string;            // Highlight color

    // Header/Footer
    headerBg: string;
    headerText: string;
    footerBg: string;
    footerText: string;

    // Section bars
    sectionBarBg: string;
    sectionBarText: string;

    // Cards & Boxes
    cardBg: string;
    cardBorder: string;
    warningBg: string;
    successBg: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    // Status
    positive: string;
    warning: string;
    danger: string;
}

// =============================================================================
// PRESET COLOR THEMES
// =============================================================================

export const PDF_COLOR_THEMES: Record<string, PDFColorTheme> = {
    // Noble Clinic Original (Teal + Navy)
    noble: {
        name: 'Noble Clinic',
        primary: '#003366',
        secondary: '#00A89D',
        accent: '#14B8A6',
        headerBg: '#003366',
        headerText: '#FFFFFF',
        footerBg: '#F3F4F6',
        footerText: '#6B7280',
        sectionBarBg: '#003366',
        sectionBarText: '#00A89D',
        cardBg: '#F8F8F8',
        cardBorder: '#E5E7EB',
        warningBg: '#2C3E50',
        successBg: '#ECFDF5',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#00A89D',
        warning: '#F59E0B',
        danger: '#DC2626',
    },

    // Plain (Minimal Black & White)
    plain: {
        name: 'Plain',
        primary: '#1F2937',
        secondary: '#4B5563',
        accent: '#374151',
        headerBg: '#FFFFFF',
        headerText: '#1F2937',
        footerBg: '#FFFFFF',
        footerText: '#6B7280',
        sectionBarBg: '#F3F4F6',
        sectionBarText: '#1F2937',
        cardBg: '#FFFFFF',
        cardBorder: '#E5E7EB',
        warningBg: '#F3F4F6',
        successBg: '#F9FAFB',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
    },

    // Royal Blue
    royalBlue: {
        name: 'Royal Blue',
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#60A5FA',
        headerBg: '#1E40AF',
        headerText: '#FFFFFF',
        footerBg: '#EFF6FF',
        footerText: '#1E40AF',
        sectionBarBg: '#1E40AF',
        sectionBarText: '#93C5FD',
        cardBg: '#F8FAFC',
        cardBorder: '#BFDBFE',
        warningBg: '#1E3A5F',
        successBg: '#DBEAFE',
        textPrimary: '#1E293B',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        positive: '#3B82F6',
        warning: '#F59E0B',
        danger: '#EF4444',
    },

    // Emerald Green
    emerald: {
        name: 'Emerald',
        primary: '#065F46',
        secondary: '#10B981',
        accent: '#34D399',
        headerBg: '#065F46',
        headerText: '#FFFFFF',
        footerBg: '#ECFDF5',
        footerText: '#065F46',
        sectionBarBg: '#065F46',
        sectionBarText: '#6EE7B7',
        cardBg: '#F0FDF4',
        cardBorder: '#A7F3D0',
        warningBg: '#064E3B',
        successBg: '#D1FAE5',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
    },

    // Purple Luxe
    purple: {
        name: 'Purple Luxe',
        primary: '#5B21B6',
        secondary: '#8B5CF6',
        accent: '#A78BFA',
        headerBg: '#5B21B6',
        headerText: '#FFFFFF',
        footerBg: '#F5F3FF',
        footerText: '#5B21B6',
        sectionBarBg: '#5B21B6',
        sectionBarText: '#C4B5FD',
        cardBg: '#FAFAF9',
        cardBorder: '#DDD6FE',
        warningBg: '#4C1D95',
        successBg: '#EDE9FE',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#8B5CF6',
        warning: '#F59E0B',
        danger: '#EF4444',
    },

    // Coral Warm
    coral: {
        name: 'Coral Warm',
        primary: '#9F1239',
        secondary: '#F43F5E',
        accent: '#FB7185',
        headerBg: '#9F1239',
        headerText: '#FFFFFF',
        footerBg: '#FFF1F2',
        footerText: '#9F1239',
        sectionBarBg: '#9F1239',
        sectionBarText: '#FECDD3',
        cardBg: '#FFFBFB',
        cardBorder: '#FECDD3',
        warningBg: '#881337',
        successBg: '#FFE4E6',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#F43F5E',
        warning: '#F59E0B',
        danger: '#DC2626',
    },

    // Slate Professional
    slate: {
        name: 'Slate Professional',
        primary: '#334155',
        secondary: '#64748B',
        accent: '#94A3B8',
        headerBg: '#1E293B',
        headerText: '#F8FAFC',
        footerBg: '#F1F5F9',
        footerText: '#475569',
        sectionBarBg: '#334155',
        sectionBarText: '#CBD5E1',
        cardBg: '#F8FAFC',
        cardBorder: '#E2E8F0',
        warningBg: '#1E293B',
        successBg: '#F1F5F9',
        textPrimary: '#1E293B',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        positive: '#64748B',
        warning: '#F59E0B',
        danger: '#EF4444',
    },
};

// =============================================================================
// DEFAULT CLINIC CONFIGURATION
// =============================================================================

export const DEFAULT_CLINIC_BRANDING: ClinicBranding = {
    clinicName: 'Noble Dental Care',
    shortName: 'NOBLE CLINIC',
    tagline: 'PIONEERING BETTER HEALTH',
    facility: 'HEALTHFLO HOSPITAL & CLINIC',
    address: '1ST Floor, ICA CLINIC, HUDA LAYOUT, NALLAGANDLA, HYDERABAD -500019',
    phone: '+91-8610-425342',
    email: 'info@nobledental.in',
    website: 'www.nobledental.in',
    primaryDoctor: 'DR DHIVAKARAN',
    doctorTitle: 'DOCTOR',
    latitude: 17.4834,
    longitude: 78.3155,
};

// =============================================================================
// PDF CONFIGURATION BUILDER
// =============================================================================

export interface PDFConfiguration {
    branding: ClinicBranding;
    theme: PDFColorTheme;
    footer: {
        systemName: string;
        disclaimer: string;
        showVerification: boolean;
        showQRCode: boolean;
    };
}

export function createPDFConfiguration(
    branding: Partial<ClinicBranding> = {},
    themeName: keyof typeof PDF_COLOR_THEMES = 'noble'
): PDFConfiguration {
    return {
        branding: { ...DEFAULT_CLINIC_BRANDING, ...branding },
        theme: PDF_COLOR_THEMES[themeName] || PDF_COLOR_THEMES.noble,
        footer: {
            systemName: 'HealthFlo Dental-OS',
            disclaimer: 'This is an Electronic Record - No Manual Signature Required',
            showVerification: true,
            showQRCode: true,
        },
    };
}

// =============================================================================
// GENERATE CSS VARIABLES FROM THEME
// =============================================================================

export function generateThemeCSS(theme: PDFColorTheme): string {
    return `
    :root {
        --pdf-primary: ${theme.primary};
        --pdf-secondary: ${theme.secondary};
        --pdf-accent: ${theme.accent};
        
        --pdf-header-bg: ${theme.headerBg};
        --pdf-header-text: ${theme.headerText};
        --pdf-footer-bg: ${theme.footerBg};
        --pdf-footer-text: ${theme.footerText};
        
        --pdf-section-bar-bg: ${theme.sectionBarBg};
        --pdf-section-bar-text: ${theme.sectionBarText};
        
        --pdf-card-bg: ${theme.cardBg};
        --pdf-card-border: ${theme.cardBorder};
        --pdf-warning-bg: ${theme.warningBg};
        --pdf-success-bg: ${theme.successBg};
        
        --pdf-text-primary: ${theme.textPrimary};
        --pdf-text-secondary: ${theme.textSecondary};
        --pdf-text-muted: ${theme.textMuted};
        
        --pdf-positive: ${theme.positive};
        --pdf-warning: ${theme.warning};
        --pdf-danger: ${theme.danger};
    }
    `;
}

// =============================================================================
// GENERATE HEADER HTML WITH CONFIGURABLE BRANDING
// =============================================================================

export function generateConfigurableHeader(
    config: PDFConfiguration,
    sectionLabel?: string
): string {
    const { branding, theme } = config;

    return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
        <div class="header-left">
            ${sectionLabel ? `<span style="font-size: 11px; color: ${theme.textSecondary}; letter-spacing: 1px;">${sectionLabel}</span>` : ''}
        </div>
        <div class="header-right" style="display: flex; align-items: center; gap: 10px;">
            ${branding.logo ? `
                <img src="${branding.logo}" 
                     alt="${branding.clinicName}" 
                     style="width: ${branding.logoWidth || 40}px; height: ${branding.logoHeight || 40}px; object-fit: contain;" />
            ` : ''}
            <div style="text-align: right; line-height: 1.2;">
                <span style="display: block; font-size: 18px; font-weight: 300; color: ${theme.primary}; letter-spacing: 2px;">
                    ${branding.shortName?.split(' ')[0] || branding.clinicName.split(' ')[0]}
                </span>
                <span style="display: block; font-size: 14px; font-weight: 600; color: ${theme.primary}; letter-spacing: 1px;">
                    ${branding.shortName?.split(' ').slice(1).join(' ') || 'CLINIC'}
                </span>
            </div>
        </div>
    </div>
    `;
}

// =============================================================================
// GENERATE FOOTER HTML WITH CONFIGURABLE BRANDING
// =============================================================================

export function generateConfigurableFooter(
    config: PDFConfiguration,
    verificationCode?: string,
    qrCodeUrl?: string
): string {
    const { branding, theme, footer } = config;

    return `
    <div class="electronic-footer" style="
        text-align: center; 
        margin-top: 30px; 
        padding: 20px;
        background: ${theme.footerBg};
        border-top: 1px dashed ${theme.cardBorder};
    ">
        <div style="font-size: 9px; color: ${theme.textMuted}; margin-bottom: 8px;">
            ${footer.disclaimer}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: ${theme.secondary};">
            ${footer.systemName}
        </div>
        ${footer.showVerification && verificationCode ? `
        <div style="margin-top: 10px; font-size: 10px;">
            <span style="color: ${theme.textSecondary};">Verification Code:</span>
            <span style="font-family: monospace; letter-spacing: 1px; color: ${theme.primary};">${verificationCode}</span>
        </div>
        ` : ''}
        ${footer.showQRCode && qrCodeUrl ? `
        <div style="margin-top: 10px;">
            <img src="${qrCodeUrl}" alt="QR Code" style="width: 60px; height: 60px;" />
        </div>
        ` : ''}
        <div style="margin-top: 10px; font-size: 9px; color: ${theme.textMuted};">
            ${branding.address}
        </div>
    </div>
    `;
}

// =============================================================================
// CLINIC SETTINGS PERSISTENCE (Types for Storage)
// =============================================================================

export interface ClinicSettings {
    branding: ClinicBranding;
    selectedTheme: string;
    customTheme?: Partial<PDFColorTheme>;
    invoicePrefix: string;
    invoiceStartNumber: number;
    currentInvoiceNumber: number;

    // Marketplace Flags (HealthFlo Pivot)
    isMarketplaceActive: boolean;
    discoveryEnabled: boolean;
}

export const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
    branding: DEFAULT_CLINIC_BRANDING,
    selectedTheme: 'noble',
    invoicePrefix: 'INV',
    invoiceStartNumber: 1001,
    currentInvoiceNumber: 1001,
    isMarketplaceActive: false,
    discoveryEnabled: false,
};
name: string;

// Primary colors
primary: string;           // Main brand color
secondary: string;         // Secondary accent
accent: string;            // Highlight color

// Header/Footer
headerBg: string;
headerText: string;
footerBg: string;
footerText: string;

// Section bars
sectionBarBg: string;
sectionBarText: string;

// Cards & Boxes
cardBg: string;
cardBorder: string;
warningBg: string;
successBg: string;

// Text
textPrimary: string;
textSecondary: string;
textMuted: string;

// Status
positive: string;
warning: string;
danger: string;
}

// =============================================================================
// PRESET COLOR THEMES
// =============================================================================

export const PDF_COLOR_THEMES: Record<string, PDFColorTheme> = {
    // Noble Clinic Original (Teal + Navy)
    noble: {
        name: 'Noble Clinic',
        primary: '#003366',
        secondary: '#00A89D',
        accent: '#14B8A6',
        headerBg: '#003366',
        headerText: '#FFFFFF',
        footerBg: '#F3F4F6',
        footerText: '#6B7280',
        sectionBarBg: '#003366',
        sectionBarText: '#00A89D',
        cardBg: '#F8F8F8',
        cardBorder: '#E5E7EB',
        warningBg: '#2C3E50',
        successBg: '#ECFDF5',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#00A89D',
        warning: '#F59E0B',
        danger: '#DC2626',
    },

    // Plain (Minimal Black & White)
    plain: {
        name: 'Plain',
        primary: '#1F2937',
        secondary: '#4B5563',
        accent: '#374151',
        headerBg: '#FFFFFF',
        headerText: '#1F2937',
        footerBg: '#FFFFFF',
        footerText: '#6B7280',
        sectionBarBg: '#F3F4F6',
        sectionBarText: '#1F2937',
        cardBg: '#FFFFFF',
        cardBorder: '#E5E7EB',
        warningBg: '#F3F4F6',
        successBg: '#F9FAFB',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
    },

    // Royal Blue
    royalBlue: {
        name: 'Royal Blue',
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#60A5FA',
        headerBg: '#1E40AF',
        headerText: '#FFFFFF',
        footerBg: '#EFF6FF',
        footerText: '#1E40AF',
        sectionBarBg: '#1E40AF',
        sectionBarText: '#93C5FD',
        cardBg: '#F8FAFC',
        cardBorder: '#BFDBFE',
        warningBg: '#1E3A5F',
        successBg: '#DBEAFE',
        textPrimary: '#1E293B',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        positive: '#3B82F6',
        warning: '#F59E0B',
        danger: '#EF4444',
    },

    // Emerald Green
    emerald: {
        name: 'Emerald',
        primary: '#065F46',
        secondary: '#10B981',
        accent: '#34D399',
        headerBg: '#065F46',
        headerText: '#FFFFFF',
        footerBg: '#ECFDF5',
        footerText: '#065F46',
        sectionBarBg: '#065F46',
        sectionBarText: '#6EE7B7',
        cardBg: '#F0FDF4',
        cardBorder: '#A7F3D0',
        warningBg: '#064E3B',
        successBg: '#D1FAE5',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
    },

    // Purple Luxe
    purple: {
        name: 'Purple Luxe',
        primary: '#5B21B6',
        secondary: '#8B5CF6',
        accent: '#A78BFA',
        headerBg: '#5B21B6',
        headerText: '#FFFFFF',
        footerBg: '#F5F3FF',
        footerText: '#5B21B6',
        sectionBarBg: '#5B21B6',
        sectionBarText: '#C4B5FD',
        cardBg: '#FAFAF9',
        cardBorder: '#DDD6FE',
        warningBg: '#4C1D95',
        successBg: '#EDE9FE',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#8B5CF6',
        warning: '#F59E0B',
        danger: '#EF4444',
    },

    // Coral Warm
    coral: {
        name: 'Coral Warm',
        primary: '#9F1239',
        secondary: '#F43F5E',
        accent: '#FB7185',
        headerBg: '#9F1239',
        headerText: '#FFFFFF',
        footerBg: '#FFF1F2',
        footerText: '#9F1239',
        sectionBarBg: '#9F1239',
        sectionBarText: '#FECDD3',
        cardBg: '#FFFBFB',
        cardBorder: '#FECDD3',
        warningBg: '#881337',
        successBg: '#FFE4E6',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        positive: '#F43F5E',
        warning: '#F59E0B',
        danger: '#DC2626',
    },

    // Slate Professional
    slate: {
        name: 'Slate Professional',
        primary: '#334155',
        secondary: '#64748B',
        accent: '#94A3B8',
        headerBg: '#1E293B',
        headerText: '#F8FAFC',
        footerBg: '#F1F5F9',
        footerText: '#475569',
        sectionBarBg: '#334155',
        sectionBarText: '#CBD5E1',
        cardBg: '#F8FAFC',
        cardBorder: '#E2E8F0',
        warningBg: '#1E293B',
        successBg: '#F1F5F9',
        textPrimary: '#1E293B',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        positive: '#64748B',
        warning: '#F59E0B',
        danger: '#EF4444',
    },
};

// =============================================================================
// DEFAULT CLINIC CONFIGURATION
// =============================================================================

export const DEFAULT_CLINIC_BRANDING: ClinicBranding = {
    clinicName: 'Noble Dental Care',
    shortName: 'NOBLE CLINIC',
    tagline: 'PIONEERING BETTER HEALTH',
    facility: 'HEALTHFLO HOSPITAL & CLINIC',
    address: '1ST Floor, ICA CLINIC, HUDA LAYOUT, NALLAGANDLA, HYDERABAD -500019',
    phone: '+91-8610-425342',
    email: 'info@nobledental.in',
    website: 'www.nobledental.in',
    primaryDoctor: 'DR DHIVAKARAN',
    doctorTitle: 'DOCTOR',
};

// =============================================================================
// PDF CONFIGURATION BUILDER
// =============================================================================

export interface PDFConfiguration {
    branding: ClinicBranding;
    theme: PDFColorTheme;
    footer: {
        systemName: string;
        disclaimer: string;
        showVerification: boolean;
        showQRCode: boolean;
    };
}

export function createPDFConfiguration(
    branding: Partial<ClinicBranding> = {},
    themeName: keyof typeof PDF_COLOR_THEMES = 'noble'
): PDFConfiguration {
    return {
        branding: { ...DEFAULT_CLINIC_BRANDING, ...branding },
        theme: PDF_COLOR_THEMES[themeName] || PDF_COLOR_THEMES.noble,
        footer: {
            systemName: 'HealthFlo Dental-OS',
            disclaimer: 'This is an Electronic Record - No Manual Signature Required',
            showVerification: true,
            showQRCode: true,
        },
    };
}

// =============================================================================
// GENERATE CSS VARIABLES FROM THEME
// =============================================================================

export function generateThemeCSS(theme: PDFColorTheme): string {
    return `
    :root {
        --pdf-primary: ${theme.primary};
        --pdf-secondary: ${theme.secondary};
        --pdf-accent: ${theme.accent};
        
        --pdf-header-bg: ${theme.headerBg};
        --pdf-header-text: ${theme.headerText};
        --pdf-footer-bg: ${theme.footerBg};
        --pdf-footer-text: ${theme.footerText};
        
        --pdf-section-bar-bg: ${theme.sectionBarBg};
        --pdf-section-bar-text: ${theme.sectionBarText};
        
        --pdf-card-bg: ${theme.cardBg};
        --pdf-card-border: ${theme.cardBorder};
        --pdf-warning-bg: ${theme.warningBg};
        --pdf-success-bg: ${theme.successBg};
        
        --pdf-text-primary: ${theme.textPrimary};
        --pdf-text-secondary: ${theme.textSecondary};
        --pdf-text-muted: ${theme.textMuted};
        
        --pdf-positive: ${theme.positive};
        --pdf-warning: ${theme.warning};
        --pdf-danger: ${theme.danger};
    }
    `;
}

// =============================================================================
// GENERATE HEADER HTML WITH CONFIGURABLE BRANDING
// =============================================================================

export function generateConfigurableHeader(
    config: PDFConfiguration,
    sectionLabel?: string
): string {
    const { branding, theme } = config;

    return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
        <div class="header-left">
            ${sectionLabel ? `<span style="font-size: 11px; color: ${theme.textSecondary}; letter-spacing: 1px;">${sectionLabel}</span>` : ''}
        </div>
        <div class="header-right" style="display: flex; align-items: center; gap: 10px;">
            ${branding.logo ? `
                <img src="${branding.logo}" 
                     alt="${branding.clinicName}" 
                     style="width: ${branding.logoWidth || 40}px; height: ${branding.logoHeight || 40}px; object-fit: contain;" />
            ` : ''}
            <div style="text-align: right; line-height: 1.2;">
                <span style="display: block; font-size: 18px; font-weight: 300; color: ${theme.primary}; letter-spacing: 2px;">
                    ${branding.shortName?.split(' ')[0] || branding.clinicName.split(' ')[0]}
                </span>
                <span style="display: block; font-size: 14px; font-weight: 600; color: ${theme.primary}; letter-spacing: 1px;">
                    ${branding.shortName?.split(' ').slice(1).join(' ') || 'CLINIC'}
                </span>
            </div>
        </div>
    </div>
    `;
}

// =============================================================================
// GENERATE FOOTER HTML WITH CONFIGURABLE BRANDING
// =============================================================================

export function generateConfigurableFooter(
    config: PDFConfiguration,
    verificationCode?: string,
    qrCodeUrl?: string
): string {
    const { branding, theme, footer } = config;

    return `
    <div class="electronic-footer" style="
        text-align: center; 
        margin-top: 30px; 
        padding: 20px;
        background: ${theme.footerBg};
        border-top: 1px dashed ${theme.cardBorder};
    ">
        <div style="font-size: 9px; color: ${theme.textMuted}; margin-bottom: 8px;">
            ${footer.disclaimer}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: ${theme.secondary};">
            ${footer.systemName}
        </div>
        ${footer.showVerification && verificationCode ? `
        <div style="margin-top: 10px; font-size: 10px;">
            <span style="color: ${theme.textSecondary};">Verification Code:</span>
            <span style="font-family: monospace; letter-spacing: 1px; color: ${theme.primary};">${verificationCode}</span>
        </div>
        ` : ''}
        ${footer.showQRCode && qrCodeUrl ? `
        <div style="margin-top: 10px;">
            <img src="${qrCodeUrl}" alt="QR Code" style="width: 60px; height: 60px;" />
        </div>
        ` : ''}
        <div style="margin-top: 10px; font-size: 9px; color: ${theme.textMuted};">
            ${branding.address}
        </div>
    </div>
    `;
}

// =============================================================================
// CLINIC SETTINGS PERSISTENCE (Types for Storage)
// =============================================================================

export interface ClinicSettings {
    branding: ClinicBranding;
    selectedTheme: string;
    customTheme?: Partial<PDFColorTheme>;
    invoicePrefix: string;
    invoiceStartNumber: number;
    currentInvoiceNumber: number;
}

export const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
    branding: DEFAULT_CLINIC_BRANDING,
    selectedTheme: 'noble',
    invoicePrefix: 'INV',
    invoiceStartNumber: 1001,
    currentInvoiceNumber: 1001,
};

/**
 * Generate next invoice number
 */
export function generateInvoiceNumber(settings: ClinicSettings): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const number = settings.currentInvoiceNumber.toString().padStart(6, '0');
    return `${settings.invoicePrefix}-${year}${month}-${number}`;
}
