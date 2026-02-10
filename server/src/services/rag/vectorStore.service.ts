import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { logger } from '@config/logger.js';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX!);
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: 'text-embedding-3-small',
});

export const vectorStore = {
  async upsertDocuments(
    documents: Array<{ id: string; text: string; metadata: any }>
  ): Promise<void> {
    const vectors = await Promise.all(
      documents.map(async (doc) => ({
        id: doc.id,
        values: await embeddings.embedQuery(doc.text),
        metadata: doc.metadata,
      }))
    );

    await index.upsert(vectors);
    logger.info(`Upserted ${vectors.length} documents to Pinecone`);
  },

  async similaritySearch(query: string, topK: number = 5): Promise<any[]> {
    const queryEmbedding = await embeddings.embedQuery(query);
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return results.matches || [];
  },

  async deleteBySchemeId(schemeId: string): Promise<void> {
    await index.deleteMany({ schemeId });
    logger.info(`Deleted vectors for scheme: ${schemeId}`);
  },
};