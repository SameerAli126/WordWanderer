#!/bin/bash

# WordWanderer - Complete Backend Deployment Script
# This script starts the backend, sets up ngrok, and optionally updates Vercel

echo "🚀 WordWanderer - Complete Backend Deployment"
echo "=============================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your configuration and run this script again."
    exit 1
fi

# Load environment variables
source .env.local

# Start backend
echo "🔧 Starting WordWanderer backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
if [ -n "$NGROK_DOMAIN" ]; then
    echo "📡 Using static domain: $NGROK_DOMAIN"
    ngrok http --domain=$NGROK_DOMAIN 5000 &
    NGROK_PID=$!
    STATIC_URL="https://$NGROK_DOMAIN"
else
    echo "⚠️  No static domain configured. Using random domain..."
    ngrok http 5000 &
    NGROK_PID=$!
    STATIC_URL=""
fi

# Wait for ngrok to establish
echo "⏳ Waiting for ngrok tunnel to establish..."
sleep 5

# Get ngrok URL
if [ -n "$STATIC_URL" ]; then
    NGROK_URL=$STATIC_URL
else
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io' | head -1)
fi

if [ -z "$NGROK_URL" ]; then
    echo "❌ Could not establish ngrok tunnel"
    echo "🔍 Check ngrok dashboard: http://localhost:4040"
    exit 1
fi

echo ""
echo "🎉 SUCCESS! Backend is running:"
echo "📡 ngrok URL: $NGROK_URL"
echo "🖥️  Local backend: http://localhost:5000"
echo "📊 ngrok dashboard: http://localhost:4040"
echo ""

# Ask if user wants to update Vercel automatically
read -p "🤖 Do you want to automatically update Vercel environment variables? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Updating Vercel environment variables..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Update Vercel environment variables
    echo "🔄 Updating NEXT_PUBLIC_API_URL in Vercel..."
    
    # Remove old values
    vercel env rm NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
    vercel env rm NEXT_PUBLIC_API_URL preview --yes 2>/dev/null || true
    
    # Add new values
    echo "$NGROK_URL" | vercel env add NEXT_PUBLIC_API_URL production
    echo "$NGROK_URL" | vercel env add NEXT_PUBLIC_API_URL preview
    
    echo "✅ Vercel environment variables updated!"
    echo ""
    echo "🔄 Triggering Vercel deployment..."
    vercel --prod
    echo ""
fi

echo "📋 Your WordWanderer setup:"
echo "🌐 Frontend: https://wordwanderer.vercel.app"
echo "📡 Backend: $NGROK_URL"
echo "🖥️  Local: http://localhost:3000"
echo ""
echo "💡 Pro Tips:"
echo "• Get a static ngrok domain: https://dashboard.ngrok.com/cloud-edge/domains"
echo "• Add NGROK_DOMAIN=your-domain.ngrok.io to .env.local"
echo "• This eliminates the need to update Vercel every time!"
echo ""
echo "🛑 To stop everything, press Ctrl+C"

# Keep script running
wait
