'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Sparkles, Heart, ShoppingBag, ArrowLeft, Share2 } from 'lucide-react'

interface Recommendation {
  product_name: string
  brand: string
  category: string
  score: float
  reasoning: string
  confidence: string
}

interface RecommendationsData {
  session_id: string
  recommendations: Recommendation[]
  timestamp: string
}

interface ResultsPageProps {
  recommendations: RecommendationsData
}

const ResultsPage = ({ recommendations }: ResultsPageProps) => {
  const [currentRecommendation, setCurrentRecommendation] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 8) return '🌟'
    if (score >= 6) return '⭐'
    return '💫'
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'shampoo': return '🧴'
      case 'conditioner': return '💧'
      case 'treatment': return '✨'
      default: return '💇‍♀️'
    }
  }

  const handleRestart = () => {
    window.location.reload()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Hair Advisor Results',
        text: `I got personalized hair product recommendations! Check out ${recommendations.recommendations[0]?.product_name} for my hair type.`,
        url: window.location.href
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Results link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-8 w-8 text-purple-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Hair Results
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Start Over</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Personalized Hair Recommendations!</h2>
          <p className="text-lg text-gray-600">
            Based on your responses, we've found the perfect products for your hair type and concerns.
          </p>
        </motion.div>

        {/* Recommendations Carousel */}
        <div className="space-y-8">
          {recommendations.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100"
            >
              {/* Recommendation Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{getCategoryIcon(rec.category)}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{rec.product_name}</h3>
                    <p className="text-lg text-gray-600">{rec.brand} • {rec.category}</p>
                  </div>
                </div>
                
                {/* Score and Confidence */}
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(rec.score)} mb-2`}>
                    {getScoreEmoji(rec.score)} {rec.score}/10
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceColor(rec.confidence)}`}>
                    {rec.confidence} Confidence
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">✨ Why this product is perfect for you:</h4>
                <p className="text-gray-700 leading-relaxed">{rec.reasoning}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Find This Product</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
                  <Heart className="h-5 w-5" />
                  <span>Save to Favorites</span>
                </button>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-all"
                >
                  <span>Learn More</span>
                </button>
              </div>

              {/* Additional Details */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <h5 className="font-semibold text-gray-800 mb-3">📋 Product Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Category:</strong> {rec.category}
                      </div>
                      <div>
                        <strong>Match Score:</strong> {rec.score}/10
                      </div>
                      <div>
                        <strong>Confidence Level:</strong> {rec.confidence}
                      </div>
                      <div>
                        <strong>Recommended For:</strong> Your hair profile
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Hair Profile Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-800 mb-2">Perfect Match</h4>
              <p className="text-sm text-gray-600">
                Top recommendation scored {recommendations.recommendations[0]?.score}/10
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">🔬</div>
              <h4 className="font-bold text-gray-800 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">
                Advanced analysis of your hair profile
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <h4 className="font-bold text-gray-800 mb-2">Personalized</h4>
              <p className="text-sm text-gray-600">
                Tailored to your specific needs
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-green-800 mb-3">🌟 Next Steps</h4>
          <div className="text-left text-green-700 text-sm space-y-2">
            <p>• Try the recommended products for 4-6 weeks to see results</p>
            <p>• Follow the product instructions for best results</p>
            <p>• Consider consulting a hair professional for personalized advice</p>
            <p>• Come back in a few weeks to update your hair assessment</p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-lg font-medium"
          >
            <Sparkles className="h-5 w-5" />
            <span>Take the Quiz Again</span>
          </button>
        </motion.div>
      </main>
    </div>
  )
}

export default ResultsPage
