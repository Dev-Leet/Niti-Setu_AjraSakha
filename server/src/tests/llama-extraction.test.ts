import axios from 'axios';

const LLAMA_URL = 'http://localhost:5002';

const testProfiles = [
  'My name is Rajesh Singh from Uttar Pradesh, Varanasi district. I have 2 acres of land growing wheat and rice. I am from General category.',
  'मेरा नाम गीता देवी है। मैं बिहार के पटना से हूं। मेरे पास 1.5 एकड़ जमीन है। मैं मक्का उगाती हूं। मैं एससी वर्ग से हूं।',
];

async function testLlamaExtraction() {
  console.log('=== Llama Voice Profile Extraction Test ===\n');

  for (const profile of testProfiles) {
    console.log(`Testing: ${profile}\n`);

    const prompt = `Extract farmer information from this text and return ONLY a JSON object with these exact fields: fullName, state, district, pincode, landholding (number in acres), cropTypes (array), socialCategory.

Text: "${profile}"

JSON:`;

    try {
      const response = await axios.post(`${LLAMA_URL}/generate`, {
        prompt,
        max_length: 200,
      });

      console.log('Raw Response:', response.data.text);

      const jsonMatch = response.data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const extracted = JSON.parse(jsonMatch[0]);
        console.log('Extracted JSON:', JSON.stringify(extracted, null, 2));
      } else {
        console.log('No JSON found in response');
      }

      console.log('\n---\n');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
    }
  }
}

testLlamaExtraction();