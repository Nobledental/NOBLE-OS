/**
 * Invoice PDF Generator
 * 
 * Professional PDF invoice template using @react-pdf/renderer
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { InvoiceItem } from '@/lib/billing-store';

// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 30,
    },
    clinicName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1e293b',
    },
    clinicDetails: {
        fontSize: 9,
        color: '#64748b',
        marginBottom: 2,
    },
    divider: {
        borderBottomWidth: 2,
        borderBottomColor: '#e2e8f0',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    label: {
        width: '40%',
        fontSize: 9,
        color: '#64748b',
    },
    value: {
        width: '60%',
        fontSize: 9,
        color: '#1e293b',
        fontWeight: 'bold',
    },
    table: {
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 8,
        borderRadius: 4,
        marginBottom: 5,
    },
    tableHeaderText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#334155',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    col1: { width: '5%' },
    col2: { width: '45%' },
    col3: { width: '10%' },
    col4: { width: '15%' },
    col5: { width: '10%' },
    col6: { width: '15%', textAlign: 'right' },
    tableText: {
        fontSize: 9,
        color: '#1e293b',
    },
    totalsSection: {
        marginTop: 20,
        marginLeft: 'auto',
        width: '50%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    totalLabel: {
        fontSize: 9,
        color: '#64748b',
    },
    totalValue: {
        fontSize: 9,
        color: '#1e293b',
        fontWeight: 'bold',
    },
    grandTotal: {
        borderTopWidth: 2,
        borderTopColor: '#e2e8f0',
        paddingTop: 8,
        marginTop: 8,
    },
    grandTotalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    grandTotalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    },
    badge: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: 3,
        borderRadius: 3,
        fontSize: 7,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

interface InvoicePDFProps {
    invoiceNumber: string;
    invoiceDate: string;
    patient: {
        name: string;
        phone?: string;
        healthFloId?: string;
    };
    clinic: {
        name: string;
        address: string;
        phone: string;
        email?: string;
        gstin?: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod?: string;
}

export const InvoicePDF = ({
    invoiceNumber,
    invoiceDate,
    patient,
    clinic,
    items,
    subtotal,
    tax,
    total,
    paymentMethod
}: InvoicePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.clinicName}>{clinic.name}</Text>
                <Text style={styles.clinicDetails}>{clinic.address}</Text>
                <Text style={styles.clinicDetails}>Phone: {clinic.phone}</Text>
                {clinic.email && <Text style={styles.clinicDetails}>Email: {clinic.email}</Text>}
                {clinic.gstin && <Text style={styles.clinicDetails}>GSTIN: {clinic.gstin}</Text>}
            </View>

            <View style={styles.divider} />

            {/* Invoice Info */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <View>
                    <Text style={styles.sectionTitle}>Invoice Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Invoice Number:</Text>
                        <Text style={styles.value}>{invoiceNumber}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.value}>
                            {new Date(invoiceDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Patient Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{patient.name}</Text>
                    </View>
                    {patient.phone && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Phone:</Text>
                            <Text style={styles.value}>{patient.phone}</Text>
                        </View>
                    )}
                    {patient.healthFloId && (
                        <View style={styles.row}>
                            <Text style={styles.label}>HealthFlo ID:</Text>
                            <Text style={styles.value}>{patient.healthFloId}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Items Table */}
            <View style={styles.table}>
                <Text style={styles.sectionTitle}>Treatments & Services</Text>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.col1]}>#</Text>
                    <Text style={[styles.tableHeaderText, styles.col2]}>Description</Text>
                    <Text style={[styles.tableHeaderText, styles.col3]}>Qty</Text>
                    <Text style={[styles.tableHeaderText, styles.col4]}>Rate</Text>
                    <Text style={[styles.tableHeaderText, styles.col5]}>Tax</Text>
                    <Text style={[styles.tableHeaderText, styles.col6]}>Amount</Text>
                </View>

                {/* Table Rows */}
                {items.map((item, index) => {
                    const itemTotal = item.baseCost * item.quantity;
                    const itemTax = itemTotal * (item.taxRate / 100);

                    return (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={[styles.tableText, styles.col1]}>{index + 1}</Text>
                            <View style={styles.col2}>
                                <Text style={styles.tableText}>{item.name}</Text>
                                {item.metadata?.source === 'auto_clinical' && (
                                    <Text style={[styles.badge, { marginTop: 2 }]}>Auto-billed</Text>
                                )}
                            </View>
                            <Text style={[styles.tableText, styles.col3]}>{item.quantity}</Text>
                            <Text style={[styles.tableText, styles.col4]}>₹{item.baseCost.toLocaleString('en-IN')}</Text>
                            <Text style={[styles.tableText, styles.col5]}>{item.taxRate}%</Text>
                            <Text style={[styles.tableText, styles.col6]}>₹{(itemTotal + itemTax).toLocaleString('en-IN')}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Totals */}
            <View style={styles.totalsSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax (GST):</Text>
                    <Text style={styles.totalValue}>₹{tax.toLocaleString('en-IN')}</Text>
                </View>
                <View style={[styles.totalRow, styles.grandTotal]}>
                    <Text style={styles.grandTotalLabel}>Total Amount:</Text>
                    <Text style={styles.grandTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
                </View>
                {paymentMethod && (
                    <View style={[styles.totalRow, { marginTop: 10 }]}>
                        <Text style={styles.totalLabel}>Payment Method:</Text>
                        <Text style={styles.totalValue}>{paymentMethod}</Text>
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for choosing {clinic.name}!</Text>
                <Text style={{ marginTop: 3 }}>This is a computer-generated invoice and does not require a signature.</Text>
            </View>
        </Page>
    </Document>
);
