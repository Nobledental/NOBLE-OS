import { NOBLE_BRAND, NOBLE_PDF_STYLES } from './report-styles';

// ... existing code ...



// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface PatientIdentity {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    uhid: string;
    bloodGroup?: string;
}

export interface VitalSigns {
    bodyTemperature: string;  // "98.4F" or "Afebrile"
    spO2: string;             // "99" or "N@RA"
    bloodPressure: string;    // "127/74 mm Hg" or "-"
    heartRate: string;        // "76 bpm" or "-"
}

export interface PreAnestheticEvaluation {
    notes: string;
    result: 'No abnormalities noted.' | 'Abnormalities noted' | string;
}

export interface AnesthesiaNotes {
    typeOfAnesthesia: 'LA' | 'GA' | 'Sedation';
    modeOfAnesthesia: 'Local infiltration' | 'Nerve block' | 'Topical' | string;
    nerveBlock: string;       // "IANB and BB - Right"
    anestheticAgent: string;  // "Lignocaine with Adrenaline (1:80000)"
    givenDosage: string;      // "2.5cc + 0.5 cc"
    doctor: string;
}

export interface ProcedureDetails {
    areaOfProcedure: string;  // "Right Mandible posterior – 46 : RCT"
    toothNumbers: number[];
    procedureType: string;
}

export interface ClinicalPicture {
    toothNumber: number;
    imageUrl: string;
    caption?: string;
}

export interface RadiologyImage {
    type: 'RVG' | 'IOPA' | 'OPG' | 'CBCT' | 'LATERAL CEPH' | 'CT-PNS';
    toothNumber?: number;
    imageUrl: string;
    findings?: string;
}

export interface RadiologyReport {
    title: string;            // "RVG IOPA OF 46"
    images: RadiologyImage[];
    findings: string[];
}

export interface Diagnosis {
    items: string[];
}

export interface TreatmentPlan {
    items: string[];
}

export interface DoctorRemarks {
    items: string[];
}

export interface TreatmentSitting {
    sittingNumber: number;
    date: Date;
    chiefComplaint?: string[];
    vitals: VitalSigns;
    preAnestheticEvaluation?: PreAnestheticEvaluation;
    procedureDetails?: ProcedureDetails;
    anesthesiaNotes?: AnesthesiaNotes;
    procedureNotes: string[];
    postOperativeEvaluation?: VitalSigns;
    radiology?: RadiologyReport;
    clinicalPictures?: ClinicalPicture[];
    diagnosis?: Diagnosis;
    treatmentPlan?: TreatmentPlan;
    doctorRemarks?: DoctorRemarks;
    nextAppointment?: Date;
    discountNote?: string;
    doctorName: string;
    doctorSignature?: string;
    hasExternalLink?: boolean;
}

export interface ClinicalIndices {
    tenderness: { percentage: number; range: string };
    sensitivity: { percentage: number; range: string };
    bleeding: { percentage: number; range: string };
    calculusPlaque: { percentage: number; range: string };
    stains: { percentage: number; range: string };
}

export interface OralStatus {
    gingivalStatus: { value: string; range: string };
    lymphNodes: { value: string; range: string };
    salivaryStatus: { value: string; range: string };
}

export interface ClinicalPresentation {
    date: Date;
    healthScore: number;
    dentalArchAnnotations: Array<{
        text: string;
        position: 'left' | 'right';
        arch: 'maxilla' | 'mandible';
    }>;
    indices: ClinicalIndices;
    oralStatus: OralStatus;
}

export interface InvestigationItem {
    name: string;
    toDo?: string;
    referralDoctor?: string;
}

export interface InvestigationsAdvised {
    bloodInvestigations: InvestigationItem[];
    radiologicalInvestigations: InvestigationItem[];
    others: InvestigationItem[];
}

export interface MedicalHistory {
    allergicHistory: string;
    dentalHistory: string;
    medicalConditions: Record<string, string>;
    homeMedication: string;
    nursingMother: Record<string, string>;
    pregnancyStatus: string;
    bloodGroup: string;
    gpla: string;
    habitualHistory: Record<string, string>;
}

export interface SmartReport {
    patient: PatientIdentity;
    updatedOn: Date;
    medicalHistory: MedicalHistory;
    clinicalPresentation: ClinicalPresentation;
    investigationsAdvised?: InvestigationsAdvised;
    sittings: TreatmentSitting[];
    verificationCode?: string;
    qrCodeData?: string;
}

// =============================================================================
// HTML GENERATORS
// =============================================================================

/**
 * Generate the standard page header with Noble Clinic branding
 */
export function generatePageHeader(sectionLabel?: string): string {
    return `
    <div class="page-header">
        <div class="header-left">
            ${sectionLabel ? `<span class="section-label">${sectionLabel}</span>` : ''}
        </div>
        <div class="header-right">
            <div class="logo-text">
                <span class="logo-noble">NOBLE</span>
                <span class="logo-clinic">CLINIC</span>
            </div>
            <div class="logo-icon">
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <path d="M20 5 L30 15 L20 35 L10 15 Z" fill="${NOBLE_BRAND.colors.teal}" />
                    <ellipse cx="20" cy="18" rx="5" ry="7" fill="white" />
                </svg>
            </div>
        </div>
    </div>
    `;
}

/**
 * Generate navy section header bar
 */
export function generateSectionBar(title: string, rightText?: string): string {
    return `
    <div class="section-bar">
        <span class="section-bar-title">${title}</span>
        ${rightText ? `<span class="section-bar-right">${rightText}</span>` : ''}
    </div>
    `;
}

/**
 * Generate vitals table
 */
export function generateVitalsTable(vitals: VitalSigns, title?: string): string {
    return `
    <div class="vitals-section">
        ${title ? `<div class="vitals-title">${title}</div>` : ''}
        <table class="vitals-table">
            <tr>
                <td class="vitals-label">BODY TEMPERATURE</td>
                <td class="vitals-value">${vitals.bodyTemperature}</td>
            </tr>
            <tr>
                <td class="vitals-label">SpO2</td>
                <td class="vitals-value">${vitals.spO2}</td>
            </tr>
            <tr>
                <td class="vitals-label">BP</td>
                <td class="vitals-value">${vitals.bloodPressure}</td>
            </tr>
            <tr>
                <td class="vitals-label">HR</td>
                <td class="vitals-value">${vitals.heartRate}</td>
            </tr>
        </table>
    </div>
    `;
}

/**
 * Generate Pre-Anesthetic Evaluation box
 */
export function generatePreAnestheticEvaluation(evaluation: PreAnestheticEvaluation): string {
    const isNormal = evaluation.result.includes('No abnormalities');
    return `
    <div class="pre-anesthetic-box">
        <div class="pre-anesthetic-header">PRE ANESTHETIC EVALUATION:</div>
        <div class="pre-anesthetic-content">
            <p>${evaluation.notes}</p>
            <div class="pre-anesthetic-result ${isNormal ? 'result-normal' : 'result-abnormal'}">
                Result : ${evaluation.result}
            </div>
        </div>
    </div>
    `;
}

/**
 * Generate Anesthesia Notes box
 */
export function generateAnesthesiaNotes(notes: AnesthesiaNotes): string {
    return `
    <div class="anesthesia-box">
        <div class="anesthesia-header">ANESTHESIA NOTES:</div>
        <div class="anesthesia-content">
            <div class="anesthesia-grid">
                <div class="anesthesia-row">
                    <span class="anesthesia-label">Type of Anesthesia</span>
                    <span class="anesthesia-colon">:</span>
                    <span class="anesthesia-value">${notes.typeOfAnesthesia}</span>
                </div>
                <div class="anesthesia-row">
                    <span class="anesthesia-label">Mode of Anesthesia</span>
                    <span class="anesthesia-colon">:</span>
                    <span class="anesthesia-value">${notes.modeOfAnesthesia}</span>
                </div>
                <div class="anesthesia-row">
                    <span class="anesthesia-label">Nerve Block</span>
                    <span class="anesthesia-colon">:</span>
                    <span class="anesthesia-value">${notes.nerveBlock}</span>
                </div>
                <div class="anesthesia-row">
                    <span class="anesthesia-label">Anesthetic Agent</span>
                    <span class="anesthesia-colon">:</span>
                    <span class="anesthesia-value">${notes.anestheticAgent}</span>
                </div>
                <div class="anesthesia-row">
                    <span class="anesthesia-label">Given Dosage</span>
                    <span class="anesthesia-colon">:</span>
                    <span class="anesthesia-value">${notes.givenDosage}</span>
                </div>
            </div>
            <div class="anesthesia-doctor">
                DOCTOR: <span class="doctor-name">${notes.doctor}</span>
            </div>
        </div>
    </div>
    `;
}

/**
 * Generate Clinical Pictures section
 */
export function generateClinicalPictures(pictures: ClinicalPicture[]): string {
    return `
    <div class="clinical-pictures-section">
        <div class="clinical-pictures-header">CLINICAL PICTURE</div>
        <div class="clinical-pictures-grid">
            ${pictures.map(pic => `
                <div class="clinical-picture-item">
                    <div class="tooth-number">${pic.toothNumber}</div>
                    <img src="${pic.imageUrl}" alt="Tooth ${pic.toothNumber}" class="clinical-photo" />
                    ${pic.caption ? `<div class="picture-caption">${pic.caption}</div>` : ''}
                </div>
            `).join('')}
        </div>
    </div>
    `;
}

/**
 * Generate Radiology Report section
 */
export function generateRadiologyReport(report: RadiologyReport): string {
    return `
    <div class="radiology-section">
        <div class="radiology-header">
            <span class="radiology-title">RADIOLOGY REPORT:</span>
            <span class="radiology-type">${report.title}</span>
        </div>
        <div class="radiology-images">
            ${report.images.map(img => `
                <div class="radiology-image-container">
                    <img src="${img.imageUrl}" alt="${img.type}" class="radiology-image" />
                </div>
            `).join('')}
        </div>
        ${report.findings.length > 0 ? `
        <div class="radiology-findings">
            <div class="findings-label">Radiology Report :</div>
            <ul class="findings-list">
                ${report.findings.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    `;
}

/**
 * Generate Investigations Advised section
 */
export function generateInvestigationsAdvised(investigations: InvestigationsAdvised): string {
    const renderTable = (title: string, items: InvestigationItem[]) => `
        <table class="investigations-table">
            <thead>
                <tr class="investigations-header">
                    <th>${title}</th>
                    <th>TO-DO</th>
                    <th>REFERRAL DOCTOR</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td class="investigation-name">${item.name}</td>
                        <td class="investigation-todo">${item.toDo || ''}</td>
                        <td class="investigation-referral">${item.referralDoctor || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    return `
    <div class="investigations-page">
        ${generatePageHeader()}
        <h2 class="page-title">INVESTIGATIONS ADVISED</h2>
        
        ${renderTable('BLOOD INVESTIGATION', investigations.bloodInvestigations)}
        ${renderTable('RADIOLOGICAL INVESTIGATION', investigations.radiologicalInvestigations)}
        ${renderTable('OTHERS', investigations.others)}
    </div>
    `;
}

/**
 * Generate Clinical Presentation page
 */
export function generateClinicalPresentation(presentation: ClinicalPresentation): string {
    const getIndexColor = (percentage: number) => {
        if (percentage <= 20) return NOBLE_BRAND.colors.positive;
        if (percentage <= 50) return NOBLE_BRAND.colors.warning;
        return NOBLE_BRAND.colors.danger;
    };

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return `
    <div class="clinical-presentation-page">
        ${generatePageHeader('ALLERGIC HISTORY')}
        ${generateSectionBar('CLINICAL PRESENTATION', formatDate(presentation.date))}
        
        <!-- Dental Arch Diagram -->
        <div class="dental-arch-container">
            <div class="arch-side-labels">
                <span class="arch-label-left">R</span>
                <span class="arch-label-right">L</span>
            </div>
            <div class="dental-arch-diagram">
                <!-- Placeholder for dental arch SVG -->
                <div class="arch-maxilla">
                    <div class="arch-label">MAXILLA</div>
                </div>
                <div class="arch-mandible">
                    <div class="arch-label">MANDIBLE</div>
                </div>
                <!-- Annotations -->
                ${presentation.dentalArchAnnotations.map(ann => `
                    <div class="arch-annotation arch-annotation-${ann.position} arch-annotation-${ann.arch}">
                        <span class="annotation-text">${ann.text}</span>
                        <span class="annotation-arrow">${ann.position === 'left' ? '→' : '←'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Health Score Gauge -->
        <div class="health-gauge">
            <div class="gauge-circle">
                <span class="gauge-value">${presentation.healthScore}%</span>
            </div>
        </div>
        
        <!-- Clinical Indices Table -->
        <div class="indices-table">
            <div class="indices-row indices-header-row">
                <span>Tenderness</span>
                <span>Sensitivity</span>
                <span>Bleeding</span>
                <span>Calculus / Plaque</span>
                <span>Stains</span>
            </div>
            <div class="indices-row indices-values-row">
                <span style="color: ${getIndexColor(presentation.indices.tenderness.percentage)}">
                    ${presentation.indices.tenderness.percentage} %
                </span>
                <span style="color: ${getIndexColor(presentation.indices.sensitivity.percentage)}">
                    ${presentation.indices.sensitivity.percentage} %
                </span>
                <span style="color: ${getIndexColor(presentation.indices.bleeding.percentage)}">
                    ${presentation.indices.bleeding.percentage} %
                </span>
                <span style="color: ${getIndexColor(presentation.indices.calculusPlaque.percentage)}">
                    ${presentation.indices.calculusPlaque.percentage} %
                </span>
                <span style="color: ${getIndexColor(presentation.indices.stains.percentage)}">
                    ${presentation.indices.stains.percentage} %
                </span>
            </div>
            <div class="indices-row indices-range-row">
                <span>Range: ${presentation.indices.tenderness.range}</span>
                <span>Range: ${presentation.indices.sensitivity.range}</span>
                <span>Range: ${presentation.indices.bleeding.range}</span>
                <span>Range: ${presentation.indices.calculusPlaque.range}</span>
                <span>Range: ${presentation.indices.stains.range}</span>
            </div>
        </div>
        
        <!-- Oral Status -->
        <div class="oral-status-table">
            <div class="oral-status-cell">
                <div class="status-label">Gingival status</div>
                <div class="status-value" style="color: ${NOBLE_BRAND.colors.positive}">
                    ${presentation.oralStatus.gingivalStatus.value}
                </div>
                <div class="status-range">Range: ${presentation.oralStatus.gingivalStatus.range}</div>
            </div>
            <div class="oral-status-cell">
                <div class="status-label">Lymph Nodes</div>
                <div class="status-value" style="color: ${NOBLE_BRAND.colors.positive}">
                    ${presentation.oralStatus.lymphNodes.value}
                </div>
                <div class="status-range">Range: ${presentation.oralStatus.lymphNodes.range}</div>
            </div>
            <div class="oral-status-cell">
                <div class="status-label">Salivary status</div>
                <div class="status-value" style="color: ${NOBLE_BRAND.colors.positive}">
                    ${presentation.oralStatus.salivaryStatus.value}
                </div>
                <div class="status-range">Range: ${presentation.oralStatus.salivaryStatus.range}</div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Generate a single Treatment Sitting
 */
export function generateTreatmentSitting(sitting: TreatmentSitting): string {
    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return `
    <div class="treatment-sitting">
        <!-- Sitting Header -->
        <div class="sitting-header">
            <span class="sitting-number">${sitting.sittingNumber}. ${formatDate(sitting.date)}.</span>
            ${sitting.hasExternalLink ? '<span class="external-link-icon">↗</span>' : ''}
        </div>
        
        <!-- Chief Complaint -->
        ${sitting.chiefComplaint ? `
        <ul class="chief-complaint-list">
            ${sitting.chiefComplaint.map(c => `<li>${c}</li>`).join('')}
        </ul>
        ` : ''}
        
        <!-- Vitals -->
        ${generateVitalsTable(sitting.vitals, 'Vitals')}
        
        <!-- Pre-Anesthetic Evaluation -->
        ${sitting.preAnestheticEvaluation ? generatePreAnestheticEvaluation(sitting.preAnestheticEvaluation) : ''}
        
        <!-- Procedure Details -->
        ${sitting.procedureDetails ? `
        <div class="procedure-details">
            <div class="procedure-label">PROCEDURE DETAILS:</div>
            <p>Area of Procedure : ${sitting.procedureDetails.areaOfProcedure}</p>
        </div>
        ` : ''}
        
        <!-- Anesthesia Notes -->
        ${sitting.anesthesiaNotes ? generateAnesthesiaNotes(sitting.anesthesiaNotes) : ''}
        
        <!-- Procedure Notes -->
        <div class="procedure-notes">
            <div class="procedure-notes-label">PROCEDURE NOTES:</div>
            <div class="procedure-notes-content">
                ${sitting.procedureNotes.map(note => `<p>${note}</p>`).join('')}
            </div>
        </div>
        
        <!-- Post-Operative Evaluation -->
        ${sitting.postOperativeEvaluation ? `
        <div class="post-op-section">
            <div class="post-op-header">POST-OPERATIVE EVALUATION</div>
            ${generateVitalsTable(sitting.postOperativeEvaluation)}
        </div>
        ` : ''}
        
        <!-- Radiology Report -->
        ${sitting.radiology ? generateRadiologyReport(sitting.radiology) : ''}
        
        <!-- Clinical Pictures -->
        ${sitting.clinicalPictures ? generateClinicalPictures(sitting.clinicalPictures) : ''}
        
        <!-- Diagnosis -->
        ${sitting.diagnosis ? `
        <div class="diagnosis-section">
            <div class="diagnosis-label">DIAGNOSIS:</div>
            <ul class="diagnosis-list">
                ${sitting.diagnosis.items.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <!-- Treatment Plan -->
        ${sitting.treatmentPlan ? `
        <div class="treatment-plan-section">
            <div class="treatment-plan-label">TREATMENT PLAN:</div>
            <ul class="treatment-plan-list">
                ${sitting.treatmentPlan.items.map(t => `<li>${t}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <!-- Doctor Remarks -->
        ${sitting.doctorRemarks ? `
        <div class="doctor-remarks">
            <div class="remarks-header">DOCTOR REMARKS:</div>
            <ul class="remarks-list">
                ${sitting.doctorRemarks.items.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <!-- Next Appointment -->
        ${sitting.nextAppointment ? `
        <p class="next-appointment">
            Medications prescribed. – Next appointment on 
            <strong>${formatDate(sitting.nextAppointment)}</strong>.
        </p>
        ` : ''}
        
        <!-- Discount Note -->
        ${sitting.discountNote ? `
        <p class="discount-note">${sitting.discountNote}</p>
        ` : ''}
        
        <!-- Doctor Signature -->
        <div class="doctor-signature">
            <div class="signature-box">
                <span class="doctor-name">${sitting.doctorName}</span>
                ${sitting.doctorSignature ?
            `<img src="${sitting.doctorSignature}" class="signature-image" alt="Signature" />` :
            ''
        }
                <span class="doctor-title">DOCTOR</span>
            </div>
        </div>
    </div>
    `;
}

/**
 * Generate the End of Smart Report marker
 */
export function generateEndOfReport(): string {
    return `
    <div class="end-of-report">
        <span class="end-marker">${NOBLE_BRAND.footer.endOfReport}</span>
    </div>
    `;
}

/**
 * Generate the electronic footer
 */
export function generateElectronicFooter(verificationCode?: string, qrCodeUrl?: string): string {
    return `
    <div class="electronic-footer">
        <div class="footer-disclaimer">
            ${NOBLE_BRAND.footer.disclaimer}
        </div>
        <div class="footer-system">
            ${NOBLE_BRAND.footer.system}
        </div>
        ${verificationCode ? `
        <div class="footer-verification">
            <span class="verification-label">Verification Code:</span>
            <span class="verification-code">${verificationCode}</span>
        </div>
        ` : ''}
        ${qrCodeUrl ? `
        <div class="footer-qr">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
        </div>
        ` : ''}
    </div>
    `;
}

// =============================================================================
// COMPLETE SMART REPORT GENERATOR
// =============================================================================

export function generateCompleteSmartReport(report: SmartReport): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Smart Report - ${report.patient.name} - ${report.patient.uhid}</title>
        <style>
            ${NOBLE_PDF_STYLES}
        </style>
    </head>
    <body>
        <!-- Cover Page -->
        <div class="page cover-page">
            <div class="cover-header">
                <h1 class="clinic-name">${NOBLE_BRAND.clinic.name}</h1>
                <p class="clinic-tagline">${NOBLE_BRAND.clinic.tagline}</p>
            </div>
            <div class="facility-bar">${NOBLE_BRAND.clinic.facility}</div>
            <div class="address-bar">${NOBLE_BRAND.clinic.address}</div>
            <div class="logo-container">
                <div class="logo-placeholder"></div>
            </div>
            <div class="patient-info-bar">
                <div class="info-row">
                    <span class="info-label">NAME</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${report.patient.name.toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">AGE & GENDER</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${report.patient.gender} / ${report.patient.age} Yrs</span>
                </div>
                <div class="info-row">
                    <span class="info-label">UHID</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${report.patient.uhid}</span>
                </div>
            </div>
            <div class="cover-footer">
                <div class="phone-section">
                    <div class="phone-icon">📞</div>
                    <div>
                        <div class="phone-text">FOR MORE INFORMATION</div>
                        <div class="phone-number">${NOBLE_BRAND.clinic.phone}</div>
                    </div>
                </div>
                <div class="update-section">
                    <div class="update-label">Updated On</div>
                    <div class="update-date">${report.updatedOn.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</div>
                </div>
            </div>
        </div>
        
        <!-- Clinical Presentation Page -->
        <div class="page">
            ${generateClinicalPresentation(report.clinicalPresentation)}
        </div>
        
        <!-- Investigations Advised (if present) -->
        ${report.investigationsAdvised ? `
        <div class="page">
            ${generateInvestigationsAdvised(report.investigationsAdvised)}
        </div>
        ` : ''}
        
        <!-- Treatment Sittings -->
        ${report.sittings.map((sitting, index) => `
        <div class="page">
            ${generatePageHeader()}
            ${generateSectionBar('TREATMENT / PROGRESS NOTES.')}
            ${generateTreatmentSitting(sitting)}
            ${index === report.sittings.length - 1 ? generateEndOfReport() : ''}
        </div>
        `).join('')}
        
        <!-- Electronic Footer on last page -->
        ${generateElectronicFooter(report.verificationCode, report.qrCodeData)}
    </body>
    </html>
    `;
}

// Styles moved to report-styles.ts

