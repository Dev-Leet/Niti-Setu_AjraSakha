import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function processPDF(pdfBuffer: Buffer) {
  const data = await pdfParse(pdfBuffer);
  
  const pages = data.text.split('\f').map((pageText: string, index: number) => ({
    text: pageText.trim(),
    page: index + 1,
  }));

  return pages;
}