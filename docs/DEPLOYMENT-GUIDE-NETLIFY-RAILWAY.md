# 🚀 Complete Deployment Guide: Netlify + Railway

## 📋 **OVERVIEW**

This guide shows you how to deploy a full-stack MERN application with:
- **Frontend (React):** Deployed to Netlify
- **Backend (Node.js/Express):** Deployed to Railway
- **Database:** MongoDB Atlas
- **Auto-deployment:** Git-based CI/CD

---

## 🏗️ **ARCHITECTURE**

```
User's Browser
      ↓
Netlify (React Frontend)
      ↓ (API calls)
Railway (Node.js Backend)
      ↓ (Database queries)
MongoDB Atlas (Database)
```

---

## 📁 **PROJECT STRUCTURE REQUIREMENTS**

Your project should be structured like this:
```
your-project/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/         # Generated after build
├── backend/           # Node.js/Express API
│   ├── src/
│   ├── package.json
│   └── server.js
├── README.md
└── package.json       # Root package.json (optional)
```

---

## 🔧 **STEP 1: PREPARE YOUR CODE**

### **Frontend Requirements:**
1. **Environment Variables:** Use `REACT_APP_` prefix
   ```javascript
   // In your React code
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
   ```

2. **Build Script:** Ensure package.json has build script
   ```json
   {
     "scripts": {
       "build": "react-scripts build",
       "start": "react-scripts start"
     }
   }
   ```

### **Backend Requirements:**
1. **Port Configuration:** Use environment variable
   ```javascript
   const PORT = process.env.PORT || 5001;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. **CORS Configuration:** Allow frontend domain
   ```javascript
   const cors = require('cors');
   
   const allowedOrigins = [
     'http://localhost:3000',
     process.env.FRONTEND_URL
   ].filter(Boolean);

   app.use(cors({
     origin: function (origin, callback) {
       if (!origin) return callback(null, true);
       if (allowedOrigins.indexOf(origin) !== -1) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
   }));
   ```

---

## 🗄️ **STEP 2: SET UP MONGODB ATLAS**

1. **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster:** Choose free tier (M0)
3. **Create Database User:**
   - Username: `your-username`
   - Password: `your-secure-password`
4. **Whitelist IP:** Add `0.0.0.0/0` (allow all IPs)
5. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
   ```

---

## 🚂 **STEP 3: DEPLOY BACKEND TO RAILWAY**

### **3.1 Create Railway Account:**
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub

### **3.2 Deploy from GitHub:**
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. **Important:** Set **Root Directory** to `backend`

### **3.3 Configure Environment Variables:**
In Railway Dashboard → Your Project → Variables, add:
```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### **3.4 Get Railway URL:**
After deployment, Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

---

## 🌐 **STEP 4: DEPLOY FRONTEND TO NETLIFY**

### **4.1 Create Netlify Account:**
1. Go to [Netlify](https://www.netlify.com)
2. Sign up with GitHub

### **4.2 Deploy from GitHub:**
1. Click **"New site from Git"**
2. Choose **GitHub**
3. Select your repository
4. Configure build settings:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```

### **4.3 Configure Environment Variables:**
In Netlify Dashboard → Site Settings → Environment Variables, add:
```
REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
```

### **4.4 Get Netlify URL:**
Netlify will provide a URL like:
```
https://your-app-name.netlify.app
```

---

## 🔄 **STEP 5: UPDATE CORS CONFIGURATION**

Update your Railway environment variables with the actual Netlify URL:
```
FRONTEND_URL=https://your-actual-netlify-url.netlify.app
```

---

## ✅ **STEP 6: VERIFY DEPLOYMENT**

### **Test Backend:**
Visit: `https://your-railway-app.up.railway.app`
Expected response:
```json
{"message":"Your API","version":"1.0.0","status":"running"}
```

### **Test Frontend:**
1. Visit your Netlify URL
2. Open browser console (F12)
3. Try to login/register
4. Check for CORS errors

---

## 🐛 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: "Network Error" on Frontend**
**Cause:** Frontend can't reach backend
**Solution:**
- ✅ Check `REACT_APP_API_URL` in Netlify
- ✅ Ensure Railway backend is running
- ✅ URL includes `/api` at the end

### **Issue 2: "CORS Error"**
**Cause:** Backend blocking frontend domain
**Solution:**
- ✅ Set `FRONTEND_URL` in Railway to exact Netlify URL
- ✅ Redeploy Railway after changing environment variables

### **Issue 3: "Build Failed" on Netlify**
**Cause:** Build configuration issues
**Solution:**
- ✅ Check base directory is set to `frontend`
- ✅ Ensure build command is `npm run build`
- ✅ Verify publish directory is `frontend/build`

### **Issue 4: "Database Connection Failed"**
**Cause:** MongoDB Atlas configuration
**Solution:**
- ✅ Check `MONGODB_URI` in Railway
- ✅ Verify IP whitelist includes `0.0.0.0/0`
- ✅ Test connection string locally first

---

## 🔄 **AUTO-DEPLOYMENT WORKFLOW**

### **How It Works:**
1. **Push to GitHub** → Triggers automatic deployments
2. **Railway** watches your repository and redeploys backend
3. **Netlify** watches your repository and rebuilds frontend

### **Deployment Branches:**
- **`production`** → Deploys to live sites
- **`development`** → Can be used for staging environments

### **Deployment Process:**
```bash
# Make changes
git add .
git commit -m "feat: add new feature"

# Deploy to production
git checkout production
git merge development
git push origin production

# Both Railway and Netlify auto-deploy! 🚀
```

---

## 📊 **MONITORING & MAINTENANCE**

### **Railway Monitoring:**
- **Logs:** Railway Dashboard → Logs
- **Metrics:** CPU, Memory, Network usage
- **Deployments:** Track deployment history

### **Netlify Monitoring:**
- **Build Logs:** Netlify Dashboard → Deploys
- **Analytics:** Traffic and performance
- **Forms:** Handle form submissions

### **MongoDB Atlas Monitoring:**
- **Performance:** Database metrics
- **Alerts:** Set up monitoring alerts
- **Backup:** Automatic backups enabled

---

## 🎯 **PRODUCTION CHECKLIST**

### **Before Going Live:**
- [ ] Environment variables set in both platforms
- [ ] CORS configured correctly
- [ ] Database connection working
- [ ] SSL certificates active (automatic)
- [ ] Custom domain configured (optional)
- [ ] Error monitoring set up
- [ ] Backup strategy in place

### **Security Best Practices:**
- [ ] Use strong JWT secrets
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Use HTTPS only
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities

---

## 💰 **COST BREAKDOWN**

### **Free Tier Limits:**
- **Railway:** 500 hours/month, 1GB RAM
- **Netlify:** 100GB bandwidth, 300 build minutes
- **MongoDB Atlas:** 512MB storage, M0 cluster

### **When to Upgrade:**
- **Railway:** When you need more resources or uptime
- **Netlify:** When you exceed bandwidth or need advanced features
- **MongoDB:** When you need more storage or performance

---

## 🚀 **NEXT STEPS**

1. **Custom Domains:** Add your own domain to both services
2. **SSL Certificates:** Automatic with both platforms
3. **Environment Separation:** Set up staging environments
4. **Monitoring:** Add error tracking (Sentry, LogRocket)
5. **Performance:** Optimize build times and bundle sizes

---

**🎉 Congratulations! Your full-stack application is now live and production-ready!**

**Remember:** Always test in staging before deploying to production, and keep your environment variables secure!
