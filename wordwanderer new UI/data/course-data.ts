export interface Unit {
  id: number
  title: string
  description: string
  levels: Level[]
}

export interface Section {
  id: number
  title: string
  description: string
  units: Unit[]
}

export interface Level {
  id: number
  completed: boolean
  locked: boolean
  current?: boolean
}

export const courseData: Section[] = [
  {
    id: 1,
    title: "Basics",
    description: "Start your Chinese journey with essential words and phrases",
    units: [
      {
        id: 1,
        title: "Name food and drinks",
        description: "Learn basic food and drink vocabulary",
        levels: [
          { id: 1, completed: true, locked: false },
          { id: 2, completed: true, locked: false },
          { id: 3, completed: false, locked: false, current: true },
          { id: 4, completed: false, locked: true },
          { id: 5, completed: false, locked: true },
        ],
      },
      {
        id: 2,
        title: "Talk about nationalities",
        description: "Discuss where you're from and other countries",
        levels: [
          { id: 6, completed: false, locked: true },
          { id: 7, completed: false, locked: true },
          { id: 8, completed: false, locked: true },
          { id: 9, completed: false, locked: true },
        ],
      },
      {
        id: 3,
        title: "Discuss professions",
        description: "Learn about different jobs and careers",
        levels: [
          { id: 10, completed: false, locked: true },
          { id: 11, completed: false, locked: true },
          { id: 12, completed: false, locked: true },
          { id: 13, completed: false, locked: true },
          { id: 14, completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Family & Friends",
    description: "Learn to talk about relationships and people",
    units: [
      {
        id: 4,
        title: "Family members",
        description: "Learn words for family relationships",
        levels: [
          { id: 15, completed: false, locked: true },
          { id: 16, completed: false, locked: true },
          { id: 17, completed: false, locked: true },
          { id: 18, completed: false, locked: true },
        ],
      },
      {
        id: 5,
        title: "Describe people",
        description: "Learn adjectives to describe appearance and personality",
        levels: [
          { id: 19, completed: false, locked: true },
          { id: 20, completed: false, locked: true },
          { id: 21, completed: false, locked: true },
          { id: 22, completed: false, locked: true },
          { id: 23, completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Daily Life",
    description: "Express yourself in everyday situations",
    units: [
      {
        id: 6,
        title: "Daily routines",
        description: "Talk about your daily activities",
        levels: [
          { id: 24, completed: false, locked: true },
          { id: 25, completed: false, locked: true },
          { id: 26, completed: false, locked: true },
          { id: 27, completed: false, locked: true },
        ],
      },
      {
        id: 7,
        title: "Time and dates",
        description: "Learn to express time, days, and dates",
        levels: [
          { id: 28, completed: false, locked: true },
          { id: 29, completed: false, locked: true },
          { id: 30, completed: false, locked: true },
        ],
      },
    ],
  },
]
