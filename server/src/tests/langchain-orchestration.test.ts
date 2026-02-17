import { langchainOrchestratorService } from '../services/langchain/orchestrator.service.js';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/niti-setu';

const testProfile = {
  state: 'Punjab',
  district: 'Ludhiana',
  landholding: 3,
  cropTypes: ['wheat', 'rice'],
  socialCategory: 'General',
};

async function testLangChainOrchestration() {
  console.log('=== LangChain Orchestration Test ===\n');

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  console.log('Test Profile:');
  console.log(JSON.stringify(testProfile, null, 2));
  console.log('');

  const schemeId = 'test_scheme_id';

  try {
    const result = await langchainOrchestratorService.determineEligibility(testProfile, schemeId);

    console.log('Eligibility Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
}

testLangChainOrchestration().catch(console.error);