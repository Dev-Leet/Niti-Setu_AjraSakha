#!/bin/bash

echo "=== Running All Tests ==="
echo

echo "1. Testing ML Services Health..."
npm run ml:verify
echo

echo "2. Testing Voice Extraction..."
npx tsx tests/voice-extraction.test.ts
echo

echo "3. Testing Llama Profile Extraction..."
npx tsx tests/llama-extraction.test.ts
echo

echo "4. Testing Vector Search..."
npx tsx tests/vector-search.test.ts
echo

echo "5. Testing LangChain Orchestration..."
npx tsx tests/langchain-orchestration.test.ts
echo

echo "=== All Tests Complete ==="