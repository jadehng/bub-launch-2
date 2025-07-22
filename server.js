require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { Client } = require("@notionhq/client");
const axios = require("axios");
const fs = require("fs").promises;

const app = express();
const port = process.env.PORT || 8080;

// Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID_WAITLIST;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "/")));
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "your-super-secret-key-that-should-be-in-env",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  }),
);

// Document loading functions
let missionDocument = "";

async function loadDocument(fileName) {
  try {
    const filePath = path.join(__dirname, fileName);
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    return `[${fileName} could not be loaded]`;
  }
}

async function loadAllDocuments() {
  try {
    missionDocument = await loadDocument("mission_texte.txt");
    console.log("Mission document loaded successfully");
  } catch (error) {
    console.error("Error loading documents:", error);
  }
}

// Load documents when server starts
loadAllDocuments().catch(console.error);

const investmentSystemPrompt = (language, context) => {
  const isInvestmentAssistant = context === 'investment_assistant';
  
  if (isInvestmentAssistant) {
    return `You are the Bubble AI Investment Assistant - a professional portfolio manager and personal banker for Bubble's investment platform users.

### YOUR ROLE:
You are acting as the user's personal AI investment manager. The user is logged into their Bubble investment account and expects you to provide factual information about their portfolio, positions, and account status.

### CORE CAPABILITIES:
- Portfolio performance analysis and reporting
- Position tracking (stocks, ETFs, crypto, cash)
- Trade execution summaries and order status
- Risk assessment and exposure analysis
- Market news relevant to holdings
- Account balance and cash management
- Transaction history and statements

### RESPONSE STYLE:
- Professional but approachable (like a skilled financial advisor)
- Data-driven and factual
- Concise yet informative
- Use financial terminology appropriately
- Always respond in ${language.toUpperCase()}

### SAMPLE INTERACTIONS:
User: "What's my portfolio performance today?"
You: "Your portfolio is up 2.34% today, gaining $2,891.23. Your tech holdings led the gains with MSFT (+3.2%) and AAPL (+2.8%). Total portfolio value: $127,834.56."

User: "Show me my Bitcoin position"
You: "Your Bitcoin position: 0.85 BTC valued at $42,350 (avg. cost $38,200). Current P&L: +$4,150 (+10.86%). This represents 33.1% of your total portfolio."

User: "What trades did you execute this week?"
You: "This week I executed 3 trades: 1) Rebalanced your portfolio by selling 15 shares TSLA ($3,450) 2) Bought 25 shares VTI ($5,250) 3) Added 0.15 BTC ($7,500). All trades aligned with your risk parity strategy."

### IMPORTANT LIMITATIONS:
- You do NOT provide investment advice or recommendations
- You do NOT execute new trades (only report on completed ones)
- You focus on factual account information and data
- For investment decisions, you refer users to review their strategy settings

### MOCK DATA TO USE:
Since this is a demo, use realistic but fictional portfolio data:
- Total Portfolio Value: $127,834.56
- Today's P&L: +$2,891.23 (+2.34%)
- Cash Balance: $8,234.12
- Positions: AAPL, MSFT, VTI, BTC, ETH, cash
- Recent activity: rebalancing trades, dividend payments

### LANGUAGE REQUIREMENT: 
Always respond in ${language.toUpperCase()}. Never switch languages mid-conversation.`
  } else {
    // Original marketing/company explanation prompt for non-investment contexts
    return `You are a client-facing representative for Bubble. Your primary goal is to explain our company's values and offerings to potential customers. You must be helpful, transparent, and embody our mission to revolutionize the investment industry.

### LANGUAGE REQUIREMENT: You MUST respond in ${language.toUpperCase()} only.

**Core Principles:**
- **Cheap:** We offer a low, fixed monthly fee (e.g., 10€/month) instead of a percentage of assets
- **Automated:** We use AI and quantitative strategies to manage portfolios of low-cost ETFs
- **Transparent:** Every decision is explained. No hidden fees or complex products

**The Problem We Solve:**
The traditional finance industry is opaque, expensive, and outdated. 90% of fund managers underperform their benchmarks, yet they charge high fees.

**Our Solution:**
1. A personalized portfolio: Built with low-cost, diversified ETFs tailored to the user's risk profile
2. An AI assistant: A customized chatbot to guide users and explain financial concepts
3. Active, automated management: Strategies continuously improved and automatically implemented

At the end of every response, always include a clear call to action to join our waitlist.
Always respond in ${language.toUpperCase()}.`
  }
};

const models = [
  "google/gemini-2.0-flash-001",
  "openai/gpt-4.1-mini",
  "mistralai/magistral-small-2506",
  "deepseek/deepseek-r1-0528:free",
];

// Helper function to handle streaming response
async function streamResponse(res, model, messages, headers) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      data: {
        model: model,
        messages: messages,
        stream: true
      },
      responseType: 'stream',
      headers: headers
    })
    .then(response => {
      // Set headers for SSE (Server-Sent Events)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      let fullResponse = '';
      let buffer = '';

      response.data.on('data', chunk => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          const message = line.replace(/^data: /, '').trim();
          
          if (message === '[DONE]') {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
            resolve(fullResponse);
            return;
          }
          
          try {
            const parsed = JSON.parse(message);
            if (parsed.choices && parsed.choices[0].delta.content) {
              const content = parsed.choices[0].delta.content;
              fullResponse += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        }
      });

      response.data.on('end', () => {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
          resolve(fullResponse);
        }
      });

      response.data.on('error', err => {
        console.error('Stream error:', err);
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
          res.end();
        }
        reject(err);
      });
    })
    .catch(error => {
      console.error('Request failed:', error);
      reject(error);
    });
  });
}

app.post("/api/chat", async (req, res) => {
  console.log("POST /api/chat hit on server");
  
  if (!req.session.messageCount) {
    req.session.messageCount = 0;
  }

  if (req.session.messageCount >= 10) {
    return res.status(429).json({ error: "Message limit reached" });
  }

  req.session.messageCount++;

  const { message, language = "fr", context = "marketing" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Set up Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Mock AI responses for testing
  const mockResponses = {
    'en': [
      "Based on your portfolio data, I can see some interesting patterns.",
      "Your current asset allocation shows good diversification across sectors.",
      "The recent market volatility presents both opportunities and risks for your holdings.",
      "I recommend reviewing your risk tolerance and rebalancing if needed.",
      "Your portfolio performance is tracking well against market benchmarks."
    ],
    'fr': [
      "Basé sur les données de votre portefeuille, je peux voir des tendances intéressantes.",
      "Votre allocation d'actifs actuelle montre une bonne diversification entre secteurs.",
      "La volatilité récente du marché présente des opportunités et des risques pour vos positions.",
      "Je recommande de réviser votre tolérance au risque et de rééquilibrer si nécessaire.",
      "La performance de votre portefeuille suit bien les indices de référence du marché."
    ]
  };

  const responses = mockResponses[language] || mockResponses['en'];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Simulate streaming response
  const words = randomResponse.split(' ');
  let currentWord = 0;

  function sendNextWord() {
    if (currentWord < words.length) {
      const content = words[currentWord] + ' ';
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
      currentWord++;
      setTimeout(sendNextWord, 100); // Simulate typing delay
    } else {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  }

  // Start sending response
  setTimeout(sendNextWord, 500); // Initial delay to show "thinking" status
});

// API endpoint for form submission
app.post("/subscribe", async (req, res) => {
  const { name, email, profile, comments } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Nom: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        Profil: {
          select: {
            name: profile || "other",
          },
        },
        Commentaires: {
          rich_text: [
            {
              text: {
                content: comments || "",
              },
            },
          ],
        },
      },
    });
    res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Error adding to Notion:", error);
    res
      .status(500)
      .json({ error: "Failed to subscribe. Please try again later." });
  }
});

// Simple waitlist endpoint for modal
app.post("/api/waitlist", async (req, res) => {
  const { email, source } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Nom: {
          title: [
            {
              text: {
                content: "Quick Signup",
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        Profil: {
          select: {
            name: "other",
          },
        },
        Commentaires: {
          rich_text: [
            {
              text: {
                content: `Source: ${source || 'unknown'}`,
              },
            },
          ],
        },
      },
    });
    res.status(201).json({ message: "Successfully joined waitlist!" });
  } catch (error) {
    console.error("Error adding to Notion:", error);
    res
      .status(500)
      .json({ error: "Failed to join waitlist. Please try again later." });
  }
});

// Test POST route
app.post("/test-post", (req, res) => {
  console.log("POST /test-post hit on Replit server");
  res.status(200).send("POST test successful on Replit");
});

// Serve chatbot-standalone.html for the root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chatbot-standalone.html"));
});

app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
