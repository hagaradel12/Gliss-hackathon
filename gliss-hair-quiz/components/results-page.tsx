"use client"
import ProductCarousel from "@/components/product-carousel"

interface ResultsPageProps {
  answers: Record<number, any>
  apiResults: any
  onRetake: () => void
}

export default function ResultsPage({ answers, apiResults, onRetake }: ResultsPageProps) {
  // Show loading state while waiting for API results
  if (!apiResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Getting your personalized recommendations... ✨</p>
        </div>
      </div>
    )
  }

  // Show error state if API failed
  if (apiResults.error) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Oops! 😅</h1>
          <p className="text-xl text-gray-600 mb-8">{apiResults.error}</p>
          <button
            onClick={onRetake}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { recommendations } = apiResults

  // Transform API recommendations to match your frontend format
  const transformedRecommendations = transformApiResults(recommendations)

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-4">
            with <span className="text-accent font-semibold">GLISS</span>
          </h1>
          <p className="text-3xl md:text-4xl font-light text-accent">100% Stronger Hair</p>
        </div>

        {/* Hair Type Result */}
        <div className="bg-muted rounded-lg p-8 md:p-12 mb-12 text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Your Perfect Match</p>
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 capitalize">
            {transformedRecommendations.hairType.name}
          </h2>
          <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto">
            {transformedRecommendations.hairType.description}
          </p>
        </div>

        {/* Product Carousel - Show top 3 recommendations from API */}
        <div className="mb-16">
          <h3 className="text-2xl font-light text-foreground mb-8 text-center">Your Personalized Recommendations</h3>
          <div className="space-y-6">
            {recommendations.map((rec: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{rec.product_name}</h2>
                    <p className="text-gray-600">{rec.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{rec.score}/10</div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rec.confidence === 'High' ? 'bg-green-100 text-green-800' :
                      rec.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.confidence} Confidence
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Why this works for you:</h3>
                  <p className="text-gray-700">{rec.reasoning}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Detailed Analysis:</h3>
                  <p className="text-gray-700">{rec.detailed_explanation}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Your Hair Care Routine:</h3>
                  <p className="text-gray-700">{rec.hair_routine}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-light text-foreground mb-8 text-center">Key Benefits For Your Hair</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transformedRecommendations.ingredients.map((ingredient, index) => (
              <div key={index} className="bg-muted rounded-lg p-6 text-center">
                <p className="text-accent font-semibold mb-2">{ingredient.name}</p>
                <p className="text-sm text-muted-foreground">{ingredient.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Routine Section */}
        <div className="bg-muted rounded-lg p-8 md:p-12 mb-12">
          <h3 className="text-2xl font-light text-foreground mb-8 text-center">Your Hair Care Routine</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transformedRecommendations.routine.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center font-semibold mx-auto mb-4">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Retake Button */}
        <div className="text-center">
          <button
            onClick={onRetake}
            className="px-12 py-4 bg-accent text-background font-semibold rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to transform API results to your frontend format
function transformApiResults(recommendations: any[]) {
  if (!recommendations || recommendations.length === 0) {
    return getFallbackRecommendations()
  }

  // Use the top recommendation to determine hair type
  const topRecommendation = recommendations[0]
  
  return {
    hairType: {
      name: topRecommendation.product_name,
      description: topRecommendation.reasoning
    },
    ingredients: [
      { 
        name: "Intensive Repair", 
        benefit: "Targets damage and strengthens hair structure" 
      },
      { 
        name: "Deep Hydration", 
        benefit: "Restores moisture and prevents breakage" 
      },
      { 
        name: "Protective Care", 
        benefit: "Shields from heat and environmental damage" 
      },
    ],
    products: recommendations.map(rec => ({
      name: rec.product_name,
      brand: rec.brand,
      score: rec.score,
      confidence: rec.confidence,
      reasoning: rec.reasoning,
      detailed_explanation: rec.detailed_explanation,
      hair_routine: rec.hair_routine
    })),
    routine: [
      {
        title: "Cleanse & Prep",
        description: "Start with the recommended shampoo to gently cleanse and prepare your hair",
      },
      {
        title: "Treat & Condition",
        description: "Apply conditioner focusing on mid-lengths to ends for optimal results",
      },
      {
        title: "Protect & Maintain",
        description: "Follow the personalized routine for long-lasting hair health",
      },
    ],
  }
}

// Fallback in case API returns no results
function getFallbackRecommendations() {
  return {
    hairType: {
      name: "Personalized Hair Care",
      description: "Based on your unique hair profile, we've selected the perfect products to address your specific needs and goals."
    },
    ingredients: [
      { name: "Keratin", benefit: "Strengthens and repairs damaged strands" },
      { name: "Argan Oil", benefit: "Provides deep hydration and shine" },
      { name: "Biotin", benefit: "Promotes hair growth and elasticity" },
    ],
    products: [
      {
        name: "Ultimate Repair Shampoo",
        brand: "Gliss",
        score: 8.5,
        confidence: "High",
        reasoning: "Excellent match for your hair profile",
        detailed_explanation: "This product is specifically formulated to address your hair concerns with targeted ingredients.",
        hair_routine: "Use 2-3 times weekly with the matching conditioner for best results."
      }
    ],
    routine: [
      {
        title: "Cleanse",
        description: "Use recommended shampoo 2-3 times weekly for gentle cleansing",
      },
      {
        title: "Condition",
        description: "Apply nourishing conditioner from mid-length to ends",
      },
      {
        title: "Treat",
        description: "Follow your personalized routine for optimal results",
      },
    ],
  }
}