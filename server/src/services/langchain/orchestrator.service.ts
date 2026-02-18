import { ChatOpenAI } from '@langchain/openai'; 
import { PromptTemplate } from '@langchain/core/prompts';
//import { StringOutputParser } from '@langchain/core/output_parsers';
//import { RunnableSequence } from '@langchain/core/runnables';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { SchemeChunk } from '@models/SchemeChunk.model.js';

const llm = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY || '',
});

const eligibilityPrompt = PromptTemplate.fromTemplate(`
You are an agricultural scheme eligibility expert for India.

Given the following farmer profile and scheme information, determine if the farmer is eligible.

Farmer Profile:
State: {state}
District: {district}
Land Holding: {landholding} acres
Crop Types: {cropTypes}
Social Category: {socialCategory}

Relevant Scheme Information:
{context}

Analyze the eligibility criteria and provide:
1. Eligibility Decision: YES or NO
2. Confidence Score: 0-100
3. Reasoning: Brief explanation citing specific criteria
4. Required Documents: List of documents needed if eligible

Format your response as JSON:
{{
  "eligible": boolean,
  "confidence": number,
  "reasoning": "string",
  "requiredDocuments": ["string"]
}}
`);

export const langchainOrchestratorService = {
  async determineEligibility(
    farmerProfile: {
      state: string;
      district: string;
      landholding: number;
      cropTypes: string[];
      socialCategory: string;
    },
    schemeId: string
  ): Promise<{
    eligible: boolean;
    confidence: number;
    reasoning: string;
    requiredDocuments: string[];
  }> {
    const queryText = `Eligibility criteria for ${farmerProfile.state} farmer with ${farmerProfile.landholding} acres growing ${farmerProfile.cropTypes.join(', ')}`;
    
    const queryEmbedding = await embeddingsService.embedTexts([queryText]);
    
    const relevantChunks = await SchemeChunk.aggregate([
      {
        $vectorSearch: {
          index: 'scheme_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding[0],
          numCandidates: 100,
          limit: 5,
          filter: { schemeId: { $eq: schemeId } },
        },
      },
      {
        $project: {
          chunkText: 1,
          pageNumber: 1,
          _id: 0,
        },
      },
    ]);

    const context = relevantChunks
      .map(chunk => `Page ${chunk.pageNumber}: ${chunk.chunkText.en}`)
      .join('\n\n');

        const formatted = await eligibilityPrompt.format({
      state: farmerProfile.state,
      district: farmerProfile.district,
      landholding: farmerProfile.landholding.toString(),
      cropTypes: farmerProfile.cropTypes.join(', '),
      socialCategory: farmerProfile.socialCategory,
      context,
    });

    const response = await llm.invoke(formatted);
    const text = (response?.content ?? response) as string;
    const parsed = JSON.parse(text);
    return parsed;
  },

  async explainScheme(schemeId: string, question: string): Promise<string> {
    const queryEmbedding = await embeddingsService.embedTexts([question]);
    
    const relevantChunks = await SchemeChunk.aggregate([
      {
        $vectorSearch: {
          index: 'scheme_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding[0],
          numCandidates: 50,
          limit: 3,
          filter: { schemeId: { $eq: schemeId } },
        },
      },
    ]);

    const context = relevantChunks
      .map(chunk => chunk.chunkText.en)
      .join('\n\n');

    const explainPrompt = PromptTemplate.fromTemplate(`
Based on the following scheme information, answer this question: {question}

Scheme Information:
{context}

Provide a clear, concise answer in simple Hindi-English (Hinglish) suitable for farmers.
`);

    const formatted = await explainPrompt.format({ question, context });
    const response = await llm.invoke(formatted);
    const text = (response?.content ?? response) as string;
    return text;
  },
};