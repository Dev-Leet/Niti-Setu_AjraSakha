#!/bin/bash

echo "Running E2E tests..."

cd client

npx playwright test --config=playwright.config.ts

echo "✓ E2E tests complete"