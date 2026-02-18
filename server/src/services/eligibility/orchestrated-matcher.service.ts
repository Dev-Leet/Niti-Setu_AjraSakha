import { EligibilityRule } from '@models/EligibilityRule.model.js';
import { langchainOrchestrator } from '@services/langchain/orchestrator.js';
import { citationService } from '@services/pdf/citation.service.js';
import { embeddingsService } from '@services/ml/embeddings.service.js';

interface FarmerProfile {
  state: string;
  district: string;
  landholding: number;
  cropTypes: string[];
  socialCategory: string;
}

interface Citation {
  text: string;
  page: number;
  section?: string;
  confidence: number;
}

interface EligibilityDecision {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Citation[];
  metadata: {
    ruleMatched: string;
    contextUsed: boolean;
  };
}

export const orchestratedMatcherService = {
  async checkEligibility(
    schemeId: string,
    schemeName: string,
    profile: FarmerProfile
  ): Promise<EligibilityDecision> {
    const rule = await EligibilityRule.findOne({ schemeId });

    if (!rule) {
      return {
        schemeId,
        schemeName,
        isEligible: false,
        confidence: 0,
        reasoning: 'No eligibility rules configured for this scheme',
        citations: [],
        metadata: {
          ruleMatched: 'none',
          contextUsed: false,
        },
      };
    }

    const { isEligible, matchedRule, confidence } = this.evaluateRules(rule, profile);

    const queryText = `eligibility criteria for ${profile.state} farmer with ${profile.landholding} acres`;
    const queryEmbedding = await embeddingsService.embedTexts([queryText]);
    
    const citations = await citationService.findRelevantCitations(
      schemeId,
      queryEmbedding[0],
      2
    );

    const ruleBasis = matchedRule || 'general eligibility criteria';
    
    const { explanation, confidenceNote } = await langchainOrchestrator.generateExplanation({
      profile,
      schemeName,
      eligible: isEligible,
      ruleBasis,
    });

    const reasoning = `${explanation} (${confidenceNote})`;

    return {
      schemeId,
      schemeName,
      isEligible,
      confidence,
      reasoning,
      citations,
      metadata: {
        ruleMatched: ruleBasis,
        contextUsed: citations.length > 0,
      },
    };
  },

  evaluateRules(
    rule: { rules: Array<{ field: string; operator: string; value: unknown }> },
    profile: FarmerProfile
  ): { isEligible: boolean; matchedRule: string; confidence: number } {
    let matchedCount = 0;
    let totalRules = rule.rules.length;
    let matchedRule = '';

    for (const r of rule.rules) {
      const fieldValue = profile[r.field as keyof FarmerProfile];
      let matches = false;

      switch (r.operator) {
        case 'lte':
          matches = typeof fieldValue === 'number' && fieldValue <= (r.value as number);
          break;
        case 'gte':
          matches = typeof fieldValue === 'number' && fieldValue >= (r.value as number);
          break;
        case 'eq':
          matches = fieldValue === r.value;
          break;
        case 'in':
          matches = Array.isArray(r.value) && r.value.includes(fieldValue);
          break;
        case 'includes':
          matches = Array.isArray(fieldValue) && 
                   Array.isArray(r.value) && 
                   r.value.some(v => fieldValue.includes(v));
          break;
      }

      if (matches) {
        matchedCount++;
        if (!matchedRule) {
          matchedRule = `${r.field} ${r.operator} ${r.value}`;
        }
      }
    }

    const isEligible = matchedCount === totalRules;
    const confidence = totalRules > 0 ? matchedCount / totalRules : 0;

    return {
      isEligible,
      matchedRule: matchedRule || 'no rules matched',
      confidence,
    };
  },
};