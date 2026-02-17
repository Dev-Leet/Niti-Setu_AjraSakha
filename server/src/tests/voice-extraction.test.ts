import { voiceService } from '../services/voice.service';
import { voiceValidationService } from '../services/voice/validation.service';

const testTranscripts = [
  {
    input: 'My name is Ramesh Kumar. I am from Maharashtra, Pune district. I have 3 acres of land where I grow rice and wheat. I belong to OBC category.',
    expected: {
      fullName: 'Ramesh Kumar',
      state: 'Maharashtra',
      district: 'Pune',
      landholding: 3,
      cropTypes: ['rice', 'wheat'],
      socialCategory: 'OBC',
    },
  },
  {
    input: 'मेरा नाम सुरेश पटेल है। मैं राजस्थान के जयपुर से हूं। मेरे पास 5 एकड़ जमीन है जहां मैं कपास उगाता हूं। मैं एससी श्रेणी से हूं।',
    expected: {
      fullName: 'Suresh Patel',
      state: 'Rajasthan',
      district: 'Jaipur',
      landholding: 5,
      cropTypes: ['cotton'],
      socialCategory: 'SC',
    },
  },
];

async function testVoiceExtraction() {
  console.log('=== Voice Extraction Test ===\n');

  for (const test of testTranscripts) {
    console.log(`Input: ${test.input}\n`);

    try {
      const extracted = await voiceService.extractProfile(test.input);
      console.log('Extracted:', JSON.stringify(extracted, null, 2));

      const validation = voiceValidationService.validateProfile(extracted);
      console.log('Validation:', JSON.stringify(validation, null, 2));

      const matches = {
        name: extracted.fullName?.toLowerCase().includes(test.expected.fullName.toLowerCase().split(' ')[0]),
        state: extracted.state?.toLowerCase() === test.expected.state.toLowerCase(),
        landholding: extracted.landholding === test.expected.landholding,
      };

      console.log('Match Results:', matches);
      console.log('\n---\n');
    } catch (error) {
      console.error('Test failed:', error);
    }
  }
}

testVoiceExtraction();