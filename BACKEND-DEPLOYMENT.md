# WordWanderer Backend Deployment Guide

## 🚀 Backend Deployment Options

Since Vercel doesn't support Express.js backends, we need to deploy the backend separately. Here are the best options:

### Option 1: Railway (Recommended) ⭐

Railway is perfect for Node.js backends and offers great free tier.

#### Steps:
1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   railway init
   railway add
   railway deploy
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/wordwanderer"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set NODE_ENV="production"
   railway variables set PORT="5000"
   ```

5. **Get Backend URL**
   ```bash
   railway status
   # Copy the URL (e.g., https://wordwanderer-backend-production.up.railway.app)
   ```

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repository
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=10000`

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create wordwanderer-api
   ```

3. **Deploy Backend Subfolder**
   ```bash
   # From project root
   git subtree push --prefix backend heroku main
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set NODE_ENV="production"
   ```

## 🔧 Update Frontend API URL

After deploying the backend, update the frontend to use the production API URL:

### 1. Create Environment Variable

In your Vercel dashboard, add:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### 2. Update API Configuration

Create or update `src/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const apiClient = {
  baseURL: `${API_BASE_URL}/api`,
  // ... rest of your API configuration
}
```

### 3. Update API Calls

Make sure all API calls use the environment variable:
```typescript
// Instead of hardcoded localhost
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(credentials),
})
```

## 🌐 CORS Configuration

Make sure your backend CORS is configured for your Vercel domain:

```javascript
// backend/server.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://wordwanderer.vercel.app'
  ],
  credentials: true,
}

app.use(cors(corsOptions))
```

## 📊 Health Check Endpoint

Your backend already has a health check endpoint at `/health`. This is useful for monitoring:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})
```

## 🔒 Environment Variables Needed

### Backend Environment Variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to "production"
- `PORT` - Port number (Railway auto-assigns, Render uses 10000)

### Frontend Environment Variables (Vercel):
- `NEXT_PUBLIC_API_URL` - Your deployed backend URL
- `NEXTAUTH_URL` - Your Vercel app URL
- `NEXTAUTH_SECRET` - NextAuth secret key

## 🚀 Deployment Checklist

### Backend Deployment:
- [ ] Choose deployment platform (Railway recommended)
- [ ] Deploy backend with environment variables
- [ ] Test health check endpoint
- [ ] Verify MongoDB connection
- [ ] Test API endpoints

### Frontend Update:
- [ ] Add NEXT_PUBLIC_API_URL to Vercel
- [ ] Update API calls to use environment variable
- [ ] Update CORS configuration in backend
- [ ] Test authentication flow
- [ ] Deploy frontend to Vercel

### Final Testing:
- [ ] Registration works end-to-end
- [ ] Login works end-to-end
- [ ] Dashboard loads with user data
- [ ] All API calls work in production

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Add your Vercel domain to CORS origins
   - Make sure credentials: true is set

2. **API URL Not Found**
   - Check NEXT_PUBLIC_API_URL environment variable
   - Verify backend is deployed and accessible

3. **MongoDB Connection Issues**
   - Verify MONGODB_URI is correct
   - Check IP whitelist in MongoDB Atlas

4. **Authentication Errors**
   - Verify JWT_SECRET matches between deployments
   - Check cookie settings for production

## 📞 Support

- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Heroku: https://devcenter.heroku.com
