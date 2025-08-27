# 🖥️ WordWanderer - Local Backend Setup Guide

## 🎯 **SETUP OVERVIEW**

Since you're running the backend on your PC, here's how to connect it to your Vercel-deployed frontend:

### **Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Your PC       │    │  MongoDB Atlas  │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Next.js App   │    │ • Express API   │    │ • User Data     │
│ • Static Files  │    │ • Port 5000     │    │ • Courses       │
│ • UI Components │    │ • Local Network │    │ • Progress      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 **BACKEND SETUP ON YOUR PC**

### **1. Environment Configuration**

Create `.env` file in the `backend` folder:
```bash
# backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wordwanderer
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
```

### **2. Update CORS for Production**

Update `backend/server.js` CORS configuration:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Local development
    'https://your-app.vercel.app',     // Your Vercel domain
    'https://wordwanderer.vercel.app'  // If using this domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
```

### **3. Start Backend Server**

```bash
cd backend
npm install
npm start
```

Your backend will run on `http://localhost:5000`

## 🌐 **EXPOSE YOUR PC TO INTERNET**

Since Vercel needs to reach your PC, you have several options:

### **Option 1: ngrok (Recommended for Testing)**

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Expose your backend**
   ```bash
   ngrok http 5000
   ```

3. **Copy the HTTPS URL**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:5000
   ```

4. **Use this URL in Vercel environment variables**

### **Option 2: Cloudflare Tunnel (Free, Permanent)**

1. **Install Cloudflare Tunnel**
   ```bash
   npm install -g cloudflared
   ```

2. **Login to Cloudflare**
   ```bash
   cloudflared tunnel login
   ```

3. **Create and run tunnel**
   ```bash
   cloudflared tunnel --url http://localhost:5000
   ```

4. **Get the public URL and use it in Vercel**

### **Option 3: Port Forwarding (Advanced)**

1. Configure your router to forward port 5000
2. Use your public IP address
3. Set up dynamic DNS if your IP changes

## 🚀 **VERCEL FRONTEND CONFIGURATION**

### **1. Environment Variables**

In your Vercel dashboard, set:
```bash
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io
# OR
NEXT_PUBLIC_API_URL=https://your-cloudflare-tunnel.trycloudflare.com
```

### **2. Update API Calls**

Make sure your frontend uses the environment variable:
```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const apiClient = {
  baseURL: `${API_BASE_URL}/api`,
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    return response.json()
  },
  
  async get(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    return response.json()
  }
}
```

## 🔒 **SECURITY CONSIDERATIONS**

### **For Production Use**

1. **Use HTTPS tunnels only** (ngrok/Cloudflare provide this)
2. **Set strong JWT secrets**
3. **Configure proper CORS origins**
4. **Use environment variables for sensitive data**
5. **Consider rate limiting**

### **Backend Security Updates**

```javascript
// backend/server.js - Add security headers
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY')
  res.header('X-Content-Type-Options', 'nosniff')
  res.header('Referrer-Policy', 'origin-when-cross-origin')
  next()
})
```

## 🧪 **TESTING SETUP**

### **1. Test Backend Locally**
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/auth/register -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","username":"test","displayName":"Test","password":"test123"}'
```

### **2. Test Through Tunnel**
```bash
curl https://your-tunnel-url.ngrok.io/health
```

### **3. Test Frontend Connection**
- Deploy to Vercel with tunnel URL
- Test registration and login flows
- Check browser console for CORS errors

## 📊 **MONITORING YOUR BACKEND**

### **Keep Backend Running**

Use PM2 to keep your backend running:
```bash
npm install -g pm2
cd backend
pm2 start server.js --name wordwanderer-backend
pm2 startup
pm2 save
```

### **Monitor Logs**
```bash
pm2 logs wordwanderer-backend
```

### **Restart if Needed**
```bash
pm2 restart wordwanderer-backend
```

## 🔄 **DEVELOPMENT WORKFLOW**

### **Daily Workflow**
1. Start your PC
2. Start backend: `cd backend && npm start`
3. Start tunnel: `ngrok http 5000`
4. Update Vercel env var if tunnel URL changed
5. Test your app

### **For Permanent Setup**
1. Use Cloudflare Tunnel for consistent URL
2. Use PM2 to auto-start backend
3. Set up your PC to auto-start on boot

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

1. **CORS Errors**
   - Add your Vercel domain to CORS origins
   - Ensure credentials: true is set

2. **Tunnel Connection Issues**
   - Restart ngrok/cloudflare tunnel
   - Update Vercel environment variable
   - Check firewall settings

3. **Backend Not Accessible**
   - Verify backend is running on port 5000
   - Check if tunnel is active
   - Test with curl commands

4. **MongoDB Connection Issues**
   - Verify MONGODB_URI in .env
   - Check MongoDB Atlas IP whitelist
   - Test connection directly

Your WordWanderer app will now work with your PC as the backend server! 🎉
