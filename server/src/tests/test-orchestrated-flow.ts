import mongoose from 'mongoose';
import { orchestratedMatcherService } from '../services/eligibility/orchestrated-matcher.service.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/niti-setu';

async function testOrchestratedFlow() {
  console.log('=== Testing Orchestrated Eligibility Flow ===\n');

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const testProfile = {
    state: 'Punjab',
    district: 'Ludhiana',
    landholding: 3,
    cropTypes: ['wheat', 'rice'],
    socialCategory: 'General',
  };

  console.log('Test Profile:');
  console.log(JSON.stringify(testProfile, null, 2));
  console.log('');

  const schemeId = 'test-scheme-id';
  const schemeName = 'PM-KISAN';

  try {
    console.log('Running eligibility check...');
    const result = await orchestratedMatcherService.checkEligibility(
      schemeId,
      schemeName,
      testProfile
    );

    console.log('\nResult:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.disconnect();
  console.log('\nTest complete');
}

testOrchestratedFlow().catch(console.error);