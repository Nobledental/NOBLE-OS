/**
 * Phase 28: Noble-Standard PDF Export Engine
 * 
 * High-fidelity clinical report generation with Apple-quality design
 */

// =============================================================================
// TYPES - Clinical Data Structures
// =============================================================================

export interface PatientIdentity {
    uhid: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    email?: string;
    bloodGroup?: string;
    address?: string;
    lastUpdated: Date;
}

export interface VitalSigns {
    timestamp: Date;
    stage: 'PRE_ANESTHETIC' | 'INTRA_OP' | 'POST_OPERATIVE';
    bodyTemperature: { value: number; unit: '°C' | '°F' };
    spO2: number; // Percentage
    bloodPressure: { systolic: number; diastolic: number };
    heartRate: number; // BPM
    respiratoryRate?: number;
    notes?: string;
}

export interface MedicalHistory {
    knownAllergies: string[];
    drugAllergies: string[];
    isNKDA: boolean; // No Known Drug Allergies
    isNKFA: boolean; // No Known Food Allergies
    systemicConditions: Array<{
        condition: string;
        status: 'CONTROLLED' | 'UNCONTROLLED' | 'RESOLVED';
        medications?: string[];
        since?: Date;
    }>;
    surgicalHistory: string[];
    familyHistory: string[];
    habits: Array<{
        habit: string;
        frequency?: string;
        since?: string;
    }>;
}

export interface ClinicalIndices {
    healthScore: number; // 0-100 percentage
    tenderness: { percentage: number; teeth: string[] };
    sensitivity: { percentage: number; teeth: string[] };
    bleeding: { percentage: number; teeth: string[] };
    calculus: { percentage: number; teeth: string[] };
    plaque: { percentage: number; teeth: string[] };
    mobility: Array<{ tooth: string; grade: 0 | 1 | 2 | 3 }>;
    recession: Array<{ tooth: string; mm: number }>;
}

export interface RadiologyReport {
    id: string;
    type: 'OPG' | 'IOPA' | 'RVG' | 'CBCT' | 'CEPHALOGRAM' | 'BITEWING';
    teeth: string[];
    imageUrl: string;
    thumbnailUrl?: string;
    findings: string;
    capturedAt: Date;
    capturedBy: string;
    label?: string; // e.g., "RVG IOPA of 46"
}

export interface AnesthesiaLog {
    id: string;
    type: 'LOCAL' | 'TOPICAL' | 'SEDATION' | 'GENERAL';
    mode: 'INFILTRATION' | 'NERVE_BLOCK';
    nerveBlock?: 'IANB' | 'PSA' | 'MSA' | 'ASA' | 'BB' | 'GPNB' | 'INCISIVE' | 'MENTAL';
    side?: 'LEFT' | 'RIGHT' | 'BILATERAL';
    agent: string; // e.g., "Lidocaine 2% with Adrenaline 1:80000"
    dosage: string; // e.g., "2.5cc + 0.5cc"
    administeredAt: Date;
    administeredBy: string;
    topicalApplied: boolean;
    topicalAgent?: string;
    patchTest?: boolean;
    aspirationNegative: boolean;
    remarks?: string;
}

export interface TreatmentSitting {
    id: string;
    sittingNumber: number;
    date: Date;
    doctor: {
        id: string;
        name: string;
        qualification: string;
        signature?: string; // Base64 image
    };
    chiefComplaint: string;
    diagnosis: string[];
    proceduresPerformed: Array<{
        code: string;
        name: string;
        teeth: string[];
        details: string;
    }>;
    materialsUsed: string[];
    complications?: {
        description: string;
        riskNotified: boolean;
        action: string;
        remarks: string;
    };
    postOpInstructions: string[];
    prescriptions: Array<{
        drug: string;
        dosage: string;
        frequency: string;
        duration: string;
        specialInstructions?: string;
    }>;
    nextAppointment?: Date;
    vitals: VitalSigns[];
    anesthesia?: AnesthesiaLog;
    radiologyRefs: string[]; // IDs of radiology reports
    remarks?: string;
    discountApplied?: {
        amount: number;
        reason: string;
        approvedBy: string;
    };
}

export interface SmartReport {
    id: string;
    uhid: string;
    patient: PatientIdentity;
    medicalHistory: MedicalHistory;
    clinicalIndices: ClinicalIndices;
    radiology: RadiologyReport[];
    treatmentSittings: TreatmentSitting[];
    generatedAt: Date;
    generatedBy: string;
    documentHash: string;
    verificationCode: string;
    qrCodeData: string;
    status: 'DRAFT' | 'FINALIZED' | 'DISTRIBUTED';
}

export interface MedicalCertificate {
    id: string;
    patientId: string;
    patientName: string;
    uhid: string;
    type: 'FITNESS' | 'UNFITNESS' | 'MEDICAL_LEAVE' | 'PROCEDURE_DONE';
    procedureDate: Date;
    procedureDescription: string;
    restrictions: string[];
    duration: {
        from: Date;
        to: Date;
        hours?: number;
    };
    recommendations: string[];
    issuedBy: {
        name: string;
        qualification: string;
        registrationNo: string;
        signature: string;
    };
    issuedAt: Date;
    clinicDetails: {
        name: string;
        address: string;
        phone: string;
        logo: string;
    };
    verificationCode: string;
}

// =============================================================================
// NOBLE BRANDING CONSTANTS
// =============================================================================

export const NOBLE_BRAND = {
    colors: {
        primary: '#0D4F4F',      // Teal
        secondary: '#1E3A5F',    // Navy
        accent: '#14B8A6',       // Light Teal
        background: '#FAFAFA',
        cardBg: '#FFFFFF',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        gaugeTrack: '#E5E7EB',
        gaugeFill: '#14B8A6'
    },
    fonts: {
        heading: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        body: "'Inter', 'SF Pro Text', -apple-system, sans-serif",
        mono: "'SF Mono', 'Fira Code', monospace"
    },
    logo: {
        width: 120,
        height: 50,
        path: '/assets/noble-logo.svg'
    },
    watermark: 'HealthFlo Verified',
    system: 'HealthFlo Dental-OS',
    electronicDisclaimer: 'This is an Electronic Record - No Manual Signature Required',
    clinic: {
        name: 'Noble Dental Care',
        tagline: 'Excellence in Oral Healthcare',
        address: 'Hyderabad, Telangana, India',
        phone: '+91 XXXXX XXXXX',
        email: 'care@nobledental.in',
        website: 'www.nobledental.in'
    }
};

// =============================================================================
// HEALTH SCORE GAUGE SVG GENERATOR
// =============================================================================

export function generateHealthGaugeSVG(score: number, size: number = 120): string {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const dashOffset = circumference - progress;

    const color = score >= 80 ? NOBLE_BRAND.colors.success
        : score >= 60 ? NOBLE_BRAND.colors.warning
            : NOBLE_BRAND.colors.danger;

    const label = score >= 80 ? 'Healthy'
        : score >= 60 ? 'Moderate'
            : 'Needs Attention';

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle 
            cx="${size / 2}" cy="${size / 2}" r="${radius}"
            fill="none" 
            stroke="${NOBLE_BRAND.colors.gaugeTrack}" 
            stroke-width="8"
        />
        <circle 
            cx="${size / 2}" cy="${size / 2}" r="${radius}"
            fill="none" 
            stroke="${color}" 
            stroke-width="8"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${dashOffset}"
            transform="rotate(-90 ${size / 2} ${size / 2})"
        />
        <text 
            x="${size / 2}" y="${size / 2 - 5}" 
            text-anchor="middle" 
            font-family="${NOBLE_BRAND.fonts.heading}"
            font-size="24" 
            font-weight="700" 
            fill="${NOBLE_BRAND.colors.textPrimary}"
        >${score}%</text>
        <text 
            x="${size / 2}" y="${size / 2 + 15}" 
            text-anchor="middle" 
            font-family="${NOBLE_BRAND.fonts.body}"
            font-size="11" 
            fill="${NOBLE_BRAND.colors.textSecondary}"
        >${label}</text>
    </svg>
    `;
}

// =============================================================================
// INDEX BAR SVG GENERATOR
// =============================================================================

export function generateIndexBarSVG(
    label: string,
    percentage: number,
    teeth: string[],
    width: number = 200
): string {
    const height = 40;
    const barHeight = 8;
    const fillWidth = (percentage / 100) * (width - 40);

    const color = percentage <= 20 ? NOBLE_BRAND.colors.success
        : percentage <= 50 ? NOBLE_BRAND.colors.warning
            : NOBLE_BRAND.colors.danger;

    return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <text 
            x="0" y="12" 
            font-family="${NOBLE_BRAND.fonts.body}"
            font-size="11" 
            fill="${NOBLE_BRAND.colors.textPrimary}"
        >${label}</text>
        <text 
            x="${width}" y="12" 
            text-anchor="end"
            font-family="${NOBLE_BRAND.fonts.mono}"
            font-size="11" 
            font-weight="600"
            fill="${color}"
        >${percentage}%</text>
        <rect 
            x="0" y="20" 
            width="${width - 40}" height="${barHeight}" 
            rx="4" 
            fill="${NOBLE_BRAND.colors.gaugeTrack}"
        />
        <rect 
            x="0" y="20" 
            width="${fillWidth}" height="${barHeight}" 
            rx="4" 
            fill="${color}"
        />
        <text 
            x="0" y="38" 
            font-family="${NOBLE_BRAND.fonts.mono}"
            font-size="8" 
            fill="${NOBLE_BRAND.colors.textSecondary}"
        >${teeth.length > 0 ? teeth.join(', ') : 'N/A'}</text>
    </svg>
    `;
}

// =============================================================================
// VITALS TABLE GENERATOR
// =============================================================================

export function generateVitalsTableHTML(vitals: VitalSigns[]): string {
    const stageLabels = {
        PRE_ANESTHETIC: 'Pre-Anesthetic',
        INTRA_OP: 'Intra-Operative',
        POST_OPERATIVE: 'Post-Operative'
    };

    const rows = vitals.map(v => `
        <tr>
            <td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">
                ${stageLabels[v.stage]}
            </td>
            <td style="padding: 8px; border: 1px solid #E5E7EB; text-align: center;">
                ${v.bodyTemperature.value}${v.bodyTemperature.unit}
            </td>
            <td style="padding: 8px; border: 1px solid #E5E7EB; text-align: center;">
                ${v.spO2}%
            </td>
            <td style="padding: 8px; border: 1px solid #E5E7EB; text-align: center;">
                ${v.bloodPressure.systolic}/${v.bloodPressure.diastolic} mmHg
            </td>
            <td style="padding: 8px; border: 1px solid #E5E7EB; text-align: center;">
                ${v.heartRate} BPM
            </td>
        </tr>
    `).join('');

    return `
    <table style="width: 100%; border-collapse: collapse; font-family: ${NOBLE_BRAND.fonts.body}; font-size: 12px;">
        <thead>
            <tr style="background: ${NOBLE_BRAND.colors.primary}; color: white;">
                <th style="padding: 10px; text-align: left;">Stage</th>
                <th style="padding: 10px; text-align: center;">Temp</th>
                <th style="padding: 10px; text-align: center;">SpO2</th>
                <th style="padding: 10px; text-align: center;">BP</th>
                <th style="padding: 10px; text-align: center;">HR</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
    `;
}

// =============================================================================
// ANESTHESIA LOG GENERATOR
// =============================================================================

export function generateAnesthesiaLogHTML(log: AnesthesiaLog): string {
    const blockDisplay = log.nerveBlock
        ? `${log.nerveBlock}${log.side ? ` (${log.side})` : ''}`
        : 'N/A';

    return `
    <div style="background: #F0FDFA; border: 1px solid ${NOBLE_BRAND.colors.accent}; border-radius: 8px; padding: 16px; margin: 12px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="background: ${NOBLE_BRAND.colors.primary}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                ANESTHESIA LOG
            </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px;">
            <div>
                <span style="color: ${NOBLE_BRAND.colors.textSecondary};">Type:</span>
                <span style="font-weight: 600; margin-left: 4px;">${log.type}</span>
            </div>
            <div>
                <span style="color: ${NOBLE_BRAND.colors.textSecondary};">Mode:</span>
                <span style="font-weight: 600; margin-left: 4px;">${log.mode}</span>
            </div>
            <div>
                <span style="color: ${NOBLE_BRAND.colors.textSecondary};">Nerve Block:</span>
                <span style="font-weight: 600; margin-left: 4px;">${blockDisplay}</span>
            </div>
            <div>
                <span style="color: ${NOBLE_BRAND.colors.textSecondary};">Agent:</span>
                <span style="font-weight: 600; margin-left: 4px;">${log.agent}</span>
            </div>
            <div>
                <span style="color: ${NOBLE_BRAND.colors.textSecondary};">Dosage:</span>
                <span style="font-weight: 600; margin-left: 4px;">${log.dosage}</span>
            </div>
            <div>
                <span style="color: ${NOBLE_BRAND.colors.textSecondary};">Aspiration:</span>
                <span style="font-weight: 600; margin-left: 4px; color: ${log.aspirationNegative ? NOBLE_BRAND.colors.success : NOBLE_BRAND.colors.danger};">
                    ${log.aspirationNegative ? '✓ Negative' : '⚠ Positive'}
                </span>
            </div>
        </div>
        ${log.topicalApplied ? `
        <div style="margin-top: 8px; font-size: 11px; color: ${NOBLE_BRAND.colors.textSecondary};">
            Topical Applied: ${log.topicalAgent || 'Standard'}
            ${log.patchTest ? ' • Patch Test: Passed' : ''}
        </div>
        ` : ''}
    </div>
    `;
}

// =============================================================================
// QR CODE DATA GENERATOR
// =============================================================================

export function generateVerificationData(report: SmartReport): {
    verificationCode: string;
    qrData: string;
    documentHash: string;
} {
    // Generate verification code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let verificationCode = 'NDC-';
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) verificationCode += '-';
        verificationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Create document hash (simplified - would use crypto in production)
    const contentToHash = JSON.stringify({
        uhid: report.uhid,
        patientName: report.patient.name,
        generatedAt: report.generatedAt,
        sittingCount: report.treatmentSittings.length
    });
    const documentHash = Buffer.from(contentToHash).toString('base64').slice(0, 32);

    // QR code data
    const qrData = JSON.stringify({
        type: 'NOBLE_SMART_REPORT',
        code: verificationCode,
        uhid: report.uhid,
        date: report.generatedAt.toISOString(),
        hash: documentHash,
        verifyUrl: `https://nobledental.in/verify/${verificationCode}`
    });

    return { verificationCode, qrData, documentHash };
}

// =============================================================================
// PDF TEMPLATE SECTIONS
// =============================================================================

export const PDF_SECTIONS = {
    header: (patient: PatientIdentity, logoBase64?: string) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 2px solid ${NOBLE_BRAND.colors.primary};">
            <div style="display: flex; align-items: center; gap: 16px;">
                ${logoBase64 ? `<img src="${logoBase64}" height="50" alt="Noble Dental Care" />` : ''}
                <div>
                    <h1 style="margin: 0; font-size: 18px; color: ${NOBLE_BRAND.colors.primary}; font-family: ${NOBLE_BRAND.fonts.heading};">
                        ${NOBLE_BRAND.clinic.name}
                    </h1>
                    <p style="margin: 2px 0 0 0; font-size: 11px; color: ${NOBLE_BRAND.colors.textSecondary};">
                        ${NOBLE_BRAND.clinic.tagline}
                    </p>
                </div>
            </div>
            <div style="text-align: right; font-size: 11px; font-family: ${NOBLE_BRAND.fonts.body};">
                <div style="font-weight: 600; color: ${NOBLE_BRAND.colors.textPrimary};">${patient.name}</div>
                <div style="color: ${NOBLE_BRAND.colors.textSecondary};">${patient.age}Y / ${patient.gender}</div>
                <div style="font-family: ${NOBLE_BRAND.fonts.mono}; color: ${NOBLE_BRAND.colors.primary};">UHID: ${patient.uhid}</div>
            </div>
        </div>
    `,

    medicalHistory: (history: MedicalHistory) => `
        <div style="padding: 16px; background: #FEF3C7; border-radius: 8px; margin: 16px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 13px; color: ${NOBLE_BRAND.colors.textPrimary}; font-family: ${NOBLE_BRAND.fonts.heading};">
                Medical History
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 11px;">
                <div>
                    <strong>Allergies:</strong> 
                    ${history.isNKDA ? '<span style="color: #059669;">NKDA</span>' : history.drugAllergies.join(', ')}
                </div>
                <div>
                    <strong>Systemic:</strong> 
                    ${history.systemicConditions.length > 0
            ? history.systemicConditions.map(c => `${c.condition} (${c.status})`).join(', ')
            : 'None reported'
        }
                </div>
            </div>
        </div>
    `,

    clinicalPresentation: (indices: ClinicalIndices) => `
        <div style="display: flex; gap: 24px; padding: 16px; background: white; border: 1px solid #E5E7EB; border-radius: 12px; margin: 16px 0;">
            <div style="flex-shrink: 0;">
                ${generateHealthGaugeSVG(indices.healthScore)}
            </div>
            <div style="flex-grow: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                ${generateIndexBarSVG('Tenderness', indices.tenderness.percentage, indices.tenderness.teeth)}
                ${generateIndexBarSVG('Sensitivity', indices.sensitivity.percentage, indices.sensitivity.teeth)}
                ${generateIndexBarSVG('Bleeding', indices.bleeding.percentage, indices.bleeding.teeth)}
                ${generateIndexBarSVG('Calculus', indices.calculus.percentage, indices.calculus.teeth)}
            </div>
        </div>
    `,

    treatmentSitting: (sitting: TreatmentSitting, radiology: RadiologyReport[]) => `
        <div style="page-break-inside: avoid; border: 1px solid #E5E7EB; border-radius: 12px; margin: 16px 0; overflow: hidden;">
            <div style="background: ${NOBLE_BRAND.colors.secondary}; color: white; padding: 12px 16px; display: flex; justify-content: space-between;">
                <span style="font-weight: 600;">Sitting #${sitting.sittingNumber}</span>
                <span>${sitting.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div style="padding: 16px;">
                <div style="margin-bottom: 12px;">
                    <strong style="color: ${NOBLE_BRAND.colors.textSecondary}; font-size: 11px;">Chief Complaint:</strong>
                    <p style="margin: 4px 0 0 0; font-size: 13px;">${sitting.chiefComplaint}</p>
                </div>
                <div style="margin-bottom: 12px;">
                    <strong style="color: ${NOBLE_BRAND.colors.textSecondary}; font-size: 11px;">Diagnosis:</strong>
                    <p style="margin: 4px 0 0 0; font-size: 13px;">${sitting.diagnosis.join(', ')}</p>
                </div>
                <div style="margin-bottom: 12px;">
                    <strong style="color: ${NOBLE_BRAND.colors.textSecondary}; font-size: 11px;">Procedures:</strong>
                    ${sitting.proceduresPerformed.map(p => `
                        <div style="margin: 4px 0; padding: 8px; background: #F9FAFB; border-radius: 6px; font-size: 12px;">
                            <strong>${p.name}</strong> (${p.teeth.join(', ')})<br/>
                            <span style="color: ${NOBLE_BRAND.colors.textSecondary};">${p.details}</span>
                        </div>
                    `).join('')}
                </div>
                ${sitting.anesthesia ? generateAnesthesiaLogHTML(sitting.anesthesia) : ''}
                ${sitting.vitals.length > 0 ? generateVitalsTableHTML(sitting.vitals) : ''}
            </div>
            <div style="padding: 12px 16px; background: #F9FAFB; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; color: ${NOBLE_BRAND.colors.textSecondary};">
                    Dr. ${sitting.doctor.name}, ${sitting.doctor.qualification}
                </span>
                ${sitting.doctor.signature ? `<img src="${sitting.doctor.signature}" height="30" style="opacity: 0.8;" />` : ''}
            </div>
        </div>
    `,

    footer: (pageNumber: number, totalPages: number, verificationCode: string) => `
        <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; font-size: 9px; color: ${NOBLE_BRAND.colors.textSecondary}; border-top: 1px solid #E5E7EB; padding-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div>
                    <span style="opacity: 0.5;">HealthFlo Verified</span> • 
                    <span style="font-family: ${NOBLE_BRAND.fonts.mono};">${verificationCode}</span>
                </div>
                <div>
                    Page ${pageNumber} of ${totalPages}
                </div>
                <div>
                    ${NOBLE_BRAND.clinic.phone} • ${NOBLE_BRAND.clinic.website}
                </div>
            </div>
            <div style="text-align: center; padding-top: 8px; border-top: 1px dashed #E5E7EB;">
                <span style="font-size: 8px; color: #9CA3AF;">This is an Electronic Record - No Manual Signature Required</span>
                <span style="display: block; margin-top: 4px; font-weight: 600; color: ${NOBLE_BRAND.colors.primary};">HealthFlo Dental-OS</span>
            </div>
        </div>
    `,

    watermark: () => `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72px; color: rgba(0,0,0,0.03); font-weight: 700; pointer-events: none; white-space: nowrap;">
            ${NOBLE_BRAND.watermark}
        </div>
    `
};

// =============================================================================
// MEDICAL CERTIFICATE TEMPLATES
// =============================================================================

export const MEDICAL_CERTIFICATE_TEMPLATES = {
    unfitness: (cert: MedicalCertificate) => `
        <div style="width: 210mm; min-height: 297mm; padding: 30mm 25mm; font-family: ${NOBLE_BRAND.fonts.body}; position: relative;">
            ${PDF_SECTIONS.watermark()}
            
            <!-- Letterhead -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid ${NOBLE_BRAND.colors.primary}; padding-bottom: 20px;">
                <h1 style="color: ${NOBLE_BRAND.colors.primary}; margin: 0;">${cert.clinicDetails.name}</h1>
                <p style="margin: 5px 0; color: ${NOBLE_BRAND.colors.textSecondary}; font-size: 12px;">
                    ${cert.clinicDetails.address}
                </p>
                <p style="margin: 5px 0; color: ${NOBLE_BRAND.colors.textSecondary}; font-size: 12px;">
                    Tel: ${cert.clinicDetails.phone}
                </p>
            </div>

            <!-- Title -->
            <h2 style="text-align: center; color: ${NOBLE_BRAND.colors.secondary}; margin: 30px 0;">
                MEDICAL CERTIFICATE - TEMPORARY UNFITNESS
            </h2>

            <!-- Content -->
            <div style="font-size: 14px; line-height: 2;">
                <p>This is to certify that <strong>${cert.patientName}</strong> (UHID: ${cert.uhid}), 
                was treated at our facility on <strong>${cert.procedureDate.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    })}</strong>.</p>

                <p><strong>Procedure:</strong> ${cert.procedureDescription}</p>

                <p>Due to the nature of the procedure and administered medications, the patient is advised to 
                refrain from the following activities for <strong>${cert.duration.hours || 24} hours</strong>:</p>

                <ul style="margin: 20px 0;">
                    ${cert.restrictions.map(r => `<li>${r}</li>`).join('')}
                </ul>

                <p><strong>Recommendations:</strong></p>
                <ul>
                    ${cert.recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>

                <p>The patient is deemed <strong>unfit for work/duty</strong> from 
                ${cert.duration.from.toLocaleDateString('en-IN')} to ${cert.duration.to.toLocaleDateString('en-IN')}.</p>
            </div>

            <!-- Signature -->
            <div style="margin-top: 50px; display: flex; justify-content: flex-end;">
                <div style="text-align: center;">
                    ${cert.issuedBy.signature ? `<img src="${cert.issuedBy.signature}" height="50" />` : ''}
                    <div style="border-top: 1px solid #000; padding-top: 5px; margin-top: 5px;">
                        <strong>${cert.issuedBy.name}</strong><br/>
                        ${cert.issuedBy.qualification}<br/>
                        <span style="font-size: 11px; color: ${NOBLE_BRAND.colors.textSecondary};">
                            Reg. No: ${cert.issuedBy.registrationNo}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Verification -->
            <div style="position: absolute; bottom: 30mm; left: 25mm; right: 25mm; text-align: center; font-size: 10px; color: ${NOBLE_BRAND.colors.textSecondary}; border-top: 1px solid #E5E7EB; padding-top: 15px;">
                Verification Code: <strong style="font-family: ${NOBLE_BRAND.fonts.mono};">${cert.verificationCode}</strong><br/>
                Verify at: nobledental.in/verify
            </div>
        </div>
    `,

    postAnesthesiaRestrictions: [
        'Operating motor vehicles or heavy machinery',
        'Consuming alcohol or sedatives',
        'Making important legal or financial decisions',
        'Performing strenuous physical activities',
        'Using straws or creating suction (post-extraction)'
    ],

    postSurgicalRecommendations: [
        'Consume soft, cool diet for the first 24 hours',
        'Apply ice pack externally if swelling occurs',
        'Take prescribed medications as directed',
        'Contact clinic immediately if excessive bleeding occurs',
        'Avoid spitting or vigorous mouth rinsing'
    ]
};

// =============================================================================
// EXPORT SERVICE
// =============================================================================

export class PDFExportService {
    /**
     * Generate full Smart Report HTML (to be converted to PDF)
     */
    generateSmartReportHTML(report: SmartReport, logoBase64?: string): string {
        const verification = generateVerificationData(report);

        const sittingsHTML = report.treatmentSittings.map(sitting =>
            PDF_SECTIONS.treatmentSitting(sitting, report.radiology.filter(r =>
                sitting.radiologyRefs.includes(r.id)
            ))
        ).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page { 
                    size: A4; 
                    margin: 20mm; 
                }
                body { 
                    font-family: ${NOBLE_BRAND.fonts.body}; 
                    color: ${NOBLE_BRAND.colors.textPrimary};
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div style="position: relative;">
                ${PDF_SECTIONS.watermark()}
                ${PDF_SECTIONS.header(report.patient, logoBase64)}
                ${PDF_SECTIONS.medicalHistory(report.medicalHistory)}
                ${PDF_SECTIONS.clinicalPresentation(report.clinicalIndices)}
                
                <h2 style="color: ${NOBLE_BRAND.colors.secondary}; font-size: 16px; margin: 24px 0 12px 0;">
                    Treatment Progress Notes
                </h2>
                ${sittingsHTML}
                
                <!-- QR Verification -->
                <div style="text-align: center; margin-top: 40px; padding: 20px; background: #F9FAFB; border-radius: 12px;">
                    <p style="font-size: 11px; color: ${NOBLE_BRAND.colors.textSecondary}; margin: 0 0 10px 0;">
                        Scan to verify document authenticity
                    </p>
                    <!-- QR Code would be inserted here -->
                    <p style="font-family: ${NOBLE_BRAND.fonts.mono}; font-size: 13px; margin: 10px 0 0 0;">
                        ${verification.verificationCode}
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate Medical Certificate HTML
     */
    generateMedicalCertificateHTML(certificate: MedicalCertificate): string {
        return MEDICAL_CERTIFICATE_TEMPLATES.unfitness(certificate);
    }

    /**
     * Trigger automated distribution
     */
    async distributeReport(
        reportId: string,
        channels: ('PATIENT_APP' | 'EMAIL' | 'WHATSAPP' | 'REFERRAL_NETWORK')[]
    ): Promise<{ success: boolean; distributedTo: string[] }> {
        // This would connect to actual distribution services
        const distributedTo: string[] = [];

        for (const channel of channels) {
            // Simulate distribution
            console.log(`Distributing report ${reportId} via ${channel}`);
            distributedTo.push(channel);
        }

        return { success: true, distributedTo };
    }
}

export const pdfExportService = new PDFExportService();
