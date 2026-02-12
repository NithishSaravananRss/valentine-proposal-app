// Celebration page - after YES

import { 
  getProposal, 
  getProposalIdFromUrl, 
  redirectToHome 
} from './firebase-config.js';
import { initParticles } from './particles-config.js';
import { animations } from './animations.js';
import { audioManager, setupAudioOverlay } from './audio.js';

let proposalData = null;
let proposalId = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize particles
  initParticles('celebration');
  
  // Generate floating hearts
  createFloatingHearts();
  
  // Get proposal ID from URL (validated)
  proposalId = getProposalIdFromUrl();
  
  // Safeguard: redirect to home if no valid proposal ID
  if (!proposalId) {
    redirectToHome();
    return;
  }
  
  try {
    // Fetch proposal data (sanitized)
    proposalData = await getProposal(proposalId);
    
    // Safeguard: show error if proposal not found or not accepted
    if (!proposalData) {
      showError();
      return;
    }
    
    // If not accepted yet, show error (shouldn't be here)
    if (proposalData.status !== 'accepted') {
      showError();
      return;
    }
    
    // Populate names (use textContent - data is already sanitized)
    document.getElementById('proposerNameDisplay').textContent = proposalData.proposerName;
    document.getElementById('partnerNameDisplay').textContent = proposalData.partnerName;
    
    // Set date
    const acceptedDate = new Date(proposalData.acceptedAt);
    document.getElementById('celebrationDate').textContent = formatDate(acceptedDate);
    
    // Hide loading, show content
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    
    // Setup audio overlay
    setupAudioOverlay(startCelebration);
    
  } catch (error) {
    showError();
  }
});

async function startCelebration() {
  // Play celebration music
  audioManager.playMusic('celebration');
  
  // Play confetti sound
  audioManager.playSFX('confetti');
  
  // Initial confetti burst
  animations.confettiBurst({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.5 }
  });
  
  // Start continuous celebration confetti
  setTimeout(() => {
    animations.celebrationConfetti();
  }, 1000);
  
  // Animate elements sequentially
  await animateCelebration();
}

async function animateCelebration() {
  const title = document.getElementById('celebrationTitle');
  const subtitle = document.getElementById('celebrationSubtitle');
  const namesContainer = document.getElementById('namesContainer');
  const proposerName = document.getElementById('proposerNameDisplay');
  const partnerName = document.getElementById('partnerNameDisplay');
  const heartDivider = document.getElementById('heartDivider');
  const message = document.getElementById('celebrationMessage');
  const date = document.getElementById('celebrationDate');
  const shareSection = document.getElementById('shareSection');
  
  // Animate title
  gsap.fromTo(title,
    { opacity: 0, y: 30, scale: 0.8 },
    { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.5)" }
  );
  
  await delay(500);
  
  // Animate subtitle
  gsap.fromTo(subtitle,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  );
  
  await delay(600);
  
  // Show names container
  gsap.to(namesContainer, {
    opacity: 1,
    duration: 0.5
  });
  
  // Animate proposer name from left
  gsap.fromTo(proposerName,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
  );
  
  await delay(400);
  
  // Pop in heart
  gsap.fromTo(heartDivider,
    { opacity: 0, scale: 0 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(3)",
      onComplete: () => {
        heartDivider.classList.add('animated');
      }
    }
  );
  
  await delay(400);
  
  // Animate partner name from right
  gsap.fromTo(partnerName,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
  );
  
  // Add glow animation to names
  animations.glowPulse(proposerName, 'rgba(255, 107, 138, 0.5)');
  animations.glowPulse(partnerName, 'rgba(179, 136, 255, 0.5)');
  
  await delay(800);
  
  // Animate message
  gsap.fromTo(message,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  );
  
  await delay(500);
  
  // Animate date
  gsap.fromTo(date,
    { opacity: 0 },
    { opacity: 1, duration: 0.8 }
  );
  
  await delay(500);
  
  // Animate share section
  if (shareSection) {
    gsap.fromTo(shareSection,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }
    );
  }
  
  // Setup share buttons after animation
  setupShareButtons();
}

function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['💕', '💖', '💗', '💓', '💘', '❤️', '✨', '💫'];
  const numHearts = 15;
  
  for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${8 + Math.random() * 8}s`;
    heart.style.animationDelay = `${Math.random() * 10}s`;
    heart.style.fontSize = `${1 + Math.random() * 1.5}rem`;
    container.appendChild(heart);
  }
}

function showError() {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('errorContainer').classList.remove('hidden');
  initParticles('ambient');
}

function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return `Valentine's Day ${date.toLocaleDateString('en-US', options)}`;
}

// Utility function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Periodically add more confetti
setInterval(() => {
  if (document.getElementById('mainContent') && !document.getElementById('mainContent').classList.contains('hidden')) {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#ff6b8a', '#7c4dff', '#ffd700']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#ff6b8a', '#7c4dff', '#ffd700']
    });
  }
}, 3000);

// Share buttons setup
function setupShareButtons() {
  const homepage = window.location.origin;
  const shareText = 'Create your own Valentine surprise 💘';
  
  // Copy App Link
  const copyBtn = document.getElementById('copyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => copyAppLink(homepage));
  }
  
  // Share on WhatsApp
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + homepage)}`;
      window.open(url, '_blank');
    });
  }
  
  // Share on Telegram
  const telegramBtn = document.getElementById('telegramBtn');
  if (telegramBtn) {
    telegramBtn.addEventListener('click', () => {
      const url = `https://t.me/share/url?url=${encodeURIComponent(homepage)}&text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    });
  }
  
  // Create Your Own
  const createNewBtn = document.getElementById('createNewBtn');
  if (createNewBtn) {
    createNewBtn.addEventListener('click', () => {
      window.location.href = homepage;
    });
  }
  
  // Download Screenshot
  const screenshotBtn = document.getElementById('screenshotBtn');
  if (screenshotBtn) {
    screenshotBtn.addEventListener('click', downloadScreenshot);
  }
}

async function copyAppLink(url) {
  const copyBtn = document.getElementById('copyLinkBtn');
  const toast = document.getElementById('toast');
  
  try {
    await navigator.clipboard.writeText(url);
    
    // Visual feedback on button
    copyBtn.classList.add('copied');
    copyBtn.querySelector('span:last-child').textContent = 'Copied!';
    
    // Show toast
    showToast('Link copied to clipboard! 💘');
    
    // Reset button after delay
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.querySelector('span:last-child').textContent = 'Copy App Link';
    }, 2000);
    
  } catch (error) {
    // Fallback for older browsers
    fallbackCopyText(url);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    showToast('Link copied to clipboard! 💘');
  } catch (err) {
    showToast('Could not copy link');
  }
  
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

async function downloadScreenshot() {
  const screenshotBtn = document.getElementById('screenshotBtn');
  const originalText = screenshotBtn.querySelector('span:last-child').textContent;
  
  // Update button state
  screenshotBtn.disabled = true;
  screenshotBtn.querySelector('span:last-child').textContent = 'Generating...';
  
  try {
    // Target the celebration card
    const celebrationCard = document.querySelector('.glass-card-celebration');
    
    if (!celebrationCard) {
      throw new Error('Celebration card not found');
    }
    
    // Temporarily hide share section for cleaner screenshot
    const shareSection = document.getElementById('shareSection');
    if (shareSection) {
      shareSection.style.display = 'none';
    }
    
    // Generate canvas
    const canvas = await html2canvas(celebrationCard, {
      backgroundColor: '#1a0a15',
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      allowTaint: true
    });
    
    // Restore share section
    if (shareSection) {
      shareSection.style.display = '';
    }
    
    // Convert to image and download
    const link = document.createElement('a');
    link.download = `valentine-${proposalId || 'love-story'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    // Show success
    showToast('Love story downloaded! 📸💕');
    
  } catch (error) {
    showToast('Could not generate screenshot');
  } finally {
    // Reset button
    screenshotBtn.disabled = false;
    screenshotBtn.querySelector('span:last-child').textContent = originalText;
  }
}
