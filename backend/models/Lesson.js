const mongoose = require('mongoose');

const questionContentSchema = new mongoose.Schema({
  text: {
    type: String,
    default: null
  },
  audio: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  options: [{
    type: String
  }],
  blanks: [{
    type: String
  }],
  pairs: [{
    left: String,
    right: String
  }],
  items: [{
    type: String
  }]
});

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple-choice', 'fill-in-blank', 'translation', 'listening', 'speaking', 'matching', 'ordering', 'true-false'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  content: {
    type: questionContentSchema,
    required: true
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string or array
    required: true
  },
  explanation: {
    type: String,
    default: null
  },
  hints: [{
    type: String
  }],
  timeLimit: {
    type: Number,
    default: null // in seconds
  },
  xpReward: {
    type: Number,
    default: 10,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  order: {
    type: Number,
    required: true
  }
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Lesson title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    trim: true,
    maxlength: [300, 'Lesson description must be less than 300 characters']
  },
  type: {
    type: String,
    enum: ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing', 'story', 'review'],
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
  order: {
    type: Number,
    required: true
  },
  xpReward: {
    type: Number,
    default: 50,
    min: 10
  },
  timeEstimate: {
    type: Number,
    default: 10, // in minutes
    min: 1
  },
  questions: [questionSchema],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  completionCount: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageTimeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ unitId: 1, order: 1 });
lessonSchema.index({ type: 1 });
lessonSchema.index({ difficulty: 1 });
lessonSchema.index({ isPublished: 1 });

// Virtual for total questions
lessonSchema.virtual('totalQuestions').get(function() {
  return this.questions.length;
});

// Virtual for estimated XP
lessonSchema.virtual('estimatedXP').get(function() {
  return this.questions.reduce((total, question) => total + question.xpReward, 0);
});

// Update XP reward based on questions before saving
lessonSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.xpReward = this.questions.reduce((total, question) => total + question.xpReward, 0);
  }
  next();
});

// Method to add completion
lessonSchema.methods.addCompletion = function(accuracy, timeSpent) {
  this.completionCount += 1;
  
  // Update average accuracy
  const totalAccuracy = this.averageAccuracy * (this.completionCount - 1) + accuracy;
  this.averageAccuracy = totalAccuracy / this.completionCount;
  
  // Update average time spent
  const totalTime = this.averageTimeSpent * (this.completionCount - 1) + timeSpent;
  this.averageTimeSpent = totalTime / this.completionCount;
  
  return this.save();
};

// Static method to get lessons by course
lessonSchema.statics.getLessonsByCourse = function(courseId) {
  return this.find({ 
    courseId: courseId, 
    isPublished: true 
  }).sort({ order: 1 });
};

// Static method to get lessons by unit
lessonSchema.statics.getLessonsByUnit = function(courseId, unitId) {
  return this.find({ 
    courseId: courseId, 
    unitId: unitId, 
    isPublished: true 
  }).sort({ order: 1 });
};

// Static method to get next lesson
lessonSchema.statics.getNextLesson = function(courseId, currentOrder) {
  return this.findOne({ 
    courseId: courseId, 
    order: { $gt: currentOrder }, 
    isPublished: true 
  }).sort({ order: 1 });
};

// Static method to get previous lesson
lessonSchema.statics.getPreviousLesson = function(courseId, currentOrder) {
  return this.findOne({ 
    courseId: courseId, 
    order: { $lt: currentOrder }, 
    isPublished: true 
  }).sort({ order: -1 });
};

module.exports = mongoose.model('Lesson', lessonSchema);
