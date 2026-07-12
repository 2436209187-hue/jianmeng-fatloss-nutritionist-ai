#!/bin/bash
set -e

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Bundle everything into a single self-contained api/index.js
npx esbuild api/entry.ts --bundle --platform=node --format=cjs --outfile=api/index.js

# Install frontend and build
cd frontend && npm install && npm run build
