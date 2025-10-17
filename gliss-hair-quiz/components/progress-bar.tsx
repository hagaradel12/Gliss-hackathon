"use client"

interface ProgressBarProps {
  progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Percentage */}
      <div className="text-5xl md:text-6xl font-light text-accent tracking-tight">{Math.round(progress)}%</div>

      {/* Gold Bar */}
      <div className="w-full max-w-md h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground mt-2">Question {Math.ceil((progress / 100) * 7)} of 7</p>
    </div>
  )
}
