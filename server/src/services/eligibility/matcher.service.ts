import { rulesEngine } from './rules.engine.js';
import { retrievalService } from '@services/rag/retrieval.service.js';
import { citationService } from '@services/pdf/citation.service.js';
import { llamaService } from '@services/ml/llama.service.js';
import { confidenceService } from './confidence.service.js';
import { EligibilityRule } from '@models/EligibilityRule.model.js';
import { cacheService } from '@services/performance/cache.service.js';
import { benchmarkService } from '@services/performance/benchmark.service.js';
import crypto from 'crypto';

interface FarmerProfile {
  state: string;
  district: string;
  landholding: number;
  cropType: string;
  socialCategory: string;
}

function hashProfile(schemeId: string, profile: FarmerProfile): string {
  return crypto
    .createHash('md5')
    .update(JSON.stringify({ schemeId, ...profile }))
    .digest('hex');
}

export const matcherService = {
  async checkEligibility(profile: FarmerProfile, schemeId: string) {
    const profileHash = hashProfile(schemeId, profile);
    const cacheKey = cacheService.eligibilityKey(schemeId, profileHash);

    const cached = await cacheService.get(cacheKey);
    if (cached) return { ...cached as object, cacheHit: true };

    const timer = benchmarkService.timer('eligibility_check', { schemeId });

    const rule = await EligibilityRule.findOne({ schemeId });
    if (!rule) throw new Error('No eligibility rules found for this scheme');

    const [{ eligible, matchedRules, totalRules }, retrievalResults] = await Promise.all([
      rulesEngine.checkEligibilityDetailed(schemeId, profile),
      retrievalService.findWithStructuredQuery(profile, schemeId, 3),
    ]);

    const bestChunk = retrievalResults[0];
    const citation = citationService.formatCitation(bestChunk.chunk);
    const proof = citationService.extractPageAndParagraph(bestChunk.chunk);

    const similarityScore = confidenceService.calculateSimilarityScore(retrievalResults);
    const ruleMatchConfidence = confidenceService.calculateRuleMatchConfidence(matchedRules, totalRules);
    const combinedConfidence = confidenceService.calculateCombinedConfidence(similarityScore, ruleMatchConfidence);

    const explanation = await llamaService.explainEligibility(eligible, citation, profile);

    const result = {
      eligible,
      schemeName: rule.schemeName,
      proof: { page: proof.page, paragraph: proof.paragraph, citation },
      explanation,
      nextSteps: eligible ? this.getNextSteps() : [],
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
      cacheHit: false,
    };

    await cacheService.set(cacheKey, result, 600);
    await timer.end();

    return result;
  },

  getNextSteps(): string[] {
    return [
      'Gather Aadhaar card and land records',
      'Visit nearest CSC or agriculture office',
      'Fill application form with details',
      'Submit required documents',
    ];
  },
};