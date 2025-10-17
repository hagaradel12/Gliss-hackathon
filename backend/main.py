from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from datetime import datetime
from dotenv import load_dotenv
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from groq import Groq

load_dotenv()

app = FastAPI(title="Smart Hair Diagnosis API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq
LLAMA_API_KEY = os.getenv("LLAMA_API_KEY", "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")
llama_client = Groq(api_key=LLAMA_API_KEY)

# Product Dataset
PRODUCTS = [
    {
        'id': 1,
        'name': 'Ultimate Repair',
        'brand': 'Gliss',
        'features': 'resistance reconstruction repair strengthening',
        'target_profile': 'damaged colored dry bleached brittle weak breakage split_ends',
        'ingredients': 'black_pearl liquid_keratin',
        'texture_match': 'dry rough brittle',
        'scalp_match': 'normal dry',
        'lifestyle_match': 'heat_styling coloring chemical_treatment',
        'goal_match': 'repair strengthen restore'
    },
    {
        'id': 2,
        'name': 'Total Repair',
        'brand': 'Gliss',
        'features': 'moisturizing suppleness shine hydration',
        'target_profile': 'dry damaged colored bleached dull',
        'ingredients': 'hydrolyzed_keratin floral_nectar',
        'texture_match': 'dry rough dull',
        'scalp_match': 'normal dry',
        'lifestyle_match': 'coloring chemical_treatment',
        'goal_match': 'hydrate smooth shine'
    },
    {
        'id': 3,
        'name': 'Oil Nutritive',
        'brand': 'Gliss',
        'features': 'nourishing smoothness shine anti_split_ends',
        'target_profile': 'straw damaged brittle dull split_ends breakage',
        'ingredients': 'omega_9 marula_oil',
        'texture_match': 'very_dry rough brittle tangled',
        'scalp_match': 'dry normal',
        'lifestyle_match': 'heat_styling',
        'goal_match': 'nourish smooth shine protect'
    },
    {
        'id': 4,
        'name': 'Aqua Revive',
        'brand': 'Gliss',
        'features': 'lightweight hydration healthy no_weighing',
        'target_profile': 'normal slightly_dry healthy',
        'ingredients': 'hyaluron_complex marine_algae',
        'texture_match': 'soft smooth slightly_dry',
        'scalp_match': 'normal oily',
        'lifestyle_match': 'minimal_styling frequent_washing',
        'goal_match': 'maintain hydrate lightweight'
    },
    {
        'id': 5,
        'name': 'Supreme Length',
        'brand': 'Gliss',
        'features': 'instant_fluidity root_control length_care',
        'target_profile': 'oily_roots dry_ends combination',
        'ingredients': 'biotin_complex peony_flower',
        'texture_match': 'soft combination',
        'scalp_match': 'oily combination',
        'lifestyle_match': 'frequent_washing',
        'goal_match': 'balance control length_care'
    }
]

# Enhanced Pydantic Models
class Recommendation(BaseModel):
    product_name: str
    brand: str
    score: float
    reasoning: str
    confidence: str
    detailed_explanation: str
    hair_routine: str

class DiagnosisRequest(BaseModel):
    session_id: str
    q1_hair_feel: str
    q2_scalp_condition: str
    q3_hair_behavior: str
    q4_lifestyle: List[str]
    q5_hair_goal: str

# Smart Hair Advisor
class SmartHairAdvisor:
    def _init_(self):
        self.products = PRODUCTS
        self.vectorizer = TfidfVectorizer(
            max_features=300,
            lowercase=True,
            ngram_range=(1, 2),
            min_df=1
        )
        self._prepare_vectors()
    
    def _prepare_vectors(self):
        """Create product vectors"""
        product_texts = [self._create_product_text(p) for p in self.products]
        self.product_vectors = self.vectorizer.fit_transform(product_texts).toarray()
        print(f"✅ Prepared vectors for {len(self.products)} products")
    
    def _create_product_text(self, product: Dict[str, Any]) -> str:
        """Create comprehensive product text"""
        parts = [
            product['name'] ,  # Emphasize name
            product['brand'],
            product['features']*3,
            product['target_profile'] * 2,  # Emphasize target profile
            product['ingredients'],
            product['texture_match'] *3,
            product['scalp_match'],
            product['lifestyle_match']*2,
            product['goal_match'] * 2
        ]
        return ' '.join(str(p) for p in parts if p).lower()
    
    def _create_user_profile(self, diagnosis: DiagnosisRequest) -> str:
        """Create user profile text from 5 questions"""
        profile_parts = []
        
        # Q1: Hair Feel (texture & damage indicator)
        q1_mapping = {
    'soft_smooth': 'soft smooth silky manageable healthy shiny glossy flexible supple',
    'slightly_rough': 'rough textured coarse frizzy dull dehydrated porous uneven cuticle',
    'very_dry': 'extremely_dry brittle fragile damaged broken split_ends cracked_cuticle straw_like',
    'dry': 'dry parched thirsty low_moisture rough textured lackluster'
}
        profile_parts.append(q1_mapping.get(diagnosis.q1_hair_feel, '') * 3)
        
        # Q2: Scalp Condition
        q2_mapping = {
    'normal': 'normal_scalp balanced healthy clean comfortable pH_balanced unproblematic',
    'oily': 'oily_scalp greasy sebaceous_overactive shiny_surface excess_sebum clogged_pores',
    'dry_flaky': 'dry_scalp flaky scaling dandruff itchy irritated tight_sensation dehydrated_scalp',
    'sensitive': 'sensitive_scalp reactive inflamed easily_irritated delicate prone_to_redness'
}
        profile_parts.append(q2_mapping.get(diagnosis.q2_scalp_condition, '') * 2)
        
        # Q3: Hair Behavior (styling & manageability)
        q3_mapping = {
    'holds_style': 'style_retention manageable pliable responsive shape_holding cooperative',
    'loses_shape': 'limp flat lacking_volume fine_thin hair_weighted_down low_density',
    'frizzy_humid': 'humidity_reactive frizz_prone hygroscopic expands_moisture unruly flyaways',
    'tangled': 'easily_tangled knotting matting snarls difficult_comb through high_friction'
}
        profile_parts.append(q3_mapping.get(diagnosis.q3_hair_behavior, '') * 3)
        
        # Q4: Lifestyle (critical for matching)
        lifestyle_mapping = {
    'heat_styling': 'heat_tools thermal_exposure blow_drying flat_iron curling_wand hot_brushes',
    'coloring': 'color_treated chemical_processing dye bleach highlights toning color_maintenance',
    'swimming': 'chlorine_exposure salt_water pool_swimming sun_exposure environmental_stress',
    'minimal': 'low_manipulation natural_styling air_drying gentle_care minimal_processing'
}
        for lifestyle in diagnosis.q4_lifestyle:
            profile_parts.append(lifestyle_mapping.get(lifestyle, lifestyle) * 2)
        
        # Q5: Hair Goal (primary objective)
        q5_mapping = {
    'repair': 'damage_repair structural_rebuilding strength_restoration split_end_treatment breakage_prevention',
    'hydrate': 'moisture_retention hydration humectant conditioning quenching moisturization',
    'smooth': 'sleek_smooth frizz_control shine_enhancement glossiness manageability',
    'volume': 'volume_boost body_enhancement lift root_volumizing thickness fullness',
    'maintain': 'maintenance protection preventative_care health_preservation optimal_condition'
}
        profile_parts.append(q5_mapping.get(diagnosis.q5_hair_goal, '') * 4)
        
        return ' '.join(filter(None, profile_parts)).lower()
    
    def _get_llm_match_score(self, user_profile: str, product: Dict[str, Any]) -> float:
        """Get LLM prediction for match between user profile and product"""
        try:
            product_description = f"""
            Product: {product['name']} by {product['brand']}
            Features: {product['features']}
            Target Profile: {product['target_profile']}
            Texture Match: {product['texture_match']}
            Scalp Match: {product['scalp_match']}
            Lifestyle Match: {product['lifestyle_match']}
            Goal Match: {product['goal_match']}
            """
            
            prompt = f"""
            Analyze how well this hair product matches the user's hair profile.
            
            USER PROFILE: {user_profile}
            
            PRODUCT: {product_description}
            
            On a scale of 0 to 10, where 0 is no match and 10 is perfect match, 
            how well does this product suit the user's hair needs?
            
            Return ONLY a single number between 0 and 10, no other text.
            """
            
            response = llama_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=10
            )
            
            llm_score = float(response.choices[0].message.content.strip())
            # Normalize to 0-1 range for small contribution
            normalized_score = llm_score / 10.0
            print(f"🤖 LLM Score for {product['name']}: {llm_score}/10 -> {normalized_score:.2f}")
            return normalized_score
            
        except Exception as e:
            print(f"⚠ LLM error for {product['name']}: {e}")
            return 0.5  # Neutral score if LLM fails

    def _get_llm_detailed_explanation(self, user_profile: str, product: Dict[str, Any], diagnosis: DiagnosisRequest) -> Dict[str, str]:
        """Get detailed LLM explanation for the match and hair routine - RUNS AFTER MATCHING"""
        try:
            user_context = f"""
            User Hair Profile:
            - Hair Feel: {diagnosis.q1_hair_feel}
            - Scalp Condition: {diagnosis.q2_scalp_condition}
            - Hair Behavior: {diagnosis.q3_hair_behavior}
            - Lifestyle Factors: {', '.join(diagnosis.q4_lifestyle)}
            - Main Goal: {diagnosis.q5_hair_goal}
            """
            
            product_context = f"""
            Product: {product['name']} by {product['brand']}
            Key Features: {product['features']}
            Target Hair Types: {product['target_profile']}
            Key Ingredients: {product['ingredients']}
            Best for Scalp Types: {product['scalp_match']}
            Lifestyle Compatibility: {product['lifestyle_match']}
            Primary Goals: {product['goal_match']}
            """
            
            prompt = f"""
            As a hair care expert, analyze this product match and provide detailed recommendations.

            USER CONTEXT:
            {user_context}

            PRODUCT DETAILS:
            {product_context}

            Please provide TWO sections:

            SECTION 1 - MATCH EXPLANATION:
            Explain why this product is a good match for the user's specific hair concerns.
            Focus on:
            - How each key ingredient addresses the user's hair issues
            - Why the product features align with their hair goals
            - How it suits their scalp condition and lifestyle
            - Specific benefits for their hair type

            SECTION 2 - HAIR CARE ROUTINE:
            Create a complete weekly hair care routine using this product line (shampoo, conditioner, hair mask).
            Include:
            - Frequency of use for each product
            - Application techniques
            - Additional tips for their specific hair concerns
            - How to maximize results

            Format your response exactly as:
            EXPLANATION: [your detailed match explanation here]
            ROUTINE: [your complete hair care routine here]
            """
            
            response = llama_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=800
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Parse the response
            explanation = ""
            routine = ""
            
            if "EXPLANATION:" in response_text and "ROUTINE:" in response_text:
                parts = response_text.split("ROUTINE:")
                explanation = parts[0].replace("EXPLANATION:", "").strip()
                routine = parts[1].strip()
            else:
                # Fallback if format is not followed
                explanation = response_text
                routine = "Please consult the product instructions for specific usage guidelines."
            
            return {
                "explanation": explanation,
                "routine": routine
            }
            
        except Exception as e:
            print(f"⚠ LLM detailed explanation error for {product['name']}: {e}")
            return {
                "explanation": f"This product matches your hair profile based on your {diagnosis.q1_hair_feel} hair feel, {diagnosis.q2_scalp_condition} scalp, and goal of {diagnosis.q5_hair_goal}.",
                "routine": f"Use {product['name']} shampoo and conditioner 2-3 times weekly. Apply hair mask once weekly for deep treatment. Follow product instructions for best results."
            }
    
    def _calculate_similarity(self, user_text: str) -> List[Dict[str, Any]]:
        """Calculate cosine similarity with LLM contribution"""
        user_vector = self.vectorizer.transform([user_text]).toarray()
        similarities = cosine_similarity(user_vector, self.product_vectors)[0]
        
        results = []
        for product, similarity in zip(self.products, similarities):
            # Base score from cosine similarity
            base_score = min(10.0, (similarity * 15))
            
            # Get LLM contribution (small weight - 20%)
            llm_contribution = self._get_llm_match_score(user_text, product)
            llm_bonus = llm_contribution * 2.0  # LLM contributes up to 2 points
            
            # Combined score
            final_score = base_score + llm_bonus
            
            results.append({
                'product': product,
                'similarity': float(similarity),
                'score': final_score,
                'base_score': base_score,
                'llm_bonus': llm_bonus
            })
        
        return sorted(results, key=lambda x: x['score'], reverse=True)
    
    def _generate_reasoning(self, product: Dict[str, Any], similarity: float, 
                           diagnosis: DiagnosisRequest) -> str:
        """Generate smart reasoning"""
        reasons = []
        
        # Match quality
        if similarity >= 0.7:
            reasons.append("Excellent match for your hair profile")
        elif similarity >= 0.5:
            reasons.append("Strong fit for your needs")
        else:
            reasons.append("Good option for your hair type")
        
        # Hair feel alignment
        if diagnosis.q1_hair_feel == 'very_dry' and 'repair' in product['features']:
            reasons.append("Intensive repair for dry, brittle hair")
        elif diagnosis.q1_hair_feel == 'soft_smooth' and 'lightweight' in product['features']:
            reasons.append("Maintains healthy hair without weighing down")
        
        # Scalp alignment
        if diagnosis.q2_scalp_condition == 'oily' and 'oily' in product['scalp_match']:
            reasons.append("Balances oily scalp while nourishing lengths")
        
        # Goal alignment
        goal_features = {
            'repair': ['repair', 'strengthen', 'restore'],
            'hydrate': ['moisturizing', 'hydration', 'nourish'],
            'smooth': ['smooth', 'anti_frizz', 'sleek'],
            'volume': ['volume', 'body', 'lift']
        }
        
        goal = diagnosis.q5_hair_goal
        if goal in goal_features:
            if any(f in product['features'] for f in goal_features[goal]):
                reasons.append(f"Targets your {goal} goals effectively")
        
        return ". ".join(reasons[:3])
    
    def get_recommendations(self, diagnosis: DiagnosisRequest) -> List[Recommendation]:
        """Generate top 3 recommendations with detailed LLM explanations AFTER matching"""
        user_text = self._create_user_profile(diagnosis)
        print(f"\n👤 User Profile: {user_text[:150]}...")
        
        # First, get the matches using similarity scoring
        results = self._calculate_similarity(user_text)
        
        recommendations = []
        print(f"\n🎯 Generating detailed explanations for top {min(3, len(results))} matches...")
        
        for result in results[:3]:
            product = result['product']
            score = result['score']
            similarity = result['similarity']
            
            confidence = "High" if score >= 7.0 else "Medium" if score >= 4.0 else "Low"
            reasoning = self._generate_reasoning(product, similarity, diagnosis)
            
            # NOW get detailed LLM explanation and routine AFTER matching is done
            print(f"📝 Getting LLM explanation for {product['name']}...")
            llm_details = self._get_llm_detailed_explanation(user_text, product, diagnosis)
            
            recommendations.append(Recommendation(
                product_name=product['name'],
                brand=product['brand'],
                score=round(score, 1),
                reasoning=reasoning,
                confidence=confidence,
                detailed_explanation=llm_details["explanation"],
                hair_routine=llm_details["routine"]
            ))
        
        return recommendations

# Initialize advisor
advisor = SmartHairAdvisor()

# API Endpoints (remain the same)
@app.get("/")
async def root():
    return {"message": "Smart Hair Diagnosis API v2.0"}

@app.get("/questions")
async def get_questions():
    """Get diagnostic questions"""
    return {
        "questions": [
            {
                "id": 1,
                "title": "How does your hair usually feel?",
                "type": "single_choice",
                "options": [
                    {"value": "soft_smooth", "label": "Soft, smooth, and easy to manage"},
                    {"value": "slightly_rough", "label": "Slightly rough, frizzy, or dull"},
                    {"value": "very_dry", "label": "Very dry, brittle, or tangled"}
                ]
            },
            {
                "id": 2,
                "title": "What's your scalp condition?",
                "type": "single_choice",
                "options": [
                    {"value": "normal", "label": "Normal, balanced"},
                    {"value": "oily", "label": "Oily, gets greasy quickly"},
                    {"value": "dry_flaky", "label": "Dry or flaky"},
                    {"value": "sensitive", "label": "Sensitive or itchy"}
                ]
            },
            {
                "id": 3,
                "title": "How does your hair behave after styling?",
                "type": "single_choice",
                "options": [
                    {"value": "holds_style", "label": "Holds style well"},
                    {"value": "loses_shape", "label": "Loses volume/shape quickly"},
                    {"value": "frizzy_humid", "label": "Gets frizzy in humidity"},
                    {"value": "tangled", "label": "Tangles easily"}
                ]
            },
            {
                "id": 4,
                "title": "Your hair lifestyle",
                "type": "multiple_choice",
                "options": [
                    {"value": "heat_styling", "label": "Heat styling (blow-dry, iron)"},
                    {"value": "coloring", "label": "Color or chemical treatments"},
                    {"value": "swimming", "label": "Swimming (pool/ocean)"},
                    {"value": "minimal", "label": "Minimal styling"}
                ]
            },
            {
                "id": 5,
                "title": "What's your main hair goal?",
                "type": "single_choice",
                "options": [
                    {"value": "repair", "label": "Repair damage"},
                    {"value": "hydrate", "label": "Deep hydration"},
                    {"value": "smooth", "label": "Smoothness & shine"},
                    {"value": "volume", "label": "Volume & body"},
                    {"value": "maintain", "label": "Maintain health"}
                ]
            }
        ]
    }

@app.post("/diagnose")
async def diagnose(request: DiagnosisRequest):
    """Generate recommendations"""
    try:
        recommendations = advisor.get_recommendations(request)
        
        return {
            "session_id": request.session_id,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products")
async def get_products():
    """Get all products"""
    return {"products": PRODUCTS, "count": len(PRODUCTS)}

def test_matcher():
    """Test the matching system with different user profiles"""
    print("\n" + "="*70)
    print("🧪 TESTING SMART HAIR DIAGNOSIS MATCHER")
    print("="*70)
    
    test_cases = [
        {
            "name": "DAMAGED & COLORED HAIR",
            "profile": DiagnosisRequest(
                session_id="test1",
                q1_hair_feel="very_dry",
                q2_scalp_condition="normal",
                q3_hair_behavior="tangled",
                q4_lifestyle=["heat_styling", "coloring"],
                q5_hair_goal="repair"
            )
        },
        {
        "name": "OILY SCALP WITH FINE HAIR",
        "profile": DiagnosisRequest(
            session_id="test2",
            q1_hair_feel="soft_smooth",
            q2_scalp_condition="oily",
            q3_hair_behavior="loses_shape",
            q4_lifestyle=["minimal"],
            q5_hair_goal="volume"
        )
    },
    {
        "name": "FRIZZ-PRONE CURLY HAIR",
        "profile": DiagnosisRequest(
            session_id="test3",
            q1_hair_feel="slightly_rough",
            q2_scalp_condition="dry_flaky",
            q3_hair_behavior="frizzy_humid",
            q4_lifestyle=["heat_styling"],
            q5_hair_goal="smooth"
        )
    },
    {
        "name": "HEALTHY HAIR MAINTENANCE",
        "profile": DiagnosisRequest(
            session_id="test4",
            q1_hair_feel="soft_smooth",
            q2_scalp_condition="normal",
            q3_hair_behavior="holds_style",
            q4_lifestyle=["minimal"],
            q5_hair_goal="maintain"
        )
    },
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n{'='*70}")
        print(f"🎯 TEST {i}: {test['name']}")
        print(f"{'='*70}")
        
        profile = test['profile']
        print(f"\n📋 USER PROFILE:")
        print(f"   Hair Feel: {profile.q1_hair_feel}")
        print(f"   Scalp: {profile.q2_scalp_condition}")
        print(f"   Behavior: {profile.q3_hair_behavior}")
        print(f"   Lifestyle: {', '.join(profile.q4_lifestyle)}")
        print(f"   Goal: {profile.q5_hair_goal}")
        
        # Get recommendations
        recommendations = advisor.get_recommendations(profile)
        
        print(f"\n💡 TOP 3 RECOMMENDATIONS:")
        print("-"*70)
        
        for j, rec in enumerate(recommendations, 1):
            print(f"\n{j}. {rec.product_name} by {rec.brand}")
            print(f"   📊 Score: {rec.score}/10")
            print(f"   🎯 Confidence: {rec.confidence}")
            print(f"   💬 Reasoning: {rec.reasoning}")
            print(f"\n   🔍 Detailed Explanation:")
            print(f"   {rec.detailed_explanation}")
            print(f"\n   💆 Hair Care Routine:")
            print(f"   {rec.hair_routine}")
            print("-"*50)
        
        print()
    
    print("\n" + "="*70)
    print("✅ ALL TESTS COMPLETE")
    print("="*70)
    print("\n💡 TIP: To start the API server, run:")
    print("   uvicorn main:app --reload\n")

if _name_ == "_main_":
    test_matcher()