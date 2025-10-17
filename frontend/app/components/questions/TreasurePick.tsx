"use client"

import { motion } from "framer-motion"

interface TreasurePickProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function TreasurePick({ options, selectedAnswer, onAnswer }: TreasurePickProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 foam-background p-6 rounded-2xl bottle-card">
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          onClick={() => onAnswer(option)}
          className={`aspect-square rounded-full font-semibold transition-all flex items-center justify-center text-center border-2 ${
            selectedAnswer === option
              ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-accent/60"
              : "bg-secondary text-secondary-foreground hover:bg-accent/30 hover:scale-[1.02] border-border"
          }`}
        >
          <span className="text-base sm:text-lg tracking-wide">{option}</span>
        </motion.button>
      ))}
    </div>
  )
}
