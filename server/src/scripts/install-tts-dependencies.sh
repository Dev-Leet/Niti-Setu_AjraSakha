#!/bin/bash

echo "=== Installing TTS Dependencies ==="
echo

if command -v apt-get &> /dev/null; then
    echo "Detected Debian/Ubuntu system"
    sudo apt-get update
    sudo apt-get install -y espeak-ng
elif command -v yum &> /dev/null; then
    echo "Detected RedHat/CentOS system"
    sudo yum install -y espeak-ng
elif command -v brew &> /dev/null; then
    echo "Detected macOS system"
    brew install espeak-ng
else
    echo "Warning: Package manager not detected"
    echo "Please install espeak-ng manually"
    exit 1
fi

echo
echo "Verifying espeak-ng installation..."
if command -v espeak-ng &> /dev/null; then
    echo "✓ espeak-ng installed successfully"
    espeak-ng --version
else
    echo "✗ espeak-ng installation failed"
    exit 1
fi

echo
echo "Testing TTS with Hindi..."
echo "परीक्षण" | espeak-ng -v hi-IN

echo
echo "✓ TTS dependencies installed and verified"