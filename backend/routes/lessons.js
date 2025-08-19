const express = require('express');
const { query, validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get lessons by course
// @access  Public
router.get('/', [
  query('courseId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid course ID is required'),
  query('unitId')
    .optional()
    .isString()
    .withMessage('Unit ID must be a string')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { courseId, unitId } = req.query;

    let lessons;
    if (unitId) {
      lessons = await Lesson.getLessonsByUnit(courseId, unitId);
    } else {
      lessons = await Lesson.getLessonsByCourse(courseId);
    }

    res.json({
      success: true,
      lessons,
      courseId,
      unitId
    });

  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get lesson by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    if (!lesson.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not available'
      });
    }

    res.json({
      success: true,
      lesson
    });

  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/lessons/:id/next
// @desc    Get next lesson
// @access  Public
router.get('/:id/next', async (req, res) => {
  try {
    const currentLesson = await Lesson.findById(req.params.id);

    if (!currentLesson) {
      return res.status(404).json({
        success: false,
        message: 'Current lesson not found'
      });
    }

    const nextLesson = await Lesson.getNextLesson(
      currentLesson.courseId, 
      currentLesson.order
    );

    if (!nextLesson) {
      return res.status(404).json({
        success: false,
        message: 'No next lesson found'
      });
    }

    res.json({
      success: true,
      lesson: nextLesson
    });

  } catch (error) {
    console.error('Get next lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/lessons/:id/previous
// @desc    Get previous lesson
// @access  Public
router.get('/:id/previous', async (req, res) => {
  try {
    const currentLesson = await Lesson.findById(req.params.id);

    if (!currentLesson) {
      return res.status(404).json({
        success: false,
        message: 'Current lesson not found'
      });
    }

    const previousLesson = await Lesson.getPreviousLesson(
      currentLesson.courseId, 
      currentLesson.order
    );

    if (!previousLesson) {
      return res.status(404).json({
        success: false,
        message: 'No previous lesson found'
      });
    }

    res.json({
      success: true,
      lesson: previousLesson
    });

  } catch (error) {
    console.error('Get previous lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
