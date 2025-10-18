"use client"

import { useState } from 'react'

interface SingleSelectQuestionProps {
  options: Array<{ label: string; value: string }>
  answer: string[]
  onAnswer: (value: string[]) => void
}

export default function DreamGoalQuestion({ options, answer = [], onAnswer }: SingleSelectQuestionProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>(answer[0] || '')

  const handleGoalSelect = (value: string) => {
    const newSelection = value === selectedGoal ? '' : value // Toggle selection
    setSelectedGoal(newSelection)
    onAnswer(newSelection ? [newSelection] : []) // Send as array with one item or empty
  }

  const getColorForGoal = (value: string) => {
    const colorMap: Record<string, string> = {
      'strong_healthy': 'from-blue-400 to-blue-600',
      'long_luscious': 'from-pink-400 to-pink-600',
      'smooth_frizz_free': 'from-yellow-400 to-yellow-600',
      'shiny_glossy': 'from-yellow-400 to-yellow-600',
      'bouncy_volume': 'from-purple-400 to-purple-600',
      'damage_repair_healing': 'from-indigo-400 to-blue-600'
    }
    return colorMap[value] || 'from-gray-400 to-gray-600'
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl font-light text-white mb-4">
          What's your dream hair goal?
        </h2>
        <p className="text-gray-400">
          Choose your primary hair goal
        </p>
        <div className="mt-2 text-sm text-gray-500">
          {selectedGoal ? '1/1 selected' : '0/1 selected'}
        </div>
      </div>

      {/* Circular Goals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {options.map((option) => {
          const isSelected = selectedGoal === option.value
          const gradient = getColorForGoal(option.value)
          
          return (
            <button
              key={option.value}
              onClick={() => handleGoalSelect(option.value)}
              className={`
                relative group flex flex-col items-center justify-center p-6 rounded-3xl
                transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? `bg-gradient-to-br ${gradient} shadow-2xl scale-105 border-2 border-white/30` 
                  : 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600'
                }
                cursor-pointer
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              )}

              {/* Label */}
              <div className={`
                font-medium text-sm transition-colors duration-300
                ${isSelected ? 'text-white' : 'text-gray-300'}
              `}>
                {option.label}
              </div>

              {/* Hover Effect */}
              {!isSelected && (
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Goal Preview */}
      {selectedGoal && (
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Your Dream Goal:
          </h3>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-gray-700 px-6 py-3 rounded-full">
              <span className="text-white text-lg font-medium">
                {options.find(opt => opt.value === selectedGoal)?.label}
              </span>
              <button
                onClick={() => handleGoalSelect(selectedGoal)}
                className="w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center text-sm text-white"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          💡 Tip: Choose the goal that matters most for your hair journey
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => {
            setSelectedGoal('')
            onAnswer([])
          }}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          Clear Selection
        </button>
        
        {!selectedGoal && (
          <button
            onClick={() => {
              // Auto-select a common goal
              const commonGoal = 'strong_healthy'
              setSelectedGoal(commonGoal)
              onAnswer([commonGoal])
            }}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors text-sm"
          >
            Suggest a Goal
          </button>
        )}
      </div>
    </div>
  )
}