#!/bin/bash
# Install dependencies including dev dependencies
npm install --legacy-peer-deps

# Ensure vite and other build dependencies are installed
npm install vite @vitejs/plugin-react esbuild --save-dev

# Run the Netlify-specific build command
npm run build:netlify
