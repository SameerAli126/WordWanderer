# WordWanderer 🌍

A professional, full-stack language learning platform built with the MERN stack. WordWanderer combines the engaging gamification of Duolingo with modern web technologies to create an immersive language learning experience.

## ✨ Features

### 🎮 Gamification System
- **XP (Experience Points)** - Earn points for completing lessons and activities
- **Level Progression** - Advance through levels as you gain XP
- **Streak Tracking** - Maintain daily learning streaks with visual feedback
- **Achievement Badges** - Unlock achievements for various milestones
- **Leaderboards** - Compete with other learners globally

### 📚 Learning Features
- **Multiple Languages** - Spanish, French, German, Italian, Japanese, Portuguese, and more
- **Interactive Lessons** - Multiple question types (multiple choice, fill-in-blank, translation, etc.)
- **Progress Tracking** - Detailed analytics on learning progress and performance
- **Course Management** - Structured learning paths with units and skills
- **Real-time Feedback** - Immediate feedback with explanations and hints

### 🔐 Authentication & User Management
- **Secure Registration/Login** - JWT-based authentication with bcrypt password hashing
- **User Profiles** - Customizable profiles with preferences and statistics
- **Session Management** - Persistent login sessions with secure HTTP-only cookies
- **Password Security** - Industry-standard security practices

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered animations for engaging interactions
- **Professional Design** - Clean, modern interface with excellent accessibility
- **Loading States** - Professional loading indicators and error handling
- **Toast Notifications** - Real-time user feedback

## 🏗️ Architecture

### MERN Stack
- **MongoDB** - Database for users, courses, lessons, and progress
- **Express.js** - RESTful API backend with comprehensive validation
- **React/Next.js** - Modern frontend with server-side rendering
- **Node.js** - JavaScript runtime for backend services

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions
- **Zustand** - Lightweight state management
- **React Hot Toast** - Toast notifications

### Backend Stack
- **Express.js** - Web application framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SameerAli126/WordWanderer.git
   cd WordWanderer
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**

   **Backend (.env in backend folder):**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env.local in root folder):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NODE_ENV=development
   ```

5. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the Development Servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
WordWanderer/
├── backend/                    # Express.js Backend
│   ├── models/                # MongoDB Models
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Lesson.js
│   ├── routes/                # API Routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── lessons.js
│   │   └── progress.js
│   ├── middleware/            # Custom Middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── scripts/               # Database Scripts
│   │   └── seedDatabase.js
│   ├── server.js              # Main server file
│   └── package.json
├── src/                       # Next.js Frontend
│   ├── app/                   # App Router pages
│   │   ├── courses/          # Course pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── login/            # Authentication
│   │   ├── register/         # Registration
│   │   ├── demo/             # Demo lesson
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   │   ├── gamification/     # Gamification components
│   │   ├── lesson/           # Lesson components
│   │   ├── providers/        # Context providers
│   │   └── ui/               # Base UI components
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API service
│   │   └── utils.ts          # Helper functions
│   ├── store/                # State management
│   │   ├── useUserStore.ts
│   │   └── useLessonStore.ts
│   └── types/                # TypeScript definitions
│       └── index.ts
├── .gitignore
├── README.md
└── package.json
```

## 🎯 Key Components

### Gamification System
- **XPDisplay**: Shows current XP, level, and progress to next level
- **StreakDisplay**: Tracks and displays learning streaks with motivational messages
- **AchievementBadge**: Displays unlocked and locked achievements with progress

### UI Components
- **Button**: Customizable button with multiple variants and animations
- **Card**: Flexible card component with hover effects
- **Modal**: Accessible modal with smooth animations
- **ProgressBar**: Animated progress bars for various metrics

### State Management
- **useUserStore**: Manages user data, authentication, and preferences
- **useLessonStore**: Handles lesson state, progress, and session management

## 🎨 Design System

### Colors
- **Primary**: Blue tones for main actions and branding
- **Success**: Green for positive feedback and achievements
- **Warning**: Orange/Yellow for cautions and streaks
- **Error**: Red for errors and critical actions

### Typography
- **Font**: Inter (system fallback)
- **Scales**: Responsive typography with Tailwind CSS classes

### Animations
- **Micro-interactions**: Hover effects, button presses
- **Page transitions**: Smooth page and component transitions
- **Gamification**: Celebration animations for achievements and progress

## 🔧 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Quality
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Strict type checking enabled

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/:id` - Get specific course
- `GET /api/courses/popular` - Get popular courses
- `GET /api/courses/language/:code` - Get courses by language

### Lessons
- `GET /api/lessons` - Get lessons by course/unit
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/lessons/:id/next` - Get next lesson
- `GET /api/lessons/:id/previous` - Get previous lesson

### Progress
- `POST /api/progress/lesson-complete` - Record lesson completion
- `GET /api/progress/stats` - Get user statistics
- `POST /api/progress/enroll-course` - Enroll in course
- `GET /api/progress/courses` - Get user's enrolled courses

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `POST /api/users/add-xp` - Add XP to user
- `POST /api/users/update-streak` - Update user streak
- `GET /api/users/leaderboard` - Get leaderboard

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create a new project on Railway or Heroku
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the backend folder

### Database (MongoDB Atlas)
- Already configured for cloud deployment
- Update connection string in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Duolingo's gamification approach
- Built with modern web technologies
- Designed for accessibility and performance

---

**WordWanderer** - Making language learning an adventure! 🌟
