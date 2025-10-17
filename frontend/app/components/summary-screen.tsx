"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface SummaryScreenProps {
  questions: Array<{
    id: number
    question: string
    type: string
    options: string[]
  }>
  answers: string[]
  onRestart: () => void
}

export default function SummaryScreen({ questions, answers, onRestart }: SummaryScreenProps) {
  const getRecommendedProduct = () => {
    const damageLevel = answers[1] || ""
    const hairGoal = answers[5] || ""

    if (damageLevel.includes("Severely") || damageLevel.includes("Moderately")) {
      return {
        name: "Gliss Repair Intensive",
        description: "Deep repair treatment for damaged hair",
        routine: [
          "Use 2-3 times per week",
          "Apply to damp hair, focus on ends",
          "Leave for 10-15 minutes",
          "Rinse thoroughly with cool water",
        ],
      }
    } else if (hairGoal.includes("Shine")) {
      return {
        name: "Gliss Shine Serum",
        description: "Luminous shine and smoothness",
        routine: [
          "Apply to damp hair before styling",
          "Use a small amount on ends",
          "Blow dry for maximum shine",
          "Reapply as needed throughout the day",
        ],
      }
    } else {
      return {
        name: "Gliss Daily Care",
        description: "Complete hair care solution",
        routine: [
          "Use daily shampoo and conditioner",
          "Apply treatment once per week",
          "Use heat protectant before styling",
          "Finish with shine spray",
        ],
      }
    }
  }

  const recommendedProduct = getRecommendedProduct()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-white/85 backdrop-blur-md shadow-2xl p-8 md:p-12 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, transparent 50%)",
        }}
      />

      {/* Main Slogan */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="text-6xl md:text-7xl font-bold text-amber-900 mb-2">100%</div>
        <h2 className="text-4xl md:text-5xl font-light text-amber-900 mb-4">Stronger Hair</h2>
        <p className="text-amber-700 text-lg">Your personalized hair care journey starts here</p>
      </motion.div>

      {/* Recommended Product */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-8 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 mb-8 relative z-10"
      >
        <h3 className="text-2xl font-bold text-amber-950 mb-2">{recommendedProduct.name}</h3>
        <p className="text-amber-800 mb-6">{recommendedProduct.description}</p>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-amber-950 mb-4">Your Recommended Routine:</h4>
          <ul className="space-y-3">
            {recommendedProduct.routine.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 text-amber-900"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <span>{step}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Summary of Answers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8 relative z-10"
      >
        <h4 className="text-lg font-semibold text-amber-950 mb-4">Your Hair Profile:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          {questions.map((question, index) => (
            <div key={question.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs font-medium text-amber-700 mb-1">{question.question}</p>
              <p className="text-sm font-semibold text-amber-950">{answers[index] || "Not answered"}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row relative z-10">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
        >
          Retake Quiz
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-semibold">
          Shop Recommended Products
        </Button>
      </div>
    </motion.div>
  )
}
