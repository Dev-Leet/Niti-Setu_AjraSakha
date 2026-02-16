#!/bin/bash

set -e

echo "=== Starting ML Services ==="
echo

cd python-ml

echo "Running setup check..."
python3 setup_check.py
if [ $? -ne 0 ]; then
    echo
    echo "Setup check failed. Please fix the issues above."
    exit 1
fi

echo
echo "Starting embedding service on port 5001..."
python3 embedding_service.py &
EMBED_PID=$!
echo "  PID: $EMBED_PID"

sleep 3

echo
echo "Starting Llama service on port 5002..."
python3 llama_service.py &
LLAMA_PID=$!
echo "  PID: $LLAMA_PID"

echo
echo "✓ ML services started successfully"
echo "  Embedding service: http://localhost:5001"
echo "  Llama service: http://localhost:5002"

echo "$EMBED_PID" > embed.pid
echo "$LLAMA_PID" > llama.pid

wait