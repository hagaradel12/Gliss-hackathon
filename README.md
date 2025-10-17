# Hair Advisor - Interactive Hair Care Recommendation System

A complete hair care recommendation system featuring an interactive questionnaire with 10 unique question types and a hybrid AI-powered scoring engine that provides personalized product recommendations.

## ✨ Features

### Interactive Questionnaire (10 Questions)
1. **Card Select Game** - Flip hair-condition cards (Dry, Oily, Colored, Damaged)
2. **Damage Meter Slider** - Slide from 🟢 Healthy → 🔴 Highly Damaged
3. **Swipe Choice Game** - Swipe left/right to pick Fine, Medium, Coarse texture
4. **Drag & Rank Game** - Drag problems to Rank #1 and #2 concerns
5. **Toggle Puzzle** - Tap icons ON/OFF for heat styling + coloring habits
6. **Treasure Pick Game** - Choose 1 glowing "goal orb" (repair, smooth, shine, volume)
7. **Emoji Selector** - Pick scalp condition using expressive emojis
8. **Puzzle Matching** - Drag weather icons to their hair effects
9. **Character Builder** - Choose character silhouette with hair volume
10. **Chat Bubble Input** - Floating text bubble for personal routine input

### Hybrid AI Scoring System
- **Base Scoring Engine** - Rule-based matching with weighted algorithms
- **LLM Integration** - OpenAI GPT analysis of open-text responses
- **Safety Guardrails** - Maximum 30% LLM adjustment, structured data extraction
- **Fallback System** - Consistent recommendations even with incomplete data
- **Confidence Scoring** - High/Medium/Low confidence levels for each recommendation

## 🏗️ Architecture

### Backend (Python + FastAPI)
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLite** - Lightweight database for products and user responses
- **OpenAI GPT** - LLM integration for advanced text analysis
- **Scikit-learn** - Machine learning utilities for scoring
- **Pydantic** - Data validation and serialization

### Frontend (Next.js + React)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Beautiful DnD** - Drag and drop functionality

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp ../env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Run the backend server:**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## 🎯 How It Works

### 1. Interactive Questionnaire
Users progress through 10 engaging question types, each designed to capture specific aspects of their hair profile:
- Hair condition and damage level
- Texture and volume preferences
- Top concerns and goals
- Routine and styling habits
- Environmental factors
- Personal hair care details

### 2. Hybrid Scoring Pipeline
```
User Input → Feature Encoding → Base Scoring → LLM Analysis → Score Adjustment → Final Ranking
```

**Step 1: Input Validation**
- Validates all required questions answered
- Applies default fallback values for missing data

**Step 2: Feature Encoding**
- Converts answers to numeric and categorical vectors
- Standardizes data for scoring algorithms

**Step 3: Base Scoring Engine**
- Rule-based matching using weighted similarity
- Considers hair type, concerns, goals, and routine
- Generates initial compatibility scores (0-10)

**Step 4: LLM Insight Extraction**
- Analyzes open-text responses for additional signals
- Extracts structured tags (damage, frizz, routine issues)
- Uses constrained prompts to prevent hallucination

**Step 5: Hybrid Score Adjustment**
- Applies LLM insights to adjust base scores
- Maximum 30% adjustment to maintain reliability
- Prevents LLM from overpowering core logic

**Step 6: Product Ranking**
- Sorts products by final adjusted scores
- Returns top 3 recommendations with confidence levels

**Step 7: Safety Reasoning**
- Generates explanations using only dataset information
- Provides transparent reasoning for each recommendation

### 3. Safety Guardrails
- **Hallucination Prevention** - LLM constrained to dataset fields only
- **Score Limits** - Maximum 30% adjustment from base score
- **Fallback System** - Consistent recommendations even with incomplete data
- **Validation** - Input validation and error handling throughout

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    features TEXT NOT NULL,
    target_hair_types TEXT NOT NULL,
    target_concerns TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    price_range TEXT NOT NULL,
    score_weight INTEGER DEFAULT 1
);
```

### User Responses Table
```sql
CREATE TABLE user_responses (
    id INTEGER PRIMARY KEY,
    session_id TEXT NOT NULL,
    hair_condition TEXT,
    damage_level INTEGER,
    hair_texture TEXT,
    top_concerns TEXT,
    routine_care TEXT,
    hair_goal TEXT,
    scalp_condition TEXT,
    weather_effects TEXT,
    hair_volume TEXT,
    open_routine TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 UI/UX Features

### Interactive Components
- **Card Flip Animations** - 3D flip effects for hair condition selection
- **Drag & Drop** - Intuitive ranking system for hair concerns
- **Swipe Gestures** - Mobile-friendly texture selection
- **Progress Tracking** - Visual progress bar and completion indicators
- **Responsive Design** - Works seamlessly on desktop and mobile

### Visual Design
- **Gradient Backgrounds** - Beautiful color transitions
- **Glass Morphism** - Modern backdrop-blur effects
- **Smooth Animations** - Framer Motion powered transitions
- **Color Psychology** - Strategic use of colors for different hair types
- **Accessibility** - High contrast and keyboard navigation support

## 🔧 API Endpoints

### GET `/questions`
Returns the complete questionnaire structure with all 10 questions.

### POST `/recommendations`
Accepts user responses and returns personalized product recommendations.

**Request Body:**
```json
{
  "session_id": "uuid",
  "responses": {
    "hair_condition": "damaged",
    "damage_level": 8,
    "hair_texture": "fine",
    "top_concerns": ["damage", "frizz"],
    "routine_care": {"heat_styling": true, "coloring": false},
    "hair_goal": "repair",
    "scalp_condition": "oily",
    "weather_effects": {"humidity": true},
    "hair_volume": "thin",
    "open_routine": "I wash every other day and use heat tools"
  }
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "recommendations": [
    {
      "product_name": "Gliss Ultimate Repair",
      "brand": "Gliss",
      "category": "shampoo",
      "score": 9.2,
      "reasoning": "Perfect for your damaged hair. Targets your damage concerns. Great for chemically processed hair.",
      "confidence": "High"
    }
  ],
  "timestamp": "2024-01-01T00:00:00"
}
```

### GET `/products`
Returns all available products in the database.

## 🛡️ Safety Features

### LLM Safety
- **Constrained Prompts** - Forces LLM to use only dataset information
- **Structured Extraction** - Extracts only predefined tags
- **Temperature Control** - Low temperature (0.1) for consistent outputs
- **Token Limits** - Prevents excessive API usage

### Data Validation
- **Input Sanitization** - All user inputs validated and sanitized
- **Type Checking** - Pydantic models ensure data integrity
- **Error Handling** - Graceful degradation on API failures
- **Fallback Values** - Default values for missing or invalid data

### Privacy & Security
- **No Personal Data Storage** - Only anonymous session IDs
- **API Key Protection** - Environment variable configuration
- **CORS Configuration** - Proper cross-origin resource sharing
- **Input Validation** - Prevents injection attacks

## 🚀 Deployment

### Backend Deployment
```bash
# Using Docker
docker build -t hair-advisor-backend ./backend
docker run -p 8000:8000 hair-advisor-backend

# Using Gunicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=out
```

## 📈 Performance Optimizations

### Backend
- **Database Indexing** - Optimized queries for fast lookups
- **Connection Pooling** - Efficient database connections
- **Response Caching** - Cache frequently accessed data
- **Async Operations** - Non-blocking I/O operations

### Frontend
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Next.js automatic image optimization
- **Bundle Analysis** - Optimized bundle sizes
- **Service Worker** - Offline functionality and caching

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For providing the GPT API for advanced text analysis
- **FastAPI** - For the excellent Python web framework
- **Next.js** - For the powerful React framework
- **Framer Motion** - For smooth animations and transitions
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

For support, email support@hairadvisor.com or join our Slack channel.

---

**Built with ❤️ for beautiful, healthy hair**
