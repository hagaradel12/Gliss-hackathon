# Getting Started with Hair Advisor

## 🚀 Quick Setup (Windows)

### Option 1: Automated Setup
1. **Run the setup script:**
   ```bash
   setup.bat
   ```

2. **Add your OpenAI API key:**
   - Edit `backend\.env` file
   - Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`

3. **Start the application:**
   ```bash
   start_all.bat
   ```

### Option 2: Manual Setup

#### Backend Setup
1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

3. **Create environment file:**
   ```bash
   copy ../env.example .env
   ```

4. **Add OpenAI API key to `.env`:**
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start backend:**
   ```bash
   python main.py
   ```

#### Frontend Setup
1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start frontend:**
   ```bash
   npm run dev
   ```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🧪 Test the System

1. **Open the frontend** in your browser
2. **Complete the questionnaire** - try all 10 interactive question types
3. **Get personalized recommendations** based on your responses
4. **Check the API docs** to see the backend in action

## 🔧 Troubleshooting

### Backend Issues
- **Port 8000 already in use:** Change port in `main.py` or kill existing process
- **OpenAI API errors:** Check your API key and billing status
- **Database errors:** Delete `hair_advisor.db` to reset

### Frontend Issues
- **Port 3000 already in use:** Next.js will automatically use next available port
- **Build errors:** Delete `node_modules` and run `npm install` again
- **CORS errors:** Ensure backend is running on port 8000

### Common Solutions
```bash
# Reset backend database
del backend\hair_advisor.db

# Reinstall frontend dependencies
cd frontend
rmdir /s node_modules
npm install

# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

## 📱 Features to Try

### Interactive Questions
- **Card Flip Game** - Click to flip hair condition cards
- **Damage Slider** - Drag the slider to set damage level
- **Swipe Choice** - Swipe or click to select hair texture
- **Drag & Drop** - Rank your top 2 hair concerns
- **Toggle Puzzle** - Toggle styling and care habits
- **Treasure Pick** - Choose your main hair goal
- **Emoji Selector** - Pick scalp condition with emojis
- **Puzzle Matching** - Match weather to hair effects
- **Character Builder** - Select hair volume preference
- **Chat Input** - Describe your hair routine

### AI Features
- **Hybrid Scoring** - Combines rule-based and AI analysis
- **LLM Integration** - Advanced text analysis of your routine
- **Safety Guardrails** - Prevents AI hallucination
- **Confidence Scoring** - Shows recommendation confidence levels

## 🎯 Next Steps

1. **Customize Products** - Add your own products to the database
2. **Modify Scoring** - Adjust the scoring algorithms in `backend/main.py`
3. **Add Questions** - Create new interactive question types
4. **Deploy** - Use the deployment guides in the main README
5. **Extend** - Add features like user accounts, product reviews, etc.

## 💡 Tips

- **Use real data** for best recommendations
- **Try different combinations** to see how recommendations change
- **Check the browser console** for debugging information
- **Use the API docs** to test the backend directly

Happy coding! 🚀
