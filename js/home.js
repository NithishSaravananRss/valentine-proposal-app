// Home page - create proposal form

import { 
  createProposal, 
  generateProposalId,
  getProposalLink, 
  getTrackingLink,
  sanitizeInput,
  escapeHtml
} from './firebase-config.js';
import { initParticles } from './particles-config.js';
import { animations } from './animations.js';

// Rate limiting
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 3000;
let isSubmitting = false;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize particles
  initParticles('ambient');
  
  // Animate page entrance
  const card = document.getElementById('createForm');
  animations.glassCardReveal(card);
  
  // Elements
  const form = document.getElementById('proposalForm');
  const createBtn = document.getElementById('createBtn');
  const successCard = document.getElementById('successCard');
  const createForm = document.getElementById('createForm');
  
  // Add input length limits
  const proposerNameInput = document.getElementById('proposerName');
  const partnerNameInput = document.getElementById('partnerName');
  if (proposerNameInput) proposerNameInput.maxLength = 30;
  if (partnerNameInput) partnerNameInput.maxLength = 30;
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Spam prevention: check cooldown
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      showError('Please wait a moment before trying again.');
      return;
    }
    
    // Prevent double submission
    if (isSubmitting) return;
    isSubmitting = true;
    lastSubmitTime = now;
    
    // Get and sanitize form values
    const proposerName = sanitizeInput(document.getElementById('proposerName').value, 30);
    const proposerGenderEl = document.querySelector('input[name="proposerGender"]:checked');
    const partnerName = sanitizeInput(document.getElementById('partnerName').value, 30);
    const partnerGenderEl = document.querySelector('input[name="partnerGender"]:checked');
    
    // Validate
    if (!proposerName || !partnerName) {
      showError('Please fill in all name fields.');
      isSubmitting = false;
      return;
    }
    
    if (!proposerGenderEl || !partnerGenderEl) {
      showError('Please select gender for both.');
      isSubmitting = false;
      return;
    }
    
    const proposerGender = proposerGenderEl.value;
    const partnerGender = partnerGenderEl.value;
    
    // Show loading state
    createBtn.classList.add('loading');
    createBtn.disabled = true;
    
    try {
      // Generate unique proposal ID
      const proposalId = generateProposalId();
      
      // Create proposal in Firebase (with overwrite protection)
      const result = await createProposal(proposalId, {
        proposerName,
        proposerGender,
        partnerName,
        partnerGender
      });
      
      // Check for errors
      if (!result.success) {
        throw new Error(result.error || 'Failed to create proposal');
      }
      
      // Generate links
      const proposalLink = getProposalLink(proposalId);
      const trackingLink = getTrackingLink(proposalId);
      
      // Update success card (escape HTML in display)
      document.getElementById('proposalLinkInput').value = proposalLink;
      document.getElementById('trackingLinkInput').value = trackingLink;
      
      // Animate transition
      gsap.to(createForm, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        onComplete: () => {
          createForm.style.display = 'none';
          successCard.classList.add('visible');
          animations.glassCardReveal(successCard);
        }
      });
      
      // Store tracking link for quick access (only ID, no sensitive data)
      localStorage.setItem('lastTrackingLink', trackingLink);
      localStorage.setItem('lastProposalId', proposalId);
      
    } catch (error) {
      showError('Failed to create proposal. Please try again.');
    } finally {
      createBtn.classList.remove('loading');
      createBtn.disabled = false;
      isSubmitting = false;
    }
  });
  
  // Copy buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      
      navigator.clipboard.writeText(input.value).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        input.select();
        document.execCommand('copy');
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
  
  // Open tracking page
  document.getElementById('openTrackingBtn').addEventListener('click', () => {
    const trackingLink = document.getElementById('trackingLinkInput').value;
    animations.fadeOutRedirect(trackingLink);
  });
  
  // Create another proposal
  document.getElementById('createAnotherBtn').addEventListener('click', () => {
    gsap.to(successCard, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      onComplete: () => {
        successCard.classList.remove('visible');
        createForm.style.display = 'block';
        form.reset();
        
        gsap.fromTo(createForm,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }
    });
  });
  
  // Animate form elements on load
  const formGroups = document.querySelectorAll('.form-group');
  animations.pageEnter(formGroups, { stagger: 0.1, duration: 0.8 });
});

// Show error toast
function showError(message) {
  // Create toast notification if it doesn't exist
  let toast = document.getElementById('errorToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'errorToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(255, 82, 82, 0.95);
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-family: var(--font-body);
      font-weight: 500;
      z-index: 1000;
      opacity: 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(255, 82, 82, 0.4);
    `;
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3000);
}
