# WordWanderer - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- MongoDB Atlas database

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
# Authentication
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wordwanderer

# JWT
JWT_SECRET=your-jwt-secret-key

# Node Environment
NODE_ENV=production
```

### 2. Deploy Steps

1. **Connect Repository**
   ```bash
   # Push to your GitHub repository
   git push origin production
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `production` branch

3. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all the variables listed above

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### 3. Backend Deployment (Separate)

The backend needs to be deployed separately. Recommended options:

#### Option A: Railway
```bash
# In backend directory
railway login
railway init
railway add
railway deploy
```

#### Option B: Render
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`

#### Option C: Heroku
```bash
# In backend directory
heroku create wordwanderer-api
git subtree push --prefix backend heroku main
```

### 4. Update Frontend API URLs

After backend deployment, update the API base URL in your frontend:

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'
  : 'http://localhost:5000/api'
```

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 6. Monitoring & Analytics

- Enable Vercel Analytics in Project Settings
- Set up error monitoring with Sentry (optional)
- Configure performance monitoring

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "name": "wordwanderer",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### .vercelignore
- Excludes backend, temp files, and development artifacts
- Keeps deployment lean and fast

## 🌍 Environment-Specific Configs

### Production
- Optimized builds
- CDN distribution
- Automatic HTTPS
- Edge functions

### Development
- Hot reloading
- Source maps
- Development tools

## 📊 Performance Optimization

1. **Image Optimization**: Automatic with Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **CDN**: Global edge network
4. **Caching**: Automatic static file caching

## 🔒 Security Features

- Automatic HTTPS
- DDoS protection
- Environment variable encryption
- Secure headers

## 📈 Scaling

- Automatic scaling based on traffic
- Edge functions for global performance
- Serverless architecture

## 🐛 Troubleshooting

### Build Errors
- Check environment variables
- Verify MongoDB connection
- Review build logs

### Runtime Errors
- Check function logs
- Verify API endpoints
- Test database connectivity

### Performance Issues
- Enable analytics
- Check bundle size
- Optimize images and assets

## 📞 Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
