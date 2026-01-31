/**
 * Phase 16: Automated Clinical Indexing & Classification Engine
 * Pure function types and classification logic
 */

// =============================================================================
// G.V. BLACK CLASSIFICATION
// =============================================================================

export type GVBlackClass = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
export type ToothSurface = 'Occlusal' | 'Mesial' | 'Distal' | 'Buccal' | 'Lingual' | 'Incisal' | 'Cervical';

export interface GVBlackResult {
    classification: GVBlackClass;
    description: string;
    suggestedTreatment: string;
}

/**
 * Pure function: Determine G.V. Black classification from affected surfaces
 */
export function classifyGVBlack(
    toothNumber: number,
    surfaces: ToothSurface[],
    hasPulpInvolvement: boolean = false
): GVBlackResult {
    const isAnterior = [11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43].includes(toothNumber);
    const isPremolar = [14, 15, 24, 25, 34, 35, 44, 45].includes(toothNumber);
    const isMolar = [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48].includes(toothNumber);

    const hasOcclusal = surfaces.includes('Occlusal');
    const hasProximal = surfaces.includes('Mesial') || surfaces.includes('Distal');
    const hasIncisal = surfaces.includes('Incisal');
    const hasCervical = surfaces.includes('Cervical') || surfaces.includes('Buccal') || surfaces.includes('Lingual');

    // Class VI: Incisal edge or cusp tip wear/caries
    if (hasIncisal && !hasProximal && isAnterior) {
        return {
            classification: 'VI',
            description: 'Pit/fissure or incisal edge caries',
            suggestedTreatment: 'Composite restoration, consider night guard if attrition'
        };
    }

    // Class V: Cervical/gingival third (any tooth)
    if (hasCervical && !hasOcclusal && !hasProximal) {
        return {
            classification: 'V',
            description: 'Gingival third caries (cervical)',
            suggestedTreatment: 'GIC or Composite restoration, check for abfraction'
        };
    }

    // Class IV: Proximal + Incisal angle (anterior)
    if (isAnterior && hasProximal && hasIncisal) {
        return {
            classification: 'IV',
            description: 'Proximal caries involving incisal angle',
            suggestedTreatment: hasPulpInvolvement
                ? 'RCT + Post & Core + Crown'
                : 'Composite build-up or Veneer'
        };
    }

    // Class III: Proximal only (anterior)
    if (isAnterior && hasProximal && !hasIncisal) {
        return {
            classification: 'III',
            description: 'Proximal caries (anterior) without incisal involvement',
            suggestedTreatment: 'Composite restoration (shade match critical)'
        };
    }

    // Class II: Proximal + Occlusal (posterior)
    if ((isMolar || isPremolar) && hasProximal) {
        return {
            classification: 'II',
            description: 'Proximal caries (posterior) ± occlusal extension',
            suggestedTreatment: hasOcclusal
                ? 'MOD Composite/Amalgam, consider onlay if extensive'
                : 'MO/DO Composite/Amalgam'
        };
    }

    // Class I: Occlusal/pit-fissure only (posterior) or lingual pit (anterior)
    if (hasOcclusal || (isAnterior && surfaces.includes('Lingual'))) {
        return {
            classification: 'I',
            description: 'Pit and fissure caries',
            suggestedTreatment: 'Composite or Amalgam restoration'
        };
    }

    // Default
    return {
        classification: 'I',
        description: 'Unclassified caries',
        suggestedTreatment: 'Clinical evaluation required'
    };
}

// =============================================================================
// KENNEDY CLASSIFICATION (Partial Edentulism)
// =============================================================================

export type KennedyClass = 'I' | 'II' | 'III' | 'IV';
export type ApplegateModification = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface KennedyResult {
    classification: KennedyClass;
    modification?: number;
    applegateRules: string[];
    suggestedTreatment: string;
}

/**
 * Pure function: Classify Kennedy based on missing teeth array
 * Tooth numbers in FDI notation
 */
export function classifyKennedy(
    missingTeeth: number[],
    arch: 'maxilla' | 'mandible'
): KennedyResult {
    // Filter to relevant arch
    const upperTeeth = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28];
    const lowerTeeth = [31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48];

    const archTeeth = arch === 'maxilla' ? upperTeeth : lowerTeeth;
    const missing = missingTeeth.filter(t => archTeeth.includes(t));

    if (missing.length === 0) {
        return {
            classification: 'I',
            applegateRules: [],
            suggestedTreatment: 'No partial denture needed'
        };
    }

    // Check for bilateral posterior edentulous
    const posteriorMissing = {
        left: missing.filter(t => [26, 27, 28, 36, 37, 38].includes(t)).length > 0,
        right: missing.filter(t => [16, 17, 18, 46, 47, 48].includes(t)).length > 0
    };

    // Check for unilateral posterior
    const hasAnteriorMissing = missing.some(t =>
        [11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43].includes(t)
    );

    // Kennedy Class I: Bilateral posterior edentulous areas
    if (posteriorMissing.left && posteriorMissing.right && !hasAnteriorMissing) {
        const modificationCount = countBoundedSpaces(missing, archTeeth);
        return {
            classification: 'I',
            modification: modificationCount > 0 ? modificationCount : undefined,
            applegateRules: ['Rule 1: Classification follows extraction planning'],
            suggestedTreatment: 'RPD with bilateral free-end saddles OR Implant-supported prosthesis'
        };
    }

    // Kennedy Class II: Unilateral posterior edentulous
    if ((posteriorMissing.left || posteriorMissing.right) && !(posteriorMissing.left && posteriorMissing.right)) {
        return {
            classification: 'II',
            applegateRules: ['Rule 2: If 3rd molar is missing and not replaced, exclude from classification'],
            suggestedTreatment: 'RPD with unilateral free-end saddle OR Posterior implants'
        };
    }

    // Kennedy Class IV: Anterior crossing midline
    if (hasAnteriorMissing && crossesMidline(missing)) {
        return {
            classification: 'IV',
            applegateRules: ['Rule 4: Class IV has no modifications'],
            suggestedTreatment: 'RPD with anterior replacement OR Implant bridge'
        };
    }

    // Kennedy Class III: Bounded edentulous space
    return {
        classification: 'III',
        modification: countBoundedSpaces(missing, archTeeth),
        applegateRules: ['Rule 3: If posterior abutment missing, reclassify'],
        suggestedTreatment: 'Fixed partial denture (Bridge) OR Implant(s)'
    };
}

function countBoundedSpaces(missing: number[], archTeeth: number[]): number {
    let spaces = 0;
    let inSpace = false;

    for (const tooth of archTeeth) {
        if (missing.includes(tooth)) {
            if (!inSpace) {
                spaces++;
                inSpace = true;
            }
        } else {
            inSpace = false;
        }
    }

    return Math.max(0, spaces - 1); // Primary space doesn't count as modification
}

function crossesMidline(missing: number[]): boolean {
    const leftAnterior = missing.some(t => [21, 22, 23, 31, 32, 33].includes(t));
    const rightAnterior = missing.some(t => [11, 12, 13, 41, 42, 43].includes(t));
    return leftAnterior && rightAnterior;
}

// =============================================================================
// ELLIS FRACTURE CLASSIFICATION
// =============================================================================

export type EllisClass = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX';

export interface EllisFractureResult {
    classification: EllisClass;
    description: string;
    urgency: 'routine' | 'urgent' | 'emergency';
    suggestedTreatment: string;
}

/**
 * Pure function: Classify Ellis fracture
 */
export function classifyEllisFracture(
    involvesEnamel: boolean,
    involvesDentin: boolean,
    involvesPulp: boolean,
    isRootFracture: boolean,
    isAvulsed: boolean,
    isLuxated: boolean,
    luxationType?: 'intrusive' | 'extrusive' | 'lateral'
): EllisFractureResult {
    // Class IX: Avulsion
    if (isAvulsed) {
        return {
            classification: 'IX',
            description: 'Complete avulsion (tooth knocked out)',
            urgency: 'emergency',
            suggestedTreatment: 'Immediate replantation (within 30 min ideal), splint 7-14 days, RCT'
        };
    }

    // Class VIII: Crown fracture with root fracture
    if (isRootFracture && (involvesEnamel || involvesDentin)) {
        return {
            classification: 'VIII',
            description: 'Crown fracture + root fracture',
            urgency: 'emergency',
            suggestedTreatment: 'Splinting, possible extraction if apical third'
        };
    }

    // Class VII: Root fracture without crown involvement
    if (isRootFracture) {
        return {
            classification: 'VII',
            description: 'Root fracture only',
            urgency: 'urgent',
            suggestedTreatment: 'Splint 4-12 weeks, monitor vitality'
        };
    }

    // Luxation injuries
    if (isLuxated) {
        if (luxationType === 'intrusive') {
            return {
                classification: 'VI',
                description: 'Intrusive luxation',
                urgency: 'emergency',
                suggestedTreatment: 'Ortho extrusion or surgical repositioning, possible RCT'
            };
        }
        return {
            classification: 'V',
            description: `${luxationType || 'Lateral/Extrusive'} luxation`,
            urgency: 'urgent',
            suggestedTreatment: 'Reposition, splint, monitor vitality'
        };
    }

    // Crown fractures
    if (involvesPulp) {
        return {
            classification: 'III',
            description: 'Crown fracture with pulp exposure',
            urgency: 'urgent',
            suggestedTreatment: 'Pulp capping (vital) or RCT, composite buildup'
        };
    }

    if (involvesDentin) {
        return {
            classification: 'II',
            description: 'Crown fracture involving enamel + dentin',
            urgency: 'routine',
            suggestedTreatment: 'Composite restoration, consider indirect pulp cap'
        };
    }

    if (involvesEnamel) {
        return {
            classification: 'I',
            description: 'Enamel-only fracture (chip)',
            urgency: 'routine',
            suggestedTreatment: 'Smoothing/polishing or composite restoration'
        };
    }

    // Class IV: Concussion/Subluxation (no displacement)
    return {
        classification: 'IV',
        description: 'Concussion or subluxation (tender but not displaced)',
        urgency: 'routine',
        suggestedTreatment: 'Soft diet, monitor vitality, no treatment if stable'
    };
}

// =============================================================================
// PSR/CPITN (Basic Periodontal Examination)
// =============================================================================

export type PSRCode = 0 | 1 | 2 | 3 | 4;

export interface PSRResult {
    sextantCodes: [PSRCode, PSRCode, PSRCode, PSRCode, PSRCode, PSRCode];
    maxCode: PSRCode;
    overallAssessment: string;
    suggestedTreatment: string;
}

/**
 * Pure function: Interpret PSR/CPITN codes
 * Sextants: UR premolars-molars, Upper anterior, UL premolars-molars, 
 *           LR premolars-molars, Lower anterior, LL premolars-molars
 */
export function interpretPSR(
    codes: [PSRCode, PSRCode, PSRCode, PSRCode, PSRCode, PSRCode]
): PSRResult {
    const maxCode = Math.max(...codes) as PSRCode;

    const assessments: Record<PSRCode, { assessment: string; treatment: string }> = {
        0: { assessment: 'Healthy periodontium', treatment: 'Preventive care only' },
        1: { assessment: 'Bleeding on probing', treatment: 'OHI + Prophylaxis' },
        2: { assessment: 'Calculus/Plaque retentive factors', treatment: 'Scaling + OHI' },
        3: { assessment: 'Shallow pockets (3.5-5.5mm)', treatment: 'Full periodontal charting + SRP' },
        4: { assessment: 'Deep pockets (>5.5mm)', treatment: 'Comprehensive perio exam + Complex therapy' }
    };

    const result = assessments[maxCode];

    return {
        sextantCodes: codes,
        maxCode,
        overallAssessment: result.assessment,
        suggestedTreatment: result.treatment
    };
}

// =============================================================================
// PLAQUE & GINGIVAL INDEX (Löe & Silness)
// =============================================================================

export type PlaquScore = 0 | 1 | 2 | 3;
export type GingivalScore = 0 | 1 | 2 | 3;

export interface HygieneIndexResult {
    plaqueIndex: number; // Average 0-3
    gingivalIndex: number; // Average 0-3
    fullMouthPlaquePercent: number;
    assessment: string;
    recommendation: string;
}

export function calculateHygieneIndices(
    plaqueScores: PlaquScore[],
    gingivalScores: GingivalScore[]
): HygieneIndexResult {
    const avgPlaque = plaqueScores.reduce((a, b) => a + b, 0) / plaqueScores.length;
    const avgGingival = gingivalScores.reduce((a, b) => a + b, 0) / gingivalScores.length;

    // Full mouth plaque % = sites with plaque / total sites * 100
    const sitesWithPlaque = plaqueScores.filter(s => s > 0).length;
    const fmps = Math.round((sitesWithPlaque / plaqueScores.length) * 100);

    let assessment: string;
    let recommendation: string;

    if (avgPlaque <= 0.5 && avgGingival <= 0.5) {
        assessment = 'Excellent oral hygiene';
        recommendation = 'Maintain current routine, 6-month recall';
    } else if (avgPlaque <= 1 && avgGingival <= 1) {
        assessment = 'Good oral hygiene with minor inflammation';
        recommendation = 'Reinforce brushing technique, prophylaxis';
    } else if (avgPlaque <= 2 && avgGingival <= 2) {
        assessment = 'Fair oral hygiene, moderate gingivitis';
        recommendation = 'OHI, scaling, consider chlorhexidine rinse';
    } else {
        assessment = 'Poor oral hygiene, severe gingivitis';
        recommendation = 'Intensive OHI, full scaling, 3-month recall';
    }

    return {
        plaqueIndex: Math.round(avgPlaque * 100) / 100,
        gingivalIndex: Math.round(avgGingival * 100) / 100,
        fullMouthPlaquePercent: fmps,
        assessment,
        recommendation
    };
}

// =============================================================================
// SMILE STUDIO (Esthetic Analysis)
// =============================================================================

export type SmileArc = 'Parallel' | 'Flat' | 'Reverse';
export type LipLine = 'High' | 'Average' | 'Low';
export type NegativeSpace = 'Absent' | 'Minimal' | 'Excessive';

export interface SmileAnalysis {
    smileArc: SmileArc;
    lipLine: LipLine;
    negativeSpace: NegativeSpace;
    midlineDeviation: boolean;
    cantedMidline: boolean;
    gingivalDisplay: 'Excessive' | 'Normal' | 'None';
    toothProportions: 'Ideal' | 'Narrow' | 'Wide';
    colorMatch: 'Harmonious' | 'Discrepancy';
    smileScore: number; // 0-100
    recommendations: string[];
}

export function analyzeSmile(params: {
    smileArc: SmileArc;
    lipLine: LipLine;
    negativeSpace: NegativeSpace;
    midlineDeviation: boolean;
    cantedMidline: boolean;
    gingivalDisplay: 'Excessive' | 'Normal' | 'None';
    toothProportions: 'Ideal' | 'Narrow' | 'Wide';
    colorMatch: 'Harmonious' | 'Discrepancy';
}): SmileAnalysis {
    let score = 100;
    const recommendations: string[] = [];

    // Smile arc scoring
    if (params.smileArc === 'Parallel') score += 0;
    else if (params.smileArc === 'Flat') { score -= 10; recommendations.push('Consider veneers to create parallel smile arc'); }
    else { score -= 20; recommendations.push('Orthodontics + veneers for reverse smile arc'); }

    // Lip line
    if (params.lipLine === 'High') { score -= 10; recommendations.push('Gummy smile correction (Botox/Crown lengthening)'); }

    // Negative space
    if (params.negativeSpace === 'Excessive') { score -= 15; recommendations.push('Arch expansion or wider restorations'); }
    else if (params.negativeSpace === 'Absent') { score -= 5; }

    // Midline
    if (params.midlineDeviation) { score -= 15; recommendations.push('Orthodontic correction or restorative midline adjustment'); }
    if (params.cantedMidline) { score -= 20; recommendations.push('Comprehensive ortho for canted midline'); }

    // Gingival display
    if (params.gingivalDisplay === 'Excessive') { score -= 15; recommendations.push('Crown lengthening or lip repositioning'); }

    // Proportions
    if (params.toothProportions !== 'Ideal') { score -= 10; recommendations.push('Veneers/bonding for proportion correction'); }

    // Color
    if (params.colorMatch === 'Discrepancy') { score -= 10; recommendations.push('Whitening or shade-matched restorations'); }

    return {
        ...params,
        smileScore: Math.max(0, Math.min(100, score)),
        recommendations
    };
}

// =============================================================================
// TOOTH WEAR CLASSIFICATION
// =============================================================================

export type WearType = 'Attrition' | 'Abrasion' | 'Erosion' | 'Abfraction';

export interface ToothWearResult {
    type: WearType;
    description: string;
    likelyCause: string;
    suggestedAction: string;
}

export function classifyToothWear(
    location: 'Incisal' | 'Occlusal' | 'Cervical' | 'Facial',
    morphology: 'Flat' | 'Cupped' | 'V-shaped' | 'Wedge' | 'Saucer'
): ToothWearResult {
    // Attrition: flat wear on occlusal/incisal from tooth-tooth contact
    if ((location === 'Incisal' || location === 'Occlusal') && morphology === 'Flat') {
        return {
            type: 'Attrition',
            description: 'Flat wear pattern on functional surfaces',
            likelyCause: 'Bruxism, parafunctional habits',
            suggestedAction: 'Night guard, sleep study referral, stress management'
        };
    }

    // Erosion: cupped/saucer lesions from acid
    if (morphology === 'Cupped' || morphology === 'Saucer') {
        return {
            type: 'Erosion',
            description: 'Smooth, scooped-out lesions',
            likelyCause: 'Dietary acid (citrus, soda), GERD, bulimia',
            suggestedAction: 'Dietary counseling, GI referral if GERD, fluoride therapy'
        };
    }

    // Abfraction: V-shaped notches at CEJ
    if (location === 'Cervical' && (morphology === 'V-shaped' || morphology === 'Wedge')) {
        return {
            type: 'Abfraction',
            description: 'V-shaped cervical lesions at CEJ',
            likelyCause: 'Occlusal stress causing enamel flexure',
            suggestedAction: 'Occlusal adjustment, night guard, GIC/composite restoration'
        };
    }

    // Abrasion: cervical wear from external source
    if (location === 'Cervical' || location === 'Facial') {
        return {
            type: 'Abrasion',
            description: 'Localized wear from external agent',
            likelyCause: 'Aggressive brushing, abrasive toothpaste, oral habits',
            suggestedAction: 'Modify brushing technique, soft toothbrush, composite restoration'
        };
    }

    return {
        type: 'Attrition',
        description: 'Generalized wear',
        likelyCause: 'Multiple factors',
        suggestedAction: 'Comprehensive evaluation'
    };
}

// =============================================================================
// INDIA-SPECIFIC: OSMF STAGING
// =============================================================================

export type OSMFStage = 'I' | 'II' | 'III' | 'IVA' | 'IVB';

export interface OSMFResult {
    stage: OSMFStage;
    description: string;
    mouthOpeningRange: string;
    suggestedManagement: string;
    malignancyRisk: string;
}

export function stageOSMF(mouthOpeningMM: number, hasPalpableBands: boolean = true): OSMFResult {
    if (mouthOpeningMM >= 35) {
        return {
            stage: 'I',
            description: 'Early/Minimal fibrosis',
            mouthOpeningRange: '>35mm',
            suggestedManagement: 'Cessation of habit, intralesional steroids, physiotherapy',
            malignancyRisk: 'Low (1-2%)'
        };
    }

    if (mouthOpeningMM >= 25) {
        return {
            stage: 'II',
            description: 'Moderate fibrosis, palpable bands',
            mouthOpeningRange: '25-35mm',
            suggestedManagement: 'Habit cessation, steroids, physiotherapy, antioxidants',
            malignancyRisk: 'Moderate (3-7%)'
        };
    }

    if (mouthOpeningMM >= 15) {
        return {
            stage: 'III',
            description: 'Severe fibrosis, restricted opening',
            mouthOpeningRange: '15-25mm',
            suggestedManagement: 'Refer for surgical release, aggressive physiotherapy',
            malignancyRisk: 'High (7-13%)'
        };
    }

    if (mouthOpeningMM >= 5) {
        return {
            stage: 'IVA',
            description: 'Very severe fibrosis',
            mouthOpeningRange: '5-15mm',
            suggestedManagement: 'Urgent surgical intervention, nutritional support',
            malignancyRisk: 'Very High (>13%)'
        };
    }

    return {
        stage: 'IVB',
        description: 'Critical trismus',
        mouthOpeningRange: '<5mm',
        suggestedManagement: 'Emergency surgical release, NGT feeding if needed',
        malignancyRisk: 'Critical - immediate biopsy required'
    };
}

// =============================================================================
// INDIA-SPECIFIC: DEWEY'S MODIFICATION (Angle's Class III)
// =============================================================================

export type DeweyClassIII = 'Type1' | 'Type2' | 'Type3';
export type AngleClass = 'I' | 'II-1' | 'II-2' | 'III';

export interface MalocclusionResult {
    angleClass: AngleClass;
    deweyType?: DeweyClassIII;
    description: string;
    treatmentApproach: string;
}

export function classifyMalocclusion(
    molarRelation: 'Class I' | 'Class II' | 'Class III',
    overjet: number,
    overbite: number,
    hasAnteriorCrossbite: boolean = false,
    isEdgeToEdge: boolean = false
): MalocclusionResult {
    if (molarRelation === 'Class III') {
        let deweyType: DeweyClassIII;
        let description: string;

        if (hasAnteriorCrossbite && overjet < 0) {
            deweyType = 'Type1';
            description = 'Dewey Type 1: Anterior crossbite with normally aligned arches';
        } else if (isEdgeToEdge) {
            deweyType = 'Type2';
            description = 'Dewey Type 2: Edge-to-edge bite, functional shift';
        } else {
            deweyType = 'Type3';
            description = 'Dewey Type 3: True skeletal Class III, mandibular prognathism';
        }

        return {
            angleClass: 'III',
            deweyType,
            description,
            treatmentApproach: deweyType === 'Type3'
                ? 'Orthognathic surgery + orthodontics'
                : 'Orthodontic camouflage, extraction patterns'
        };
    }

    if (molarRelation === 'Class II') {
        const division = overbite > 4 ? 'II-2' : 'II-1';
        return {
            angleClass: division,
            description: division === 'II-1'
                ? 'Class II Division 1: Increased overjet, proclined incisors'
                : 'Class II Division 2: Deep overbite, retroclined incisors',
            treatmentApproach: 'Functional appliances in growing patients, fixed ortho ± extractions'
        };
    }

    return {
        angleClass: 'I',
        description: 'Class I: Normal molar relationship, possible dental crowding',
        treatmentApproach: 'Fixed orthodontics, extraction if severe crowding'
    };
}

// =============================================================================
// SALIVARY FLOW TEST
// =============================================================================

export type SalivaConsistency = 'Serous' | 'Mucous' | 'Frothy';

export interface SalivaryFlowResult {
    flowRate: number; // mL/min
    consistency: SalivaConsistency;
    assessment: string;
    xerostomiaRisk: 'Normal' | 'Low' | 'Moderate' | 'High';
    recommendations: string[];
}

export function assessSalivaryFlow(
    volumeML: number,
    durationMinutes: number,
    consistency: SalivaConsistency
): SalivaryFlowResult {
    const flowRate = volumeML / durationMinutes;
    const recommendations: string[] = [];

    let assessment: string;
    let risk: 'Normal' | 'Low' | 'Moderate' | 'High';

    if (flowRate >= 0.7) {
        assessment = 'Normal salivary flow';
        risk = 'Normal';
    } else if (flowRate >= 0.5) {
        assessment = 'Mildly reduced salivary flow';
        risk = 'Low';
        recommendations.push('Increase water intake', 'Sugar-free gum to stimulate flow');
    } else if (flowRate >= 0.2) {
        assessment = 'Moderate hyposalivation';
        risk = 'Moderate';
        recommendations.push('Saliva substitutes', 'Review medications for xerostomic side effects', 'High-fluoride toothpaste');
    } else {
        assessment = 'Severe hyposalivation (Xerostomia)';
        risk = 'High';
        recommendations.push('Pilocarpine if tolerated', 'Saliva substitutes', 'Frequent fluoride application', 'Screen for Sjögren syndrome');
    }

    if (consistency === 'Frothy') {
        recommendations.push('Evaluate for GERD or mouth breathing');
    }
    if (consistency === 'Mucous') {
        recommendations.push('Hydration counseling, possible infection workup');
    }

    return {
        flowRate: Math.round(flowRate * 100) / 100,
        consistency,
        assessment,
        xerostomiaRisk: risk,
        recommendations
    };
}

// =============================================================================
// DMFT INDEX AUTO-CALCULATION
// =============================================================================

export interface DMFTResult {
    decayed: number;
    missing: number;
    filled: number;
    total: number;
    severity: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
}

export function calculateDMFT(
    decayedTeeth: number[],
    missingTeeth: number[],
    filledTeeth: number[]
): DMFTResult {
    // Exclude wisdom teeth for standard DMFT
    const validTeeth = (teeth: number[]) => teeth.filter(t =>
        ![18, 28, 38, 48].includes(t)
    );

    const d = validTeeth(decayedTeeth).length;
    const m = validTeeth(missingTeeth).length;
    const f = validTeeth(filledTeeth).length;
    const total = d + m + f;

    let severity: DMFTResult['severity'];
    if (total <= 1) severity = 'Very Low';
    else if (total <= 4) severity = 'Low';
    else if (total <= 8) severity = 'Moderate';
    else if (total <= 13) severity = 'High';
    else severity = 'Very High';

    return { decayed: d, missing: m, filled: f, total, severity };
}
