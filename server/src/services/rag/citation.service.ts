import type { SearchResult, Citation } from './types.js';

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
}; 