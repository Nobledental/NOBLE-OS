/**
 * Noble Clinic PDF Templates - Exact Match
 * 
 * Based on actual Noble Dental Care face sheets and medical certificates
 */

// =============================================================================
// NOBLE CLINIC EXACT BRANDING (From PDFs)
// =============================================================================

export const NOBLE_CLINIC_BRAND = {
    colors: {
        // Primary colors from logo
        navyBlue: '#003366',        // Header bars, titles
        tealAccent: '#00A89D',      // Accents, highlights
        tealLight: '#A8E6CF',       // Light backgrounds

        // UI colors
        headerBar: '#003366',       // Navy header bar
        sectionTitle: '#00A89D',    // Teal section titles
        cardBorder: '#E0E0E0',      // Light gray borders
        cardBg: '#F8F8F8',          // Light gray card backgrounds
        warningBg: '#2C3E50',       // Dark navy for warnings

        // Text colors
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',

        // Status colors
        positive: '#00A89D',        // Teal for "Yes", positive values
        negative: '#DC2626',        // Red for concerns
        neutral: '#6B7280',         // Gray for "NA"
    },

    fonts: {
        heading: "'Inter', 'Segoe UI', sans-serif",
        body: "'Inter', 'Segoe UI', sans-serif",
        mono: "'SF Mono', 'Consolas', monospace",
    },

    clinic: {
        name: 'Noble Dental Care',
        tagline: 'PIONEERING BETTER HEALTH',
        facility: 'HEALTHFLO HOSPITAL & CLINIC',
        address: '1ST Floor, ICA CLINIC, HUDA LAYOUT, NALLAGANDLA, HYDERABAD -500019',
        phone: '+91-8610-425342',
        doctor: 'DR DHIVAKARAN',
        doctorTitle: 'DOCTOR',
    },

    footer: {
        system: 'HealthFlo Dental-OS',
        disclaimer: 'This is an Electronic Record - No Manual Signature Required',
    }
};

// =============================================================================
// COVER PAGE TEMPLATE (From Image 2)
// =============================================================================

export interface CoverPageData {
    patientName: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    uhid: string;
    updatedOn: Date;
    logoBase64?: string;
}

export function generateCoverPageHTML(data: CoverPageData, logoBase64?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page { size: A4 portrait; margin: 0; }
            body { 
                font-family: ${NOBLE_CLINIC_BRAND.fonts.body}; 
                margin: 0; 
                padding: 0;
                color: ${NOBLE_CLINIC_BRAND.colors.textPrimary};
            }
            .cover-page {
                width: 210mm;
                min-height: 297mm;
                position: relative;
                background: white;
            }
            .cover-header {
                text-align: center;
                padding: 40px 30px 20px;
            }
            .clinic-title {
                font-size: 36px;
                font-weight: 300;
                color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
                margin: 0;
                letter-spacing: 2px;
            }
            .clinic-tagline {
                font-size: 12px;
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
                letter-spacing: 3px;
                margin-top: 8px;
            }
            .facility-bar {
                background: linear-gradient(90deg, ${NOBLE_CLINIC_BRAND.colors.navyBlue} 0%, #004488 100%);
                color: white;
                padding: 12px 30px;
                font-size: 13px;
                letter-spacing: 4px;
                text-align: center;
                margin-top: 20px;
            }
            .address-bar {
                font-size: 10px;
                color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
                text-align: center;
                padding: 8px;
                border-bottom: 1px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
            }
            .logo-container {
                text-align: center;
                padding: 60px 0;
            }
            .logo-container img {
                width: 200px;
                height: auto;
            }
            .logo-placeholder {
                width: 200px;
                height: 200px;
                margin: 0 auto;
                background: linear-gradient(135deg, ${NOBLE_CLINIC_BRAND.colors.tealAccent}20, ${NOBLE_CLINIC_BRAND.colors.navyBlue}20);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .patient-info-bar {
                background: #F0F0F0;
                padding: 24px 40px;
                margin: 0 30px;
                border-top: 3px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
            }
            .info-row {
                display: flex;
                margin: 8px 0;
            }
            .info-label {
                width: 140px;
                font-weight: 600;
                color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
                font-size: 12px;
            }
            .info-colon {
                width: 20px;
                text-align: center;
            }
            .info-value {
                font-size: 14px;
                font-weight: 500;
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
            }
            .cover-footer {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(90deg, #E8E8E8 0%, #D0D0D0 100%);
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
                background: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .phone-text {
                font-size: 11px;
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
            }
            .phone-number {
                font-size: 16px;
                font-weight: 600;
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
            }
            .update-section {
                text-align: right;
                background: white;
                padding: 12px 20px;
                border-radius: 4px;
            }
            .update-label {
                font-size: 10px;
                color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
                letter-spacing: 1px;
            }
            .update-date {
                font-size: 14px;
                font-weight: 600;
                color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
            }
            .barcode {
                font-family: 'Libre Barcode 39', cursive;
                font-size: 24px;
                letter-spacing: 2px;
            }
        </style>
    </head>
    <body>
        <div class="cover-page">
            <!-- Header -->
            <div class="cover-header">
                <h1 class="clinic-title">${NOBLE_CLINIC_BRAND.clinic.name}</h1>
                <p class="clinic-tagline">${NOBLE_CLINIC_BRAND.clinic.tagline}</p>
            </div>
            
            <!-- Facility Bar -->
            <div class="facility-bar">${NOBLE_CLINIC_BRAND.clinic.facility}</div>
            <div class="address-bar">${NOBLE_CLINIC_BRAND.clinic.address}</div>
            
            <!-- Logo -->
            <div class="logo-container">
                ${logoBase64
            ? `<img src="${logoBase64}" alt="Noble Dental Care" />`
            : `<div class="logo-placeholder">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <path d="M60 20 L80 50 L60 100 L40 50 Z" fill="${NOBLE_CLINIC_BRAND.colors.tealAccent}" opacity="0.8"/>
                            <ellipse cx="60" cy="55" rx="15" ry="20" fill="white"/>
                        </svg>
                       </div>`
        }
            </div>
            
            <!-- Patient Info -->
            <div class="patient-info-bar">
                <div class="info-row">
                    <span class="info-label">NAME</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${data.patientName.toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">AGE & GENDER</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${data.gender} / ${data.age} Yrs</span>
                </div>
                <div class="info-row">
                    <span class="info-label">UHID</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${data.uhid}</span>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="cover-footer">
                <div class="phone-section">
                    <div class="phone-icon">
                        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                    </div>
                    <div>
                        <div class="phone-text">FOR MORE INFORMATION</div>
                        <div class="phone-number">${NOBLE_CLINIC_BRAND.clinic.phone}</div>
                    </div>
                </div>
                <div class="update-section">
                    <div class="update-label">Updated On</div>
                    <div class="update-date">${data.updatedOn.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</div>
                    <div class="barcode">*${data.uhid}*</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// =============================================================================
// MEDICAL HISTORY PAGE TEMPLATE (From Image 5)
// =============================================================================

export interface MedicalHistoryData {
    allergicHistory: string;
    dentalHistory: string;
    medicalConditions: {
        diabetes: string;
        hypertension: string;
        thyroid: string;
        cardiac: string;
        neurological: string;
        renal: string;
        hepatic: string;
        giTract: string;
        hematology: string;
        bonesJoints: string;
        cancer: string;
        others: string;
    };
    homeMedication: string;
    nursingMother: {
        status: string;
        ageOfBaby: string;
        congenitalCondition: string;
        onAnyMedication: string;
        others: string;
    };
    pregnancyStatus: string;
    bloodGroup: string;
    gpla: string;
    habitualHistory: {
        alcoholTobacco: string;
        habits: string;
    };
}

export function generateMedicalHistoryHTML(data: MedicalHistoryData): string {
    const renderConditionBox = (label: string, value: string) => `
        <div class="condition-box">
            <div class="condition-label">${label}</div>
            <div class="condition-value ${value !== 'NA' ? 'highlighted' : ''}">${value}</div>
        </div>
    `;

    return `
    <div class="medical-history-page">
        <!-- Header -->
        <div class="page-header">
            <div class="logo-small">NOBLE<br/>CLINIC</div>
        </div>
        
        <!-- Allergic History -->
        <div class="section">
            <h2 class="section-title-teal">ALLERGIC HISTORY</h2>
            <div class="note-box">
                <span class="note-label">Note :</span> ${data.allergicHistory || 'NA'}
            </div>
        </div>
        
        <!-- Dental History -->
        <div class="section">
            <h2 class="section-title-teal">DENTAL HISTORY</h2>
            <div class="note-box">
                <span class="note-label">Note :</span> <em>${data.dentalHistory || 'NA'}</em>
            </div>
        </div>
        
        <!-- Medical Conditions -->
        <div class="section">
            <h2 class="section-title-teal">MEDICAL CONDITIONS <span class="subtitle">(K/C/O)</span></h2>
            <div class="conditions-grid">
                ${renderConditionBox('Diabetes', data.medicalConditions.diabetes)}
                ${renderConditionBox('Hypertension', data.medicalConditions.hypertension)}
                ${renderConditionBox('Thyroid', data.medicalConditions.thyroid)}
                ${renderConditionBox('Cardiac', data.medicalConditions.cardiac)}
                ${renderConditionBox('Neurological', data.medicalConditions.neurological)}
                ${renderConditionBox('Renal', data.medicalConditions.renal)}
                ${renderConditionBox('Hepatic', data.medicalConditions.hepatic)}
                ${renderConditionBox('GI-T', data.medicalConditions.giTract)}
                ${renderConditionBox('Hematology', data.medicalConditions.hematology)}
                ${renderConditionBox('Bones & Joints', data.medicalConditions.bonesJoints)}
                ${renderConditionBox('Cancer', data.medicalConditions.cancer)}
                ${renderConditionBox('Others', data.medicalConditions.others)}
            </div>
        </div>
        
        <!-- Home Medication & Nursing Mother -->
        <div class="two-column-section">
            <div class="column">
                <div class="bordered-section">
                    <div class="section-header-center">HOME MEDICATION</div>
                    <div class="section-content">
                        <span class="${data.homeMedication !== 'NA' ? 'value-positive' : 'value-na'}">
                            • ${data.homeMedication}
                        </span>
                    </div>
                </div>
                <div class="inline-row">
                    <div class="inline-item">
                        <span class="inline-label">PREGNANCY STATUS</span>
                        <span class="inline-value value-na">${data.pregnancyStatus}</span>
                    </div>
                    <div class="inline-item">
                        <span class="inline-label">BLOOD GROUP</span>
                        <span class="inline-value">${data.bloodGroup || '-'}</span>
                    </div>
                </div>
                <div class="inline-row">
                    <span class="inline-label">GPLA</span>
                    <span class="inline-value">${data.gpla || '-'}</span>
                </div>
            </div>
            <div class="column">
                <div class="bordered-section">
                    <div class="section-header-center">NURSING MOTHER</div>
                    <div class="nursing-value ${data.nursingMother.status !== 'NA' ? 'value-positive' : 'value-na'}">
                        ${data.nursingMother.status}
                    </div>
                    <div class="nursing-details">
                        <div>Age of Baby <span class="colon">:</span> ${data.nursingMother.ageOfBaby}</div>
                        <div>Congenital Condition <span class="colon">:</span> ${data.nursingMother.congenitalCondition}</div>
                        <div>On Any Medication <span class="colon">:</span> ${data.nursingMother.onAnyMedication}</div>
                        <div>Others <span class="colon">:</span> ${data.nursingMother.others}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Habitual History -->
        <div class="section">
            <h2 class="section-title-navy">HABITUAL HISTORY</h2>
            <div class="habits-grid">
                <div class="habit-box">
                    <div class="habit-label">ALCOHOL / TOBACCO</div>
                    <div class="habit-value value-na">${data.habitualHistory.alcoholTobacco}</div>
                </div>
                <div class="habit-box">
                    <div class="habit-label">Habits</div>
                    <div class="habit-value value-na">${data.habitualHistory.habits}</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// =============================================================================
// CLINICAL FINDINGS PAGE TEMPLATE (From Image 4)
// =============================================================================

export interface ClinicalFindingsData {
    date: Date;
    healthScore: number;
    dentalArch: {
        annotations: Array<{
            text: string;
            position: 'left' | 'right';
            toothArea: string;
        }>;
    };
    indices: {
        tenderness: { percentage: number; range: string };
        sensitivity: { percentage: number; range: string };
        bleeding: { percentage: number; range: string };
        calculusPlaque: { percentage: number; range: string };
        stains: { percentage: number; range: string };
    };
    oralStatus: {
        gingivalStatus: { value: string; range: string };
        lymphNodes: { value: string; range: string };
        salivaryStatus: { value: string; range: string };
    };
}

export function generateClinicalFindingsHTML(data: ClinicalFindingsData): string {
    const getIndexColor = (percentage: number) => {
        if (percentage <= 20) return NOBLE_CLINIC_BRAND.colors.positive;
        if (percentage <= 50) return '#F59E0B';
        return NOBLE_CLINIC_BRAND.colors.negative;
    };

    return `
    <div class="clinical-findings-page">
        <!-- Header -->
        <div class="page-header">
            <span class="section-label">ALLERGIC HISTORY</span>
            <div class="logo-small">NOBLE<br/>CLINIC</div>
        </div>
        
        <!-- Clinical Findings Header -->
        <div class="findings-header">
            <span class="header-title">CLINICAL FINDINGS</span>
            <span class="header-date">${data.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
        </div>
        
        <!-- Dental Arch Diagram -->
        <div class="dental-arch-container">
            <div class="arch-labels">
                <span class="arch-side">R</span>
                <span class="arch-side">L</span>
            </div>
            <div class="dental-arch">
                <!-- Maxilla -->
                <div class="arch maxilla">
                    <div class="arch-label">MAXILLA</div>
                    <!-- SVG or image of dental arch would go here -->
                </div>
                
                <!-- Annotations -->
                <div class="annotations">
                    ${data.dentalArch.annotations.map(ann => `
                        <div class="annotation annotation-${ann.position}">
                            <span class="annotation-text">${ann.text}</span>
                            <span class="annotation-arrow">←</span>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Mandible -->
                <div class="arch mandible">
                    <div class="arch-label">MANDIBLE</div>
                </div>
            </div>
        </div>
        
        <!-- Health Score Gauge -->
        <div class="health-gauge-container">
            <div class="health-gauge">
                <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="${NOBLE_CLINIC_BRAND.colors.navyBlue}"/>
                    <text x="40" y="45" text-anchor="middle" fill="white" font-size="20" font-weight="bold">
                        ${data.healthScore}%
                    </text>
                </svg>
            </div>
        </div>
        
        <!-- Clinical Indices Table -->
        <div class="indices-table">
            <div class="index-header">
                <span>Tenderness</span>
                <span>Sensitivity</span>
                <span>Bleeding</span>
                <span>Calculus / Plaque</span>
                <span>Stains</span>
            </div>
            <div class="index-values">
                <span style="color: ${getIndexColor(data.indices.tenderness.percentage)}">${data.indices.tenderness.percentage} %</span>
                <span style="color: ${getIndexColor(data.indices.sensitivity.percentage)}">${data.indices.sensitivity.percentage} %</span>
                <span style="color: ${getIndexColor(data.indices.bleeding.percentage)}">${data.indices.bleeding.percentage} %</span>
                <span style="color: ${getIndexColor(data.indices.calculusPlaque.percentage)}">${data.indices.calculusPlaque.percentage} %</span>
                <span style="color: ${getIndexColor(data.indices.stains.percentage)}">${data.indices.stains.percentage} %</span>
            </div>
            <div class="index-ranges">
                <span>Range: ${data.indices.tenderness.range}</span>
                <span>Range: ${data.indices.sensitivity.range}</span>
                <span>Range: ${data.indices.bleeding.range}</span>
                <span>Range: ${data.indices.calculusPlaque.range}</span>
                <span>Range: ${data.indices.stains.range}</span>
            </div>
        </div>
        
        <!-- Oral Status Table -->
        <div class="oral-status-table">
            <div class="status-cell">
                <div class="status-label">Gingival status</div>
                <div class="status-value value-positive">${data.oralStatus.gingivalStatus.value}</div>
                <div class="status-range">Range: ${data.oralStatus.gingivalStatus.range}</div>
            </div>
            <div class="status-cell">
                <div class="status-label">Lymph Nodes</div>
                <div class="status-value value-positive">${data.oralStatus.lymphNodes.value}</div>
                <div class="status-range">Range: ${data.oralStatus.lymphNodes.range}</div>
            </div>
            <div class="status-cell">
                <div class="status-label">Salivary status</div>
                <div class="status-value value-positive">${data.oralStatus.salivaryStatus.value}</div>
                <div class="status-range">Range: ${data.oralStatus.salivaryStatus.range}</div>
            </div>
        </div>
    </div>
    `;
}

// =============================================================================
// TREATMENT PROGRESS NOTES TEMPLATE (From Image 3)
// =============================================================================

export interface TreatmentSittingNote {
    sittingNumber: number;
    date: Date;
    followUp?: string;
    reviewNotes?: string;
    procedureNotes: string[];
    doctorName: string;
    doctorSignature?: string;
    doctorRemarks?: string[];
    hasExternalLink?: boolean;
}

export function generateTreatmentNotesHTML(sittings: TreatmentSittingNote[]): string {
    return `
    <div class="treatment-notes-page">
        <!-- Header -->
        <div class="page-header">
            <div class="header-bar">TREATMENT / PROGRESS NOTES.</div>
            <div class="logo-small">NOBLE<br/>CLINIC</div>
        </div>
        
        ${sittings.map(sitting => `
        <!-- Sitting ${sitting.sittingNumber} -->
        <div class="sitting-entry">
            <div class="sitting-header">
                <span class="sitting-number">${sitting.sittingNumber}. ${sitting.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}.</span>
                ${sitting.hasExternalLink ? '<span class="external-link">↗</span>' : ''}
            </div>
            
            ${sitting.followUp ? `
            <div class="sitting-section">
                <h4 class="section-label">Follow-up:</h4>
                <ul class="notes-list">
                    <li>${sitting.followUp}</li>
                </ul>
            </div>
            ` : ''}
            
            ${sitting.reviewNotes ? `
            <div class="sitting-section">
                <h4 class="section-label">Review Notes:</h4>
                <ul class="notes-list">
                    <li>${sitting.reviewNotes}</li>
                </ul>
            </div>
            ` : ''}
            
            <div class="sitting-section">
                <h4 class="section-label">Procedure Notes:</h4>
                <ul class="notes-list">
                    ${sitting.procedureNotes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
            
            <!-- Doctor Signature -->
            <div class="doctor-signature">
                <div class="signature-box">
                    <span class="doctor-name">${sitting.doctorName}</span>
                    ${sitting.doctorSignature
            ? `<img src="${sitting.doctorSignature}" class="signature-image" />`
            : ''
        }
                    <span class="doctor-title">DOCTOR</span>
                </div>
            </div>
            
            ${sitting.doctorRemarks && sitting.doctorRemarks.length > 0 ? `
            <div class="doctor-remarks">
                <div class="remarks-header">DOCTOR REMARKS:</div>
                <ul class="remarks-list">
                    ${sitting.doctorRemarks.map(remark => `<li>${remark}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
    `;
}

// =============================================================================
// MEDICAL CERTIFICATE TEMPLATE (From Image 1)
// =============================================================================

export interface MedicalCertificateData {
    patientName: string;
    age: number;
    gender: 'Male' | 'Female';
    procedureDate: Date;
    procedureDescription: string;
    immediateRestrictions: string[];
    careGuide: {
        painRelief: string;
        bleeding: string;
        eatingDrinking: string;
    };
    doctorName: string;
    doctorSignature?: string;
    clinicSeal?: string;
}

export function generateMedicalCertificateHTML(data: MedicalCertificateData): string {
    const genderTitle = data.gender === 'Female' ? 'Ms.' : 'Mr.';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page { size: A4 portrait; margin: 20mm; }
            body { 
                font-family: ${NOBLE_CLINIC_BRAND.fonts.body}; 
                margin: 0; 
                color: ${NOBLE_CLINIC_BRAND.colors.textPrimary};
                line-height: 1.6;
            }
            .certificate {
                max-width: 210mm;
                margin: 0 auto;
            }
            .cert-header {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-bottom: 20px;
            }
            .logo-box {
                text-align: right;
            }
            .logo-text {
                font-size: 18px;
                font-weight: 300;
                color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
            }
            .logo-text span {
                font-weight: 600;
            }
            .title-bar {
                background: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
                color: white;
                padding: 12px 24px;
                font-size: 16px;
                letter-spacing: 4px;
                font-weight: 500;
            }
            .subtitle-bar {
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
                font-size: 12px;
                padding: 8px 24px;
                letter-spacing: 1px;
            }
            .cert-body {
                padding: 30px 24px;
            }
            .concern-title {
                font-size: 18px;
                text-align: center;
                margin-bottom: 30px;
                letter-spacing: 2px;
            }
            .patient-intro {
                margin-bottom: 20px;
            }
            .patient-intro strong {
                color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
            }
            .postop-section {
                background: ${NOBLE_CLINIC_BRAND.colors.warningBg};
                color: white;
                padding: 20px;
                margin: 30px 0;
            }
            .postop-title {
                font-size: 13px;
                letter-spacing: 2px;
                margin-bottom: 20px;
            }
            .warning-header {
                color: #FCD34D;
                font-weight: 600;
                font-size: 12px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .restriction-item {
                margin: 12px 0;
                line-height: 1.5;
            }
            .restriction-title {
                font-weight: 600;
                color: white;
            }
            .care-guide {
                margin: 30px 0;
            }
            .care-title {
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
                font-size: 14px;
                letter-spacing: 2px;
                margin-bottom: 15px;
            }
            .care-box {
                background: #F0F0F0;
                padding: 20px;
                border-radius: 4px;
            }
            .care-item {
                margin: 12px 0;
            }
            .care-item strong {
                color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
            }
            .signature-section {
                display: flex;
                justify-content: flex-end;
                margin-top: 40px;
                gap: 20px;
            }
            .seal-container {
                text-align: center;
            }
            .signature-container {
                text-align: center;
            }
            .signature-name {
                font-weight: 600;
                color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
            }
            .signature-title {
                font-size: 11px;
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
            }
            .cert-footer {
                text-align: center;
                margin-top: 40px;
                font-size: 10px;
                color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
                border-top: 1px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
                padding-top: 15px;
            }
            .electronic-notice {
                font-size: 9px;
                color: #9CA3AF;
                margin-top: 10px;
            }
            .system-brand {
                color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <!-- Logo Header -->
            <div class="cert-header">
                <div class="logo-box">
                    <div class="logo-text">NOBLE<br/><span>CLINIC</span></div>
                </div>
            </div>
            
            <!-- Title Bar -->
            <div class="title-bar">MEDICAL CERTIFICATE</div>
            <div class="subtitle-bar">Pre & Post-Operative Protocol</div>
            
            <!-- Body -->
            <div class="cert-body">
                <h2 class="concern-title">To Whom It May Concern</h2>
                
                <p class="patient-intro">
                    <strong>${genderTitle} ${data.patientName} (${data.age}, ${data.gender})</strong> is scheduled to undergo a dental surgical procedure under my care on <strong>${data.procedureDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>, under anesthesia.
                </p>
                
                <p>
                    Due to the administration of anesthesia and strong analgesics, she is medically unfit for work duties for a minimum of 24 hours following the procedure. She has been advised <strong>to refrain from driving, operating machinery, and engaging in strenuous activity</strong> during this period to ensure patient safety and facilitate recovery.
                </p>
                
                <!-- Post-Op Section -->
                <div class="postop-section">
                    <div class="postop-title">Post-Operative Care & Instructions Pain Management:</div>
                    
                    <div class="warning-header">
                        ⚠ IMMEDIATE RESTRICTIONS (First 24 Hours)
                    </div>
                    
                    ${data.immediateRestrictions.map(r => `
                        <div class="restriction-item">${r}</div>
                    `).join('')}
                </div>
                
                <!-- Care Guide -->
                <div class="care-guide">
                    <div class="care-title">CARE GUIDE</div>
                    <div class="care-box">
                        <div class="care-item">
                            <strong>Pain Relief:</strong> ${data.careGuide.painRelief}
                        </div>
                        <div class="care-item">
                            <strong>Bleeding:</strong> ${data.careGuide.bleeding}
                        </div>
                        <div class="care-item">
                            <strong>Eating & Drinking:</strong> ${data.careGuide.eatingDrinking}
                        </div>
                    </div>
                </div>
                
                <!-- Signature Section -->
                <div class="signature-section">
                    ${data.clinicSeal ? `<img src="${data.clinicSeal}" height="60" />` : ''}
                    <div class="signature-container">
                        ${data.doctorSignature ? `<img src="${data.doctorSignature}" height="40" />` : ''}
                        <div class="signature-name">${data.doctorName}</div>
                        <div class="signature-title">DOCTOR</div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="cert-footer">
                ${NOBLE_CLINIC_BRAND.clinic.address}
                <div class="electronic-notice">
                    ${NOBLE_CLINIC_BRAND.footer.disclaimer}
                </div>
                <div class="system-brand">${NOBLE_CLINIC_BRAND.footer.system}</div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// =============================================================================
// CSS STYLES FOR NOBLE PDF TEMPLATES
// =============================================================================

export const NOBLE_PDF_STYLES = `
/* Common Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 10px;
}

.logo-small {
    text-align: right;
    font-size: 14px;
    font-weight: 300;
    color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
    line-height: 1.2;
}

.header-bar {
    background: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
    color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
    padding: 10px 20px;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight: 500;
}

/* Section Titles */
.section-title-teal {
    color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
    font-size: 12px;
    letter-spacing: 1px;
    margin: 20px 0 10px 20px;
    font-weight: 600;
}

.section-title-navy {
    color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
    font-size: 12px;
    letter-spacing: 1px;
    margin: 20px 0 10px 20px;
    font-weight: 600;
}

.subtitle {
    font-size: 10px;
    color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
    font-weight: 400;
}

/* Note Boxes */
.note-box {
    margin: 0 20px;
    padding: 15px;
    border: 1px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
    background: white;
}

.note-label {
    color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
}

/* Conditions Grid */
.conditions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 0 20px;
}

.condition-box {
    border: 1px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
    padding: 10px;
}

.condition-label {
    font-size: 11px;
    color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
    margin-bottom: 5px;
}

.condition-value {
    font-size: 12px;
    color: ${NOBLE_CLINIC_BRAND.colors.neutral};
}

.condition-value.highlighted {
    color: ${NOBLE_CLINIC_BRAND.colors.positive};
    background: ${NOBLE_CLINIC_BRAND.colors.tealLight}30;
    padding: 2px 6px;
    display: inline-block;
}

/* Value Colors */
.value-positive { color: ${NOBLE_CLINIC_BRAND.colors.positive}; }
.value-negative { color: ${NOBLE_CLINIC_BRAND.colors.negative}; }
.value-na { color: ${NOBLE_CLINIC_BRAND.colors.neutral}; }

/* Doctor Signature */
.doctor-signature {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
}

.signature-box {
    border: 1px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
    padding: 10px 20px;
    text-align: center;
}

.doctor-name {
    font-weight: 600;
    color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
    font-size: 12px;
}

.doctor-title {
    color: ${NOBLE_CLINIC_BRAND.colors.tealAccent};
    font-size: 10px;
}

.signature-image {
    height: 30px;
    margin: 5px 0;
}

/* Doctor Remarks */
.doctor-remarks {
    background: ${NOBLE_CLINIC_BRAND.colors.cardBg};
    margin: 20px;
    padding: 15px;
}

.remarks-header {
    color: ${NOBLE_CLINIC_BRAND.colors.navyBlue};
    font-size: 11px;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 15px;
}

.remarks-list {
    font-size: 12px;
    padding-left: 20px;
}

/* Clinical Indices */
.indices-table {
    margin: 20px;
    border: 1px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
}

.index-header {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 10px;
    background: white;
    font-size: 11px;
    color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
    text-align: center;
}

.index-values {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
}

.index-ranges {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 10px;
    text-align: center;
    font-size: 9px;
    color: ${NOBLE_CLINIC_BRAND.colors.textMuted};
}

/* Oral Status Table */
.oral-status-table {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px;
    padding: 15px;
    background: ${NOBLE_CLINIC_BRAND.colors.cardBg};
    border: 1px solid ${NOBLE_CLINIC_BRAND.colors.cardBorder};
}

.status-cell {
    text-align: center;
}

.status-label {
    font-size: 11px;
    color: ${NOBLE_CLINIC_BRAND.colors.textSecondary};
}

.status-value {
    font-size: 14px;
    font-weight: 500;
    margin: 5px 0;
}

.status-range {
    font-size: 9px;
    color: ${NOBLE_CLINIC_BRAND.colors.textMuted};
}
`;
