// Proposal page - partner view

import { 
  getProposal, 
  updateProposalStatus, 
  getProposalIdFromUrl, 
  getCelebrationLink,
  redirectToHome,
  escapeHtml
} from './firebase-config.js';
import { initParticles } from './particles-config.js';
import { animations } from './animations.js';
import { audioManager, setupAudioOverlay } from './audio.js';

let proposalData = null;
let proposalId = null;
let noButtonScale = 1;
let noButtonTexts = ['No', 'Are you sure?', 'Really?', 'Think again...', 'Please? 🥺', '💔'];
let noButtonIndex = 0;
let isAccepting = false;

document.addEventListener('DOMContentLoaded', async () => {
  // Get proposal ID from URL (validated)
  proposalId = getProposalIdFromUrl();
  
  // Safeguard: redirect to home if no valid proposal ID
  if (!proposalId) {
    redirectToHome();
    return;
  }
  
  try {
    // Fetch proposal data (sanitized by firebase-config)
    proposalData = await getProposal(proposalId);
    
    // Safeguard: show error if proposal not found
    if (!proposalData) {
      showError();
      return;
    }
    
    // Apply theme based on proposer gender
    applyTheme(proposalData.proposerGender);
    
    // Initialize particles based on theme
    const particleTheme = proposalData.proposerGender === 'male' ? 'hearts' : 'stars';
    initParticles(particleTheme);
    
    // Update status to opened if still pending
    if (proposalData.status === 'pending') {
      await updateProposalStatus(proposalId, { status: 'opened', openedAt: Date.now() });
      proposalData.status = 'opened'; // Update local state
    }
    
    // If already accepted, redirect to celebration
    if (proposalData.status === 'accepted') {
      window.location.href = getCelebrationLink(proposalId);
      return;
    }
    
    // Setup audio overlay
    setupAudioOverlay(startProposalSequence);
    
    // Hide loading, show content
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    
    // Setup proposal content (use textContent for safety - already sanitized)
    document.getElementById('fromText').textContent = `From ${proposalData.proposerName}`;
    document.getElementById('partnerNameDisplay').textContent = proposalData.partnerName;
    
  } catch (error) {
    showError();
  }
  
  // Setup button handlers
  setupButtons();
});

function applyTheme(gender) {
  document.body.classList.remove('theme-male', 'theme-female');
  document.body.classList.add(gender === 'male' ? 'theme-male' : 'theme-female');
}

function showError() {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('errorContainer').classList.remove('hidden');
  initParticles('ambient');
}

async function startProposalSequence() {
  // Play theme music
  const musicType = proposalData.proposerGender === 'male' ? 'romanticMale' : 'romanticFemale';
  audioManager.playMusic(musicType);
  
  const card = document.querySelector('.glass-card');
  const introText = document.getElementById('introText');
  const fromText = document.getElementById('fromText');
  const questionContainer = document.getElementById('questionContainer');
  const partnerName = document.getElementById('partnerNameDisplay');
  
  // Animate card entrance
  animations.glassCardReveal(card);
  
  // Show intro text
  await delay(800);
  gsap.to(introText, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
  });
  
  // Show from text
  await delay(1500);
  gsap.to(fromText, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
  });
  
  // Play heartbeat before question
  await delay(1500);
  audioManager.playSFX('heartbeat');
  
  // Fade out intro texts
  await delay(1000);
  gsap.to([introText, fromText], {
    opacity: 0.3,
    duration: 0.5
  });
  
  // Show question container
  gsap.to(questionContainer, {
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  });
  
  // Typewriter effect for partner name
  await delay(300);
  await animations.typewriter(partnerName, proposalData.partnerName, { speed: 100 });
  
  // Animate buttons
  animations.pageEnter('.proposal-buttons > *', { stagger: 0.2, duration: 0.6 });
  
  // Add pulse to YES button
  await delay(500);
  animations.buttonPulse(document.getElementById('yesBtn'));
}

function setupButtons() {
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noWrapper = document.getElementById('noWrapper');
  const noContainer = document.getElementById('noContainer');
  
  // YES button handler
  yesBtn.addEventListener('click', handleYesClick);
  
  // NO button handlers
  noBtn.addEventListener('mouseenter', handleNoHover);
  noBtn.addEventListener('click', handleNoClick);
  
  // Touch support for NO button
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleNoHover();
  });
}

async function handleYesClick() {
  const yesBtn = document.getElementById('yesBtn');
  
  // Prevent duplicate accepts
  if (isAccepting) return;
  isAccepting = true;
  
  // Disable button
  yesBtn.disabled = true;
  
  // Play success sound
  audioManager.playSFX('success');
  
  // Trigger confetti
  animations.confettiBurst({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
  
  // Success animation
  animations.successCelebration(yesBtn);
  
  // Update Firebase status to accepted
  try {
    await updateProposalStatus(proposalId, { 
      status: 'accepted', 
      acceptedAt: Date.now() 
    });
    
    // Fade out music
    await audioManager.fadeOutMusic(1500);
    
    // Redirect to celebration
    await delay(1500);
    animations.fadeOutRedirect(getCelebrationLink(proposalId));
    
  } catch (error) {
    // Still redirect - the proposal may have been accepted
    await delay(1000);
    window.location.href = getCelebrationLink(proposalId);
  }
}

function handleNoHover() {
  const noBtn = document.getElementById('noBtn');
  const noWrapper = document.getElementById('noWrapper');
  const noContainer = document.getElementById('noContainer');
  
  // Move button to random position
  const containerRect = noContainer.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  
  // Calculate random position within container bounds
  const maxX = (containerRect.width - btnRect.width) / 2;
  const maxY = (containerRect.height - btnRect.height) / 2;
  
  const randomX = (Math.random() * 2 - 1) * maxX * 2;
  const randomY = (Math.random() * 2 - 1) * maxY * 2;
  
  gsap.to(noWrapper, {
    x: randomX,
    y: randomY,
    duration: 0.3,
    ease: "power2.out"
  });
  
  // Shrink button
  noButtonScale = Math.max(0.4, noButtonScale - 0.1);
  gsap.to(noBtn, {
    scale: noButtonScale,
    duration: 0.2
  });
  
  // Change text
  if (noButtonIndex < noButtonTexts.length - 1) {
    noButtonIndex++;
    noBtn.textContent = noButtonTexts[noButtonIndex];
  }
}

function handleNoClick() {
  handleNoHover();
  
  // If clicked after all text changes, make it smaller and sadder
  if (noButtonIndex >= noButtonTexts.length - 1) {
    noButtonScale = animations.shrinkButton(document.getElementById('noBtn'), noButtonScale);
    
    // If too small, hide it
    if (noButtonScale < 0.5) {
      gsap.to(document.getElementById('noContainer'), {
        opacity: 0,
        duration: 0.5
      });
    }
  }
}

// Utility function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
