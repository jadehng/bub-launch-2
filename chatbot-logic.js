// Bubble Chatbot Standalone Logic

document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('chatbot-welcome');
  const chatContainer = document.getElementById('chatbot-chat-container');
  const startChatBtn = document.getElementById('start-chat-btn');
  const messageList = document.getElementById('chatbot-message-list');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const suggestionsContainer = document.getElementById('chatbot-suggestions');
  const statusIndicator = document.getElementById('chatbot-status');

  // Suggestions (can be extended or localized)
  const suggestionKeys = [
    'chat.question1',
    'chat.question2',
    'chat.question3',
    'chat.question4',
  ];

  function renderSuggestions() {
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

  // Language detection (default to 'en')
  let currentLanguage = document.documentElement.lang || 'en';

  // Translation integration
  function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[key] && translations[key][currentLanguage]) {
        el.textContent = translations[key][currentLanguage];
      }
    });
    renderSuggestions();
  }

  // Welcome screen logic
  if (startChatBtn) {
    startChatBtn.addEventListener('click', () => {
      welcomeScreen.style.display = 'none';
      chatContainer.style.display = 'flex';
      input.focus();
    });
  }

  // Message rendering
  function addMessage({ message, type = 'ai', variant = 'text', streaming = false }) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chatbot-message ${type}`;
    if (variant !== 'text') msgDiv.classList.add(`chatbot-message-${variant}`);
    if (streaming) msgDiv.classList.add('streaming');
    msgDiv.innerHTML = '';
    if (variant === 'portfolio' || variant === 'chart' || variant === 'educational') {
      // Placeholder for rich content (to be implemented in Phase 3)
      msgDiv.innerHTML = `<div class="chatbot-card">[${variant} card coming soon]</div>`;
    } else {
      msgDiv.textContent = message;
    }
    messageList.appendChild(msgDiv);
    messageList.scrollTop = messageList.scrollHeight;
    return msgDiv;
  }

  // Send message logic
  async function handleSendMessage() {
    const userMessage = input.value.trim();
    if (!userMessage) return;
    addMessage({ message: userMessage, type: 'user' });
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;
    statusIndicator.textContent = '● Thinking...';

    // Add bot message placeholder
    const botMsgDiv = addMessage({ message: '', type: 'ai', streaming: true });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language: currentLanguage })
      });
      if (!response.ok) {
        throw new Error('Network error');
      }
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
            if (data === '[DONE]') return;
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
    } catch (error) {
      botMsgDiv.textContent = 'Sorry, an error occurred.';
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      statusIndicator.textContent = '● Online';
      input.focus();
      messageList.scrollTop = messageList.scrollHeight;
    }
  }

  // Event listeners
  sendBtn.addEventListener('click', handleSendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  // Initial render
  translatePage();
  renderSuggestions();
});