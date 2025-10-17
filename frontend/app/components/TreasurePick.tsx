'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TreasurePickProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

interface TreasureOrb {
  id: string
  goal: string
  emoji: string
  color: string
  description: string
  glowColor: string
}

const TreasurePick = ({ question, questionNumber, onAnswer, currentAnswer }: TreasurePickProps) => {
  const [selectedOrb, setSelectedOrb] = useState<string | null>(currentAnswer || null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (selectedOrb) {
      onAnswer(questionNumber, selectedOrb.toLowerCase())
    }
  }, [selectedOrb, questionNumber, onAnswer])

  const treasureOrbs: TreasureOrb[] = [
    {
      id: 'repair',
      goal: 'Repair',
      emoji: '🔧',
      color: 'from-red-400 to-rose-500',
      description: 'Fix damage and strengthen hair',
      glowColor: 'shadow-red-500/50'
    },
    {
      id: 'smooth',
      goal: 'Smooth',
      emoji: '✨',
      color: 'from-blue-400 to-cyan-500',
      description: 'Reduce frizz and add silkiness',
      glowColor: 'shadow-blue-500/50'
    },
    {
      id: 'shine',
      goal: 'Shine',
      emoji: '💎',
      color: 'from-purple-400 to-pink-500',
      description: 'Add luster and radiance',
      glowColor: 'shadow-purple-500/50'
    },
    {
      id: 'volume',
      goal: 'Volume',
      emoji: '📈',
      color: 'from-green-400 to-emerald-500',
      description: 'Add body and fullness',
      glowColor: 'shadow-green-500/50'
    }
  ]

  const handleOrbClick = (orbId: string) => {
    setSelectedOrb(orbId)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
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
        {/* Treasure Chamber */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Magical Background Effects */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              🏰 Choose Your Magical Hair Goal 🏰
            </h3>

            {/* Treasure Orbs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {treasureOrbs.map((orb, index) => {
                const isSelected = selectedOrb === orb.id
                
                return (
                  <motion.div
                    key={orb.id}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.1 * index,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    className="relative cursor-pointer"
                    onClick={() => handleOrbClick(orb.id)}
                  >
                    <motion.div
                      className={`treasure-orb w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-2xl relative ${
                        isSelected ? `animate-pulse-glow ${orb.glowColor}` : ''
                      }`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, -5, 0],
                        transition: { duration: 0.5 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Orb Glow Effect */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      )}

                      <div className="text-4xl mb-2 relative z-10">{orb.emoji}</div>
                      <div className="text-lg font-bold relative z-10">{orb.goal}</div>
                      
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
                    </motion.div>

                    {/* Orb Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + 0.1 * index }}
                      className="mt-4 text-center"
                    >
                      <p className="text-white/80 text-sm font-medium">{orb.description}</p>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="text-8xl animate-bounce">🎉</div>
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-100, 100],
                    opacity: [1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selection Feedback */}
        {selectedOrb && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl">
              <span className="text-2xl">
                {treasureOrbs.find(o => o.id === selectedOrb)?.emoji}
              </span>
              <span className="text-xl font-bold text-gray-800">
                {treasureOrbs.find(o => o.id === selectedOrb)?.goal} Goal Selected!
              </span>
              <span className="text-2xl">✨</span>
            </div>
          </motion.div>
        )}

        {/* Goal Inspiration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-purple-800 mb-3">🌟 Your Hair Journey</h4>
          <p className="text-purple-700 text-sm">
            {selectedOrb 
              ? `Focus on ${treasureOrbs.find(o => o.id === selectedOrb)?.description.toLowerCase()} to achieve your ${treasureOrbs.find(o => o.id === selectedOrb)?.goal} goal.`
              : "Choose your main hair goal to get personalized product recommendations that will help you achieve the results you're looking for."
            }
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default TreasurePick
