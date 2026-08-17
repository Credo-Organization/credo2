"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { StarButton } from "@/components/ui/star-button"
import Link from "next/link"

export function StarButtonDemo() {
  const { theme } = useTheme()
  const [lightColor, setLightColor] = useState("#FAFAFA")

  useEffect(() => {
    setLightColor(theme === "dark" ? "#FAFAFA" : "#FF2056")
  }, [theme])

  return (
    <Link href="/dashboard">
      <StarButton lightColor={lightColor} className="rounded-3xl">
        Get my skill passport
      </StarButton>
    </Link>
  )
}
