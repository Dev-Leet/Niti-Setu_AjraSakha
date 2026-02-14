#!/bin/bash

echo "Deploying backend to DigitalOcean..."

cd server

npm run build

ssh root@your-server "cd /app && git pull && npm install && pm2 restart niti-setu"

echo "✓ Backend deployed"