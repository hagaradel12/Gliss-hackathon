"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import QuizPage from "@/components/quiz-page"
import ResultsPage from "@/components/results-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "quiz" | "results">("landing")
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({})

  const handleStartQuiz = () => {
    setCurrentPage("quiz")
  }

  const handleQuizComplete = (answers: Record<number, any>) => {
    setQuizAnswers(answers)
    setCurrentPage("results")
  }

  const handleRetakeQuiz = () => {
    setQuizAnswers({})
    setCurrentPage("landing")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === "landing" && <LandingPage onStart={handleStartQuiz} />}
      {currentPage === "quiz" && <QuizPage onComplete={handleQuizComplete} />}
      {currentPage === "results" && <ResultsPage answers={quizAnswers} onRetake={handleRetakeQuiz} />}
    </main>
  )
}
