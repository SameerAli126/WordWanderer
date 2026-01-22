const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get leaderboard entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    const users = await User.find({})
      .sort({ totalXP: -1 })
      .limit(limit)
      .select('displayName username totalXP currentStreak avatar')
      .lean();

    const currentUser = await User.findById(req.user.userId)
      .select('displayName username totalXP currentStreak avatar')
      .lean();

    const entries = users.map((user, index) => ({
      userId: user._id.toString(),
      rank: index + 1,
      name: user.displayName || user.username,
      xp: user.totalXP || 0,
      streak: user.currentStreak || 0,
      avatar: user.avatar || null,
      isCurrentUser: currentUser && user._id.toString() === currentUser._id.toString()
    }));

    let currentUserEntry = null;
    if (currentUser) {
      const exists = entries.some((entry) => entry.userId === currentUser._id.toString());
      if (!exists) {
        const higherCount = await User.countDocuments({ totalXP: { $gt: currentUser.totalXP || 0 } });
        currentUserEntry = {
          userId: currentUser._id.toString(),
          rank: higherCount + 1,
          name: currentUser.displayName || currentUser.username,
          xp: currentUser.totalXP || 0,
          streak: currentUser.currentStreak || 0,
          avatar: currentUser.avatar || null,
          isCurrentUser: true
        };
      }
    }

    res.json({
      success: true,
      entries,
      currentUser: currentUserEntry
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
