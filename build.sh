#!/bin/bash
set -e

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Bundle backend with esbuild
npx esbuild backend/src/index.ts --bundle --platform=node --format=cjs --outfile=backend/dist/index.js --external:@prisma/client --external:@supabase/supabase-js

# Install frontend and build
cd frontend && npm install && npm run build
