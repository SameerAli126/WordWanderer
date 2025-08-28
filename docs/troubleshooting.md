# Troubleshooting Guide

This guide covers common issues you might encounter while developing or deploying WordWanderer, along with their solutions.

## 🚨 Common Development Issues

### Build Errors

#### TypeScript Compilation Errors
```bash
Error: Type 'string' is not assignable to type 'number'
```

**Solutions:**
1. **Check type definitions** in `src/types/index.ts`
2. **Verify component props** match expected types
3. **Run type check**: `npx tsc --noEmit`
4. **Update imports** to use correct types

#### Missing Dependencies
```bash
Error: Cannot resolve module '@radix-ui/react-dialog'
```

**Solutions:**
1. **Install missing dependency**: `npm install @radix-ui/react-dialog`
2. **Check package.json** for correct versions
3. **Clear node_modules**: `rm -rf node_modules && npm install`
4. **Update package-lock.json**: `npm update`

#### Build Optimization Errors
```bash
Error: Failed to compile with critters
```

**Solutions:**
1. **Disable CSS optimization** in `next.config.js`:
   ```javascript
   experimental: {
     // Remove optimizeCss: true
   }
   ```
2. **Check for CSS conflicts** in components
3. **Verify Tailwind configuration**

### Runtime Errors

#### API Connection Issues
```bash
Error: Network Error / Failed to fetch
```

**Solutions:**
1. **Check API URL** in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io
   ```
2. **Verify backend is running**: Visit http://localhost:5000
3. **Check ngrok tunnel**: Visit http://localhost:4040
4. **Restart development servers**

#### CORS Errors
```bash
Error: Access to fetch blocked by CORS policy
```

**Solutions:**
1. **Check backend CORS configuration** in `backend/server.js`
2. **Verify allowed origins** include your frontend URL
3. **Restart backend** after CORS changes
4. **Check browser console** for specific CORS error details

#### Authentication Issues
```bash
Error: 401 Unauthorized / JWT token invalid
```

**Solutions:**
1. **Check JWT_SECRET** in backend environment
2. **Verify token storage** in frontend
3. **Clear browser storage**: localStorage, sessionStorage
4. **Check token expiration** logic

## 🔧 Backend Issues

### Database Connection Problems

#### MongoDB Connection Failed
```bash
Error: MongoNetworkError: failed to connect to server
```

**Solutions:**
1. **Check connection string** format:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```
2. **Verify credentials** (username/password)
3. **Check network access** in MongoDB Atlas
4. **Whitelist IP address**: Add `0.0.0.0/0` for development

#### Database Authentication Failed
```bash
Error: Authentication failed
```

**Solutions:**
1. **Verify database user** exists in MongoDB Atlas
2. **Check user permissions** (readWrite access)
3. **Ensure correct database name** in connection string
4. **Try connecting with MongoDB Compass**

### Server Issues

#### Port Already in Use
```bash
Error: EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. **Kill process on port**:
   ```bash
   npx kill-port 5000
   # Or find and kill manually
   lsof -ti:5000 | xargs kill -9
   ```
2. **Use different port** in environment variables
3. **Check for other applications** using the port

#### ngrok Issues
```bash
Error: ngrok not found / tunnel failed
```

**Solutions:**
1. **Install ngrok**:
   ```bash
   # macOS
   brew install ngrok
   # Windows
   choco install ngrok
   ```
2. **Authenticate ngrok**:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN
   ```
3. **Check ngrok status**: Visit http://localhost:4040
4. **Restart ngrok tunnel**

## 🖥️ Frontend Issues

### Next.js Issues

#### Hydration Mismatch
```bash
Error: Hydration failed because the initial UI does not match
```

**Solutions:**
1. **Check for client-only code** in server components
2. **Use dynamic imports** for client-only components:
   ```typescript
   const ClientComponent = dynamic(() => import('./ClientComponent'), {
     ssr: false
   })
   ```
3. **Verify localStorage usage** is client-side only
4. **Check for date/time formatting** differences

#### Static Generation Issues
```bash
Error: getStaticProps / getServerSideProps not working
```

**Solutions:**
1. **Use App Router** patterns instead of Pages Router
2. **Check file naming** conventions in `app/` directory
3. **Verify export syntax** for page components
4. **Use proper data fetching** methods

### Component Issues

#### shadcn/ui Component Errors
```bash
Error: Button does not accept prop 'fullWidth'
```

**Solutions:**
1. **Check component API** in shadcn/ui documentation
2. **Use correct props**:
   ```typescript
   // Wrong
   <Button fullWidth>Click me</Button>
   
   // Correct
   <Button className="w-full">Click me</Button>
   ```
3. **Update component imports** to use correct paths
4. **Verify component installation**

#### State Management Issues
```bash
Error: Cannot read property of undefined (Zustand store)
```

**Solutions:**
1. **Check store initialization** in components
2. **Verify store selectors**:
   ```typescript
   const user = useUserStore(state => state.user)
   ```
3. **Handle loading states** properly
4. **Check for race conditions** in async operations

## 🚀 Deployment Issues

### Vercel Deployment Problems

#### Build Failures on Vercel
```bash
Error: Command "npm run build" exited with 1
```

**Solutions:**
1. **Check build logs** in Vercel dashboard
2. **Test build locally**: `npm run build`
3. **Verify environment variables** are set in Vercel
4. **Check for missing dependencies**
5. **Ensure TypeScript types** are correct

#### Environment Variable Issues
```bash
Error: NEXT_PUBLIC_API_URL is undefined
```

**Solutions:**
1. **Set environment variables** in Vercel dashboard
2. **Prefix client variables** with `NEXT_PUBLIC_`
3. **Redeploy after** changing environment variables
4. **Check variable names** for typos

### Production Issues

#### API Calls Failing in Production
```bash
Error: Failed to fetch from API in production
```

**Solutions:**
1. **Verify ngrok tunnel** is active and public
2. **Check CORS configuration** allows production domain
3. **Update API URL** in Vercel environment variables
4. **Test API endpoints** directly with curl/Postman

#### Performance Issues
```bash
Warning: Large bundle size / Slow loading
```

**Solutions:**
1. **Analyze bundle size**: `npm run build` shows bundle analysis
2. **Implement code splitting**:
   ```typescript
   const LazyComponent = lazy(() => import('./Component'))
   ```
3. **Optimize images** with Next.js Image component
4. **Remove unused dependencies**

## 🔍 Debugging Techniques

### Frontend Debugging

1. **Browser Developer Tools**:
   - Console for JavaScript errors
   - Network tab for API calls
   - Application tab for localStorage/cookies

2. **React Developer Tools**:
   - Component tree inspection
   - Props and state debugging
   - Performance profiling

3. **Next.js Debugging**:
   ```bash
   # Enable debug mode
   DEBUG=* npm run dev
   ```

### Backend Debugging

1. **Console Logging**:
   ```javascript
   console.log('Debug info:', { user, request: req.body })
   ```

2. **Request Logging**:
   - Morgan middleware logs all requests
   - Check terminal output for request details

3. **Database Debugging**:
   ```javascript
   // Enable Mongoose debugging
   mongoose.set('debug', true)
   ```

### Network Debugging

1. **Test API Endpoints**:
   ```bash
   # Test backend health
   curl http://localhost:5000/api/health
   
   # Test with authentication
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:5000/api/auth/me
   ```

2. **Check ngrok Status**:
   - Visit http://localhost:4040
   - View request logs and tunnel status

## 📋 Diagnostic Checklist

When encountering issues, check:

### ✅ Environment Setup
- [ ] Node.js version (18+)
- [ ] npm dependencies installed
- [ ] Environment variables set
- [ ] Database connection working
- [ ] ngrok authenticated and running

### ✅ Development Servers
- [ ] Frontend running on port 3000
- [ ] Backend running on port 5000
- [ ] ngrok tunnel active
- [ ] No port conflicts

### ✅ Configuration Files
- [ ] `.env.local` has correct values
- [ ] `next.config.js` is properly configured
- [ ] `tsconfig.json` excludes archive folders
- [ ] `package.json` has all dependencies

### ✅ Code Quality
- [ ] TypeScript compilation passes
- [ ] ESLint shows no errors
- [ ] Build completes successfully
- [ ] Tests pass (if applicable)

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check existing issues**: [GitHub Issues](https://github.com/SameerAli126/WordWanderer/issues)
2. **Create detailed issue** with:
   - Error message (full stack trace)
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

3. **Include diagnostic information**:
   ```bash
   # System info
   node --version
   npm --version
   
   # Project info
   npm list --depth=0
   
   # Build output
   npm run build 2>&1 | tee build.log
   ```

4. **Common debugging commands**:
   ```bash
   # Clear all caches
   npm run clean
   rm -rf .next node_modules package-lock.json
   npm install
   
   # Reset git state
   git status
   git stash  # Save uncommitted changes
   git pull origin production
   ```

Remember: Most issues are environment-related or due to missing dependencies. Double-check your setup before diving into complex debugging! 🔍
