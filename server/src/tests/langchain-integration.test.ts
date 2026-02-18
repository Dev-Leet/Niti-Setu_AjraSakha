import { langchainOrchestrator } from '../services/langchain/orchestrator';
import { checkLlamaServiceHealth } from '../services/langchain/health';

async function testLangChainIntegration() {
  console.log('=== LangChain Integration Test ===\n');

  const serviceHealth = await checkLlamaServiceHealth();
  console.log(`Llama Service: ${serviceHealth ? 'ONLINE' : 'OFFLINE'}\n`);

  if (!serviceHealth) {
    console.error('Cannot proceed - Llama service is not running');
    return;
  }

  const testProfile = {
    state: 'Punjab',
    landholding: 3,
    cropTypes: ['wheat', 'rice'],
    socialCategory: 'General',
  };

  console.log('Test 1: Generate Explanation (Eligible)');
  const eligible = await langchainOrchestrator.generateExplanation({
    profile: testProfile,
    schemeName: 'PM-KISAN',
    eligible: true,
    ruleBasis: 'landholding <= 5 acres',
  });
  console.log('Result:', JSON.stringify(eligible, null, 2));
  console.log('');

  console.log('Test 2: Generate Explanation (Not Eligible)');
  const notEligible = await langchainOrchestrator.generateExplanation({
    profile: testProfile,
    schemeName: 'PM-KISAN',
    eligible: false,
    ruleBasis: 'state not in allowed list',
  });
  console.log('Result:', JSON.stringify(notEligible, null, 2));
  console.log('');

  console.log('Test 3: Generate Next Steps');
  const steps = await langchainOrchestrator.generateNextSteps({
    schemeName: 'PM-KISAN',
    documents: ['Aadhaar', 'Land Records', 'Bank Passbook'],
    deadline: '2024-12-31',
  });
  console.log('Steps:', steps);
  console.log('');

  console.log('=== Tests Complete ===');
}

testLangChainIntegration().catch(console.error);