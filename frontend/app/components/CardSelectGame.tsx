"use client"

interface Question1Props {
  onAnswer: (answer: string[]) => void
  onSkip: () => void
  currentAnswer?: string[]
}

export default function Question1({ onAnswer, onSkip, currentAnswer = [] }: Question1Props) {
  const conditions = ["Dry", "Oily", "Colored", "Damaged"]

  const toggleCondition = (condition: string) => {
    const updated = currentAnswer.includes(condition)
      ? currentAnswer.filter((c) => c !== condition)
      : [...currentAnswer, condition]
    onAnswer(updated)
  }

  return (
    <div>
      <h2 className="text-4xl font-black text-black mb-2">Hair Condition</h2>
      <p className="text-gray-600 mb-10 font-semibold text-lg">Select all that apply to your hair</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {conditions.map((condition) => (
          <button
            key={condition}
            onClick={() => toggleCondition(condition)}
            className={`p-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
              currentAnswer.includes(condition)
                ? "bg-black text-yellow-400 shadow-lg border-2 border-yellow-400"
                : "bg-gray-100 text-black hover:bg-gray-200 border-2 border-transparent"
            }`}
          >
            {condition}
          </button>
        ))}
      </div>

      <button
        onClick={onSkip}
        className="w-full text-gray-500 hover:text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all text-sm uppercase tracking-wider"
      >
        Skip Question
      </button>
    </div>
  )
}
