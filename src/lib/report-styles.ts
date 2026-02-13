export const NOBLE_BRAND = {
    colors: {
        navy: '#003366',
        teal: '#00A89D',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        cardBorder: '#E5E7EB',
    },
    clinic: {
        doctor: 'CLINIC PRACTITIONER',
    }
};

export const NOBLE_PDF_STYLES = `
body {
    font-family: 'Inter', sans-serif;
    color: ${NOBLE_BRAND.colors.textPrimary};
    line-height: 1.5;
}

.page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    margin: 10mm auto;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    position: relative;
}

/* Cover Page Styles */
.cover-page {
    text-align: center;
}

.cover-header {
    padding: 40px 0 20px;
}

.clinic-name {
    font-size: 36px;
    font-weight: 300;
    color: ${NOBLE_BRAND.colors.navy};
    letter-spacing: 2px;
    margin: 0;
}

.clinic-tagline {
    font-size: 12px;
    color: ${NOBLE_BRAND.colors.teal};
    letter-spacing: 3px;
    margin-top: 8px;
}

.facility-bar {
    background: linear-gradient(90deg, ${NOBLE_BRAND.colors.navy} 0%, #004488 100%);
    color: white;
    padding: 12px;
    font-size: 12px;
    letter-spacing: 3px;
}

.address-bar {
    font-size: 9px;
    color: ${NOBLE_BRAND.colors.textSecondary};
    padding: 8px;
    border-bottom: 1px solid ${NOBLE_BRAND.colors.cardBorder};
}

.logo-container {
    padding: 60px 0;
}

.logo-placeholder {
    width: 180px;
    height: 180px;
    margin: 0 auto;
    background: linear-gradient(135deg, ${NOBLE_BRAND.colors.teal}20, ${NOBLE_BRAND.colors.navy}20);
    border-radius: 20px;
}

.patient-info-bar {
    background: #F0F0F0;
    padding: 20px 40px;
    text-align: left;
    border-top: 2px solid ${NOBLE_BRAND.colors.cardBorder};
}

.info-row {
    display: flex;
    margin: 8px 0;
}

.info-label {
    width: 120px;
    font-weight: 600;
    color: ${NOBLE_BRAND.colors.navy};
    font-size: 11px;
}

.info-colon {
    width: 15px;
}

.info-value {
    color: ${NOBLE_BRAND.colors.teal};
    font-weight: 500;
    font-size: 12px;
}

.cover-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(90deg, #E8E8E8, #D0D0D0);
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.phone-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.phone-icon {
    width: 36px;
    height: 36px;
    background: ${NOBLE_BRAND.colors.teal};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.phone-text {
    font-size: 9px;
    color: ${NOBLE_BRAND.colors.teal};
}

.phone-number {
    font-size: 14px;
    font-weight: 600;
    color: ${NOBLE_BRAND.colors.teal};
}

.update-section {
    text-align: right;
    background: white;
    padding: 10px 15px;
    border-radius: 4px;
}

.update-label {
    font-size: 9px;
    color: ${NOBLE_BRAND.colors.textSecondary};
}

.update-date {
    font-size: 12px;
    font-weight: 600;
    color: ${NOBLE_BRAND.colors.navy};
}

/* Treatment Sitting Styles */
.treatment-sitting {
    margin-bottom: 30px;
    page-break-inside: avoid;
}

.sitting-header {
    background: ${NOBLE_BRAND.colors.navy};
    color: white;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sitting-date {
    font-weight: 600;
    font-size: 14px;
}

.sitting-details {
    padding: 15px;
    border: 1px solid ${NOBLE_BRAND.colors.cardBorder};
}

/* Electronic Footer */
.electronic-footer {
    text-align: center;
    margin-top: 40px;
    padding: 20px;
    border-top: 1px dashed ${NOBLE_BRAND.colors.cardBorder};
    font-size: 10px;
    color: ${NOBLE_BRAND.colors.textSecondary};
}

/* Print Styles */
@media print {
    .page {
        page-break-after: always;
        margin: 0;
        box-shadow: none;
        width: 100%;
    }
    
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
`;
