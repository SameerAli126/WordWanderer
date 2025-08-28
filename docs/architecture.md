# WordWanderer Architecture

This document provides a comprehensive overview of WordWanderer's system architecture, design patterns, and technical decisions.

## 🏗️ System Overview

WordWanderer follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│   Port 3000     │    │   Port 5000     │    │   Atlas Cloud   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         │              │     ngrok       │
         └──────────────►│   Tunneling     │
                        │   Public URL    │
                        └─────────────────┘
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- Frontend handles UI/UX and client-side logic
- Backend manages business logic and data persistence
- Database stores structured data with proper relationships

### 2. **Component-Based Design**
- Reusable UI components with shadcn/ui
- Modular backend routes and middleware
- Composable data models

### 3. **Type Safety**
- TypeScript throughout the entire stack
- Shared type definitions between frontend and backend
- Runtime validation with proper error handling

### 4. **Scalable State Management**
- Zustand for lightweight, performant state management
- Local component state for UI-specific data
- Server state synchronization with proper caching

## 🖥️ Frontend Architecture

### Next.js App Router Structure
```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── courses/
│   ├── learn/
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── lesson/           # Lesson-specific components
│   ├── gamification/     # XP, streaks, achievements
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── utils.ts          # Helper functions
│   ├── api.ts            # API client
│   └── constants.ts      # App constants
├── store/                # State management
│   ├── useUserStore.ts   # User state
│   └── useLessonStore.ts # Lesson state
├── types/                # TypeScript definitions
│   └── index.ts          # Shared types
└── data/                 # Mock data and constants
    └── course-data.ts    # Course content
```

### Component Hierarchy
```
App Layout
├── Navigation
├── Page Content
│   ├── Course Components
│   │   ├── LessonCard
│   │   ├── ProgressBar
│   │   └── QuestionCard
│   ├── Gamification
│   │   ├── XPDisplay
│   │   ├── StreakCounter
│   │   └── AchievementBadge
│   └── UI Components
│       ├── Button
│       ├── Card
│       └── Modal
└── Footer
```

### State Management Pattern
```typescript
// Zustand store structure
interface UserStore {
  user: User | null
  isAuthenticated: boolean
  login: (credentials) => Promise<void>
  logout: () => void
  updateProfile: (data) => Promise<void>
}

interface LessonStore {
  currentLesson: Lesson | null
  progress: Progress
  startLesson: (lessonId) => void
  submitAnswer: (answer) => void
  completeLesson: () => void
}
```

## 🔧 Backend Architecture

### Express.js Structure
```
backend/
├── models/               # MongoDB models
│   ├── User.js          # User schema
│   ├── Course.js        # Course schema
│   └── Lesson.js        # Lesson schema
├── routes/              # API routes
│   ├── auth.js          # Authentication
│   ├── users.js         # User management
│   ├── courses.js       # Course data
│   └── lessons.js       # Lesson logic
├── middleware/          # Express middleware
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   └── validation.js    # Input validation
├── utils/               # Utility functions
│   ├── jwt.js           # JWT helpers
│   └── validation.js    # Validation schemas
└── server.js            # Main server file
```

### API Design Pattern
```javascript
// RESTful API structure
GET    /api/auth/me           # Get current user
POST   /api/auth/login        # User login
POST   /api/auth/register     # User registration

GET    /api/courses           # List all courses
GET    /api/courses/:id       # Get specific course
POST   /api/courses/:id/enroll # Enroll in course

GET    /api/lessons/:id       # Get lesson data
POST   /api/lessons/:id/submit # Submit lesson answer
PUT    /api/lessons/:id/complete # Mark lesson complete
```

### Middleware Stack
```javascript
// Request processing pipeline
app.use(cors())              // CORS handling
app.use(express.json())      // JSON parsing
app.use(morgan())            // Request logging
app.use(authMiddleware)      // JWT authentication
app.use('/api', routes)      # API routes
app.use(errorHandler)       // Error handling
```

## 🗄️ Database Design

### MongoDB Schema Design
```javascript
// User Schema
{
  _id: ObjectId,
  email: String,
  username: String,
  displayName: String,
  passwordHash: String,
  totalXP: Number,
  currentStreak: Number,
  gems: Number,
  courses: [CourseProgress],
  achievements: [Achievement],
  createdAt: Date,
  updatedAt: Date
}

// Course Schema
{
  _id: ObjectId,
  title: String,
  description: String,
  language: {
    code: String,
    name: String,
    nativeName: String
  },
  units: [Unit],
  difficulty: String,
  estimatedHours: Number
}

// Lesson Schema
{
  _id: ObjectId,
  courseId: ObjectId,
  unitId: ObjectId,
  title: String,
  type: String, // 'vocabulary', 'grammar', 'conversation'
  questions: [Question],
  xpReward: Number,
  difficulty: String
}
```

### Data Relationships
```
User ──┐
       ├── CourseProgress ──► Course
       └── LessonProgress ──► Lesson ──► Unit ──► Course
```

## 🔄 Data Flow

### Authentication Flow
```
1. User submits login form
2. Frontend sends POST /api/auth/login
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores token in memory
6. Frontend updates user state
7. Protected routes use token for API calls
```

### Lesson Flow
```
1. User selects lesson
2. Frontend fetches lesson data
3. User answers questions
4. Frontend submits answers
5. Backend validates and scores
6. Backend updates user progress
7. Frontend shows results and XP gained
```

## 🚀 Deployment Architecture

### Production Setup
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │     ngrok       │    │  MongoDB Atlas  │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Global CDN    │    │   Public URL    │    │   Cloud Hosted  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Configuration
```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000

# Production
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io
```

## 🔒 Security Architecture

### Authentication & Authorization
- JWT tokens for stateless authentication
- Password hashing with bcrypt
- Protected routes with middleware
- CORS configuration for cross-origin requests

### Data Validation
- Input validation on both frontend and backend
- TypeScript for compile-time type checking
- Mongoose schemas for database validation
- Sanitization of user inputs

## 📊 Performance Considerations

### Frontend Optimizations
- Next.js static generation for fast loading
- Component lazy loading
- Image optimization with Next.js Image
- Bundle splitting and code optimization

### Backend Optimizations
- MongoDB indexing for fast queries
- Connection pooling
- Caching strategies for frequently accessed data
- Efficient API design with proper HTTP methods

## 🔧 Development Tools

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Husky for git hooks

### Development Experience
- Hot reloading with Next.js
- nodemon for backend development
- ngrok for local development tunneling
- MongoDB Compass for database management

## 🚦 Error Handling

### Frontend Error Boundaries
```typescript
// Global error handling
try {
  await apiCall()
} catch (error) {
  toast.error(error.message)
  console.error('API Error:', error)
}
```

### Backend Error Middleware
```javascript
// Centralized error handling
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(error.status || 500).json({
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
})
```

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless backend design
- Database connection pooling
- CDN for static assets
- Load balancing capabilities

### Vertical Scaling
- Efficient database queries
- Caching strategies
- Code splitting and lazy loading
- Performance monitoring

This architecture provides a solid foundation for WordWanderer's current needs while maintaining flexibility for future growth and feature additions.
