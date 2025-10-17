from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import json
import os
from datetime import datetime
import openai
from dotenv import load_dotenv
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

load_dotenv()

app = FastAPI(title="Hair Advisor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# In-memory storage for user sessions
user_sessions = {}

# Load hair products dataset from Excel file
def load_hair_products_dataset():
    """Load hair products from Excel dataset file"""
    try:
        # Read the Excel file
        df = pd.read_excel('Hackathon_dataset.xlsx')
        
        # Convert DataFrame to list of dictionaries
        products = []
        for index, row in df.iterrows():
            product = {
                'id': index + 1,
                'name': str(row.get('Product Name', '')),
                'brand': str(row.get('Brand', '')),
                'category': str(row.get('Category', '')),
                'features': str(row.get('Features', '')),
                'target_hair_types': str(row.get('Target Hair Types', '')),
                'target_concerns': str(row.get('Target Concerns', '')),
                'ingredients': str(row.get('Ingredients', '')),
                'price_range': str(row.get('Price Range', 'budget'))
            }
            products.append(product)
        
        return products
    
    except Exception as e:
        print(f"Error loading dataset: {e}")
        # Fallback to default dataset if Excel file fails to load
        return [
            {
                'id': 1,
                'name': 'Gliss Ultimate Repair',
                'brand': 'Gliss',
                'category': 'shampoo',
                'features': 'repair,hydrating,strengthening',
                'target_hair_types': 'damaged,colored,dry',
                'target_concerns': 'damage,breakage,split_ends',
                'ingredients': 'keratin,argan_oil,biotin',
                'price_range': 'mid'
            }
        ]

# Load the dataset
HAIR_PRODUCTS_DATASET = load_hair_products_dataset()

# Function to reload dataset
def reload_dataset():
    """Reload the dataset from Excel file"""
    global HAIR_PRODUCTS_DATASET
    HAIR_PRODUCTS_DATASET = load_hair_products_dataset()
    return len(HAIR_PRODUCTS_DATASET)

# Pydantic models
class QuestionResponse(BaseModel):
    question_id: int
    answer: Any

class QuestionnaireResponse(BaseModel):
    session_id: str
    responses: List[QuestionResponse]

class RecommendationRequest(BaseModel):
    session_id: str
    responses: Dict[str, Any]

class Recommendation(BaseModel):
    product_name: str
    brand: str
    category: str
    score: float
    reasoning: str
    confidence: str

# Hair advisor scoring engine
class HairAdvisorEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        
    def get_products(self):
        return HAIR_PRODUCTS_DATASET
    
    def encode_user_features(self, responses: Dict[str, Any]) -> Dict[str, Any]:
        """Convert user responses to numeric features for scoring"""
        features = {}
        
        # Hair condition - handle both single and multiple selections
        hair_conditions = responses.get('hair_condition', [])
        if isinstance(hair_conditions, str):
            hair_conditions = [hair_conditions.lower()]
        elif isinstance(hair_conditions, list):
            hair_conditions = [c.lower() for c in hair_conditions]
        
        # Calculate condition score based on multiple selections
        condition_scores = {'dry': 1, 'oily': 2, 'colored': 3, 'damaged': 4}
        if hair_conditions:
            features['hair_condition'] = max([condition_scores.get(c, 2) for c in hair_conditions])
            features['hair_conditions'] = hair_conditions  # Store all conditions
        else:
            features['hair_condition'] = 2  # Default to normal
            features['hair_conditions'] = []
        
        # Damage level (1-10 scale)
        features['damage_level'] = responses.get('damage_level', 5)
        
        # Hair texture (1-3 scale)
        texture_map = {'fine': 1, 'medium': 2, 'coarse': 3}
        features['hair_texture'] = texture_map.get(responses.get('hair_texture', 'medium'), 2)
        
        # Top concerns (binary flags)
        concerns = responses.get('top_concerns', [])
        features['damage_concern'] = 1 if 'damage' in concerns or 'breakage' in concerns else 0
        features['frizz_concern'] = 1 if 'frizz' in concerns else 0
        features['volume_concern'] = 1 if 'flatness' in concerns or 'volume' in concerns else 0
        features['dandruff_concern'] = 1 if 'dandruff' in concerns else 0
        
        # Routine care level (0-1 scale)
        routine = responses.get('routine_care', {})
        features['heat_styling'] = 1 if routine.get('heat_styling', False) else 0
        features['coloring'] = 1 if routine.get('coloring', False) else 0
        features['care_level'] = (features['heat_styling'] + features['coloring']) / 2
        
        # Hair goal
        goal_map = {'repair': 1, 'smooth': 2, 'shine': 3, 'volume': 4}
        features['hair_goal'] = goal_map.get(responses.get('hair_goal', 'smooth'), 2)
        
        # Scalp condition
        scalp_map = {'healthy': 1, 'oily': 2, 'dry': 3, 'sensitive': 4}
        features['scalp_condition'] = scalp_map.get(responses.get('scalp_condition', 'healthy'), 1)
        
        # Weather effects
        weather = responses.get('weather_effects', {})
        features['humidity_problem'] = 1 if weather.get('humidity', False) else 0
        features['sun_damage'] = 1 if weather.get('sun', False) else 0
        
        # Hair volume preference
        volume_map = {'thin': 1, 'medium': 2, 'thick': 3}
        features['volume_preference'] = volume_map.get(responses.get('hair_volume', 'medium'), 2)
        
        return features
    
    def calculate_base_score(self, user_features: Dict[str, Any], product: Dict[str, Any]) -> float:
        """Calculate base compatibility score between user and product"""
        score = 5.0  # Base score
        
        # Hair condition matching - handle multiple conditions
        target_types = product['target_hair_types'].split(',')
        user_conditions = user_features.get('hair_conditions', [])
        
        # Score based on how many user conditions match product targets
        matches = 0
        for condition in user_conditions:
            if condition in target_types:
                matches += 1
        
        # Bonus for multiple matches
        if matches > 0:
            score += 2.0 * (matches / len(user_conditions)) if user_conditions else 0
            if matches == len(user_conditions):  # Perfect match
                score += 1.0
        
        # Damage level matching
        if user_features['damage_level'] >= 7 and 'damaged' in target_types:
            score += 1.5
        elif user_features['damage_level'] <= 3 and 'damaged' not in target_types:
            score += 1.0
        
        # Hair texture matching
        if user_features['hair_texture'] == 1 and 'fine' in target_types:  # Fine hair
            score += 1.0
        elif user_features['hair_texture'] == 3 and 'coarse' in target_types:  # Coarse hair
            score += 1.0
        
        # Concerns matching
        target_concerns = product['target_concerns'].split(',')
        if user_features['damage_concern'] and any(concern in target_concerns for concern in ['damage', 'breakage']):
            score += 1.5
        if user_features['frizz_concern'] and 'frizz' in target_concerns:
            score += 1.0
        if user_features['volume_concern'] and any(concern in target_concerns for concern in ['flatness', 'volume']):
            score += 1.0
        if user_features['dandruff_concern'] and 'dandruff' in target_concerns:
            score += 1.5
        
        # Hair goal matching
        features = product['features'].split(',')
        if user_features['hair_goal'] == 1 and 'repair' in features:  # Repair goal
            score += 1.5
        elif user_features['hair_goal'] == 2 and 'smooth' in features:  # Smooth goal
            score += 1.5
        elif user_features['hair_goal'] == 3 and 'shine' in features:  # Shine goal
            score += 1.5
        elif user_features['hair_goal'] == 4 and 'volume' in features:  # Volume goal
            score += 1.5
        
        # Care level adjustment
        if user_features['care_level'] > 0.5 and 'strengthening' in features:
            score += 1.0
        
        # Normalize score to 0-10 range
        return min(10.0, max(0.0, score))
    
    def extract_llm_insights(self, open_routine: str) -> Dict[str, Any]:
        """Extract structured insights from Q10 open text using LLM"""
        if not open_routine or not open_routine.strip():
            return {}
        
        try:
            prompt = f"""
            Analyze this hair routine description and extract ONLY these specific tags if mentioned:
            - high_chemical_damage (if bleaching, coloring, perms mentioned)
            - high_heat_damage (if frequent styling, blow drying, flat iron mentioned)
            - humidity_frizz (if frizz, humidity problems mentioned)
            - scalp_issues (if dandruff, itchiness, scalp problems mentioned)
            - routine_complexity (if multiple products, complex routine mentioned)
            - neglect_issues (if infrequent washing, lack of care mentioned)
            
            Text: "{open_routine}"
            
            Respond with ONLY a JSON object containing the tags as keys and true/false as values.
            Example: {{"high_chemical_damage": true, "humidity_frizz": false}}
            """
            
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.1
            )
            
            insights = json.loads(response.choices[0].message.content)
            return insights
            
        except Exception as e:
            print(f"LLM insight extraction failed: {e}")
            return {}
    
    def apply_llm_adjustment(self, base_score: float, llm_insights: Dict[str, Any], product: Dict[str, Any]) -> float:
        """Apply LLM insights to adjust base score (max +30% adjustment)"""
        adjustment = 0.0
        features = product['features'].split(',')
        target_concerns = product['target_concerns'].split(',')
        
        # High chemical damage boost for repair products
        if llm_insights.get('high_chemical_damage') and 'repair' in features:
            adjustment += 1.0
        
        # High heat damage boost for strengthening products
        if llm_insights.get('high_heat_damage') and 'strengthening' in features:
            adjustment += 0.8
        
        # Humidity frizz boost for anti-frizz products
        if llm_insights.get('humidity_frizz') and 'anti_frizz' in features:
            adjustment += 0.7
        
        # Scalp issues boost for scalp care products
        if llm_insights.get('scalp_issues') and 'dandruff' in target_concerns:
            adjustment += 1.0
        
        # Routine complexity boost for multi-purpose products
        if llm_insights.get('routine_complexity') and len(features) > 2:
            adjustment += 0.5
        
        # Apply maximum 30% adjustment
        max_adjustment = base_score * 0.3
        final_adjustment = min(adjustment, max_adjustment)
        
        return base_score + final_adjustment
    
    def generate_reasoning(self, product: Dict[str, Any], user_features: Dict[str, Any], llm_insights: Dict[str, Any]) -> str:
        """Generate explanation for recommendation using only dataset information"""
        reasons = []
        
        # Hair condition match
        target_types = product['target_hair_types'].split(',')
        if user_features['damage_level'] >= 7 and 'damaged' in target_types:
            reasons.append("Perfect for your damaged hair")
        
        # Concern matching
        target_concerns = product['target_concerns'].split(',')
        if user_features['damage_concern'] and 'damage' in target_concerns:
            reasons.append("Targets your damage concerns")
        if user_features['frizz_concern'] and 'frizz' in target_concerns:
            reasons.append("Addresses frizz issues")
        
        # Goal matching
        features = product['features'].split(',')
        if user_features['hair_goal'] == 1 and 'repair' in features:
            reasons.append("Supports your repair goals")
        elif user_features['hair_goal'] == 4 and 'volume' in features:
            reasons.append("Enhances volume as desired")
        
        # LLM insights
        if llm_insights.get('high_chemical_damage') and 'repair' in features:
            reasons.append("Great for chemically processed hair")
        
        return ". ".join(reasons) if reasons else "Good overall match for your hair profile"
    
    def get_recommendations(self, responses: Dict[str, Any]) -> List[Recommendation]:
        """Generate product recommendations using hybrid scoring"""
        # Step 1: Input validation with defaults
        validated_responses = {
            'hair_condition': responses.get('hair_condition', []),
            'damage_level': responses.get('damage_level', 5),
            'hair_texture': responses.get('hair_texture', 'medium'),
            'top_concerns': responses.get('top_concerns', []),
            'routine_care': responses.get('routine_care', {}),
            'hair_goal': responses.get('hair_goal', 'smooth'),
            'scalp_condition': responses.get('scalp_condition', 'healthy'),
            'weather_effects': responses.get('weather_effects', {}),
            'hair_volume': responses.get('hair_volume', 'medium'),
            'open_routine': responses.get('open_routine', '')
        }
        
        # Step 2: Feature encoding
        user_features = self.encode_user_features(validated_responses)
        
        # Step 3: Get products and calculate base scores
        products = self.get_products()
        product_scores = []
        
        for product in products:
            base_score = self.calculate_base_score(user_features, product)
            
            # Step 4: LLM insight extraction
            llm_insights = self.extract_llm_insights(validated_responses['open_routine'])
            
            # Step 5: Hybrid score adjustment
            final_score = self.apply_llm_adjustment(base_score, llm_insights, product)
            
            # Step 6: Generate reasoning
            reasoning = self.generate_reasoning(product, user_features, llm_insights)
            
            # Step 7: Confidence calculation
            confidence = "High" if final_score >= 8.0 else "Medium" if final_score >= 6.0 else "Low"
            
            product_scores.append(Recommendation(
                product_name=product['name'],
                brand=product['brand'],
                category=product['category'],
                score=round(final_score, 1),
                reasoning=reasoning,
                confidence=confidence
            ))
        
        # Step 8: Sort by score and return top 3
        product_scores.sort(key=lambda x: x.score, reverse=True)
        
        # Step 9: Consistency check
        if not product_scores or product_scores[0].score < 3.0:
            # Fallback recommendation
            fallback_product = products[0]
            return [Recommendation(
                product_name=fallback_product['name'],
                brand=fallback_product['brand'],
                category=fallback_product['category'],
                score=5.0,
                reasoning="General recommendation based on your profile",
                confidence="Medium"
            )]
        
        return product_scores[:3]

# Initialize scoring engine
scoring_engine = HairAdvisorEngine()

# API endpoints
@app.get("/")
async def root():
    return {"message": "Hair Advisor API is running!"}

@app.get("/questions")
async def get_questions():
    """Get the questionnaire structure"""
    questions = [
        {
            "id": 1,
            "type": "card_select",
            "title": "Hair Condition",
            "description": "Flip hair-condition cards to select your primary hair condition",
            "options": ["Dry", "Oily", "Colored", "Damaged"],
            "required": True
        },
        {
            "id": 2,
            "type": "damage_slider",
            "title": "Damage Level",
            "description": "Slide the bar to indicate your hair damage level",
            "min": 1,
            "max": 10,
            "labels": ["Healthy", "Highly Damaged"],
            "required": True
        },
        {
            "id": 3,
            "type": "swipe_choice",
            "title": "Hair Texture",
            "description": "Swipe left/right to pick your hair texture",
            "options": ["Fine", "Medium", "Coarse"],
            "required": True
        },
        {
            "id": 4,
            "type": "drag_rank",
            "title": "Top 2 Hair Concerns",
            "description": "Drag problems to rank your top 2 concerns",
            "options": ["Damage", "Frizz", "Volume", "Dandruff", "Split Ends", "Dullness"],
            "max_selections": 2,
            "required": True
        },
        {
            "id": 5,
            "type": "toggle_puzzle",
            "title": "Routine & Care Level",
            "description": "Tap icons ON/OFF for your styling and coloring habits",
            "options": ["Heat Styling", "Coloring", "Frequent Washing", "Professional Treatments"],
            "required": True
        },
        {
            "id": 6,
            "type": "treasure_pick",
            "title": "Main Hair Goal",
            "description": "Choose 1 glowing goal orb for your main hair objective",
            "options": ["Repair", "Smooth", "Shine", "Volume"],
            "required": True
        },
        {
            "id": 7,
            "type": "emoji_selector",
            "title": "Scalp Condition",
            "description": "Pick your scalp condition using expressive emojis",
            "options": ["😊 Healthy", "😰 Oily", "😫 Dry", "😣 Sensitive"],
            "required": True
        },
        {
            "id": 8,
            "type": "puzzle_matching",
            "title": "Weather Effects",
            "description": "Drag weather icons to their effects on your hair",
            "weather_icons": ["☀️ Sun", "💨 Wind", "🌧️ Humidity", "❄️ Cold"],
            "effects": ["Frizz", "Damage", "Dullness", "Breakage"],
            "required": True
        },
        {
            "id": 9,
            "type": "character_builder",
            "title": "Hair Volume",
            "description": "Choose character silhouette with your desired hair volume",
            "options": ["Thin", "Medium", "Thick"],
            "required": True
        },
        {
            "id": 10,
            "type": "chat_input",
            "title": "Open Hair Routine",
            "description": "Tell us about your current hair routine and any specific concerns",
            "placeholder": "Describe your current hair care routine, styling habits, or any specific issues...",
            "required": False
        }
    ]
    return {"questions": questions}

@app.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """Generate hair product recommendations based on questionnaire responses"""
    try:
        # Store user responses in session
        user_sessions[request.session_id] = {
            'responses': request.responses,
            'timestamp': datetime.now().isoformat(),
            'session_id': request.session_id
        }
        
        # Generate recommendations
        recommendations = scoring_engine.get_recommendations(request.responses)
        
        # Store recommendations in session
        user_sessions[request.session_id]['recommendations'] = [
            {
                'product_name': rec.product_name,
                'brand': rec.brand,
                'category': rec.category,
                'score': rec.score,
                'reasoning': rec.reasoning,
                'confidence': rec.confidence
            } for rec in recommendations
        ]
        
        return {
            "session_id": request.session_id,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.get("/products")
async def get_products():
    """Get all available products from the dataset"""
    try:
        products = scoring_engine.get_products()
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@app.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get user session data including responses and recommendations"""
    try:
        if session_id not in user_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return user_sessions[session_id]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching session: {str(e)}")

@app.get("/sessions")
async def get_all_sessions():
    """Get all active sessions (for debugging)"""
    try:
        return {
            "total_sessions": len(user_sessions),
            "sessions": list(user_sessions.keys()),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sessions: {str(e)}")

@app.post("/reload-dataset")
async def reload_dataset_endpoint():
    """Reload the hair products dataset from Excel file"""
    try:
        product_count = reload_dataset()
        return {
            "message": "Dataset reloaded successfully",
            "product_count": product_count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reloading dataset: {str(e)}")

@app.get("/dataset-info")
async def get_dataset_info():
    """Get information about the loaded dataset"""
    try:
        return {
            "total_products": len(HAIR_PRODUCTS_DATASET),
            "brands": list(set([product['brand'] for product in HAIR_PRODUCTS_DATASET])),
            "categories": list(set([product['category'] for product in HAIR_PRODUCTS_DATASET])),
            "price_ranges": list(set([product['price_range'] for product in HAIR_PRODUCTS_DATASET])),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting dataset info: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
