/**
 * Clinical Cockpit State Machine
 * 
 * Zustand store orchestrating the entire doctor workflow:
 * Patient → Intake → Examination → Investigation → Diagnosis → Treatment → Execution → Post-Op
 * 
 * Integrations:
 * - provisionalDiagnosisEngine (ICD-10 auto-diagnosis)
 * - AutomationEngine (procedure→billing+stock)
 * - POST_OP_PROTOCOLS (recovery protocols)
 * - ToothMapStateManager (SVG tooth → index auto-updates)
 * - classifyGVBlack, classifyKennedy, interpretPSR (indices)
 * - Complication Bot (post-op decision tree)
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { useBillingStore } from '@/lib/billing-store';
import { ToothState } from '@/types/clinical';

// ============================================================================
// PHASE & TYPE DEFINITIONS
// ============================================================================

export type CockpitPhase =
    | 'PATIENT_SELECT'    // Choose patient / view upcoming appointments
    | 'INTAKE'            // Personal + insurance + medical history + medications
    | 'EXAMINATION'       // Vitals + tooth grid + soft tissue + conditional modules
    | 'INVESTIGATION'     // X-rays, IOPA, intra-oral camera
    | 'DIAGNOSIS'         // Provisional → Final (AI-suggested)
    | 'TREATMENT_PLAN'    // Medical vs Surgical fork + procedure selection
    | 'EXECUTION'         // PAE, WARS, anesthesia, procedure template, notes
    | 'POST_OP';          // Post-op vitals, instructions, medications, billing

export type ManagementType = 'MEDICAL' | 'SURGICAL' | null;
export type AnesthesiaMode = 'LA' | 'GA' | null;

export interface PatientContext {
    id: string;
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email?: string;
    bloodGroup?: string;
    weight?: number;
    isRegistered: boolean;
    insuranceId?: string;
    insuranceProvider?: string;
}

export interface VitalsRecord {
    temperature?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    heartRate?: number;
    spo2?: number;
    respiratoryRate?: number;
    cns?: string;
    recordedAt: string;
    type: 'PRE_OP' | 'POST_OP' | 'ROUTINE';
}

export interface ChiefComplaint {
    id: string;
    label: string;
    value: string;
    toothNumbers?: number[];
}

export interface MedicationEntry {
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
    isActive: boolean;
    riskFlags: string[];  // Auto-populated: "bleeding_risk", "hypertension_risk", etc.
}

export interface MaternityData {
    isApplicable: boolean;
    isPregnant: boolean;
    pregnancyMonth?: number;
    trimester?: 1 | 2 | 3;
    lmpDate?: string;
    isNursing: boolean;
    deliveryDate?: string;
}

export interface PediatricMilestonesData {
    primary: Record<string, 'erupted' | 'missing' | 'unerupted'>;
    permanent: Record<string, 'erupted' | 'missing' | 'unerupted'>;
    habits: string[];
}

export interface DiagnosisEntry {
    diagnosis: string;
    icdCode: string;
    category: string;
    confidence: number;
    toothNumbers: number[];
    isProvisional: boolean;
    confirmedAt?: string;
}

export interface ProcedureEntry {
    id: string;
    code: string;
    name: string;
    category: string;
    toothNumbers: number[];
    managementType: ManagementType;
    anesthesiaMode: AnesthesiaMode;
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
    restorationMaterial?: string;
    smartNoteTemplate?: string;
    smartNoteEdited?: string;
    completedAt?: string;
}

export interface AnesthesiaLog {
    drugType: 'LIGNOCAINE_WITH_ADRENALINE' | 'LIGNOCAINE_WITHOUT_ADRENALINE' | 'OTHER';
    concentration: string;     // "2%", "4%"
    adrenalineRatio?: string;  // "1:80000", "1:200000"
    dosage: string;            // "1.8ml", "3.6ml"
    blockType: string;         // "IANB", "PSA", "MSA", etc.
    notes?: string;
}

export interface WarsScore {
    wintersClass: 'VERTICAL' | 'MESIOANGULAR' | 'DISTOANGULAR' | 'HORIZONTAL' | 'INVERTED' | 'TRANSVERSE';
    pellGregoryClass: 'I' | 'II' | 'III';
    pellGregoryPosition: 'A' | 'B' | 'C';
    ramusRelation: string;
    angulation: number;
    difficultyGrade: 'EASY' | 'MODERATE' | 'DIFFICULT';
}

export interface PaeChecklist {
    asaClass: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
    mallampatiScore: 1 | 2 | 3 | 4;
    fitnessStatus: 'FIT' | 'UNFIT' | 'CONDITIONAL';
    allergiesConfirmed: boolean;
    allergyDetails?: string;
    bloodWorkDone: boolean;
    notes?: string;
}

export interface ClinicalMedia {
    id: string;
    url: string;
    toothId?: number;
    type: 'XRAY' | 'IOPA' | 'INTRAORAL' | 'EXTRAORAL' | 'OTHER';
    source: 'USB' | 'MOBILE' | 'UPLOAD';
    capturedAt: string;
    notes?: string;
}

// ============================================================================
// RISK ENGINE - Drug Interaction Flags
// ============================================================================

export const DRUG_RISK_MAP: Record<string, { risks: string[]; alerts: string[] }> = {
    'aspirin': {
        risks: ['bleeding_risk'],
        alerts: ['⚠️ Risk of prolonged bleeding during extraction. Consider stopping 7 days before surgery.']
    },
    'warfarin': {
        risks: ['bleeding_risk', 'high_inr_risk'],
        alerts: ['🚨 HIGH RISK: Check INR before any surgical procedure. INR must be <3.0.']
    },
    'clopidogrel': {
        risks: ['bleeding_risk'],
        alerts: ['⚠️ Anti-platelet agent. Consult cardiologist before discontinuing.']
    },
    'metformin': {
        risks: ['lactic_acidosis_risk'],
        alerts: ['Check HbA1c. If >8%, defer elective procedures.']
    },
    'amlodipine': {
        risks: ['gingival_hyperplasia'],
        alerts: ['Patient may have drug-induced gingival hyperplasia. Check gingival status.']
    },
    'phenytoin': {
        risks: ['gingival_hyperplasia', 'altered_healing'],
        alerts: ['Drug-induced gingival hyperplasia common. May require gingivectomy.']
    },
    'bisphosphonates': {
        risks: ['onj_risk'],
        alerts: ['🚨 CRITICAL: Risk of Osteonecrosis of Jaw (ONJ). Avoid extractions if possible.']
    },
    'corticosteroids': {
        risks: ['delayed_healing', 'infection_risk', 'adrenal_crisis_risk'],
        alerts: ['⚠️ May need steroid cover for surgical procedures. Risk of delayed healing.']
    },
    'insulin': {
        risks: ['hypoglycemia_risk'],
        alerts: ['Schedule procedures after meals. Monitor blood sugar. Keep glucose available.']
    },
    'lisinopril': {
        risks: ['angioedema_risk'],
        alerts: ['ACE inhibitor — rare risk of angioedema. Monitor post-procedure.']
    },
    'denosumab': {
        risks: ['onj_risk'],
        alerts: ['🚨 CRITICAL: Anti-resorptive agent. High ONJ risk. Avoid invasive procedures.']
    },
};

/** Get risk flags for a medication name (case-insensitive fuzzy match) */
export function getDrugRisks(medication: string): { risks: string[]; alerts: string[] } | null {
    const key = Object.keys(DRUG_RISK_MAP).find(
        k => medication.toLowerCase().includes(k) || k.includes(medication.toLowerCase())
    );
    return key ? DRUG_RISK_MAP[key] : null;
}

// ============================================================================
// SMART NOTE TEMPLATES - Ready-made notes per procedure
// ============================================================================

export const SMART_NOTE_TEMPLATES: Record<string, string> = {
    'SIMPLE_EXTRACTION': 'Extraction performed under LA (2% Lignocaine with 1:80,000 Adrenaline). Tooth was mobile / indicated for extraction due to ___. Hemostasis was achieved. Sutures were [not] required. Patient was stable post-procedure. Post-operative instructions given.',
    'SURGICAL_EXTRACTION': 'Flap raised with Crevicular incision + Releasing incision. Bone guttering done with carbide bur / surgical handpiece under copious saline irrigation. Tooth elevation with Coupland / Warwick James elevator. Tooth delivered in [toto / sections]. Socket curetted, irrigated with saline + Betadine. Sutures placed (3-0 Silk / Vicryl). Hemostasis achieved. Patient stable.',
    'RCT_VISIT_1': 'Access opening done on tooth #___. Pulp chamber de-roofed. Biomechanical preparation initiated. Working length determined [radiographically / electronically]. Canals prepared using ___. Copious irrigation with NaOCl (2.5%) + Saline. Ca(OH)₂ dressing placed. Temporary restoration placed (Cavit / IRM).',
    'RCT_OBTURATION': 'Canals dried with paper points. Master cone fit verified [radiographically]. Obturation done with Gutta Percha + AH Plus sealer using lateral/vertical condensation technique. Post-obturation radiograph confirmed adequate fill. Temporary restoration placed.',
    'SCALING': 'Full mouth scaling and root planing performed using ultrasonic scaler (Satelec / EMS) + hand instruments (Gracey curettes). Moderate/Severe supra and sub-gingival calculus removed. Oral Hygiene Instructions (OHI) given. Recommended follow-up in [3/6 months].',
    'SCALING_ROOT_PLANING': 'Subgingival scaling and root planing performed in quadrant(s) ___. Pocket depths measured: ___mm. Calculus and infected cementum removed. Tetracycline / CHX irrigation done. Patient advised warm saline rinses. Review in 4-6 weeks.',
    'COMPOSITE_RESTORATION': 'Caries excavation done on tooth #___. Cavity preparation: Class ___. Etchant applied for 15 sec (enamel), rinsed & dried. Bonding agent applied, light cured. Composite resin (shade ___) placed in increments, each cured for 20 sec. Restoration finished and polished. Occlusion checked.',
    'AMALGAM_RESTORATION': 'Caries excavation done on tooth #___. Cavity preparation: Class ___. Cavity liner / base applied [Ca(OH)₂ / ZnOE]. Silver amalgam condensed, carved, and burnished. Occlusion checked. Patient advised not to bite on restoration for 24 hours.',
    'CROWN_PREPARATION': 'Tooth #___ prepared for full coverage restoration. Reduction: Occlusal 1.5-2mm, Axial 1-1.5mm. Finish line: Chamfer / Shoulder. Impression taken with PVS (putty + light body). Shade selected: ___. Temporary crown fabricated and cemented (TempBond).',
    'PERIODONTAL_SURGERY': 'Flap raised: Modified Widman / Kirkland. Full thickness mucoperiosteal flap. Deep calculus removal and root planing under direct vision. Osseous recontouring done. Bone graft placed [if applicable]. Membrane placed [if applicable]. Flap repositioned and sutured (3-0 Vicryl). Periodontal pack placed.',
    'IMPLANT_PLACEMENT': 'Site prepared: Flap raised, pilot drill at __rpm with copious irrigation. Sequential drilling to final diameter (___mm x ___mm). Implant (Brand: ___) placed at ___Ncm torque. Cover screw / Healing abutment placed. Flap closed with 4-0 Vicryl sutures. Post-op radiograph confirmed ideal position.',
    'ORTHODONTIC_BONDING': 'Teeth cleaned and pumiced. Etchant applied for 30 sec, rinsed. Bonding agent applied. Brackets (MBT / Roth, slot ___) bonded from ___ to ___. Initial archwire (0.014 NiTi / 0.016 NiTi) placed, ligated. Wax provided. Patient educated on oral hygiene + diet restrictions.',
    'DEEP_CARIES_MANAGEMENT': 'Tooth #___: Deep carious lesion approaching pulp. Stepwise / Indirect Pulp Capping performed. Partial caries removal done. Ca(OH)₂ liner applied over residual caries. GIC / IRM base placed. Temporary restoration. Patient advised recall in 6-8 weeks for reassessment.',
    'GIC_RESTORATION': 'Caries excavation done on tooth #___. Cavity conditioned with polyacrylic acid (10-20 sec). GIC (Type II / IX) mixed and placed. Contoured and coated with varnish / petroleum jelly. Patient advised soft diet for 24 hours.',
    'IOPA_EXPOSURE': 'Intraoral periapical radiograph taken of tooth #___. Bisecting angle / Paralleling technique used. Exposure settings: ___kV, ___mA, ___sec. Film/sensor positioned. Image reviewed: ___.',
};

// ============================================================================
// ANESTHESIA BLOCK TYPES
// ============================================================================

export const ANESTHESIA_BLOCKS = [
    { id: 'IANB', label: 'Inferior Alveolar Nerve Block (IANB)', region: 'Mandibular' },
    { id: 'PSA', label: 'Posterior Superior Alveolar (PSA)', region: 'Maxillary posterior' },
    { id: 'MSA', label: 'Middle Superior Alveolar (MSA)', region: 'Maxillary premolars' },
    { id: 'ASA', label: 'Anterior Superior Alveolar (ASA)', region: 'Maxillary anteriors' },
    { id: 'MENTAL', label: 'Mental / Incisive Block', region: 'Mandibular premolars/anteriors' },
    { id: 'INFRAORBITAL', label: 'Infraorbital Block', region: 'Maxillary anteriors/premolars' },
    { id: 'LONG_BUCCAL', label: 'Long Buccal Nerve Block', region: 'Mandibular molars buccal' },
    { id: 'NASOPALATINE', label: 'Nasopalatine Block', region: 'Maxillary anteriors palatal' },
    { id: 'GREATER_PALATINE', label: 'Greater Palatine Block', region: 'Maxillary posteriors palatal' },
    { id: 'GOW_GATES', label: 'Gow-Gates Technique', region: 'Full mandibular' },
    { id: 'VAZIRANI_AKINOSI', label: 'Vazirani-Akinosi Technique', region: 'Mandibular (closed mouth)' },
    { id: 'INFILTRATION', label: 'Local Infiltration', region: 'Localized area' },
];

// ============================================================================
// RESTORATION MATERIALS
// ============================================================================

export const RESTORATION_MATERIALS = [
    { id: 'COMPOSITE', label: 'Composite Resin', category: 'restorative' },
    { id: 'GIC', label: 'Glass Ionomer Cement (GIC)', category: 'restorative' },
    { id: 'SILVER_AMALGAM', label: 'Silver Amalgam', category: 'restorative' },
    { id: 'SANDWICH', label: 'Sandwich Technique (GIC + Composite)', category: 'restorative' },
    { id: 'GOLD', label: 'Gold Filling', category: 'restorative' },
    { id: 'DEEP_CARIES', label: 'Deep Caries Management (Stepwise)', category: 'restorative' },
    { id: 'ZIRCONIA', label: 'Zirconia Crown', category: 'prosthodontic' },
    { id: 'PFM', label: 'Porcelain Fused Metal (PFM)', category: 'prosthodontic' },
    { id: 'EMAX', label: 'E.max (Lithium Disilicate)', category: 'prosthodontic' },
    { id: 'METAL', label: 'Full Metal Crown', category: 'prosthodontic' },
    { id: 'TEMP_CROWN', label: 'Temporary Crown', category: 'prosthodontic' },
];

// ============================================================================
// SURGICAL PROCEDURES (Context-Smart)
// ============================================================================

export const SURGICAL_PROCEDURES = [
    { id: 'SIMPLE_EXTRACTION', label: 'Simple Extraction', requiresWARS: false, requiresPAE: true, defaultCost: 1500 },
    { id: 'SURGICAL_EXTRACTION', label: 'Surgical Extraction (Impacted)', requiresWARS: true, requiresPAE: true, defaultCost: 4500 },
    { id: 'RCT', label: 'Root Canal Treatment', requiresWARS: false, requiresPAE: false, defaultCost: 3500 },
    { id: 'SCALING', label: 'Scaling & Polishing', requiresWARS: false, requiresPAE: false, defaultCost: 1200 },
    { id: 'SCALING_ROOT_PLANING', label: 'Scaling & Root Planing (SRP)', requiresWARS: false, requiresPAE: false, defaultCost: 2500 },
    { id: 'PERIODONTAL_SURGERY', label: 'Periodontal Surgery', requiresWARS: false, requiresPAE: true, defaultCost: 8000 },
    { id: 'IMPLANT_PLACEMENT', label: 'Dental Implant', requiresWARS: false, requiresPAE: true, defaultCost: 25000 },
    { id: 'JAW_SURGERY', label: 'Jaw Surgery (Orthognathic)', requiresWARS: false, requiresPAE: true, defaultCost: 45000 },
    { id: 'COMPOSITE_RESTORATION', label: 'Composite Restoration', requiresWARS: false, requiresPAE: false, defaultCost: 1500 },
    { id: 'AMALGAM_RESTORATION', label: 'Amalgam Restoration', requiresWARS: false, requiresPAE: false, defaultCost: 1000 },
    { id: 'GIC_RESTORATION', label: 'GIC Restoration', requiresWARS: false, requiresPAE: false, defaultCost: 800 },
    { id: 'DEEP_CARIES_MANAGEMENT', label: 'Deep Caries Management', requiresWARS: false, requiresPAE: false, defaultCost: 1200 },
    { id: 'CROWN_PREPARATION', label: 'Crown Preparation', requiresWARS: false, requiresPAE: false, defaultCost: 3500 },
    { id: 'ORTHODONTIC_BONDING', label: 'Orthodontic Bracket Bonding', requiresWARS: false, requiresPAE: false, defaultCost: 15000 },
];

/** Get smart-suggested procedures based on diagnosis */
export function suggestProcedures(diagnosis: string): typeof SURGICAL_PROCEDURES {
    const lower = diagnosis.toLowerCase();
    if (lower.includes('irreversible pulpitis') || lower.includes('pulp necrosis'))
        return SURGICAL_PROCEDURES.filter(p => ['RCT', 'SIMPLE_EXTRACTION'].includes(p.id));
    if (lower.includes('impacted'))
        return SURGICAL_PROCEDURES.filter(p => ['SURGICAL_EXTRACTION', 'SIMPLE_EXTRACTION'].includes(p.id));
    if (lower.includes('pericoronitis'))
        return SURGICAL_PROCEDURES.filter(p => ['SIMPLE_EXTRACTION', 'SURGICAL_EXTRACTION', 'SCALING'].includes(p.id));
    if (lower.includes('periodontitis'))
        return SURGICAL_PROCEDURES.filter(p => ['SCALING', 'SCALING_ROOT_PLANING', 'PERIODONTAL_SURGERY'].includes(p.id));
    if (lower.includes('gingivitis'))
        return SURGICAL_PROCEDURES.filter(p => ['SCALING'].includes(p.id));
    if (lower.includes('caries') || lower.includes('cavity'))
        return SURGICAL_PROCEDURES.filter(p => ['COMPOSITE_RESTORATION', 'GIC_RESTORATION', 'AMALGAM_RESTORATION', 'DEEP_CARIES_MANAGEMENT', 'SIMPLE_EXTRACTION'].includes(p.id));
    if (lower.includes('fracture'))
        return SURGICAL_PROCEDURES.filter(p => ['COMPOSITE_RESTORATION', 'CROWN_PREPARATION', 'SIMPLE_EXTRACTION'].includes(p.id));
    if (lower.includes('abscess'))
        return SURGICAL_PROCEDURES.filter(p => ['RCT', 'SIMPLE_EXTRACTION'].includes(p.id));
    // Default: show all
    return SURGICAL_PROCEDURES;
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export interface CockpitState {
    // Current phase
    phase: CockpitPhase;

    // Patient context
    patient: PatientContext | null;
    visitId: string | null;

    // Phase data
    chiefComplaints: ChiefComplaint[];
    medications: MedicationEntry[];
    riskAlerts: string[];
    maternity: MaternityData;
    vitals: VitalsRecord[];
    media: ClinicalMedia[];
    diagnoses: DiagnosisEntry[];
    procedures: ProcedureEntry[];
    managementType: ManagementType;
    anesthesiaMode: AnesthesiaMode;
    anesthesiaLog: AnesthesiaLog | null;
    warsScore: WarsScore | null;
    paeChecklist: PaeChecklist | null;
    postOpVitals: VitalsRecord | null;
    postOpInstructions: string;
    prescriptions: MedicationEntry[];
    milestones: PediatricMilestonesData;
    toothState: Record<string, ToothState>;
    iopaCount: number;

    // Flags
    showMaternity: boolean;
    showMilestones: boolean;
    showWARS: boolean;
    showPAE: boolean;
    showOrthoAnalysis: boolean;
    consultationMarkedDone: boolean;

    // Clinical risk score  
    clinicalRiskScore: number;

    // Actions - Navigation
    setPhase: (phase: CockpitPhase) => void;
    nextPhase: () => void;
    prevPhase: () => void;

    // Actions - Patient
    selectPatient: (patient: PatientContext) => void;
    clearSession: () => void;

    // Actions - Clinical data
    addChiefComplaint: (complaint: ChiefComplaint) => void;
    removeChiefComplaint: (id: string) => void;
    setMedications: (meds: MedicationEntry[]) => void;
    addMedication: (med: MedicationEntry) => void;
    setMaternity: (data: Partial<MaternityData>) => void;
    addVitals: (vitals: VitalsRecord) => void;
    addMedia: (media: ClinicalMedia) => void;
    incrementIOPA: () => void;

    // Actions - Diagnosis
    addDiagnosis: (diagnosis: DiagnosisEntry) => void;
    confirmDiagnosis: (index: number) => void;

    // Actions - Treatment
    setManagementType: (type: ManagementType) => void;
    setAnesthesiaMode: (mode: AnesthesiaMode) => void;
    addProcedure: (proc: ProcedureEntry) => void;
    completeProcedure: (id: string) => void;
    setAnesthesiaLog: (log: AnesthesiaLog) => void;
    setWarsScore: (score: WarsScore) => void;
    setPaeChecklist: (pae: PaeChecklist) => void;
    markConsultationDone: () => void;

    // Actions - Post-Op
    setPostOpVitals: (vitals: VitalsRecord) => void;
    setPostOpInstructions: (instructions: string) => void;
    addPrescription: (med: MedicationEntry) => void;

    // Actions - Pediatric
    setMilestone: (dentition: 'primary' | 'permanent', tooth: string, status: 'erupted' | 'missing' | 'unerupted') => void;
    toggleHabit: (habit: string) => void;

    // Actions - Tooth Chart
    setToothState: (data: Record<string, ToothState>) => void;

    // Computed
    computeRiskScore: () => number;
}

const PHASE_ORDER: CockpitPhase[] = [
    'PATIENT_SELECT', 'INTAKE', 'EXAMINATION', 'INVESTIGATION',
    'DIAGNOSIS', 'TREATMENT_PLAN', 'EXECUTION', 'POST_OP'
];

export const useCockpitStore = create<CockpitState>((set, get) => ({
    // Initial state
    phase: 'PATIENT_SELECT',
    patient: null,
    visitId: null,
    chiefComplaints: [],
    medications: [],
    riskAlerts: [],
    maternity: { isApplicable: false, isPregnant: false, isNursing: false },
    milestones: { primary: {}, permanent: {}, habits: [] },
    toothState: {},
    vitals: [],
    media: [],
    diagnoses: [],
    procedures: [],
    managementType: null,
    anesthesiaMode: null,
    anesthesiaLog: null,
    warsScore: null,
    paeChecklist: null,
    postOpVitals: null,
    postOpInstructions: '',
    prescriptions: [],
    iopaCount: 0,
    showMaternity: false,
    showMilestones: false,
    showWARS: false,
    showPAE: false,
    showOrthoAnalysis: false,
    consultationMarkedDone: false,
    clinicalRiskScore: 0,

    // Navigation
    setPhase: (phase) => set({ phase }),
    nextPhase: () => {
        const currentIndex = PHASE_ORDER.indexOf(get().phase);
        if (currentIndex < PHASE_ORDER.length - 1) {
            set({ phase: PHASE_ORDER[currentIndex + 1] });
        }
    },
    prevPhase: () => {
        const currentIndex = PHASE_ORDER.indexOf(get().phase);
        if (currentIndex > 0) {
            set({ phase: PHASE_ORDER[currentIndex - 1] });
        }
    },

    // Patient
    selectPatient: (patient) => {
        const visitId = `visit_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const showMaternity = patient.gender === 'FEMALE';
        const showMilestones = patient.age < 20;

        set({
            patient,
            visitId,
            phase: 'INTAKE',
            showMaternity,
            showMilestones,
            // Reset all clinical data
            chiefComplaints: [],
            medications: [],
            riskAlerts: [],
            maternity: { isApplicable: false, isPregnant: false, isNursing: false },
            vitals: [],
            media: [],
            diagnoses: [],
            procedures: [],
            managementType: null,
            anesthesiaMode: null,
            anesthesiaLog: null,
            warsScore: null,
            paeChecklist: null,
            postOpVitals: null,
            postOpInstructions: '',
            prescriptions: [],
            milestones: { primary: {}, permanent: {}, habits: [] },
            toothState: {},
            iopaCount: 0,
            showWARS: false,
            showPAE: false,
            showOrthoAnalysis: false,
            consultationMarkedDone: false,
            clinicalRiskScore: 0,
        });
    },

    clearSession: () => set({
        phase: 'PATIENT_SELECT',
        patient: null,
        visitId: null,
        chiefComplaints: [],
        medications: [],
        riskAlerts: [],
        maternity: { isApplicable: false, isPregnant: false, isNursing: false },
        vitals: [],
        media: [],
        diagnoses: [],
        procedures: [],
        managementType: null,
        anesthesiaMode: null,
        anesthesiaLog: null,
        warsScore: null,
        paeChecklist: null,
        postOpVitals: null,
        postOpInstructions: '',
        prescriptions: [],
        milestones: { primary: {}, permanent: {}, habits: [] },
        toothState: {},
        iopaCount: 0,
        showMaternity: false,
        showMilestones: false,
        showWARS: false,
        showPAE: false,
        showOrthoAnalysis: false,
        consultationMarkedDone: false,
        clinicalRiskScore: 0,
    }),

    // Clinical data
    addChiefComplaint: (complaint) => set(s => ({
        chiefComplaints: [...s.chiefComplaints, complaint]
    })),
    removeChiefComplaint: (id) => set(s => ({
        chiefComplaints: s.chiefComplaints.filter(c => c.id !== id)
    })),

    setMedications: (meds) => {
        // Auto-compute risk alerts from medications
        const alerts: string[] = [];
        meds.forEach(med => {
            const risks = getDrugRisks(med.name);
            if (risks) {
                med.riskFlags = risks.risks;
                alerts.push(...risks.alerts);
            }
        });
        set({ medications: meds, riskAlerts: alerts });
    },

    addMedication: (med) => {
        const risks = getDrugRisks(med.name);
        if (risks) {
            med.riskFlags = risks.risks;
            set(s => ({
                medications: [...s.medications, med],
                riskAlerts: [...s.riskAlerts, ...risks.alerts],
            }));
        } else {
            set(s => ({ medications: [...s.medications, med] }));
        }
    },

    setMaternity: (data) => set(s => {
        const updated = { ...s.maternity, ...data };
        // Auto-calc trimester from pregnancy month
        if (updated.pregnancyMonth) {
            if (updated.pregnancyMonth <= 3) updated.trimester = 1;
            else if (updated.pregnancyMonth <= 6) updated.trimester = 2;
            else updated.trimester = 3;
        }
        return { maternity: updated };
    }),

    addVitals: (vitals) => set(s => ({ vitals: [...s.vitals, vitals] })),

    addMedia: (media) => set(s => ({ media: [...s.media, media] })),

    incrementIOPA: () => set(s => ({ iopaCount: s.iopaCount + 1 })),

    // Diagnosis
    addDiagnosis: (diagnosis) => set(s => ({
        diagnoses: [...s.diagnoses, diagnosis]
    })),
    confirmDiagnosis: (index) => set(s => ({
        diagnoses: s.diagnoses.map((d, i) =>
            i === index ? { ...d, isProvisional: false, confirmedAt: new Date().toISOString() } : d
        )
    })),

    // Treatment
    setManagementType: (type) => set({ managementType: type }),
    setAnesthesiaMode: (mode) => set({ anesthesiaMode: mode }),

    addProcedure: (proc) => {
        const matchedProc = SURGICAL_PROCEDURES.find(sp => sp.id === proc.code);
        set(s => ({
            procedures: [...s.procedures, proc],
            showWARS: matchedProc?.requiresWARS || s.showWARS,
            showPAE: matchedProc?.requiresPAE || s.showPAE,
            showOrthoAnalysis: proc.code === 'ORTHODONTIC_BONDING' || s.showOrthoAnalysis,
        }));
    },

    completeProcedure: (id) => {
        const state = get();
        const proc = state.procedures.find(p => p.id === id);
        if (!proc || proc.status === 'COMPLETED') return;

        // Auto-Billing Bridge
        const def = SURGICAL_PROCEDURES.find(d => d.id === proc.code) || SURGICAL_PROCEDURES[0];
        useBillingStore.getState().addItem({
            name: proc.name,
            baseCost: (def as any).defaultCost || 0, // Fallback if type issue
            quantity: 1,
            taxRate: 0,
            metadata: {
                source: 'auto_clinical',
                procedureId: proc.id,
                category: 'Clinical Procedure'
            }
        });

        set(state => ({
            procedures: state.procedures.map(p =>
                p.id === id ? { ...p, status: 'COMPLETED', completedAt: new Date().toISOString() } : p
            )
        }));
    },

    setAnesthesiaLog: (log) => set({ anesthesiaLog: log }),
    setWarsScore: (score) => set({ warsScore: score }),
    setPaeChecklist: (pae) => set({ paeChecklist: pae }),
    markConsultationDone: () => set({ consultationMarkedDone: true }),

    // Post-Op
    setPostOpVitals: (vitals) => set({ postOpVitals: vitals }),
    setPostOpInstructions: (instructions) => set({ postOpInstructions: instructions }),
    addPrescription: (med) => set(s => ({
        prescriptions: [...s.prescriptions, med]
    })),

    // Pediatric
    setMilestone: (dentition, tooth, status) => set(s => ({
        milestones: {
            ...s.milestones,
            [dentition]: { ...s.milestones[dentition], [tooth]: status }
        }
    })),
    toggleHabit: (habit) => set(s => {
        const habits = s.milestones.habits.includes(habit)
            ? s.milestones.habits.filter(h => h !== habit)
            : [...s.milestones.habits, habit];
        return { milestones: { ...s.milestones, habits } };
    }),

    // Tooth Chart
    setToothState: (data) => set({ toothState: data }),

    // Computed
    computeRiskScore: () => {
        const s = get();
        let score = 5; // Base score

        // Age factor
        if (s.patient) {
            if (s.patient.age > 65) score += 20;
            else if (s.patient.age > 50) score += 10;
            else if (s.patient.age < 12) score += 15;
        }

        // Medication risks
        const hasBleedingRisk = s.medications.some(m => m.riskFlags.includes('bleeding_risk'));
        const hasONJRisk = s.medications.some(m => m.riskFlags.includes('onj_risk'));
        if (hasBleedingRisk) score += 25;
        if (hasONJRisk) score += 30;

        // Maternity
        if (s.maternity.isPregnant) score += 20;

        // Vitals (latest)
        const latestVitals = s.vitals[s.vitals.length - 1];
        if (latestVitals) {
            if (latestVitals.bpSystolic && latestVitals.bpSystolic > 160) score += 20;
            else if (latestVitals.bpSystolic && latestVitals.bpSystolic > 140) score += 10;
            if (latestVitals.spo2 && latestVitals.spo2 < 95) score += 15;
            if (latestVitals.heartRate && latestVitals.heartRate > 100) score += 10;
        }

        // Surgical complexity
        if (s.showWARS) score += 15;
        if (s.anesthesiaMode === 'GA') score += 20;

        // ASA class
        if (s.paeChecklist) {
            const asaScores: Record<string, number> = { 'I': 0, 'II': 5, 'III': 15, 'IV': 30, 'V': 50 };
            score += asaScores[s.paeChecklist.asaClass] || 0;
        }

        const finalScore = Math.min(score, 100);
        set({ clinicalRiskScore: finalScore });
        return finalScore;
    },
}));
