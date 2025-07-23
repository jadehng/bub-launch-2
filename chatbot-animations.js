// Enhanced Bubble Chatbot Animations

// Fade-in utility for message entrance
function chatbotFadeIn(element) {
  element.classList.add('fade-in');
  setTimeout(() => {
    element.classList.add('fade-in-visible');
  }, 10);
}

// Enhanced bubble float animation
function bubbleFloat(element, duration = 2000) {
  element.style.animation = `bubbleFloat ${duration}ms ease-in-out infinite`;
}

// Glassmorphism effect application
function applyGlassEffect(element, intensity = 0.1) {
  element.style.background = `rgba(255, 255, 255, ${intensity})`;
  element.style.backdropFilter = 'blur(20px)';
  element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
}

// Enhanced icon animations
function animateIcon(iconElement, animationType = 'bubbleFloat') {
  const animations = {
    bubbleFloat: 'bubbleFloat 1s ease-in-out',
    pulseGlow: 'pulseGlow 1.5s ease-in-out infinite',
    bubblePop: 'bubblePop 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    slideIn: 'slideInRight 0.5s ease-out'
  };
  
  iconElement.style.animation = animations[animationType] || animations.bubbleFloat;
}

// Feature tiles animation sequence
function animateFeatureTilesOut() {
  const featureTiles = document.querySelector('.chatbot-feature-tiles');
  if (!featureTiles) return;
  
  const tiles = featureTiles.querySelectorAll('.feature-item');
  
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.style.transform = 'translateY(-20px) scale(0.95)';
      tile.style.opacity = '0';
      tile.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    }, index * 100);
  });
  
  // Hide the container after animation
  setTimeout(() => {
    featureTiles.style.display = 'none';
  }, tiles.length * 100 + 400);
}

// Enhanced shortcut buttons animation
function animateShortcutsIn() {
  const shortcutsContainer = document.getElementById('chatbot-new-shortcuts');
  if (!shortcutsContainer) return;
  
  shortcutsContainer.style.display = 'block';
  shortcutsContainer.style.opacity = '0';
  shortcutsContainer.style.transform = 'translateY(30px)';
  
  setTimeout(() => {
    shortcutsContainer.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    shortcutsContainer.style.opacity = '1';
    shortcutsContainer.style.transform = 'translateY(0)';
  }, 100);
  
  // Animate individual buttons
  const buttons = shortcutsContainer.querySelectorAll('.new-shortcut-btn');
  buttons.forEach((button, index) => {
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px) scale(0.9)';
    
    setTimeout(() => {
      button.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      button.style.opacity = '1';
      button.style.transform = 'translateY(0) scale(1)';
    }, 600 + index * 100);
  });
}

// Sidebar collapse animation
function animateSidebarCollapse(sidebar, isCollapsing) {
  if (isCollapsing) {
    sidebar.style.transform = 'translateX(-200px)';
    sidebar.style.opacity = '0.8';
  } else {
    sidebar.style.transform = 'translateX(0)';
    sidebar.style.opacity = '1';
  }
}

// Enhanced notification animations
function animateNotificationIn(notification) {
  notification.style.transform = 'translateX(100%)';
  notification.style.opacity = '0';
  
  setTimeout(() => {
    notification.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
}

function animateNotificationOut(notification) {
  notification.style.transition = 'all 0.3s ease';
  notification.style.transform = 'translateX(100%)';
  notification.style.opacity = '0';
}

// Portfolio widget animations
function animatePortfolioStats() {
  const stats = document.querySelectorAll('.portfolio-stat');
  
  stats.forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      stat.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      stat.style.opacity = '1';
      stat.style.transform = 'translateX(0)';
    }, index * 150);
  });
}

// Enhanced hover effects
function addHoverEffects() {
  const interactiveElements = document.querySelectorAll('.quick-action-btn, .new-shortcut-btn, .sidebar-icon');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'translateY(-2px) scale(1.02)';
      element.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Loading animations
function showLoadingAnimation(container) {
  const loader = document.createElement('div');
  loader.className = 'bubble-loader';
  loader.innerHTML = `
    <div class="bubble-dot"></div>
    <div class="bubble-dot"></div>
    <div class="bubble-dot"></div>
  `;
  
  container.appendChild(loader);
  
  return loader;
}

function hideLoadingAnimation(loader) {
  if (loader && loader.parentNode) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
}

// CSS for bubble loader
const bubbleLoaderCSS = `
.bubble-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
}

.bubble-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  animation: bubbleBounce 1.4s ease-in-out infinite both;
}

.bubble-dot:nth-child(1) { animation-delay: -0.32s; }
.bubble-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bubbleBounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
`;

// Inject CSS if not already present
if (!document.querySelector('#bubble-animations-css')) {
  const style = document.createElement('style');
  style.id = 'bubble-animations-css';
  style.textContent = bubbleLoaderCSS;
  document.head.appendChild(style);
}

// Export functions for global use
window.BubbleAnimations = {
  chatbotFadeIn,
  bubbleFloat,
  applyGlassEffect,
  animateIcon,
  animateFeatureTilesOut,
  animateShortcutsIn,
  animateSidebarCollapse,
  animateNotificationIn,
  animateNotificationOut,
  animatePortfolioStats,
  addHoverEffects,
  showLoadingAnimation,
  hideLoadingAnimation
};
