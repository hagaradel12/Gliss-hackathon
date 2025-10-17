"use client"

import { motion } from "framer-motion"

interface EmojiSelectorProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function EmojiSelector({ options, selectedAnswer, onAnswer }: EmojiSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 foam-background p-6 rounded-xl bottle-card">
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => onAnswer(option)}
          className={`p-6 rounded-xl font-semibold text-lg transition-all duration-200 border border-border focus:outline-none ${
            selectedAnswer === option
              ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-accent/60"
              : "bg-secondary text-secondary-foreground hover:bg-accent/40 hover:scale-102"
          }`}
        >
          {option}
        </motion.button>
      ))}
    </div>
  )
}
