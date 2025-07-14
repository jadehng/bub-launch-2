# Bubble AI Investment Assistant

A professional investment chatbot interface that simulates a personal AI portfolio manager experience.

## 🚀 Recent Enhancements

### ✅ **Fixed Issues**
1. **Sample Questions**: Added proper investment-focused sample questions instead of "chat.question1" placeholders
2. **Chat History**: Implemented functional sidebar history with persistent storage
3. **Language Toggle**: Added working EN/FR language switching for both UI and AI responses
4. **Professional Design**: Enhanced with fintech-grade styling and layout

### 🆕 **New Features**
1. **Investment-Focused Interface**: 
   - Portfolio overview widget with mock data
   - Investment-specific sample questions (performance, positions, trades)
   - Professional financial advisor tone

2. **Enhanced UX**:
   - Larger, more prominent chat interface
   - Animated placeholder text rotation
   - Quick action shortcuts for common queries
   - Glassmorphism design effects

3. **Header Integration**:
   - Sign In / Log In buttons (placeholders)
   - Join Waitlist modal with Notion integration
   - Learn More button

4. **Mobile Responsive**: 
   - Collapsible sidebar
   - Touch-friendly interface
   - Optimized for mobile usage

## 🎯 **Sample Investment Questions**

The chatbot now responds to questions like:
- "What's my portfolio performance today?"
- "Show me my Bitcoin position"
- "What trades did you execute this week?"
- "What's my current cash balance?"
- "How is my risk exposure looking?"

## 🛠 **Technical Features**

- **Dual System Prompts**: Marketing mode vs Investment Assistant mode
- **Chat History Management**: Persistent storage with localStorage
- **Language Detection**: Automatic UI translation
- **Mock Portfolio Data**: Realistic investment data for demos
- **Notion Integration**: Waitlist signups go directly to database

## 🎨 **Design Philosophy**

The interface now feels like logging into a professional investment account (similar to Robinhood, Wealthfront) rather than a marketing chatbot. Key improvements:

- Professional color scheme with investment-focused UI
- Real-time portfolio data display
- Financial terminology and data presentation
- Clean, modern fintech aesthetic

## 🚀 **Usage**

1. Open `chatbot-standalone.html` in a browser
2. Click "Start Managing Your Portfolio" 
3. Try the investment-focused sample questions
4. Experience the professional investment assistant interface

## 🔧 **Configuration**

Ensure your `.env` file contains:
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `NOTION_TOKEN`: Your Notion integration token  
- `NOTION_DATABASE_ID_WAITLIST`: Your Notion database ID

The system automatically detects context and switches between marketing and investment assistant modes based on the `context` parameter sent to the API.