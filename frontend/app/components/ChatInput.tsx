'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, MessageCircle } from 'lucide-react'

interface ChatInputProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

const ChatInput = ({ question, questionNumber, onAnswer, currentAnswer }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState(currentAnswer || '')
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    onAnswer(questionNumber, inputValue)
  }, [inputValue, questionNumber, onAnswer])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    setIsTyping(true)
    
    // Clear typing indicator after a delay
    setTimeout(() => setIsTyping(false), 1000)
  }

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Could add animation or feedback here
      console.log('Submitted routine:', inputValue)
    }
  }

  const getPromptSuggestions = () => [
    "I wash my hair every other day and use heat styling tools",
    "I have a simple routine - just shampoo and conditioner",
    "I bleach my hair monthly and use professional treatments",
    "I'm looking for products to reduce frizz in humid weather",
    "I want to improve my damaged hair from years of coloring"
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
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

      <div className="max-w-3xl mx-auto">
        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Chat Bubble */}
          <div className="chat-bubble rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tell us about your hair routine</h3>
                  <p className="text-white/80 text-sm">Share as much or as little as you'd like</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={question.placeholder || "Describe your current hair care routine, styling habits, or any specific issues..."}
                  className="w-full h-32 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-gray-800 placeholder-gray-500 border-2 border-transparent focus:border-white/50 focus:outline-none resize-none transition-all duration-300"
                />
                
                {/* Character Count */}
                <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                  {inputValue.length}/500
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className={`mt-4 flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  inputValue.trim()
                    ? 'bg-white text-purple-600 hover:bg-white/90 shadow-lg'
                    : 'bg-white/50 text-white/50 cursor-not-allowed'
                }`}
                whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
                whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
              >
                <Send className="w-4 h-4" />
                <span className="font-medium">Share My Routine</span>
              </motion.button>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center space-x-2 text-white/80"
                >
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-sm">Analyzing your routine...</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Prompt Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h4 className="text-lg font-semibold text-gray-700 mb-4">💡 Need inspiration? Try these examples:</h4>
          <div className="space-y-3">
            {getPromptSuggestions().map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-white/90 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-500 group-hover:animate-spin" />
                  <span className="text-gray-700 group-hover:text-purple-700 transition-colors">
                    {suggestion}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Input Guidelines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-blue-800 mb-3">🌟 What to share</h4>
          <div className="text-left text-blue-700 text-sm space-y-2">
            <p>• Your current hair care routine (shampoo, conditioner, treatments)</p>
            <p>• How often you wash and style your hair</p>
            <p>• Any styling tools or products you regularly use</p>
            <p>• Chemical treatments like coloring, perming, or straightening</p>
            <p>• Specific concerns or problems you're experiencing</p>
            <p>• Your hair goals and what you'd like to improve</p>
          </div>
        </motion.div>

        {/* Response Feedback */}
        {inputValue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 border border-green-300 rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg">✨</span>
              <span className="text-lg font-medium text-green-700">
                {inputValue.length > 50 ? 'Detailed routine shared!' : 'Routine noted!'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ChatInput
