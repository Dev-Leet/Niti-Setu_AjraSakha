import rulesEngine from './rules.engine.js';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { SchemeChunk } from '@models/SchemeChunk.model.js';
import { llamaService } from '@services/ml/llama.service.js';

interface FarmerProfile {
  state: string;
  district: string;
  landholding: number;
  cropTypes: string[];
  socialCategory: string;
  [key: string]: string | number | string[];
}

export const matcherService = {
  async checkEligibility(
    schemeId: string,
    schemeName: string,
    profile: FarmerProfile
  ): Promise<{
    isEligible: boolean;
    confidence: number;
    reasoning: string;
    matchedRules: string[];
    citations: Array<{ text: string; page: number; confidence: number }>;
  }> {
    const eligibilityResult = await rulesEngine.checkEligibilityDetailed(schemeId, profile);

    const queryText = `eligibility for ${profile.state} farmer ${profile.landholding} acres`;
    const embeddings = await embeddingsService.embedTexts([queryText]);

    const chunks = await SchemeChunk.aggregate([
      {
        $vectorSearch: {
          index: 'scheme_vector_index',
          path: 'embedding',
          queryVector: embeddings[0],
          numCandidates: 100,
          limit: 3,
          filter: { schemeId: { $eq: schemeId } },
        },
      },
      {
        $project: {
          chunkText: 1,
          pageNumber: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    const citations = chunks.map((c: { chunkText: { en: string }; pageNumber: number; score: number }) => ({
      text: c.chunkText.en,
      page: c.pageNumber,
      confidence: c.score,
    }));

    const reasoning = await this.generateReasoning(
      eligibilityResult.isEligible,
      schemeName,
      eligibilityResult.matchedRules
    );

    return {
      isEligible: eligibilityResult.isEligible,
      confidence: eligibilityResult.confidence,
      reasoning,
      matchedRules: eligibilityResult.matchedRules,
      citations,
    };
  },

  async generateReasoning(eligible: boolean, schemeName: string, matchedRules: string[]): Promise<string> {
    const prompt = eligible
      ? `Farmer is eligible for ${schemeName}. Rules matched: ${matchedRules.join(', ')}. Explain in 2 sentences.`
      : `Farmer is not eligible for ${schemeName}. Explain why in 2 sentences.`;

    try {
      const response = await llamaService.generate(prompt, 100);
      return response.trim() || (eligible ? 'Eligible based on rules.' : 'Not eligible.');
    } catch {
      return eligible ? 'Meets eligibility criteria.' : 'Does not meet eligibility criteria.';
    }
  },
};