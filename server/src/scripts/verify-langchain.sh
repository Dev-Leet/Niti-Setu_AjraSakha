#!/bin/bash

echo "=== LangChain Setup Verification ==="
echo

echo "1. Checking Llama service..."
curl -s http://localhost:5002/health > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✓ Llama service running"
else
    echo "   ✗ Llama service not accessible"
    echo "   Run: npm run ml:start"
    exit 1
fi

echo
echo "2. Checking dependencies..."
if grep -q "@langchain/core" package.json; then
    echo "   ✓ @langchain/core installed"
else
    echo "   ✗ @langchain/core missing"
    exit 1
fi

echo
echo "3. Running integration test..."
npm run test:langchain

echo
echo "=== Verification Complete ==="