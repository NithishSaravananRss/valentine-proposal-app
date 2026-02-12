// Tracking page - real-time status

import { 
  getProposal, 
  listenToProposal, 
  getProposalIdFromUrl, 
  getProposalLink,
  getCelebrationLink,
  redirectToHome 
} from './firebase-config.js';
import { initParticles } from './particles-config.js';
import { animations } from './animations.js';
import { audioManager } from './audio.js';

let proposalId = null;
let proposalData = null;
let unsubscribe = null;
let hasHandledAccepted = false;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize particles
  initParticles('ambient');
  
  // Get proposal ID from URL (validated)
  proposalId = getProposalIdFromUrl();
  
  // Safeguard: redirect to home if no valid proposal ID
  if (!proposalId) {
    redirectToHome();
    return;
  }
  
  try {
    // Initial fetch to validate and populate (sanitized)
    proposalData = await getProposal(proposalId);
    
    // Safeguard: show error if proposal not found
    if (!proposalData) {
      showError();
      return;
    }
    
    // Hide loading, show content
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    
    // Populate initial data (use textContent - data is already sanitized)
    populateProposalInfo(proposalData);
    
    // Set proposal link
    document.getElementById('proposalLinkInput').value = getProposalLink(proposalId);
    
    // Animate entrance
    animations.glassCardReveal(document.querySelector('.glass-card'));
    
    // Start real-time listener
    startRealtimeListener();
    
  } catch (error) {
    showError();
  }
  
  // Setup copy button
  setupCopyButton();
});

function populateProposalInfo(proposal) {
  // Store proposal data for gender-aware messages
  proposalData = proposal;
  
  // Set title and names
  document.getElementById('proposalTitle').textContent = `${proposal.proposerName}'s Proposal`;
  document.getElementById('proposalNames').textContent = `To: ${proposal.partnerName}`;
  
  // Update timeline
  updateTimeline(proposal);
}

function getPartnerPronoun() {
  if (!proposalData) return 'They';
  return proposalData.partnerGender === 'female' ? 'She' : 'He';
}

function updateTimeline(proposal) {
  const statusCreated = document.getElementById('statusCreated');
  const statusOpened = document.getElementById('statusOpened');
  const statusAccepted = document.getElementById('statusAccepted');
  const waitingAnimation = document.getElementById('waitingAnimation');
  
  // Created is always completed
  statusCreated.classList.add('completed');
  statusCreated.classList.remove('pending', 'active');
  document.getElementById('createdTime').textContent = formatTime(proposal.createdAt);
  
  // Update status messages based on current status
  const pronoun = getPartnerPronoun();
  
  // Opened status
  if (proposal.status === 'opened' || proposal.status === 'accepted') {
    statusOpened.classList.add('completed');
    statusOpened.classList.remove('pending', 'active');
    document.getElementById('openedTime').textContent = formatTime(proposal.openedAt);
    
    // Update opened label with gender-aware message
    const openedLabel = statusOpened.querySelector('.timeline-label');
    openedLabel.textContent = `👀 ${pronoun} has seen it!`;
    
    // Update waiting text
    if (waitingAnimation) {
      waitingAnimation.querySelector('span').textContent = `Waiting for ${pronoun.toLowerCase()} to respond`;
    }
  } else {
    statusOpened.classList.add('active');
    statusOpened.classList.remove('completed', 'pending');
    document.getElementById('openedTime').textContent = 'Waiting...';
    
    // Update waiting text for pending
    if (waitingAnimation) {
      waitingAnimation.querySelector('span').textContent = `Waiting for ${pronoun.toLowerCase()} to open`;
    }
  }
  
  // Accepted status
  if (proposal.status === 'accepted') {
    statusAccepted.classList.add('completed');
    statusAccepted.classList.remove('pending', 'active');
    document.getElementById('acceptedTime').textContent = formatTime(proposal.acceptedAt);
    
    // Update accepted label
    const acceptedLabel = statusAccepted.querySelector('.timeline-label');
    acceptedLabel.textContent = `💕 ${pronoun} said YES!`;
    
    // Hide waiting animation
    if (waitingAnimation) {
      waitingAnimation.style.display = 'none';
    }
    
    // Show accepted message and redirect (only once)
    if (!hasHandledAccepted) {
      hasHandledAccepted = true;
      handleAccepted();
    }
  } else if (proposal.status === 'opened') {
    statusAccepted.classList.add('active');
    statusAccepted.classList.remove('completed', 'pending');
    document.getElementById('acceptedTime').textContent = 'Waiting...';
  } else {
    statusAccepted.classList.add('pending');
    statusAccepted.classList.remove('completed', 'active');
  }
}

function startRealtimeListener() {
  // Listen for real-time updates using listenToProposal
  unsubscribe = listenToProposal(proposalId, (proposal) => {
    if (proposal) {
      proposalData = proposal; // Update stored data
      updateTimeline(proposal);
    }
  });
}

async function handleAccepted() {
  // Play confetti sound
  await audioManager.init();
  audioManager.playSFX('confetti');
  
  // Trigger confetti
  animations.celebrationConfetti();
  
  // Show accepted message
  const acceptedMessage = document.getElementById('acceptedMessage');
  acceptedMessage.classList.add('visible');
  
  // Update message with gender-aware text
  const pronoun = getPartnerPronoun();
  const messageTitle = acceptedMessage.querySelector('h2');
  if (messageTitle) {
    messageTitle.textContent = `${pronoun} Said Yes! 💕`;
  }
  
  // Animate status change
  animations.statusChange(document.getElementById('statusAccepted'));
  
  // Wait 2 seconds and redirect to celebration
  await delay(2000);
  
  // Unsubscribe from listener
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  
  // Redirect to celebration page
  animations.fadeOutRedirect(getCelebrationLink(proposalId));
}

function showError() {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('errorContainer').classList.remove('hidden');
}

function formatTime(timestamp) {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  const options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', options);
}

function setupCopyButton() {
  const copyBtn = document.getElementById('copyBtn');
  const input = document.getElementById('proposalLinkInput');
  
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(input.value).then(() => {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      input.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });
}

// Utility function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (unsubscribe) {
    unsubscribe();
  }
});
