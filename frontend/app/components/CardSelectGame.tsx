'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface CardSelectGameProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

const CardSelectGame = ({ question, questionNumber, onAnswer, currentAnswer }: CardSelectGameProps) => {
  const [selectedCard, setSelectedCard] = useState(currentAnswer || null)

  const handleCardSelect = (option: string) => {
    setSelectedCard(option)
    onAnswer(questionNumber, option.toLowerCase())
  }

  const cardColors = {
    dry: 'from-yellow-400 to-orange-500',
    oily: 'from-green-400 to-emerald-500',
    colored: 'from-purple-400 to-violet-500',
    damaged: 'from-red-400 to-rose-500'
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{question.title}</h2>
        <p className="text-lg text-gray-600">{question.description}</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {question.options.map((option: string, index: number) => {
          const isSelected = selectedCard === option.toLowerCase()
          const colorClass = cardColors[option.toLowerCase() as keyof typeof cardColors] || 'from-gray-400 to-gray-500'
          
          return (
            <motion.div
              key={option}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card-flip cursor-pointer"
              onClick={() => handleCardSelect(option)}
            >
              <div className={`card-inner ${isSelected ? 'scale-110' : ''} transition-transform duration-300`}>
                <div className={`card-front bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">💇‍♀️</div>
                    <div className="text-sm font-medium opacity-80">Tap to reveal</div>
                  </div>
                </div>
                <div className={`card-back bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{option}</div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mx-auto">
                          <span className="text-green-500 text-lg">✓</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <span className="text-lg">✨</span>
            <span className="text-lg font-medium text-gray-700">
              Great choice! {selectedCard.charAt(0).toUpperCase() + selectedCard.slice(1)} hair
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CardSelectGame
