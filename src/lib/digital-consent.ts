/**
 * Phase 21: Digital Consent Module
 * 
 * Legal consent templates with signature capture and tamper-proof storage
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export type ConsentCategory =
    | 'orthodontics'
    | 'oral_surgery'
    | 'endodontics'
    | 'implant'
    | 'periodontics'
    | 'prosthodontics'
    | 'pediatric'
    | 'general';

export interface ConsentTemplate {
    id: string;
    category: ConsentCategory;
    title: string;
    version: string;
    language: 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml';
    content: string; // HTML content
    risks: string[];
    alternatives: string[];
    requiredFields: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SignedConsent {
    id: string;
    templateId: string;
    patientId: string;
    clinicId: string;
    doctorId: string;
    treatmentPlanId: string;

    // Signature data
    signatureBase64: string;
    signedAt: string;
    signedFromIP?: string;
    signedFromDevice?: string;

    // Tamper-proof hash
    contentHash: string; // SHA-256 of template content + patient data
    pdfHash?: string;    // SHA-256 of generated PDF

    // Status
    status: 'pending' | 'signed' | 'revoked' | 'expired';
    expiresAt?: string;

    // Filled data
    patientData: Record<string, string>;
}

export interface ConsentRequest {
    id: string;
    patientId: string;
    clinicId: string;
    templateId: string;
    treatmentPlanId: string;
    requestedAt: string;
    requestedBy: string;
    status: 'pending' | 'sent' | 'viewed' | 'signed' | 'expired';
    sentAt?: string;
    viewedAt?: string;
    notificationSent: boolean;
}

// =============================================================================
// CONSENT TEMPLATES LIBRARY
// =============================================================================

export const CONSENT_TEMPLATES: Omit<ConsentTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        category: 'oral_surgery',
        title: 'Consent for Tooth Extraction',
        version: '1.0',
        language: 'en',
        content: `
            <h2>Consent for Tooth Extraction</h2>
            <p>I, <strong>{{patientName}}</strong>, hereby consent to the extraction of tooth/teeth: <strong>{{toothNumbers}}</strong>.</p>
            
            <h3>I understand that:</h3>
            <ul>
                <li>Tooth extraction is a surgical procedure that involves the removal of a tooth from its socket.</li>
                <li>Alternative treatments may include root canal therapy, crowns, or other restorative options.</li>
                <li>I have been informed of the diagnosis: <strong>{{diagnosis}}</strong>.</li>
            </ul>

            <h3>Risks and Complications</h3>
            <p>I have been informed of the following potential risks:</p>
            <ul>
                {{#each risks}}
                <li>{{this}}</li>
                {{/each}}
            </ul>

            <h3>Post-Operative Care</h3>
            <p>I understand the importance of following post-operative instructions to ensure proper healing.</p>

            <h3>Declaration</h3>
            <p>I confirm that I have read and understood this consent form. I have had the opportunity to ask questions, and all my questions have been answered satisfactorily.</p>
        `,
        risks: [
            'Pain and swelling at the extraction site',
            'Bleeding that may persist for several hours',
            'Dry socket (alveolar osteitis)',
            'Infection',
            'Damage to adjacent teeth',
            'Nerve damage leading to numbness (paresthesia) of lip, tongue, or chin',
            'Sinus perforation (for upper teeth)',
            'Jaw fracture (rare)',
            'Incomplete removal requiring additional surgery'
        ],
        alternatives: [
            'Root canal treatment with crown',
            'Periodontal treatment',
            'Monitoring without intervention',
            'Referral to specialist'
        ],
        requiredFields: ['patientName', 'toothNumbers', 'diagnosis'],
        isActive: true
    },
    {
        category: 'endodontics',
        title: 'Consent for Root Canal Treatment',
        version: '1.0',
        language: 'en',
        content: `
            <h2>Consent for Root Canal Treatment (Endodontic Therapy)</h2>
            <p>I, <strong>{{patientName}}</strong>, consent to root canal treatment on tooth: <strong>{{toothNumber}}</strong>.</p>

            <h3>Procedure Description</h3>
            <p>Root canal treatment involves removing infected or damaged pulp tissue, cleaning the canal system, and sealing it to prevent reinfection.</p>

            <h3>Number of Canals</h3>
            <p>This tooth has been assessed to have <strong>{{canalCount}}</strong> canal(s). Additional canals may be discovered during treatment.</p>

            <h3>Risks and Complications</h3>
            <ul>
                {{#each risks}}
                <li>{{this}}</li>
                {{/each}}
            </ul>

            <h3>Crown Recommendation</h3>
            <p>I understand that a crown is strongly recommended after root canal treatment to protect the tooth from fracture.</p>
        `,
        risks: [
            'Treatment failure requiring retreatment or extraction',
            'Instrument separation within the canal',
            'Perforation of the root or pulp chamber',
            'Post-operative pain and swelling',
            'Temporary or permanent numbness',
            'Tooth discoloration',
            'Vertical root fracture',
            'Flare-up requiring emergency treatment'
        ],
        alternatives: [
            'Tooth extraction',
            'Intentional replantation',
            'Monitoring if asymptomatic'
        ],
        requiredFields: ['patientName', 'toothNumber', 'canalCount'],
        isActive: true
    },
    {
        category: 'implant',
        title: 'Consent for Dental Implant Placement',
        version: '1.0',
        language: 'en',
        content: `
            <h2>Consent for Dental Implant Surgery</h2>
            <p>I, <strong>{{patientName}}</strong>, consent to dental implant placement at position: <strong>{{implantPosition}}</strong>.</p>

            <h3>Procedure Overview</h3>
            <p>A dental implant is a titanium fixture surgically placed in the jawbone to replace a missing tooth root. After healing (osseointegration), a crown will be attached.</p>

            <h3>Implant Details</h3>
            <ul>
                <li>Brand: {{implantBrand}}</li>
                <li>Size: {{implantSize}}</li>
                <li>Bone Graft Required: {{boneGraftRequired}}</li>
            </ul>

            <h3>Risks and Complications</h3>
            <ul>
                {{#each risks}}
                <li>{{this}}</li>
                {{/each}}
            </ul>

            <h3>Success Rate</h3>
            <p>Dental implants have a success rate of approximately 95-98% over 10 years with proper care.</p>
        `,
        risks: [
            'Implant failure and rejection',
            'Infection at the surgical site',
            'Nerve damage (inferior alveolar, mental, or lingual nerve)',
            'Sinus perforation (for upper implants)',
            'Damage to adjacent teeth or structures',
            'Bone loss around the implant (peri-implantitis)',
            'Prolonged healing time',
            'Need for additional bone grafting',
            'Prosthetic complications (screw loosening, crown fracture)'
        ],
        alternatives: [
            'Fixed bridge',
            'Removable partial denture',
            'No replacement (accept space)'
        ],
        requiredFields: ['patientName', 'implantPosition', 'implantBrand', 'implantSize', 'boneGraftRequired'],
        isActive: true
    },
    {
        category: 'orthodontics',
        title: 'Consent for Orthodontic Treatment',
        version: '1.0',
        language: 'en',
        content: `
            <h2>Consent for Orthodontic Treatment</h2>
            <p>I, <strong>{{patientName}}</strong> (or parent/guardian: <strong>{{guardianName}}</strong>), consent to orthodontic treatment.</p>

            <h3>Treatment Plan</h3>
            <ul>
                <li>Treatment Type: {{treatmentType}}</li>
                <li>Estimated Duration: {{estimatedDuration}}</li>
                <li>Extractions Required: {{extractionsRequired}}</li>
            </ul>

            <h3>Risks and Complications</h3>
            <ul>
                {{#each risks}}
                <li>{{this}}</li>
                {{/each}}
            </ul>

            <h3>Patient Responsibilities</h3>
            <p>I understand that treatment success depends on compliance with oral hygiene, wearing appliances as instructed, and keeping all scheduled appointments.</p>

            <h3>Retention</h3>
            <p>I understand that retainers are essential to maintain results and must be worn as directed for life.</p>
        `,
        risks: [
            'Root resorption (shortening of tooth roots)',
            'Tooth decay and gum disease due to difficulty cleaning',
            'Allergic reaction to materials',
            'Relapse after treatment',
            'Temporomandibular joint (TMJ) problems',
            'Soft tissue irritation and ulcers',
            'Enamel demineralization (white spots)',
            'Treatment taking longer than estimated',
            'Need for additional procedures (e.g., jaw surgery)'
        ],
        alternatives: [
            'No treatment (accept current alignment)',
            'Limited treatment addressing specific concerns only',
            'Clear aligner therapy instead of braces'
        ],
        requiredFields: ['patientName', 'treatmentType', 'estimatedDuration', 'extractionsRequired'],
        isActive: true
    }
];

// =============================================================================
// CONSENT SERVICE
// =============================================================================

export class DigitalConsentService {
    /**
     * Generate content hash for tamper-proof verification
     */
    generateContentHash(templateContent: string, patientData: Record<string, string>): string {
        const concatenated = templateContent + JSON.stringify(patientData);
        return crypto.createHash('sha256').update(concatenated).digest('hex');
    }

    /**
     * Generate PDF hash for verification
     */
    generatePdfHash(pdfBase64: string): string {
        return crypto.createHash('sha256').update(pdfBase64).digest('hex');
    }

    /**
     * Create a consent request to send to patient app
     */
    createConsentRequest(
        patientId: string,
        clinicId: string,
        templateId: string,
        treatmentPlanId: string,
        requestedBy: string
    ): ConsentRequest {
        return {
            id: uuidv4(),
            patientId,
            clinicId,
            templateId,
            treatmentPlanId,
            requestedAt: new Date().toISOString(),
            requestedBy,
            status: 'pending',
            notificationSent: false
        };
    }

    /**
     * Process signature and create signed consent record
     */
    processSignature(
        request: ConsentRequest,
        template: ConsentTemplate,
        patientData: Record<string, string>,
        signatureBase64: string,
        signerIP?: string,
        signerDevice?: string
    ): SignedConsent {
        const contentHash = this.generateContentHash(template.content, patientData);

        return {
            id: uuidv4(),
            templateId: template.id,
            patientId: request.patientId,
            clinicId: request.clinicId,
            doctorId: request.requestedBy,
            treatmentPlanId: request.treatmentPlanId,
            signatureBase64,
            signedAt: new Date().toISOString(),
            signedFromIP: signerIP,
            signedFromDevice: signerDevice,
            contentHash,
            status: 'signed',
            patientData
        };
    }

    /**
     * Verify consent integrity
     */
    verifyConsent(consent: SignedConsent, template: ConsentTemplate): boolean {
        const expectedHash = this.generateContentHash(template.content, consent.patientData);
        return consent.contentHash === expectedHash;
    }

    /**
     * Revoke a consent
     */
    revokeConsent(consent: SignedConsent, reason: string): SignedConsent {
        return {
            ...consent,
            status: 'revoked'
        };
    }

    /**
     * Get template by category
     */
    getTemplateByCategory(category: ConsentCategory): ConsentTemplate | undefined {
        const template = CONSENT_TEMPLATES.find(t => t.category === category && t.isActive);
        if (!template) return undefined;

        return {
            ...template,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    /**
     * Fill template with patient data
     */
    fillTemplate(template: ConsentTemplate, patientData: Record<string, string>): string {
        let content = template.content;

        // Replace simple placeholders
        Object.entries(patientData).forEach(([key, value]) => {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        // Replace risks array
        const risksHtml = template.risks.map(r => `<li>${r}</li>`).join('\n');
        content = content.replace('{{#each risks}}\n                <li>{{this}}</li>\n                {{/each}}', risksHtml);

        return content;
    }
}

export const consentService = new DigitalConsentService();
