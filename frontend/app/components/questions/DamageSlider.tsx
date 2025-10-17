"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface DamageSliderProps {
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function DamageSlider({ options, selectedAnswer, onAnswer }: DamageSliderProps) {
  const [value, setValue] = useState(selectedAnswer ? options.indexOf(selectedAnswer) : 0)

  useEffect(() => {
    onAnswer(options[value])
  }, [value])

  return (
    <div className="space-y-6 foam-background p-6 rounded-xl bottle-card">
      {/* Slider labels */}
      <div className="flex justify-between text-sm font-medium text-muted-foreground">
        <span>Healthy</span>
        <span>Highly Damaged</span>
      </div>

      {/* Range slider */}
      <input
        type="range"
        min="0"
        max={options.length - 1}
        value={value}
        onChange={(e) => setValue(Number.parseInt(e.target.value))}
        className="w-full h-3 rounded-lg cursor-pointer accent-[--color-primary] bg-secondary appearance-none"
      />

      {/* Selected value display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center p-4 rounded-lg bg-accent/30 text-accent-foreground backdrop-blur-md shadow-inner"
      >
        <p className="font-semibold text-lg">{options[value]}</p>
      </motion.div>
    </div>
  )
}
