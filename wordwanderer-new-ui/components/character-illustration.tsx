interface CharacterIllustrationProps {
  type: "castle" | "bear"
}

export function CharacterIllustration({ type }: CharacterIllustrationProps) {
  if (type === "castle") {
    return (
      <div className="relative w-12 h-16 sm:w-16 sm:h-20">
        {/* Castle base */}
        <div className="absolute bottom-0 w-full h-8 sm:h-10 bg-slate-600 rounded-b-lg"></div>

        {/* Castle towers */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 w-3 sm:w-4 h-6 sm:h-8 bg-slate-500 rounded-t-lg"></div>
        <div className="absolute bottom-6 sm:bottom-8 right-0 w-3 sm:w-4 h-6 sm:h-8 bg-slate-500 rounded-t-lg"></div>
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 w-4 sm:w-5 h-8 sm:h-10 bg-slate-500 rounded-t-lg"></div>

        {/* Castle flags */}
        <div className="absolute top-0 left-1 w-2 h-1 bg-red-500 rounded-r"></div>
        <div className="absolute top-0 right-1 w-2 h-1 bg-red-500 rounded-r"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-500 rounded-r"></div>
      </div>
    )
  }

  return (
    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
      {/* Bear body */}
      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-amber-800 rounded-full mx-auto"></div>

      {/* Bear head */}
      <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-amber-700 rounded-full">
        {/* Eyes */}
        <div className="absolute top-1 sm:top-2 left-1 w-1 h-1 bg-black rounded-full"></div>
        <div className="absolute top-1 sm:top-2 right-1 w-1 h-1 bg-black rounded-full"></div>

        {/* Nose */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
      </div>

      {/* Bear ears */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-x-2 w-2 h-2 bg-amber-700 rounded-full"></div>
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 translate-x-2 w-2 h-2 bg-amber-700 rounded-full"></div>
    </div>
  )
}
