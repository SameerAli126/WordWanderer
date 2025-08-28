# WordWanderer 🌟

> A modern, gamified language learning platform inspired by Duolingo, built with cutting-edge web technologies.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/SameerAli126/WordWanderer)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**Live Demo**: [https://wordwanderer.vercel.app](https://wordwanderer.vercel.app)

## ✨ Features

### 🎮 Gamified Learning Experience
- **XP System**: Earn experience points for completing lessons
- **Streak Tracking**: Maintain daily learning streaks with visual indicators
- **Achievement System**: Unlock badges and rewards for milestones
- **Progress Analytics**: Detailed learning statistics and progress visualization
- **Leaderboards**: Compete with other learners (coming soon)

### 📚 Interactive Learning
- **Multiple Question Types**: Multiple choice, translation, audio recognition, and more
- **Adaptive Difficulty**: Lessons adjust to your learning pace
- **Spaced Repetition**: Smart review system for better retention
- **Real-time Feedback**: Instant corrections and explanations
- **Voice Recognition**: Practice pronunciation with audio exercises

### 🎨 Modern User Experience
- **Responsive Design**: Seamless experience across all devices
- **Dark/Light Mode**: Customizable theme preferences
- **Smooth Animations**: Engaging transitions with Framer Motion
- **Accessibility**: WCAG compliant design for all users
- **Offline Support**: Continue learning without internet connection

### 🌍 Language Support
- **Chinese (Mandarin)**: Complete course with Pinyin and Hanzi
- **Expandable Framework**: Easy to add new languages
- **Cultural Context**: Learn language with cultural insights

## 🛠️ Technology Stack

### Frontend Architecture
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern component library
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Backend Infrastructure
- **[Express.js](https://expressjs.com/)** - Fast, unopinionated web framework
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - Cloud-hosted NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - Elegant MongoDB object modeling
- **[JWT](https://jwt.io/)** - Secure authentication tokens
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
- **[ngrok](https://ngrok.com/)** - Secure tunneling for development

### Development & Deployment
- **[Vercel](https://vercel.com/)** - Frontend deployment and hosting
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code quality and formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for quality assurance
- **GitHub Actions** - Continuous integration and deployment

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/atlas))
- **ngrok** account ([Sign up](https://ngrok.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SameerAli126/WordWanderer.git
   cd WordWanderer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wordwanderer
   
   # Authentication
   JWT_SECRET=your-super-secure-jwt-secret
   
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start development servers**
   
   **Backend with ngrok tunnel:**
   ```bash
   ./start-backend.sh
   ```
   
   **Frontend (in new terminal):**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **ngrok Dashboard**: http://localhost:4040

### Production Deployment

See our comprehensive [Deployment Guide](./docs/deployment.md) for detailed instructions on deploying to Vercel and setting up production infrastructure.

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Getting Started](./docs/getting-started.md)** - Complete setup guide
- **[Architecture Overview](./docs/architecture.md)** - System design and patterns
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions

## 🏗️ Project Structure

```
WordWanderer/
├── 📁 src/                    # Frontend source code
│   ├── 📁 app/               # Next.js App Router pages
│   ├── 📁 components/        # Reusable React components
│   ├── 📁 lib/              # Utilities and configurations
│   ├── 📁 store/            # Zustand state management
│   ├── 📁 types/            # TypeScript definitions
│   └── 📁 data/             # Mock data and constants
├── 📁 backend/               # Backend source code
│   ├── 📁 models/           # MongoDB schemas
│   ├── 📁 routes/           # Express.js routes
│   ├── 📁 middleware/       # Custom middleware
│   └── 📄 server.js         # Main server file
├── 📁 docs/                 # Comprehensive documentation
├── 📁 public/               # Static assets
├── 📄 start-backend.sh      # Backend startup script
└── 📄 README.md             # This file
```

## 🎯 Usage Guide

### For Learners
1. **Sign up** for a free account
2. **Choose your language** (Chinese available)
3. **Start with basics** - alphabet, pronunciation, common phrases
4. **Progress through lessons** - earn XP and maintain streaks
5. **Track your journey** - view detailed progress analytics

### For Developers
1. **Fork the repository** and set up your development environment
2. **Read the documentation** to understand the architecture
3. **Make your changes** following our coding standards
4. **Test thoroughly** with our comprehensive test suite
5. **Submit a pull request** with detailed description

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help:

### Ways to Contribute
- 🐛 **Bug Reports**: Found an issue? Let us know!
- 💡 **Feature Requests**: Have an idea? We'd love to hear it!
- 🔧 **Code Contributions**: Fix bugs or add new features
- 📚 **Documentation**: Help improve our docs
- 🌍 **Translations**: Add support for new languages

### Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** our coding standards and best practices
4. **Test** your changes thoroughly
5. **Commit** with clear, descriptive messages
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request with detailed description

## 📊 Project Status

- ✅ **Core Learning Engine**: Complete
- ✅ **User Authentication**: Complete
- ✅ **Progress Tracking**: Complete
- ✅ **Responsive Design**: Complete
- ✅ **Chinese Language Course**: Complete
- 🚧 **Voice Recognition**: In Progress
- 🚧 **Mobile App**: Planned
- 🚧 **Additional Languages**: Planned

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm test             # Run test suite
```

### Git Workflow
- `production` - Stable, production-ready code
- `development` - Latest development changes
- `feature/*` - Feature development branches

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Duolingo** - Inspiration for gamified language learning
- **Next.js Team** - Amazing React framework
- **Vercel** - Excellent deployment platform
- **MongoDB** - Reliable database solution
- **Open Source Community** - For the incredible tools and libraries

## 📞 Support

Need help? We're here for you:

- 📖 **Documentation**: Check our [comprehensive docs](./docs/)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/SameerAli126/WordWanderer/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/SameerAli126/WordWanderer/discussions)
- 📧 **Email**: [daniyalsameer7@gmail.com](mailto:daniyalsameer7@gmail.com)

---

<div align="center">

**Made with ❤️ by [Sameer Ali](https://github.com/SameerAli126)**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
