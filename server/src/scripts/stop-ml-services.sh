#!/bin/bash

cd python-ml

if [ -f embed.pid ]; then
    kill $(cat embed.pid)
    rm embed.pid
    echo "Embedding service stopped"
fi

if [ -f llama.pid ]; then
    kill $(cat llama.pid)
    rm llama.pid
    echo "Llama service stopped"
fi