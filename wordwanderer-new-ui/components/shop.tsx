import { HeartsSection } from "./hearts-section"
import { PowerUpsSection } from "./power-ups-section"

export function Shop() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      <div className="flex-1 space-y-8">
        <HeartsSection />
        <PowerUpsSection />
      </div>
      <aside className="w-full lg:w-80 p-3 sm:p-4 space-y-4 sm:space-y-6 order-first lg:order-last">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
          {/* We can add shop-specific sidebar content here if needed */}
        </div>
      </aside>
    </div>
  )
}
