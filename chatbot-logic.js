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
    const placeholders = translations['chat.placeholder.rotating']?.[currentLanguage] || [
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
    
    // Start placeholder animation
    startPlaceholderAnimation();
    
    console.log('Chatbot initialized successfully');
  }

  function handleSendMessage() {
    console.log('handleSendMessage called');
    const inputElement = document.getElementById('chatbot-input');
    const message = inputElement ? inputElement.value.trim() : '';
    console.log('Message to send:', message);
    if (!message) {
      console.log('Empty message, returning');
      return;
    }
    
    console.log('Sending message:', message);
    
    // Handle first message - show shortcut buttons
    if (isFirstMessage) {
      animateFeatureTilesOut();
      setTimeout(showNewShortcuts, 500);
      isFirstMessage = false;
      
      // Dispatch custom event for tracking
      document.dispatchEvent(new CustomEvent('userMessageSent', { detail: { message } }));
    }
    
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Clear input
    inputElement.value = '';
    
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

  function updateHistoryDisplay() {
    loadChatHistory();
  }

  function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  // Language switching
  function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    updateAllTranslations();
    updateSuggestions();
  }

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

  // Initialize everything
  initializeChatbot();
  initializeSidebar();
  initializeProfileDropdown();
  initializeNewShortcuts();
  
  // Export functions to window for debugging
  window.debugChatbot = {
    handleSendMessage: handleSendMessage,
    sendToServer: sendToServer,
    initializeChatbot: initializeChatbot,
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

// Sidebar Functionality
function initializeSidebar() {
    const sidebar = document.getElementById('chatbot-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Add tooltips when collapsed
            if (sidebar.classList.contains('collapsed')) {
                addSidebarTooltips();
            } else {
                removeSidebarTooltips();
            }
        });
    }
}

// Add tooltips to sidebar items when collapsed
function addSidebarTooltips() {
    const sidebarItems = document.querySelectorAll('.quick-action-btn, .setting-item');
    
    sidebarItems.forEach(item => {
        const text = item.querySelector('span:not(.sidebar-icon)')?.textContent || 
                    item.querySelector('.strategy-content span')?.textContent || '';
        
        if (text) {
            item.setAttribute('title', text);
        }
    });
}

// Remove tooltips when sidebar is expanded
function removeSidebarTooltips() {
    const sidebarItems = document.querySelectorAll('.quick-action-btn, .setting-item');
    sidebarItems.forEach(item => {
        item.removeAttribute('title');
    });
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

// New Shortcuts Functionality
function initializeNewShortcuts() {
    const newShortcuts = document.getElementById('chatbot-new-shortcuts');
    
    // Handle new shortcut button clicks
    if (newShortcuts) {
        const shortcutBtns = newShortcuts.querySelectorAll('.new-shortcut-btn');
        shortcutBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const query = this.getAttribute('data-query');
                if (query) {
                    const input = document.getElementById('chatbot-input');
                    if (input) {
                        input.value = query;
                        // Trigger the main send message function
                        document.querySelector('#chatbot-send-btn').click();
                    }
                }
            });
        });
    }
}

// Guide Me Functionality
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

// Show guide me notification
function showGuideMeNotification() {
    const notifications = [
        {
            type: 'info',
            message: getTranslatedText('guide.market.down'),
            icon: '📊'
        },
        {
            type: 'success',
            message: getTranslatedText('guide.energy.outperform'),
            icon: '⚡'
        },
        {
            type: 'warning',
            message: getTranslatedText('guide.allocation.adjust'),
            icon: '⚠️'
        }
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    createNotification(randomNotification);
}

// Create notification
function createNotification(notificationData) {
    const notification = document.createElement('div');
    notification.className = `guide-notification ${notificationData.type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.5rem;">${notificationData.icon}</span>
            <div>
                <p style="margin: 0; font-weight: 500;">${notificationData.message}</p>
            </div>
        </div>
        <button onclick="this.parentElement.remove()" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; cursor: pointer; font-size: 1.2rem;">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Setup periodic guide notifications
function setupGuideNotifications() {
    // Show notification every 30 seconds for demo purposes
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance
            showGuideMeNotification();
        }
    }, 30000);
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

// Show upgrade modal with translations
function showUpgradeModal(feature = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${getTranslatedText('modal.upgrade.title')}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <p>${getTranslatedText('modal.upgrade.description')}</p>
                <div style="margin: 1rem 0;">
                    <h4>${getTranslatedText('modal.upgrade.features')}</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>✅</span> ${getTranslatedText('modal.upgrade.strategyBuilder')}
                        </li>
                        <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>✅</span> ${getTranslatedText('modal.upgrade.analysis')}
                        </li>
                        <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>✅</span> ${getTranslatedText('modal.upgrade.alerts')}
                        </li>
                        <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>✅</span> ${getTranslatedText('modal.upgrade.trading')}
                        </li>
                    </ul>
                </div>
                <button class="btn-primary btn-violet" style="width: 100%; margin-top: 1rem;" onclick="handleUpgrade()">
                    ${getTranslatedText('modal.upgrade.button')}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking overlay
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
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