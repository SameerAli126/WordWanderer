#!/bin/bash

# WordWanderer - Automatic Vercel Environment Variable Updater
# This script automatically updates the NEXT_PUBLIC_API_URL in Vercel

echo "🔄 WordWanderer - Vercel Environment Updater"
echo "============================================="

# Your static ngrok URL
STATIC_NGROK_URL="curiously-balanced-tarpon.ngrok-free.app"
FULL_API_URL="https://$STATIC_NGROK_URL"

echo "📡 Using static ngrok URL: $FULL_API_URL"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI locally..."
    if ! npm install -g vercel 2>/dev/null; then
        echo "⚠️  Global install failed. Installing locally..."
        npm install vercel
        VERCEL_CMD="npx vercel"
    else
        VERCEL_CMD="vercel"
    fi
else
    VERCEL_CMD="vercel"
fi

echo "🚀 Updating Vercel environment variable..."

# Update for production environment
echo "🔄 Updating production environment..."
$VERCEL_CMD env rm NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
if echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL production; then
    echo "✅ Production environment updated!"
else
    echo "❌ Production update failed"
fi

# Update for preview environment
echo "🔄 Updating preview environment..."
$VERCEL_CMD env rm NEXT_PUBLIC_API_URL preview --yes 2>/dev/null || true
if echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL preview; then
    echo "✅ Preview environment updated!"
else
    echo "❌ Preview update failed"
fi

echo ""
echo "✅ Vercel environment variables updated!"
echo ""
echo "📋 Next steps:"
echo "1. Trigger a new deployment in Vercel dashboard"
echo "2. Or run: $VERCEL_CMD --prod"
echo ""
echo "🌐 Your API URL is now: $FULL_API_URL"
echo "🔗 Your Vercel app: https://wordwanderer.vercel.app"
