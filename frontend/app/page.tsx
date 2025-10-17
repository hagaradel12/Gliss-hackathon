'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

// Import question components
import CardSelectGame from './components/CardSelectGame'
import DamageSlider from './components/DamageSlider'
import SwipeChoice from './components/SwipeChoice'
import DragRankGame from './components/DragRankGame'
import TogglePuzzle from './components/TogglePuzzle'
import TreasurePick from './components/TreasurePick'
import EmojiSelector from './components/EmojiSelector'
import PuzzleMatching from './components/PuzzleMatching'
import CharacterBuilder from './components/CharacterBuilder'
import ChatInput from './components/ChatInput'
import ResultsPage from './components/ResultsPage'

interface Question {
  id: number
  type: string
  title: string
  description: string
  options?: any
  required?: boolean
}

interface UserResponse {
  [key: string]: any
}

const API_BASE_URL = 'http://localhost:8000'

export default function HairAdvisor() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<UserResponse>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [sessionId] = useState(() => uuidv4())
  const [recommendations, setRecommendations] = useState(null)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions`)
      setQuestions(response.data.questions)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: number, answer: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      submitQuestionnaire()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitQuestionnaire = async () => {
    setSubmitting(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/recommendations`, {
        session_id: sessionId,
        responses: responses
      })
      setRecommendations(response.data)
      setShowResults(true)
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
      setSubmitting(false)
    }
  }

  const renderQuestion = () => {
    if (!questions[currentQuestion]) return null

    const question = questions[currentQuestion]
    const questionNumber = currentQuestion + 1

    const commonProps = {
      question: question,
      questionNumber: questionNumber,
      onAnswer: handleAnswer,
      currentAnswer: responses[questionNumber]
    }

    switch (question.type) {
      case 'card_select':
        return <CardSelectGame 
          onAnswer={(answer) => handleAnswer(questionNumber, answer)}
          onSkip={() => nextQuestion()}
          currentAnswer={responses[questionNumber]}
        />
      case 'damage_slider':
        return <DamageSlider {...commonProps} />
      case 'swipe_choice':
        return <SwipeChoice {...commonProps} />
      case 'drag_rank':
        return <DragRankGame {...commonProps} />
      case 'toggle_puzzle':
        return <TogglePuzzle {...commonProps} />
      case 'treasure_pick':
        return <TreasurePick {...commonProps} />
      case 'emoji_selector':
        return <EmojiSelector {...commonProps} />
      case 'puzzle_matching':
        return <PuzzleMatching {...commonProps} />
      case 'character_builder':
        return <CharacterBuilder {...commonProps} />
      case 'chat_input':
        return <ChatInput {...commonProps} />
      default:
        return <div>Unknown question type</div>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your hair journey...</p>
        </motion.div>
      </div>
    )
  }

  if (showResults && recommendations) {
    return <ResultsPage recommendations={recommendations} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-8 w-8 text-purple-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hair Advisor
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="text-sm text-gray-600">Your hair journey</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="progress-bar h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8"
            >
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentQuestion
                      ? 'bg-purple-500'
                      : index < currentQuestion
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextQuestion}
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Analyzing...</span>
                </>
              ) : currentQuestion === questions.length - 1 ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Get My Results</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
