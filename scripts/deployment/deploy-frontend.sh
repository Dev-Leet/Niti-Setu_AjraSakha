#!/bin/bash

echo "Deploying frontend to Vercel..."

cd client

npm run build

vercel --prod

echo "✓ Frontend deployed"