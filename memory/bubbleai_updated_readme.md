# Bubble AI Investment Agent Platform

## Mission & Vision
Bubble Invest is revolutionizing the financial paradigm for the 21st century: honest, transparent, and accessible investing for everyone. Our AI-powered platform democratizes financial expertise, enabling users to **build, customize, and deploy their own systematic investment agents** through natural language conversations—without the high fees or opacity of traditional finance. We leverage cutting-edge LLMs to empower users to become their own "quant fund managers," returning value directly to investors and making finance simple, ethical, and understandable.

## What is This Project?
This project is Bubble Invest's flagship product: a **conversational investment agent creation platform**. It transforms users from passive portfolio managers into active strategy creators. Users can:

### Core Capabilities
- **Build Custom Investment Strategies**: Create systematic strategies through natural language conversations
- **Three-Pillar Framework**: Design strategies across Universe Selection, Signal Generation, and Position Sizing
- **Integrated Backtesting**: Test strategies against historical data with comprehensive analytics
- **Live Deployment**: Deploy successful strategies to real portfolios with monitoring
- **AI-Powered Guidance**: Get expert-level advice and education throughout the process
- **Complete Transparency**: See generated code, understand every decision, track all performance

### Platform Features
- **Conversational Strategy Builder**: Natural language strategy creation and optimization
- **Real-time Backtesting**: Integrated with robust backtesting engine (backtrader)
- **Portfolio Management**: Unified view of multiple strategies and overall performance
- **Educational AI**: Financial concepts explained simply with hands-on learning
- **Strategy Monitoring**: Live performance tracking and optimization suggestions
- **Community Features**: Share and discover strategies (planned)

## Key Innovations

### 🤖 **Conversational Quantitative Finance**
- First platform enabling natural language systematic strategy creation
- Transform complex quantitative concepts into accessible conversations
- AI guides users through professional-grade strategy development

### 🏗️ **Three-Pillar Strategy Framework**
1. **🎯 Universe Selection**: Which assets to trade (stocks, ETFs, crypto, etc.)
2. **📊 Signal Generation**: When to enter/exit positions (technical, fundamental, sentiment)
3. **💰 Position Sizing**: How much capital to allocate (risk parity, momentum, mean reversion)

### 🔬 **Integrated Development Environment**
- Strategy creation through conversation
- Real-time backtesting and optimization
- Code generation and transparency
- Performance monitoring and analytics

### 💡 **Democratic Access to Institutional Tools**
- Professional-grade quantitative strategies accessible to all
- €10/month fixed fee vs 2% traditional management fees
- Educational approach that builds user expertise
- Community-driven strategy development

## Recent Enhancements (2025)

### Strategy Builder Integration
- **Conversational Strategy Creation**: Build systematic strategies through natural language
- **Three-Pillar Visualization**: Clear breakdown of strategy components
- **Live Backtesting Integration**: Real-time strategy validation
- **Strategy Deployment**: Automated execution and monitoring
- **Performance Analytics**: Comprehensive strategy attribution and analysis

### UI/UX Improvements
- Logo adapts to dark/light themes
- Strategy creation quick actions and shortcuts
- Enhanced sidebar with "My Strategies" section
- Strategy cards with three-pillar visualization
- Integrated backtesting results display
- Mobile-optimized strategy creation interface

### Backend Architecture
- LLM-powered strategy generation from natural language
- Integration with backtrader for robust backtesting
- Strategy persistence and versioning
- Real-time portfolio monitoring and rebalancing
- Risk management and compliance overlays

## Technology Stack

### Frontend
- **HTML5/CSS3/JavaScript**: Core web technologies with modern ES6+
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Glassmorphism UI**: Modern aesthetic with transparency and blur effects
- **Real-time Updates**: WebSocket integration for live data

### Backend Integration
- **LLM Integration**: OpenRouter API for conversational strategy creation
- **Backtesting Engine**: Backtrader for robust historical analysis
- **Data Sources**: OpenBB for comprehensive market data
- **Portfolio Management**: Custom allocation and rebalancing algorithms

### Strategy Development
- **Natural Language Processing**: Intent recognition and strategy translation
- **Quantitative Framework**: Professional-grade strategy components
- **Risk Management**: Automated risk controls and position sizing
- **Performance Attribution**: Detailed strategy-level analytics

## Usage

### Quick Start
1. Open `chatbot-standalone.html` in a browser
2. Click "Start Managing Your Portfolio"
3. Begin creating strategies through conversation:
   - "I want to create a momentum strategy for tech stocks"
   - "Build a mean reversion strategy for the S&P 500"
   - "Design a pairs trading strategy for correlated ETFs"

### Strategy Creation Workflow
1. **Describe Your Idea**: Natural language strategy description
2. **AI Guidance**: Three-pillar framework development
3. **Backtesting**: Automated historical validation
4. **Optimization**: AI-suggested improvements
5. **Deployment**: Live strategy execution
6. **Monitoring**: Ongoing performance tracking

### Example Conversation
```
User: "I want to create a tech momentum strategy"

AI: "Excellent! Let's build your custom investment agent using our three-pillar approach:

🎯 Universe: Which tech assets? (NASDAQ 100, specific sectors, etc.)
📊 Signals: How to detect momentum? (MA crossovers, RSI, volume)
💰 Sizing: Risk management approach? (equal weight, risk parity, etc.)

What's your vision for the tech universe?"

[Strategy card appears showing real-time progress]
```

## Configuration

### Environment Variables
Set up your `.env` file with:
```
OPENROUTER_API_KEY=your_openrouter_key
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID_WAITLIST=your_notion_db_id
BACKTRADER_API_ENDPOINT=your_backtesting_service
OPENBB_API_KEY=your_market_data_key
```

### API Endpoints
```
/api/chat - Enhanced chatbot with strategy creation
/api/strategy/create - Strategy definition and validation
/api/strategy/backtest - Historical performance testing
/api/strategy/deploy - Live strategy deployment
/api/portfolio/overview - Unified portfolio management
```

## Strategy Examples

### Momentum Strategy
- **Universe**: NASDAQ 100 top companies
- **Signals**: 20/50 day MA crossover + RSI confirmation
- **Sizing**: Risk parity with 15% volatility target

### Mean Reversion Strategy
- **Universe**: S&P 500 ETF sectors
- **Signals**: Bollinger Band oversold + RSI < 30
- **Sizing**: Kelly criterion with maximum 5% per position

### Pairs Trading Strategy
- **Universe**: Correlated sector ETFs (XLF/XLK, XLE/XLU)
- **Signals**: Z-score deviation > 2 standard deviations
- **Sizing**: Equal dollar long/short with 2% maximum risk

## Architecture Overview

### Frontend Components
```
src/
├── chatbot-standalone.html     # Main application interface
├── chatbot-logic.js           # Core conversation and strategy logic
├── chatbot-styles.css         # Glassmorphism UI and strategy components
├── translations.js            # Multi-language support (EN/FR)
├── chatbot-animations.js      # Smooth transitions and effects
└── assets/
    ├── bubble-logo-single.svg # Adaptive brand logo
    └── icons/                 # Strategy and UI icons
```

### Strategy Creation Engine
```
Strategy Builder Framework:
├── Conversation Parser        # Natural language intent recognition
├── Three-Pillar Generator    # Strategy component validation
├── Backtesting Integration   # Historical performance analysis
├── Code Generation          # Transparent strategy implementation
├── Risk Management         # Automated safety controls
└── Deployment Service      # Live strategy execution
```

### Data Flow
```
User Input → LLM Processing → Strategy Generation → Backtesting → Deployment → Monitoring
     ↓              ↓              ↓              ↓           ↓          ↓
  Intent      Component      Strategy        Performance   Live      Analytics
Recognition  Validation     Definition       Validation   Trading   Dashboard
```

## Development Roadmap

### Phase 1: Foundation (Completed)
- [x] Enhanced chatbot with strategy creation flows
- [x] Three-pillar visualization framework
- [x] Strategy card components and UI
- [x] Basic conversation patterns for strategy building
- [x] Quick action shortcuts for common strategies

### Phase 2: Core Engine (In Progress)
- [ ] LLM integration for strategy component generation
- [ ] Backtrader integration for robust backtesting
- [ ] Strategy persistence and versioning system
- [ ] Performance analytics and attribution
- [ ] Risk management overlays and controls

### Phase 3: Advanced Features (Planned)
- [ ] Live strategy deployment and monitoring
- [ ] Multi-strategy portfolio optimization
- [ ] Community strategy sharing platform
- [ ] Advanced visualization and reporting
- [ ] Mobile app development

### Phase 4: Expansion (Future)
- [ ] Alternative asset integration (crypto, commodities)
- [ ] Institutional strategy templates
- [ ] API for third-party integrations
- [ ] Global market expansion
- [ ] Advanced AI strategy optimization

## Business Model Innovation

### Traditional vs Bubble Approach
| Traditional Wealth Management | Bubble AI Platform |
|------------------------------|-------------------|
| 2% annual fees on assets | €10/month fixed subscription |
| Black box decision making | Complete transparency |
| Human limitations (9-5) | 24/7 AI availability |
| Preset strategies only | Custom strategy creation |
| Opaque fee structures | Clear, predictable costs |
| Limited accessibility | Democratic access for all |

### Value Proposition
- **Cost Efficiency**: €120/year vs €4,000+ traditional fees (200k portfolio)
- **Transparency**: See every decision, strategy, and line of code
- **Education**: Learn while building investment expertise
- **Customization**: Create strategies tailored to your beliefs
- **Accessibility**: Professional tools for everyone, not just institutions

## API Documentation

### Strategy Creation API
```javascript
// Create new strategy through conversation
POST /api/strategy/create
{
  "conversation_id": "uuid",
  "user_input": "I want momentum strategy for tech stocks",
  "language": "en|fr",
  "context": {
    "risk_tolerance": "moderate",
    "time_horizon": "long_term",
    "preferences": ["growth", "technology"]
  }
}

Response:
{
  "strategy_id": "uuid",
  "name": "Tech Momentum Strategy",
  "status": "building",
  "pillars": {
    "universe": {
      "description": "NASDAQ 100 technology stocks",
      "filters": ["market_cap > 1B", "sector = technology"],
      "status": "defined"
    },
    "signals": {
      "description": "Moving average crossover with RSI confirmation",
      "indicators": ["sma_20", "sma_50", "rsi_14"],
      "status": "configuring"
    },
    "sizing": {
      "description": "Risk parity allocation",
      "method": "risk_parity",
      "max_position": 0.05,
      "status": "pending"
    }
  },
  "next_steps": "Define signal parameters and thresholds"
}
```

### Backtesting API
```javascript
// Run historical analysis
POST /api/strategy/backtest
{
  "strategy_id": "uuid",
  "start_date": "2020-01-01",
  "end_date": "2024-12-31",
  "initial_capital": 100000,
  "benchmark": "SPY"
}

Response:
{
  "backtest_id": "uuid", 
  "performance": {
    "total_return": 0.243,
    "annual_return": 0.089,
    "sharpe_ratio": 1.34,
    "max_drawdown": -0.128,
    "win_rate": 0.67
  },
  "vs_benchmark": {
    "excess_return": 0.034,
    "tracking_error": 0.045,
    "information_ratio": 0.76
  },
  "visualization_data": { /* Chart data */ }
}
```

## Security & Compliance

### Data Protection
- User financial data encrypted at rest and in transit
- No storage of sensitive account credentials
- GDPR compliant data handling for EU users
- Regular security audits and penetration testing

### Financial Regulations
- Educational platform disclaimer for strategy creation
- Risk warnings for all backtesting and live trading
- Compliance with applicable financial service regulations
- Clear separation between educational and investment advice

### Risk Management
- Automated position size limits
- Maximum drawdown controls
- Diversification requirements
- Liquidity constraints for strategy deployment

## Contributing

### Development Setup
1. Clone the repository
2. Set up environment variables in `.env`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open browser to `http://localhost:3000`

### Code Standards
- ES6+ JavaScript with modern syntax
- Responsive CSS with mobile-first approach
- Comprehensive error handling and logging
- Unit tests for all strategy components
- Documentation for all public APIs

### Strategy Contribution
- Submit strategy templates via pull request
- Include comprehensive backtesting results
- Provide clear educational documentation
- Follow three-pillar framework structure

## Support & Community

### Getting Help
- Documentation: [docs.bubble-invest.com](https://docs.bubble-invest.com)
- Community Forum: [community.bubble-invest.com](https://community.bubble-invest.com)
- Support Email: support@bubble-invest.com
- Discord Server: [discord.gg/bubble-invest](https://discord.gg/bubble-invest)

### Waitlist & Early Access
- Join waitlist: [bubblewaitlist.replit.app](https://bubblewaitlist.replit.app/)
- Early beta access for contributors and community members
- Priority support for early adopters
- Exclusive access to advanced features

## Legal & Disclaimers

### Investment Education Platform
Bubble Invest is an educational platform for learning systematic investment strategies. All strategy creation, backtesting, and optimization features are for educational purposes. Users should:

- Conduct their own research before making investment decisions
- Understand that past performance does not guarantee future results  
- Consult with qualified financial advisors for personalized advice
- Only invest capital they can afford to lose
- Understand the risks associated with systematic trading strategies

### Open Source Components
This project uses various open-source libraries and frameworks. See `LICENSES.md` for complete attribution and license information.

---

**Bubble Invest**: Democratizing quantitative finance through conversational AI. 
Building the future where everyone can be their own fund manager.

*L'ère de l'IA change tout. Changeons avec elle.*

For more on our mission and philosophy, see our [Mission Statement](mission_statement.md) and [Graphic Charter](Charte_Graphique_Bubble.md).