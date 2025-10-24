#!/bin/bash
set -e

echo "🔧 Installing dependencies..."
npm ci

echo "🏗️ Building React app..."
CI=false npm run build

echo "✅ Build completed successfully!"
