# WordWanderer Deployment Guide 🚀

## Git Branching Strategy

### Branch Structure
- **`main`** - Stable release branch (protected)
- **`production`** - Production-ready code for deployment
- **`development`** - Active development branch
- **`feature/*`** - Feature development branches

### Workflow
1. **Development**: All new features start from `development` branch
2. **Feature Branches**: Create feature branches from `development`
3. **Testing**: Merge completed features back to `development`
4. **Production**: Merge stable `development` to `production`
5. **Release**: Merge `production` to `main` for releases

## Environment Setup

### Development Environment
```bash
# Clone repository
git clone https://github.com/SameerAli126/WordWanderer.git
cd WordWanderer

# Switch to development branch
git checkout development

# Install dependencies
npm install
cd backend && npm install && cd ..

# Set up environment variables
cp .env.example .env.local
cp backend/.env.example backend/.env

# Seed database
cd backend && npm run seed

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
```

### Production Environment Variables

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NODE_ENV=production
```

#### Backend (.env.production)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wordwanderer
JWT_SECRET=your-super-secure-production-jwt-secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables in Vercel dashboard
5. Deploy from `production` branch

#### Backend Deployment (Railway)
1. Create new project on Railway
2. Connect GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy from `production` branch

### Option 2: Heroku (Full Stack)

#### Backend on Heroku
```bash
# Create Heroku app
heroku create wordwanderer-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FRONTEND_URL=https://wordwanderer.vercel.app

# Deploy
git subtree push --prefix backend heroku main
```

### Option 3: DigitalOcean/AWS (VPS)

#### Server Setup
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/SameerAli126/WordWanderer.git
cd WordWanderer
git checkout production

# Install dependencies
npm install
cd backend && npm install

# Set up environment
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start backend/server.js --name wordwanderer-api
pm2 start npm --name wordwanderer-frontend -- start

# Setup reverse proxy with Nginx
sudo apt install nginx
# Configure Nginx for both frontend and backend
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create new cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in environment variables

### Local MongoDB (Development)
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/wordwanderer
```

## Security Checklist

### Production Security
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS for all domains
- [ ] Set secure CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database access restrictions

### Environment Variables Security
- [ ] Never commit .env files
- [ ] Use different secrets for each environment
- [ ] Rotate secrets regularly
- [ ] Use secret management services in production

## Monitoring and Maintenance

### Health Checks
- Frontend: `https://your-domain.com`
- Backend: `https://your-api-domain.com/health`
- Database: Monitor MongoDB Atlas dashboard

### Logging
- Use PM2 logs for server monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track user engagement metrics

### Backup Strategy
- MongoDB Atlas automatic backups
- Regular database exports
- Code repository backups
- Environment configuration backups

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check FRONTEND_URL in backend .env
2. **Database Connection**: Verify MongoDB URI and network access
3. **Authentication Issues**: Check JWT secret consistency
4. **Build Failures**: Verify all dependencies are installed
5. **API Timeouts**: Check rate limiting configuration

### Debug Commands
```bash
# Check backend logs
pm2 logs wordwanderer-api

# Check frontend logs
pm2 logs wordwanderer-frontend

# Test API endpoints
curl https://your-api-domain.com/health

# Check database connection
node -e "require('./backend/server.js')"
```

## Performance Optimization

### Frontend
- Enable Next.js image optimization
- Use CDN for static assets
- Implement code splitting
- Optimize bundle size

### Backend
- Enable compression middleware
- Use database indexing
- Implement caching strategies
- Optimize API queries

### Database
- Create proper indexes
- Monitor query performance
- Use connection pooling
- Regular maintenance tasks

---

**Note**: Always test deployments in staging environment before production release.
