# 🚀 WordWanderer Netlify Deployment Guide

## ✅ **DEPLOYMENT CONFIGURATION**

### **Repository Setup**
```
Repository: https://github.com/SameerAli126/WordWanderer.git
Branch to deploy: production
Base directory: (leave empty - root directory)
Build command: npm run build
Publish directory: .next
```

### **Environment Variables for Netlify**
Add these in Netlify Dashboard → Site Settings → Environment Variables:

**REQUIRED:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=production
```

**OPTIONAL (for build optimization):**
```
NODE_VERSION=18
NPM_FLAGS=--production=false
```

---

## 🏗️ **PROJECT STRUCTURE**

WordWanderer is a Next.js frontend with a separate Express.js backend:

```
WordWanderer/
├── src/                    # Next.js frontend (deploy to Netlify)
├── backend/               # Express.js backend (run locally)
├── netlify.toml          # Netlify configuration
├── package.json          # Frontend dependencies
└── docs/                 # Deployment documentation
```

---

## 🔧 **NETLIFY CONFIGURATION**

### **netlify.toml Settings**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **package.json Scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:netlify": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🖥️ **LOCAL BACKEND SETUP**

Since you're using a local backend, you'll need to:

### **Step 1: Keep Backend Running Locally**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

### **Step 2: Configure CORS for Netlify**
Update `backend/server.js` to allow your Netlify domain:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-wordwanderer-app.netlify.app'  // Add your Netlify URL
  ],
  credentials: true
}
```

### **Step 3: Environment Variables**
In Netlify, set:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note:** This will only work when your local backend is running.

---

## 📋 **DEPLOYMENT CHECKLIST**

### **✅ Pre-Deployment**
- [ ] All features tested locally
- [ ] Backend running on localhost:5000
- [ ] Frontend builds successfully (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Environment variables configured

### **✅ Repository Setup**
- [ ] Code committed to production branch
- [ ] netlify.toml file present
- [ ] .env.example file present
- [ ] Documentation updated

### **✅ Netlify Configuration**
- [ ] Correct repository connected
- [ ] Production branch selected
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Environment variables added

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Prepare Repository**
```bash
# Ensure you're on development branch
git checkout development

# Commit all changes
git add .
git commit -m "🚀 feat: Complete Chinese language learning platform

Features:
- Vibrant animated theme with gradient backgrounds
- Chinese course with 14 lessons across 4 units
- Duolingo-style learning roadmap
- Interactive Chinese lessons with characters and pinyin
- XP system, progress tracking, and gamification
- Language carousel with 8 languages
- Professional UI with Framer Motion animations
- MongoDB integration with Chinese course data
- Comprehensive lesson types: multiple choice, translation, fill-in-blank
- Cultural context and character explanations"

# Merge to production
git checkout production
git merge development
git push origin production
```

### **Step 2: Deploy on Netlify**
1. **Connect Repository**: Link your GitHub repo
2. **Select Branch**: Choose `production`
3. **Configure Build**: Use settings above
4. **Add Environment Variables**: Set API URL
5. **Deploy**: Click "Deploy site"

### **Step 3: Update CORS**
After getting your Netlify URL, update backend CORS:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://wordwanderer-app.netlify.app'  // Your actual Netlify URL
  ],
  credentials: true
}
```

---

## 🔍 **TESTING DEPLOYMENT**

### **Frontend Testing**
- [ ] Site loads at Netlify URL
- [ ] All pages accessible
- [ ] Language carousel works
- [ ] Chinese course roadmap displays
- [ ] Demo lessons load

### **Backend Integration Testing**
- [ ] API calls work (with local backend running)
- [ ] User registration/login functions
- [ ] Course data loads from MongoDB
- [ ] Chinese lessons display correctly
- [ ] XP tracking works

---

## 🌐 **PRODUCTION WORKFLOW**

### **Development Process**
```bash
# Work on development branch
git checkout development
# Make changes, test locally

# Deploy to production
git checkout production
git merge development
git push origin production
# Automatic Netlify deployment triggers
```

### **Local Backend Requirement**
- Keep `npm run dev` running in backend folder
- Backend serves API on localhost:5000
- Frontend on Netlify calls local backend
- Ensure CORS allows Netlify domain

---

## 🎯 **WORDWANDERER FEATURES**

### **What's Deployed**
- ✅ **Vibrant Theme**: Animated gradient backgrounds
- ✅ **Chinese Course**: 14 lessons with characters and pinyin
- ✅ **Learning Roadmap**: Duolingo-style progression
- ✅ **Language Carousel**: 8 languages with interactive selection
- ✅ **Gamification**: XP system, streaks, achievements
- ✅ **Interactive Lessons**: Multiple question types
- ✅ **Progress Tracking**: Visual progress and completion states
- ✅ **Cultural Context**: Character explanations and meanings

### **Course Structure**
1. **Basic Greetings** (3 lessons) - 你好, 谢谢, 再见
2. **Numbers & Time** (4 lessons) - Counting and time expressions
3. **Family & People** (3 lessons) - Family members and relationships
4. **Food & Dining** (4 lessons) - Food vocabulary and restaurant conversations

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

#### **1. Build Fails**
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting issues
npm run lint
```

#### **2. API Calls Fail**
- Ensure local backend is running
- Check CORS configuration
- Verify environment variable: `NEXT_PUBLIC_API_URL`

#### **3. Routing Issues**
- Netlify redirects configured in netlify.toml
- Next.js handles client-side routing

#### **4. Environment Variables Not Loading**
- Ensure variables start with `NEXT_PUBLIC_`
- Restart Netlify build after adding variables

---

## 📊 **POST-DEPLOYMENT VERIFICATION**

### **✅ Frontend Checklist**
- [ ] Homepage loads with animated background
- [ ] Language carousel displays all 8 languages
- [ ] Chinese course roadmap shows 4 units
- [ ] Demo lessons work with Chinese content
- [ ] Navigation between pages functions
- [ ] Responsive design works on mobile

### **✅ Full Stack Testing**
- [ ] User registration/login works
- [ ] Chinese course data loads from MongoDB
- [ ] Lesson progression and XP tracking
- [ ] Progress saving and retrieval
- [ ] All interactive elements function

---

## 🎉 **SUCCESS!**

Your WordWanderer platform is now:
- ✅ **Deployed on Netlify** from production branch
- ✅ **Connected to local backend** for development
- ✅ **Fully functional** with Chinese language course
- ✅ **Production ready** with proper configuration
- ✅ **Automatically updating** on production branch pushes

**🌐 Your live application URL**: `https://your-wordwanderer-app.netlify.app`

---

**🎯 You've successfully deployed a professional language learning platform with a vibrant, engaging user experience!**
