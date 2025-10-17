"use client"

import { useState } from "react"
import ProgressBar from "@/components/progress-bar"
import Question from "@/components/question"
import NavigationButtons from "@/components/navigation-buttons"

const QUESTIONS = [
  {
    id: 1,
    question: "How does your hair usually feel?",
    type: "multi-select",
    options: [
      { label: "Soft", value: "soft" },
      { label: "Smooth", value: "smooth" },
      { label: "Easy to manage", value: "easy" },
      { label: "Rough", value: "rough" },
      { label: "Frizzy", value: "frizzy" },
      { label: "Dull", value: "dull" },
      { label: "Dry", value: "dry" },
      { label: "Brittle", value: "brittle" },
      { label: "Tangled", value: "tangled" },
    ],
  },
  {
    id: 2,
    question: "How easily does your hair tangle or break when brushing or styling?",
    type: "range",
    options: [
      { label: "Rarely tangles or breaks", value: "rarely" },
      { label: "Sometimes tangles or has a few split ends", value: "sometimes" },
      { label: "Often tangles, breaks easily, or feels weak", value: "often" },
    ],
  },
  {
    id: 3,
    question: "How does your hair react to humidity, water, or rain?",
    type: "mcq",
    options: [
      { label: "Stays mostly smooth and manageable", value: "smooth" },
      { label: "Gets slightly puffy or frizzy", value: "puffy" },
      { label: "Becomes very frizzy, dry, or hard to control", value: "very_frizzy" },
    ],
  },
  {
    id: 4,
    question: "Have you ever used any of the following on your hair?",
    type: "multi-select",
    options: [
      { label: "Hair dye or bleach", value: "dye" },
      { label: "Chemical straightening or perming", value: "chemical" },
      { label: "Frequent heat styling", value: "heat" },
      { label: "None of the above", value: "none" },
    ],
  },
  {
    id: 5,
    question: "What describes your individual hair strands best?",
    type: "mcq",
    options: [
      { label: "Fine / Thin (floats in water)", value: "fine" },
      { label: "Medium (sinks slowly)", value: "medium" },
      { label: "Thick / Coarse (sinks quickly)", value: "thick" },
    ],
  },
  {
    id: 6,
    question: "What is your main hair goal?",
    type: "mcq",
    options: [
      { label: "Restore strength and reduce breakage", value: "strength" },
      { label: "Add moisture and softness to dry hair", value: "moisture" },
      { label: "Repair damage and improve smoothness", value: "repair" },
      { label: "Maintain healthy, balanced hair", value: "maintain" },
    ],
  },
  {
    id: 7,
    question: "How often do you wash your hair?",
    type: "mcq",
    options: [
      { label: "Daily", value: "daily" },
      { label: "2-3 times per week", value: "moderate" },
      { label: "Once a week or less", value: "rarely" },
    ],
  },
]

interface QuizPageProps {
  onComplete: (answers: Record<number, any>) => void
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})

  const currentQuestion = QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100

  const handleAnswer = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress Section */}
        <ProgressBar progress={progress} />

        {/* Question Section */}
        <div className="mt-16 md:mt-24 mb-16">
          <Question question={currentQuestion} answer={answers[currentQuestion.id]} onAnswer={handleAnswer} />
        </div>

        {/* Navigation */}
        <NavigationButtons
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={answers[currentQuestion.id] !== undefined}
          isLastQuestion={currentQuestionIndex === QUESTIONS.length - 1}
        />
      </div>
    </div>
  )
}
