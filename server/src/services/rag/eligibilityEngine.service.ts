import { ChatOpenAI } from '@langchain/openai';
import { vectorSearchService } from './vectorSearch.service.js';
import { IFarmerProfile } from '@models/FarmerProfile.model.js';
import { IScheme } from '@models/Scheme.model.js';
import { env } from '@config/env.js';
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: 'gpt-4-turbo-preview',
  temperature: 0.1,
});

export const eligibilityEngine = {
  async checkEligibility(profile: IFarmerProfile, schemes: any[]) {
    const results = await Promise.all(
      schemes.map(async (scheme) => {
        const query = `
          Farmer Profile:
          - State: ${profile.state}
          - District: ${profile.district}
          - Land Area: ${profile.landholding.totalArea} acres
          - Crops: ${profile.cropTypes.join(', ')}
          - Category: ${profile.socialCategory}
          
          Scheme: ${scheme.name.en}
          Check eligibility and provide detailed reasoning.
        `;

        const relevantDocs = await vectorStore.similaritySearch(
          `${scheme.schemeId} eligibility criteria`,
          5
        );

        const context = relevantDocs
          .map((doc: any) => `Page ${doc.metadata.page}: ${doc.metadata.text}`)
          .join('\n\n');

        const prompt = `
          Based on the following official scheme documents:
          ${context}
          
          ${query}
          
          Respond in JSON format:
          {
            "isEligible": boolean,
            "confidence": number (0-1),
            "reasoning": "detailed explanation",
            "citations": [{ "page": number, "text": "relevant excerpt" }]
          }
        `;

        const response = await llm.invoke(prompt);
        const result = JSON.parse(response.content as string);

        return {
          schemeId: scheme.schemeId,
          schemeName: scheme.name.en,
          isEligible: result.isEligible,
          confidence: result.confidence,
          reasoning: result.reasoning,
          citations: result.citations.map((c: any) => ({
            page: c.page,
            paragraph: 1,
            text: c.text,
            documentUrl: scheme.pdfDocuments[0]?.url || scheme.officialUrl,
          })),
          benefits: scheme.benefits,
        };
      })
    );

    const eligible = results.filter((r) => r.isEligible);
    const totalBenefits = eligible.reduce((sum, r) => sum + r.benefits.financial.amount, 0);

    return {
      results,
      totalEligible: eligible.length,
      totalBenefits,
    };
  },
};