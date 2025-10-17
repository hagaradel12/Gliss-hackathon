"use client"

interface NavigationButtonsProps {
  onNext: () => void
  onPrevious: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  isLastQuestion: boolean
}

export default function NavigationButtons({
  onNext,
  onPrevious,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8 md:gap-12">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          canGoPrevious
            ? "bg-muted text-foreground hover:bg-accent hover:text-background cursor-pointer"
            : "bg-muted/50 text-muted-foreground cursor-not-allowed"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          canGoNext
            ? "bg-accent text-background hover:bg-accent/90 cursor-pointer shadow-lg"
            : "bg-muted/50 text-muted-foreground cursor-not-allowed"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
