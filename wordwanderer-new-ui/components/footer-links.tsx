"use client"

import { useRouter } from "next/navigation"

export function FooterLinks() {
  const router = useRouter()

  const topLinks = [
    { name: "ABOUT", path: "/about" },
    { name: "BLOG", path: "/blog" },
    { name: "STORE", path: "/store" },
    { name: "EFFICACY", path: "/efficacy" },
    { name: "CAREERS", path: "/careers" },
  ]

  const bottomLinks = [
    { name: "INVESTORS", path: "/investors" },
    { name: "TERMS", path: "/terms" },
    { name: "PRIVACY", path: "/privacy" },
  ]

  return (
    <div className="text-center space-y-3 pt-4">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {topLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => router.push(link.path)}
            className="text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            {link.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {bottomLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => router.push(link.path)}
            className="text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            {link.name}
          </button>
        ))}
      </div>
    </div>
  )
}
