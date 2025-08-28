# WordWanderer Documentation

Welcome to the comprehensive documentation for WordWanderer - a modern, gamified language learning platform inspired by Duolingo.

## 📚 Table of Contents

- [Getting Started](./getting-started.md)
- [Architecture Overview](./architecture.md)
- [Frontend Guide](./frontend.md)
- [Backend Guide](./backend.md)
- [Deployment Guide](./deployment.md)
- [API Reference](./api-reference.md)
- [Component Library](./components.md)
- [Development Workflow](./development.md)
- [Troubleshooting](./troubleshooting.md)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/SameerAli126/WordWanderer.git
   cd WordWanderer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development servers**
   ```bash
   # Frontend (Next.js)
   npm run dev

   # Backend (Express.js)
   ./start-backend.sh
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - ngrok tunnel: Check terminal output

## 🏗️ Project Structure

```
WordWanderer/
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and configurations
│   ├── store/            # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   └── data/             # Mock data and constants
├── backend/               # Backend source code
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── server.js         # Main server file
├── docs/                 # Documentation
├── public/               # Static assets
└── start-backend.sh      # Backend startup script
```

## 🎯 Key Features

- **Gamified Learning**: XP system, streaks, achievements, and leaderboards
- **Interactive Lessons**: Multiple question types (multiple choice, translation, audio)
- **Progress Tracking**: Visual progress indicators and learning analytics
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Real-time Backend**: Express.js with MongoDB and ngrok tunneling

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Development**: ngrok for tunneling
- **CORS**: Multi-origin support

### Development & Deployment
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Version Control**: Git with production/development branches
- **Deployment**: Vercel (frontend) + ngrok (backend)
- **Environment**: dotenv for configuration

## 📖 Documentation Overview

Each documentation file covers specific aspects of the project:

- **Getting Started**: Complete setup guide for new developers
- **Architecture**: System design and component relationships
- **Frontend Guide**: React components, pages, and state management
- **Backend Guide**: API endpoints, database models, and middleware
- **Deployment**: Production deployment on Vercel and backend setup
- **API Reference**: Complete API documentation with examples
- **Components**: UI component library documentation
- **Development**: Coding standards, git workflow, and best practices
- **Troubleshooting**: Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Search existing [GitHub Issues](https://github.com/SameerAli126/WordWanderer/issues)
3. Create a new issue with detailed information

## 🎉 Acknowledgments

- Inspired by Duolingo's gamified learning approach
- Built with modern web technologies and best practices
- Community-driven development and feedback
