"use client";

/**
 * @author: @dorianbaffier
 * @description: Shimmer Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Text_01Props {
  text?: string;
  className?: string;
}

export function ShimmerText({
  text = "Skill Identity",
  className,
}: Text_01Props) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          animate={{
            backgroundPosition: ["200% center", "-200% center"],
          }}
          className={cn(
            "bg-[length:200%_100%] bg-gradient-to-r from-neutral-950 via-neutral-400 to-neutral-950 bg-clip-text font-bold text-transparent dark:from-white dark:via-neutral-600 dark:to-white inline-block",
            className
          )}
          transition={{
            duration: 2.5,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {text}
        </motion.span>
      </motion.div>
    </div>
  );
}
