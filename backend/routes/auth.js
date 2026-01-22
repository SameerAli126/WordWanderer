const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_GEMS = 1000;
const DEFAULT_MAX_HEARTS = 5;
const HEART_REGEN_MINUTES = 10;
const HEART_REGEN_MS = HEART_REGEN_MINUTES * 60 * 1000;

// Demo user for fallback mode
const demoUser = {
  _id: 'demo-user-id',
  email: 'demo@wordwanderer.com',
  username: 'demouser',
  displayName: 'Demo User',
  totalXP: 1250,
  currentStreak: 5,
  longestStreak: 12,
  gems: DEFAULT_GEMS,
  hearts: DEFAULT_MAX_HEARTS,
  maxHearts: DEFAULT_MAX_HEARTS,
  heartsUpdatedAt: new Date(),
  streakFreezes: 0,
  xpBoosts: 0,
  streakShieldUntil: null,
  unlimitedHeartsUntil: null,
  superTrialUsed: false,
  doubleOrNothing: {
    active: false,
    startedAt: null,
    startStreak: 0,
    targetStreak: 0,
    startGems: DEFAULT_GEMS,
    lastResult: null
  },
  achievements: ['first_lesson', 'daily_login', 'week_streak'],
  currentLanguage: 'chinese',
  level: 8,
  createdAt: new Date('2024-01-01'),
  lastLoginAt: new Date()
};
const demoRecoveryCode = '123456789';

const fallbackUsersById = new Map();
const fallbackUsersByEmail = new Map();
const fallbackUsersByUsername = new Map();

const addFallbackUser = (user) => {
  fallbackUsersById.set(user._id, user);
  fallbackUsersByEmail.set(user.email, user);
  fallbackUsersByUsername.set(user.username, user);
};

// Check if MongoDB is available
const isMongoAvailable = () => {
  return require('mongoose').connection.readyState === 1;
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const generateRecoveryCode = () => {
  return `${Math.floor(100000000 + Math.random() * 900000000)}`;
};

const isUnlimitedHeartsActive = (user) => {
  if (!user.unlimitedHeartsUntil) {
    return false;
  }
  return new Date(user.unlimitedHeartsUntil).getTime() > Date.now();
};

const applyHeartRegen = (user) => {
  if (!user.heartsUpdatedAt) {
    user.heartsUpdatedAt = new Date();
  }
  if (isUnlimitedHeartsActive(user)) {
    if (user.hearts !== user.maxHearts) {
      user.hearts = user.maxHearts;
    }
    user.heartsUpdatedAt = new Date();
    return true;
  }
  if (user.hearts >= user.maxHearts) {
    user.heartsUpdatedAt = new Date();
    return false;
  }

  const now = Date.now();
  const lastUpdate = new Date(user.heartsUpdatedAt).getTime();
  const elapsed = now - lastUpdate;
  if (elapsed < HEART_REGEN_MS) {
    return false;
  }

  const heartsToAdd = Math.floor(elapsed / HEART_REGEN_MS);
  if (heartsToAdd <= 0) {
    return false;
  }

  user.hearts = Math.min(user.maxHearts, user.hearts + heartsToAdd);
  user.heartsUpdatedAt = new Date(lastUpdate + heartsToAdd * HEART_REGEN_MS);
  return true;
};

const getHeartRegenInfo = (user) => {
  if (user.hearts >= user.maxHearts) {
    return { nextInSeconds: 0, fullInSeconds: 0 };
  }
  if (isUnlimitedHeartsActive(user)) {
    return { nextInSeconds: 0, fullInSeconds: 0 };
  }

  const now = Date.now();
  const lastUpdate = user.heartsUpdatedAt ? new Date(user.heartsUpdatedAt).getTime() : now;
  const elapsed = now - lastUpdate;
  const nextIn = Math.max(0, HEART_REGEN_MS - elapsed);
  const heartsMissing = user.maxHearts - user.hearts;
  const fullIn = nextIn + Math.max(0, heartsMissing - 1) * HEART_REGEN_MS;
  return {
    nextInSeconds: Math.ceil(nextIn / 1000),
    fullInSeconds: Math.ceil(fullIn / 1000),
  };
};

const ensureUserEconomy = async (user) => {
  let changed = false;
  if (typeof user.gems !== 'number') {
    user.gems = DEFAULT_GEMS;
    changed = true;
  }
  if (typeof user.maxHearts !== 'number') {
    user.maxHearts = DEFAULT_MAX_HEARTS;
    changed = true;
  }
  if (typeof user.hearts !== 'number') {
    user.hearts = user.maxHearts || DEFAULT_MAX_HEARTS;
    changed = true;
  }
  if (!user.heartsUpdatedAt) {
    user.heartsUpdatedAt = new Date();
    changed = true;
  }
  if (typeof user.streakFreezes !== 'number') {
    user.streakFreezes = 0;
    changed = true;
  }
  if (user.streakShieldUntil === undefined) {
    user.streakShieldUntil = null;
    changed = true;
  }
  if (user.unlimitedHeartsUntil === undefined) {
    user.unlimitedHeartsUntil = null;
    changed = true;
  }
  if (typeof user.xpBoosts !== 'number') {
    user.xpBoosts = 0;
    changed = true;
  }
  if (typeof user.superTrialUsed !== 'boolean') {
    user.superTrialUsed = false;
    changed = true;
  }
  if (typeof user.doubleOrNothing !== 'object' || user.doubleOrNothing === null) {
    user.doubleOrNothing = {
      active: false,
      startedAt: null,
      startStreak: 0,
      targetStreak: 0,
      startGems: user.gems ?? DEFAULT_GEMS,
      lastResult: null
    };
    changed = true;
  }

  const regenChanged = applyHeartRegen(user);
  if (regenChanged) {
    changed = true;
  }
  if (changed) {
    await user.save();
  }
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  body('displayName')
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Display name must be 2-50 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, username, displayName, password } = req.body;
    const recoveryCode = generateRecoveryCode();

    // Check if MongoDB is connected
    if (!isMongoAvailable()) {
      // Fallback mode - keep users in memory for local dev
      console.log('Registration in fallback mode (MongoDB not connected)');

      if (fallbackUsersByEmail.has(email) || fallbackUsersByUsername.has(username)) {
        return res.status(409).json({
          success: false,
          message: fallbackUsersByEmail.has(email)
            ? 'User with this email already exists'
            : 'Username is already taken'
        });
      }

      const demoUserId = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const token = generateToken(demoUserId);
      const passwordHash = await bcrypt.hash(password, 12);
      const recoveryCodeHash = await bcrypt.hash(recoveryCode, 12);

      const fallbackUser = {
        _id: demoUserId,
        email,
        username,
        displayName,
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        gems: DEFAULT_GEMS,
        hearts: DEFAULT_MAX_HEARTS,
        maxHearts: DEFAULT_MAX_HEARTS,
        heartsUpdatedAt: new Date(),
        streakFreezes: 0,
        xpBoosts: 0,
        streakShieldUntil: null,
        unlimitedHeartsUntil: null,
        superTrialUsed: false,
        doubleOrNothing: {
          active: false,
          startedAt: null,
          startStreak: 0,
          targetStreak: 0,
          startGems: DEFAULT_GEMS,
          lastResult: null
        },
        level: 1,
        preferences: {
          dailyGoal: 10,
          soundEnabled: true,
          notificationsEnabled: true,
          emailReminders: false,
          dailyGoalReminder: true,
          streakProtection: true,
          reminderTime: null,
          theme: 'light',
          language: 'en'
        },
        achievements: [],
        courses: [],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        passwordHash,
        recoveryCodeHash,
        isDemo: true
      };

      addFallbackUser(fallbackUser);

      // Set cookie
      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (Demo Mode)',
        user: {
          id: fallbackUser._id,
          email: fallbackUser.email,
          username: fallbackUser.username,
          displayName: fallbackUser.displayName,
          totalXP: fallbackUser.totalXP,
        currentStreak: fallbackUser.currentStreak,
        longestStreak: fallbackUser.longestStreak,
        gems: fallbackUser.gems,
        hearts: fallbackUser.hearts,
        maxHearts: fallbackUser.maxHearts,
        streakFreezes: fallbackUser.streakFreezes,
        xpBoosts: fallbackUser.xpBoosts,
        streakShieldUntil: fallbackUser.streakShieldUntil,
        unlimitedHeartsUntil: fallbackUser.unlimitedHeartsUntil,
        superTrialUsed: fallbackUser.superTrialUsed,
        doubleOrNothing: fallbackUser.doubleOrNothing,
        isDemo: true
      },
      recoveryCode,
      token
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'Username is already taken'
      });
    }

    // Create new user
    const recoveryCodeHash = await bcrypt.hash(recoveryCode, 12);
    const user = new User({
      email,
      username,
      displayName,
      password,
      recoveryCodeHash
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        totalXP: user.totalXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      gems: user.gems,
      hearts: user.hearts,
      maxHearts: user.maxHearts,
      xpBoosts: user.xpBoosts,
      streakShieldUntil: user.streakShieldUntil,
      unlimitedHeartsUntil: user.unlimitedHeartsUntil,
      superTrialUsed: user.superTrialUsed,
      doubleOrNothing: user.doubleOrNothing
      },
      recoveryCode,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    let user;
    let token;

    if (!isMongoAvailable()) {
      // Fallback mode - check in-memory users or demo credentials
      if (email === demoUser.email && password === 'demo123') {
        user = demoUser;
        token = generateToken(demoUser._id);
      } else {
        const fallbackUser = fallbackUsersByEmail.get(email);
        if (!fallbackUser) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }

        const isPasswordValid = await bcrypt.compare(password, fallbackUser.passwordHash);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }

        fallbackUser.lastLoginAt = new Date();
        user = fallbackUser;
        token = generateToken(fallbackUser._id);
      }
    } else {
      // Normal database mode
      user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update last active
      await user.updateLastActive();
      await ensureUserEconomy(user);
      token = generateToken(user._id);
    }

    // Set cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        gems: user.gems,
        hearts: user.hearts,
        maxHearts: user.maxHearts,
        streakFreezes: user.streakFreezes,
        xpBoosts: user.xpBoosts,
        streakShieldUntil: user.streakShieldUntil,
        unlimitedHeartsUntil: user.unlimitedHeartsUntil,
        superTrialUsed: user.superTrialUsed,
        doubleOrNothing: user.doubleOrNothing,
        preferences: user.preferences,
        achievements: user.achievements,
        courses: user.courses
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using recovery code
// @access  Public
router.post('/reset-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('recoveryCode')
    .matches(/^\d{9}$/)
    .withMessage('Recovery code must be a 9-digit number'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, recoveryCode, newPassword } = req.body;

    if (!isMongoAvailable()) {
      if (email === demoUser.email && recoveryCode === demoRecoveryCode) {
        return res.json({
          success: true,
          message: 'Password reset successful (Demo Mode)'
        });
      }

      const fallbackUser = fallbackUsersByEmail.get(email);
      if (!fallbackUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found (Demo mode)'
        });
      }

      const isCodeValid = await bcrypt.compare(recoveryCode, fallbackUser.recoveryCodeHash);
      if (!isCodeValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid recovery code'
        });
      }

      fallbackUser.passwordHash = await bcrypt.hash(newPassword, 12);
      fallbackUser.lastLoginAt = new Date();

      return res.json({
        success: true,
        message: 'Password reset successful (Demo Mode)'
      });
    }

    const user = await User.findOne({ email }).select('+password +recoveryCodeHash');
    if (!user || !user.recoveryCodeHash) {
      return res.status(404).json({
        success: false,
        message: 'User not found or recovery code not set'
      });
    }

    const isCodeValid = await bcrypt.compare(recoveryCode, user.recoveryCodeHash);
    if (!isCodeValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid recovery code'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('auth-token');

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    let user;

    if (!isMongoAvailable()) {
      // Fallback mode - return demo or in-memory user
      if (req.user.userId === demoUser._id) {
        user = demoUser;
      } else {
        const fallbackUser = fallbackUsersById.get(req.user.userId);
        if (!fallbackUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found (Demo mode)'
          });
        }
        user = fallbackUser;
      }
    } else {
      // Normal database mode
      user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await ensureUserEconomy(user);

      const hasLessonAchievement = user.achievements?.some((achievement) => achievement.id === 'first_lesson');
      if (!hasLessonAchievement && user.lessonProgress && user.lessonProgress.length > 0) {
        user.achievements.push({
          id: 'first_lesson',
          title: 'First Steps',
          description: 'Complete your first lesson',
          icon: 'Trophy',
          category: 'lessons',
          rarity: 'common',
          xpReward: 50,
          gemReward: 25,
          unlockedAt: new Date(),
          progress: 1,
          maxProgress: 1
        });
        await user.save();
      }
    }

    const heartRegen = getHeartRegenInfo(user);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar || null,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        gems: user.gems,
        hearts: user.hearts,
        maxHearts: user.maxHearts,
        streakFreezes: user.streakFreezes,
        heartRegen,
        level: user.level,
        xpBoosts: user.xpBoosts,
        streakShieldUntil: user.streakShieldUntil,
        unlimitedHeartsUntil: user.unlimitedHeartsUntil,
        superTrialUsed: user.superTrialUsed,
        doubleOrNothing: user.doubleOrNothing,
        preferences: user.preferences || {},
        achievements: user.achievements || [],
        courses: user.courses || [],
        joinedAt: user.createdAt,
        lastActiveAt: user.lastLoginAt || user.lastActiveAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', auth, [
  body('displayName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Display name must be 2-50 characters'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { displayName, preferences } = req.body;
    const updateData = {};

    if (displayName) updateData.displayName = displayName;
    if (preferences) updateData.preferences = { ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
