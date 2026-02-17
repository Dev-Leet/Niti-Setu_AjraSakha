import mongoose from 'mongoose';
import { SchemeChunk } from '../models/SchemeChunk.model';
import { embeddingsService } from '../services/ml/embeddings.service';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/niti-setu';

async function testVectorSearch() {
  console.log('=== Vector Search Test ===\n');

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const testQuery = 'land holding eligibility criteria for small farmers';
  console.log(`Query: ${testQuery}\n`);

  const queryEmbedding = await embeddingsService.embedTexts([testQuery]);
  console.log('Generated query embedding\n');

  const results = await SchemeChunk.aggregate([
    {
      $vectorSearch: {
        index: 'scheme_vector_index',
        path: 'embedding',
        queryVector: queryEmbedding[0],
        numCandidates: 100,
        limit: 5,
      },
    },
    {
      $project: {
        schemeName: 1,
        chunkText: 1,
        pageNumber: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]);

  console.log(`Found ${results.length} results:\n`);

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.schemeName.en}`);
    console.log(`   Page: ${result.pageNumber}`);
    console.log(`   Score: ${result.score.toFixed(4)}`);
    console.log(`   Text: ${result.chunkText.en.substring(0, 100)}...`);
    console.log('');
  });

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

testVectorSearch().catch(console.error);