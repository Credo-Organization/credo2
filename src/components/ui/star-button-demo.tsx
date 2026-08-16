"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { StarButton } from "@/components/ui/star-button"
import Link from "next/link"

export function StarButtonDemo() {
  const { theme } = useTheme()
  const [lightColor, setLightColor] = useState("#148CF5")

  useEffect(() => {
    // Ensuring the glowing light color is #148CF5 in dark mode as requested
    setLightColor(theme === "dark" ? "#148CF5" : "#FF2056")
  }, [theme])

  return (
    <div>
      <Link href="/login" className="relative group">
        <StarButton lightColor={lightColor} className="rounded-3xl relative cursor-pointer">
          Get my skill passport
        </StarButton>
      </Link>
    </div>
  )
}
