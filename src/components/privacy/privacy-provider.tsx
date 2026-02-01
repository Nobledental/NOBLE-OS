'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

// =============================================================================
// PRIVACY CONTEXT
// =============================================================================

interface PrivacySettings {
    isBlurred: boolean;
    blurFinancials: boolean;
    blurMedical: boolean;
    blurPatientNames: boolean;
    autoBlurTimeout: number | null; // Auto-blur after X seconds of inactivity
}

interface PrivacyContextType {
    settings: PrivacySettings;
    toggleBlur: () => void;
    setBlurred: (blurred: boolean) => void;
    updateSettings: (updates: Partial<PrivacySettings>) => void;
    BlurWrapper: React.FC<{ children: React.ReactNode; type?: 'financial' | 'medical' | 'name' }>;
}

const defaultSettings: PrivacySettings = {
    isBlurred: false,
    blurFinancials: true,
    blurMedical: true,
    blurPatientNames: true,
    autoBlurTimeout: 300 // 5 minutes
};

const PrivacyContext = createContext<PrivacyContextType | null>(null);

export function usePrivacy() {
    const context = useContext(PrivacyContext);
    if (!context) {
        return {
            settings: defaultSettings,
            toggleBlur: () => { },
            setBlurred: () => { },
            updateSettings: () => { },
            BlurWrapper: ({ children }: { children: React.ReactNode }) => <>{children}</>
        };
    }
    return context;
}

// =============================================================================
// PRIVACY PROVIDER
// =============================================================================

interface PrivacyProviderProps {
    children: React.ReactNode;
}

export function PrivacyProvider({ children }: PrivacyProviderProps) {
    const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);
    const [lastActivity, setLastActivity] = useState<number>(Date.now());

    // Toggle blur with Cmd+B / Ctrl+B
    useHotkeys('mod+b', (e) => {
        e.preventDefault();
        toggleBlur();
    }, { enableOnFormTags: true });

    // Also support Escape to enable blur quickly
    useHotkeys('escape', () => {
        setSettings(prev => ({ ...prev, isBlurred: true }));
    });

    const toggleBlur = useCallback(() => {
        setSettings(prev => ({ ...prev, isBlurred: !prev.isBlurred }));

        // Haptic feedback on toggle
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }, []);

    const setBlurred = useCallback((blurred: boolean) => {
        setSettings(prev => ({ ...prev, isBlurred: blurred }));
    }, []);

    const updateSettings = useCallback((updates: Partial<PrivacySettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    // Track activity for auto-blur
    useEffect(() => {
        const handleActivity = () => {
            setLastActivity(Date.now());
            // Clear blur on activity (if user is actively using)
            if (settings.isBlurred) {
                // Don't auto-unblur, require manual toggle
            }
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('touchstart', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
        };
    }, [settings.isBlurred]);

    // Auto-blur after inactivity
    useEffect(() => {
        if (!settings.autoBlurTimeout) return;

        const interval = setInterval(() => {
            const inactive = settings.autoBlurTimeout && (Date.now() - lastActivity > settings.autoBlurTimeout * 1000);
            if (inactive && !settings.isBlurred) {
                setSettings(prev => ({ ...prev, isBlurred: true }));
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [settings.autoBlurTimeout, settings.isBlurred, lastActivity]);

    // Blur wrapper component
    const BlurWrapper: React.FC<{
        children: React.ReactNode;
        type?: 'financial' | 'medical' | 'name'
    }> = ({ children, type = 'financial' }) => {
        const shouldBlur = settings.isBlurred && (
            (type === 'financial' && settings.blurFinancials) ||
            (type === 'medical' && settings.blurMedical) ||
            (type === 'name' && settings.blurPatientNames)
        );

        if (!shouldBlur) {
            return <>{children}</>;
        }

        return (
            <span
                className="privacy-blur inline-block"
                title="Press Cmd+B to reveal"
            >
                {children}
            </span>
        );
    };

    return (
        <PrivacyContext.Provider value={{ settings, toggleBlur, setBlurred, updateSettings, BlurWrapper }}>
            {children}

            {/* Privacy indicator */}
            {settings.isBlurred && (
                <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-full text-xs font-medium animate-pulse">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Privacy Mode • Cmd+B to reveal
                </div>
            )}
        </PrivacyContext.Provider>
    );
}

// =============================================================================
// PRIVACY TOGGLE BUTTON
// =============================================================================

interface PrivacyToggleProps {
    className?: string;
}

export function PrivacyToggle({ className = '' }: PrivacyToggleProps) {
    const { settings, toggleBlur } = usePrivacy();

    return (
        <button
            onClick={toggleBlur}
            className={`p-2 rounded-lg transition-all ${settings.isBlurred
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                : 'bg-muted hover:bg-muted/80'
                } ${className}`}
            title={settings.isBlurred ? 'Click to reveal data (Cmd+B)' : 'Click to blur data (Cmd+B)'}
        >
            {settings.isBlurred ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}
        </button>
    );
}

// =============================================================================
// PRIVACY SETTINGS PANEL
// =============================================================================

interface PrivacySettingsPanelProps {
    className?: string;
}

export function PrivacySettingsPanel({ className = '' }: PrivacySettingsPanelProps) {
    const { settings, updateSettings } = usePrivacy();

    return (
        <div className={`space-y-4 p-4 ${className}`}>
            <h3 className="font-semibold">Privacy Settings</h3>

            <div className="space-y-3">
                <label className="flex items-center justify-between">
                    <span className="text-sm">Blur Financial Data</span>
                    <input
                        type="checkbox"
                        checked={settings.blurFinancials}
                        onChange={(e) => updateSettings({ blurFinancials: e.target.checked })}
                        className="w-4 h-4"
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span className="text-sm">Blur Medical Data</span>
                    <input
                        type="checkbox"
                        checked={settings.blurMedical}
                        onChange={(e) => updateSettings({ blurMedical: e.target.checked })}
                        className="w-4 h-4"
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span className="text-sm">Blur Patient Names</span>
                    <input
                        type="checkbox"
                        checked={settings.blurPatientNames}
                        onChange={(e) => updateSettings({ blurPatientNames: e.target.checked })}
                        className="w-4 h-4"
                    />
                </label>

                <div>
                    <label className="text-sm block mb-1">Auto-blur after inactivity</label>
                    <select
                        value={settings.autoBlurTimeout || 0}
                        onChange={(e) => updateSettings({
                            autoBlurTimeout: e.target.value === '0' ? null : parseInt(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="0">Never</option>
                        <option value="60">1 minute</option>
                        <option value="300">5 minutes</option>
                        <option value="600">10 minutes</option>
                    </select>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                Use <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘B</kbd> or
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">Ctrl+B</kbd> to toggle privacy mode
            </p>
        </div>
    );
}
