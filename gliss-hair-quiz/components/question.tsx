"use client"

import MatchingQuestion from "@/components/questions/matching-question"
import RangeQuestion from "@/components/questions/range-question"
import MCQQuestion from "@/components/questions/mcq-question"
import MultiSelectQuestion from "@/components/questions/multi-select-question"
import SlideQuestion from "./questions/slider"
import DreamGoalQuestion from "./questions/bubbleQuestion"

interface QuestionProps {
  question: any
  answer: any
  onAnswer: (value: any) => void
}

export default function Question({ question, answer, onAnswer }: QuestionProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-light text-foreground mb-12 leading-tight max-w-3xl mx-auto">
        {question.question}
      </h2>

      {question.type === "matching" && (
        <MatchingQuestion options={question.options} answer={answer} onAnswer={onAnswer} />
      )}
      {question.type === "range" && <RangeQuestion options={question.options} answer={answer} onAnswer={onAnswer} />}
      {question.type === "mcq" && <MCQQuestion options={question.options} answer={answer} onAnswer={onAnswer} />}
      {question.type === "multi-select" && (
        <MultiSelectQuestion options={question.options} answer={answer} onAnswer={onAnswer} />
      )}
      {question.type === "slide" && <SlideQuestion options={question.options} answer={answer} onAnswer={onAnswer} />}
      {question.type === "bubble" && <DreamGoalQuestion options={question.options} answer={answer} onAnswer={onAnswer} />}
    </div>
  )
}
