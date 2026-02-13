/**
 * HealthFlo Dental ID Generator
 * Format: HFD-[CITY]-[AREA]-[SEQ]
 * Example: HFD-HYD-NLG-001 (Noble Dental Nallagandla)
 */

export const generateHealthFloID = (city: string, area: string, seq: number = 1): string => {
    const cleanCity = city.slice(0, 3).toUpperCase();
    const cleanArea = area.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    const cleanSeq = seq.toString().padStart(3, '0');

    return `HFD-${cleanCity}-${cleanArea}-${cleanSeq}`;
};

export const parseHealthFloID = (id: string) => {
    const parts = id.split('-');
    if (parts.length !== 4 || parts[0] !== 'HFD') return null;
    return {
        city: parts[1],
        area: parts[2],
        seq: parseInt(parts[3])
    };
};

// Hardcoded ID for Demo Clinic
export const DEMO_CLINIC_ID = "HFD-HYD-DEM-001";
