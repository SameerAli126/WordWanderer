export interface StrokeOrder {
  strokes: string[]
  description: string
}

export interface HanziCharacter {
  id: number
  character: string
  pinyin: string
  meaning: string
  strokes: number
  strokeOrder: StrokeOrder
  radicals: string[]
  examples: { word: string; pinyin: string; meaning: string }[]
}

export const hanziCharacters: HanziCharacter[] = [
  {
    id: 1,
    character: "人",
    pinyin: "rén",
    meaning: "person",
    strokes: 2,
    strokeOrder: {
      strokes: ["丿", "人"],
      description: "Left falling stroke, then right falling stroke",
    },
    radicals: ["人"],
    examples: [
      { word: "人", pinyin: "rén", meaning: "person" },
      { word: "人们", pinyin: "rén men", meaning: "people" },
      { word: "大人", pinyin: "dà rén", meaning: "adult" },
    ],
  },
  {
    id: 2,
    character: "大",
    pinyin: "dà",
    meaning: "big",
    strokes: 3,
    strokeOrder: {
      strokes: ["一", "大", "大"],
      description: "Horizontal stroke, then left falling, then right falling",
    },
    radicals: ["大"],
    examples: [
      { word: "大", pinyin: "dà", meaning: "big" },
      { word: "大家", pinyin: "dà jiā", meaning: "everyone" },
      { word: "大学", pinyin: "dà xué", meaning: "university" },
    ],
  },
  {
    id: 3,
    character: "小",
    pinyin: "xiǎo",
    meaning: "small",
    strokes: 3,
    strokeOrder: {
      strokes: ["丨", "小", "小"],
      description: "Vertical stroke, then left dot, then right dot",
    },
    radicals: ["小"],
    examples: [
      { word: "小", pinyin: "xiǎo", meaning: "small" },
      { word: "小孩", pinyin: "xiǎo hái", meaning: "child" },
      { word: "小学", pinyin: "xiǎo xué", meaning: "elementary school" },
    ],
  },
  {
    id: 4,
    character: "水",
    pinyin: "shuǐ",
    meaning: "water",
    strokes: 4,
    strokeOrder: {
      strokes: ["丨", "水", "水", "水"],
      description: "Vertical stroke, then horizontal with hook, then left dot, then right dot",
    },
    radicals: ["水"],
    examples: [
      { word: "水", pinyin: "shuǐ", meaning: "water" },
      { word: "喝水", pinyin: "hē shuǐ", meaning: "drink water" },
      { word: "水果", pinyin: "shuǐ guǒ", meaning: "fruit" },
    ],
  },
  {
    id: 5,
    character: "火",
    pinyin: "huǒ",
    meaning: "fire",
    strokes: 4,
    strokeOrder: {
      strokes: ["丶", "火", "火", "火"],
      description: "Top dot, then left falling, then right falling, then bottom dot",
    },
    radicals: ["火"],
    examples: [
      { word: "火", pinyin: "huǒ", meaning: "fire" },
      { word: "火车", pinyin: "huǒ chē", meaning: "train" },
      { word: "火锅", pinyin: "huǒ guō", meaning: "hot pot" },
    ],
  },
]
