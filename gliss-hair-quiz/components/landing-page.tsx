"use client"

interface LandingPageProps {
  onStart: () => void
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-16">
        <h1 className="text-6xl font-bold text-accent tracking-wider">GLISS</h1>
      </div>

      {/* Main Text */}
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
          Discover Your <span className="text-accent font-semibold">Perfect Hair</span>
        </h2>
        <p className="text-lg text-muted-foreground font-light">
          Take our personalized quiz to understand your hair type and receive tailored recommendations for stronger,
          healthier hair.
        </p>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="mt-8 px-12 py-4 bg-accent text-background font-semibold text-lg rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Start Quiz
      </button>

      {/* Decorative Line */}
      <div className="mt-16 w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
    </div>
  )
}
