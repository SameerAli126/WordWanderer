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

echo "✅ Backend and ngrok started!"
echo ""
echo "📋 Next steps:"
echo "1. Check the ngrok URL in the terminal output above"
echo "2. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)"
echo "3. Add it to your Vercel environment variables as NEXT_PUBLIC_API_URL"
echo "4. Redeploy your Vercel app"
echo ""
echo "🛑 To stop everything, press Ctrl+C"

# Keep the script running
wait
