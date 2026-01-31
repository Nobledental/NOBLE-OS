/**
 * Phase 24: JARVIS Autonomous Agent
 * 
 * Proactive clinical auditor, auto-notifications, and self-correction logic
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export type AuditSeverity = 'info' | 'warning' | 'critical';
export type AuditCategory =
    | 'MISSING_CLINICAL_DATA'
    | 'INCOMPLETE_CASE_SHEET'
    | 'UNBILLED_PROCEDURE'
    | 'PATIENT_NO_SHOW'
    | 'LATE_RECORD_SHARING'
    | 'STAFF_ABSENT';

export interface ClinicalAuditResult {
    id: string;
    appointmentId: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    procedureCode: string;
    procedureName: string;
    category: AuditCategory;
    severity: AuditSeverity;
    message: string;
    missingFields: string[];
    detectedAt: Date;
    resolvedAt?: Date;
    notificationSent: boolean;
}

export interface MorningSyncSummary {
    id: string;
    recipientId: string;
    recipientType: 'doctor' | 'patient' | 'receptionist';
    date: Date;
    appointments: AppointmentSummary[];
    pendingTasks: string[];
    alerts: string[];
    generatedAt: Date;
}

export interface AppointmentSummary {
    appointmentId: string;
    patientName: string;
    time: string;
    procedureName: string;
    chairNumber: number;
    specialNotes?: string;
}

export interface ConfirmationRequest {
    id: string;
    appointmentId: string;
    patientId: string;
    patientPhone: string;
    scheduledTime: Date;
    sentAt: Date;
    responseReceived: boolean;
    response?: 'CONFIRMED' | 'RESCHEDULE' | 'CANCEL';
    responseAt?: Date;
    reminderType: '1_hour' | 'morning' | 'day_before';
}

export interface AutoModeStatus {
    isActive: boolean;
    activatedAt?: Date;
    reason: 'no_receptionist' | 'emergency' | 'after_hours';
    features: {
        autoCheckIn: boolean;
        autoBilling: boolean;
        autoNotifications: boolean;
    };
}

// Clinical data requirements per procedure
export interface ProcedureDataRequirements {
    procedureCode: string;
    requiredFields: string[];
    optionalFields: string[];
    protocol: string;
}

// =============================================================================
// JARVIS CLINICAL AUDITOR
// =============================================================================

export class JARVISClinicalAuditor {
    private readonly PROCEDURE_REQUIREMENTS: Map<string, ProcedureDataRequirements> = new Map([
        ['RCT', {
            procedureCode: 'RCT',
            requiredFields: ['workingLength', 'apexLocator', 'irrigant', 'obturator', 'coneSize'],
            optionalFields: ['preOpXray', 'postOpXray', 'accessOpening'],
            protocol: 'ROOT_CANAL_PROTOCOL'
        }],
        ['EXTRACTION', {
            procedureCode: 'EXTRACTION',
            requiredFields: ['toothNumber', 'anesthesiaType', 'technique', 'complications'],
            optionalFields: ['suturesPlaced', 'medicationPrescribed'],
            protocol: 'EXTRACTION_PROTOCOL'
        }],
        ['SCALING', {
            procedureCode: 'SCALING',
            requiredFields: ['quadrants', 'ultrasonic', 'subgingival'],
            optionalFields: ['bleedingPoints', 'pocketDepths'],
            protocol: 'PERIODONTAL_PROTOCOL'
        }],
        ['FILLING', {
            procedureCode: 'FILLING',
            requiredFields: ['toothNumber', 'surface', 'material', 'shade'],
            optionalFields: ['baseUsed', 'etchingAgent'],
            protocol: 'RESTORATIVE_PROTOCOL'
        }],
        ['IMPLANT', {
            procedureCode: 'IMPLANT',
            requiredFields: ['implantBrand', 'diameter', 'length', 'platform', 'torque', 'boneType'],
            optionalFields: ['graftMaterial', 'membraneUsed', 'healingAbutment'],
            protocol: 'IMPLANT_PROTOCOL'
        }]
    ]);

    /**
     * Audit clinical records for a given date
     */
    auditClinicalRecords(
        appointments: Array<{
            id: string;
            patientId: string;
            patientName: string;
            doctorId: string;
            procedureCode: string;
            procedureName: string;
            status: 'completed' | 'scheduled' | 'in_progress';
            clinicalNote?: Record<string, any>;
            completedAt?: Date;
        }>,
        date: Date = new Date()
    ): ClinicalAuditResult[] {
        const results: ClinicalAuditResult[] = [];

        for (const apt of appointments) {
            if (apt.status !== 'completed') continue;

            const requirements = this.PROCEDURE_REQUIREMENTS.get(apt.procedureCode);
            if (!requirements) continue;

            const missingFields = this.findMissingFields(
                apt.clinicalNote || {},
                requirements.requiredFields
            );

            if (missingFields.length > 0) {
                const severity = this.calculateSeverity(missingFields.length, requirements.requiredFields.length);

                results.push({
                    id: uuid(),
                    appointmentId: apt.id,
                    patientId: apt.patientId,
                    patientName: apt.patientName,
                    doctorId: apt.doctorId,
                    procedureCode: apt.procedureCode,
                    procedureName: apt.procedureName,
                    category: 'MISSING_CLINICAL_DATA',
                    severity,
                    message: this.generateAuditMessage(apt.procedureName, missingFields),
                    missingFields,
                    detectedAt: new Date(),
                    notificationSent: false
                });
            }
        }

        return results;
    }

    /**
     * Generate EOD (End of Day) audit report
     */
    generateEODAudit(
        appointments: Array<any>,
        clinicId: string
    ): {
        summary: string;
        criticalCount: number;
        warningCount: number;
        results: ClinicalAuditResult[];
    } {
        const results = this.auditClinicalRecords(appointments);
        const criticalCount = results.filter(r => r.severity === 'critical').length;
        const warningCount = results.filter(r => r.severity === 'warning').length;

        let summary = `📋 EOD Clinical Audit for ${new Date().toLocaleDateString('en-IN')}\n`;
        summary += `Total Completed: ${appointments.filter(a => a.status === 'completed').length}\n`;

        if (criticalCount > 0) {
            summary += `🔴 Critical Issues: ${criticalCount}\n`;
        }
        if (warningCount > 0) {
            summary += `🟠 Warnings: ${warningCount}\n`;
        }
        if (results.length === 0) {
            summary += `✅ All records complete!\n`;
        }

        return { summary, criticalCount, warningCount, results };
    }

    /**
     * Generate push notification for missing data
     */
    generateMissingDataNotification(audit: ClinicalAuditResult): {
        title: string;
        body: string;
        data: Record<string, string>;
    } {
        return {
            title: `JARVIS: Clinical data missing`,
            body: `${audit.procedureName} for ${audit.patientName}. Missing: ${audit.missingFields.slice(0, 2).join(', ')}${audit.missingFields.length > 2 ? '...' : ''}. Tap to update.`,
            data: {
                type: 'CLINICAL_AUDIT',
                appointmentId: audit.appointmentId,
                patientId: audit.patientId,
                action: 'UPDATE_CLINICAL_NOTE'
            }
        };
    }

    /**
     * Auto-draft case sheet from 3D map data (Silent Scribe)
     */
    autoDraftCaseSheet(
        procedureCode: string,
        toothData: {
            toothNumber: number;
            conditions: string[];
            treatments: string[];
        },
        departmentProtocol: Record<string, any>
    ): Record<string, any> {
        const requirements = this.PROCEDURE_REQUIREMENTS.get(procedureCode);
        if (!requirements) return {};

        const draft: Record<string, any> = {
            autoGenerated: true,
            generatedAt: new Date(),
            protocol: requirements.protocol,
            toothNumber: toothData.toothNumber,
            conditions: toothData.conditions,
            treatments: toothData.treatments
        };

        // Pre-fill based on protocol
        if (departmentProtocol[requirements.protocol]) {
            Object.assign(draft, departmentProtocol[requirements.protocol].defaults || {});
        }

        return draft;
    }

    // Helper methods
    private findMissingFields(clinicalNote: Record<string, any>, requiredFields: string[]): string[] {
        return requiredFields.filter(field => {
            const value = clinicalNote[field];
            return value === undefined || value === null || value === '';
        });
    }

    private calculateSeverity(missingCount: number, totalRequired: number): AuditSeverity {
        const ratio = missingCount / totalRequired;
        if (ratio >= 0.7) return 'critical';
        if (ratio >= 0.3) return 'warning';
        return 'info';
    }

    private generateAuditMessage(procedureName: string, missingFields: string[]): string {
        if (missingFields.length === 1) {
            return `${procedureName}: Missing ${missingFields[0]}`;
        }
        return `${procedureName}: Missing ${missingFields.length} required fields`;
    }
}

// =============================================================================
// MORNING SYNC SERVICE
// =============================================================================

export class MorningSyncService {
    /**
     * Generate morning summary for a doctor
     */
    generateDoctorSummary(
        doctorId: string,
        doctorName: string,
        appointments: AppointmentSummary[],
        pendingAudits: ClinicalAuditResult[]
    ): MorningSyncSummary {
        const pendingTasks: string[] = [];
        const alerts: string[] = [];

        // Add pending clinical audits
        if (pendingAudits.length > 0) {
            pendingTasks.push(`${pendingAudits.length} incomplete clinical notes from yesterday`);
        }

        // Add today's overview
        if (appointments.length === 0) {
            alerts.push('No appointments scheduled today');
        } else {
            const surgeries = appointments.filter(a =>
                a.procedureName.toLowerCase().includes('surgery') ||
                a.procedureName.toLowerCase().includes('implant')
            );
            if (surgeries.length > 0) {
                alerts.push(`${surgeries.length} surgical procedure(s) today`);
            }
        }

        return {
            id: uuid(),
            recipientId: doctorId,
            recipientType: 'doctor',
            date: new Date(),
            appointments,
            pendingTasks,
            alerts,
            generatedAt: new Date()
        };
    }

    /**
     * Generate patient appointment reminder
     */
    generatePatientReminder(
        patientId: string,
        patientName: string,
        appointment: AppointmentSummary
    ): {
        sms: string;
        fcm: { title: string; body: string };
    } {
        const sms = `Noble Dental: Hi ${patientName}, you have an appointment at ${appointment.time}. Reply YES to confirm or RESCHEDULE to change.`;

        const fcm = {
            title: 'Appointment Reminder',
            body: `Your appointment is at ${appointment.time} for ${appointment.procedureName}. Tap to confirm or reschedule.`
        };

        return { sms, fcm };
    }

    /**
     * Generate 1-hour confirmation
     */
    generateHourlyConfirmation(
        patientId: string,
        appointment: AppointmentSummary
    ): ConfirmationRequest {
        return {
            id: uuid(),
            appointmentId: appointment.appointmentId,
            patientId,
            patientPhone: '',
            scheduledTime: new Date(),
            sentAt: new Date(),
            responseReceived: false,
            reminderType: '1_hour'
        };
    }

    /**
     * Handle confirmation response
     */
    handleConfirmationResponse(
        request: ConfirmationRequest,
        response: 'CONFIRMED' | 'RESCHEDULE' | 'CANCEL'
    ): {
        request: ConfirmationRequest;
        actions: string[];
        notifications: Array<{ recipient: string; message: string }>;
    } {
        const updatedRequest: ConfirmationRequest = {
            ...request,
            responseReceived: true,
            response,
            responseAt: new Date()
        };

        const actions: string[] = [];
        const notifications: Array<{ recipient: string; message: string }> = [];

        switch (response) {
            case 'CONFIRMED':
                actions.push('UPDATE_APPOINTMENT_STATUS_CONFIRMED');
                break;

            case 'RESCHEDULE':
                actions.push('OPEN_RESCHEDULE_FLOW');
                notifications.push({
                    recipient: 'receptionist',
                    message: `Patient requested reschedule for ${request.scheduledTime.toLocaleTimeString()}`
                });
                break;

            case 'CANCEL':
                actions.push('MARK_SLOT_AVAILABLE');
                actions.push('NOTIFY_WAITLIST');
                notifications.push({
                    recipient: 'doctor',
                    message: `Cancellation: Slot at ${request.scheduledTime.toLocaleTimeString()} is now open`
                });
                break;
        }

        return { request: updatedRequest, actions, notifications };
    }
}

// =============================================================================
// AUTO-MODE SERVICE
// =============================================================================

export class AutoModeService {
    private readonly RECEPTIONIST_LOGIN_DEADLINE = '09:15';

    /**
     * Check if auto-mode should be activated
     */
    checkAutoModeConditions(
        receptionistLogins: Date[],
        currentTime: Date = new Date()
    ): AutoModeStatus {
        const timeStr = currentTime.toTimeString().slice(0, 5);
        const today = currentTime.toDateString();

        // Check if any receptionist logged in today before deadline
        const hasReceptionistToday = receptionistLogins.some(login =>
            login.toDateString() === today &&
            login.toTimeString().slice(0, 5) <= this.RECEPTIONIST_LOGIN_DEADLINE
        );

        if (timeStr > this.RECEPTIONIST_LOGIN_DEADLINE && !hasReceptionistToday) {
            return {
                isActive: true,
                activatedAt: currentTime,
                reason: 'no_receptionist',
                features: {
                    autoCheckIn: true,
                    autoBilling: true,
                    autoNotifications: true
                }
            };
        }

        return {
            isActive: false,
            features: {
                autoCheckIn: false,
                autoBilling: false,
                autoNotifications: false
            }
        };
    }

    /**
     * Generate auto-mode notification
     */
    generateAutoModeNotification(): {
        title: string;
        body: string;
    } {
        return {
            title: 'JARVIS: Auto-Mode Activated',
            body: 'No receptionist detected. Digital check-ins and auto-billing are now active.'
        };
    }
}

// Export instances
export const jarvisAuditor = new JARVISClinicalAuditor();
export const morningSyncService = new MorningSyncService();
export const autoModeService = new AutoModeService();
