"use client"

import { useState, useEffect } from "react"
import ProgressBar from "@/components/progress-bar"
import Question from "@/components/question"
import NavigationButtons from "@/components/navigation-buttons"

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question: "What hair struggles are you dealing with right now? (Pick all that apply, queen 👑)",
    type: "multi-select",
    options: [
      { label: "Dryness", value: "dryness" },
      { label: "Frizz", value: "frizz" },
      { label: "Split ends", value: "split_ends" },
      { label: "Breakage", value: "breakage" },
      { label: "Hair fall", value: "hair_fall_thinning" },
      { label: "Weak", value: "weak_limp_hair" },
      { label: "no shine", value: "dullness_no_shine" },
      { label: "Tangled easily", value: "tangled_easily" },

    ],
  },
  {
    id: 2,
    question: "Does your hair get tangled easily?",
    type: "mcq",
    options: [
      { label: "Yes", value: "yes_always" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Not really", value: "not_really" },
      { label: "Nope, it's chill ✨", value: "no_chill" },
    ],
  },
  {
    id: 3,
    question: "What's your scalp vibe?",
    type: "mcq",
    options: [
      { label: "Dry & flaky", value: "dry_flaky" },
      { label: "Oily", value: "oily" },
      { label: "Sensitive / itchy", value: "sensitive_itchy" },
      { label: "Normal", value: "normal" },
      { label: "I'm not sure 🤔", value: "not_sure" },
    ],
  },
  {
    id: 4,
    question: "What do you usually do to your hair?",
    type: "multi-select",
    options: [
      { label: "Bleach", value: "bleach_color_often" },
      { label: "Heat styling weekly/daily", value: "heat_styling_weekly_daily" },
      { label: "Heat styling occasionally", value: "heat_styling_occasionally" },
      { label: "Chemical treatments", value: "chemical_treatments" },
      { label: "None", value: "none_low_maintenance" },
    ],
  },
  {
    id: 5,
    question: "What's your dream hair goal?",
    type: "mcq",
    options: [
      { label: "Strong & healthy", value: "strong_healthy" },
      { label: "Long", value: "long_luscious" },
      { label: "Smooth & frizz-free", value: "smooth_frizz_free" },
      { label: "Shiny", value: "shiny_glossy" },
      { label: "Bouncy volume & life", value: "bouncy_volume" },
      { label: "Damage repair + healing", value: "damage_repair_healing" },
    ],
  },
  {
    id: 6,
    question: "How much effort do you put into haircare?",
    type: "mcq",
    options: [
      { label: "Minimal – give me simple please 💗", value: "minimal" },
      { label: "Medium – I like some cute products ✨", value: "medium" },
      { label: "Full glam routine – I'm THAT hair girl 💅🔥", value: "full_glam" },
    ],
  },
]

interface QuizPageProps {
  onComplete: (answers: Record<number, any>) => void
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS)
  const [loading, setLoading] = useState(false)

  // // Try to fetch questions from backend on component mount
  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/questions')
  //       if (response.ok) {
  //         const data = await response.json()
  //         const backendQuestions = data.questions
          
  //         // Transform backend questions to frontend format
  //         const transformedQuestions = backendQuestions.map((q: any) => ({
  //           id: q.id,
  //           question: q.title,
  //           type: q.type === 'multiple_choice' ? 'multi-select' : 'mcq',
  //           options: q.options.map((opt: any) => ({
  //             label: opt.label,
  //             value: opt.value
  //           }))
  //         }))
  //         setQuestions(transformedQuestions)
  //       }
  //     } catch (error) {
  //       console.log('Using fallback questions')
  //     }
  //   }

  //   fetchQuestions()
  // }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswer = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Pass answers to parent component for submission
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
          <Question 
            question={currentQuestion} 
            answer={answers[currentQuestion.id]} 
            onAnswer={handleAnswer} 
          />
        </div>

        {/* Navigation */}
        <NavigationButtons
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={answers[currentQuestion.id] !== undefined}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>
    </div>
  )
}