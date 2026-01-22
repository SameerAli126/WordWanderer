const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { buildDailyQuestState, ensureDailyStats, getResetInSeconds } = require('../lib/dailyQuests');

const router = express.Router();

// @route   GET /api/quests/daily
// @desc    Get daily quests and progress
// @access  Private
router.get('/daily', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const now = new Date();
    ensureDailyStats(user, now);
    await user.save();

    res.json({
      success: true,
      resetInSeconds: getResetInSeconds(now),
      quests: buildDailyQuestState(user, now)
    });
  } catch (error) {
    console.error('Daily quests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
