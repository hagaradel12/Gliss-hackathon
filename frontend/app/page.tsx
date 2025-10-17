"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SummaryScreen from "./components/summary-screen";
import QuestionCard from "./components/question-card";

import { getThemeForQuestion } from "@/lib/product-themes"

const questions = [
  {
    id: 1,
    question: "What best describes your hair condition?",
    type: "card-select",
    options: ["Healthy", "Dry", "Oily", "Mixed"],
  },
  {
    id: 2,
    question: "How damaged is your hair?",
    type: "damage-slider",
    options: ["Not damaged", "Slightly damaged", "Moderately damaged", "Severely damaged"],
  },
  {
    id: 3,
    question: "What is your natural hair texture?",
    type: "swipe-choice",
    options: ["Straight", "Wavy", "Curly", "Coily"],
  },
  {
    id: 4,
    question: "What are your TOP 2 hair concerns?",
    type: "drag-rank",
    options: ["Frizz", "Breakage", "Dullness", "Scalp issues"],
  },
  {
    id: 5,
    question: "How often do you style or treat your hair?",
    type: "toggle-puzzle",
    options: ["Heat styling", "Coloring", "Chemical treatments"],
  },
  {
    id: 6,
    question: "What is your main hair goal?",
    type: "treasure-pick",
    options: ["Repair", "Smooth", "Shine"],
  },
  {
    id: 7,
    question: "What is your scalp condition?",
    type: "emoji-selector",
    options: ["Healthy", "Itchy", "Dandruff", "Sensitive"],
  },
  {
    id: 8,
    question: "How does weather affect your hair?",
    type: "puzzle-matching",
    options: ["Not much", "Humidity causes frizz", "Cold weather dries it", "All weather affects it"],
  },
  {
    id: 9,
    question: "What is your hair volume preference?",
    type: "character-builder",
    options: ["Fine", "Medium", "Thick", "Very thick"],
  },
  {
    id: 10,
    question: "Describe your current hair routine.",
    type: "chat-input",
    options: [],
  },
]

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showSummary, setShowSummary] = useState(false)

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowSummary(false)
  }

  const currentTheme = getThemeForQuestion(currentQuestion + 1)
  const progressPercentage = Math.round(((currentQuestion + 1) / questions.length) * 100)

  return (
    <main className="relative min-h-screen w-full overflow-hidden foam-background">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        {/* Animated foam bubbles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="foam-bubble"
            style={{
              width: Math.random() * 100 + 50 + "px",
              height: Math.random() * 100 + 50 + "px",
              left: Math.random() * 100 + "%",
              bottom: Math.random() * -200 + "px",
              animationDuration: Math.random() * 8 + 6 + "s",
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Overlay gradient matching theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${currentTheme.accentColor}15, ${currentTheme.accentColor}05)`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <QuestionCard
                question={questions[currentQuestion]}
                currentQuestion={currentQuestion + 1}
                totalQuestions={questions.length}
                selectedAnswer={answers[currentQuestion]}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onPrevious={handlePrevious}
                canGoPrevious={currentQuestion > 0}
                canGoNext={answers[currentQuestion] !== undefined && answers[currentQuestion] !== ""}
                progressPercentage={progressPercentage}
              />
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <SummaryScreen questions={questions} answers={answers} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
