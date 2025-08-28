#!/bin/bash

# WordWanderer Backend Startup Script

echo "🚀 Starting WordWanderer Backend..."

# Set your ngrok authtoken (you already have this)
echo "🔑 Setting up ngrok authtoken..."
ngrok config add-authtoken 31t49IK617FrA7PN8oaLsGUVkVu_4cptyfBwinmRCisCMczB7

# Start the backend server in the background
echo "🖥️  Starting backend server on port 5000..."
cd backend
npm start &
BACKEND_PID=$!

# Wait a moment for the server to start
sleep 3

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok http 5000 &
NGROK_PID=$!

# Wait for ngrok to establish tunnel
echo "⏳ Waiting for ngrok tunnel to establish..."
sleep 5

# Get the ngrok URL
echo "🔍 Fetching ngrok URL..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io')

if [ -n "$NGROK_URL" ]; then
    echo ""
    echo "🎉 SUCCESS! Your ngrok URL is:"
    echo "📡 $NGROK_URL"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy this URL: $NGROK_URL"
    echo "2. Add it to your Vercel environment variables as NEXT_PUBLIC_API_URL"
    echo "3. Redeploy your Vercel app"
    echo ""
else
    echo "⚠️  Could not fetch ngrok URL automatically."
    echo "📋 Manual steps:"
    echo "1. Open http://localhost:4040 in your browser"
    echo "2. Copy the HTTPS URL from the ngrok dashboard"
    echo "3. Add it to your Vercel environment variables as NEXT_PUBLIC_API_URL"
    echo ""
fi

echo "🛑 To stop everything, press Ctrl+C"

# Keep the script running
wait
