#!/bin/bash

set -e

MODEL_DIR="./models"
MODEL_FILE="tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
MODEL_URL="https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"

echo "=== TinyLlama Model Downloader ==="
echo

mkdir -p "$MODEL_DIR"

if [ -f "$MODEL_DIR/$MODEL_FILE" ]; then
    echo "✓ Model already exists: $MODEL_DIR/$MODEL_FILE"
    SIZE=$(du -h "$MODEL_DIR/$MODEL_FILE" | cut -f1)
    echo "  Size: $SIZE"
    exit 0
fi

echo "Downloading TinyLlama model..."
echo "URL: $MODEL_URL"
echo "Destination: $MODEL_DIR/$MODEL_FILE"
echo

if command -v wget &> /dev/null; then
    wget -O "$MODEL_DIR/$MODEL_FILE" "$MODEL_URL"
elif command -v curl &> /dev/null; then
    curl -L -o "$MODEL_DIR/$MODEL_FILE" "$MODEL_URL"
else
    echo "Error: Neither wget nor curl found. Please install one of them."
    exit 1
fi

if [ -f "$MODEL_DIR/$MODEL_FILE" ]; then
    SIZE=$(du -h "$MODEL_DIR/$MODEL_FILE" | cut -f1)
    echo
    echo "✓ Download complete!"
    echo "  File: $MODEL_DIR/$MODEL_FILE"
    echo "  Size: $SIZE"
else
    echo
    echo "✗ Download failed!"
    exit 1
fi