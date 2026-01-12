export interface ToneExercise {
  id: number
  character: string
  pinyin: string
  tone: number
  meaning: string
  audio?: string
}

export interface InitialExercise {
  id: number
  pinyin: string
  character: string
  meaning: string
  audio?: string
}

export const toneExercises: ToneExercise[] = [
  { id: 1, character: "妈", pinyin: "mā", tone: 1, meaning: "mother" },
  { id: 2, character: "麻", pinyin: "má", tone: 2, meaning: "hemp" },
  { id: 3, character: "马", pinyin: "mǎ", tone: 3, meaning: "horse" },
  { id: 4, character: "骂", pinyin: "mà", tone: 4, meaning: "scold" },
  { id: 5, character: "吗", pinyin: "ma", tone: 0, meaning: "question particle" },
  { id: 6, character: "爸", pinyin: "bà", tone: 4, meaning: "father" },
  { id: 7, character: "八", pinyin: "bā", tone: 1, meaning: "eight" },
  { id: 8, character: "白", pinyin: "bái", tone: 2, meaning: "white" },
  { id: 9, character: "百", pinyin: "bǎi", tone: 3, meaning: "hundred" },
  { id: 10, character: "拜", pinyin: "bài", tone: 4, meaning: "worship" },
]

export const initialExercises: InitialExercise[] = [
  { id: 1, pinyin: "bā", character: "八", meaning: "eight" },
  { id: 2, pinyin: "pá", character: "爬", meaning: "climb" },
  { id: 3, pinyin: "mā", character: "妈", meaning: "mother" },
  { id: 4, pinyin: "fā", character: "发", meaning: "send" },
  { id: 5, pinyin: "dà", character: "大", meaning: "big" },
  { id: 6, pinyin: "tā", character: "他", meaning: "he" },
  { id: 7, pinyin: "nǐ", character: "你", meaning: "you" },
  { id: 8, pinyin: "lái", character: "来", meaning: "come" },
  { id: 9, pinyin: "gē", character: "哥", meaning: "brother" },
  { id: 10, pinyin: "kě", character: "可", meaning: "can" },
]
