import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateSettlementPDF(summary: any, transactions: any[]) {
    const doc = new jsPDF() as any;

    // 1. Branding
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("NOBLE DENTAL CARE", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Daily Operational & Financial Settlement Report", 105, 28, { align: "center" });
    doc.line(20, 32, 190, 32);

    // 2. Summary Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Settlement Date: ${new Date(summary.date).toLocaleDateString()}`, 20, 45);
    doc.text(`Status: ${summary.status}`, 20, 52);
    doc.text(`Closed At: ${new Date(summary.closed_at).toLocaleString()}`, 20, 59);

    // 3. Financial Breakdown Table
    doc.autoTable({
        startY: 70,
        head: [['Revenue Channel', 'Amount (INR)']],
        body: [
            ['Cash in Hand', `Rs. ${summary.total_cash}`],
            ['UPI / Digital', `Rs. ${summary.total_upi}`],
            ['Card Payments', `Rs. ${summary.total_card}`],
            ['Total Daily Revenue', `Rs. ${summary.total_revenue}`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }
    });

    // 4. Operational Metrics Table
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Metric', 'Count']],
        body: [
            ['Total Patients Treated', summary.patient_count],
            ['Total Procedures Performed', summary.procedure_count],
        ],
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59] }
    });

    // 5. Detailed Transactions Table
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Patient', 'Invoice #', 'Amount', 'Mode', 'Verified']],
        body: transactions.map(t => [
            t.appointment.patient.first_name + ' ' + t.appointment.patient.last_name,
            t.invoice?.invoice_no || 'N/A',
            `Rs. ${t.total_amount}`,
            t.payment_mode || 'N/A',
            t.is_verified ? 'YES' : 'NO'
        ]),
        theme: 'plain',
        headStyles: { fillColor: [241, 148, 148] }
    });

    // 6. Footer / Signature
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.line(140, finalY, 190, finalY);
    doc.setFontSize(10);
    doc.text("Clinic Chief Signature", 165, finalY + 7, { align: "center" });

    doc.save(`Noble_Settlement_${summary.date}.pdf`);
}
