interface ExtractedRule {
  field: string;
  operator: string;
  value: string | number | string[];
  rawText: string;
  confidence: number;
  sourceChunkId?: string;
  pageNumber?: number;
}

export const ruleExtractorService = {
  extractRules(text: string, chunkId?: string, pageNumber?: number): ExtractedRule[] {
    const rules: ExtractedRule[] = [];
    
    rules.push(...this.extractNumericRules(text, chunkId, pageNumber));
    rules.push(...this.extractCategoricalRules(text, chunkId, pageNumber));
    rules.push(...this.extractStateRules(text, chunkId, pageNumber));
    
    return rules.filter(r => r.confidence > 0.6);
  },

  extractNumericRules(text: string, chunkId?: string, pageNumber?: number): ExtractedRule[] {
    const rules: ExtractedRule[] = [];
    
    const patterns = [
      {
        regex: /(?:land(?:holding)?|area)\s+(?:of\s+)?(?:less than|below|under|up to|not exceeding)\s+(\d+(?:\.\d+)?)\s*(hectares?|acres?)/gi,
        field: 'landholding',
        operator: 'lte',
        confidence: 0.9,
      },
      {
        regex: /(?:land(?:holding)?|area)\s+(?:of\s+)?(?:more than|above|over|exceeding)\s+(\d+(?:\.\d+)?)\s*(hectares?|acres?)/gi,
        field: 'landholding',
        operator: 'gt',
        confidence: 0.9,
      },
      {
        regex: /(?:land(?:holding)?|area)\s+(?:of\s+)?(?:between|from)\s+(\d+(?:\.\d+)?)\s+(?:to|and)\s+(\d+(?:\.\d+)?)\s*(hectares?|acres?)/gi,
        field: 'landholding',
        operator: 'range',
        confidence: 0.85,
      },
      {
        regex: /(?:maximum|max)\s+(?:land(?:holding)?|area)\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(hectares?|acres?)/gi,
        field: 'landholding',
        operator: 'lte',
        confidence: 0.88,
      },
      {
        regex: /(?:minimum|min)\s+(?:land(?:holding)?|area)\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(hectares?|acres?)/gi,
        field: 'landholding',
        operator: 'gte',
        confidence: 0.88,
      },
    ];
    
    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern.regex)];
      
      for (const match of matches) {
        let value = parseFloat(match[1]);
        const unit = match[2]?.toLowerCase();
        
        if (unit?.startsWith('acre')) {
          value = value * 0.404686;
        }
        
        rules.push({
          field: pattern.field,
          operator: pattern.operator,
          value: Math.round(value * 100) / 100,
          rawText: match[0],
          confidence: pattern.confidence,
          sourceChunkId: chunkId,
          pageNumber,
        });
      }
    }
    
    return rules;
  },

  extractCategoricalRules(text: string, chunkId?: string, pageNumber?: number): ExtractedRule[] {
    const rules: ExtractedRule[] = [];
    
    const categoryPatterns = [
      {
        regex: /(?:sc|scheduled caste|scheduled tribe|st|obc|other backward class|general|ews|economically weaker section)/gi,
        field: 'socialCategory',
        confidence: 0.85,
      },
    ];
    
    for (const pattern of categoryPatterns) {
      const matches = [...text.matchAll(pattern.regex)];
      
      if (matches.length > 0) {
        const categories = matches.map(m => this.normalizeCategoryValue(m[0]));
        
        rules.push({
          field: pattern.field,
          operator: 'in',
          value: [...new Set(categories)],
          rawText: matches.map(m => m[0]).join(', '),
          confidence: pattern.confidence,
          sourceChunkId: chunkId,
          pageNumber,
        });
      }
    }
    
    const cropPatterns = [
      {
        regex: /(?:rice|wheat|cotton|sugarcane|maize|pulses|oilseeds)/gi,
        field: 'cropType',
        confidence: 0.75,
      },
    ];
    
    for (const pattern of cropPatterns) {
      const matches = [...text.matchAll(pattern.regex)];
      
      if (matches.length > 0) {
        const crops = matches.map(m => m[0].toLowerCase());
        
        rules.push({
          field: pattern.field,
          operator: 'in',
          value: [...new Set(crops)],
          rawText: matches.map(m => m[0]).join(', '),
          confidence: pattern.confidence,
          sourceChunkId: chunkId,
          pageNumber,
        });
      }
    }
    
    return rules;
  },

  extractStateRules(text: string, chunkId?: string, pageNumber?: number): ExtractedRule[] {
    const rules: ExtractedRule[] = [];
    
    const indianStates = [
      'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
      'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand',
      'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur',
      'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
      'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura',
      'uttar pradesh', 'uttarakhand', 'west bengal',
    ];
    
    const lowerText = text.toLowerCase();
    const foundStates: string[] = [];
    
    for (const state of indianStates) {
      if (lowerText.includes(state)) {
        foundStates.push(state);
      }
    }
    
    if (foundStates.length > 0 && foundStates.length < 5) {
      rules.push({
        field: 'state',
        operator: 'in',
        value: foundStates,
        rawText: foundStates.join(', '),
        confidence: 0.8,
        sourceChunkId: chunkId,
        pageNumber,
      });
    }
    
    return rules;
  },

  normalizeCategoryValue(raw: string): string {
    const normalized = raw.toLowerCase().trim();
    
    if (normalized.includes('schedule') && normalized.includes('caste')) return 'sc';
    if (normalized.includes('schedule') && normalized.includes('tribe')) return 'st';
    if (normalized.includes('obc') || normalized.includes('other backward')) return 'obc';
    if (normalized.includes('ews') || normalized.includes('economically weaker')) return 'ews';
    if (normalized.includes('general')) return 'general';
    
    return normalized;
  },

  calculateConfidence(rules: ExtractedRule[]): number {
    if (rules.length === 0) return 0;
    
    const avgConfidence = rules.reduce((sum, r) => sum + r.confidence, 0) / rules.length;
    const coverageBonus = Math.min(rules.length * 0.05, 0.15);
    
    return Math.min(avgConfidence + coverageBonus, 1.0);
  },
};