#!/bin/bash

# WordWanderer - Automatic Vercel Environment Variable Updater
# This script automatically updates the NEXT_PUBLIC_API_URL in Vercel when ngrok URL changes

echo "🔄 WordWanderer - Vercel Environment Updater"
echo "============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Wait for ngrok to start
echo "⏳ Waiting for ngrok tunnel to establish..."
sleep 5

# Get the ngrok URL
echo "🔍 Fetching ngrok URL..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Could not fetch ngrok URL. Make sure ngrok is running on port 4040."
    echo "💡 Try running: ./start-backend.sh"
    exit 1
fi

echo "📡 Found ngrok URL: $NGROK_URL"

# Update Vercel environment variable
echo "🚀 Updating Vercel environment variable..."

# Update for production environment
vercel env rm NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
echo "$NGROK_URL" | vercel env add NEXT_PUBLIC_API_URL production

# Update for preview environment
vercel env rm NEXT_PUBLIC_API_URL preview --yes 2>/dev/null || true
echo "$NGROK_URL" | vercel env add NEXT_PUBLIC_API_URL preview

# Update for development environment
vercel env rm NEXT_PUBLIC_API_URL development --yes 2>/dev/null || true
echo "$NGROK_URL" | vercel env add NEXT_PUBLIC_API_URL development

echo "✅ Vercel environment variables updated!"
echo ""
echo "📋 Next steps:"
echo "1. Trigger a new deployment in Vercel dashboard"
echo "2. Or run: vercel --prod"
echo ""
echo "🌐 Your API URL is now: $NGROK_URL"
echo "🔗 Your Vercel app: https://wordwanderer.vercel.app"
echo ""
echo "💡 Pro tip: Get a static ngrok domain to avoid this step!"
echo "   Visit: https://dashboard.ngrok.com/cloud-edge/domains"
