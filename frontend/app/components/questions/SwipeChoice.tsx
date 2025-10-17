"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface SwipeChoiceProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function SwipeChoice({ options, selectedAnswer, onAnswer }: SwipeChoiceProps) {
  const [currentIndex, setCurrentIndex] = useState(
    selectedAnswer ? options.indexOf(selectedAnswer) : 0
  )

  const handleSwipe = (direction: "left" | "right") => {
    let newIndex = currentIndex
    if (direction === "right" && currentIndex < options.length - 1) {
      newIndex = currentIndex + 1
    } else if (direction === "left" && currentIndex > 0) {
      newIndex = currentIndex - 1
    }
    setCurrentIndex(newIndex)
    onAnswer(options[newIndex])
  }

  return (
    <div className="space-y-8 foam-background p-8 rounded-2xl bottle-card text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -80, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-8 rounded-xl bg-secondary text-secondary-foreground shadow-md border border-border"
        >
          <p className="text-3xl font-bold tracking-wide">{options[currentIndex]}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-6 justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe("left")}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-lg font-semibold bg-primary/80 text-primary-foreground hover:bg-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Left
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe("right")}
          disabled={currentIndex === options.length - 1}
          className="px-6 py-3 rounded-lg font-semibold bg-primary/80 text-primary-foreground hover:bg-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Right →
        </motion.button>
      </div>
    </div>
  )
}
