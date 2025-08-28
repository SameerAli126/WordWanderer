#!/bin/bash

# WordWanderer - Clean Multi-Terminal Startup Script
# This script starts processes in separate terminals for better readability

echo "🚀 WordWanderer - Clean Multi-Terminal Startup"
echo "=============================================="

# Your static ngrok URL
STATIC_NGROK_URL="curiously-balanced-tarpon.ngrok-free.app"
FULL_API_URL="https://$STATIC_NGROK_URL"

echo "📡 Using your static ngrok URL: $FULL_API_URL"

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Make sure you're in the WordWanderer root directory."
    exit 1
fi

# Step 1: Clean up any existing processes
echo "🛑 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "ngrok" 2>/dev/null || true
sleep 2

# Step 2: Start backend in a new terminal
echo "🔧 Starting backend server in new terminal..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="WordWanderer Backend" -- bash -c "cd backend && echo '🔧 Starting WordWanderer Backend Server...' && npm run dev; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -title "WordWanderer Backend" -e "cd backend && echo '🔧 Starting WordWanderer Backend Server...' && npm run dev; bash" &
else
    echo "⚠️  No terminal emulator found. Starting backend in background..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
fi

echo "⏳ Waiting for backend to start..."
sleep 5

# Step 3: Start ngrok in a new terminal
echo "🌐 Starting ngrok in new terminal..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="WordWanderer ngrok" -- bash -c "echo '🌐 Starting ngrok tunnel...' && echo 'Static URL: $FULL_API_URL' && ngrok http --url=$STATIC_NGROK_URL 5000; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -title "WordWanderer ngrok" -e "echo '🌐 Starting ngrok tunnel...' && echo 'Static URL: $FULL_API_URL' && ngrok http --url=$STATIC_NGROK_URL 5000; bash" &
else
    echo "⚠️  No terminal emulator found. Starting ngrok in background..."
    ngrok http --url=$STATIC_NGROK_URL 5000 &
    NGROK_PID=$!
fi

echo "⏳ Waiting for ngrok tunnel to establish..."
sleep 8

# Step 4: Test connection
echo "🔍 Testing backend connection..."
for i in {1..5}; do
    if curl -s --max-time 5 "$FULL_API_URL/api/health" > /dev/null; then
        echo "✅ Backend is responding!"
        break
    else
        echo "⏳ Attempt $i/5 - Backend still starting..."
        sleep 3
    fi
done

# Step 5: Vercel CLI operations in main terminal (clean output)
echo ""
echo "🤖 Vercel Environment Update"
echo "============================"

# Check if user wants to update Vercel
read -p "Do you want to update Vercel environment variables? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Updating Vercel environment variables..."
    
    # Install Vercel CLI if needed (in main terminal)
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
    echo "🔄 Setting NEXT_PUBLIC_API_URL to: $FULL_API_URL"
    
    # Remove old values
    echo "🗑️  Removing old environment variables..."
    $VERCEL_CMD env rm NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
    $VERCEL_CMD env rm NEXT_PUBLIC_API_URL preview --yes 2>/dev/null || true
    
    # Add new values
    echo "➕ Adding new environment variables..."
    if echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL production; then
        echo "✅ Production environment updated!"
    else
        echo "❌ Production update failed"
    fi
    
    if echo "$FULL_API_URL" | $VERCEL_CMD env add NEXT_PUBLIC_API_URL preview; then
        echo "✅ Preview environment updated!"
    else
        echo "❌ Preview update failed"
    fi
    
    echo ""
    read -p "🚀 Do you want to trigger a new Vercel deployment? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Triggering new Vercel deployment..."
        if $VERCEL_CMD --prod; then
            echo "✅ Deployment triggered successfully!"
        else
            echo "❌ Deployment trigger failed"
        fi
    fi
else
    echo "⏭️  Skipping Vercel update."
fi

echo ""
echo "🎉 WordWanderer Setup Complete!"
echo "==============================="
echo "📡 Backend API: $FULL_API_URL"
echo "🌐 Frontend: https://wordwanderer.vercel.app"
echo "📊 ngrok Dashboard: http://localhost:4040"
echo ""
echo "📋 What's Running:"
echo "• Backend server (separate terminal)"
echo "• ngrok tunnel (separate terminal)"
echo "• This control terminal"
echo ""
echo "📋 Next Steps:"
echo "1. Wait for Vercel deployment to complete (if triggered)"
echo "2. Go to https://wordwanderer.vercel.app"
echo "3. Try logging in - should work now!"
echo ""
echo "🔍 Debugging:"
echo "• Backend logs: Check 'WordWanderer Backend' terminal"
echo "• ngrok status: Check 'WordWanderer ngrok' terminal"
echo "• API test: curl $FULL_API_URL/api/health"
echo ""
echo "🛑 To stop everything:"
echo "• Close the backend terminal"
echo "• Close the ngrok terminal"
echo "• Or run: pkill -f 'node.*server.js' && pkill -f 'ngrok'"
echo ""
echo "✨ Happy coding! Your WordWanderer is ready to use!"
