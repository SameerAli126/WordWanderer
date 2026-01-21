const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_GEMS = 1000;
const DEFAULT_MAX_HEARTS = 5;
const HEART_REFILL_COST = 100;
const STREAK_FREEZE_COST = 200;
const HEART_REGEN_MINUTES = 10;
const HEART_REGEN_MS = HEART_REGEN_MINUTES * 60 * 1000;

const ensureEconomyFields = async (user) => {
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
  if (changed) {
    await user.save();
  }
};

const getHeartRegenInfo = (user) => {
  if (user.hearts >= user.maxHearts) {
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

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('displayName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Display name must be 2-50 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
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

    const { displayName, avatar } = req.body;
    const updateData = {};

    if (displayName) updateData.displayName = displayName;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('dailyGoal')
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage('Daily goal must be between 5 and 120 minutes'),
  body('soundEnabled')
    .optional()
    .isBoolean()
    .withMessage('Sound enabled must be a boolean'),
  body('notificationsEnabled')
    .optional()
    .isBoolean()
    .withMessage('Notifications enabled must be a boolean'),
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto')
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

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    user.preferences = { ...user.preferences.toObject(), ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/hearts/use
// @desc    Spend hearts for a mistake
// @access  Private
router.post('/hearts/use', auth, [
  body('amount')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Amount must be between 1 and 5')
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

    const amount = req.body.amount ?? 1;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await ensureEconomyFields(user);

    if (user.hearts <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No hearts remaining'
      });
    }

    user.hearts = Math.max(0, user.hearts - amount);
    user.heartsUpdatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      hearts: user.hearts,
      maxHearts: user.maxHearts,
      gems: user.gems,
      heartRegen: getHeartRegenInfo(user)
    });

  } catch (error) {
    console.error('Use hearts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/hearts/refill
// @desc    Refill hearts using gems
// @access  Private
router.post('/hearts/refill', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await ensureEconomyFields(user);

    if (user.hearts >= user.maxHearts) {
      return res.status(400).json({
        success: false,
        message: 'Hearts are already full'
      });
    }

    if (user.gems < HEART_REFILL_COST) {
      return res.status(400).json({
        success: false,
        message: 'Not enough gems'
      });
    }

    user.gems -= HEART_REFILL_COST;
    user.hearts = user.maxHearts;
    user.heartsUpdatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      hearts: user.hearts,
      maxHearts: user.maxHearts,
      gems: user.gems,
      cost: HEART_REFILL_COST,
      heartRegen: getHeartRegenInfo(user)
    });

  } catch (error) {
    console.error('Refill hearts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/streak-freeze/purchase
// @desc    Purchase a streak freeze using gems
// @access  Private
router.post('/streak-freeze/purchase', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await ensureEconomyFields(user);

    if (user.gems < STREAK_FREEZE_COST) {
      return res.status(400).json({
        success: false,
        message: 'Not enough gems'
      });
    }

    user.gems -= STREAK_FREEZE_COST;
    user.streakFreezes += 1;
    await user.save();

    res.json({
      success: true,
      gems: user.gems,
      streakFreezes: user.streakFreezes,
      cost: STREAK_FREEZE_COST
    });
  } catch (error) {
    console.error('Purchase streak freeze error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/add-xp
// @desc    Add XP to user
// @access  Private
router.post('/add-xp', auth, [
  body('xp')
    .isInt({ min: 1 })
    .withMessage('XP must be a positive integer')
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

    const { xp } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.addXP(xp);

    res.json({
      success: true,
      message: 'XP added successfully',
      totalXP: user.totalXP,
      addedXP: xp
    });

  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/update-streak
// @desc    Update user streak
// @access  Private
router.post('/update-streak', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.updateStreak();

    res.json({
      success: true,
      message: 'Streak updated successfully',
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak
    });

  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, type = 'xp' } = req.query;
    
    let sortField = 'totalXP';
    if (type === 'streak') {
      sortField = 'currentStreak';
    }

    const users = await User.find({ isActive: true })
      .select('username displayName totalXP currentStreak avatar')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      },
      xp: user.totalXP,
      streak: user.currentStreak
    }));

    res.json({
      success: true,
      leaderboard,
      type
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
