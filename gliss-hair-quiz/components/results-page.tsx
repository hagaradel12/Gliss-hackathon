"use client"
import ProductCarousel from "@/components/product-carousel"

interface ResultsPageProps {
  answers: Record<number, any>
  onRetake: () => void
}

export default function ResultsPage({ answers, onRetake }: ResultsPageProps) {
  const hairType = determineHairType(answers)
  const recommendations = getRecommendations(hairType)

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
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Your Hair Type</p>
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 capitalize">{hairType.name}</h2>
          <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto">{hairType.description}</p>
        </div>

        {/* Ingredients Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-light text-foreground mb-8 text-center">Key Ingredients You Need</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.ingredients.map((ingredient, index) => (
              <div key={index} className="bg-muted rounded-lg p-6 text-center">
                <p className="text-accent font-semibold mb-2">{ingredient.name}</p>
                <p className="text-sm text-muted-foreground">{ingredient.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Carousel */}
        <div className="mb-16">
          <h3 className="text-2xl font-light text-foreground mb-8 text-center">Recommended Products</h3>
          <ProductCarousel products={recommendations.products} />
        </div>

        {/* Routine Section */}
        <div className="bg-muted rounded-lg p-8 md:p-12 mb-12">
          <h3 className="text-2xl font-light text-foreground mb-8 text-center">Your Hair Routine</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.routine.map((step, index) => (
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

function determineHairType(answers: Record<number, any>) {
  // Simple logic to determine hair type based on answers
  const texture = answers[1]
  const elasticity = answers[2]
  const damage = answers[4]

  if (texture === "very_dry" || elasticity === "often") {
    return {
      name: "Damaged & Dry Hair",
      description:
        "Your hair needs intensive repair and hydration. Focus on nourishing treatments and protective styling to restore strength and moisture.",
    }
  } else if (texture === "rough" || elasticity === "sometimes") {
    return {
      name: "Compromised Hair",
      description:
        "Your hair shows signs of damage and needs targeted care. A balanced routine with strengthening and moisturizing products will help restore vitality.",
    }
  } else {
    return {
      name: "Healthy Hair",
      description:
        "Your hair is in good condition! Maintain its health with a consistent routine using quality products that preserve moisture and strength.",
    }
  }
}

function getRecommendations(hairType: any) {
  return {
    ingredients: [
      { name: "Keratin", benefit: "Strengthens and repairs damaged strands" },
      { name: "Argan Oil", benefit: "Provides deep hydration and shine" },
      { name: "Biotin", benefit: "Promotes hair growth and elasticity" },
    ],
    products: [
      {
        name: "Repair Shampoo",
        image: "/luxury-hair-shampoo-bottle-gold.jpg",
      },
      {
        name: "Nourishing Conditioner",
        image: "/luxury-hair-conditioner-bottle.jpg",
      },
      {
        name: "Hair Mask Treatment",
        image: "/luxury-hair-mask-treatment.jpg",
      },
    ],
    routine: [
      {
        title: "Cleanse",
        description: "Use our repair shampoo 2-3 times weekly for gentle cleansing",
      },
      {
        title: "Condition",
        description: "Apply nourishing conditioner from mid-length to ends",
      },
      {
        title: "Treat",
        description: "Use hair mask once weekly for intensive repair",
      },
    ],
  }
}
