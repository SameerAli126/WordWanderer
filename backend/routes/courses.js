const express = require('express');
const { query, validationResult } = require('express-validator');
const Course = require('../models/Course');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', [
  query('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  query('language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be 2-5 characters'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be 1-100 characters'),
  query('sort')
    .optional()
    .isIn(['popular', 'rating', 'newest', 'alphabetical'])
    .withMessage('Sort must be popular, rating, newest, or alphabetical'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
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

    const {
      difficulty,
      language,
      search,
      sort = 'popular',
      limit = 12,
      page = 1
    } = req.query;

    // Build query
    let query = { isPublished: true };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (language) {
      query['language.code'] = language;
    }

    // Handle search
    let courses;
    if (search) {
      courses = await Course.searchCourses(search);
    } else {
      courses = Course.find(query);
    }

    // Handle sorting
    switch (sort) {
      case 'popular':
        courses = courses.sort({ enrolledStudents: -1, rating: -1 });
        break;
      case 'rating':
        courses = courses.sort({ rating: -1, ratingCount: -1 });
        break;
      case 'newest':
        courses = courses.sort({ createdAt: -1 });
        break;
      case 'alphabetical':
        courses = courses.sort({ title: 1 });
        break;
      default:
        courses = courses.sort({ enrolledStudents: -1 });
    }

    // Pagination
    const skip = (page - 1) * limit;
    courses = courses.skip(skip).limit(parseInt(limit));

    const results = await courses;
    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      courses: results,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      },
      filters: {
        difficulty,
        language,
        search,
        sort
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/courses/popular
// @desc    Get popular courses
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const courses = await Course.getPopularCourses(parseInt(limit));

    res.json({
      success: true,
      courses
    });

  } catch (error) {
    console.error('Get popular courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Course not available'
      });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/courses/language/:code
// @desc    Get courses by language
// @access  Public
router.get('/language/:code', [
  query('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced')
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

    const { code } = req.params;
    const { difficulty } = req.query;

    let query = { 
      'language.code': code, 
      isPublished: true 
    };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const courses = await Course.find(query)
      .sort({ rating: -1, enrolledStudents: -1 });

    res.json({
      success: true,
      courses,
      language: code,
      difficulty
    });

  } catch (error) {
    console.error('Get courses by language error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
