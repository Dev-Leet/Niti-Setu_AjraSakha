#!/bin/bash

echo "Installing Niti-Setu AjraSakha..."

npm install

cd packages/types && npm install && npm run build && cd ../..

cd server && npm install && cd ..

cd client && npm install && cd ..

echo "✓ Installation complete"