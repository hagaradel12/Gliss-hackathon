'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PuzzleMatchingProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

interface WeatherItem {
  id: string
  icon: string
  label: string
  color: string
}

interface EffectItem {
  id: string
  label: string
  color: string
}

interface Match {
  weatherId: string
  effectId: string
}

const PuzzleMatching = ({ question, questionNumber, onAnswer, currentAnswer }: PuzzleMatchingProps) => {
  const [matches, setMatches] = useState<Match[]>(currentAnswer || [])
  const [draggedWeather, setDraggedWeather] = useState<string | null>(null)
  const [hoveredEffect, setHoveredEffect] = useState<string | null>(null)

  const weatherItems: WeatherItem[] = [
    { id: 'sun', icon: '☀️', label: 'Sun', color: 'from-yellow-400 to-orange-500' },
    { id: 'wind', icon: '💨', label: 'Wind', color: 'from-blue-400 to-cyan-500' },
    { id: 'humidity', icon: '🌧️', label: 'Humidity', color: 'from-green-400 to-emerald-500' },
    { id: 'cold', icon: '❄️', label: 'Cold', color: 'from-indigo-400 to-blue-500' }
  ]

  const effectItems: EffectItem[] = [
    { id: 'frizz', label: 'Frizz', color: 'from-red-400 to-rose-500' },
    { id: 'damage', label: 'Damage', color: 'from-orange-400 to-red-500' },
    { id: 'dullness', label: 'Dullness', color: 'from-gray-400 to-slate-500' },
    { id: 'breakage', label: 'Breakage', color: 'from-purple-400 to-violet-500' }
  ]

  const correctMatches = {
    sun: 'damage',
    wind: 'frizz',
    humidity: 'frizz',
    cold: 'breakage'
  }

  useEffect(() => {
    onAnswer(questionNumber, matches)
  }, [matches, questionNumber, onAnswer])

  const handleWeatherDrag = (weatherId: string) => {
    setDraggedWeather(weatherId)
  }

  const handleEffectHover = (effectId: string | null) => {
    setHoveredEffect(effectId)
  }

  const handleWeatherDrop = (effectId: string) => {
    if (!draggedWeather) return

    // Remove any existing match for this weather item
    const newMatches = matches.filter(match => match.weatherId !== draggedWeather)
    
    // Add new match
    newMatches.push({ weatherId: draggedWeather, effectId })
    
    setMatches(newMatches)
    setDraggedWeather(null)
    setHoveredEffect(null)
  }

  const removeMatch = (weatherId: string) => {
    setMatches(prev => prev.filter(match => match.weatherId !== weatherId))
  }

  const getMatchStatus = (weatherId: string) => {
    const match = matches.find(m => m.weatherId === weatherId)
    if (!match) return null
    
    const isCorrect = correctMatches[weatherId as keyof typeof correctMatches] === match.effectId
    return isCorrect ? 'correct' : 'incorrect'
  }

  const getCompletionPercentage = () => {
    return (matches.length / weatherItems.length) * 100
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

      <div className="max-w-6xl mx-auto">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weather Effects Puzzle</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getCompletionPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-gray-600">{matches.length} of {weatherItems.length} matches completed</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weather Icons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Weather Conditions</h3>
            <div className="grid grid-cols-2 gap-4">
              {weatherItems.map((weather, index) => {
                const match = matches.find(m => m.weatherId === weather.id)
                const isDragging = draggedWeather === weather.id
                
                return (
                  <motion.div
                    key={weather.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative"
                  >
                    <motion.div
                      className={`p-4 rounded-xl shadow-lg border-2 cursor-grab active:cursor-grabbing transition-all ${
                        match 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      } ${isDragging ? 'opacity-50 scale-95' : ''}`}
                      draggable
                      onDragStart={() => handleWeatherDrag(weather.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-4xl text-center mb-2">{weather.icon}</div>
                      <div className="text-center font-medium text-gray-800">{weather.label}</div>
                      
                      {/* Match Status */}
                      {match && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Effects */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Hair Effects</h3>
            <div className="grid grid-cols-2 gap-4">
              {effectItems.map((effect, index) => {
                const isHovered = hoveredEffect === effect.id
                const hasMatch = matches.some(m => m.effectId === effect.id)
                
                return (
                  <motion.div
                    key={effect.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-xl shadow-lg border-2 transition-all ${
                      hasMatch 
                        ? 'border-blue-500 bg-blue-50' 
                        : isHovered
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setHoveredEffect(effect.id)
                    }}
                    onDragLeave={() => setHoveredEffect(null)}
                    onDrop={() => handleWeatherDrop(effect.id)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💇‍♀️</div>
                      <div className="font-medium text-gray-800">{effect.label}</div>
                      
                      {/* Show matched weather */}
                      {hasMatch && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-blue-600"
                        >
                          {(() => {
                            const match = matches.find(m => m.effectId === effect.id)
                            const weather = weatherItems.find(w => w.id === match?.weatherId)
                            return weather ? `← ${weather.icon} ${weather.label}` : ''
                          })()}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Match Results */}
        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Matches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match, index) => {
                const weather = weatherItems.find(w => w.id === match.weatherId)
                const effect = effectItems.find(e => e.id === match.effectId)
                const status = getMatchStatus(match.weatherId)
                
                return (
                  <motion.div
                    key={`${match.weatherId}-${match.effectId}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-xl border-2 ${
                      status === 'correct' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{weather?.icon}</span>
                        <span className="font-medium">{weather?.label}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium">{effect?.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg ${status === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                          {status === 'correct' ? '✓' : '✗'}
                        </span>
                        <button
                          onClick={() => removeMatch(match.weatherId)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Completion Feedback */}
        {matches.length === weatherItems.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 border border-green-300 rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg">🎯</span>
              <span className="text-lg font-medium text-green-700">
                Puzzle completed! Great understanding of weather effects on hair.
              </span>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-blue-800 mb-3">💡 How to Play</h4>
          <div className="text-left text-blue-700 text-sm space-y-2">
            <p>• Drag weather icons to their corresponding hair effects</p>
            <p>• Each weather condition affects hair in specific ways</p>
            <p>• Complete all matches to finish the puzzle</p>
            <p>• Green checkmarks indicate correct matches</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PuzzleMatching
