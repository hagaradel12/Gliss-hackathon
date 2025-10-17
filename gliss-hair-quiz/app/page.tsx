"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import QuizPage from "@/components/quiz-page"
import ResultsPage from "@/components/results-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "quiz" | "results">("landing")
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({})
  const [apiResults, setApiResults] = useState<any>(null)

  const handleStartQuiz = () => {
    setCurrentPage("quiz")
  }

  const handleQuizComplete = async (answers: Record<number, any>) => {
    setQuizAnswers(answers)
    
    try {
      const response = await fetch('http://localhost:8000/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          q1_hair_struggles: answers[1] || [],
          q2_tangled: answers[2] || '',
          q3_scalp_vibe: answers[3] || '',
          q4_hair_habits: answers[4] || [],
          q5_dream_goal: answers[5] || '',
          q6_effort_level: answers[6] || '',
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const results = await response.json()
      setApiResults(results)
      setCurrentPage("results")
    } catch (error) {
      console.error('Failed to get recommendations:', error)
      setApiResults({
        error: "Failed to get recommendations. Please try again."
      })
      setCurrentPage("results")
    }
  }

  const handleRetakeQuiz = () => {
    setQuizAnswers({})
    setApiResults(null)
    setCurrentPage("landing")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === "landing" && <LandingPage onStart={handleStartQuiz} />}
      {currentPage === "quiz" && <QuizPage onComplete={handleQuizComplete} />}
      {currentPage === "results" && (
        <ResultsPage 
          answers={quizAnswers} 
          apiResults={apiResults}
          onRetake={handleRetakeQuiz} 
        />
      )}
    </main>
  )
}