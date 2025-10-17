'use client'

import { useState, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'

interface SwipeChoiceProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

const SwipeChoice = ({ question, questionNumber, onAnswer, currentAnswer }: SwipeChoiceProps) => {
  const [selectedTexture, setSelectedTexture] = useState(currentAnswer || null)
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (selectedTexture) {
      onAnswer(questionNumber, selectedTexture.toLowerCase())
    }
  }, [selectedTexture, questionNumber, onAnswer])

  const handleDrag = (event: any, info: PanInfo) => {
    if (info.offset.x > 50) {
      setDragDirection('right')
    } else if (info.offset.x < -50) {
      setDragDirection('left')
    } else {
      setDragDirection(null)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      // Swipe right
      const currentIndex = question.options.indexOf(selectedTexture)
      if (currentIndex < question.options.length - 1) {
        const nextTexture = question.options[currentIndex + 1]
        setSelectedTexture(nextTexture)
      }
    } else if (info.offset.x < -threshold) {
      // Swipe left
      const currentIndex = question.options.indexOf(selectedTexture)
      if (currentIndex > 0) {
        const prevTexture = question.options[currentIndex - 1]
        setSelectedTexture(prevTexture)
      }
    }
    setDragDirection(null)
  }

  const handleDirectClick = (texture: string) => {
    setSelectedTexture(texture)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
  }

  const getTextureDescription = (texture: string) => {
    const descriptions = {
      'fine': 'Thin strands, lightweight, easy to style',
      'medium': 'Balanced thickness, versatile styling options',
      'coarse': 'Thick strands, strong structure, needs moisture'
    }
    return descriptions[texture.toLowerCase() as keyof typeof descriptions] || ''
  }

  const getTextureEmoji = (texture: string) => {
    const emojis = {
      'fine': '🪶',
      'medium': '🌿',
      'coarse': '🌳'
    }
    return emojis[texture.toLowerCase() as keyof typeof emojis] || '💇‍♀️'
  }

  const getTextureColor = (texture: string) => {
    const colors = {
      'fine': 'from-pink-400 to-rose-500',
      'medium': 'from-blue-400 to-cyan-500',
      'coarse': 'from-amber-400 to-orange-500'
    }
    return colors[texture.toLowerCase() as keyof typeof colors] || 'from-gray-400 to-gray-500'
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
        {/* Swipe Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center justify-center space-x-4 text-gray-500"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              ←
            </div>
            <span className="text-sm">Swipe left</span>
          </div>
          <span className="text-2xl">💇‍♀️</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Swipe right</span>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              →
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative cursor-grab active:cursor-grabbing"
          whileTap={{ scale: 0.98 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100 min-h-[400px] flex flex-col items-center justify-center">
            {selectedTexture ? (
              <motion.div
                key={selectedTexture}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-8xl mb-6">{getTextureEmoji(selectedTexture)}</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {selectedTexture}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {getTextureDescription(selectedTexture)}
                </p>
                
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-100 border border-green-300 rounded-full px-6 py-3 text-green-700 font-medium"
                  >
                    ✨ Perfect choice!
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="text-8xl mb-6">💇‍♀️</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-4">
                  Choose your hair texture
                </h3>
                <p className="text-gray-500">Swipe or tap to select</p>
              </motion.div>
            )}
          </div>

          {/* Drag indicator */}
          {dragDirection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${
                dragDirection === 'left' ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {dragDirection === 'left' ? '←' : '→'}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Texture Options */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {question.options.map((texture: string, index: number) => {
            const isSelected = selectedTexture === texture
            const colorClass = getTextureColor(texture)
            
            return (
              <motion.div
                key={texture}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-110' : 'hover:scale-105'
                }`}
                onClick={() => handleDirectClick(texture)}
              >
                <div className={`bg-gradient-to-br ${colorClass} rounded-xl p-6 text-white shadow-lg ${
                  isSelected ? 'ring-4 ring-purple-300' : ''
                }`}>
                  <div className="text-3xl mb-2">{getTextureEmoji(texture)}</div>
                  <div className="font-bold text-lg">{texture}</div>
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
              </motion.div>
            )
          })}
        </div>

        {/* Selection Feedback */}
        {selectedTexture && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg">✨</span>
              <span className="text-lg font-medium text-gray-700">
                {selectedTexture} hair texture selected
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SwipeChoice
