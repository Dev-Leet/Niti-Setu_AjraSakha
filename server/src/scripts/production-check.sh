#!/bin/bash

echo "=== Production Readiness Check ==="
echo

ERRORS=0

echo "1. Checking environment variables..."
if [ -z "$MONGODB_URI" ]; then
    echo "  ✗ MONGODB_URI not set"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✓ MONGODB_URI configured"
fi

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "your_jwt_secret_key_here" ]; then
    echo "  ✗ JWT_SECRET not configured"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✓ JWT_SECRET configured"
fi

echo
echo "2. Checking ML services..."
if curl -s http://localhost:5001/health > /dev/null 2>&1; then
    echo "  ✓ Embedding service running"
else
    echo "  ✗ Embedding service not accessible"
    ERRORS=$((ERRORS + 1))
fi

if curl -s http://localhost:5002/health > /dev/null 2>&1; then
    echo "  ✓ Llama service running"
else
    echo "  ✗ Llama service not accessible"
    ERRORS=$((ERRORS + 1))
fi

echo
echo "3. Checking MongoDB Atlas..."
if mongosh "$MONGODB_URI" --eval "db.runCommand({ ping: 1 })" --quiet > /dev/null 2>&1; then
    echo "  ✓ MongoDB Atlas connected"
else
    echo "  ✗ MongoDB Atlas connection failed"
    ERRORS=$((ERRORS + 1))
fi

echo
echo "4. Checking TTS dependencies..."
if command -v espeak-ng &> /dev/null; then
    echo "  ✓ espeak-ng installed"
else
    echo "  ✗ espeak-ng not found"
    ERRORS=$((ERRORS + 1))
fi

echo
echo "5. Checking model file..."
if [ -f "server/python-ml/models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf" ]; then
    echo "  ✓ TinyLlama model present"
else
    echo "  ✗ TinyLlama model not found"
    ERRORS=$((ERRORS + 1))
fi

echo
if [ $ERRORS -eq 0 ]; then
    echo "✓ All checks passed. System ready for production."
    exit 0
else
    echo "✗ $ERRORS error(s) found. Please fix before deploying."
    exit 1
fi