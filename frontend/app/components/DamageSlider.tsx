'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DamageSliderProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

const DamageSlider = ({ question, questionNumber, onAnswer, currentAnswer }: DamageSliderProps) => {
  const [damageLevel, setDamageLevel] = useState(currentAnswer || 5)

  useEffect(() => {
    onAnswer(questionNumber, damageLevel)
  }, [damageLevel, questionNumber, onAnswer])

  const getDamageLabel = (level: number) => {
    if (level <= 2) return 'Healthy'
    if (level <= 4) return 'Slightly Damaged'
    if (level <= 6) return 'Moderately Damaged'
    if (level <= 8) return 'Damaged'
    return 'Highly Damaged'
  }

  const getDamageColor = (level: number) => {
    if (level <= 2) return 'text-green-600'
    if (level <= 4) return 'text-yellow-600'
    if (level <= 6) return 'text-orange-600'
    if (level <= 8) return 'text-red-600'
    return 'text-red-800'
  }

  const getDamageEmoji = (level: number) => {
    if (level <= 2) return '😊'
    if (level <= 4) return '😐'
    if (level <= 6) return '😕'
    if (level <= 8) return '😟'
    return '😢'
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

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100"
        >
          {/* Current Status */}
          <div className="mb-8">
            <motion.div
              key={damageLevel}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">{getDamageEmoji(damageLevel)}</div>
              <h3 className={`text-2xl font-bold ${getDamageColor(damageLevel)} mb-2`}>
                {getDamageLabel(damageLevel)}
              </h3>
              <p className="text-gray-600">Level {damageLevel}/10</p>
            </motion.div>
          </div>

          {/* Slider */}
          <div className="relative mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Healthy
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Highly Damaged
              </span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={damageLevel}
                onChange={(e) => setDamageLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer damage-slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
                }}
              />
              
              {/* Custom slider thumb */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-purple-500 pointer-events-none"
                style={{
                  left: `${((damageLevel - 1) / 9) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-1 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Damage Indicators */}
          <div className="grid grid-cols-5 gap-4 text-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * level }}
                className={`text-center p-2 rounded-lg transition-all ${
                  level === damageLevel
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setDamageLevel(level)}
              >
                <div className="font-medium text-gray-700">{level}</div>
                <div className={`text-xs ${getDamageColor(level)}`}>
                  {level <= 2 ? '🟢' : level <= 6 ? '🟡' : '🔴'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-blue-800 mb-3">💡 Hair Damage Tips</h4>
          <div className="text-left text-blue-700 text-sm space-y-2">
            {damageLevel <= 3 && (
              <p>• Keep up the great care! Your hair is in excellent condition.</p>
            )}
            {damageLevel >= 4 && damageLevel <= 6 && (
              <>
                <p>• Consider reducing heat styling frequency</p>
                <p>• Use a weekly deep conditioning treatment</p>
              </>
            )}
            {damageLevel >= 7 && (
              <>
                <p>• Minimize heat styling and chemical treatments</p>
                <p>• Use protein treatments weekly</p>
                <p>• Consider a professional consultation</p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DamageSlider
