/* import type { SearchResult, Citation } from './types.js';

export const citationService = {
  extractCitations(searchResults: SearchResult[], maxCitations = 5): Citation[] {
    return searchResults.slice(0, maxCitations).map((result) => ({
      page: result.metadata.page || 1,
      paragraph: 1,
      text: result.metadata.text || '',
      documentUrl: result.metadata.documentUrl || '',
    }));
  },

  formatCitationText(citation: Citation): string {
    return `[Page ${citation.page}] "${citation.text}"`;
  },
}; */ 

export const citationService = {
  formatCitation(chunk: any): string {
    return `Page ${chunk.pageNumber}, ${chunk.sectionTitle || 'Section'}: "${chunk.chunkText.substring(0, 200)}..."`;
  },

  extractPageAndParagraph(chunk: any): { page: number; paragraph: string } {
    return {
      page: chunk.pageNumber,
      paragraph: chunk.chunkText,
    };
  },
};