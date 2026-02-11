import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { EligibilityCheck } from '@models/EligibilityCheck.model.js';
import { helpers } from '@utils/helpers.js';

export const exportService = {
  async exportEligibilityCSV(checkId: string): Promise<string> {
    const check = await EligibilityCheck.findById(checkId).populate('profileId');
    if (!check) throw new Error('Check not found');

    const filepath = path.join('/tmp', `eligibility-${helpers.generateId()}.csv`);
    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: [
        { id: 'scheme', title: 'Scheme' },
        { id: 'eligible', title: 'Eligible' },
        { id: 'confidence', title: 'Confidence' },
        { id: 'benefit', title: 'Benefit Amount' },
      ],
    });

    const records = check.results.map(r => ({
      scheme: r.schemeName,
      eligible: r.isEligible ? 'Yes' : 'No',
      confidence: `${Math.round(r.confidence * 100)}%`,
      benefit: r.benefits.financial.amount,
    }));

    await csvWriter.writeRecords(records);
    return filepath;
  },

  async exportEligibilityPDF(checkId: string): Promise<string> {
    const check = await EligibilityCheck.findById(checkId).populate('profileId');
    if (!check) throw new Error('Check not found');

    const filepath = path.join('/tmp', `eligibility-${helpers.generateId()}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);
    doc.fontSize(20).text('Eligibility Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date(check.createdAt).toLocaleDateString()}`);
    doc.text(`Total Eligible: ${check.totalEligible}`);
    doc.text(`Total Benefits: ₹${check.totalBenefits}`);
    doc.moveDown();

    check.results.forEach((result, i) => {
      doc.fontSize(14).text(`${i + 1}. ${result.schemeName}`);
      doc.fontSize(10).text(`Eligible: ${result.isEligible ? 'Yes' : 'No'}`);
      doc.text(`Confidence: ${Math.round(result.confidence * 100)}%`);
      if (result.isEligible) {
        doc.text(`Benefit: ₹${result.benefits.financial.amount}`);
      }
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve) => {
      stream.on('finish', () => resolve(filepath));
    });
  },
};