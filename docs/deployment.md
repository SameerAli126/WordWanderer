# Deployment Guide

This guide covers deploying WordWanderer to production using Vercel for the frontend and ngrok for the backend.

## 🚀 Production Deployment Overview

WordWanderer uses a hybrid deployment approach:
- **Frontend**: Deployed on Vercel (static hosting with serverless functions)
- **Backend**: Local/server deployment with ngrok tunneling for public access
- **Database**: MongoDB Atlas (cloud-hosted)

## 📋 Prerequisites

Before deploying, ensure you have:
- [Vercel account](https://vercel.com/) (free tier available)
- [ngrok account](https://ngrok.com/) (free tier available)
- [MongoDB Atlas account](https://www.mongodb.com/atlas) (free tier available)
- GitHub repository with your code

## 🌐 Frontend Deployment (Vercel)

### 1. Connect GitHub Repository

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com/)
2. **Import Project**: Click "New Project" → "Import Git Repository"
3. **Select Repository**: Choose your WordWanderer repository
4. **Configure Project**: 
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)

### 2. Environment Variables

In your Vercel project settings, add these environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io

# Optional: Analytics and monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

**Important**: You'll need to update `NEXT_PUBLIC_API_URL` with your ngrok URL after setting up the backend.

### 3. Deploy

1. **Automatic Deployment**: Vercel automatically deploys when you push to your main branch
2. **Manual Deployment**: Click "Deploy" in the Vercel dashboard
3. **Preview Deployments**: Every pull request gets a preview deployment

### 4. Custom Domain (Optional)

1. **Add Domain**: Go to Project Settings → Domains
2. **Configure DNS**: Point your domain to Vercel's nameservers
3. **SSL Certificate**: Automatically provisioned by Vercel

## 🔧 Backend Deployment (ngrok)

### 1. Production Server Setup

#### Option A: Local Development Server
```bash
# Clone repository on your server/local machine
git clone https://github.com/SameerAli126/WordWanderer.git
cd WordWanderer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with production values
```

#### Option B: Cloud Server (DigitalOcean, AWS, etc.)
```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup project (same as Option A)
```

### 2. Environment Configuration

Create `.env.local` with production values:

```env
# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wordwanderer

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secure-jwt-secret-for-production

# CORS Origins
FRONTEND_URL=https://your-vercel-app.vercel.app

# Node Environment
NODE_ENV=production

# Port
PORT=5000
```

### 3. ngrok Setup

1. **Install ngrok**:
   ```bash
   # Download and install ngrok
   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
   sudo apt update && sudo apt install ngrok
   ```

2. **Authenticate ngrok**:
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```
   Get your authtoken from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)

3. **Start Backend with ngrok**:
   ```bash
   # Make script executable
   chmod +x start-backend.sh
   
   # Start backend and ngrok
   ./start-backend.sh
   ```

4. **Get ngrok URL**:
   - Copy the HTTPS URL from terminal output
   - Or visit http://localhost:4040 for the ngrok dashboard

### 4. Update Frontend Environment

1. **Copy ngrok URL**: e.g., `https://abc123.ngrok.io`
2. **Update Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to your ngrok URL
3. **Redeploy Frontend**: Trigger a new deployment in Vercel

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. **Sign up**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0 Sandbox)
3. **Configure Cluster**:
   - Cloud Provider: AWS/Google Cloud/Azure
   - Region: Choose closest to your users
   - Cluster Name: `wordwanderer-prod`

### 2. Database Security

1. **Create Database User**:
   - Username: `wordwanderer-user`
   - Password: Generate strong password
   - Roles: `readWrite` on `wordwanderer` database

2. **Network Access**:
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - **Note**: In production, restrict to specific IPs

### 3. Get Connection String

1. **Connect**: Click "Connect" on your cluster
2. **Choose Method**: "Connect your application"
3. **Copy Connection String**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/wordwanderer
   ```
4. **Update Environment**: Add to your `.env.local`

## 🔄 Deployment Workflow

### Development to Production

1. **Development Branch**:
   ```bash
   git checkout development
   git add .
   git commit -m "Add new feature"
   git push origin development
   ```

2. **Merge to Production**:
   ```bash
   git checkout production
   git merge development
   git push origin production
   ```

3. **Automatic Deployment**: Vercel automatically deploys production branch

### Backend Updates

1. **Update Backend Code**:
   ```bash
   git pull origin production
   npm install  # If dependencies changed
   ```

2. **Restart Backend**:
   ```bash
   # Stop current backend (Ctrl+C)
   ./start-backend.sh
   ```

3. **Update Frontend** (if API changes):
   - Update environment variables if needed
   - Trigger Vercel redeploy

## 🔒 Production Security

### Environment Variables Security

- **Never commit** `.env` files to git
- **Use strong secrets** for JWT_SECRET
- **Rotate secrets** regularly
- **Restrict database access** to specific IPs in production

### CORS Configuration

The backend is configured to allow requests from:
- `https://your-vercel-app.vercel.app`
- `https://your-custom-domain.com`
- Development URLs for testing

### HTTPS Enforcement

- **Vercel**: Automatically provides HTTPS
- **ngrok**: Provides HTTPS tunnel
- **MongoDB Atlas**: Uses encrypted connections

## 📊 Monitoring and Maintenance

### Vercel Analytics

1. **Enable Analytics**: In Vercel dashboard
2. **Monitor Performance**: Page load times, Core Web Vitals
3. **Track Deployments**: Success/failure rates

### Backend Monitoring

1. **ngrok Dashboard**: http://localhost:4040
2. **Server Logs**: Monitor console output
3. **Database Monitoring**: MongoDB Atlas provides built-in monitoring

### Health Checks

Test your deployment:

```bash
# Test frontend
curl https://your-vercel-app.vercel.app

# Test backend
curl https://your-ngrok-url.ngrok.io/api/health

# Test database connection
curl https://your-ngrok-url.ngrok.io/api/auth/health
```

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript types are correct

2. **API Connection Issues**:
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS configuration
   - Ensure ngrok tunnel is active

3. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has correct permissions

### Rollback Strategy

1. **Frontend Rollback**:
   - Go to Vercel dashboard → Deployments
   - Click "Promote to Production" on previous deployment

2. **Backend Rollback**:
   ```bash
   git checkout production
   git reset --hard HEAD~1  # Go back one commit
   ./start-backend.sh
   ```

## 🔄 Continuous Deployment

### Automated Deployment Pipeline

1. **GitHub Actions** (optional):
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [production]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
   ```

2. **Vercel Integration**:
   - Automatic deployments on git push
   - Preview deployments for pull requests
   - Environment-specific deployments

### Best Practices

- **Test locally** before deploying
- **Use staging environment** for testing
- **Monitor deployments** for issues
- **Keep dependencies updated**
- **Regular backups** of database
- **Document deployment process**

Your WordWanderer application is now ready for production! 🚀
