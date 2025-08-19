const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const { auth } = require('../middleware/auth');

const router = express.Router();

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

    const { lessonId, accuracy, timeSpent, xpEarned, questions } = req.body;

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

    // Add XP to user
    await user.addXP(xpEarned);

    // Update user streak
    await user.updateStreak();

    // Update lesson completion stats
    await lesson.addCompletion(accuracy, timeSpent);

    // Update user's last active time
    await user.updateLastActive();

    res.json({
      success: true,
      message: 'Lesson completion recorded successfully',
      user: {
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      },
      lesson: {
        completionCount: lesson.completionCount,
        averageAccuracy: lesson.averageAccuracy
      },
      session: {
        accuracy,
        timeSpent,
        xpEarned,
        questionsAnswered: questions.length
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
