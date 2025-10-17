"use client"

import { useState, useEffect } from 'react'

interface MultiSelectQuestionProps {
  options: Array<{ label: string; value: string }>
  answer: string[]
  onAnswer: (value: string[]) => void
}

export default function MultiSelectQuestion({ options, answer = [], onAnswer }: MultiSelectQuestionProps) {
  const [brushPosition, setBrushPosition] = useState({ x: 50, y: 50 })
  const [tangles, setTangles] = useState<Array<{ id: number; x: number; y: number; solved: boolean }>>([])
  const [brushProgress, setBrushProgress] = useState(0)
  const [isBrushing, setIsBrushing] = useState(false)

  // Initialize tangles when component mounts
  useEffect(() => {
    const initialTangles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 20,
      solved: false
    }))
    setTangles(initialTangles)
  }, [])

  const handleHairBrush = (e: React.MouseEvent) => {
    if (!isBrushing) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setBrushPosition({ x, y })

    // Check if brush is near any tangles
    setTangles(prev => prev.map(tangle => {
      if (tangle.solved) return tangle
      
      const distance = Math.sqrt(Math.pow(tangle.x - x, 2) + Math.pow(tangle.y - y, 2))
      if (distance < 8) {
        setBrushProgress(prev => Math.min(prev + 12.5, 100))
        return { ...tangle, solved: true }
      }
      return tangle
    }))
  }

  const handleGameComplete = () => {
    // Map game result to answer
    if (brushProgress >= 100) {
      onAnswer([options[0].value]) // "Yeess, always a fight with the hairbrush"
    } else if (brushProgress >= 50) {
      onAnswer([options[1].value]) // "Sometimes"
    } else if (brushProgress >= 25) {
      onAnswer([options[2].value]) // "Not really"
    } else {
      onAnswer([options[3].value]) // "Nope, it's chill"
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>🔄 Tangled</span>
          <span>✨ Smooth</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-red-500 via-orange-400 to-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${brushProgress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Brush Progress: {Math.round(brushProgress)}%
        </div>
      </div>

      {/* Hair Brushing Game */}
      <div className="relative mb-8">
        <div 
          className="relative w-full h-64 bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-200 overflow-hidden cursor-crosshair"
          onMouseMove={handleHairBrush}
          onMouseDown={() => setIsBrushing(true)}
          onMouseUp={() => setIsBrushing(false)}
          onMouseLeave={() => setIsBrushing(false)}
        >
          {/* Hair Strands */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 bg-gradient-to-b from-amber-300 to-amber-500 opacity-40"
                style={{
                  left: `${10 + (i * 4)}%`,
                  height: '80%',
                  top: '10%',
                  transform: `rotate(${Math.sin(i) * 5}deg)`
                }}
              />
            ))}
          </div>

          {/* Tangles */}
          {tangles.map(tangle => (
            <div
              key={tangle.id}
              className={`absolute w-6 h-6 transition-all duration-300 ${
                tangle.solved 
                  ? 'opacity-0 scale-0' 
                  : 'animate-pulse'
              }`}
              style={{ left: `${tangle.x}%`, top: `${tangle.y}%` }}
            >
              <div className="text-2xl">🌀</div>
            </div>
          ))}

          {/* Hair Brush Cursor */}
          <div
            className="absolute w-8 h-8 pointer-events-none transition-transform duration-100"
            style={{ 
              left: `${brushPosition.x}%`, 
              top: `${brushPosition.y}%`,
              transform: `translate(-50%, -50%) ${isBrushing ? 'scale(1.2)' : 'scale(1)'}`
            }}
          >
            <div className="text-3xl">🪮</div>
          </div>

          {/* Brushing Effect */}
          {isBrushing && (
            <div
              className="absolute w-12 h-12 bg-yellow-200 rounded-full opacity-20 pointer-events-none animate-ping"
              style={{ 
                left: `${brushPosition.x}%`, 
                top: `${brushPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {isBrushing ? "Brushing out tangles... 💪" : "Click and drag to brush the hair! 🪮"}
        </p>
      </div>

      {/* Game Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">🎮 Mini-Game Instructions</h3>
        <p className="text-blue-700 text-sm">
          Brush the hair to remove tangles! Your brushing performance will determine your answer:
        </p>
        <ul className="text-blue-600 text-xs mt-2 space-y-1">
          <li>• 100% = "Yeess, always a fight with the hairbrush"</li>
          <li>• 50%+ = "Sometimes"</li>
          <li>• 25%+ = "Not really"</li>
          <li>• Less = "Nope, it's chill"</li>
        </ul>
      </div>

      {/* Complete Button */}
      <button
        onClick={handleGameComplete}
        disabled={brushProgress === 0}
        className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {brushProgress === 0 ? "Start Brushing!" : 
         brushProgress >= 100 ? "Perfect! Complete 🎉" : 
         "That's Enough! Continue"}
      </button>

      {/* Quick Skip Option */}
      <button
        onClick={() => onAnswer([])}
        className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Skip mini-game and choose manually
      </button>
    </div>
  )
}