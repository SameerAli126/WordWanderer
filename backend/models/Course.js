const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 5
  },
  name: {
    type: String,
    required: true
  },
  nativeName: {
    type: String,
    required: true
  },
  flag: {
    type: String,
    required: true
  }
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  prerequisites: [{
    type: String
  }]
});

const unitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  skillId: {
    type: String,
    required: true
  },
  requiredXP: {
    type: Number,
    default: 0
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [500, 'Course description must be less than 500 characters']
  },
  language: {
    type: languageSchema,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  estimatedDuration: {
    type: String,
    required: true // e.g., "3 months", "6 weeks"
  },
  image: {
    type: String,
    default: null
  },
  skills: [skillSchema],
  units: [unitSchema],
  totalLessons: {
    type: Number,
    default: 0
  },
  totalUnits: {
    type: Number,
    default: 0
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for performance
courseSchema.index({ 'language.code': 1 });
courseSchema.index({ difficulty: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ enrolledStudents: -1 });
courseSchema.index({ createdAt: -1 });

// Update total counts before saving
courseSchema.pre('save', function(next) {
  this.totalUnits = this.units.length;
  this.totalLessons = this.units.reduce((total, unit) => total + unit.lessons.length, 0);
  next();
});

// Virtual for course URL
courseSchema.virtual('url').get(function() {
  return `/courses/${this._id}`;
});

// Method to add a student enrollment
courseSchema.methods.addEnrollment = function() {
  this.enrolledStudents += 1;
  return this.save();
};

// Method to remove a student enrollment
courseSchema.methods.removeEnrollment = function() {
  if (this.enrolledStudents > 0) {
    this.enrolledStudents -= 1;
  }
  return this.save();
};

// Method to update rating
courseSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating * this.ratingCount + newRating;
  this.ratingCount += 1;
  this.rating = totalRating / this.ratingCount;
  return this.save();
};

// Static method to get popular courses
courseSchema.statics.getPopularCourses = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ enrolledStudents: -1, rating: -1 })
    .limit(limit);
};

// Static method to get courses by difficulty
courseSchema.statics.getCoursesByDifficulty = function(difficulty) {
  return this.find({ 
    isPublished: true, 
    difficulty: difficulty 
  }).sort({ rating: -1, enrolledStudents: -1 });
};

// Static method to search courses
courseSchema.statics.searchCourses = function(query) {
  return this.find({
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'language.name': { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }).sort({ rating: -1, enrolledStudents: -1 });
};

module.exports = mongoose.model('Course', courseSchema);
