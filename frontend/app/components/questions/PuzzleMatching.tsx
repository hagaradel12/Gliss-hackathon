"use client"

import { motion } from "framer-motion"

interface PuzzleMatchingProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function PuzzleMatching({ options, selectedAnswer, onAnswer }: PuzzleMatchingProps) {
  return (
    <div className="space-y-3 foam-background p-6 rounded-xl bottle-card">
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => onAnswer(option)}
          className={`w-full p-4 rounded-xl font-semibold transition-all border focus:outline-none ${
            selectedAnswer === option
              ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-accent/60"
              : "bg-secondary text-secondary-foreground hover:bg-accent/40 hover:scale-[1.02]"
          }`}
        >
          {option}
        </motion.button>
      ))}
    </div>
  )
}
