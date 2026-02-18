import { EligibilityCheck } from '@models/EligibilityCheck.model.js';
import PDFDocument from 'pdfkit';

export const exportService = {
  async generatePDF(checkId: string): Promise<Buffer> {
    const check = await EligibilityCheck.findById(checkId);

    if (!check) {
      throw new Error('Check not found');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(20).text('Eligibility Check Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Date: ${new Date(check.createdAt).toLocaleDateString()}`);
      doc.text(`Processing Time: ${check.processingTime}ms`);
      doc.text(`Total Eligible: ${check.totalEligible}`);
      doc.moveDown();

      check.results.forEach((result, index) => {
        doc.fontSize(14).text(`${index + 1}. ${result.schemeName}`);
        doc.fontSize(10).text(`Status: ${result.isEligible ? 'Eligible' : 'Not Eligible'}`);
        doc.text(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        doc.text(`Reasoning: ${result.reasoning}`);
        doc.moveDown();
      });

      doc.end();
    });
  },

  async generateCSV(checkId: string): Promise<string> {
    const check = await EligibilityCheck.findById(checkId);

    if (!check) {
      throw new Error('Check not found');
    }

    const headers = ['Scheme Name', 'Eligible', 'Confidence', 'Reasoning'];
    const rows = check.results.map(result => [
      result.schemeName,
      result.isEligible ? 'Yes' : 'No',
      `${(result.confidence * 100).toFixed(1)}%`,
      result.reasoning,
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    return csv;
  },
};