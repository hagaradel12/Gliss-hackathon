import React from "react"

interface ResultsPageProps {
  answers: Record<number, any>
  apiResults: any
  onRetake: () => void
}

// Function to clean and format the LLM response
const cleanLLMResponse = (text: string): string => {
  if (!text) return ""
  
  return text
    // Remove markdown headers and formatting
    .replace(/#+\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    
    // Clean up section markers and extra whitespace
    .replace(/\*SECTION\s*\d+\s*-\s*\w+\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    
    // Split into paragraphs on double line breaks or bullet points
    .split(/\n\s*\n|\n•|\n-/)
    .filter(paragraph => paragraph.trim().length > 0)
    .map(paragraph => paragraph.trim())
    .join('\n\n')
}

// Function to get image path based on product name
const getProductImage = (productName: string): string => {
  if (!productName) return ""
  
  const productMap: Record<string, string> = {
    "Ultimate Repair": './images/ultimate.png',
    "Total Repair": './images/total.png', 
    "Oil Nutritive": './images/oil.png',
    "Aqua Revive": './images/aqua.png',
    "Supreme Length": './images/length.png',
  }
  
  // Find matching product name (case insensitive)
  const matchedKey = Object.keys(productMap).find(key => 
    productName.toLowerCase().includes(key.toLowerCase())
  )
  
  return matchedKey ? productMap[matchedKey] : ""
}

export default function ResultsPage({ apiResults, onRetake }: ResultsPageProps) {
  if (!apiResults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium">Preparing your personalized results... ✨</p>
        </div>
      </div>
    )
  }

  if (apiResults.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-xl border shadow-md text-center max-w-lg">
          <h1 className="text-2xl font-semibold text-foreground mb-3">Oops! 😅</h1>
          <p className="text-muted-foreground mb-6">{apiResults.error}</p>
          <button
            onClick={onRetake}
            className="bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-all font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const rec = apiResults.recommendations?.[0] || {}
  const productImage = getProductImage(rec.product_name)

  // Clean the responses
  const cleanReasoning = cleanLLMResponse(rec.reasoning)
  const cleanExplanation = cleanLLMResponse(rec.detailed_explanation)
  const cleanRoutine = cleanLLMResponse(rec.hair_routine)

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-foreground mb-2">
            +100% <span className="text-accent font-semibold">Stronger Hair</span>
          </h1>
          <p className="text-muted-foreground text-lg">a personalized recommenation that fits your needs</p>
        </div>

        {/* Product Section */}
        <div className="bg-background rounded-xl border shadow-lg p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Product Image */}
            {productImage && (
              <div className="flex-shrink-0">
                <img 
                  src={productImage} 
                  alt={rec.product_name}
                  className="w-48 h-48 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            
            {/* Product Details */}
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-accent mb-4">{rec.product_name}</h2>
              
              {/* Product Type and Size if available */}
              {(rec.product_type || rec.size) && (
                <div className="flex flex-wrap gap-4 text-lg mb-4">
                  {rec.product_type && (
                    <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                      {rec.product_type}
                    </span>
                  )}
                  {rec.size && (
                    <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                      {rec.size}
                    </span>
                  )}
                </div>
              )}
              
              {/* Key Ingredients if available */}
              {rec.key_ingredients && (
                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Key Ingredients:</h4>
                  <p className="text-white">{rec.key_ingredients}</p>
                </div>
              )}
              
              {/* Reasoning */}
              {cleanReasoning && (
                <p className="text-white text-lg leading-relaxed italic">
                  💬 {cleanReasoning}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Explanation */}
        {cleanExplanation && (
          <div className="bg-background rounded-xl border p-8 mb-10 shadow-sm">
            <h3 className="text-2xl font-semibold text-white mb-4">🔍 Detailed Explanation</h3>
            <div className="space-y-3 text-white leading-relaxed">
              {cleanExplanation
                .split("\n")
                .filter((line: string) => line.trim() !== "")
                .map((line: string, idx: number) => (
                  <p key={idx} className="text-base">{line}</p>
                ))}
            </div>
          </div>
        )}

        {/* Routine Section */}
        {cleanRoutine && (
          <div className="bg-background rounded-xl border p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">💆 Hair Care Routine</h3>
            <div className="space-y-4 text-white leading-relaxed">
              {cleanRoutine
                .split("\n")
                .filter((line: string) => line.trim() !== "")
                .map((line: string, idx: number) => (
                  <p key={idx} className="text-base">{line}</p>
                ))}
            </div>
          </div>
        )}

        {/* Retake Button */}
        <div className="text-center mt-12">
          <button
            onClick={onRetake}
            className="px-10 py-4 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 shadow-lg transition-all duration-300"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  )
}