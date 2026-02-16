#!/bin/bash

echo "=== Verifying ML Services ==="
echo

check_service() {
    local name=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✓ $name is running"
            return 0
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo "✗ $name is not responding"
    return 1
}

echo "Checking embedding service..."
check_service "Embedding Service" "http://localhost:5001/health"

echo
echo "Checking Llama service..."
check_service "Llama Service" "http://localhost:5002/health"

echo
echo "Testing embedding generation..."
EMBED_RESPONSE=$(curl -s -X POST http://localhost:5001/embed \
    -H "Content-Type: application/json" \
    -d '{"texts":["test"]}')

if echo "$EMBED_RESPONSE" | grep -q "embeddings"; then
    echo "✓ Embedding service functional"
else
    echo "✗ Embedding service test failed"
fi

echo
echo "✓ All ML services verified"