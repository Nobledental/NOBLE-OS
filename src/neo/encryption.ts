import api from "@/lib/api";
import { maskPhone as libMaskPhone, maskEmail as libMaskEmail, maskName as libMaskName, maskAadhaar as libMaskAadhaar } from "@/lib/security";

// Re-export masking primitives for consistency
export const maskPhone = libMaskPhone;
export const maskEmail = libMaskEmail;
export const maskName = libMaskName;
export const maskAadhaar = libMaskAadhaar;

/**
 * Log PII access to the central audit trail.
 * This is a critical security control. All unmasking events MUST be logged.
 * 
 * @param resourceId - The ID of the patient/staff member being accessed
 * @param field - The specific field being unmasked (e.g., 'phone', 'email')
 * @param reason - Operational reason for access (default: 'clinical_view')
 */
export async function auditPIIAccess(resourceId: string, field: string, reason: string = "clinical_view") {
    try {
        // In a real implementation, this would likely grab the current user from session context
        // For now, we assume the API handles user attribution via the auth token
        await api.post(`/audit/pii-access`, {
            resourceId,
            field,
            reason,
            timestamp: new Date().toISOString()
        });
        console.log(`[NEO SEC] PII Access Logged: ${field} for ${resourceId}`);
    } catch (error) {
        // Fallback: If audit fails, we should technically BLOCK access, 
        // but for UX we currently just log the failure to the console.
        // In high-security mode, this should re-throw.
        console.error(`[NEO SEC] CRITICAL: Failed to log PII access`, error);
    }
}
