const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
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

    const courseId = lesson.courseId;
    const unitId = lesson.unitId;
    const completedAt = new Date();

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
      existingProgress.xpEarned += xpEarned;
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
        xpEarned,
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

    // Add XP to user
    await user.addXP(xpEarned);

    // Update user streak
    await user.updateStreak();

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
