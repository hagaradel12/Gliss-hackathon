'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CharacterBuilderProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

interface VolumeOption {
  id: string
  label: string
  emoji: string
  description: string
  color: string
  silhouette: string
}

const CharacterBuilder = ({ question, questionNumber, onAnswer, currentAnswer }: CharacterBuilderProps) => {
  const [selectedVolume, setSelectedVolume] = useState<string | null>(currentAnswer || null)

  useEffect(() => {
    if (selectedVolume) {
      onAnswer(questionNumber, selectedVolume.toLowerCase())
    }
  }, [selectedVolume, questionNumber, onAnswer])

  const volumeOptions: VolumeOption[] = [
    {
      id: 'thin',
      label: 'Thin',
      emoji: '🌱',
      description: 'Fine, lightweight hair',
      color: 'from-pink-400 to-rose-500',
      silhouette: '👤'
    },
    {
      id: 'medium',
      label: 'Medium',
      emoji: '🌿',
      description: 'Balanced thickness',
      color: 'from-blue-400 to-cyan-500',
      silhouette: '👤'
    },
    {
      id: 'thick',
      label: 'Thick',
      emoji: '🌳',
      description: 'Full, dense hair',
      color: 'from-purple-400 to-violet-500',
      silhouette: '👤'
    }
  ]

  const handleVolumeSelect = (volumeId: string) => {
    setSelectedVolume(volumeId)
  }

  const getVolumeAdvice = (volume: string) => {
    const advice = {
      thin: {
        tips: [
          'Use lightweight, volumizing products',
          'Avoid heavy conditioners on roots',
          'Try texturizing sprays for body'
        ],
        products: 'Volumizing shampoos and lightweight conditioners'
      },
      medium: {
        tips: [
          'Balanced approach works best',
          'Focus on maintenance and health',
          'Can handle most product types'
        ],
        products: 'Versatile products for all hair types'
      },
      thick: {
        tips: [
          'Need rich, moisturizing products',
          'Can handle heavier treatments',
          'Regular deep conditioning helps'
        ],
        products: 'Rich conditioners and intensive treatments'
      }
    }
    return advice[volume as keyof typeof advice] || advice.medium
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
        {/* Character Builder Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100"
        >
          <div className="text-center">
            <div className="text-8xl mb-4">👤</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Hair Volume</h3>
            <p className="text-gray-600">Select the silhouette that best represents your desired hair volume</p>
          </div>
        </motion.div>

        {/* Volume Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {volumeOptions.map((option, index) => {
            const isSelected = selectedVolume === option.id
            
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
                onClick={() => handleVolumeSelect(option.id)}
              >
                <motion.div
                  className={`character-silhouette p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                    isSelected 
                      ? `bg-gradient-to-br ${option.color} text-white border-transparent` 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Character Silhouette */}
                  <div className="relative mb-6">
                    <div className={`text-6xl mb-2 ${
                      isSelected ? 'animate-bounce' : ''
                    }`}>
                      {option.emoji}
                    </div>
                    
                    {/* Hair Volume Visualization */}
                    <div className="relative">
                      <div className="text-4xl mb-2">👤</div>
                      <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${
                        option.id === 'thin' ? 'text-2xl' :
                        option.id === 'medium' ? 'text-3xl' : 'text-4xl'
                      }`}>
                        💇‍♀️
                      </div>
                    </div>
                  </div>

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
                      ✨
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

        {/* Selected Volume Details */}
        {selectedVolume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-4xl">
                  {volumeOptions.find(o => o.id === selectedVolume)?.emoji}
                </span>
                <h4 className="text-2xl font-bold text-gray-800">
                  {volumeOptions.find(o => o.id === selectedVolume)?.label} Hair Volume
                </h4>
              </div>
              
              {(() => {
                const advice = getVolumeAdvice(selectedVolume)
                return (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-800 mb-3">💡 Care Tips</p>
                    <div className="text-left max-w-md mx-auto">
                      {advice.tips.map((tip, index) => (
                        <p key={index} className="text-blue-700 text-sm mb-1">• {tip}</p>
                      ))}
                    </div>
                    <p className="text-blue-800 font-medium mt-4">
                      Recommended: {advice.products}
                    </p>
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}

        {/* Selection Summary */}
        {selectedVolume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg">🎯</span>
              <span className="text-lg font-medium text-gray-700">
                {volumeOptions.find(o => o.id === selectedVolume)?.label} hair volume selected
              </span>
            </div>
          </motion.div>
        )}

        {/* Volume Education */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-green-800 mb-3">🌟 Understanding Hair Volume</h4>
          <div className="text-left text-green-700 text-sm space-y-2">
            <p>• <strong>Thin:</strong> Individual strands are fine, hair feels lightweight</p>
            <p>• <strong>Medium:</strong> Balanced thickness, most versatile hair type</p>
            <p>• <strong>Thick:</strong> Individual strands are coarse, hair feels heavy</p>
            <p>• Volume affects which products work best for your hair</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CharacterBuilder
