#!/bin/bash

# WordWanderer - Complete One-Click Startup Script
# This script starts everything and handles Vercel updates automatically

echo "🚀 WordWanderer - One-Click Startup"
echo "===================================="

# Your static ngrok URL (free tier)
STATIC_NGROK_URL="curiously-balanced-tarpon.ngrok-free.app"
FULL_API_URL="https://$STATIC_NGROK_URL"

echo "📡 Using your static ngrok URL: $FULL_API_URL"

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Make sure you're in the WordWanderer root directory."
    exit 1
fi

# Start MongoDB and backend
echo "🔧 Starting WordWanderer backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting for backend to start..."
sleep 3

# Start ngrok with your static URL
echo "🌐 Starting ngrok with your static URL..."
ngrok http --url=$STATIC_NGROK_URL 5000 &
NGROK_PID=$!

echo "⏳ Waiting for ngrok tunnel to establish..."
sleep 5

# Test if ngrok is working
echo "🔍 Testing ngrok connection..."
if curl -s --max-time 5 "$FULL_API_URL" > /dev/null; then
    echo "✅ ngrok tunnel is working!"
else
    echo "⚠️  ngrok tunnel might still be establishing..."
fi

echo ""
echo "🎉 WordWanderer Backend Started Successfully!"
echo "============================================="
echo "📡 API URL: $FULL_API_URL"
echo "🖥️  Local Backend: http://localhost:5000"
echo "📊 ngrok Dashboard: http://localhost:4040"
echo ""

# Check if Vercel environment needs updating
echo "🔍 Checking if Vercel environment needs updating..."

# Try to install Vercel CLI locally (no sudo needed)
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

# Ask user if they want to update Vercel
echo ""
read -p "🤖 Do you want to update Vercel environment variables? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Updating Vercel environment variables..."
    
    # Update environment variables
    echo "🔄 Setting NEXT_PUBLIC_API_URL to: $FULL_API_URL"
    
    # Remove old values (ignore errors)
    $VERCEL_CMD env rm NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
    $VERCEL_CMD env rm NEXT_PUBLIC_API_URL preview --yes 2>/dev/null || true
    
    # Add new values
    if echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL production; then
        echo "✅ Production environment updated!"
    else
        echo "⚠️  Production update failed - you may need to update manually"
    fi
    
    if echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL preview; then
        echo "✅ Preview environment updated!"
    else
        echo "⚠️  Preview update failed - you may need to update manually"
    fi
    
    echo ""
    echo "🔄 Triggering new Vercel deployment..."
    if $VERCEL_CMD --prod; then
        echo "✅ Deployment triggered successfully!"
    else
        echo "⚠️  Deployment trigger failed - you can deploy manually from Vercel dashboard"
    fi
else
    echo "⏭️  Skipping Vercel update. You can run this script again later."
fi

echo ""
echo "🎯 WordWanderer is Ready!"
echo "========================="
echo "🌐 Frontend: https://wordwanderer.vercel.app"
echo "📡 Backend: $FULL_API_URL"
echo "🖥️  Local Dev: http://localhost:3000 (if running)"
echo ""
echo "💡 Your static ngrok URL will always be: $STATIC_NGROK_URL"
echo "   No need to update Vercel again unless you change it!"
echo ""
echo "📋 Next Steps:"
echo "1. Your backend is running with ngrok tunnel"
echo "2. Your Vercel app should now connect successfully"
echo "3. Test login at: https://wordwanderer.vercel.app/login"
echo ""
echo "🛑 To stop everything, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down WordWanderer..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $NGROK_PID 2>/dev/null || true
    echo "✅ Cleanup complete!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
echo "⏳ Keeping services running... (Press Ctrl+C to stop)"
wait
