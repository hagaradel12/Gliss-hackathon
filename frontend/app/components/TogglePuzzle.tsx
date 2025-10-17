'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TogglePuzzleProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

interface ToggleOption {
  id: string
  label: string
  icon: string
  description: string
  color: string
  active: boolean
}

const TogglePuzzle = ({ question, questionNumber, onAnswer, currentAnswer }: TogglePuzzleProps) => {
  const [toggles, setToggles] = useState<ToggleOption[]>([])

  useEffect(() => {
    const optionMap = {
      'Heat Styling': { 
        icon: '🔥', 
        description: 'Blow drying, flat ironing, curling',
        color: 'from-red-400 to-orange-500'
      },
      'Coloring': { 
        icon: '🎨', 
        description: 'Hair dye, highlights, bleaching',
        color: 'from-purple-400 to-pink-500'
      },
      'Frequent Washing': { 
        icon: '💧', 
        description: 'Washing hair daily or every other day',
        color: 'from-blue-400 to-cyan-500'
      },
      'Professional Treatments': { 
        icon: '✨', 
        description: 'Keratin, perms, relaxers',
        color: 'from-indigo-400 to-violet-500'
      }
    }

    const initialToggles: ToggleOption[] = question.options.map((option: string) => ({
      id: option.toLowerCase().replace(' ', '_'),
      label: option,
      icon: optionMap[option as keyof typeof optionMap]?.icon || '💇‍♀️',
      description: optionMap[option as keyof typeof optionMap]?.description || '',
      color: optionMap[option as keyof typeof optionMap]?.color || 'from-gray-400 to-gray-500',
      active: currentAnswer?.[option.toLowerCase().replace(' ', '_')] || false
    }))

    setToggles(initialToggles)
  }, [question.options, currentAnswer])

  useEffect(() => {
    const answer = toggles.reduce((acc, toggle) => {
      acc[toggle.id] = toggle.active
      return acc
    }, {} as Record<string, boolean>)
    
    onAnswer(questionNumber, answer)
  }, [toggles, questionNumber, onAnswer])

  const toggleOption = (id: string) => {
    setToggles(prev => prev.map(toggle => 
      toggle.id === id ? { ...toggle, active: !toggle.active } : toggle
    ))
  }

  const getCareLevel = () => {
    const activeCount = toggles.filter(t => t.active).length
    if (activeCount === 0) return { level: 'Low', color: 'text-green-600', emoji: '😌' }
    if (activeCount === 1) return { level: 'Moderate', color: 'text-yellow-600', emoji: '😊' }
    if (activeCount === 2) return { level: 'High', color: 'text-orange-600', emoji: '😅' }
    return { level: 'Very High', color: 'text-red-600', emoji: '😱' }
  }

  const careLevel = getCareLevel()

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
        {/* Care Level Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100"
        >
          <div className="text-center">
            <motion.div
              key={careLevel.level}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl mb-4"
            >
              {careLevel.emoji}
            </motion.div>
            <h3 className={`text-2xl font-bold ${careLevel.color} mb-2`}>
              {careLevel.level} Care Level
            </h3>
            <p className="text-gray-600">
              {toggles.filter(t => t.active).length} of {toggles.length} intensive practices
            </p>
          </div>
        </motion.div>

        {/* Toggle Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toggles.map((toggle, index) => (
            <motion.div
              key={toggle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <div
                className={`toggle-button cursor-pointer transition-all duration-300 rounded-2xl p-6 shadow-lg border-2 ${
                  toggle.active 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => toggleOption(toggle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-4xl ${toggle.active ? 'animate-bounce' : ''}`}>
                      {toggle.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{toggle.label}</h4>
                      <p className={`text-sm ${toggle.active ? 'text-white/80' : 'text-gray-500'}`}>
                        {toggle.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <div className={`relative w-16 h-8 rounded-full transition-colors ${
                    toggle.active ? 'bg-white' : 'bg-gray-300'
                  }`}>
                    <motion.div
                      className="absolute top-1 w-6 h-6 bg-purple-500 rounded-full shadow-md"
                      animate={{
                        x: toggle.active ? 32 : 4
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>

                {/* Active Indicator */}
                {toggle.active && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-green-500 text-lg">✓</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Care Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-blue-800 mb-3">💡 Care Level Tips</h4>
          <div className="text-left text-blue-700 text-sm space-y-2">
            {careLevel.level === 'Low' && (
              <>
                <p>• Your hair gets gentle, minimal treatment</p>
                <p>• Focus on maintenance and prevention</p>
              </>
            )}
            {careLevel.level === 'Moderate' && (
              <>
                <p>• Some styling or chemical exposure</p>
                <p>• Use protective products and treatments</p>
              </>
            )}
            {careLevel.level === 'High' && (
              <>
                <p>• Significant styling or chemical damage risk</p>
                <p>• Regular deep conditioning and heat protection essential</p>
              </>
            )}
            {careLevel.level === 'Very High' && (
              <>
                <p>• Heavy styling and chemical exposure</p>
                <p>• Professional treatments and intensive repair needed</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Selection Summary */}
        {toggles.some(t => t.active) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg">⚙️</span>
              <span className="text-lg font-medium text-gray-700">
                {toggles.filter(t => t.active).length} intensive practices selected
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TogglePuzzle
