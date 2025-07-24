// Enhanced Bubble Chatbot Logic with History Management

// Global language function
function setLanguage(lang) {
  console.log('setLanguage called with:', lang);
  if (window.currentLanguage !== undefined) {
    window.currentLanguage = lang;
    document.documentElement.lang = lang;
    if (window.updateAllTranslations) {
      window.updateAllTranslations();
    }
    if (window.updateSuggestions) {
      window.updateSuggestions();
    }
    
    // Update language button states
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.toLowerCase().includes(lang)) {
        btn.classList.add('active');
      }
    });
    
    console.log('Language set to:', lang);
  } else {
    console.error('Language system not initialized yet');
  }
}

// Debug function to check header elements
function debugHeaderElements() {
  console.log('=== HEADER ELEMENTS DEBUG ===');
  
  const header = document.querySelector('header.chatbot-header');
  console.log('Header element:', header);
  if (header) {
    console.log('Header display:', window.getComputedStyle(header).display);
    console.log('Header visibility:', window.getComputedStyle(header).visibility);
    console.log('Header opacity:', window.getComputedStyle(header).opacity);
    console.log('Header position:', window.getComputedStyle(header).position);
    console.log('Header z-index:', window.getComputedStyle(header).zIndex);
  }
  
  const langSelector = document.querySelector('.language-selector');
  console.log('Language selector:', langSelector);
  if (langSelector) {
    console.log('Lang selector display:', window.getComputedStyle(langSelector).display);
    console.log('Lang selector visibility:', window.getComputedStyle(langSelector).visibility);
  }
  
  const langBtns = document.querySelectorAll('.lang-btn');
  console.log('Language buttons found:', langBtns.length);
  langBtns.forEach((btn, index) => {
    console.log(`Lang button ${index}:`, btn);
    console.log(`Lang button ${index} display:`, window.getComputedStyle(btn).display);
    console.log(`Lang button ${index} visibility:`, window.getComputedStyle(btn).visibility);
  });
  
  const profileBtn = document.getElementById('profile-btn');
  console.log('Profile button:', profileBtn);
  if (profileBtn) {
    console.log('Profile button display:', window.getComputedStyle(profileBtn).display);
    console.log('Profile button visibility:', window.getComputedStyle(profileBtn).visibility);
  }
  
  const headerBtns = document.querySelectorAll('.header-btn');
  console.log('Header buttons found:', headerBtns.length);
  headerBtns.forEach((btn, index) => {
    console.log(`Header button ${index}:`, btn);
    console.log(`Header button ${index} display:`, window.getComputedStyle(btn).display);
    console.log(`Header button ${index} visibility:`, window.getComputedStyle(btn).visibility);
  });
  
  const sidebarToggle = document.getElementById('sidebar-toggle-btn');
  console.log('Sidebar toggle button:', sidebarToggle);
  if (sidebarToggle) {
    console.log('Sidebar toggle display:', window.getComputedStyle(sidebarToggle).display);
    console.log('Sidebar toggle visibility:', window.getComputedStyle(sidebarToggle).visibility);
  }
  
  console.log('=== END HEADER DEBUG ===');
}

// Global profile dropdown function
function toggleProfileDropdown() {
  console.log('toggleProfileDropdown called');
  const dropdown = document.getElementById('profile-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  
  console.log('Dropdown element:', dropdown);
  console.log('Profile button element:', profileBtn);
  
  if (dropdown && profileBtn) {
    const isVisible = dropdown.style.display === 'block';
    console.log('Current dropdown visibility:', isVisible);
    
    // Force the dropdown to be visible
    if (isVisible) {
      dropdown.style.display = 'none';
      dropdown.classList.remove('show');
      profileBtn.classList.remove('active');
    } else {
      dropdown.style.display = 'block';
      dropdown.classList.add('show');
      profileBtn.classList.add('active');
    }
    
    console.log('New dropdown display:', dropdown.style.display);
    console.log('New dropdown classes:', dropdown.className);
    console.log('Profile button active class:', profileBtn.classList.contains('active'));
  } else {
    console.error('Profile dropdown elements not found!');
    console.error('Dropdown:', dropdown);
    console.error('Profile button:', profileBtn);
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('profile-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  
  if (dropdown && profileBtn) {
    const isClickInsideDropdown = dropdown.contains(event.target);
    const isClickOnProfileBtn = profileBtn.contains(event.target);
    
    if (!isClickInsideDropdown && !isClickOnProfileBtn && dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
      dropdown.classList.remove('show');
      profileBtn.classList.remove('active');
    }
  }
});

// Global profile action handler
function handleProfileAction(action) {
  console.log('Profile action:', action);
  // Handle different profile actions
  switch(action) {
    case 'account':
      console.log('Opening account settings...');
      // Add account settings logic here
      break;
    case 'upgrade':
      console.log('Opening upgrade modal...');
      showUpgradeModal();
      break;
    case 'settings':
      console.log('Opening settings...');
      // Add settings logic here
      break;
    case 'notifications':
      console.log('Opening notification preferences...');
      // Add notification settings logic here
      break;
    case 'theme':
      console.log('Opening theme settings...');
      // Add theme settings logic here
      break;
    case 'privacy':
      console.log('Opening privacy settings...');
      // Add privacy settings logic here
      break;
    case 'logout':
      console.log('Logging out...');
      // Add logout logic here
      break;
    default:
      console.log('Unknown profile action:', action);
  }
}

// Global variables
window.currentLanguage = document.documentElement.lang || 'en';

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
  // currentLanguage is now global (window.currentLanguage)
  let currentChatId = null;
  let chatHistory = JSON.parse(localStorage.getItem('bubbleChatHistory') || '[]');
  let currentMessages = [];
  let isFirstMessage = true;
  
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
    const placeholders = translations['chat.placeholder.rotating']?.[window.currentLanguage] || [
      'Ask about your portfolio performance...',
      'Check your crypto positions...',
      'Review recent transactions...'
    ];
    
    placeholderInterval = setInterval(() => {
      if (input) {
      input.placeholder = placeholders[placeholderIndex];
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
      }
    }, 2000);
  }

  function stopPlaceholderAnimation() {
    if (placeholderInterval) {
      clearInterval(placeholderInterval);
      placeholderInterval = null;
    }
  }

  // Core chatbot initialization
  function initializeChatbot() {
    console.log('Initializing chatbot...');
    console.log('Elements found:', {
      sendBtn: !!sendBtn,
      input: !!input,
      newChatBtn: !!newChatBtn,
      messageList: !!messageList
    });
    
    // Set up event listeners
    if (sendBtn) {
      console.log('Adding click listener to send button');
      sendBtn.addEventListener('click', handleSendMessage);
    } else {
      console.error('Send button not found!');
    }
    
    if (input) {
      console.log('Adding keypress listener to input');
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          console.log('Enter key pressed');
          handleSendMessage();
        }
      });
      input.addEventListener('focus', stopPlaceholderAnimation);
      input.addEventListener('blur', startPlaceholderAnimation);
    } else {
      console.error('Input element not found!');
    }
    
    if (newChatBtn) {
      console.log('Adding click listener to new chat button');
      newChatBtn.addEventListener('click', startNewChat);
    } else {
      console.error('New chat button not found!');
    }

    // Initialize suggestions
    updateSuggestions();
    loadChatHistory();
    
    // Initialize profile dropdown
    initializeProfileDropdown();
    
    // Start placeholder animation
    startPlaceholderAnimation();
    
    console.log('Chatbot initialized successfully');
  }

  // Handle send message
  function handleSendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    console.log('handleSendMessage called');
    console.log('Message to send:', message);
    
    if (!message) {
      console.log('Empty message, returning');
      return;
    }
    
    // Hide feature tiles on first interaction
    hideFeatureTiles();
    
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Clear input
    input.value = '';
    
    // Show thinking status
    showThinkingStatus();
    
    // Send to server
    sendToServer(message);
  }

  function addMessageToChat(sender, message) {
    if (!messageList) return;
    
    // Show message list if hidden
    messageList.style.display = 'block';
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageTime);
    messageList.appendChild(messageElement);
    
    // Scroll to bottom
    messageList.scrollTop = messageList.scrollHeight;
    
    // Add to current messages
    currentMessages.push({ sender, message, timestamp: Date.now() });
  }

  function showThinkingStatus() {
    if (statusIndicator) {
      statusIndicator.style.display = 'block';
      const statusText = statusIndicator.querySelector('.status-text');
      if (statusText) {
        statusText.textContent = getTranslatedText('ai.thinking');
      }
    }
  }

  function hideThinkingStatus() {
    if (statusIndicator) {
      statusIndicator.style.display = 'none';
    }
  }

  async function sendToServer(message) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message,
          history: currentMessages.slice(-10) // Send last 10 messages for context
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                aiResponse += data.content;
                updateAIResponse(aiResponse);
              }
              if (data.done) {
                hideThinkingStatus();
                finalizeAIResponse(aiResponse);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      hideThinkingStatus();
      addMessageToChat('ai', getTranslatedText('ai.error'));
    }
  }

  function updateAIResponse(response) {
    // Update the last AI message or create a new one
    const lastMessage = messageList.lastElementChild;
    if (lastMessage && lastMessage.classList.contains('ai-message')) {
      lastMessage.querySelector('.message-content').textContent = response;
    } else {
      addMessageToChat('ai', response);
    }
  }

  function finalizeAIResponse(response) {
    // Save to chat history
    if (currentChatId) {
      saveChatToHistory();
    } else {
      // Create new chat
      currentChatId = generateChatId();
      saveChatToHistory();
      updateHistoryDisplay();
    }
  }

  function updateSuggestions() {
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    
    // Create suggestion buttons
    suggestionKeys.forEach(key => {
      const suggestion = getTranslatedText(key);
      if (suggestion && suggestion !== key) {
        const button = document.createElement('button');
        button.className = 'suggestion-btn';
        button.textContent = suggestion;
        button.addEventListener('click', () => {
          input.value = suggestion;
          handleSendMessage();
        });
        suggestionsContainer.appendChild(button);
      }
    });
  }

  function startNewChat() {
    currentChatId = null;
    currentMessages = [];
    isFirstMessage = true;
    
    // Clear chat
    if (messageList) {
    messageList.innerHTML = '';
      messageList.style.display = 'none';
    }
    
    // Hide shortcuts and show feature tiles
    const shortcuts = document.getElementById('chatbot-new-shortcuts');
    const featureTiles = document.querySelector('.chatbot-feature-tiles');
    
    if (shortcuts) {
      shortcuts.style.display = 'none';
    }
    if (featureTiles) {
      featureTiles.style.display = 'flex';
    }
    
    hideThinkingStatus();
    console.log('Started new chat');
  }

  function loadChatHistory() {
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    chatHistory.forEach(chat => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-title">${chat.title}</div>
        <div class="history-date">${new Date(chat.timestamp).toLocaleDateString()}</div>
      `;
      historyItem.addEventListener('click', () => loadChat(chat.id));
      historyList.appendChild(historyItem);
    });
  }

  function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    currentMessages = chat.messages;
    isFirstMessage = false;
    
    // Clear and populate message list
    messageList.innerHTML = '';
    messageList.style.display = 'block';
    
    chat.messages.forEach(msg => {
      addMessageToChat(msg.sender, msg.message);
    });
    
    // Show shortcuts if there are messages
    if (chat.messages.length > 0) {
      const shortcuts = document.getElementById('chatbot-new-shortcuts');
      const featureTiles = document.querySelector('.chatbot-feature-tiles');
      
      if (shortcuts) {
        shortcuts.style.display = 'block';
      }
      if (featureTiles) {
        featureTiles.style.display = 'none';
      }
    }
  }

  function saveChatToHistory() {
    if (!currentChatId || currentMessages.length === 0) return;
    
      const existingChatIndex = chatHistory.findIndex(chat => chat.id === currentChatId);
    const chatTitle = currentMessages[0]?.message.substring(0, 50) + '...' || 'New Chat';
      
      const chatData = {
        id: currentChatId,
        title: chatTitle,
      messages: currentMessages,
      timestamp: Date.now()
      };
      
      if (existingChatIndex >= 0) {
        chatHistory[existingChatIndex] = chatData;
      } else {
        chatHistory.unshift(chatData);
      }
      
      // Keep only last 20 chats
        chatHistory = chatHistory.slice(0, 20);
    
    localStorage.setItem('bubbleChatHistory', JSON.stringify(chatHistory));
    updateHistoryDisplay();
  }

  // Update history display in sidebar
  function updateHistoryDisplay() {
    const historyList = document.getElementById('chatbot-history-list');
    const historyDropdown = document.getElementById('chat-history-dropdown');
    
    if (!historyList) return;
    
    // Clear existing history
    historyList.innerHTML = '';
    
    // Get chat history from localStorage
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    if (chatHistory.length === 0) {
      // Hide dropdown if no history
      if (historyDropdown) {
        historyDropdown.style.display = 'none';
      }
      return;
    }
    
    // Show dropdown if there's history
    if (historyDropdown) {
      historyDropdown.style.display = 'block';
    }
    
    // Display recent chats (limit to 5)
    const recentChats = chatHistory.slice(-5).reverse();
    
    recentChats.forEach(chat => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.setAttribute('data-chat-id', chat.id);
      
      // Get first message preview
      const firstMessage = chat.messages[0] || '';
      const preview = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
      
      // Format date
      const date = new Date(chat.timestamp);
      const formattedDate = date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit' 
      });
      
      historyItem.innerHTML = `
        <div class="history-preview">${preview}</div>
        <div class="history-date">${formattedDate}</div>
      `;
      
      historyItem.addEventListener('click', () => {
        loadChat(chat.id);
        // Hide dropdown after selection
        if (historyDropdown) {
          historyDropdown.style.display = 'none';
        }
      });
      
      historyList.appendChild(historyItem);
    });
  }

  function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  // Language switching
  // setLanguage(currentLanguage); // This line is now handled globally

  // Animate feature tiles out
  function animateFeatureTilesOut() {
    const featureTiles = document.querySelector('.chatbot-feature-tiles');
    if (featureTiles) {
      featureTiles.style.transition = 'all 0.6s ease-out';
      featureTiles.style.opacity = '0';
      featureTiles.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        featureTiles.style.display = 'none';
      }, 600);
    }
  }

  // Show new shortcuts
  function showNewShortcuts() {
    if (window.BubbleAnimations) {
      window.BubbleAnimations.animateShortcutsIn();
        } else {
      // Fallback to original implementation
      const newShortcuts = document.getElementById('chatbot-new-shortcuts');
      if (newShortcuts) {
        newShortcuts.style.display = 'block';
        newShortcuts.style.opacity = '0';
        newShortcuts.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          newShortcuts.style.transition = 'all 0.6s ease-out';
          newShortcuts.style.opacity = '1';
          newShortcuts.style.transform = 'translateY(0)';
        }, 100);
      }
    }
  }

  // Initialize everything
  initializeChatbot();
  initializeSidebar();
  initializeProfileDropdown();
  initializeNewShortcuts();
  initializeAIModeButtons();
  addSidebarTooltips();
  
  // Immediate debug - check header elements
  console.log('=== IMMEDIATE HEADER DEBUG ===');
  const header = document.querySelector('header.chatbot-header');
  console.log('Header found:', !!header);
  if (header) {
    console.log('Header HTML:', header.outerHTML);
    console.log('Header computed display:', window.getComputedStyle(header).display);
    console.log('Header computed visibility:', window.getComputedStyle(header).visibility);
    console.log('Header computed opacity:', window.getComputedStyle(header).opacity);
    console.log('Header computed position:', window.getComputedStyle(header).position);
    console.log('Header computed top:', window.getComputedStyle(header).top);
    console.log('Header computed z-index:', window.getComputedStyle(header).zIndex);
  }
  
  const langBtns = document.querySelectorAll('.lang-btn');
  console.log('Language buttons found:', langBtns.length);
  langBtns.forEach((btn, index) => {
    console.log(`Lang button ${index} HTML:`, btn.outerHTML);
    console.log(`Lang button ${index} computed display:`, window.getComputedStyle(btn).display);
    console.log(`Lang button ${index} computed visibility:`, window.getComputedStyle(btn).visibility);
  });
  
  const headerBtns = document.querySelectorAll('.header-btn');
  console.log('Header buttons found:', headerBtns.length);
  headerBtns.forEach((btn, index) => {
    console.log(`Header button ${index} HTML:`, btn.outerHTML);
    console.log(`Header button ${index} computed display:`, window.getComputedStyle(btn).display);
    console.log(`Header button ${index} computed visibility:`, window.getComputedStyle(btn).visibility);
  });
  
  const profileBtn = document.getElementById('profile-btn');
  console.log('Profile button found:', !!profileBtn);
  if (profileBtn) {
    console.log('Profile button HTML:', profileBtn.outerHTML);
    console.log('Profile button computed display:', window.getComputedStyle(profileBtn).display);
    console.log('Profile button computed visibility:', window.getComputedStyle(profileBtn).visibility);
  }
  
  console.log('=== END IMMEDIATE DEBUG ===');
  
  // Debug header elements after initialization
  setTimeout(() => {
    debugHeaderElements();
  }, 1000);
  
  // Export functions to window for debugging
  window.debugChatbot = {
    handleSendMessage: handleSendMessage,
    sendToServer: sendToServer,
    initializeChatbot: initializeChatbot,
    debugHeaderElements: debugHeaderElements,
    testElements: () => {
      const sendBtn = document.getElementById('chatbot-send-btn');
      const input = document.getElementById('chatbot-input');
      const messageList = document.getElementById('chatbot-message-list');
      const newChatBtn = document.getElementById('new-chat-btn');
      return {
        sendBtn: !!sendBtn,
        input: !!input,
        messageList: !!messageList,
        newChatBtn: !!newChatBtn
      };
    }
  };
  
  console.log('All chatbot functions initialized and available at window.debugChatbot');
});

// Enhanced Sidebar Functionality
function initializeSidebar() {
  console.log('Initializing sidebar...');
  const sidebar = document.getElementById('chatbot-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const layout = document.querySelector('.chatbot-layout');
  
  console.log('Sidebar element:', sidebar);
  console.log('Toggle button element:', toggleBtn);
  console.log('Layout element:', layout);
  
  // Load saved state
  const savedState = localStorage.getItem('sidebarCollapsed');
  console.log('Saved sidebar state:', savedState);
  
  if (savedState === 'true') {
    sidebar?.classList.add('collapsed');
    layout?.classList.add('sidebar-collapsed');
  }
  
  if (toggleBtn && sidebar) {
    console.log('Adding click listener to sidebar toggle button');
    toggleBtn.addEventListener('click', () => {
      console.log('Sidebar toggle button clicked!');
      sidebar.classList.toggle('collapsed');
      layout?.classList.toggle('sidebar-collapsed');
      
      // Save state
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      console.log('Sidebar collapsed:', sidebar.classList.contains('collapsed'));
      
      // Update toggle button icon
      const icon = toggleBtn.querySelector('svg');
      if (sidebar.classList.contains('collapsed')) {
        icon.innerHTML = '<path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>';
        } else {
        icon.innerHTML = '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>';
      }
    });
    console.log('Sidebar toggle event listener added successfully');
  } else {
    console.error('Sidebar toggle button or sidebar not found!');
  }

  // Mobile sidebar handling
  if (window.innerWidth <= 768) {
    sidebar?.classList.add('mobile-closed');
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      sidebar?.classList.add('mobile-closed');
        } else {
      sidebar?.classList.remove('mobile-closed');
    }
  });
  
  console.log('Sidebar initialization complete');
}

// Enhanced Tooltip System
function addSidebarTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', (e) => {
      const tooltip = e.target.getAttribute('data-tooltip');
      if (tooltip) {
        showTooltip(e.target, tooltip);
      }
    });
    
    element.addEventListener('mouseleave', () => {
      hideTooltip();
    });
  });
}

function showTooltip(element, text) {
  const tooltip = document.createElement('div');
  tooltip.className = 'custom-tooltip';
  tooltip.textContent = text;
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: 1002;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(tooltip);
  
  const rect = element.getBoundingClientRect();
  tooltip.style.left = rect.right + 8 + 'px';
  tooltip.style.top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2 + 'px';
  
  setTimeout(() => {
    tooltip.style.opacity = '1';
  }, 10);
  
  element._tooltip = tooltip;
}

function hideTooltip() {
  const tooltip = document.querySelector('.custom-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Enhanced Guide Me Notification System
function initializeGuideMe() {
  const guideMeBtn = document.getElementById('guide-me-btn');
  
  if (guideMeBtn) {
    guideMeBtn.addEventListener('click', function() {
      showGuideMeNotification();
    });
  }
  
  // Set up periodic notifications
  setupGuideNotifications();
}

function showGuideMeNotification() {
  const notifications = [
    {
      type: 'market_alert',
      title: 'Market Alert',
      message: 'Markets are down 3% today - consider rebalancing your portfolio',
      icon: '📉'
    },
    {
      type: 'opportunity',
      title: 'Opportunity Detected',
      message: 'Tech stocks showing strong momentum this week',
      icon: '🚀'
    },
    {
      type: 'portfolio_insight',
      title: 'Portfolio Insight',
      message: 'Your crypto allocation is 15% above target',
      icon: '📊'
    },
    {
      type: 'trade_suggestion',
      title: 'Trade Suggestion',
      message: 'Consider taking profits on AAPL (+12% this month)',
      icon: '💡'
    }
  ];
  
  const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
  createNotification(randomNotification);
}

function createNotification(notificationData) {
  const notification = document.createElement('div');
  notification.className = `guide-notification ${notificationData.type}`;
  
  notification.innerHTML = `
    <div class="notification-icon">${notificationData.icon}</div>
    <div class="notification-content">
      <div class="notification-title">${notificationData.title}</div>
      <div class="notification-message">${notificationData.message}</div>
    </div>
    <button class="notification-close" aria-label="Close notification">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 8000);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
}

function setupGuideNotifications() {
  // Show a notification every 30 seconds (for demo purposes)
  // In production, this would be based on real market data
  setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance every 30 seconds
      showGuideMeNotification();
    }
  }, 30000);
}

// Profile Dropdown Functionality
function initializeProfileDropdown() {
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
        
        // Handle dropdown item clicks
        const dropdownItems = profileDropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const text = this.querySelector('span').textContent;
                handleProfileAction(text);
                profileDropdown.classList.remove('show');
            });
        });
    }
}

// Handle profile dropdown actions
function handleProfileAction(action) {
    switch(action) {
        case 'My Plan':
        case 'Mon Plan':
            showUpgradeModal();
            break;
        case 'Settings':
        case 'Paramètres':
            showSettingsModal();
            break;
        case 'Notification Preferences':
        case 'Préférences de Notification':
            showNotificationSettings();
            break;
        default:
            console.log('Profile action:', action);
    }
}

// Toggle profile dropdown
// This function is now global

// Close profile dropdown when clicking outside
document.addEventListener('click', function(event) {
  const profileContainer = document.querySelector('.profile-dropdown-container');
  const dropdown = document.getElementById('profile-dropdown');
  
  if (profileContainer && dropdown && !profileContainer.contains(event.target)) {
    dropdown.style.display = 'none';
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
      profileBtn.classList.remove('active');
    }
  }
});

// Initialize profile dropdown
function initializeProfileDropdown() {
  console.log('Initializing profile dropdown...');
  const profileBtn = document.getElementById('profile-btn');
  const dropdown = document.getElementById('profile-dropdown');
  
  console.log('Profile button found:', !!profileBtn);
  console.log('Profile dropdown found:', !!dropdown);
  
  if (profileBtn) {
    // Remove any existing onclick and add event listener
    profileBtn.removeAttribute('onclick');
    profileBtn.addEventListener('click', toggleProfileDropdown);
    console.log('Profile dropdown event listener added');
  } else {
    console.error('Profile button not found!');
  }
}

// New Shortcuts Functionality
  // Initialize new chat functionality
  function initializeNewShortcuts() {
    const newChatBtn = document.getElementById('new-chat-btn');
    const historyDropdown = document.getElementById('chat-history-dropdown');
    
    if (newChatBtn) {
      newChatBtn.addEventListener('click', function() {
        // Toggle history dropdown
        if (historyDropdown) {
          const isVisible = historyDropdown.style.display !== 'none';
          historyDropdown.style.display = isVisible ? 'none' : 'block';
          
          // Load chat history if showing
          if (!isVisible) {
            loadChatHistory();
          }
        }
        
        // Start new chat
        startNewChat();
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (historyDropdown && !historyDropdown.contains(event.target) && !newChatBtn.contains(event.target)) {
        historyDropdown.style.display = 'none';
      }
    });
    
    // Initialize shortcut buttons
    const shortcutButtons = document.querySelectorAll('.new-shortcut-btn');
    shortcutButtons.forEach(button => {
      button.addEventListener('click', function() {
        const query = this.getAttribute('data-query');
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send-btn');
        
        if (input && sendBtn && query) {
          input.value = query;
      input.focus();
          sendBtn.click();
        }
      });
    });
  }

// Premium Features Functionality
function initializePremiumFeatures() {
    const strategiesBtn = document.getElementById('strategies-btn');
    const upgradeBtn = document.getElementById('upgrade-plan-btn');
    
    if (strategiesBtn) {
        strategiesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showUpgradeModal('strategies');
        });
    }
    
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            showUpgradeModal();
        });
    }
    
    // Customize portfolio button
    const customizeBtn = document.getElementById('customize-portfolio-btn');
    if (customizeBtn) {
        customizeBtn.addEventListener('click', function() {
            showCustomizePortfolioModal();
        });
    }
}

// Show upgrade modal with premium features
function showUpgradeModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Upgrade to Premium</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <div class="upgrade-features">
          <div class="feature-item">
            <div class="feature-icon">🚀</div>
            <div class="feature-content">
              <h4>Full Strategy Creation</h4>
              <p>Create unlimited custom investment strategies using natural language</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h4>Advanced Analytics</h4>
              <p>Real-time portfolio tracking and performance optimization</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h4>Live Deployment</h4>
              <p>Deploy strategies to live trading with automated execution</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <div class="feature-content">
              <h4>Institutional Security</h4>
              <p>Bank-grade security and compliance for your investments</p>
            </div>
          </div>
        </div>
        <div class="upgrade-pricing">
          <div class="price">€10/month</div>
          <div class="price-subtitle">vs traditional 2% management fees</div>
        </div>
        <button class="btn-primary" onclick="handleUpgrade()">Upgrade Now</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Show customize portfolio modal with translations
function showCustomizePortfolioModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${getTranslatedText('modal.customize.title')}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <p>${getTranslatedText('modal.customize.description')}</p>
                <div style="margin: 1rem 0;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${getTranslatedText('modal.customize.riskLevel')}</label>
                    <select style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        <option>${getTranslatedText('modal.customize.conservative')}</option>
                        <option>${getTranslatedText('modal.customize.moderate')}</option>
                        <option>${getTranslatedText('modal.customize.aggressive')}</option>
                    </select>
                </div>
                <div style="margin: 1rem 0;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${getTranslatedText('modal.customize.goals')}</label>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn-outline" style="font-size: 0.875rem;">${getTranslatedText('modal.customize.retirement')}</button>
                        <button class="btn-outline" style="font-size: 0.875rem;">${getTranslatedText('modal.customize.growth')}</button>
                        <button class="btn-outline" style="font-size: 0.875rem;">${getTranslatedText('modal.customize.income')}</button>
                        <button class="btn-outline" style="font-size: 0.875rem;">${getTranslatedText('modal.customize.taxEfficiency')}</button>
                    </div>
                </div>
                <button class="btn-primary btn-violet" style="width: 100%; margin-top: 1rem;" onclick="savePortfolioSettings()">
                    ${getTranslatedText('modal.customize.save')}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Handle upgrade action
function handleUpgrade() {
    alert(getTranslatedText('notification.upgrade'));
    document.querySelector('.modal-overlay')?.remove();
}

// Save portfolio settings
function savePortfolioSettings() {
    alert(getTranslatedText('notification.settingsSaved'));
    document.querySelector('.modal-overlay')?.remove();
}

// Show settings modal
function showSettingsModal() {
    alert(getTranslatedText('notification.settings'));
}

// Show notification settings
function showNotificationSettings() {
    alert(getTranslatedText('notification.preferences'));
}

// Initialize AI mode buttons
function initializeAIModeButtons() {
  const aiModeButtons = document.querySelectorAll('.ai-mode-btn');
  
  aiModeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const mode = this.getAttribute('data-mode');
      const input = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send-btn');
      
      // Set mode-specific queries
      const modeQueries = {
        guide: "Guide me through today's investment opportunities and help me discover what I need",
        strategy: "Help me build a systematic investment strategy using natural language",
        expert: "I need expert investment advice and market analysis",
        analyst: "Analyze my portfolio performance and provide detailed insights",
        auto: "Help me automate my investment decisions and portfolio management"
      };
      
      if (input && sendBtn && modeQueries[mode]) {
        input.value = modeQueries[mode];
        input.focus();
        sendBtn.click();
      }
    });
    
    // Update tooltip with translated text
    const tooltipKey = button.getAttribute('data-tooltip');
    if (tooltipKey) {
      button.setAttribute('data-tooltip', getTranslatedText(tooltipKey));
    }
  });
}

// Animate feature tiles out after first interaction
function hideFeatureTiles() {
  const featureTiles = document.querySelector('.chatbot-feature-tiles');
  if (featureTiles) {
    featureTiles.classList.add('hidden');
    setTimeout(() => {
      featureTiles.style.display = 'none';
    }, 600);
  }
}

// Scroll animation to hide feature tiles
function handleScrollAnimation() {
  const featureTiles = document.querySelector('.chatbot-feature-tiles');
  const scrollY = window.scrollY;
  
  if (featureTiles && scrollY > 50) {
    featureTiles.style.opacity = '0';
    featureTiles.style.transform = 'translateY(-20px)';
    featureTiles.style.transition = 'all 0.3s ease';
    
    // Hide completely after animation
    setTimeout(() => {
      featureTiles.style.display = 'none';
    }, 300);
  }
}

// Add scroll event listener
window.addEventListener('scroll', handleScrollAnimation);

// Initialize scroll animation on page load
document.addEventListener('DOMContentLoaded', function() {
  handleScrollAnimation();
});

// Mobile sidebar functionality
function initMobileSidebar() {
  const sidebar = document.getElementById('chatbot-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle-btn');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const layout = document.querySelector('.chatbot-layout');
  
  // Function to check if we're on mobile/tablet
  function isMobileView() {
    return window.innerWidth <= 1024;
  }
  
  // Function to open sidebar
  function openSidebar() {
    if (isMobileView()) {
      sidebar.classList.add('mobile-open');
      layout.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }
  
  // Function to close sidebar
  function closeSidebar() {
    if (isMobileView()) {
      sidebar.classList.remove('mobile-open');
      layout.classList.remove('sidebar-open');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  // Mobile hamburger menu toggle
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openSidebar();
    });
  }
  
  // Sidebar close button (X)
  if (sidebarCloseBtn && sidebar) {
    sidebarCloseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeSidebar();
    });
  }
  
  // Desktop sidebar toggle (existing functionality)
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      if (!isMobileView()) {
        // Desktop behavior - toggle collapsed state
        sidebar.classList.toggle('collapsed');
        layout.classList.toggle('sidebar-collapsed');
      }
    });
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    if (isMobileView() && sidebar.classList.contains('mobile-open')) {
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnMobileToggle = mobileMenuToggle && mobileMenuToggle.contains(event.target);
      
      if (!isClickInsideSidebar && !isClickOnMobileToggle) {
        closeSidebar();
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (!isMobileView()) {
      // Switch to desktop mode
      closeSidebar();
      sidebar.classList.remove('mobile-open');
      layout.classList.remove('sidebar-open');
      document.body.style.overflow = '';
    }
  });
  
  // Handle escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isMobileView() && sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    }
  });
}

// Initialize mobile functionality
document.addEventListener('DOMContentLoaded', function() {
  initMobileSidebar();
  handleScrollAnimation();
});