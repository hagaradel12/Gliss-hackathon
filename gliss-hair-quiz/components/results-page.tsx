"use client"

interface ResultsPageProps {
answers: Record<number, any>
apiResults: any
onRetake: () => void
}

export default function ResultsPage({ answers, apiResults, onRetake }: ResultsPageProps) {
// Loading State
if (!apiResults) {
return (
<div className="min-h-screen bg-background flex items-center justify-center">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
<p className="text-lg text-foreground">Getting your personalized recommendations... ✨</p>
</div>
</div>
)
}

// Error State
if (apiResults.error) {
return (
<div className="min-h-screen bg-background px-4 py-12 flex items-center justify-center">
<div className="text-center bg-muted p-10 rounded-2xl shadow-lg max-w-lg">
<h1 className="text-3xl font-light text-foreground mb-4">Oops! 😅</h1>
<p className="text-lg text-muted-foreground mb-8">{apiResults.error}</p>
<button onClick={onRetake} className="px-8 py-3 bg-accent text-background font-semibold rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg" >
Try Again
</button>
</div>
</div>
)
}

const { recommendations } = apiResults
const transformedData = transformApiResults(recommendations, answers)

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

    {/* Hair Line Result */}
    <div className="bg-muted rounded-2xl p-8 md:p-12 mb-12 text-center shadow-md">
      <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
        Your Hair Line Match
      </p>
      <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
        {transformedData.hairLine.name}
      </h2>
      <p className="text-accent font-semibold mb-2">
        Match Score: {transformedData.hairLine.matchScore}/10
      </p>
      <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto">
        {transformedData.hairLine.description}
      </p>
    </div>

    {/* Top Product */}
    {transformedData.topProduct && (
      <div className="bg-muted rounded-2xl p-10 mb-16 shadow-lg border border-border">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-light text-foreground mb-2">🌟 Your Best Match</h3>
          <p className="text-muted-foreground">
            The perfect product for your unique hair needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-3xl font-semibold text-foreground mb-2">
              {transformedData.topProduct.name}
            </h4>
            <p className="text-accent font-medium mb-4">{transformedData.topProduct.brand}</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-foreground">
                {transformedData.topProduct.score}/10
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  transformedData.topProduct.confidence === "High"
                    ? "bg-green-100 text-green-800"
                    : transformedData.topProduct.confidence === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {transformedData.topProduct.confidence} Confidence
              </span>
            </div>
            <div className="space-y-4 text-foreground">
              <div>
                <h5 className="font-semibold mb-1">✨ Key Features:</h5>
                <p className="text-muted-foreground">{transformedData.topProduct.features}</p>
              </div>
              <div>
                <h5 className="font-semibold mb-1">🎯 Perfect For:</h5>
                <p className="text-muted-foreground">{transformedData.topProduct.targetProfile}</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl p-6 shadow-inner">
            <h5 className="font-semibold text-foreground mb-4">🧪 Key Ingredients:</h5>
            <div className="space-y-2">
              {transformedData.topProduct.ingredients.map(
                (ingredient: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground">{ingredient}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Ingredient Benefits */}
    <div className="mb-16">
      <h3 className="text-2xl font-light text-foreground mb-8 text-center">
        Key Ingredients & Benefits
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transformedData.ingredients.map((ingredient: any, index: number) => (
          <div
            key={index}
            className="bg-muted rounded-xl p-6 text-center hover:shadow-md transition-all"
          >
            <p className="text-accent font-semibold mb-2">{ingredient.name}</p>
            <p className="text-sm text-muted-foreground">{ingredient.benefit}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Routine */}
    <div className="bg-muted rounded-2xl p-8 md:p-12 mb-16">
      <h3 className="text-2xl font-light text-foreground mb-8 text-center">
        Your Hair Care Routine
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {transformedData.routine.map((step: any, index: number) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center font-semibold mx-auto mb-4">
              {index + 1}
            </div>
            <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            {step.tip && (
              <p className="text-xs text-accent mt-2 italic">💡 {step.tip}</p>
            )}
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

// Helper transformation
function transformApiResults(recommendations: any[], answers: Record<number, any>) {
if (!recommendations || recommendations.length === 0) {
return getFallbackRecommendations()
}

const topRecommendation = recommendations[0]
const productMap: Record<string, any> = {
"Ultimate Repair": {
features: "Resistance reconstruction, repair strengthening, intensive treatment",
targetProfile:
"Damaged, colored, dry, bleached, brittle, weak hair with breakage and split ends",
ingredients: ["Black Pearl Extract", "Liquid Keratin Complex", "Repair Molecules"],
},
"Total Repair": {
features: "Moisturizing, suppleness, shine enhancement, deep hydration",
targetProfile:
"Dry, damaged, colored, bleached, dull hair needing moisture and shine",
ingredients: ["Hydrolyzed Keratin", "Floral Nectar", "Moisture Lock Complex"],
},
}

const features = productMap[topRecommendation.product_name] || {
features: "Advanced formula for your hair needs",
targetProfile: "Tailored to restore balance and strength",
ingredients: ["Keratin", "Argan Oil", "Biotin"],
}

return {
hairLine: {
name: `${topRecommendation.product_name} Line`,
matchScore: topRecommendation.score,
description: `The ${topRecommendation.product_name} line is perfectly matched to address your specific hair concerns with targeted ingredients and advanced technology.`,
},
topProduct: {
...topRecommendation,
...features,
},
ingredients: [
{ name: "Keratin", benefit: "Strengthens and repairs damaged strands" },
{ name: "Argan Oil", benefit: "Provides deep hydration and shine" },
{ name: "Biotin", benefit: "Promotes hair growth and elasticity" },
],
routine: [
{
title: "Cleanse & Prep",
description: "Use the repair shampoo 2–3 times weekly for gentle cleansing.",
tip: "Massage scalp to boost circulation.",
},
{
title: "Condition & Treat",
description:
"Apply conditioner or mask from mid-length to ends for hydration and smoothness.",
tip: "Leave in for 3 minutes before rinsing.",
},
{
title: "Protect & Style",
description:
"Finish with leave-in care or oil for protection and shine.",
tip: "Always use heat protection when styling.",
},
],
}
}

function getFallbackRecommendations() {
return {
hairLine: {
name: "Ultimate Repair Line",
matchScore: 8.5,
description:
"Our most advanced repair line designed to transform damaged hair into strong, healthy strands.",
},
topProduct: {
name: "Ultimate Repair Shampoo",
brand: "Gliss",
score: 8.5,
confidence: "High",
features:
"Resistance reconstruction, repair strengthening, intensive treatment",
targetProfile:
"Damaged, colored, dry, bleached, brittle, weak hair with breakage and split ends",
ingredients: ["Black Pearl Extract", "Liquid Keratin Complex", "Repair Molecules"],
},
ingredients: [
{ name: "Keratin Complex", benefit: "Rebuilds hair structure and repairs from within" },
{ name: "Argan Oil", benefit: "Deep hydration and natural shine" },
{ name: "Biotin", benefit: "Strengthens and promotes elasticity" },
],
routine: [
{
title: "Cleanse",
description: "Use recommended shampoo 2–3 times weekly for gentle cleansing.",
tip: "Rinse with cool water for extra shine.",
},
{
title: "Condition",
description:
"Apply nourishing conditioner from mid-lengths to ends to hydrate and smooth.",
tip: "Comb through for even distribution.",
},
{
title: "Treat",
description: "Use a mask weekly for deep repair and nourishment.",
tip: "Wrap hair in a warm towel for better absorption.",
},
],
}
}