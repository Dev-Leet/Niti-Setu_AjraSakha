#!/bin/bash

echo "Starting ML services..."

cd python-ml

if [ ! -f "models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf" ]; then
    echo "Downloading TinyLlama model..."
    bash download_model.sh
fi

echo "Starting embedding service on port 5001..."
python3 embedding_service.py &
EMBED_PID=$!

sleep 3

echo "Starting Llama service on port 5002..."
python3 llama_service.py &
LLAMA_PID=$!

echo "ML services started"
echo "Embedding PID: $EMBED_PID"
echo "Llama PID: $LLAMA_PID"

echo "$EMBED_PID" > embed.pid
echo "$LLAMA_PID" > llama.pid

wait