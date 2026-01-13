const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Chinese course seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedChineseCourse = async () => {
  try {
    console.log('Starting Chinese course seeding...');

    const existingCourse = await Course.findOne({ title: 'Chinese for Beginners' });
    if (existingCourse) {
      console.log('Chinese course already exists. Skipping seeding.');
      return;
    }

    // Get admin user
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

    // Create Chinese course
    const chineseCourse = new Course({
      title: 'Chinese for Beginners',
      description: 'Start your Mandarin Chinese journey with essential characters, pinyin, and basic conversations.',
      language: {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        flag: '🇨🇳'
      },
      difficulty: 'beginner',
      estimatedDuration: '4 months',
      enrolledStudents: 45000,
      rating: 4.9,
      ratingCount: 6800,
      isPublished: true,
      publishedAt: new Date(),
      createdBy: adminUser._id,
      tags: ['beginner', 'mandarin', 'characters', 'pinyin'],
      skills: [
        {
          name: 'Basic Greetings',
          description: 'Learn essential Chinese greetings and polite expressions',
          icon: '👋',
          color: '#DC2626',
          order: 1,
          prerequisites: []
        },
        {
          name: 'Numbers & Time',
          description: 'Master Chinese numbers and time expressions',
          icon: '🔢',
          color: '#7C3AED',
          order: 2,
          prerequisites: ['Basic Greetings']
        },
        {
          name: 'Family & People',
          description: 'Vocabulary about family members and relationships',
          icon: '👨‍👩‍👧‍👦',
          color: '#059669',
          order: 3,
          prerequisites: ['Basic Greetings']
        },
        {
          name: 'Food & Dining',
          description: 'Essential vocabulary for ordering food and dining',
          icon: '🍜',
          color: '#EA580C',
          order: 4,
          prerequisites: ['Numbers & Time']
        }
      ],
      units: [
        {
          title: 'Getting Started',
          description: 'Basic greetings and introductions in Chinese',
          order: 1,
          skillId: 'Basic Greetings',
          requiredXP: 0,
          lessons: []
        },
        {
          title: 'Numbers and Time',
          description: 'Learn to count and tell time in Chinese',
          order: 2,
          skillId: 'Numbers & Time',
          requiredXP: 50,
          lessons: []
        },
        {
          title: 'Family Relations',
          description: 'Talk about family members and relationships',
          order: 3,
          skillId: 'Family & People',
          requiredXP: 100,
          lessons: []
        }
      ]
    });

    await chineseCourse.save();
    console.log('Created Chinese course');

    // Create comprehensive Chinese lessons
    const chineseLessons = [
      // Unit 1: Getting Started
      {
        title: 'Basic Greetings',
        description: 'Learn how to say hello, goodbye, and thank you in Chinese',
        type: 'vocabulary',
        courseId: chineseCourse._id,
        unitId: chineseCourse.units[0]._id.toString(),
        order: 1,
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'How do you say "Hello" in Chinese?',
            content: {
              text: 'Choose the correct Chinese greeting:',
              options: ['你好 (nǐ hǎo)', '再见 (zài jiàn)', '谢谢 (xiè xiè)', '不客气 (bù kè qì)']
            },
            correctAnswer: '你好 (nǐ hǎo)',
            explanation: '你好 (nǐ hǎo) is the most common way to say hello in Chinese. 你 means "you" and 好 means "good".',
            hints: ['This greeting literally means "you good" in Chinese.'],
            xpReward: 15,
            difficulty: 'easy',
            order: 1
          },
          {
            type: 'translation',
            prompt: 'Translate to English:',
            content: {
              text: '谢谢 (xiè xiè)'
            },
            correctAnswer: 'Thank you',
            explanation: '谢谢 (xiè xiè) means "thank you" in Chinese. It\'s one of the most important polite expressions.',
            hints: ['This is a polite expression used to show gratitude.'],
            xpReward: 15,
            difficulty: 'easy',
            order: 2
          },
          {
            type: 'multiple-choice',
            prompt: 'Which means "Goodbye" in Chinese?',
            content: {
              options: ['你好 (nǐ hǎo)', '再见 (zài jiàn)', '早上好 (zǎo shàng hǎo)', '晚安 (wǎn ān)']
            },
            correctAnswer: '再见 (zài jiàn)',
            explanation: '再见 (zài jiàn) means goodbye. 再 means "again" and 见 means "see", so it literally means "see again".',
            hints: ['This farewell literally means "see again".'],
            xpReward: 15,
            difficulty: 'easy',
            order: 3
          },
          {
            type: 'fill-in-blank',
            prompt: 'Complete the polite response:',
            content: {
              text: 'A: 谢谢! (Thank you!) B: _____ (You\'re welcome!)'
            },
            correctAnswer: '不客气',
            explanation: '不客气 (bù kè qì) means "you\'re welcome" or "don\'t be polite". It\'s the standard response to "thank you".',
            hints: ['This response literally means "don\'t be polite".'],
            xpReward: 20,
            difficulty: 'medium',
            order: 4
          }
        ]
      },
      {
        title: 'Time of Day Greetings',
        description: 'Learn morning, afternoon, and evening greetings',
        type: 'vocabulary',
        courseId: chineseCourse._id,
        unitId: chineseCourse.units[0]._id.toString(),
        order: 2,
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'How do you say "Good morning" in Chinese?',
            content: {
              options: ['早上好 (zǎo shàng hǎo)', '下午好 (xià wǔ hǎo)', '晚上好 (wǎn shàng hǎo)', '晚安 (wǎn ān)']
            },
            correctAnswer: '早上好 (zǎo shàng hǎo)',
            explanation: '早上好 (zǎo shàng hǎo) means good morning. 早上 means "morning" and 好 means "good".',
            hints: ['早上 means "morning" in Chinese.'],
            xpReward: 15,
            difficulty: 'easy',
            order: 1
          },
          {
            type: 'matching',
            prompt: 'Match the Chinese greetings with their English meanings:',
            content: {
              pairs: [
                { left: '下午好 (xià wǔ hǎo)', right: 'Good afternoon' },
                { left: '晚上好 (wǎn shàng hǎo)', right: 'Good evening' },
                { left: '晚安 (wǎn ān)', right: 'Good night' }
              ]
            },
            correctAnswer: ['下午好 (xià wǔ hǎo):Good afternoon', '晚上好 (wǎn shàng hǎo):Good evening', '晚安 (wǎn ān):Good night'],
            explanation: 'These are time-specific greetings: 下午 (afternoon), 晚上 (evening), and 晚安 (good night for sleeping).',
            hints: ['Think about the different times of day.'],
            xpReward: 25,
            difficulty: 'medium',
            order: 2
          }
        ]
      },
      // Unit 2: Numbers and Time
      {
        title: 'Numbers 1-10',
        description: 'Master the first ten numbers in Chinese',
        type: 'vocabulary',
        courseId: chineseCourse._id,
        unitId: chineseCourse.units[1]._id.toString(),
        order: 1,
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'What is "one" in Chinese?',
            content: {
              options: ['一 (yī)', '二 (èr)', '三 (sān)', '四 (sì)']
            },
            correctAnswer: '一 (yī)',
            explanation: '一 (yī) means "one" in Chinese. It\'s written with a single horizontal stroke.',
            hints: ['This number is written with just one stroke.'],
            xpReward: 10,
            difficulty: 'easy',
            order: 1
          },
          {
            type: 'ordering',
            prompt: 'Put these Chinese numbers in order from 1 to 5:',
            content: {
              items: ['五 (wǔ)', '二 (èr)', '四 (sì)', '一 (yī)', '三 (sān)']
            },
            correctAnswer: ['一 (yī)', '二 (èr)', '三 (sān)', '四 (sì)', '五 (wǔ)'],
            explanation: 'The correct order is: 一 (1), 二 (2), 三 (3), 四 (4), 五 (5).',
            hints: ['Start with the number that has one stroke.'],
            xpReward: 25,
            difficulty: 'medium',
            order: 2
          },
          {
            type: 'translation',
            prompt: 'Translate to Chinese:',
            content: {
              text: 'Eight'
            },
            correctAnswer: '八',
            explanation: '八 (bā) means "eight" in Chinese. The character looks like the number 8 turned sideways.',
            hints: ['This character resembles the Arabic numeral 8.'],
            xpReward: 15,
            difficulty: 'medium',
            order: 3
          }
        ]
      },
      {
        title: 'Telling Time',
        description: 'Learn to ask and tell time in Chinese',
        type: 'grammar',
        courseId: chineseCourse._id,
        unitId: chineseCourse.units[1]._id.toString(),
        order: 2,
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'How do you ask "What time is it?" in Chinese?',
            content: {
              options: ['现在几点? (xiàn zài jǐ diǎn?)', '你好吗? (nǐ hǎo ma?)', '多少钱? (duō shǎo qián?)', '在哪里? (zài nǎ lǐ?)']
            },
            correctAnswer: '现在几点? (xiàn zài jǐ diǎn?)',
            explanation: '现在几点? means "What time is it now?" 现在 means "now" and 几点 means "what time".',
            hints: ['现在 means "now" and 几点 asks about time.'],
            xpReward: 20,
            difficulty: 'medium',
            order: 1
          },
          {
            type: 'fill-in-blank',
            prompt: 'Complete the time expression:',
            content: {
              text: '三___ (3 o\'clock)'
            },
            correctAnswer: '点',
            explanation: '点 (diǎn) is used after numbers to indicate "o\'clock". So 三点 means "3 o\'clock".',
            hints: ['This character is used to mark the hour.'],
            xpReward: 15,
            difficulty: 'medium',
            order: 2
          }
        ]
      },
      // Unit 3: Family Relations
      {
        title: 'Family Members',
        description: 'Learn vocabulary for family members',
        type: 'vocabulary',
        courseId: chineseCourse._id,
        unitId: chineseCourse.units[2]._id.toString(),
        order: 1,
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'How do you say "mother" in Chinese?',
            content: {
              options: ['妈妈 (mā ma)', '爸爸 (bà ba)', '哥哥 (gē ge)', '姐姐 (jiě jie)']
            },
            correctAnswer: '妈妈 (mā ma)',
            explanation: '妈妈 (mā ma) means "mother" or "mom" in Chinese. It\'s one of the first words children learn.',
            hints: ['This word sounds similar to "mama" in English.'],
            xpReward: 15,
            difficulty: 'easy',
            order: 1
          },
          {
            type: 'matching',
            prompt: 'Match the family members:',
            content: {
              pairs: [
                { left: '爸爸 (bà ba)', right: 'Father' },
                { left: '哥哥 (gē ge)', right: 'Older brother' },
                { left: '姐姐 (jiě jie)', right: 'Older sister' },
                { left: '弟弟 (dì di)', right: 'Younger brother' }
              ]
            },
            correctAnswer: ['爸爸 (bà ba):Father', '哥哥 (gē ge):Older brother', '姐姐 (jiě jie):Older sister', '弟弟 (dì di):Younger brother'],
            explanation: 'Chinese has specific terms for older and younger siblings, showing the importance of age hierarchy in Chinese culture.',
            hints: ['Chinese distinguishes between older and younger siblings.'],
            xpReward: 30,
            difficulty: 'medium',
            order: 2
          }
        ]
      }
    ];

    // Create lessons
    const createdLessons = await Lesson.insertMany(chineseLessons);
    console.log(`Created ${createdLessons.length} Chinese lessons`);

    // Update course units with lesson references
    chineseCourse.units[0].lessons = createdLessons.filter(l => l.unitId === chineseCourse.units[0]._id.toString()).map(l => l._id);
    chineseCourse.units[1].lessons = createdLessons.filter(l => l.unitId === chineseCourse.units[1]._id.toString()).map(l => l._id);
    chineseCourse.units[2].lessons = createdLessons.filter(l => l.unitId === chineseCourse.units[2]._id.toString()).map(l => l._id);
    
    await chineseCourse.save();
    console.log('Updated Chinese course with lesson references');

    console.log('Chinese course seeding completed successfully!');
    
  } catch (error) {
    console.error('Chinese course seeding error:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedChineseCourse();
  await mongoose.connection.close();
  console.log('Chinese course seeding completed and connection closed.');
};

// Run if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedChineseCourse };
