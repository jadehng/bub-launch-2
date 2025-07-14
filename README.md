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

## ✨ Recent UI/UX & Functional Enhancements (2024)

- **Logo & Theme Adaptation**: Logo now adapts to dark/light themes, switching between black and white versions as per the Charte Graphique Bubble.md.
- **Button Color & Style**: All CTA and quick shortcut buttons now use the correct violet/purple gradient and gray shades, matching the brand palette. Blue buttons were removed.
- **Iconography**: All sidebar, settings, and welcome tile emojis replaced with consistent, brand-aligned SVG icons (no subtext, no background, uniform sizing).
- **Welcome Tile**: Feature icons in the welcome tile are now SVGs, sized and centered for legibility and consistency.
- **Quick Shortcuts**: Performance replaced by "Stock ETFs" and "Debt ETFs"; "Trades" replaced by "Leverage"; new "Real Estate" button added. All shortcuts use correct translations (EN/FR) and brand colors.
- **Suggestion Tiles**: Sample questions now appear as 4 rounded, centered tiles, matching a modern fintech look.
- **Main Chatbot Question**: Added a large, bold, purple-gradient "Hello," headline above the shortcuts, with the rest in black, for a welcoming and tech-inspired feel.
- **Input & Submit Button**: The chat input and submit button are now more rounded and visually prominent, matching the new design language.
- **Responsiveness**: All new elements and layouts are fully responsive and mobile-friendly.
- **Strict Brand Compliance**: All changes strictly follow the Charte Graphique Bubble.md for colors, typography, spacing, and iconography.
- **No Functional Changes**: All chatbot logic, content, and features remain unchanged—only the UI/UX and translations were improved.