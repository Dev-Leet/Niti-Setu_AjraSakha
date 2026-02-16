import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export const screenshotService = {
  async extractPageAsImage(pdfBuffer: Buffer, pageNumber: number): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    if (pageNumber >= pdfDoc.getPageCount()) {
      throw new Error('Page number out of range');
    }

    const singlePagePdf = await PDFDocument.create();
    const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [pageNumber]);
    singlePagePdf.addPage(copiedPage);

    const pdfBytes = await singlePagePdf.save();
    
    return Buffer.from(pdfBytes);
  },

  async highlightTextInPDF(pdfBuffer: Buffer, pageNumber: number): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    pdfDoc.getPage(pageNumber);
    
    return Buffer.from(await pdfDoc.save());
  },

  async createProofCard(schemeInfo: { schemeName: string }, proofData: { page: number; paragraph: string }): Promise<Buffer> {
    const width = 600;
    const height = 400;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f4f0"/>
        <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="white" stroke="#2c5f2d" stroke-width="2"/>
        <text x="40" y="60" font-family="Arial" font-size="24" font-weight="bold" fill="#2c5f2d">Eligibility Proof</text>
        <text x="40" y="100" font-family="Arial" font-size="16" fill="#333">${schemeInfo.schemeName}</text>
        <text x="40" y="130" font-family="Arial" font-size="14" fill="#666">Page: ${proofData.page}</text>
        <text x="40" y="160" font-family="Arial" font-size="12" fill="#555" style="max-width: ${width - 80}px;">${proofData.paragraph.substring(0, 150)}...</text>
        <rect x="40" y="320" width="200" height="40" fill="#4caf50" rx="5"/>
        <text x="140" y="345" font-family="Arial" font-size="16" font-weight="bold" fill="white" text-anchor="middle">✓ Eligible</text>
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .png()
      .toBuffer();
  },
};