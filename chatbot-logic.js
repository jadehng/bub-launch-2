// Enhanced Bubble Chatbot Logic with History Management

document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('chatbot-welcome');
  const chatContainer = document.getElementById('chatbot-chat-container');
  const startChatBtn = document.getElementById('start-chat-btn');
  const messageList = document.getElementById('chatbot-message-list');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const suggestionsContainer = document.getElementById('chatbot-suggestions');
  const statusIndicator = document.getElementById('chatbot-status');
  const historyList = document.getElementById('chatbot-history-list');
  const newChatBtn = document.getElementById('new-chat-btn');
  
  // Language and chat state
  let currentLanguage = document.documentElement.lang || 'en';
  let currentChatId = null;
  let chatHistory = JSON.parse(localStorage.getItem('bubbleChatHistory') || '[]');
  let currentMessages = [];
  
  // Investment-focused suggestion keys - personalized
  const suggestionKeys = [
    'chat.sample.performance', // What's my portfolio performance today?
    'chat.sample.crypto', // Show me my crypto positions
    'chat.sample.strategies', // How did my strategies perform this week?
    'chat.sample.risk', // What's my current risk exposure?
    'chat.sample.news', // Any important news affecting my holdings?
    'chat.sample.rebalance'  // When should I rebalance my portfolio?
  ];

  // Animated placeholder functionality
  let placeholderIndex = 0;
  let placeholderInterval;

  function startPlaceholderAnimation() {
    const placeholders = translations['chat.placeholder.rotating']?.[currentLanguage] || [
      'Ask about your portfolio performance...',
      'Check your crypto positions...',
      'Review recent transactions...'
    ];
    
    placeholderInterval = setInterval(() => {
      input.placeholder = placeholders[placeholderIndex];
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 2000);
  }

  function stopPlaceholderAnimation() {
    if (placeholderInterval) {
      clearInterval(placeholderInterval);
      placeholderInterval = null;
    }
  }

  // Language toggle functionality
  function setupLanguageToggle() {
    const enSwitch = document.getElementById('en-switch');
    const frSwitch = document.getElementById('fr-switch');
    
    if (enSwitch && frSwitch) {
      enSwitch.addEventListener('click', () => switchLanguage('en'));
      frSwitch.addEventListener('click', () => switchLanguage('fr'));
    }
  }

  function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update active language button
    document.querySelectorAll('.language-switcher button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`${lang}-switch`).classList.add('active');
    
    // Translate all elements
    translatePage();
    renderSuggestions();
    stopPlaceholderAnimation();
    startPlaceholderAnimation();
    
    // Save language preference
    localStorage.setItem('bubbleLanguage', lang);
  }

  // Chat history management
  function saveChatHistory() {
    localStorage.setItem('bubbleChatHistory', JSON.stringify(chatHistory));
  }

  function createNewChat() {
    currentChatId = 'chat_' + Date.now();
    currentMessages = [];
    messageList.innerHTML = '';
    
    // Add welcome message
    addMessage({
      message: translations['chatbot.welcome']?.[currentLanguage] || 'Hello! How can I help you with your portfolio today?',
      type: 'ai'
    });
  }

  function saveCurrentChat() {
    if (currentChatId && currentMessages.length > 0) {
      const existingChatIndex = chatHistory.findIndex(chat => chat.id === currentChatId);
      const firstUserMessage = currentMessages.find(msg => msg.type === 'user');
      const chatTitle = firstUserMessage ? 
        firstUserMessage.message.substring(0, 50) + (firstUserMessage.message.length > 50 ? '...' : '') :
        'New Chat';
      
      const chatData = {
        id: currentChatId,
        title: chatTitle,
        messages: [...currentMessages],
        timestamp: Date.now(),
        language: currentLanguage
      };
      
      if (existingChatIndex >= 0) {
        chatHistory[existingChatIndex] = chatData;
      } else {
        chatHistory.unshift(chatData);
      }
      
      // Keep only last 20 chats
      if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(0, 20);
      }
      
      saveChatHistory();
      renderHistory();
    }
  }

  function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      currentChatId = chatId;
      currentMessages = [...chat.messages];
      currentLanguage = chat.language || 'en';
      
      // Switch language if needed
      if (document.documentElement.lang !== currentLanguage) {
        switchLanguage(currentLanguage);
      }
      
      // Render messages
      messageList.innerHTML = '';
      currentMessages.forEach(msg => {
        addMessage(msg, false); // false = don't save to history again
      });
      
      messageList.scrollTop = messageList.scrollHeight;
    }
  }

  function renderHistory() {
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    chatHistory.forEach(chat => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-title">${chat.title}</div>
        <div class="history-date">${new Date(chat.timestamp).toLocaleDateString()}</div>
      `;
      
      historyItem.addEventListener('click', () => {
        loadChat(chat.id);
        // Hide sidebar on mobile after selection
        if (window.innerWidth <= 768) {
          document.getElementById('chatbot-sidebar').classList.remove('mobile-visible');
        }
      });
      
      historyList.appendChild(historyItem);
    });
    
    // Add "New Chat" button at top
    if (newChatBtn) {
      newChatBtn.addEventListener('click', createNewChat);
    }
  }

  function renderSuggestions() {
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    suggestionKeys.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-suggestion-btn';
      btn.textContent = translations[key]?.[currentLanguage] || key;
      btn.addEventListener('click', () => {
        input.value = btn.textContent;
        input.focus();
      });
      suggestionsContainer.appendChild(btn);
    });
  }

  function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[key] && translations[key][currentLanguage]) {
        if (el.tagName === 'INPUT' && el.type === 'text') {
          el.placeholder = translations[key][currentLanguage];
        } else {
          el.textContent = translations[key][currentLanguage];
        }
      }
    });
  }

  // Welcome screen logic
  if (startChatBtn) {
    startChatBtn.addEventListener('click', () => {
      welcomeScreen.style.display = 'none';
      chatContainer.style.display = 'flex';
      createNewChat();
      startPlaceholderAnimation();
      input.focus();
    });
  }

  // Message rendering
  function addMessage({ message, type = 'ai', variant = 'text', streaming = false }, saveToHistory = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chatbot-message ${type}`;
    if (variant !== 'text') msgDiv.classList.add(`chatbot-message-${variant}`);
    if (streaming) msgDiv.classList.add('streaming');
    
    msgDiv.textContent = message;
    messageList.appendChild(msgDiv);
    messageList.scrollTop = messageList.scrollHeight;
    
    if (saveToHistory) {
      currentMessages.push({ message, type, timestamp: Date.now() });
      if (type === 'user') {
        saveCurrentChat(); // Save after user message to capture chat title
      }
    }
    
    return msgDiv;
  }

  // Send message logic
  async function handleSendMessage() {
    const userMessage = input.value.trim();
    if (!userMessage) return;
    
    stopPlaceholderAnimation();
    addMessage({ message: userMessage, type: 'user' });
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;
    statusIndicator.textContent = '● Processing...';

    // Add bot message placeholder
    const botMsgDiv = addMessage({ message: '', type: 'ai', streaming: true });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          language: currentLanguage,
          context: 'investment_assistant' // New context for investment-focused responses
        })
      });
      
      if (!response.ok) throw new Error('Network error');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let buffer = '';
      let isFirstChunk = true;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.substring(5).trim();
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.done) break;
              if (parsed.content) {
                if (isFirstChunk) {
                  botMsgDiv.textContent = '';
                  isFirstChunk = false;
                }
                fullResponse += parsed.content;
                botMsgDiv.textContent = fullResponse;
                messageList.scrollTop = messageList.scrollHeight;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
      
      // Update current messages with final response
      currentMessages[currentMessages.length - 1] = { 
        message: fullResponse, 
        type: 'ai', 
        timestamp: Date.now() 
      };
      saveCurrentChat();
      
    } catch (error) {
      botMsgDiv.textContent = 'Sorry, an error occurred. Please try again.';
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      statusIndicator.textContent = '● Online';
      startPlaceholderAnimation();
      input.focus();
    }
  }

  // Event listeners
  sendBtn.addEventListener('click', handleSendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  // Initialize
  const savedLanguage = localStorage.getItem('bubbleLanguage') || 'en';
  if (savedLanguage !== currentLanguage) {
    switchLanguage(savedLanguage);
  }
  
  setupLanguageToggle();
  translatePage();
  renderSuggestions();
  renderHistory();
  
  // Start with placeholder animation
  startPlaceholderAnimation();

  // Theme switching logic for logo color
  function updateLogoForTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    const mainLogo = document.getElementById('main-logo');
    const welcomeLogo = document.getElementById('welcome-logo');
    if (mainLogo) mainLogo.src = isDark ? 'bubble-logo-single copy.svg' : 'bubble-logo-single.svg';
    if (welcomeLogo) welcomeLogo.src = isDark ? 'bubble-logo-single copy.svg' : 'bubble-logo-single.svg';
  }

  // Listen for theme changes (assuming a button toggles 'dark-theme' class on body)
  const themeBtn = Array.from(document.querySelectorAll('.setting-item')).find(btn => btn.textContent.includes('Theme'));
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      updateLogoForTheme();
    });
  }
  updateLogoForTheme();

  // Update subtitle translation
  const subtitle = document.getElementById('chatbot-subtitle');
  if (subtitle && translations['hero.tagline']) {
    subtitle.textContent = translations['hero.tagline'][currentLanguage] || translations['hero.tagline']['en'];
  }

  // Ensure 'nouvelle conversation' button triggers new chat
  if (newChatBtn) {
    newChatBtn.addEventListener('click', createNewChat);
  }
  // Update crypto shortcut button label
  const cryptoShortcut = document.getElementById('crypto-shortcut');
  if (cryptoShortcut) {
    cryptoShortcut.textContent = '💱 Cryptos';
    cryptoShortcut.setAttribute('data-query', 'Show me my crypto positions');
  }
});