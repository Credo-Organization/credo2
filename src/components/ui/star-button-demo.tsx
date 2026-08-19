"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { StarButton } from "@/components/ui/star-button"
import { LoginModal } from "@/components/ui/login-modal"

export function StarButtonDemo() {
  const { theme } = useTheme()
  const lightColor = theme === "dark" ? "#FAFAFA" : "#FF2056"

  return (
    <LoginModal>
      <StarButton lightColor={lightColor} className="rounded-3xl cursor-pointer">
        Get my skill passport
      </StarButton>
    </LoginModal>
  )
}
