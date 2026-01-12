export interface Question {
  id: number
  type: "translate" | "select" | "audio" | "match"
  question: string
  options?: string[]
  correctAnswer: string | string[]
  audio?: string
  image?: string
  explanation?: string
}

export interface Lesson {
  id: number
  title: string
  description: string
  questions: Question[]
  xpReward: number
}

export const lessonData: Lesson[] = [
  {
    id: 1,
    title: "Basic Greetings",
    description: "Learn essential Chinese greetings",
    xpReward: 10,
    questions: [
      {
        id: 1,
        type: "translate",
        question: "How do you say 'Hello' in Chinese?",
        options: ["你好", "再见", "谢谢", "不客气"],
        correctAnswer: "你好",
        explanation: "你好 (nǐ hǎo) is the most common way to say hello in Chinese.",
      },
      {
        id: 2,
        type: "select",
        question: "Select the correct translation for '再见'",
        options: ["Hello", "Goodbye", "Thank you", "You're welcome"],
        correctAnswer: "Goodbye",
        explanation: "再见 (zài jiàn) means goodbye in Chinese.",
      },
      {
        id: 3,
        type: "translate",
        question: "Translate: Thank you",
        options: ["你好", "再见", "谢谢", "对不起"],
        correctAnswer: "谢谢",
        explanation: "谢谢 (xiè xiè) means thank you in Chinese.",
      },
      {
        id: 4,
        type: "match",
        question: "Match the Chinese characters with their meanings",
        options: ["你好 - Hello", "再见 - Goodbye", "谢谢 - Thank you", "对不起 - Sorry"],
        correctAnswer: ["你好 - Hello", "再见 - Goodbye", "谢谢 - Thank you", "对不起 - Sorry"],
        explanation: "Practice matching characters with their meanings to build vocabulary.",
      },
    ],
  },
  {
    id: 2,
    title: "Numbers 1-10",
    description: "Learn Chinese numbers from 1 to 10",
    xpReward: 15,
    questions: [
      {
        id: 1,
        type: "translate",
        question: "How do you say 'one' in Chinese?",
        options: ["一", "二", "三", "四"],
        correctAnswer: "一",
        explanation: "一 (yī) means one in Chinese.",
      },
      {
        id: 2,
        type: "select",
        question: "What does '五' mean?",
        options: ["Three", "Four", "Five", "Six"],
        correctAnswer: "Five",
        explanation: "五 (wǔ) means five in Chinese.",
      },
      {
        id: 3,
        type: "translate",
        question: "Select the character for 'ten'",
        options: ["八", "九", "十", "七"],
        correctAnswer: "十",
        explanation: "十 (shí) means ten in Chinese.",
      },
    ],
  },
  {
    id: 3,
    title: "Family Members",
    description: "Learn words for family members",
    xpReward: 12,
    questions: [
      {
        id: 1,
        type: "translate",
        question: "How do you say 'mother' in Chinese?",
        options: ["爸爸", "妈妈", "哥哥", "姐姐"],
        correctAnswer: "妈妈",
        explanation: "妈妈 (mā ma) means mother in Chinese.",
      },
      {
        id: 2,
        type: "select",
        question: "What does '爸爸' mean?",
        options: ["Mother", "Father", "Brother", "Sister"],
        correctAnswer: "Father",
        explanation: "爸爸 (bà ba) means father in Chinese.",
      },
      {
        id: 3,
        type: "translate",
        question: "Select the word for 'older brother'",
        options: ["弟弟", "妹妹", "哥哥", "姐姐"],
        correctAnswer: "哥哥",
        explanation: "哥哥 (gē ge) means older brother in Chinese.",
      },
    ],
  },
]
