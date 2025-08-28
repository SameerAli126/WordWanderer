# WordWanderer - Quick Start Guide

## 🚀 One-Click Setup & Launch

### Step 1: Setup Environment (One Time Only)
```bash
./setup-env.sh
```
This creates your `.env.local` file with the correct static ngrok URL.

### Step 2: Edit Your Database Connection (One Time Only)
Edit `.env.local` and update:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure random string

### Step 3: Start Everything (Every Time)
```bash
./start-wordwanderer.sh
```
This single command:
- ✅ Starts your backend server
- ✅ Starts ngrok with your static URL
- ✅ Optionally updates Vercel environment variables
- ✅ Triggers new Vercel deployment

## 🎯 Your Static URLs

- **Backend API**: `https://curiously-balanced-tarpon.ngrok-free.app`
- **Frontend**: `https://wordwanderer.vercel.app`
- **ngrok Dashboard**: `http://localhost:4040`

## 💡 Key Benefits

1. **Static ngrok URL**: Your API URL never changes!
2. **One-Click Startup**: Single script does everything
3. **No Sudo Required**: Installs Vercel CLI locally if needed
4. **Automatic Updates**: Optionally updates Vercel environment
5. **Clean Shutdown**: Ctrl+C stops everything properly

## 🔧 Troubleshooting

### If ngrok fails:
```bash
# Make sure you're authenticated
ngrok config add-authtoken YOUR_TOKEN
```

### If Vercel update fails:
- You can update manually in Vercel dashboard
- Set `NEXT_PUBLIC_API_URL` to `https://curiously-balanced-tarpon.ngrok-free.app`

### If backend fails to start:
- Check your MongoDB connection string in `.env.local`
- Make sure port 5000 is available

## 📋 Complete Workflow

1. **First Time Setup**:
   ```bash
   ./setup-env.sh
   # Edit .env.local with your MongoDB URI
   ./start-wordwanderer.sh
   # Choose 'y' to update Vercel
   ```

2. **Every Other Time**:
   ```bash
   ./start-wordwanderer.sh
   # Choose 'n' for Vercel (already set up)
   ```

3. **Test Your App**:
   - Go to https://wordwanderer.vercel.app
   - Try logging in - should work perfectly!

That's it! Your WordWanderer is now running with a permanent API URL! 🎉
