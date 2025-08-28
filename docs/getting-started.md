# Getting Started with WordWanderer

This guide will help you set up WordWanderer for local development in just a few minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (free) - [Sign up here](https://www.mongodb.com/atlas)
- **ngrok Account** (free) - [Sign up here](https://ngrok.com/)

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SameerAli126/WordWanderer.git
cd WordWanderer
```

### 2. Install Dependencies

```bash
npm install
```

This will install all frontend and backend dependencies.

### 3. Environment Configuration

Create your environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/wordwanderer

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Next.js API URL (will be set to ngrok URL later)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. MongoDB Setup

1. **Create MongoDB Atlas Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a Cluster**: Choose the free tier
3. **Create Database User**: Add a username and password
4. **Whitelist IP**: Add `0.0.0.0/0` for development (restrict in production)
5. **Get Connection String**: Copy the connection string and update `MONGODB_URI`

### 5. ngrok Setup

1. **Install ngrok**: 
   ```bash
   # macOS
   brew install ngrok
   
   # Windows (using Chocolatey)
   choco install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Authenticate ngrok**:
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```
   Get your authtoken from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)

### 6. Start Development Servers

#### Option A: Start Everything at Once

```bash
# Start backend with ngrok tunnel
./start-backend.sh
```

This script will:
- Start the Express.js backend on port 5000
- Create an ngrok tunnel
- Display the ngrok URL for you to copy

#### Option B: Start Separately

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start ngrok
ngrok http 5000

# Terminal 3: Start frontend
npm run dev
```

### 7. Update Frontend API URL

1. **Copy the ngrok URL** from the terminal (e.g., `https://abc123.ngrok.io`)
2. **Update your `.env.local`**:
   ```env
   NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
   ```
3. **Restart the frontend** (Ctrl+C and `npm run dev`)

### 8. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ngrok Dashboard**: http://localhost:4040
- **Public Backend**: https://your-ngrok-url.ngrok.io

## 🧪 Verify Setup

### Test Frontend
1. Open http://localhost:3000
2. You should see the WordWanderer landing page
3. Try navigating to different pages

### Test Backend
1. Open http://localhost:5000 in your browser
2. You should see: `{"message": "WordWanderer API is running!"}`
3. Test API endpoint: http://localhost:5000/api/health

### Test Integration
1. Go to the login page: http://localhost:3000/login
2. Try creating an account
3. Check browser console for any errors

## 🔧 Development Workflow

### Git Branches
- `production`: Stable, production-ready code
- `development`: Latest development changes
- `feature/*`: Feature branches

### Making Changes
```bash
# Switch to development branch
git checkout development

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes...

# Commit changes
git add .
git commit -m "Add your feature"

# Push to your branch
git push origin feature/your-feature-name
```

### Testing Changes
```bash
# Run build to check for errors
npm run build

# Run linting
npm run lint

# Start development server
npm run dev
```

## 🚨 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

### MongoDB Connection Issues
- Check your connection string format
- Ensure IP whitelist includes your IP
- Verify username/password are correct

### ngrok Issues
- Ensure you're authenticated: `ngrok config add-authtoken YOUR_TOKEN`
- Check if port 5000 is available
- Try restarting ngrok

### CORS Errors
- Ensure `NEXT_PUBLIC_API_URL` matches your ngrok URL
- Restart frontend after changing environment variables
- Check backend logs for CORS-related messages

## 📚 Next Steps

Once you have everything running:

1. **Explore the Code**: Check out the [Architecture Guide](./architecture.md)
2. **Learn the Components**: Read the [Frontend Guide](./frontend.md)
3. **Understand the API**: Review the [Backend Guide](./backend.md)
4. **Deploy Your Changes**: Follow the [Deployment Guide](./deployment.md)

## 🆘 Need Help?

- Check the [Troubleshooting Guide](./troubleshooting.md)
- Look at existing [GitHub Issues](https://github.com/SameerAli126/WordWanderer/issues)
- Create a new issue with your setup details

Happy coding! 🎉
