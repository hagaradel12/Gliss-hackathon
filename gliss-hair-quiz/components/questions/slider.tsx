"use client"

import { useState } from 'react'

interface RangeQuestionProps {
  options: Array<{ label: string; value: string }>
  answer: string[]
  onAnswer: (value: string[]) => void
}

export default function SlideQuestion({ options, answer = [], onAnswer }: RangeQuestionProps) {
  const [value, setValue] = useState(0)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    setValue(newValue)
    
    // Map slider value to option
    let selectedOption = ''
    if (newValue >= 75) {
      selectedOption = options[0].value // "Yeess, always a fight with the hairbrush"
    } else if (newValue >= 50) {
      selectedOption = options[1].value // "Sometimes"
    } else if (newValue >= 25) {
      selectedOption = options[2].value // "Not really"
    } else {
      selectedOption = options[3].value // "Nope, it's chill"
    }
    
    onAnswer([selectedOption])
  }

  const getOptionLabel = (val: number) => {
    if (val >= 75) return options[0].label
    if (val >= 50) return options[1].label
    if (val >= 25) return options[2].label
    return options[3].label
  }

  const getEmojiForValue = (val: number) => {
    if (val >= 75) return '😩'
    if (val >= 50) return '😐'
    if (val >= 25) return '🙂'
    return '😊'
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Current Selection Display */}
      <div className="mb-8">
        <div className="text-4xl mb-2">{getEmojiForValue(value)}</div>
        <div className="text-lg font-medium text-white">
          {getOptionLabel(value)}
        </div>
      </div>

      {/* Range Slider */}
      <div className="mb-6">
        <div className="relative">
          {/* Slider Track */}
          <div className="h-3 bg-muted-foreground rounded-full">
            {/* Filled Track */}
            <div 
              className="h-3 bg-gray-800 rounded-full absolute top-0 left-0"
              style={{ width: `${value}%` }}
            />
          </div>
          
          {/* Slider Thumb */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleSliderChange}
            className="absolute top-1/2 left-0 w-full h-3 -translate-y-1/2 appearance-none bg-transparent cursor-pointer"
            style={{
              background: 'transparent'
            }}
          />
          
          {/* Custom Thumb */}
          <div 
            className="absolute top-1/2 w-6 h-6 bg-white border-2 border-gray-800 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
            style={{ left: `${value}%` }}
          />
        </div>
      </div>

      {/* Option Labels */}
      <div className="flex justify-between text-xs text-gray-300 mt-6 px-2">
        <span className="text-center w-16">Never</span>
        <span className="text-center w-16">Rarely</span>
        <span className="text-center w-16"> Somewhat</span>
        <span className="text-center w-16">Very Tangled</span>
      </div>

      {/* Tick Marks */}
      <div className="flex justify-between px-2 mt-2">
        {[0, 25, 50, 75, 100].map((tick) => (
          <div key={tick} className="flex flex-col items-center">
            <div className="w-px h-2 bg-gray-500"></div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-400">
        <p>Slide to indicate how often your hair gets tangled</p>
      </div>

    </div>
    
  )
}