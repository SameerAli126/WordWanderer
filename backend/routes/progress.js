const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');
const {
  applyDailyQuestRewards,
  ensureDailyStats
} = require('../lib/dailyQuests');

const router = express.Router();

const GEM_REWARD_RATIO = 0.1;
const PERFECT_ACCURACY_BONUS = 5;
const REVIEW_RESET_DELAY_MINUTES = 30;
const XP_BOOST_MULTIPLIER = 2;
const STREAK_ACHIEVEMENTS = [
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Reach a 3-day streak',
    icon: 'Flame',
    category: 'streak',
    rarity: 'common',
    xpReward: 50,
    gemReward: 25,
    maxProgress: 3
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Keep a 7-day streak alive',
    icon: 'Flame',
    category: 'streak',
    rarity: 'rare',
    xpReward: 100,
    gemReward: 75,
    maxProgress: 7
  },
  {
    id: 'streak_14',
    title: 'Two-Week Trek',
    description: 'Maintain a 14-day streak',
    icon: 'Flame',
    category: 'streak',
    rarity: 'epic',
    xpReward: 160,
    gemReward: 150,
    maxProgress: 14
  },
  {
    id: 'streak_30',
    title: 'Streak Master',
    description: 'Hit a 30-day streak',
    icon: 'Flame',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 250,
    gemReward: 300,
    maxProgress: 30
  }
];
const DAILY_QUEST_ACHIEVEMENT = {
  id: 'daily_3_lessons',
  title: 'Daily Focus',
  description: 'Complete 3 lessons in a single day',
  icon: 'Sparkles',
  category: 'special',
  rarity: 'rare',
  xpReward: 80,
  gemReward: 60,
  maxProgress: 3
};

const upsertAchievement = (user, data, progressValue, shouldUnlock, unlockedAt) => {
  const existing = user.achievements.find((achievement) => achievement.id === data.id);
  const maxProgress = data.maxProgress ?? 1;
  const progress = Math.min(progressValue ?? 0, maxProgress);
  const unlocked = shouldUnlock ? (existing?.unlockedAt ?? unlockedAt) : existing?.unlockedAt ?? null;
  const achievementRecord = {
    ...data,
    progress,
    maxProgress,
    unlockedAt: unlocked
  };

  if (existing) {
    Object.assign(existing, achievementRecord);
  } else {
    user.achievements.push(achievementRecord);
  }

  if (shouldUnlock && !(existing && existing.unlockedAt)) {
    return achievementRecord;
  }

  return null;
};

const normalizeReviewAnswer = (value) => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const scheduleReview = (reviewItem, wasCorrect) => {
  const now = new Date();

  if (wasCorrect) {
    reviewItem.repetitions += 1;
    if (reviewItem.repetitions === 1) {
      reviewItem.intervalDays = 1;
    } else if (reviewItem.repetitions === 2) {
      reviewItem.intervalDays = 3;
    } else {
      reviewItem.intervalDays = Math.max(1, Math.round(reviewItem.intervalDays * reviewItem.ease));
    }
    reviewItem.ease = Math.max(1.3, reviewItem.ease + 0.1);
    reviewItem.nextReviewAt = new Date(now.getTime() + reviewItem.intervalDays * 24 * 60 * 60 * 1000);
    reviewItem.lastResult = 'correct';
  } else {
    reviewItem.repetitions = 0;
    reviewItem.intervalDays = 0;
    reviewItem.ease = Math.max(1.3, reviewItem.ease - 0.2);
    reviewItem.nextReviewAt = new Date(now.getTime() + REVIEW_RESET_DELAY_MINUTES * 60 * 1000);
    reviewItem.lastResult = 'incorrect';
  }

  reviewItem.lastReviewedAt = now;
};

const computeBaseXp = (lessonXp, accuracy, fallbackXp) => {
  if (typeof lessonXp === 'number' && !Number.isNaN(lessonXp)) {
    const computed = Math.round((lessonXp * accuracy) / 100);
    return Math.max(0, computed);
  }
  return Math.max(0, fallbackXp || 0);
};

// @route   POST /api/progress/lesson-complete
// @desc    Record lesson completion
// @access  Private
router.post('/lesson-complete', auth, [
  body('lessonId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid lesson ID is required'),
  body('accuracy')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Accuracy must be between 0 and 100'),
  body('timeSpent')
    .isInt({ min: 1 })
    .withMessage('Time spent must be a positive integer'),
  body('xpEarned')
    .isInt({ min: 0 })
    .withMessage('XP earned must be a non-negative integer'),
  body('questions')
    .isArray()
    .withMessage('Questions must be an array')
  ,
  body('questionDetails')
    .optional()
    .isArray()
    .withMessage('Question details must be an array')
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

    const { lessonId, accuracy, timeSpent, xpEarned, questions, questionDetails } = req.body;

    // Get user and lesson
    const user = await User.findById(req.user.userId);
    const lesson = await Lesson.findById(lessonId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    if (typeof user.gems !== 'number') {
      user.gems = 1000;
    }
    if (typeof user.maxHearts !== 'number') {
      user.maxHearts = 5;
    }
    if (typeof user.hearts !== 'number') {
      user.hearts = user.maxHearts || 5;
    }
    if (typeof user.xpBoosts !== 'number') {
      user.xpBoosts = 0;
    }
    if (typeof user.doubleOrNothing !== 'object' || user.doubleOrNothing === null) {
      user.doubleOrNothing = {
        active: false,
        startedAt: null,
        startStreak: 0,
        targetStreak: 0,
        startGems: user.gems || 0,
        lastResult: null
      };
    }

    const baseXp = computeBaseXp(lesson.xpReward, accuracy, xpEarned);
    let finalXp = baseXp;
    let xpBoostApplied = false;
    if (user.xpBoosts > 0 && baseXp > 0) {
      finalXp = baseXp * XP_BOOST_MULTIPLIER;
      user.xpBoosts -= 1;
      xpBoostApplied = true;
    }

    const courseId = lesson.courseId;
    const unitId = lesson.unitId;
    const completedAt = new Date();

    ensureDailyStats(user, completedAt);
    if (typeof user.dailyLessonCount !== 'number') {
      user.dailyLessonCount = 0;
    }
    if (typeof user.dailyXP !== 'number') {
      user.dailyXP = 0;
    }
    if (typeof user.dailyStudySeconds !== 'number') {
      user.dailyStudySeconds = 0;
    }
    user.dailyLessonCount += 1;
    user.dailyXP += finalXp;
    user.dailyStudySeconds += timeSpent;

    // Ensure user is enrolled in the course
    let courseProgress = user.courses.find(
      (course) => course.courseId.toString() === courseId.toString()
    );

    if (!courseProgress) {
      user.courses.push({
        courseId,
        enrolledAt: completedAt,
        lastAccessedAt: completedAt,
        currentUnit: 1,
        currentLesson: 1,
        isCompleted: false,
        progress: {
          totalXP: 0,
          lessonsCompleted: 0,
          unitsCompleted: 0,
          averageAccuracy: 0,
          timeSpent: 0,
          streakDays: 0
        }
      });
      courseProgress = user.courses[user.courses.length - 1];
    }

    // Update or insert lesson progress
    const existingProgress = user.lessonProgress.find(
      (progress) => progress.lessonId.toString() === lessonId
    );

    const wasCompleted = existingProgress && existingProgress.status === 'completed';

    if (existingProgress) {
      existingProgress.attempts += 1;
      existingProgress.accuracy = accuracy;
      existingProgress.bestAccuracy = Math.max(existingProgress.bestAccuracy || 0, accuracy);
      existingProgress.xpEarned += finalXp;
      existingProgress.lastAttemptAt = completedAt;
      existingProgress.status = 'completed';
      existingProgress.completedAt = completedAt;
    } else {
      user.lessonProgress.push({
        lessonId,
        courseId,
        unitId,
        status: 'completed',
        attempts: 1,
        accuracy,
        bestAccuracy: accuracy,
        xpEarned: finalXp,
        lastAttemptAt: completedAt,
        completedAt
      });
    }

    // Update course progress metrics based on completed lessons
    const completedLessons = user.lessonProgress.filter(
      (progress) =>
        progress.courseId.toString() === courseId.toString() &&
        progress.status === 'completed'
    );

    courseProgress.progress.lessonsCompleted = completedLessons.length;
    courseProgress.progress.totalXP = completedLessons.reduce((total, progress) => total + (progress.xpEarned || 0), 0);
    courseProgress.progress.timeSpent += timeSpent;

    const accuracyTotal = completedLessons.reduce((total, progress) => total + (progress.accuracy || 0), 0);
    courseProgress.progress.averageAccuracy = completedLessons.length ? accuracyTotal / completedLessons.length : 0;
    courseProgress.lastAccessedAt = completedAt;

    // Update units completed based on lesson completion
    const unitLessonCounts = await Lesson.find({ courseId, isPublished: true }).select('unitId').lean();
    const totalLessonsByUnit = unitLessonCounts.reduce((acc, item) => {
      acc[item.unitId] = (acc[item.unitId] || 0) + 1;
      return acc;
    }, {});

    const completedLessonsByUnit = completedLessons.reduce((acc, item) => {
      acc[item.unitId] = (acc[item.unitId] || 0) + 1;
      return acc;
    }, {});

    const unitsCompleted = Object.keys(totalLessonsByUnit).filter((unitKey) => {
      return completedLessonsByUnit[unitKey] === totalLessonsByUnit[unitKey];
    });

    courseProgress.progress.unitsCompleted = unitsCompleted.length;

    // Review tracking from question details
    if (Array.isArray(questionDetails)) {
      questionDetails.forEach((detail) => {
        if (!detail || !detail.questionId || !detail.prompt || !detail.correctAnswer) {
          return;
        }

        const itemId = detail.questionId;
        const prompt = detail.prompt;
        const correctAnswer = normalizeReviewAnswer(detail.correctAnswer);
        const userAnswer = normalizeReviewAnswer(detail.userAnswer);
        const wasCorrect = Boolean(detail.isCorrect);
        const type = detail.type || 'text';

        let existingItem = user.reviewItems.find(
          (item) => item.itemId === itemId && item.lessonId.toString() === lessonId
        );

        if (!existingItem) {
          if (!wasCorrect) {
            user.reviewItems.push({
              itemId,
              lessonId,
              prompt,
              correctAnswer,
              userAnswer,
              type,
              ease: 2.3,
              intervalDays: 0,
              repetitions: 0,
              nextReviewAt: new Date(),
              lastReviewedAt: null,
              lastResult: 'incorrect'
            });
          }
          return;
        }

        existingItem.userAnswer = userAnswer;
        scheduleReview(existingItem, wasCorrect);
      });
    }

    const unlockedAchievements = [];
    let achievementGems = 0;

    const firstLessonAchievement = {
      id: 'first_lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'Trophy',
      category: 'lessons',
      rarity: 'common',
      xpReward: 50,
      gemReward: 25,
      maxProgress: 1
    };

    if (completedLessons.length >= 1) {
      const unlocked = upsertAchievement(user, firstLessonAchievement, 1, true, completedAt);
      if (unlocked) {
        unlockedAchievements.push(unlocked);
        achievementGems += unlocked.gemReward || 0;
      }
    }

    // Add XP and gems to user
    user.totalXP = (user.totalXP || 0) + finalXp;
    const baseGems = Math.max(1, Math.round(baseXp * GEM_REWARD_RATIO));
    const gemsEarned = accuracy === 100 ? baseGems + PERFECT_ACCURACY_BONUS : baseGems;
    user.gems = (user.gems || 0) + gemsEarned;

    // Update user streak
    const streakUpdate = await user.updateStreak();

    const streakValue = user.currentStreak || 0;
    STREAK_ACHIEVEMENTS.forEach((achievement) => {
      const progressValue = Math.min(streakValue, achievement.maxProgress);
      const unlocked = upsertAchievement(
        user,
        achievement,
        progressValue,
        streakValue >= achievement.maxProgress,
        completedAt
      );
      if (unlocked) {
        unlockedAchievements.push(unlocked);
        achievementGems += unlocked.gemReward || 0;
      }
    });

    const dailyProgress = user.dailyLessonCount || 0;
    const dailyUnlocked = upsertAchievement(
      user,
      DAILY_QUEST_ACHIEVEMENT,
      Math.min(dailyProgress, DAILY_QUEST_ACHIEVEMENT.maxProgress),
      dailyProgress >= DAILY_QUEST_ACHIEVEMENT.maxProgress,
      completedAt
    );
    if (dailyUnlocked) {
      unlockedAchievements.push(dailyUnlocked);
      achievementGems += dailyUnlocked.gemReward || 0;
    }

    if (achievementGems > 0) {
      user.gems = (user.gems || 0) + achievementGems;
    }

    const dailyQuestRewards = applyDailyQuestRewards(user, completedAt);
    if (dailyQuestRewards.rewardGems > 0) {
      user.gems = (user.gems || 0) + dailyQuestRewards.rewardGems;
    }

    let doubleOrNothingResult = null;
    if (user.doubleOrNothing && user.doubleOrNothing.active) {
      if (streakUpdate?.streakBroken) {
        user.gems = 0;
        user.doubleOrNothing.active = false;
        user.doubleOrNothing.lastResult = 'lost';
        doubleOrNothingResult = {
          status: 'lost'
        };
      } else if (user.currentStreak >= (user.doubleOrNothing.targetStreak || 0)) {
        const bonus = user.doubleOrNothing.startGems || 0;
        user.gems = (user.gems || 0) + bonus;
        user.doubleOrNothing.active = false;
        user.doubleOrNothing.lastResult = 'won';
        doubleOrNothingResult = {
          status: 'won',
          bonus
        };
      }
    }

    const unlockedAchievement = unlockedAchievements.length
      ? unlockedAchievements[unlockedAchievements.length - 1]
      : null;

    // Update lesson completion stats
    await lesson.addCompletion(accuracy, timeSpent);

    // Update user's last active time
    await user.updateLastActive();

    await user.save();

    res.json({
      success: true,
      message: 'Lesson completion recorded successfully',
      user: {
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        gems: user.gems,
        hearts: user.hearts,
        maxHearts: user.maxHearts,
        xpBoosts: user.xpBoosts,
        streakFreezes: user.streakFreezes,
        streakShieldUntil: user.streakShieldUntil,
        unlimitedHeartsUntil: user.unlimitedHeartsUntil,
        doubleOrNothing: user.doubleOrNothing
      },
      rewards: {
        gemsEarned: gemsEarned + achievementGems + dailyQuestRewards.rewardGems,
        xpEarned: finalXp,
        achievementGems,
        questGems: dailyQuestRewards.rewardGems,
        completedQuests: dailyQuestRewards.completed,
        xpBoostApplied
      },
      doubleOrNothing: doubleOrNothingResult,
      unlockedAchievement,
      lesson: {
        completionCount: lesson.completionCount,
        averageAccuracy: lesson.averageAccuracy
      },
      session: {
        accuracy,
        timeSpent,
        xpEarned: finalXp,
        questionsAnswered: questions.length,
        wasCompleted
      }
    });

  } catch (error) {
    console.error('Record lesson completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/progress/practice-complete
// @desc    Record practice session completion
// @access  Private
router.post('/practice-complete', auth, [
  body('practiceType')
    .isIn(['hanzi', 'pinyin'])
    .withMessage('Practice type must be hanzi or pinyin'),
  body('mode')
    .isString()
    .notEmpty()
    .withMessage('Practice mode is required'),
  body('totalExercises')
    .isInt({ min: 1 })
    .withMessage('Total exercises must be at least 1'),
  body('correctAnswers')
    .isInt({ min: 0 })
    .withMessage('Correct answers must be a non-negative integer'),
  body('accuracy')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Accuracy must be between 0 and 100'),
  body('timeSpent')
    .isInt({ min: 1 })
    .withMessage('Time spent must be a positive integer')
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

    const { practiceType, mode, totalExercises, correctAnswers, accuracy, timeSpent } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (typeof user.gems !== 'number') {
      user.gems = 1000;
    }
    if (typeof user.maxHearts !== 'number') {
      user.maxHearts = 5;
    }
    if (typeof user.hearts !== 'number') {
      user.hearts = user.maxHearts || 5;
    }

    const completedAt = new Date();
    ensureDailyStats(user, completedAt);
    if (typeof user.dailyStudySeconds !== 'number') {
      user.dailyStudySeconds = 0;
    }
    user.dailyStudySeconds += timeSpent;

    user.practiceSessions.push({
      practiceType,
      mode,
      totalExercises,
      correctAnswers,
      accuracy,
      timeSpent,
      completedAt
    });

    const dailyQuestRewards = applyDailyQuestRewards(user, completedAt);
    if (dailyQuestRewards.rewardGems > 0) {
      user.gems = (user.gems || 0) + dailyQuestRewards.rewardGems;
    }

    await user.updateLastActive();
    await user.save();

    res.json({
      success: true,
      message: 'Practice session recorded successfully',
      rewards: {
        questGems: dailyQuestRewards.rewardGems,
        completedQuests: dailyQuestRewards.completed
      }
    });
  } catch (error) {
    console.error('Record practice completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/progress/path
// @desc    Get course path with lesson progress for logged-in user
// @access  Private
router.get('/path', auth, async (req, res) => {
  try {
    const { courseId, language } = req.query;

    const courseQuery = { isPublished: true };
    if (courseId) {
      courseQuery._id = courseId;
    }
    if (language) {
      courseQuery['language.code'] = language;
    }

    let course = await Course.findOne(courseQuery);
    if (!course && process.env.NODE_ENV === 'development') {
      try {
        const { seedChineseCourse } = require('../scripts/seedChineseCourse');
        await seedChineseCourse();
        course = await Course.findOne(courseQuery);
      } catch (seedError) {
        console.error('Seed fallback error:', seedError);
      }
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found. Seed the Chinese course to get started.'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let enrollment = user.courses.find(
      (item) => item.courseId.toString() === course._id.toString()
    );

    if (!enrollment) {
      user.courses.push({
        courseId: course._id,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        currentUnit: 1,
        currentLesson: 1,
        isCompleted: false,
        progress: {
          totalXP: 0,
          lessonsCompleted: 0,
          unitsCompleted: 0,
          averageAccuracy: 0,
          timeSpent: 0,
          streakDays: 0
        }
      });
      enrollment = user.courses[user.courses.length - 1];
      await user.save();
    }

    const lessons = await Lesson.find({ courseId: course._id, isPublished: true }).sort({ order: 1 }).lean();
    const lessonsByUnit = lessons.reduce((acc, lesson) => {
      if (!acc[lesson.unitId]) {
        acc[lesson.unitId] = [];
      }
      acc[lesson.unitId].push(lesson);
      return acc;
    }, {});

    const completedLessonIds = new Set(
      (user.lessonProgress || [])
        .filter((progress) => progress.status === 'completed')
        .map((progress) => progress.lessonId.toString())
    );

    let unlockNext = true;
    let currentAssigned = false;

    const units = [...course.units]
      .sort((a, b) => a.order - b.order)
      .map((unit) => {
        const unitLessons = (lessonsByUnit[unit._id.toString()] || []).sort((a, b) => a.order - b.order);

        const levels = unitLessons.map((lesson) => {
          const completed = completedLessonIds.has(lesson._id.toString());
          const current = !completed && unlockNext && !currentAssigned;
          const locked = !completed && !unlockNext;

          if (current) {
            currentAssigned = true;
          }

          if (!completed) {
            unlockNext = false;
          }

          return {
            id: lesson._id.toString(),
            order: lesson.order,
            title: lesson.title,
            description: lesson.description,
            completed,
            locked,
            current
          };
        });

        return {
          id: unit._id.toString(),
          title: unit.title,
          description: unit.description,
          order: unit.order,
          levels
        };
      });

    res.json({
      success: true,
      course: {
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        language: course.language
      },
      sections: [
        {
          id: 1,
          title: course.title,
          description: course.description,
          units
        }
      ],
      progress: enrollment.progress
    });
  } catch (error) {
    console.error('Get progress path error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/progress/stats
// @desc    Get user progress statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate additional stats
    const totalLessonsCompleted = user.courses.reduce(
      (total, course) => total + course.progress.lessonsCompleted, 0
    );

    const totalTimeSpent = user.courses.reduce(
      (total, course) => total + course.progress.timeSpent, 0
    );

    const averageAccuracy = user.courses.length > 0 
      ? user.courses.reduce(
          (total, course) => total + course.progress.averageAccuracy, 0
        ) / user.courses.length
      : 0;

    const stats = {
      totalXP: user.totalXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalLessonsCompleted,
      totalTimeSpent, // in seconds
      averageAccuracy,
      coursesEnrolled: user.courses.length,
      achievementsUnlocked: user.achievements.filter(a => a.unlockedAt).length,
      joinedAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/progress/daily-stats
// @desc    Get daily progress stats for the user
// @access  Private
router.get('/daily-stats', auth, async (req, res) => {
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
      daily: {
        lessonsCompleted: user.dailyLessonCount || 0,
        xpEarned: user.dailyXP || 0,
        timeStudiedSeconds: user.dailyStudySeconds || 0
      }
    });
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/progress/review-queue
// @desc    Get due review items for the user
// @access  Private
router.get('/review-queue', auth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const now = new Date();
    const dueList = (user.reviewItems || [])
      .filter((item) => item.nextReviewAt && item.nextReviewAt <= now)
      .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
    const dueItems = dueList.slice(0, limit);

    res.json({
      success: true,
      items: dueItems.map((item) => ({
        itemId: item.itemId,
        lessonId: item.lessonId,
        prompt: item.prompt,
        correctAnswer: item.correctAnswer,
        type: item.type,
        nextReviewAt: item.nextReviewAt,
        lastResult: item.lastResult
      })),
      totalDue: dueList.length
    });
  } catch (error) {
    console.error('Get review queue error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/progress/review-complete
// @desc    Record review result and reschedule
// @access  Private
router.post('/review-complete', auth, [
  body('itemId')
    .notEmpty()
    .withMessage('Review item ID is required'),
  body('lessonId')
    .notEmpty()
    .withMessage('Lesson ID is required'),
  body('userAnswer')
    .optional()
    .isString()
    .withMessage('User answer must be a string'),
  body('isCorrect')
    .isBoolean()
    .withMessage('Correct flag is required')
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

    const { itemId, lessonId, userAnswer, isCorrect } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const reviewItem = user.reviewItems.find(
      (item) => item.itemId === itemId && item.lessonId.toString() === lessonId
    );

    if (!reviewItem) {
      return res.status(404).json({
        success: false,
        message: 'Review item not found'
      });
    }

    reviewItem.userAnswer = normalizeReviewAnswer(userAnswer);
    scheduleReview(reviewItem, Boolean(isCorrect));
    await user.updateLastActive();
    await user.save();

    res.json({
      success: true,
      nextReviewAt: reviewItem.nextReviewAt,
      intervalDays: reviewItem.intervalDays,
      repetitions: reviewItem.repetitions,
      ease: reviewItem.ease
    });
  } catch (error) {
    console.error('Review completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/progress/enroll-course
// @desc    Enroll user in a course
// @access  Private
router.post('/enroll-course', auth, [
  body('courseId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid course ID is required')
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

    const { courseId } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = user.courses.find(
      course => course.courseId.toString() === courseId
    );

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add course enrollment
    user.courses.push({
      courseId,
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
      currentUnit: 1,
      currentLesson: 1,
      isCompleted: false,
      progress: {
        totalXP: 0,
        lessonsCompleted: 0,
        unitsCompleted: 0,
        averageAccuracy: 0,
        timeSpent: 0,
        streakDays: 0
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: user.courses[user.courses.length - 1]
    });

  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/progress/courses
// @desc    Get user's enrolled courses with progress
// @access  Private
router.get('/courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('courses.courseId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      courses: user.courses
    });

  } catch (error) {
    console.error('Get user courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
