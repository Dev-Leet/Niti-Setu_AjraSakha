import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface FormField {
  name: string;
  value: string;
  page: number;
  x: number;
  y: number;
}

export const formFillerService = {
  async fillPDFForm(templateBuffer: Buffer, fields: FormField[]): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(templateBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const field of fields) {
      const page = pdfDoc.getPage(field.page);
      
      page.drawText(field.value, {
        x: field.x,
        y: page.getHeight() - field.y,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }

    return Buffer.from(await pdfDoc.save());
  },

  async generatePreFilledApplication(_schemeId: string, farmerData: Record<string, unknown>): Promise<Buffer> {
  const fields: FormField[] = [
    { name: 'name', value: String(farmerData.fullName || ''), page: 0, x: 100, y: 100 },
    { name: 'state', value: String(farmerData.state || ''), page: 0, x: 100, y: 130 },
    { name: 'district', value: String(farmerData.district || ''), page: 0, x: 100, y: 160 },
    { name: 'landholding', value: String(farmerData.landholding || '0'), page: 0, x: 100, y: 190 },
  ];

    const emptyPdf = await PDFDocument.create();
    const page = emptyPdf.addPage([595, 842]);
    const helveticaFont = await emptyPdf.embedFont(StandardFonts.Helvetica);

    page.drawText('Scheme Application Form', {
      x: 50,
      y: 750,
      size: 20,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    let yPos = 700;
    for (const field of fields) {
      page.drawText(`${field.name}: ${field.value}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      yPos -= 30;
    }

    return Buffer.from(await emptyPdf.save());
  },
};