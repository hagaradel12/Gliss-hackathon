"use client"

interface MatchingQuestionProps {
  options: Array<{ label: string; value: string }>
  answer: string
  onAnswer: (value: string) => void
}

export default function MatchingQuestion({ options, answer, onAnswer }: MatchingQuestionProps) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onAnswer(option.value)}
          className={`p-6 rounded-lg font-light text-lg transition-all duration-300 ${
            answer === option.value
              ? "bg-accent text-background shadow-lg scale-105"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
