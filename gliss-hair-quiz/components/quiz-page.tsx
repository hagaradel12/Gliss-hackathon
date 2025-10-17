"use client"

import { useState } from "react"
import ProgressBar from "@/components/progress-bar"
import Question from "@/components/question"
import NavigationButtons from "@/components/navigation-buttons"

const QUESTIONS = [
  {
    id: 1,
    question: " What hair struggles are you dealing with right now? (Pick all that apply, queen 👑)",
    type: "multi-select",
    options: [
      { label: "Soft", value: "soft" },
      { label: "Smooth", value: "smooth" },
      { label: "Easy to manage", value: "easy" },
      { label: "Rough", value: "rough" },
      { label: "Frizzy", value: "frizzy" },
      { label: "Dull", value: "dull" },
      { label: "Dry", value: "dry" },
      { label: "Split ends", value: "split ends" },
      { label: "Tangled", value: "tangled" },
    ],
  },
  {
    id: 2,
    question: "Does your hair get tangled easily?",
    type: "range",
    options: [
      { label: "Always", value: "rarely" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Not really", value: "often" },
      { label: "Nope", value: "No" },
    ],
  },
  {
    id: 3,
    question: "What’s your scalp vibe?",
    type: "mcq",
    options: [
      { label: "Dry & flaky", value: "Dry" },
      { label: "Oily", value: "oily" },
      { label: "Sensitive / itchy", value: "itchy" },
      { label: "Normal", value: "normal" },
      { label: "not sure", value: "not sure" },
    ],
  },
  {
    id: 4,
    question: "What do you usually do to your hair?",
    type: "multi-select",
    options: [
      { label: "Bleach / color often", value: "dye" },
      { label: "Heat styling weekly/daily ", value: "heat" },
      { label: "Heat styling occasionally", value: "heat" },
      { label: "Chemical treatments", value: "chemical" },
      { label: "None of the above", value: "none" },
    ],
  },
  {
    id: 5,
    question: ". What’s your dream hair goal?",
    type: "mcq",
    options: [
      { label: "Strong & healthy", value: "strength" },
      { label: "Long & luscious Rapunzel vibes", value: "moisture" },
      { label: "Smooth & frizz-free", value: "maintain" },
      { label: "Shiny & glossy like glass hair ", value: "repair" },
      { label: "Bouncy volume & life", value: "strength" },
      { label: "Damage repair + healing", value: "repair" },
    ],
  },
  {
    id: 6,
    question: " How much effort do you put into haircare?",
    type: "mcq",
    options: [
      { label: "Minimal – give me simple please", value: "minimal" },
      { label: "Medium – I like some cute products", value: "medium" },
      { label: "Full glam routine – I’m THAT hair girl", value: "full" },
    ],
  },
  // {
  //   id: 7,
  //   question: "How often do you wash your hair?",
  //   type: "mcq",
  //   options: [
  //     { label: "Daily", value: "daily" },
  //     { label: "2-3 times per week", value: "moderate" },
  //     { label: "Once a week or less", value: "rarely" },
  //   ],
  // },
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
