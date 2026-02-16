import { rulesEngine } from './rules.engine.js';
import { retrievalService } from '@services/rag/retrieval.service.js';
import { citationService } from '@services/rag/citation.service.js';
import { llamaService } from '@services/ml/llama.service.js';
import { confidenceService } from './confidence.service.js';
import { EligibilityRule } from '@models/EligibilityRule.model.js';

export const matcherService = {
  async checkEligibility(profile: any, schemeId: string) {
    const rule = await EligibilityRule.findOne({ schemeId });
    if (!rule) {
      throw new Error('No eligibility rules found for this scheme');
    }
    
    const { eligible, matchedRules, totalRules } = await rulesEngine.checkEligibilityDetailed(schemeId, profile);
    
    const retrievalResults = await retrievalService.findWithStructuredQuery(profile, schemeId, 3);
    
    const bestChunk = retrievalResults[0];
    const citation = citationService.formatCitation(bestChunk.chunk);
    const proof = citationService.extractPageAndParagraph(bestChunk.chunk);
    
    const similarityScore = confidenceService.calculateSimilarityScore(retrievalResults);
    const ruleMatchConfidence = confidenceService.calculateRuleMatchConfidence(matchedRules, totalRules);
    const combinedConfidence = confidenceService.calculateCombinedConfidence(similarityScore, ruleMatchConfidence);
    
    const explanation = await llamaService.explainEligibility(
      rule.schemeName,
      eligible,
      citation,
      profile
    );
    
    return {
      eligible,
      schemeName: rule.schemeName,
      proof: {
        page: proof.page,
        paragraph: proof.paragraph,
        citation,
      },
      explanation,
      nextSteps: eligible ? this.getNextSteps(schemeId) : [],
      confidence: {
        similarityScore: Math.round(similarityScore * 100) / 100,
        ruleMatchConfidence: Math.round(ruleMatchConfidence * 100) / 100,
        combinedConfidence,
        level: confidenceService.getConfidenceLevel(combinedConfidence),
      },
      metadata: {
        rulesMatched: matchedRules,
        totalRules,
        retrievalResultsCount: retrievalResults.length,
      },
    };
  },

  getNextSteps(schemeId: string): string[] {
    return [
      'Gather Aadhar card and land records',
      'Visit nearest CSC or agriculture office',
      'Fill application form with details',
      'Submit required documents',
    ];
  },
};