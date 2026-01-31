/**
 * Phase 26: Post-Op Recovery Protocol Engine
 * 
 * Procedure-specific recovery timelines with smart triggers
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export type ProcedureCategory = 'SURGICAL' | 'RESTORATIVE' | 'ENDODONTICS' | 'PREVENTIVE' | 'PROSTHETICS' | 'ORTHODONTICS';
export type NotificationChannel = 'push' | 'sms' | 'whatsapp' | 'in_app';
export type AlertPriority = 'GREEN' | 'YELLOW' | 'RED' | 'CRITICAL';

export interface RecoveryNotification {
    id: string;
    triggerTime: string; // T+30m, T+2h, T+Day1, etc.
    triggerMs: number; // Milliseconds from procedure completion
    title: string;
    message: string;
    action?: string;
    isCheckIn?: boolean; // Requires patient response
    channels: NotificationChannel[];
}

export interface PostOpProtocol {
    procedureCode: string;
    procedureName: string;
    category: ProcedureCategory;
    recoveryDays: number;
    notifications: RecoveryNotification[];
    checkInQuestions: CheckInQuestion[];
    redFlags: string[];
    prescriptionDefaults?: string[];
}

export interface CheckInQuestion {
    id: string;
    triggerTime: string;
    question: string;
    type: 'scale' | 'yesno' | 'multiple' | 'text';
    options?: string[];
    followUp?: {
        condition: string;
        question: CheckInQuestion;
    };
    alertThreshold?: {
        value: number | string;
        priority: AlertPriority;
    };
}

export interface PatientCheckIn {
    id: string;
    appointmentId: string;
    patientId: string;
    patientName: string;
    procedureCode: string;
    procedureName: string;
    doctorId: string;
    clinicId: string;
    completedAt: Date;

    // Check-in responses
    responses: Array<{
        questionId: string;
        question: string;
        answer: string | number;
        answeredAt: Date;
    }>;

    // Status
    currentPriority: AlertPriority;
    lastCheckInAt?: Date;
    nextCheckInAt?: Date;

    // Escalation
    complicationReported: boolean;
    complicationDetails?: string;
    alertSentAt?: Date;
    respondedAt?: Date;
    respondedBy?: string;
    responseNote?: string;

    // Timeline
    recoveryEndDate: Date;
    isRecoveryComplete: boolean;
}

// =============================================================================
// POST-OP PROTOCOLS MAP
// =============================================================================

export const POST_OP_PROTOCOLS: Map<string, PostOpProtocol> = new Map([
    // =========================================================================
    // SURGICAL PROCEDURES
    // =========================================================================
    ['EXTRACTION', {
        procedureCode: 'EXTRACTION',
        procedureName: 'Tooth Extraction',
        category: 'SURGICAL',
        recoveryDays: 3,
        notifications: [
            {
                id: 'EXT_30M',
                triggerTime: 'T+30m',
                triggerMs: 30 * 60 * 1000,
                title: 'Post-Extraction Care',
                message: 'Remove the cotton gauze now. Avoid talking for the next hour. Bite gently if bleeding restarts.',
                channels: ['push', 'sms']
            },
            {
                id: 'EXT_2H',
                triggerTime: 'T+2h',
                triggerMs: 2 * 60 * 60 * 1000,
                title: 'Ice Pack Reminder',
                message: 'Apply an ice pack to your cheek (15 min on, 15 min off). Drink only cold liquids. Stay hydrated!',
                channels: ['push']
            },
            {
                id: 'EXT_6H',
                triggerTime: 'T+6h',
                triggerMs: 6 * 60 * 60 * 1000,
                title: 'Evening Check',
                message: 'How are you feeling? Slight oozing is normal. Avoid hot foods and DO NOT SPIT.',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'EXT_DAY1_AM',
                triggerTime: 'T+Day1 AM',
                triggerMs: 18 * 60 * 60 * 1000,
                title: 'Good Morning!',
                message: 'Start gentle salt water rinses today. Let the water fall out naturally - DON\'T SPIT. Take your medication.',
                isCheckIn: true,
                channels: ['push', 'sms']
            },
            {
                id: 'EXT_DAY2',
                triggerTime: 'T+Day2',
                triggerMs: 42 * 60 * 60 * 1000,
                title: 'Day 2 Check-in',
                message: 'How is your recovery? Any swelling should start reducing. Continue salt water rinses.',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'EXT_DAY3',
                triggerTime: 'T+Day3',
                triggerMs: 66 * 60 * 60 * 1000,
                title: 'Final Recovery Check',
                message: 'Almost healed! You can gradually return to normal foods. Contact us if any concerns persist.',
                isCheckIn: true,
                channels: ['push']
            }
        ],
        checkInQuestions: [
            {
                id: 'EXT_PAIN',
                triggerTime: 'T+Day1',
                question: 'Rate your pain level (1-10)',
                type: 'scale',
                alertThreshold: { value: 7, priority: 'RED' }
            },
            {
                id: 'EXT_BLEEDING',
                triggerTime: 'T+6h',
                question: 'Is there any bleeding?',
                type: 'yesno',
                followUp: {
                    condition: 'yes',
                    question: {
                        id: 'EXT_BLEEDING_AMOUNT',
                        triggerTime: 'T+6h',
                        question: 'How much bleeding?',
                        type: 'multiple',
                        options: ['Slight oozing (normal)', 'Moderate', 'Heavy/continuous'],
                        alertThreshold: { value: 'Heavy/continuous', priority: 'CRITICAL' }
                    }
                }
            },
            {
                id: 'EXT_SWELLING',
                triggerTime: 'T+Day1',
                question: 'Do you have any swelling?',
                type: 'multiple',
                options: ['None', 'Mild (expected)', 'Moderate', 'Severe'],
                alertThreshold: { value: 'Severe', priority: 'RED' }
            },
            {
                id: 'EXT_FEVER',
                triggerTime: 'T+Day1',
                question: 'Do you have fever?',
                type: 'yesno',
                alertThreshold: { value: 'yes', priority: 'CRITICAL' }
            }
        ],
        redFlags: ['Fever above 100°F', 'Uncontrolled bleeding', 'Severe swelling', 'Difficulty breathing', 'Numbness persisting >24h'],
        prescriptionDefaults: ['Antibiotics', 'Pain medication', 'Antiseptic mouthwash']
    }],

    ['IMPLANT', {
        procedureCode: 'IMPLANT',
        procedureName: 'Dental Implant Surgery',
        category: 'SURGICAL',
        recoveryDays: 7,
        notifications: [
            {
                id: 'IMP_30M',
                triggerTime: 'T+30m',
                triggerMs: 30 * 60 * 1000,
                title: 'Post-Implant Care',
                message: 'Keep biting on the gauze. No talking, no rinsing for 2 hours.',
                channels: ['push', 'sms']
            },
            {
                id: 'IMP_2H',
                triggerTime: 'T+2h',
                triggerMs: 2 * 60 * 60 * 1000,
                title: 'Ice Pack Time',
                message: 'Apply ice pack 20 min on/20 min off. Stick to cold liquids only. Take your antibiotics.',
                channels: ['push']
            },
            {
                id: 'IMP_6H',
                triggerTime: 'T+6h',
                triggerMs: 6 * 60 * 60 * 1000,
                title: 'Evening Care',
                message: 'Soft cold foods only. Sleep with head elevated. Avoid touching the implant site.',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'IMP_DAY1',
                triggerTime: 'T+Day1',
                triggerMs: 20 * 60 * 60 * 1000,
                title: 'Day 1 Check-in',
                message: 'Some swelling and bruising is normal. Continue ice packs and medication. Gentle salt water rinses OK.',
                isCheckIn: true,
                channels: ['push', 'sms']
            },
            {
                id: 'IMP_DAY3',
                triggerTime: 'T+Day3',
                triggerMs: 68 * 60 * 60 * 1000,
                title: 'Day 3 Check-in',
                message: 'Swelling should peak today and start reducing. Keep the area clean. Any concerns?',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'IMP_DAY7',
                triggerTime: 'T+Day7',
                triggerMs: 164 * 60 * 60 * 1000,
                title: 'Week 1 Complete!',
                message: 'Great progress! Continue gentle oral hygiene. Your follow-up appointment is coming soon.',
                isCheckIn: true,
                channels: ['push']
            }
        ],
        checkInQuestions: [
            {
                id: 'IMP_PAIN',
                triggerTime: 'T+Day1',
                question: 'Rate your pain level (1-10)',
                type: 'scale',
                alertThreshold: { value: 7, priority: 'RED' }
            },
            {
                id: 'IMP_SWELLING',
                triggerTime: 'T+Day3',
                question: 'How is the swelling?',
                type: 'multiple',
                options: ['Reducing (good!)', 'Same as yesterday', 'Increasing'],
                alertThreshold: { value: 'Increasing', priority: 'RED' }
            },
            {
                id: 'IMP_FEVER',
                triggerTime: 'T+Day1',
                question: 'Do you have fever or chills?',
                type: 'yesno',
                alertThreshold: { value: 'yes', priority: 'CRITICAL' }
            }
        ],
        redFlags: ['Implant feels loose', 'Fever', 'Pus/discharge', 'Increasing pain after Day 3', 'Gum line turning dark'],
        prescriptionDefaults: ['Antibiotics (7 days)', 'Pain medication', 'Chlorhexidine rinse']
    }],

    // =========================================================================
    // RESTORATIVE PROCEDURES
    // =========================================================================
    ['FILLING', {
        procedureCode: 'FILLING',
        procedureName: 'Dental Filling',
        category: 'RESTORATIVE',
        recoveryDays: 1,
        notifications: [
            {
                id: 'FILL_2H',
                triggerTime: 'T+2h',
                triggerMs: 2 * 60 * 60 * 1000,
                title: 'Anesthesia Wearing Off',
                message: 'Numbness should start fading. Avoid biting your cheek! You can eat now.',
                channels: ['push']
            },
            {
                id: 'FILL_4H',
                triggerTime: 'T+4h',
                triggerMs: 4 * 60 * 60 * 1000,
                title: 'Bite Check',
                message: 'When you bite, does the filling feel too high? Let us know if your bite feels off.',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'FILL_12H',
                triggerTime: 'T+12h',
                triggerMs: 12 * 60 * 60 * 1000,
                title: 'How\'s Your Filling?',
                message: 'Any sensitivity? Mild sensitivity to cold is normal for a few days.',
                isCheckIn: true,
                channels: ['push']
            }
        ],
        checkInQuestions: [
            {
                id: 'FILL_BITE',
                triggerTime: 'T+4h',
                question: 'Does your bite feel normal?',
                type: 'yesno',
                alertThreshold: { value: 'no', priority: 'YELLOW' }
            },
            {
                id: 'FILL_SENSITIVITY',
                triggerTime: 'T+12h',
                question: 'Any sensitivity when eating?',
                type: 'multiple',
                options: ['None', 'Mild to cold/hot (normal)', 'Sharp pain when biting'],
                alertThreshold: { value: 'Sharp pain when biting', priority: 'YELLOW' }
            }
        ],
        redFlags: ['Sharp pain when biting', 'Filling feels loose', 'Significant sensitivity after 1 week'],
        prescriptionDefaults: []
    }],

    // =========================================================================
    // ENDODONTICS
    // =========================================================================
    ['RCT', {
        procedureCode: 'RCT',
        procedureName: 'Root Canal Treatment',
        category: 'ENDODONTICS',
        recoveryDays: 3,
        notifications: [
            {
                id: 'RCT_2H',
                triggerTime: 'T+2h',
                triggerMs: 2 * 60 * 60 * 1000,
                title: 'Post-RCT Care',
                message: 'Wait for numbness to wear off before eating. Take your prescribed pain medication.',
                channels: ['push']
            },
            {
                id: 'RCT_6H',
                triggerTime: 'T+6h',
                triggerMs: 6 * 60 * 60 * 1000,
                title: 'Evening Check',
                message: 'Some discomfort is normal. Avoid chewing on that side. Is the temporary filling intact?',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'RCT_DAY1',
                triggerTime: 'T+Day1',
                triggerMs: 20 * 60 * 60 * 1000,
                title: 'Day 1 Check-in',
                message: 'How are you feeling? Tenderness when biting is common. Stick to soft foods.',
                isCheckIn: true,
                channels: ['push', 'sms']
            },
            {
                id: 'RCT_DAY3',
                triggerTime: 'T+Day3',
                triggerMs: 68 * 60 * 60 * 1000,
                title: 'Recovery Check',
                message: 'Pain should be significantly better. Remember: Get your crown done to protect the tooth!',
                isCheckIn: true,
                channels: ['push']
            }
        ],
        checkInQuestions: [
            {
                id: 'RCT_PAIN',
                triggerTime: 'T+Day1',
                question: 'Rate your pain level (1-10)',
                type: 'scale',
                alertThreshold: { value: 7, priority: 'RED' }
            },
            {
                id: 'RCT_PERCUSSION',
                triggerTime: 'T+Day1',
                question: 'Does it hurt when you tap on the tooth?',
                type: 'multiple',
                options: ['No pain', 'Mild tenderness (normal)', 'Sharp pain'],
                alertThreshold: { value: 'Sharp pain', priority: 'YELLOW' }
            },
            {
                id: 'RCT_TEMP_FILLING',
                triggerTime: 'T+6h',
                question: 'Is your temporary filling intact?',
                type: 'yesno',
                alertThreshold: { value: 'no', priority: 'YELLOW' }
            },
            {
                id: 'RCT_SWELLING',
                triggerTime: 'T+Day1',
                question: 'Any swelling around the tooth?',
                type: 'yesno',
                alertThreshold: { value: 'yes', priority: 'RED' }
            }
        ],
        redFlags: ['Temporary filling falls out', 'Increasing pain after Day 2', 'Swelling', 'Fever', 'Gum boil'],
        prescriptionDefaults: ['Antibiotics (if infected)', 'Pain medication']
    }],

    // =========================================================================
    // PREVENTIVE
    // =========================================================================
    ['SCALING', {
        procedureCode: 'SCALING',
        procedureName: 'Dental Scaling/Cleaning',
        category: 'PREVENTIVE',
        recoveryDays: 1,
        notifications: [
            {
                id: 'SCALE_2H',
                triggerTime: 'T+2h',
                triggerMs: 2 * 60 * 60 * 1000,
                title: 'Post-Scaling Care',
                message: 'Avoid hot foods for 2 hours. Some sensitivity is normal today.',
                channels: ['push']
            },
            {
                id: 'SCALE_4H',
                triggerTime: 'T+4h',
                triggerMs: 4 * 60 * 60 * 1000,
                title: 'Bleeding Check',
                message: 'Any bleeding should have stopped by now. Use your prescribed mouthwash tonight.',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'SCALE_DAY1',
                triggerTime: 'T+Day1',
                triggerMs: 20 * 60 * 60 * 1000,
                title: 'Day After Care',
                message: 'Avoid spicy and acidic foods today. Continue using the antiseptic mouthwash. Gums feel better?',
                isCheckIn: true,
                channels: ['push']
            }
        ],
        checkInQuestions: [
            {
                id: 'SCALE_BLEEDING',
                triggerTime: 'T+4h',
                question: 'Is there any bleeding from gums?',
                type: 'yesno',
                alertThreshold: { value: 'yes', priority: 'YELLOW' }
            },
            {
                id: 'SCALE_SENSITIVITY',
                triggerTime: 'T+Day1',
                question: 'How is the sensitivity?',
                type: 'multiple',
                options: ['None', 'Mild (normal)', 'Significant'],
                alertThreshold: { value: 'Significant', priority: 'YELLOW' }
            }
        ],
        redFlags: ['Bleeding lasting >24h', 'Fever', 'Severe pain'],
        prescriptionDefaults: ['Antiseptic mouthwash']
    }],

    ['WHITENING', {
        procedureCode: 'WHITENING',
        procedureName: 'Teeth Whitening',
        category: 'PREVENTIVE',
        recoveryDays: 2,
        notifications: [
            {
                id: 'WHITE_2H',
                triggerTime: 'T+2h',
                triggerMs: 2 * 60 * 60 * 1000,
                title: 'Sensitivity Alert',
                message: 'Some sensitivity is normal. Avoid very hot or cold foods today.',
                channels: ['push']
            },
            {
                id: 'WHITE_12H',
                triggerTime: 'T+12h',
                triggerMs: 12 * 60 * 60 * 1000,
                title: 'White Diet Reminder',
                message: 'IMPORTANT: For 48 hours, avoid colored foods/drinks (coffee, tea, red wine, curry). Maintain your white smile!',
                channels: ['push', 'sms']
            },
            {
                id: 'WHITE_DAY1',
                triggerTime: 'T+Day1',
                triggerMs: 20 * 60 * 60 * 1000,
                title: 'Day 1 Check',
                message: 'How are your teeth feeling? Sensitivity should be reducing. Still following the white diet?',
                isCheckIn: true,
                channels: ['push']
            },
            {
                id: 'WHITE_DAY2',
                triggerTime: 'T+Day2',
                triggerMs: 44 * 60 * 60 * 1000,
                title: 'All Clear!',
                message: 'You can now eat normally! Use a straw for dark drinks to maintain your results longer.',
                channels: ['push']
            }
        ],
        checkInQuestions: [
            {
                id: 'WHITE_SENSITIVITY',
                triggerTime: 'T+Day1',
                question: 'How is the sensitivity?',
                type: 'scale',
                alertThreshold: { value: 7, priority: 'YELLOW' }
            }
        ],
        redFlags: ['Severe sensitivity lasting >48h', 'Gum irritation'],
        prescriptionDefaults: ['Sensitivity toothpaste recommended']
    }]
]);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get protocol for a procedure
 */
export function getProtocol(procedureCode: string): PostOpProtocol | undefined {
    return POST_OP_PROTOCOLS.get(procedureCode);
}

/**
 * Get all procedures by category
 */
export function getProceduresByCategory(category: ProcedureCategory): PostOpProtocol[] {
    const protocols: PostOpProtocol[] = [];
    POST_OP_PROTOCOLS.forEach((protocol) => {
        if (protocol.category === category) {
            protocols.push(protocol);
        }
    });
    return protocols;
}

/**
 * Schedule notifications for a patient
 */
export function schedulePostOpNotifications(
    protocol: PostOpProtocol,
    procedureCompletedAt: Date
): Array<{
    notification: RecoveryNotification;
    scheduledFor: Date;
}> {
    return protocol.notifications.map(notification => ({
        notification,
        scheduledFor: new Date(procedureCompletedAt.getTime() + notification.triggerMs)
    }));
}

/**
 * Create a new patient check-in record
 */
export function createPatientCheckIn(
    appointmentId: string,
    patientId: string,
    patientName: string,
    procedureCode: string,
    procedureName: string,
    doctorId: string,
    clinicId: string,
    completedAt: Date
): PatientCheckIn {
    const protocol = getProtocol(procedureCode);
    const recoveryDays = protocol?.recoveryDays || 3;

    return {
        id: uuid(),
        appointmentId,
        patientId,
        patientName,
        procedureCode,
        procedureName,
        doctorId,
        clinicId,
        completedAt,
        responses: [],
        currentPriority: 'GREEN',
        complicationReported: false,
        recoveryEndDate: new Date(completedAt.getTime() + recoveryDays * 24 * 60 * 60 * 1000),
        isRecoveryComplete: false
    };
}
