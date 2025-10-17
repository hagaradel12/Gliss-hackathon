"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getThemeForQuestion } from "@/lib/product-themes"
import CardSelectGame from "./questions/CardSelectGame"
import DamageSlider from "./questions/DamageSlider"
import SwipeChoice from "./questions/SwipeChoice"
import DragRank from "./questions/DragRankGame"
import TogglePuzzle from "./questions/TogglePuzzle"
import TreasurePick from "./questions/TreasurePick"
import EmojiSelector from "./questions/EmojiSelector"
import PuzzleMatching from "./questions/PuzzleMatching"
import CharacterBuilder from "./questions/CharacterBuilder"
import ChatInput from "./questions/ChatInput"

interface QuestionCardProps {
  question: {
    id: number
    question: string
    type: string
    options: string[]
  }
  currentQuestion: number
  totalQuestions: number
  selectedAnswer?: string
  onAnswer: (answer: string) => void
  onNext: () => void
  onPrevious: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  progressPercentage: number
}

export default function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
  canGoPrevious,
  canGoNext,
  progressPercentage,
}: QuestionCardProps) {
  const theme = getThemeForQuestion(currentQuestion)

  const renderGameComponent = () => {
    switch (question.type) {
      case "card-select":
        return <CardSelectGame options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "damage-slider":
        return <DamageSlider options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "swipe-choice":
        return <SwipeChoice options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "drag-rank":
        return <DragRank options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "toggle-puzzle":
        return <TogglePuzzle options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "treasure-pick":
        return <TreasurePick options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "emoji-selector":
        return <EmojiSelector options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "puzzle-matching":
        return <PuzzleMatching options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "character-builder":
        return <CharacterBuilder options={question.options} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      case "chat-input":
        return <ChatInput selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl ${theme.cardBg} backdrop-blur-md shadow-2xl p-8 md:p-12 relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${theme.accentColor}40 0%, ${theme.accentColor}20 50%, ${theme.accentColor}10 100%), linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.1) 100%)`,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, transparent 50%)",
        }}
      />

      <div className="mb-12 relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-7xl md:text-8xl font-bold ${theme.textColor} mb-2`}
        >
          {progressPercentage}%
        </motion.div>
        <div
          className={`w-full h-2 rounded-full overflow-hidden`}
          style={{ backgroundColor: `${theme.accentColor}20` }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${theme.progressColor} rounded-full`}
          />
        </div>
      </div>

      {/* Question */}
      <motion.h2
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`text-2xl md:text-3xl font-light ${theme.textColor} mb-8 text-balance relative z-10`}
      >
        {question.question}
      </motion.h2>

      {/* Game Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-10 relative z-10"
      >
        {renderGameComponent()}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between relative z-10">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          className={`flex-1 border-2 ${theme.textColor} hover:${theme.optionHoverBg} disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            borderColor: theme.accentColor,
            backgroundColor: `${theme.accentColor}10`,
          }}
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex-1 bg-gradient-to-r ${theme.buttonBg} hover:${theme.buttonHover} ${theme.textColor} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {currentQuestion === totalQuestions ? "See Results" : "Next"}
        </Button>
      </div>
    </motion.div>
  )
}
