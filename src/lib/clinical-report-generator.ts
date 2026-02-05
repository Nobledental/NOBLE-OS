import {
    ClinicBranding,
    PDFColorTheme,
    PDFConfiguration,
    generateThemeCSS,
    DEFAULT_CLINIC_BRANDING
} from './pdf-config';

export interface ClinicalReportData {
    reportTitle: string; // e.g., "PRESCRIPTION", "DISCHARGE SUMMARY"
    patientName: string;
    age: number;
    gender: string;
    date: Date;
    doctorName: string;

    // Optional Sections
    vitals?: { label: string; value: string }[];
    diagnosis?: string;
    medicines?: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instruction?: string
    }[];
    notes?: string[];
    followUpDate?: Date;
}

export function generateClinicalReport(
    data: ClinicalReportData,
    config: PDFConfiguration
): string {
    const { branding, theme } = config;

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${data.reportTitle} - ${data.patientName}</title>
        <style>
            ${generateThemeCSS(theme)}
            
            body { 
                font-family: 'Inter', sans-serif; 
                padding: 40px; 
                margin: 0; 
                color: ${theme.textPrimary};
            }
            
            .header {
                display: flex;
                justify-content: space-between;
                border-bottom: 3px solid ${theme.primary};
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            
            .brand h1 { margin: 0; color: ${theme.primary}; font-size: 24px; text-transform: uppercase; }
            .brand p { margin: 4px 0 0; font-size: 10px; color: ${theme.textSecondary}; }
            
            .doc-info { text-align: right; }
            .doc-name { font-weight: bold; color: ${theme.primary}; font-size: 14px; }
            .doc-qual { font-size: 10px; color: ${theme.textMuted}; }
            
            .patient-box {
                background: ${theme.cardBg};
                border: 1px solid ${theme.cardBorder};
                border-radius: 8px;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
            }
            .pt-row span { display: block; }
            .pt-label { font-size: 9px; text-transform: uppercase; color: ${theme.textMuted}; }
            .pt-val { font-weight: 600; font-size: 14px; }
            
            .section-title {
                background: ${theme.sectionBarBg};
                color: ${theme.sectionBarText};
                padding: 8px 12px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 15px;
                border-radius: 4px;
            }
            
            .rx-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .rx-table th { text-align: left; border-bottom: 1px solid ${theme.cardBorder}; padding: 8px; font-size: 10px; color: ${theme.textMuted}; text-transform: uppercase; }
            .rx-table td { padding: 12px 8px; border-bottom: 1px solid ${theme.cardBorder}; font-size: 12px; }
            
            .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 20px 40px;
                text-align: center;
                border-top: 1px solid ${theme.cardBorder};
                font-size: 9px;
                color: ${theme.textMuted};
                background: white;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="brand">
                <h1>${branding.clinicName}</h1>
                <p>${branding.address} | ${branding.phone}</p>
            </div>
            <div class="doc-info">
                <div class="doc-name">${branding.primaryDoctor}</div>
                <div class="doc-qual">${branding.doctorTitle}</div>
                <div style="margin-top: 10px; font-size: 18px; font-weight: 900; color: ${theme.secondary}; letter-spacing: 2px;">
                    ${data.reportTitle}
                </div>
            </div>
        </div>

        <div class="patient-box">
            <div class="pt-row">
                <span class="pt-label">Patient Name</span>
                <span class="pt-val">${data.patientName}</span>
            </div>
            <div class="pt-row">
                <span class="pt-label">Age / Gender</span>
                <span class="pt-val">${data.age} Y / ${data.gender}</span>
            </div>
             <div class="pt-row">
                <span class="pt-label">Date</span>
                <span class="pt-val">${formatDate(data.date)}</span>
            </div>
            ${data.vitals ? data.vitals.map(v => `
                 <div class="pt-row">
                    <span class="pt-label">${v.label}</span>
                    <span class="pt-val" style="color:${theme.danger}">${v.value}</span>
                </div>
            `).join('') : ''}
        </div>

        ${data.diagnosis ? `
            <div style="margin-bottom: 30px;">
                <div style="font-size: 10px; color: ${theme.textMuted}; text-transform: uppercase;">Diagnosis</div>
                <div style="font-size: 16px; font-weight: 500; color: ${theme.textPrimary};">${data.diagnosis}</div>
            </div>
        ` : ''}

        ${data.medicines ? `
            <div class="section-title">Rx - Medications</div>
            <table class="rx-table">
                <thead>
                    <tr>
                        <th width="40%">Medicine Name</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.medicines.map(med => `
                        <tr>
                            <td>
                                <strong>${med.name}</strong>
                                ${med.instruction ? `<div style="font-size: 10px; color:${theme.textMuted}; margin-top:2px;">${med.instruction}</div>` : ''}
                            </td>
                            <td>${med.dosage}</td>
                            <td>${med.frequency}</td>
                            <td>${med.duration}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : ''}

        ${data.notes ? `
            <div class="section-title">Clinical Notes / Advice</div>
            <ul style="font-size: 12px; line-height: 1.6; color: ${theme.textPrimary};">
                ${data.notes.map(note => `<li>${note}</li>`).join('')}
            </ul>
        ` : ''}

        <div class="footer">
            ${branding.clinicName} • ${branding.address} • ${branding.phone} <br>
            Generated by HealthFlo Dental-OS
        </div>
    </body>
    </html>
    `;
}
