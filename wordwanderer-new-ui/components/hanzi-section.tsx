import { HanziUnit } from "./hanzi-unit"

const hanziUnits = [
  {
    id: 1,
    section: 1,
    unit: 1,
    title: "Name food and drinks",
    subtitle: "Introduced in this unit",
    characters: [
      { char: "水", learned: true },
      { char: "咖", learned: true },
      { char: "啡", learned: true },
      { char: "和", learned: false },
      { char: "茶", learned: false },
      { char: "米", learned: true },
      { char: "饭", learned: true },
      { char: "汤", learned: false },
      { char: "热", learned: false },
      { char: "这", learned: true },
      { char: "是", learned: true },
      { char: "粥", learned: false },
      { char: "豆", learned: false },
      { char: "腐", learned: false },
    ],
    completed: true,
  },
  {
    id: 2,
    section: 1,
    unit: 2,
    title: "Talk about nationalities",
    subtitle: "Introduced in this unit",
    characters: [
      { char: "美", learned: true },
      { char: "国", learned: true },
      { char: "中", learned: true },
      { char: "日", learned: false },
      { char: "本", learned: false },
      { char: "我", learned: true },
      { char: "你", learned: false },
      { char: "呢", learned: false },
      { char: "韩", learned: false },
    ],
    newWords: [{ char: "是", learned: true }],
    completed: true,
  },
  {
    id: 3,
    section: 1,
    unit: 3,
    title: "Discuss professions",
    subtitle: "Introduced in this unit",
    characters: [
      { char: "工", learned: false },
      { char: "作", learned: false },
      { char: "医", learned: false },
      { char: "生", learned: false },
    ],
    completed: false,
  },
]

export function HanziSection() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Let's practice Hanzi!</h1>
        <p className="text-slate-300 text-lg">Practice reading words with hanzi characters</p>
      </div>

      <div className="space-y-6">
        {hanziUnits.map((unit) => (
          <HanziUnit key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  )
}
