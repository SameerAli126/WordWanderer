const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userPreferencesSchema = new mongoose.Schema({
  dailyGoal: {
    type: Number,
    default: 15, // minutes per day
    min: 5,
    max: 120
  },
  reminderTime: {
    type: String,
    default: null
  },
  soundEnabled: {
    type: Boolean,
    default: true
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  language: {
    type: String,
    default: 'en'
  }
});

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['streak', 'xp', 'lessons', 'accuracy', 'speed', 'social', 'special'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: true
  },
  xpReward: {
    type: Number,
    default: 0
  },
  gemReward: {
    type: Number,
    default: 0
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0
  },
  maxProgress: {
    type: Number,
    default: 100
  }
});

const lessonProgressSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  unitId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'completed'
  },
  attempts: {
    type: Number,
    default: 1,
    min: 1
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bestAccuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  xpEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, { _id: false });

const practiceSessionSchema = new mongoose.Schema({
  practiceType: {
    type: String,
    enum: ['hanzi', 'pinyin'],
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  totalExercises: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const reviewItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  ease: {
    type: Number,
    default: 2.5,
    min: 1.3
  },
  intervalDays: {
    type: Number,
    default: 0,
    min: 0
  },
  repetitions: {
    type: Number,
    default: 0,
    min: 0
  },
  nextReviewAt: {
    type: Date,
    default: Date.now
  },
  lastReviewedAt: {
    type: Date,
    default: null
  },
  lastResult: {
    type: String,
    enum: ['correct', 'incorrect'],
    default: 'incorrect'
  }
}, { _id: false });

const userCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  currentUnit: {
    type: Number,
    default: 1
  },
  currentLesson: {
    type: Number,
    default: 1
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  progress: {
    totalXP: {
      type: Number,
      default: 0
    },
    lessonsCompleted: {
      type: Number,
      default: 0
    },
    unitsCompleted: {
      type: Number,
      default: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    streakDays: {
      type: Number,
      default: 0
    }
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username must be less than 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    minlength: [2, 'Display name must be at least 2 characters'],
    maxlength: [50, 'Display name must be less than 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  recoveryCodeHash: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  totalXP: {
    type: Number,
    default: 0,
    min: 0
  },
  gems: {
    type: Number,
    default: 1000,
    min: 0
  },
  hearts: {
    type: Number,
    default: 5,
    min: 0
  },
  heartsUpdatedAt: {
    type: Date,
    default: Date.now
  },
  maxHearts: {
    type: Number,
    default: 5,
    min: 1
  },
  dailyLessonCount: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyLessonDate: {
    type: Date,
    default: null
  },
  dailyXP: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyStudySeconds: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyQuestCompletions: [
    {
      questId: {
        type: String,
        required: true
      },
      completedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  streakFreezes: {
    type: Number,
    default: 0,
    min: 0
  },
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastStreakDate: {
    type: Date,
    default: null
  },
  preferences: {
    type: userPreferencesSchema,
    default: () => ({})
  },
  achievements: [achievementSchema],
  lessonProgress: [lessonProgressSchema],
  practiceSessions: [practiceSessionSchema],
  reviewItems: [reviewItemSchema],
  courses: [userCourseSchema],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.recoveryCodeHash;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    }
  }
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ totalXP: -1 });
userSchema.index({ currentStreak: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last active timestamp
userSchema.methods.updateLastActive = function() {
  this.lastActiveAt = new Date();
  return this.save();
};

// Add XP and update level
userSchema.methods.addXP = function(xp) {
  this.totalXP += xp;
  return this.save();
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastStreakDate = this.lastStreakDate;
  
  if (!lastStreakDate) {
    // First time
    this.currentStreak = 1;
    this.lastStreakDate = today;
  } else {
    const daysDiff = Math.floor((today - lastStreakDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.currentStreak += 1;
      this.lastStreakDate = today;
    } else if (daysDiff > 1) {
      // Streak broken unless a freeze is available for one missed day
      if (daysDiff === 2 && this.streakFreezes > 0) {
        this.streakFreezes -= 1;
        this.lastStreakDate = today;
      } else {
        this.currentStreak = 1;
        this.lastStreakDate = today;
      }
    }
    // If daysDiff === 0, same day, no change needed
  }
  
  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
