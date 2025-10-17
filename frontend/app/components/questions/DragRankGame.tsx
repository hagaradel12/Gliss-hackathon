"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface DragRankProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function DragRank({ options, selectedAnswer, onAnswer }: DragRankProps) {
  const [ranked, setRanked] = useState<string[]>(selectedAnswer ? selectedAnswer.split(",") : [])

  useEffect(() => {
    if (ranked.length === 2) {
      onAnswer(ranked.join(","))
    }
  }, [ranked])

  const toggleRank = (option: string) => {
    if (ranked.includes(option)) {
      setRanked(ranked.filter((item) => item !== option))
    } else if (ranked.length < 2) {
      setRanked([...ranked, option])
    }
  }

  return (
    <div className="space-y-4 foam-background p-6 rounded-xl bottle-card">
      <p className="text-muted-foreground text-sm">Select your top 2 concerns</p>

      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleRank(option)}
            className={`w-full p-4 rounded-lg font-medium transition-all border border-border ${
              ranked.includes(option)
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-secondary text-secondary-foreground hover:bg-accent/40"
            }`}
          >
            {ranked.includes(option) && (
              <span className="mr-2 font-semibold text-accent-foreground">#{ranked.indexOf(option) + 1}</span>
            )}
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
