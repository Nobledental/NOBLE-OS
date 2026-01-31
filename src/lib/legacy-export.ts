/**
 * Phase 24: Legacy Import/Export for HealthFlo Support
 * 
 * JSON/PDF bundle generator for manual data migration
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface ExportBundle {
    id: string;
    clinicId: string;
    clinicName: string;
    exportedAt: Date;
    exportedBy: string;
    format: 'json' | 'pdf' | 'combined';
    version: string;

    // Data sections
    patients: PatientExportData[];
    appointments: AppointmentExportData[];
    clinicalRecords: ClinicalExportData[];
    invoices: InvoiceExportData[];

    // Metadata
    totalRecords: number;
    dateRange: { from: Date; to: Date };
    checksum: string;
}

export interface PatientExportData {
    id: string;
    externalId?: string;
    name: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    bloodGroup?: string;
    allergies?: string[];
    medicalHistory?: string[];
    registeredAt: string;
    lastVisit?: string;
}

export interface AppointmentExportData {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    scheduledAt: string;
    duration: number;
    status: string;
    procedureCode?: string;
    procedureName?: string;
    notes?: string;
    chairNumber?: number;
}

export interface ClinicalExportData {
    id: string;
    patientId: string;
    appointmentId?: string;
    type: 'case_sheet' | 'prescription' | 'xray' | 'lab_report';
    createdAt: string;
    createdBy: string;

    // Clinical details
    diagnosis?: string[];
    treatments?: string[];
    toothNumbers?: number[];
    notes?: string;

    // Attachments
    attachments?: {
        type: string;
        url: string;
        filename: string;
    }[];
}

export interface InvoiceExportData {
    id: string;
    patientId: string;
    patientName: string;
    createdAt: string;
    dueDate?: string;
    status: string;

    // Amounts
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    paidAmount: number;
    balanceDue: number;

    // Line items
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];

    // Payments
    payments?: {
        date: string;
        amount: number;
        method: string;
        reference?: string;
    }[];
}

export interface ImportRequest {
    id: string;
    clinicId: string;
    requestedAt: Date;
    requestedBy: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    sourceFormat: 'paper' | 'excel' | 'other_software' | 'json';
    estimatedRecords: number;
    notes?: string;
    assignedTo?: string;
    completedAt?: Date;
}

// =============================================================================
// LEGACY EXPORT SERVICE
// =============================================================================

export class LegacyExportService {
    private readonly EXPORT_VERSION = '1.0.0';

    /**
     * Generate a complete export bundle
     */
    generateExportBundle(
        clinicId: string,
        clinicName: string,
        exportedBy: string,
        patients: PatientExportData[],
        appointments: AppointmentExportData[],
        clinicalRecords: ClinicalExportData[],
        invoices: InvoiceExportData[],
        dateRange: { from: Date; to: Date },
        format: ExportBundle['format'] = 'combined'
    ): ExportBundle {
        const bundle: ExportBundle = {
            id: `EXPORT-${uuid().slice(0, 8).toUpperCase()}`,
            clinicId,
            clinicName,
            exportedAt: new Date(),
            exportedBy,
            format,
            version: this.EXPORT_VERSION,
            patients,
            appointments,
            clinicalRecords,
            invoices,
            totalRecords: patients.length + appointments.length + clinicalRecords.length + invoices.length,
            dateRange,
            checksum: ''
        };

        // Generate checksum
        bundle.checksum = this.generateChecksum(bundle);

        return bundle;
    }

    /**
     * Generate JSON export
     */
    generateJSONExport(bundle: ExportBundle): string {
        return JSON.stringify(bundle, null, 2);
    }

    /**
     * Generate PDF summary (returns HTML for PDF conversion)
     */
    generatePDFSummary(bundle: ExportBundle): string {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HealthFlo Export - ${bundle.clinicName}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        h1 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        h2 { color: #444; margin-top: 30px; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; color: #0066cc; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .meta-item { display: flex; justify-content: space-between; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #0066cc; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .summary-card { display: inline-block; background: #e3f2fd; padding: 20px; margin: 10px; border-radius: 8px; text-align: center; }
        .summary-number { font-size: 32px; font-weight: bold; color: #0066cc; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">HealthFlo</div>
        <div>Export ID: ${bundle.id}</div>
    </div>
    
    <h1>Data Export Summary</h1>
    
    <div class="meta">
        <div class="meta-item"><strong>Clinic:</strong> ${bundle.clinicName}</div>
        <div class="meta-item"><strong>Exported By:</strong> ${bundle.exportedBy}</div>
        <div class="meta-item"><strong>Export Date:</strong> ${bundle.exportedAt.toLocaleString('en-IN')}</div>
        <div class="meta-item"><strong>Date Range:</strong> ${bundle.dateRange.from.toLocaleDateString('en-IN')} - ${bundle.dateRange.to.toLocaleDateString('en-IN')}</div>
        <div class="meta-item"><strong>Version:</strong> ${bundle.version}</div>
    </div>
    
    <h2>Record Summary</h2>
    <div>
        <div class="summary-card">
            <div class="summary-number">${bundle.patients.length}</div>
            <div>Patients</div>
        </div>
        <div class="summary-card">
            <div class="summary-number">${bundle.appointments.length}</div>
            <div>Appointments</div>
        </div>
        <div class="summary-card">
            <div class="summary-number">${bundle.clinicalRecords.length}</div>
            <div>Clinical Records</div>
        </div>
        <div class="summary-card">
            <div class="summary-number">${bundle.invoices.length}</div>
            <div>Invoices</div>
        </div>
    </div>
    
    <h2>Patient List</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Last Visit</th>
            </tr>
        </thead>
        <tbody>
            ${bundle.patients.slice(0, 50).map(p => `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.phone}</td>
                    <td>${p.registeredAt}</td>
                    <td>${p.lastVisit || '-'}</td>
                </tr>
            `).join('')}
            ${bundle.patients.length > 50 ? `<tr><td colspan="5"><em>... and ${bundle.patients.length - 50} more patients (see JSON file)</em></td></tr>` : ''}
        </tbody>
    </table>
    
    <h2>Financial Summary</h2>
    <table>
        <thead>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total Invoices</td>
                <td>${bundle.invoices.length}</td>
            </tr>
            <tr>
                <td>Total Billed</td>
                <td>₹${bundle.invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
                <td>Total Collected</td>
                <td>₹${bundle.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
                <td>Outstanding Balance</td>
                <td>₹${bundle.invoices.reduce((sum, inv) => sum + inv.balanceDue, 0).toLocaleString('en-IN')}</td>
            </tr>
        </tbody>
    </table>
    
    <div class="footer">
        <p>This export was generated by HealthFlo for use by the HealthFlo Support Team.</p>
        <p>Checksum: ${bundle.checksum}</p>
        <p>For manual data migration assistance, contact support@healthflo.in</p>
    </div>
</body>
</html>
        `;

        return html;
    }

    /**
     * Create import request
     */
    createImportRequest(
        clinicId: string,
        requestedBy: string,
        sourceFormat: ImportRequest['sourceFormat'],
        estimatedRecords: number,
        notes?: string
    ): ImportRequest {
        return {
            id: `IMPORT-${uuid().slice(0, 8).toUpperCase()}`,
            clinicId,
            requestedAt: new Date(),
            requestedBy,
            status: 'pending',
            sourceFormat,
            estimatedRecords,
            notes
        };
    }

    /**
     * Validate export bundle
     */
    validateBundle(bundle: ExportBundle): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!bundle.clinicId) errors.push('Missing clinic ID');
        if (!bundle.exportedBy) errors.push('Missing exporter information');
        if (bundle.patients.length === 0 && bundle.appointments.length === 0) {
            errors.push('Bundle contains no data');
        }

        // Validate patient references
        const patientIds = new Set(bundle.patients.map(p => p.id));
        for (const apt of bundle.appointments) {
            if (!patientIds.has(apt.patientId)) {
                errors.push(`Appointment ${apt.id} references unknown patient ${apt.patientId}`);
            }
        }

        // Verify checksum
        const expectedChecksum = this.generateChecksum({ ...bundle, checksum: '' });
        if (bundle.checksum && bundle.checksum !== expectedChecksum) {
            errors.push('Checksum mismatch - bundle may be corrupted');
        }

        return { valid: errors.length === 0, errors };
    }

    /**
     * Generate checksum for bundle integrity
     */
    private generateChecksum(bundle: Omit<ExportBundle, 'checksum'> & { checksum?: string }): string {
        const data = JSON.stringify({
            clinicId: bundle.clinicId,
            patientCount: bundle.patients.length,
            appointmentCount: bundle.appointments.length,
            clinicalCount: bundle.clinicalRecords.length,
            invoiceCount: bundle.invoices.length,
            exportedAt: bundle.exportedAt.toISOString()
        });

        // Simple hash (in production, use crypto.subtle.digest)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    }
}

export const legacyExportService = new LegacyExportService();
