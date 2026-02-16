import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

interface PDFChunk {
  text: string;
  pageNumber: number;
  sectionTitle: string;
  chunkIndex: number;
  isEligibilitySection: boolean;
  metadata: {
    tokenCount: number;
    startPage: number;
    endPage: number;
  };
}

export const chunkerService = {
  CHUNK_SIZE: 700,
  OVERLAP_SIZE: 50,

  async chunkPDF(pdfBuffer: Buffer): Promise<PDFChunk[]> {
    const data = await pdfParse(pdfBuffer);
    const pages = data.text.split('\f');
    
    const chunks: PDFChunk[] = [];
    let chunkIndex = 0;
    let currentChunk = '';
    let currentTokens = 0;
    let chunkStartPage = 1;
    let currentSectionTitle = '';
    
    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
      const pageText = pages[pageIdx].trim();
      if (!pageText) continue;
      
      const pageNum = pageIdx + 1;
      const sentences = this.splitIntoSentences(pageText);
      
      for (const sentence of sentences) {
        const sentenceTokens = this.estimateTokens(sentence);
        
        if (currentTokens + sentenceTokens > this.CHUNK_SIZE && currentChunk.length > 0) {
          chunks.push(this.createChunk(
            currentChunk,
            chunkStartPage,
            pageNum,
            chunkIndex++,
            currentSectionTitle,
            currentTokens
          ));
          
          const overlapText = this.getOverlapText(currentChunk, this.OVERLAP_SIZE);
          currentChunk = overlapText + ' ' + sentence;
          currentTokens = this.estimateTokens(currentChunk);
          chunkStartPage = pageNum;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
          currentTokens += sentenceTokens;
        }
        
        const detectedSection = this.extractSectionTitle(sentence);
        if (detectedSection) {
          currentSectionTitle = detectedSection;
        }
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push(this.createChunk(
        currentChunk,
        chunkStartPage,
        pages.length,
        chunkIndex++,
        currentSectionTitle,
        currentTokens
      ));
    }
    
    return chunks;
  },

  createChunk(
    text: string,
    startPage: number,
    endPage: number,
    chunkIndex: number,
    sectionTitle: string,
    tokenCount: number
  ): PDFChunk {
    return {
      text: text.trim(),
      pageNumber: startPage,
      sectionTitle,
      chunkIndex,
      isEligibilitySection: this.isEligibilitySection(text),
      metadata: {
        tokenCount,
        startPage,
        endPage,
      },
    };
  },

  splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0);
  },

  estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  },

  getOverlapText(text: string, overlapTokens: number): string {
    const words = text.split(/\s+/);
    const overlapWords = Math.ceil(overlapTokens / 1.3);
    return words.slice(-overlapWords).join(' ');
  },

  extractSectionTitle(text: string): string {
    const lines = text.split('\n');
    const firstLine = lines[0].trim();
    
    if (firstLine.length < 100 && /^[A-Z0-9\s.:\-]+$/.test(firstLine)) {
      return firstLine;
    }
    
    const headerMatch = text.match(/^(?:Chapter|Section|Part|Article)\s+[\d.]+[:\s]*(.+?)(?:\n|$)/i);
    if (headerMatch) {
      return headerMatch[0].trim();
    }
    
    return '';
  },

  isEligibilitySection(text: string): boolean {
    const keywords = [
      'eligibility', 'eligible', 'criteria', 'conditions',
      'requirements', 'qualifications', 'who can apply',
      'beneficiary', 'applicant', 'entitled'
    ];
    const lowerText = text.toLowerCase();
    return keywords.some(kw => lowerText.includes(kw));
  },
};