"use client"

interface MCQQuestionProps {
  options: Array<{ label: string; value: string }>
  answer: string
  onAnswer: (value: string) => void
}

export default function MCQQuestion({ options, answer, onAnswer }: MCQQuestionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onAnswer(option.value)}
          className={`p-6 rounded-lg font-light text-base transition-all duration-300 ${
            answer === option.value
              ? "bg-accent text-background shadow-lg"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
