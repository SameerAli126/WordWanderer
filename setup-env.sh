#!/bin/bash

# WordWanderer - Environment Setup Script
# Sets up your .env.local file with the correct configuration

echo "⚙️  WordWanderer - Environment Setup"
echo "===================================="

# Your static ngrok URL
STATIC_NGROK_URL="curiously-balanced-tarpon.ngrok-free.app"
FULL_API_URL="https://$STATIC_NGROK_URL"

echo "📝 Creating .env.local with your configuration..."

# Create .env.local file
cat > .env.local << EOF
# WordWanderer Environment Configuration
# Generated automatically by setup-env.sh

# API Configuration (Your Static ngrok URL)
NEXT_PUBLIC_API_URL=$FULL_API_URL

# Database Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wordwanderer

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-here

# CORS Configuration
FRONTEND_URL=https://wordwanderer.vercel.app

# Node Environment
NODE_ENV=development

# Server Port
PORT=5000

# ngrok Configuration
NGROK_STATIC_URL=$STATIC_NGROK_URL
EOF

echo "✅ .env.local created successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.local and update:"
echo "   - MONGODB_URI with your MongoDB Atlas connection string"
echo "   - JWT_SECRET with a secure random string"
echo ""
echo "2. Run the startup script:"
echo "   ./start-wordwanderer.sh"
echo ""
echo "💡 Your static ngrok URL is: $FULL_API_URL"
echo "   This URL will always be the same, so you only need to"
echo "   update Vercel environment variables once!"
