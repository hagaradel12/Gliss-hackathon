"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface ChatInputProps {
  selectedAnswer?: string
  onAnswer: (answer: string) => void
}

export default function ChatInput({ selectedAnswer, onAnswer }: ChatInputProps) {
  const [input, setInput] = useState(selectedAnswer || "")

  useEffect(() => {
    onAnswer(input)
  }, [input])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 foam-background p-6 rounded-xl bottle-card"
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your current hair routine..."
        className="w-full p-4 rounded-lg bg-secondary text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all resize-none"
        rows={4}
      />
      <p className="text-muted-foreground text-sm">{input.length} characters</p>
    </motion.div>
  )
}
