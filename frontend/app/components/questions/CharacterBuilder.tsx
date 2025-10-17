"use client"

import { motion } from "framer-motion"

interface CharacterBuilderProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function CharacterBuilder({ options, selectedAnswer, onAnswer }: CharacterBuilderProps) {
  return (
    <div className="grid grid-cols-2 gap-4 foam-background">
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => onAnswer(option)}
          className={`bottle-card p-6 rounded-xl font-medium transition-all duration-200 text-center ${
            selectedAnswer === option
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "bg-secondary text-secondary-foreground hover:bg-accent/40 border border-border"
          }`}
        >
          {option}
        </motion.button>
      ))}
    </div>
  )
}
