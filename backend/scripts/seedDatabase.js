const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedCourses = async () => {
  try {
    // Clear existing courses
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    
    console.log('Cleared existing courses and lessons');

    // Create admin user for courses
    let adminUser = await User.findOne({ email: 'admin@wordwanderer.com' });
    if (!adminUser) {
      adminUser = new User({
        email: 'admin@wordwanderer.com',
        username: 'admin',
        displayName: 'WordWanderer Admin',
        password: 'admin123'
      });
      await adminUser.save();
      console.log('Created admin user');
    }

    // Sample courses data
    const coursesData = [
      {
        title: 'Spanish for Beginners',
        description: 'Start your Spanish journey with essential vocabulary and basic grammar.',
        language: {
          code: 'es',
          name: 'Spanish',
          nativeName: 'Español',
          flag: '🇪🇸'
        },
        difficulty: 'beginner',
        estimatedDuration: '3 months',
        enrolledStudents: 125000,
        rating: 4.8,
        ratingCount: 15420,
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        tags: ['beginner', 'vocabulary', 'grammar'],
        skills: [
          {
            name: 'Basic Greetings',
            description: 'Learn how to greet people in Spanish',
            icon: '👋',
            color: '#3B82F6',
            order: 1,
            prerequisites: []
          },
          {
            name: 'Family & People',
            description: 'Vocabulary about family members and people',
            icon: '👨‍👩‍👧‍👦',
            color: '#10B981',
            order: 2,
            prerequisites: ['Basic Greetings']
          }
        ],
        units: [
          {
            title: 'Introduction to Spanish',
            description: 'Basic greetings and introductions',
            order: 1,
            skillId: 'Basic Greetings',
            requiredXP: 0,
            lessons: []
          }
        ]
      },
      {
        title: 'French Fundamentals',
        description: 'Master French basics with pronunciation and essential phrases.',
        language: {
          code: 'fr',
          name: 'French',
          nativeName: 'Français',
          flag: '🇫🇷'
        },
        difficulty: 'beginner',
        estimatedDuration: '4 months',
        enrolledStudents: 89000,
        rating: 4.7,
        ratingCount: 12100,
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        tags: ['beginner', 'pronunciation', 'phrases'],
        skills: [
          {
            name: 'Basic Phrases',
            description: 'Essential French phrases for beginners',
            icon: '💬',
            color: '#8B5CF6',
            order: 1,
            prerequisites: []
          }
        ],
        units: [
          {
            title: 'Getting Started with French',
            description: 'Basic phrases and pronunciation',
            order: 1,
            skillId: 'Basic Phrases',
            requiredXP: 0,
            lessons: []
          }
        ]
      },
      {
        title: 'German Basics',
        description: 'Learn German fundamentals including der, die, das and essential vocabulary.',
        language: {
          code: 'de',
          name: 'German',
          nativeName: 'Deutsch',
          flag: '🇩🇪'
        },
        difficulty: 'beginner',
        estimatedDuration: '3.5 months',
        enrolledStudents: 67000,
        rating: 4.6,
        ratingCount: 8900,
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        tags: ['beginner', 'articles', 'vocabulary'],
        skills: [
          {
            name: 'Articles & Gender',
            description: 'Learn der, die, das and noun genders',
            icon: '📝',
            color: '#F59E0B',
            order: 1,
            prerequisites: []
          }
        ],
        units: [
          {
            title: 'German Articles',
            description: 'Understanding der, die, das',
            order: 1,
            skillId: 'Articles & Gender',
            requiredXP: 0,
            lessons: []
          }
        ]
      }
    ];

    // Create courses
    const createdCourses = await Course.insertMany(coursesData);
    console.log(`Created ${createdCourses.length} courses`);

    // Create sample lessons for Spanish course
    const spanishCourse = createdCourses.find(c => c.language.code === 'es');
    
    const spanishLessons = [
      {
        title: 'Basic Greetings',
        description: 'Learn how to say hello and goodbye in Spanish',
        type: 'vocabulary',
        courseId: spanishCourse._id,
        unitId: spanishCourse.units[0]._id.toString(),
        order: 1,
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'How do you say "Hello" in Spanish?',
            content: {
              options: ['Hola', 'Adiós', 'Gracias', 'Por favor']
            },
            correctAnswer: 'Hola',
            explanation: 'Hola is the most common way to say hello in Spanish.',
            hints: ['Think about the most common greeting you hear in Spanish movies.'],
            xpReward: 10,
            difficulty: 'easy',
            order: 1
          },
          {
            type: 'translation',
            prompt: 'Translate to English:',
            content: {
              text: 'Buenos días'
            },
            correctAnswer: 'Good morning',
            explanation: 'Buenos días is used to greet someone in the morning.',
            hints: ['This greeting is used in the morning.'],
            xpReward: 15,
            difficulty: 'medium',
            order: 2
          },
          {
            type: 'multiple-choice',
            prompt: 'Which means "Goodbye"?',
            content: {
              options: ['Hola', 'Adiós', 'Gracias', 'De nada']
            },
            correctAnswer: 'Adiós',
            explanation: 'Adiós is how you say goodbye in Spanish.',
            hints: ['This is used when leaving or ending a conversation.'],
            xpReward: 10,
            difficulty: 'easy',
            order: 3
          }
        ]
      },
      {
        title: 'Polite Expressions',
        description: 'Learn please, thank you, and other polite expressions',
        type: 'vocabulary',
        courseId: spanishCourse._id,
        unitId: spanishCourse.units[0]._id.toString(),
        order: 2,
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'How do you say "Thank you" in Spanish?',
            content: {
              options: ['Por favor', 'Gracias', 'De nada', 'Perdón']
            },
            correctAnswer: 'Gracias',
            explanation: 'Gracias is how you say thank you in Spanish.',
            hints: ['This is one of the most important polite expressions.'],
            xpReward: 10,
            difficulty: 'easy',
            order: 1
          },
          {
            type: 'translation',
            prompt: 'Translate to Spanish:',
            content: {
              text: 'Please'
            },
            correctAnswer: 'Por favor',
            explanation: 'Por favor means please in Spanish.',
            hints: ['This is used when making a polite request.'],
            xpReward: 15,
            difficulty: 'medium',
            order: 2
          }
        ]
      }
    ];

    const createdLessons = await Lesson.insertMany(spanishLessons);
    console.log(`Created ${createdLessons.length} lessons`);

    // Update course with lesson references
    spanishCourse.units[0].lessons = createdLessons.map(lesson => lesson._id);
    await spanishCourse.save();

    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedCourses();
  await mongoose.connection.close();
  console.log('Seeding completed and connection closed.');
};

// Run if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedCourses };
