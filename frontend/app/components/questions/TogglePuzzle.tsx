"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface TogglePuzzleProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function TogglePuzzle({ options, selectedAnswer, onAnswer }: TogglePuzzleProps) {
  const [toggled, setToggled] = useState<string[]>(selectedAnswer ? selectedAnswer.split(",") : [])

  useEffect(() => {
    onAnswer(toggled.join(","))
  }, [toggled])

  const toggleOption = (option: string) => {
    if (toggled.includes(option)) {
      setToggled(toggled.filter((item) => item !== option))
    } else {
      setToggled([...toggled, option])
    }
  }

  return (
    <div className="space-y-4 foam-background p-6 rounded-xl bottle-card">
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          onClick={() => toggleOption(option)}
          className={`w-full p-4 rounded-xl font-semibold transition-all flex items-center justify-between border focus:outline-none ${
            toggled.includes(option)
              ? "bg-primary text-primary-foreground shadow-md scale-105 ring-2 ring-accent/60"
              : "bg-secondary text-secondary-foreground hover:bg-accent/40 hover:scale-[1.02]"
          }`}
        >
          <span>{option}</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-lg font-bold ${
              toggled.includes(option) ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {toggled.includes(option) ? "ON" : "OFF"}
          </motion.span>
        </motion.button>
      ))}
    </div>
  )
}
