#!/bin/bash

# WordWanderer - Fix Login Issues Script
# This script fixes the 404/405 errors and URL mismatches

echo "🔧 WordWanderer - Login Issues Fix"
echo "=================================="

# Your correct static ngrok URL
STATIC_NGROK_URL="curiously-balanced-tarpon.ngrok-free.app"
FULL_API_URL="https://$STATIC_NGROK_URL"

echo "📡 Using correct static ngrok URL: $FULL_API_URL"

# Step 1: Update .env.local to make sure it's correct
echo "📝 Updating .env.local with correct URL..."
sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$FULL_API_URL|g" .env.local

# Step 2: Kill any existing processes
echo "🛑 Stopping any existing backend/ngrok processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "ngrok" 2>/dev/null || true
sleep 2

# Step 3: Start backend
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..
sleep 3

# Step 4: Start ngrok with correct URL
echo "🌐 Starting ngrok with your static URL..."
ngrok http --url=$STATIC_NGROK_URL 5000 &
NGROK_PID=$!
sleep 5

# Step 5: Test backend connection
echo "🔍 Testing backend connection..."
if curl -s --max-time 10 "$FULL_API_URL/api/health" > /dev/null; then
    echo "✅ Backend is responding!"
else
    echo "⚠️  Backend might still be starting..."
fi

# Step 6: Update Vercel environment variables
echo ""
read -p "🤖 Do you want to update Vercel environment variables? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Updating Vercel environment variables..."
    
    # Install Vercel CLI if needed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI locally..."
        npm install vercel
        VERCEL_CMD="npx vercel"
    else
        VERCEL_CMD="vercel"
    fi
    
    # Update environment variables
    echo "🔄 Setting NEXT_PUBLIC_API_URL to: $FULL_API_URL"
    
    # Remove old values
    $VERCEL_CMD env rm NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
    $VERCEL_CMD env rm NEXT_PUBLIC_API_URL preview --yes 2>/dev/null || true
    
    # Add new values
    echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL production
    echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL preview
    
    echo "✅ Vercel environment variables updated!"
    echo ""
    echo "🔄 Triggering new Vercel deployment..."
    $VERCEL_CMD --prod
fi

echo ""
echo "🎉 Fix Complete!"
echo "================"
echo "📡 Backend API: $FULL_API_URL"
echo "🌐 Frontend: https://wordwanderer.vercel.app"
echo "📊 ngrok Dashboard: http://localhost:4040"
echo ""
echo "📋 Next Steps:"
echo "1. Wait for Vercel deployment to complete (if you updated it)"
echo "2. Go to https://wordwanderer.vercel.app"
echo "3. Try logging in - should work now!"
echo ""
echo "🔍 If still having issues:"
echo "- Check ngrok dashboard: http://localhost:4040"
echo "- Test API directly: curl $FULL_API_URL/api/health"
echo "- Check browser console for any remaining old URLs"
echo ""
echo "🛑 To stop everything, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
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
