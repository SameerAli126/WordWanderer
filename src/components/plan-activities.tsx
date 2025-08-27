import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export function PlanActivities() {
  return (
    <div className="mt-12 sm:mt-16 text-center">
      <div className="text-slate-500 text-lg sm:text-xl font-medium mb-6 sm:mb-8">Plan your activities</div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="outline"
          className="bg-red-600 border-red-500 text-white hover:bg-red-700 px-6 py-3 text-sm sm:text-base"
        >
          JUMP HERE?
        </Button>

        <Button size="lg" className="bg-slate-700 hover:bg-slate-600 rounded-full w-12 h-12 p-0">
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
