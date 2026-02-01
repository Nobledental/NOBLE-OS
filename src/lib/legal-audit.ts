/**
 * Phase 27: Legal Audit Trail
 * 
 * Immutable version history for clinical notes with cryptographic consent archiving
 */

import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export interface VersionedClinicalNote {
    id: string;
    patientId: string;
    appointmentId: string;
    episodeId?: string;

    // Current content
    currentVersion: number;
    chiefComplaint: string;
    historyOfPresentIllness: string;
    clinicalFindings: string;
    diagnosis: string;
    treatmentPlan: string;
    procedureNotes: string;
    prescriptions: string[];
    nextVisitDate?: Date;

    // Metadata
    createdBy: string;
    createdAt: Date;
    lastModifiedBy: string;
    lastModifiedAt: Date;

    // Legal
    isLocked: boolean;
    lockedAt?: Date;
    lockedBy?: string;
    lockReason?: string;
}

export interface NoteVersionHistory {
    id: string;
    noteId: string;
    version: number;

    // Snapshot of content at this version
    contentSnapshot: {
        chiefComplaint: string;
        historyOfPresentIllness: string;
        clinicalFindings: string;
        diagnosis: string;
        treatmentPlan: string;
        procedureNotes: string;
        prescriptions: string[];
        nextVisitDate?: Date;
    };

    // Change metadata
    changedBy: string;
    changedAt: Date;
    changeReason: string;
    changeType: 'CREATE' | 'UPDATE' | 'CORRECTION' | 'ADDENDUM' | 'LOCK';
    ipAddress?: string;
    deviceInfo?: string;

    // Cryptographic proof
    contentHash: string;
    previousHash?: string;
    signature?: string;
}

export interface ConsentRecord {
    id: string;
    patientId: string;
    patientName: string;
    appointmentId: string;
    procedureCode: string;
    procedureName: string;

    // Consent details
    consentType: 'TREATMENT' | 'ANESTHESIA' | 'EXTRACTION' | 'SURGERY' | 'IMPLANT' | 'ORTHODONTICS' | 'GENERAL';
    consentText: string;
    risksExplained: string[];
    alternativesExplained: string[];

    // Signature
    signatureData: string; // Base64 canvas signature
    signatureHash: string; // SHA-256 hash of signature
    signedAt: Date;
    witnessedBy?: string;

    // Verification
    documentHash: string; // Hash of entire consent document
    verificationCode: string; // Unique verification code
    isValid: boolean;

    // Archival
    archivedAt: Date;
    archiveHash: string; // Hash linking to blockchain/immutable store
    pdfPath?: string;
}

export interface AuditLogEntry {
    id: string;
    entityType: 'CLINICAL_NOTE' | 'CONSENT' | 'PRESCRIPTION' | 'DIAGNOSIS' | 'TREATMENT';
    entityId: string;
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'PRINT' | 'EXPORT' | 'SHARE';
    performedBy: string;
    performedByRole: string;
    performedAt: Date;
    ipAddress?: string;
    deviceInfo?: string;
    details: string;
    clinicId: string;
    patientId?: string;
}

// =============================================================================
// LEGAL AUDIT SERVICE
// =============================================================================

export class LegalAuditService {
    private versionHistory: Map<string, NoteVersionHistory[]> = new Map();
    private consents: Map<string, ConsentRecord> = new Map();
    private auditLog: AuditLogEntry[] = [];

    /**
     * Create initial clinical note with version 1
     */
    createNote(
        note: Omit<VersionedClinicalNote, 'id' | 'currentVersion' | 'lastModifiedBy' | 'lastModifiedAt' | 'isLocked'>,
        ipAddress?: string,
        deviceInfo?: string
    ): { note: VersionedClinicalNote; history: NoteVersionHistory } {
        const id = uuid();
        const now = new Date();

        const newNote: VersionedClinicalNote = {
            id,
            ...note,
            currentVersion: 1,
            lastModifiedBy: note.createdBy,
            lastModifiedAt: now,
            isLocked: false
        };

        // Create initial version history
        const contentSnapshot = {
            chiefComplaint: note.chiefComplaint,
            historyOfPresentIllness: note.historyOfPresentIllness,
            clinicalFindings: note.clinicalFindings,
            diagnosis: note.diagnosis,
            treatmentPlan: note.treatmentPlan,
            procedureNotes: note.procedureNotes,
            prescriptions: note.prescriptions,
            nextVisitDate: note.nextVisitDate
        };

        const contentHash = this.hashContent(contentSnapshot);

        const history: NoteVersionHistory = {
            id: uuid(),
            noteId: id,
            version: 1,
            contentSnapshot,
            changedBy: note.createdBy,
            changedAt: now,
            changeReason: 'Initial creation',
            changeType: 'CREATE',
            ipAddress,
            deviceInfo,
            contentHash
        };

        this.versionHistory.set(id, [history]);

        return { note: newNote, history };
    }

    /**
     * Update clinical note (append-only versioning)
     */
    updateNote(
        noteId: string,
        currentNote: VersionedClinicalNote,
        updates: Partial<Pick<VersionedClinicalNote,
            'chiefComplaint' | 'historyOfPresentIllness' | 'clinicalFindings' |
            'diagnosis' | 'treatmentPlan' | 'procedureNotes' | 'prescriptions' | 'nextVisitDate'>>,
        changedBy: string,
        changeReason: string,
        changeType: 'UPDATE' | 'CORRECTION' | 'ADDENDUM' = 'UPDATE',
        ipAddress?: string,
        deviceInfo?: string
    ): { note: VersionedClinicalNote; history: NoteVersionHistory } | { error: string } {
        // Check if note is locked
        if (currentNote.isLocked) {
            return { error: 'Clinical note is locked and cannot be modified' };
        }

        const existingHistory = this.versionHistory.get(noteId) || [];
        const previousVersion = existingHistory[existingHistory.length - 1];
        const newVersion = currentNote.currentVersion + 1;
        const now = new Date();

        // Create updated note
        const updatedNote: VersionedClinicalNote = {
            ...currentNote,
            ...updates,
            currentVersion: newVersion,
            lastModifiedBy: changedBy,
            lastModifiedAt: now
        };

        // Create version history snapshot
        const contentSnapshot = {
            chiefComplaint: updatedNote.chiefComplaint,
            historyOfPresentIllness: updatedNote.historyOfPresentIllness,
            clinicalFindings: updatedNote.clinicalFindings,
            diagnosis: updatedNote.diagnosis,
            treatmentPlan: updatedNote.treatmentPlan,
            procedureNotes: updatedNote.procedureNotes,
            prescriptions: updatedNote.prescriptions,
            nextVisitDate: updatedNote.nextVisitDate
        };

        const contentHash = this.hashContent(contentSnapshot);

        const history: NoteVersionHistory = {
            id: uuid(),
            noteId,
            version: newVersion,
            contentSnapshot,
            changedBy,
            changedAt: now,
            changeReason,
            changeType,
            ipAddress,
            deviceInfo,
            contentHash,
            previousHash: previousVersion?.contentHash
        };

        existingHistory.push(history);
        this.versionHistory.set(noteId, existingHistory);

        return { note: updatedNote, history };
    }

    /**
     * Lock a clinical note (no further edits allowed)
     */
    lockNote(
        noteId: string,
        currentNote: VersionedClinicalNote,
        lockedBy: string,
        lockReason: string,
        ipAddress?: string
    ): VersionedClinicalNote {
        const now = new Date();

        const lockedNote: VersionedClinicalNote = {
            ...currentNote,
            isLocked: true,
            lockedAt: now,
            lockedBy,
            lockReason
        };

        // Add lock event to history
        const existingHistory = this.versionHistory.get(noteId) || [];
        const lockHistory: NoteVersionHistory = {
            id: uuid(),
            noteId,
            version: currentNote.currentVersion,
            contentSnapshot: {
                chiefComplaint: currentNote.chiefComplaint,
                historyOfPresentIllness: currentNote.historyOfPresentIllness,
                clinicalFindings: currentNote.clinicalFindings,
                diagnosis: currentNote.diagnosis,
                treatmentPlan: currentNote.treatmentPlan,
                procedureNotes: currentNote.procedureNotes,
                prescriptions: currentNote.prescriptions,
                nextVisitDate: currentNote.nextVisitDate
            },
            changedBy: lockedBy,
            changedAt: now,
            changeReason: `LOCKED: ${lockReason}`,
            changeType: 'LOCK',
            ipAddress,
            contentHash: this.hashContent({
                chiefComplaint: currentNote.chiefComplaint,
                historyOfPresentIllness: currentNote.historyOfPresentIllness,
                clinicalFindings: currentNote.clinicalFindings,
                diagnosis: currentNote.diagnosis,
                treatmentPlan: currentNote.treatmentPlan,
                procedureNotes: currentNote.procedureNotes,
                prescriptions: currentNote.prescriptions,
                nextVisitDate: currentNote.nextVisitDate
            }),
            previousHash: existingHistory[existingHistory.length - 1]?.contentHash
        };

        existingHistory.push(lockHistory);
        this.versionHistory.set(noteId, existingHistory);

        return lockedNote;
    }

    /**
     * Get version history for a note
     */
    getVersionHistory(noteId: string): NoteVersionHistory[] {
        return this.versionHistory.get(noteId) || [];
    }

    /**
     * Get specific version of a note
     */
    getNoteAtVersion(noteId: string, version: number): NoteVersionHistory | undefined {
        const history = this.versionHistory.get(noteId) || [];
        return history.find(h => h.version === version);
    }

    /**
     * Create and archive consent record
     */
    createConsentRecord(
        patientId: string,
        patientName: string,
        appointmentId: string,
        procedureCode: string,
        procedureName: string,
        consentType: ConsentRecord['consentType'],
        consentText: string,
        risksExplained: string[],
        alternativesExplained: string[],
        signatureData: string,
        witnessedBy?: string
    ): ConsentRecord {
        const now = new Date();
        const id = uuid();

        // Create signature hash
        const signatureHash = this.hashString(signatureData);

        // Create document hash (entire consent)
        const documentContent = JSON.stringify({
            patientId,
            patientName,
            procedureCode,
            procedureName,
            consentType,
            consentText,
            risksExplained,
            alternativesExplained,
            signatureHash,
            signedAt: now.toISOString()
        });
        const documentHash = this.hashString(documentContent);

        // Generate verification code
        const verificationCode = this.generateVerificationCode();

        // Create archive hash
        const archiveHash = this.hashString(`${documentHash}:${verificationCode}:${now.toISOString()}`);

        const consent: ConsentRecord = {
            id,
            patientId,
            patientName,
            appointmentId,
            procedureCode,
            procedureName,
            consentType,
            consentText,
            risksExplained,
            alternativesExplained,
            signatureData,
            signatureHash,
            signedAt: now,
            witnessedBy,
            documentHash,
            verificationCode,
            isValid: true,
            archivedAt: now,
            archiveHash
        };

        this.consents.set(id, consent);

        return consent;
    }

    /**
     * Verify consent record integrity
     */
    verifyConsentIntegrity(consentId: string): {
        valid: boolean;
        signatureValid: boolean;
        documentValid: boolean;
        details: string;
    } {
        const consent = this.consents.get(consentId);
        if (!consent) {
            return {
                valid: false,
                signatureValid: false,
                documentValid: false,
                details: 'Consent record not found'
            };
        }

        // Verify signature hash
        const currentSignatureHash = this.hashString(consent.signatureData);
        const signatureValid = currentSignatureHash === consent.signatureHash;

        // Verify document hash
        const documentContent = JSON.stringify({
            patientId: consent.patientId,
            patientName: consent.patientName,
            procedureCode: consent.procedureCode,
            procedureName: consent.procedureName,
            consentType: consent.consentType,
            consentText: consent.consentText,
            risksExplained: consent.risksExplained,
            alternativesExplained: consent.alternativesExplained,
            signatureHash: consent.signatureHash,
            signedAt: consent.signedAt.toISOString()
        });
        const currentDocumentHash = this.hashString(documentContent);
        const documentValid = currentDocumentHash === consent.documentHash;

        return {
            valid: signatureValid && documentValid,
            signatureValid,
            documentValid,
            details: signatureValid && documentValid
                ? 'Consent record integrity verified'
                : `Integrity check failed: ${!signatureValid ? 'Signature tampered' : ''} ${!documentValid ? 'Document tampered' : ''}`
        };
    }

    /**
     * Log audit entry
     */
    logAudit(
        entityType: AuditLogEntry['entityType'],
        entityId: string,
        action: AuditLogEntry['action'],
        performedBy: string,
        performedByRole: string,
        details: string,
        clinicId: string,
        patientId?: string,
        ipAddress?: string,
        deviceInfo?: string
    ): AuditLogEntry {
        const entry: AuditLogEntry = {
            id: uuid(),
            entityType,
            entityId,
            action,
            performedBy,
            performedByRole,
            performedAt: new Date(),
            ipAddress,
            deviceInfo,
            details,
            clinicId,
            patientId
        };

        this.auditLog.push(entry);
        return entry;
    }

    /**
     * Get audit log for an entity
     */
    getAuditLog(entityId: string): AuditLogEntry[] {
        return this.auditLog.filter(e => e.entityId === entityId);
    }

    /**
     * Get audit log for a patient
     */
    getPatientAuditLog(patientId: string): AuditLogEntry[] {
        return this.auditLog.filter(e => e.patientId === patientId);
    }

    /**
     * Export audit trail for legal purposes
     */
    exportLegalAuditTrail(noteId: string): {
        note: NoteVersionHistory[];
        auditLog: AuditLogEntry[];
        exportedAt: Date;
        exportHash: string;
    } {
        const history = this.versionHistory.get(noteId) || [];
        const audit = this.auditLog.filter(e => e.entityId === noteId);
        const now = new Date();

        const exportData = JSON.stringify({ history, audit, exportedAt: now.toISOString() });
        const exportHash = this.hashString(exportData);

        return {
            note: history,
            auditLog: audit,
            exportedAt: now,
            exportHash
        };
    }

    /**
     * Hash content using SHA-256
     */
    private hashContent(content: object): string {
        const str = JSON.stringify(content);
        return this.hashString(str);
    }

    /**
     * Hash string using SHA-256
     */
    private hashString(str: string): string {
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    /**
     * Generate verification code
     */
    private generateVerificationCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
}

export const legalAuditService = new LegalAuditService();
