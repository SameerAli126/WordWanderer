#!/bin/bash

# WordWanderer - Vercel Login Helper
# This script helps you log into Vercel CLI

echo "🔐 WordWanderer - Vercel Login Helper"
echo "===================================="

# Install Vercel CLI if needed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    if ! npm install -g vercel 2>/dev/null; then
        echo "⚠️  Global install failed. Installing locally..."
        npm install vercel --save-dev
        VERCEL_CMD="npx vercel"
    else
        VERCEL_CMD="vercel"
    fi
else
    VERCEL_CMD="vercel"
fi

echo ""
echo "🔑 Logging into Vercel..."
echo "This will open your browser for authentication."
echo ""

# Login to Vercel
$VERCEL_CMD login

echo ""
echo "✅ Vercel login complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: ./start-wordwanderer-clean.sh"
echo "2. Choose 'y' when asked about updating Vercel environment"
echo "3. Your login credentials are now saved for future use"
echo ""
echo "💡 You only need to login once. The credentials are saved locally."
