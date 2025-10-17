'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface EmojiSelectorProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

interface EmojiOption {
  id: string
  emoji: string
  label: string
  description: string
  color: string
}

const EmojiSelector = ({ question, questionNumber, onAnswer, currentAnswer }: EmojiSelectorProps) => {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(currentAnswer || null)

  useEffect(() => {
    if (selectedCondition) {
      onAnswer(questionNumber, selectedCondition.toLowerCase())
    }
  }, [selectedCondition, questionNumber, onAnswer])

  const emojiOptions: EmojiOption[] = [
    {
      id: 'healthy',
      emoji: '😊',
      label: 'Healthy',
      description: 'Normal scalp, no issues',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'oily',
      emoji: '😰',
      label: 'Oily',
      description: 'Greasy, needs frequent washing',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'dry',
      emoji: '😫',
      label: 'Dry',
      description: 'Tight, itchy, flaky',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'sensitive',
      emoji: '😣',
      label: 'Sensitive',
      description: 'Irritated, reactive to products',
      color: 'from-pink-400 to-rose-500'
    }
  ]

  const handleEmojiClick = (conditionId: string) => {
    setSelectedCondition(conditionId)
  }

  const getScalpAdvice = (condition: string) => {
    const advice = {
      healthy: {
        tip: "Keep up the great care!",
        suggestion: "Continue with gentle, sulfate-free products"
      },
      oily: {
        tip: "Balance is key!",
        suggestion: "Use clarifying shampoos but don't over-wash"
      },
      dry: {
        tip: "Moisture is essential!",
        suggestion: "Focus on hydrating shampoos and scalp treatments"
      },
      sensitive: {
        tip: "Gentle care required!",
        suggestion: "Use fragrance-free, hypoallergenic products"
      }
    }
    return advice[condition as keyof typeof advice] || advice.healthy
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

      <div className="max-w-4xl mx-auto">
        {/* Scalp Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100"
        >
          <div className="text-center">
            <div className="text-8xl mb-4">👤</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Scalp Condition</h3>
            <p className="text-gray-600">Choose the emoji that best represents how your scalp feels</p>
          </div>
        </motion.div>

        {/* Emoji Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {emojiOptions.map((option, index) => {
            const isSelected = selectedCondition === option.id
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="relative cursor-pointer"
                onClick={() => handleEmojiClick(option.id)}
              >
                <motion.div
                  className={`emoji-selector p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                    isSelected 
                      ? `bg-gradient-to-br ${option.color} text-white border-transparent` 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, -2, 2, -2, 0],
                    transition: { duration: 0.5 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Emoji */}
                  <motion.div
                    className="text-6xl mb-4"
                    animate={isSelected ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {option.emoji}
                  </motion.div>

                  {/* Label */}
                  <h4 className={`text-xl font-bold mb-2 ${
                    isSelected ? 'text-white' : 'text-gray-800'
                  }`}>
                    {option.label}
                  </h4>

                  {/* Description */}
                  <p className={`text-sm ${
                    isSelected ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </p>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg"
                    >
                      ✓
                    </motion.div>
                  )}

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 opacity-0"
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Selected Condition Details */}
        {selectedCondition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-4xl">
                  {emojiOptions.find(o => o.id === selectedCondition)?.emoji}
                </span>
                <h4 className="text-2xl font-bold text-gray-800">
                  {emojiOptions.find(o => o.id === selectedCondition)?.label} Scalp
                </h4>
              </div>
              
              {(() => {
                const advice = getScalpAdvice(selectedCondition)
                return (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-800 mb-2">💡 {advice.tip}</p>
                    <p className="text-blue-700">{advice.suggestion}</p>
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}

        {/* Selection Summary */}
        {selectedCondition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg">🎯</span>
              <span className="text-lg font-medium text-gray-700">
                {emojiOptions.find(o => o.id === selectedCondition)?.label} scalp condition selected
              </span>
            </div>
          </motion.div>
        )}

        {/* Scalp Care Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-green-800 mb-3">🌟 General Scalp Care Tips</h4>
          <div className="text-left text-green-700 text-sm space-y-2">
            <p>• Use lukewarm water when washing hair</p>
            <p>• Massage scalp gently with fingertips, not nails</p>
            <p>• Choose products suitable for your scalp type</p>
            <p>• Avoid over-washing or under-washing</p>
            <p>• Consider regular scalp treatments or massages</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EmojiSelector
