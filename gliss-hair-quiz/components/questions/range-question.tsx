"use client"

interface RangeQuestionProps {
  options: Array<{ label: string; value: string }>
  answer: string
  onAnswer: (value: string) => void
}

export default function RangeQuestion({ options, answer, onAnswer }: RangeQuestionProps) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {options.map((option, index) => (
        <div key={option.value} className="flex items-center gap-4">
          <div className="flex-1 h-1 bg-muted rounded-full"></div>
          <button
            onClick={() => onAnswer(option.value)}
            className={`px-8 py-3 rounded-full font-light transition-all duration-300 whitespace-nowrap ${
              answer === option.value
                ? "bg-accent text-background shadow-lg"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {option.label}
          </button>
          <div className="flex-1 h-1 bg-muted rounded-full"></div>
        </div>
      ))}
    </div>
  )
}
