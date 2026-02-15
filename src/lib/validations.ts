/**
 * Zod Validation Schemas for NOBLE-OS
 * 
 * These schemas enforce type safety and input validation for all API endpoints.
 * Critical for preventing injection attacks and data corruption.
 */

import { z } from "zod";

// ============================================================================
// Common Schemas
// ============================================================================

export const uhidSchema = z.string().regex(/^NH-\d{6}$/, "Invalid UHID format");
export const phoneSchema = z.string().regex(/^\+91\s?\d{10}$/, "Invalid phone number");
export const emailSchema = z.string().email("Invalid email address");
export const dateSchema = z.string().datetime().or(z.date());

// ============================================================================
// Patient Schemas
// ============================================================================

export const createPatientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    phone: phoneSchema,
    email: emailSchema.optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    bloodGroup: z.string().optional(),
    address: z.string().max(500).optional(),
    emergencyContact: z.object({
        name: z.string(),
        phone: phoneSchema,
        relationship: z.string()
    }).optional(),
    medicalHistory: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional()
});

export const updatePatientSchema = createPatientSchema.partial().extend({
    uhid: uhidSchema
});

// ============================================================================
// Appointment Schemas
// ============================================================================

export const createAppointmentSchema = z.object({
    patientId: z.string().uuid("Invalid patient ID"),
    doctorId: z.string().uuid("Invalid doctor ID"),
    date: dateSchema,
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    type: z.enum([
        "CONSULTATION",
        "ROOT_CANAL",
        "EXTRACTION",
        "CLEANING",
        "FILLING",
        "CROWN",
        "IMPLANT",
        "ORTHODONTICS",
        "CHECKUP"
    ]),
    duration: z.number().int().min(15).max(240), // 15 mins to 4 hours
    notes: z.string().max(1000).optional(),
    isFamily: z.boolean().optional()
});

export const updateAppointmentStatusSchema = z.object({
    appointmentId: z.string().uuid(),
    status: z.enum(["confirmed", "arrived", "ongoing", "completed", "cancelled", "no_show"]),
    updatedBy: z.string().uuid(), // User ID who made the change
    reason: z.string().max(500).optional() // Required for cancellation/no-show
});

// ============================================================================
// Clinical Notes Schemas
// ============================================================================

export const createClinicalNoteSchema = z.object({
    patientId: z.string().uuid(),
    appointmentId: z.string().uuid().optional(),
    doctorId: z.string().uuid(),
    chiefComplaint: z.string().min(1).max(1000),
    examination: z.string().max(2000).optional(),
    diagnosis: z.string().max(1000),
    treatment: z.string().max(2000),
    prescription: z.array(z.object({
        medication: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        duration: z.string(),
        instructions: z.string().optional()
    })).optional(),
    followUpDate: dateSchema.optional(),
    attachments: z.array(z.string().url()).optional(),
    teethAffected: z.array(z.number().int().min(11).max(85)).optional() // FDI notation
});

// ============================================================================
// Clinical Visit Schemas (Full Cockpit Snapshot)
// ============================================================================

export const createClinicalVisitSchema = z.object({
    patientId: z.string(),
    visitId: z.string(),
    // Phase data
    chiefComplaints: z.array(z.object({
        id: z.string(),
        label: z.string(),
        value: z.string(),
        toothNumbers: z.array(z.number()).optional()
    })).default([]),
    medications: z.array(z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        duration: z.string().optional(),
        isActive: z.boolean(),
        riskFlags: z.array(z.string()).default([])
    })).default([]),
    vitals: z.array(z.object({
        temperature: z.number().optional(),
        bpSystolic: z.number().optional(),
        bpDiastolic: z.number().optional(),
        heartRate: z.number().optional(),
        spo2: z.number().optional(),
        respiratoryRate: z.number().optional(),
        cns: z.string().optional(),
        recordedAt: z.string(),
        type: z.enum(['PRE_OP', 'POST_OP', 'ROUTINE'])
    })).default([]),
    diagnoses: z.array(z.object({
        diagnosis: z.string(),
        icdCode: z.string(),
        category: z.string(),
        confidence: z.number(),
        toothNumbers: z.array(z.number()),
        isProvisional: z.boolean(),
        confirmedAt: z.string().optional()
    })).default([]),
    procedures: z.array(z.object({
        id: z.string(),
        code: z.string(),
        name: z.string(),
        category: z.string(),
        toothNumbers: z.array(z.number()),
        managementType: z.enum(['MEDICAL', 'SURGICAL']).nullable(),
        anesthesiaMode: z.enum(['LA', 'GA']).nullable(),
        status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']),
        restorationMaterial: z.string().optional(),
        smartNoteTemplate: z.string().optional(),
        smartNoteEdited: z.string().optional(),
        completedAt: z.string().optional()
    })).default([]),
    prescriptions: z.array(z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        duration: z.string().optional(),
        isActive: z.boolean(),
        riskFlags: z.array(z.string()).default([])
    })).default([]),
    toothState: z.record(z.string(), z.any()).default({}),
    maternity: z.object({
        isApplicable: z.boolean(),
        isPregnant: z.boolean(),
        pregnancyMonth: z.number().optional(),
        trimester: z.number().optional(),
        lmpDate: z.string().optional(),
        isNursing: z.boolean(),
        deliveryDate: z.string().optional()
    }).optional(),
    anesthesiaLog: z.object({
        drugType: z.string(),
        concentration: z.string(),
        adrenalineRatio: z.string().optional(),
        dosage: z.string(),
        blockType: z.string(),
        notes: z.string().optional()
    }).nullable().optional(),
    warsScore: z.object({
        wintersClass: z.string(),
        pellGregoryClass: z.string(),
        pellGregoryPosition: z.string(),
        ramusRelation: z.string(),
        angulation: z.number(),
        difficultyGrade: z.string()
    }).nullable().optional(),
    paeChecklist: z.object({
        asaClass: z.string(),
        mallampatiScore: z.number(),
        fitnessStatus: z.string(),
        allergiesConfirmed: z.boolean(),
        allergyDetails: z.string().optional(),
        bloodWorkDone: z.boolean(),
        notes: z.string().optional()
    }).nullable().optional(),
    postOpInstructions: z.string().default(''),
    iopaCount: z.number().int().nonnegative().default(0),
    clinicalRiskScore: z.number().nonnegative().default(0),
});

// ============================================================================
// Billing Schemas
// ============================================================================

export const createBillingSchema = z.object({
    patientId: z.string().uuid(),
    appointmentId: z.string().uuid().optional(),
    items: z.array(z.object({
        treatmentCode: z.string(),
        description: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
        discount: z.number().min(0).max(100).optional(), // Percentage
        total: z.number().positive()
    })).min(1, "At least one billing item is required"),
    subtotal: z.number().positive(),
    taxRate: z.number().min(0).max(100), // GST percentage
    taxAmount: z.number().nonnegative(),
    totalAmount: z.number().positive(),
    paymentMethod: z.enum(["CASH", "UPI", "CARD", "INSURANCE", "SPLIT"]),
    paymentStatus: z.enum(["PAID", "PARTIAL", "PENDING"]),
    paidAmount: z.number().nonnegative(),
    balanceAmount: z.number().nonnegative()
});

// ============================================================================
// Staff/User Schemas
// ============================================================================

export const createStaffSchema = z.object({
    fullName: z.string().min(2).max(100),
    email: emailSchema,
    phone: phoneSchema,
    role: z.enum(["ADMIN", "DOCTOR", "CONSULTANT", "RECEPTIONIST", "ASSISTANT", "OWNER"]),
    specialization: z.string().optional(),
    licenseNumber: z.string().optional(),
    dateOfJoining: dateSchema.optional(),
    salary: z.number().positive().optional(),
    address: z.string().max(500).optional()
});

export const updateStaffSchema = createStaffSchema.partial().extend({
    userId: z.string().uuid()
});

// ============================================================================
// Inventory Schemas
// ============================================================================

export const createInventoryItemSchema = z.object({
    name: z.string().min(1).max(200),
    category: z.enum(["CONSUMABLE", "EQUIPMENT", "MEDICINE", "ANESTHETIC", "IMPLANT", "OTHER"]),
    sku: z.string().optional(),
    quantity: z.number().int().nonnegative(),
    unit: z.string(), // e.g., "pieces", "ml", "boxes"
    reorderLevel: z.number().int().positive(),
    unitCost: z.number().positive().optional(),
    supplier: z.string().optional(),
    expiryDate: dateSchema.optional()
});

export const updateInventorySchema = z.object({
    itemId: z.string().uuid(),
    quantityChange: z.number().int(), // Can be negative for consumption
    reason: z.enum(["PURCHASE", "USAGE", "WASTAGE", "RETURN", "ADJUSTMENT"]),
    notes: z.string().max(500).optional(),
    performedBy: z.string().uuid()
});

// ============================================================================
// Auth & Permission Schemas
// ============================================================================

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
    remember: z.boolean().optional()
});

export const otpLoginSchema = z.object({
    phone: phoneSchema,
    otp: z.string().length(6, "OTP must be 6 digits")
});

export const permissionCheckSchema = z.object({
    userId: z.string().uuid(),
    permission: z.enum([
        "can_view_revenue",
        "can_edit_inventory",
        "can_view_clinical",
        "can_manage_staff",
        "can_start_consultation",
        "can_view_analytics",
        "can_manage_settings"
    ])
});

// ============================================================================
// Type Exports (for TypeScript IntelliSense)
// ============================================================================

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type CreateClinicalNoteInput = z.infer<typeof createClinicalNoteSchema>;
export type CreateBillingInput = z.infer<typeof createBillingSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpLoginInput = z.infer<typeof otpLoginSchema>;
export type PermissionCheckInput = z.infer<typeof permissionCheckSchema>;
export type CreateClinicalVisitInput = z.infer<typeof createClinicalVisitSchema>;
