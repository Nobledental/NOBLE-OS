/**
 * Phase 26: Complication Bot & SLA Monitor
 * 
 * Decision tree chat flow, escalation logic, and 18-hour SLA enforcement
 */

import { v4 as uuid } from 'uuid';
import { AlertPriority, PatientCheckIn, getProtocol } from './postop-protocols';

// =============================================================================
// TYPES
// =============================================================================

export interface ComplicationReport {
    id: string;
    checkInId: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    procedureCode: string;
    procedureName: string;
    clinicId: string;
    doctorId: string;

    // Complication details
    symptom: string;
    severity: AlertPriority;
    painLevel?: number;
    additionalDetails?: string;

    // SLA tracking
    reportedAt: Date;
    slaDeadline: Date; // 18 hours from reportedAt

    // Response tracking
    respondedAt?: Date;
    respondedBy?: string;
    responseNote?: string;
    resolution?: 'resolved' | 'scheduled_visit' | 'emergency' | 'monitoring';

    // Escalation
    escalationLevel: number; // 0-4 (T-0, T-6h, T-12h, T-17h, T-18h)
    escalationHistory: EscalationEvent[];
    penaltyApplied: boolean;
    apologyMessageSent: boolean;
}

export interface EscalationEvent {
    level: number;
    triggeredAt: Date;
    action: string;
    channel: 'push' | 'sms' | 'whatsapp' | 'dashboard';
    recipient: string;
}

export interface ChatNode {
    id: string;
    type: 'question' | 'response' | 'action' | 'end';
    message: string;
    options?: ChatOption[];
    action?: {
        type: 'set_priority' | 'create_alert' | 'schedule_callback' | 'provide_info';
        payload: any;
    };
    next?: string;
}

export interface ChatOption {
    id: string;
    label: string;
    value: string;
    next: string;
    setPriority?: AlertPriority;
}

export interface SLACheckResult {
    complicationId: string;
    hoursElapsed: number;
    hoursRemaining: number;
    escalationLevel: number;
    requiresAction: boolean;
    action?: 'send_reminder' | 'final_warning' | 'apply_penalty';
    recipient?: string;
    message?: string;
}

// =============================================================================
// COMPLICATION DECISION TREE
// =============================================================================

export const COMPLICATION_CHAT_FLOW: Map<string, ChatNode> = new Map([
    ['start', {
        id: 'start',
        type: 'question',
        message: 'How are you feeling after your procedure?',
        options: [
            { id: 'good', label: '😊 Great, healing well!', value: 'good', next: 'end_good', setPriority: 'GREEN' },
            { id: 'mild', label: '😐 Some discomfort', value: 'mild', next: 'discomfort_type', setPriority: 'YELLOW' },
            { id: 'concern', label: '😟 I have concerns', value: 'concern', next: 'concern_type', setPriority: 'YELLOW' },
            { id: 'emergency', label: '🚨 Need urgent help', value: 'emergency', next: 'emergency_type', setPriority: 'RED' }
        ]
    }],

    // Discomfort branch
    ['discomfort_type', {
        id: 'discomfort_type',
        type: 'question',
        message: 'What kind of discomfort are you experiencing?',
        options: [
            { id: 'pain', label: 'Pain', value: 'pain', next: 'pain_type' },
            { id: 'sensitivity', label: 'Sensitivity', value: 'sensitivity', next: 'sensitivity_level' },
            { id: 'swelling', label: 'Swelling', value: 'swelling', next: 'swelling_level', setPriority: 'YELLOW' },
            { id: 'bleeding', label: 'Bleeding', value: 'bleeding', next: 'bleeding_level' }
        ]
    }],

    // Pain assessment
    ['pain_type', {
        id: 'pain_type',
        type: 'question',
        message: 'Is the pain dull or sharp?',
        options: [
            { id: 'dull', label: 'Dull/aching', value: 'dull', next: 'pain_level' },
            { id: 'sharp', label: 'Sharp/shooting', value: 'sharp', next: 'pain_level', setPriority: 'RED' },
            { id: 'throbbing', label: 'Throbbing', value: 'throbbing', next: 'pain_level', setPriority: 'YELLOW' }
        ]
    }],

    ['pain_level', {
        id: 'pain_level',
        type: 'question',
        message: 'Rate your pain from 1-10:',
        options: [
            { id: 'low', label: '1-3 (Mild)', value: 'low', next: 'pain_advice_mild', setPriority: 'GREEN' },
            { id: 'medium', label: '4-6 (Moderate)', value: 'medium', next: 'pain_advice_moderate', setPriority: 'YELLOW' },
            { id: 'high', label: '7-10 (Severe)', value: 'high', next: 'pain_alert', setPriority: 'RED' }
        ]
    }],

    ['pain_advice_mild', {
        id: 'pain_advice_mild',
        type: 'response',
        message: 'Mild pain is normal after your procedure. Continue taking your prescribed medication and rest. If it worsens, let us know.',
        next: 'end_monitoring'
    }],

    ['pain_advice_moderate', {
        id: 'pain_advice_moderate',
        type: 'response',
        message: 'Take your pain medication as prescribed. Apply ice if there\'s swelling. We\'ll check on you tomorrow.',
        action: {
            type: 'create_alert',
            payload: { priority: 'YELLOW', reason: 'Moderate pain reported' }
        },
        next: 'end_monitoring'
    }],

    ['pain_alert', {
        id: 'pain_alert',
        type: 'response',
        message: 'We\'re concerned about your pain level. A member of our team will contact you shortly. Please stay available.',
        action: {
            type: 'create_alert',
            payload: { priority: 'RED', reason: 'Severe pain reported', urgent: true }
        },
        next: 'end_urgent'
    }],

    // Swelling assessment
    ['swelling_level', {
        id: 'swelling_level',
        type: 'question',
        message: 'How severe is the swelling?',
        options: [
            { id: 'mild', label: 'Mild (barely noticeable)', value: 'mild', next: 'swelling_advice_mild', setPriority: 'GREEN' },
            { id: 'moderate', label: 'Moderate (visible)', value: 'moderate', next: 'swelling_advice_moderate', setPriority: 'YELLOW' },
            { id: 'severe', label: 'Severe (affecting eating/speaking)', value: 'severe', next: 'swelling_alert', setPriority: 'RED' }
        ]
    }],

    ['swelling_advice_mild', {
        id: 'swelling_advice_mild',
        type: 'response',
        message: 'Some swelling is normal and should subside in 2-3 days. Apply ice packs (15 min on/off). Sleep with head elevated.',
        next: 'end_monitoring'
    }],

    ['swelling_advice_moderate', {
        id: 'swelling_advice_moderate',
        type: 'response',
        message: 'Continue ice packs and prescribed medication. Swelling usually peaks at Day 2-3 then reduces. We\'ll monitor you closely.',
        action: {
            type: 'create_alert',
            payload: { priority: 'YELLOW', reason: 'Moderate swelling reported' }
        },
        next: 'end_monitoring'
    }],

    ['swelling_alert', {
        id: 'swelling_alert',
        type: 'response',
        message: '⚠️ Severe swelling needs immediate attention. Our team will call you within the hour. In the meantime, continue ice packs.',
        action: {
            type: 'create_alert',
            payload: { priority: 'RED', reason: 'Severe swelling', urgent: true }
        },
        next: 'end_urgent'
    }],

    // Bleeding assessment
    ['bleeding_level', {
        id: 'bleeding_level',
        type: 'question',
        message: 'How much bleeding?',
        options: [
            { id: 'oozing', label: 'Slight oozing (pink saliva)', value: 'oozing', next: 'bleeding_advice_normal', setPriority: 'GREEN' },
            { id: 'moderate', label: 'Moderate (need to spit frequently)', value: 'moderate', next: 'bleeding_advice_moderate', setPriority: 'YELLOW' },
            { id: 'heavy', label: 'Heavy (continuous, filling mouth)', value: 'heavy', next: 'bleeding_alert', setPriority: 'CRITICAL' }
        ]
    }],

    ['bleeding_advice_normal', {
        id: 'bleeding_advice_normal',
        type: 'response',
        message: 'Slight oozing is normal for 24 hours. Bite on a moist gauze for 30 minutes. Avoid spitting, let saliva fall into a cup.',
        next: 'end_monitoring'
    }],

    ['bleeding_advice_moderate', {
        id: 'bleeding_advice_moderate',
        type: 'response',
        message: 'Bite firmly on moist gauze for 45 minutes. Avoid hot drinks. If bleeding continues, we need to see you.',
        action: {
            type: 'create_alert',
            payload: { priority: 'YELLOW', reason: 'Moderate bleeding' }
        },
        next: 'check_bleeding_again'
    }],

    ['check_bleeding_again', {
        id: 'check_bleeding_again',
        type: 'question',
        message: 'After 45 minutes of biting on gauze, has the bleeding reduced?',
        options: [
            { id: 'yes', label: 'Yes, it\'s better', value: 'yes', next: 'end_monitoring', setPriority: 'GREEN' },
            { id: 'no', label: 'No, still bleeding', value: 'no', next: 'bleeding_alert', setPriority: 'RED' }
        ]
    }],

    ['bleeding_alert', {
        id: 'bleeding_alert',
        type: 'response',
        message: '🚨 Heavy bleeding requires immediate attention. Continue biting on gauze. We are contacting you NOW.',
        action: {
            type: 'create_alert',
            payload: { priority: 'CRITICAL', reason: 'Heavy bleeding', emergency: true }
        },
        next: 'end_emergency'
    }],

    // Fever check
    ['fever_check', {
        id: 'fever_check',
        type: 'question',
        message: 'Do you have a fever?',
        options: [
            { id: 'no', label: 'No fever', value: 'no', next: 'end_monitoring', setPriority: 'GREEN' },
            { id: 'low', label: 'Low grade (99-100°F)', value: 'low', next: 'fever_advice_low', setPriority: 'YELLOW' },
            { id: 'high', label: 'High (101°F+)', value: 'high', next: 'fever_alert', setPriority: 'CRITICAL' }
        ]
    }],

    ['fever_alert', {
        id: 'fever_alert',
        type: 'response',
        message: '🚨 Fever after a dental procedure needs immediate attention. This could indicate infection. We are calling you immediately.',
        action: {
            type: 'create_alert',
            payload: { priority: 'CRITICAL', reason: 'High fever post-procedure', emergency: true }
        },
        next: 'end_emergency'
    }],

    // Concern branch
    ['concern_type', {
        id: 'concern_type',
        type: 'question',
        message: 'What are you concerned about?',
        options: [
            { id: 'pain', label: 'Pain not reducing', value: 'pain', next: 'pain_type' },
            { id: 'bite', label: 'Bite feels off', value: 'bite', next: 'bite_issue' },
            { id: 'filling', label: 'Filling/temp came out', value: 'filling', next: 'filling_issue' },
            { id: 'numbness', label: 'Prolonged numbness', value: 'numbness', next: 'numbness_check' },
            { id: 'other', label: 'Something else', value: 'other', next: 'other_concern' }
        ]
    }],

    ['bite_issue', {
        id: 'bite_issue',
        type: 'response',
        message: 'If your bite feels high or uncomfortable when chewing, we\'ll need to adjust it. Please schedule a quick visit - this is a simple fix.',
        action: {
            type: 'schedule_callback',
            payload: { reason: 'Bite adjustment needed' }
        },
        next: 'end_scheduled'
    }],

    ['filling_issue', {
        id: 'filling_issue',
        type: 'response',
        message: 'If your temporary filling came out, avoid chewing on that side. Call us to get it replaced as soon as possible to protect the tooth.',
        action: {
            type: 'create_alert',
            payload: { priority: 'YELLOW', reason: 'Temporary filling dislodged' }
        },
        next: 'end_scheduled'
    }],

    ['numbness_check', {
        id: 'numbness_check',
        type: 'question',
        message: 'How long has the numbness persisted?',
        options: [
            { id: 'hours', label: 'Few hours (normal)', value: 'hours', next: 'numbness_normal', setPriority: 'GREEN' },
            { id: 'day', label: 'More than 24 hours', value: 'day', next: 'numbness_alert', setPriority: 'RED' }
        ]
    }],

    ['numbness_alert', {
        id: 'numbness_alert',
        type: 'response',
        message: 'Prolonged numbness is unusual and we need to evaluate it. Please come in for a check-up.',
        action: {
            type: 'create_alert',
            payload: { priority: 'RED', reason: 'Prolonged numbness (>24h)' }
        },
        next: 'end_scheduled'
    }],

    // Emergency branch
    ['emergency_type', {
        id: 'emergency_type',
        type: 'question',
        message: 'What emergency are you experiencing?',
        options: [
            { id: 'breathing', label: 'Difficulty breathing', value: 'breathing', next: 'call_emergency', setPriority: 'CRITICAL' },
            { id: 'heavy_bleeding', label: 'Uncontrolled bleeding', value: 'heavy_bleeding', next: 'bleeding_alert', setPriority: 'CRITICAL' },
            { id: 'severe_swelling', label: 'Swelling closing throat', value: 'severe_swelling', next: 'call_emergency', setPriority: 'CRITICAL' },
            { id: 'high_fever', label: 'High fever with chills', value: 'high_fever', next: 'fever_alert', setPriority: 'CRITICAL' }
        ]
    }],

    ['call_emergency', {
        id: 'call_emergency',
        type: 'response',
        message: '🚨 CALL 108 (EMERGENCY) IMMEDIATELY! This requires hospital care. While waiting for the ambulance, stay calm and do not lie flat.',
        action: {
            type: 'create_alert',
            payload: { priority: 'CRITICAL', reason: 'Life-threatening emergency', callAmbulance: true }
        },
        next: 'end_emergency'
    }],

    // End nodes
    ['end_good', {
        id: 'end_good',
        type: 'end',
        message: '🎉 Great to hear! Keep following the care instructions. We\'ll check on you again tomorrow. Take care!'
    }],

    ['end_monitoring', {
        id: 'end_monitoring',
        type: 'end',
        message: '👍 We\'re keeping an eye on your recovery. If anything changes, tap the "Report Issue" button anytime. Wishing you a quick recovery!'
    }],

    ['end_urgent', {
        id: 'end_urgent',
        type: 'end',
        message: '📞 A team member will call you within 1 hour. Please keep your phone handy. If symptoms worsen, call us or visit immediately.'
    }],

    ['end_scheduled', {
        id: 'end_scheduled',
        type: 'end',
        message: '📅 We\'ll reach out to schedule a quick follow-up visit. In the meantime, follow your care instructions.'
    }],

    ['end_emergency', {
        id: 'end_emergency',
        type: 'end',
        message: '🆘 This is a priority case. Help is on the way. Stay calm, keep your phone with you, and follow emergency instructions.'
    }]
]);

// =============================================================================
// SLA MONITOR SERVICE
// =============================================================================

export class SLAMonitorService {
    private readonly SLA_HOURS = 18;
    private readonly ESCALATION_SCHEDULE = [
        { hours: 0, level: 0, action: 'Initial alert sent' },
        { hours: 6, level: 1, action: 'First reminder' },
        { hours: 12, level: 2, action: 'Second reminder (SMS/WhatsApp)' },
        { hours: 17, level: 3, action: 'Final warning' },
        { hours: 18, level: 4, action: 'SLA breach - penalty applied' }
    ];

    /**
     * Create a new complication report
     */
    createComplicationReport(
        checkIn: PatientCheckIn,
        symptom: string,
        severity: AlertPriority,
        painLevel?: number,
        additionalDetails?: string,
        patientPhone?: string
    ): ComplicationReport {
        const reportedAt = new Date();
        const slaDeadline = new Date(reportedAt.getTime() + this.SLA_HOURS * 60 * 60 * 1000);

        return {
            id: uuid(),
            checkInId: checkIn.id,
            patientId: checkIn.patientId,
            patientName: checkIn.patientName,
            patientPhone: patientPhone || '',
            procedureCode: checkIn.procedureCode,
            procedureName: checkIn.procedureName,
            clinicId: checkIn.clinicId,
            doctorId: checkIn.doctorId,
            symptom,
            severity,
            painLevel,
            additionalDetails,
            reportedAt,
            slaDeadline,
            escalationLevel: 0,
            escalationHistory: [{
                level: 0,
                triggeredAt: reportedAt,
                action: 'Complication reported - Alert created',
                channel: 'dashboard',
                recipient: 'clinic_admin'
            }],
            penaltyApplied: false,
            apologyMessageSent: false
        };
    }

    /**
     * Check SLA status for a complication
     */
    checkSLAStatus(report: ComplicationReport): SLACheckResult {
        const now = new Date();
        const hoursElapsed = (now.getTime() - report.reportedAt.getTime()) / (1000 * 60 * 60);
        const hoursRemaining = Math.max(0, this.SLA_HOURS - hoursElapsed);

        // Already resolved
        if (report.respondedAt) {
            return {
                complicationId: report.id,
                hoursElapsed,
                hoursRemaining,
                escalationLevel: report.escalationLevel,
                requiresAction: false
            };
        }

        // Find current escalation level
        let currentLevel = 0;
        for (const schedule of this.ESCALATION_SCHEDULE) {
            if (hoursElapsed >= schedule.hours) {
                currentLevel = schedule.level;
            }
        }

        // Check if escalation needed
        if (currentLevel > report.escalationLevel) {
            const action = this.getEscalationAction(currentLevel);
            return {
                complicationId: report.id,
                hoursElapsed,
                hoursRemaining,
                escalationLevel: currentLevel,
                requiresAction: true,
                action: action.type,
                recipient: action.recipient,
                message: action.message
            };
        }

        return {
            complicationId: report.id,
            hoursElapsed,
            hoursRemaining,
            escalationLevel: report.escalationLevel,
            requiresAction: false
        };
    }

    /**
     * Get escalation action for a level
     */
    private getEscalationAction(level: number): {
        type: 'send_reminder' | 'final_warning' | 'apply_penalty';
        recipient: string;
        message: string;
    } {
        switch (level) {
            case 1:
                return {
                    type: 'send_reminder',
                    recipient: 'doctor',
                    message: 'Reminder: You have an unresolved patient complication. Please respond within 12 hours.'
                };
            case 2:
                return {
                    type: 'send_reminder',
                    recipient: 'doctor,admin',
                    message: '⚠️ URGENT: Patient complication pending response. 6 hours remaining before SLA breach.'
                };
            case 3:
                return {
                    type: 'final_warning',
                    recipient: 'doctor,admin',
                    message: '🚨 FINAL WARNING: 1 hour left to respond to patient complication. SLA breach imminent.'
                };
            case 4:
                return {
                    type: 'apply_penalty',
                    recipient: 'patient',
                    message: this.getAutoApologyMessage()
                };
            default:
                return {
                    type: 'send_reminder',
                    recipient: 'admin',
                    message: 'New complication reported. Please review.'
                };
        }
    }

    /**
     * Process escalation for a complication
     */
    processEscalation(
        report: ComplicationReport,
        slaCheck: SLACheckResult
    ): {
        updatedReport: ComplicationReport;
        notifications: Array<{
            channel: 'push' | 'sms' | 'whatsapp' | 'dashboard';
            recipient: string;
            message: string;
        }>;
        penaltyApplied: boolean;
    } {
        const notifications: Array<{
            channel: 'push' | 'sms' | 'whatsapp' | 'dashboard';
            recipient: string;
            message: string;
        }> = [];

        let penaltyApplied = false;

        // Add escalation to history
        const escalationEvent: EscalationEvent = {
            level: slaCheck.escalationLevel,
            triggeredAt: new Date(),
            action: this.ESCALATION_SCHEDULE.find(s => s.level === slaCheck.escalationLevel)?.action || '',
            channel: slaCheck.escalationLevel >= 2 ? 'sms' : 'push',
            recipient: slaCheck.recipient || 'clinic_admin'
        };

        const updatedReport: ComplicationReport = {
            ...report,
            escalationLevel: slaCheck.escalationLevel,
            escalationHistory: [...report.escalationHistory, escalationEvent]
        };

        // Generate notifications based on level
        if (slaCheck.action === 'send_reminder') {
            const recipients = slaCheck.recipient?.split(',') || ['admin'];
            for (const recipient of recipients) {
                notifications.push({
                    channel: slaCheck.escalationLevel >= 2 ? 'sms' : 'push',
                    recipient: recipient.trim(),
                    message: slaCheck.message || ''
                });
            }
        } else if (slaCheck.action === 'final_warning') {
            notifications.push({
                channel: 'sms',
                recipient: 'doctor',
                message: slaCheck.message || ''
            });
            notifications.push({
                channel: 'whatsapp',
                recipient: 'admin',
                message: slaCheck.message || ''
            });
        } else if (slaCheck.action === 'apply_penalty') {
            // Send auto-apology to patient
            notifications.push({
                channel: 'sms',
                recipient: 'patient',
                message: this.getAutoApologyMessage()
            });
            notifications.push({
                channel: 'push',
                recipient: 'patient',
                message: this.getAutoApologyMessage()
            });

            updatedReport.penaltyApplied = true;
            updatedReport.apologyMessageSent = true;
            penaltyApplied = true;
        }

        return { updatedReport, notifications, penaltyApplied };
    }

    /**
     * Mark complication as responded
     */
    respondToComplication(
        report: ComplicationReport,
        respondedBy: string,
        responseNote: string,
        resolution: ComplicationReport['resolution']
    ): ComplicationReport {
        return {
            ...report,
            respondedAt: new Date(),
            respondedBy,
            responseNote,
            resolution
        };
    }

    /**
     * Get auto-apology message
     */
    private getAutoApologyMessage(): string {
        return `Noble Dental Care apologizes for the delayed response to your concern. Your health is our priority. A team member will contact you immediately. If urgent, please call us directly. - Noble Dental Care`;
    }

    /**
     * Calculate time remaining display
     */
    getTimeRemainingDisplay(report: ComplicationReport): {
        hours: number;
        minutes: number;
        display: string;
        urgencyClass: 'green' | 'yellow' | 'red' | 'critical';
    } {
        const now = new Date();
        const remaining = report.slaDeadline.getTime() - now.getTime();

        if (remaining <= 0 || report.respondedAt) {
            return {
                hours: 0,
                minutes: 0,
                display: report.respondedAt ? 'Responded' : 'SLA Breached',
                urgencyClass: report.respondedAt ? 'green' : 'critical'
            };
        }

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        let urgencyClass: 'green' | 'yellow' | 'red' | 'critical';
        if (hours >= 12) urgencyClass = 'green';
        else if (hours >= 6) urgencyClass = 'yellow';
        else if (hours >= 1) urgencyClass = 'red';
        else urgencyClass = 'critical';

        return {
            hours,
            minutes,
            display: `${hours}h ${minutes}m remaining`,
            urgencyClass
        };
    }
}

export const slaMonitorService = new SLAMonitorService();
