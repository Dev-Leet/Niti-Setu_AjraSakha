import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LocalLlamaLLM } from './LocalLlamaLLM.js';
import { eligibilityExplanationPrompt, nextStepsPrompt } from './prompts.js';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { SchemeChunk } from '@models/SchemeChunk.model.js';
//import { env } from '@config/env.js';
import { withRetry } from './retry.js';
import { langchainConfig } from '@config/langchain.config.js';

const llm = new LocalLlamaLLM({
  url: String(langchainConfig.llamaServiceUrl),
  maxTokens: langchainConfig.maxTokens,
  temperature: langchainConfig.temperature,
  timeout: langchainConfig.timeout,
});

interface FarmerProfile {
  state: string;
  landholding: number;
  cropTypes: string[];
  socialCategory: string;
}

interface ExplanationInput {
  profile: FarmerProfile;
  schemeName: string;
  eligible: boolean;
  ruleBasis: string;
}

interface NextStepsInput {
  schemeName: string;
  documents: string[];
  deadline?: string;
}

export const langchainOrchestrator = {
  async generateExplanation(input: ExplanationInput): Promise<{ explanation: string; confidenceNote: string }> {
    try {
      const chain = RunnableSequence.from([
        eligibilityExplanationPrompt,
        llm,
        new StringOutputParser(),
      ]);

      const response = await withRetry(
        () => chain.invoke({
          state: input.profile.state,
          landholding: input.profile.landholding.toString(),
          cropTypes: input.profile.cropTypes.join(', '),
          socialCategory: input.profile.socialCategory,
          schemeName: input.schemeName,
          eligible: input.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE',
          ruleBasis: input.ruleBasis,
        }),
        2,
        1000
      );

      const cleaned = response.replace(/```json|```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        return {
          explanation: input.eligible 
            ? `Farmer meets eligibility criteria based on ${input.ruleBasis}.`
            : `Farmer does not meet eligibility criteria based on ${input.ruleBasis}.`,
          confidenceNote: 'Rule-based decision',
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        explanation: parsed.explanation || 'No explanation available',
        confidenceNote: parsed.confidenceNote || 'Standard confidence',
      };
    } catch (error) {
      return {
        explanation: input.eligible 
          ? 'Farmer meets the eligibility requirements based on rule-based evaluation.'
          : 'Farmer does not meet the eligibility requirements based on rule-based evaluation.',
        confidenceNote: 'Fallback - LLM unavailable',
      };
    }
  },

  async generateNextSteps(input: NextStepsInput): Promise<string[]> {
    try {
      const chain = RunnableSequence.from([
        nextStepsPrompt,
        llm,
        new StringOutputParser(),
      ]);

      const response = await withRetry(
        () => chain.invoke({
          schemeName: input.schemeName,
          documents: input.documents.join(', '),
          deadline: input.deadline || 'Not specified',
        }),
        2,
        1000
      );

      const cleaned = response.replace(/```json|```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        return [
          'Gather required documents',
          'Visit nearest government office',
          'Submit application before deadline',
        ];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.steps || [];
    } catch {
      return [
        'Collect necessary documents',
        'Complete application form',
        'Submit to designated authority',
      ];
    }
  },

  async retrieveRelevantContext(
    schemeId: string,
    queryText: string
  ): Promise<string[]> {
    try {
      const queryEmbedding = await embeddingsService.embedTexts([queryText]);

      const chunks = await SchemeChunk.aggregate([
        {
          $vectorSearch: {
            index: 'scheme_vector_index',
            path: 'embedding',
            queryVector: queryEmbedding[0],
            numCandidates: 100,
            limit: 3,
            filter: { schemeId: { $eq: schemeId } },
          },
        },
        {
          $project: {
            chunkText: 1,
            pageNumber: 1,
          },
        },
      ]);

      if (chunks.length === 0) {
        return ['No relevant context found'];
      }

      return chunks.map(c => `Page ${c.pageNumber}: ${c.chunkText.en.substring(0, 200)}`);
    } catch {
      return ['Context retrieval failed'];
    }
  },
};