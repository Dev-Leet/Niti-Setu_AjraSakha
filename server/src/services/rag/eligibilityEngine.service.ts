import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { vectorSearchService } from './vectorSearch.service.js';
import { IFarmerProfile } from '@models/FarmerProfile.model.js';
import { env } from '@config/env.js';
 
const llm = new ChatOpenAI({
  openAIApiKey: env.OPENAI_API_KEY,
  modelName: 'gpt-4-turbo-preview',
  temperature: 0.1,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: env.OPENAI_API_KEY,
}); 

export const eligibilityEngine = {
  async checkEligibility(profile: IFarmerProfile, schemes: any[]) {
    const results = [];
    let totalEligible = 0;
    let totalBenefits = 0;

    for (const scheme of schemes) {
      const query = `Check eligibility for ${profile.fullName} from ${profile.state} with ${profile.landholding.totalArea} acres land for scheme ${scheme.name.en}`;

      const embedding = await embeddings.embedQuery(query);
      const docs = await vectorSearchService.search(embedding, 5, { schemeId: scheme.schemeId });

      const context = docs.map(d => d.metadata.text).join('\n');
      const prompt = `Profile: ${JSON.stringify(profile)}\nScheme: ${JSON.stringify(scheme)}\nContext: ${context}\n\nDetermine eligibility and return JSON with: isEligible, confidence, reasoning, citations`;

      const response = await llm.invoke(prompt);
      const result = JSON.parse(response.content as string);

      if (result.isEligible) {
        totalEligible++;
        totalBenefits += scheme.benefits.financial.amount;
      }

      results.push({
        schemeId: scheme.schemeId,
        schemeName: scheme.name.en,
        ...result,
        benefits: scheme.benefits,
      });
    }

    return { results, totalEligible, totalBenefits };
  },
};