#!/bin/bash
set -e

# Install root dependencies
npm install

# Install backend dependencies (for @prisma/client etc.)
cd backend && npm install && cd ..

# Bundle backend + API handler into a single self-contained api/index.js
npx esbuild api/entry.ts --bundle --platform=node --format=cjs --outfile=api/index.js --external:@prisma/client --external:@supabase/supabase-js

# Install frontend and build
cd frontend && npm install && npm run build
