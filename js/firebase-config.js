// Firebase config - v9+ modular SDK

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  update, 
  onValue
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmeBnbEwTL4-WybWUKolkHP9o4sfNAn0w",
  authDomain: "valentine-proposal-app-c3a90.firebaseapp.com",
  databaseURL: "https://valentine-proposal-app-c3a90-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "valentine-proposal-app-c3a90",
  storageBucket: "valentine-proposal-app-c3a90.firebasestorage.app",
  messagingSenderId: "619452345126",
  appId: "1:619452345126:web:2c1facdccfc91482572fe7"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// --- Sanitization helpers ---

// Strip HTML/script tags, trim, limit length
export function sanitizeInput(input, maxLength = 30) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/&lt;/g, '<')              // Decode common entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/on\w+\s*=/gi, '')         // Remove event handlers
    .replace(/javascript:/gi, '')       // Remove javascript: protocol
    .trim()
    .substring(0, maxLength);
}

// Escape text for safe DOM insertion
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Check if proposal ID is valid format
export function isValidProposalId(id) {
  if (typeof id !== 'string') return false;
  if (id.length < 10) return false;
  return /^val_[a-zA-Z0-9_-]+$/.test(id);
}

// --- ID generation ---

export function generateProposalId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `val_${crypto.randomUUID()}`;
  }
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `val_${timestamp}_${random}`;
}

// --- Database helpers ---

// Create new proposal (checks for existing to prevent overwrites)
export async function createProposal(proposalId, data) {
  // Validate proposal ID format
  if (!isValidProposalId(proposalId)) {
    return { success: false, error: 'Invalid proposal ID format' };
  }
  
  // Sanitize all input data
  const sanitizedData = {
    proposerName: sanitizeInput(data.proposerName, 30),
    proposerGender: data.proposerGender === 'female' ? 'female' : 'male',
    partnerName: sanitizeInput(data.partnerName, 30),
    partnerGender: data.partnerGender === 'female' ? 'female' : 'male',
    status: 'pending',
    createdAt: Date.now(),
    openedAt: null,
    acceptedAt: null
  };
  
  // Validate sanitized names are not empty
  if (!sanitizedData.proposerName || !sanitizedData.partnerName) {
    return { success: false, error: 'Names cannot be empty' };
  }
  
  try {
    const proposalRef = ref(database, 'proposals/' + proposalId);
    
    // Check if proposal already exists to prevent overwrites
    const existingSnapshot = await get(proposalRef);
    if (existingSnapshot.exists()) {
      return { success: false, error: 'Proposal ID already exists' };
    }
    
    // Create new proposal
    await set(proposalRef, sanitizedData);
    return { success: true };
    
  } catch (error) {
    return { success: false, error: 'Database error' };
  }
}

// Get proposal by ID
export async function getProposal(proposalId) {
  // Validate proposal ID
  if (!isValidProposalId(proposalId)) return null;
  
  try {
    const proposalRef = ref(database, 'proposals/' + proposalId);
    const snapshot = await get(proposalRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Sanitize data from database before returning
      return {
        proposerName: sanitizeInput(data.proposerName || '', 30),
        proposerGender: data.proposerGender === 'female' ? 'female' : 'male',
        partnerName: sanitizeInput(data.partnerName || '', 30),
        partnerGender: data.partnerGender === 'female' ? 'female' : 'male',
        status: ['pending', 'opened', 'accepted'].includes(data.status) ? data.status : 'pending',
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
        openedAt: typeof data.openedAt === 'number' ? data.openedAt : null,
        acceptedAt: typeof data.acceptedAt === 'number' ? data.acceptedAt : null
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Update proposal status
export async function updateProposalStatus(proposalId, updates) {
  // Validate proposal ID
  if (!isValidProposalId(proposalId)) return false;
  
  // Only allow specific status updates
  const allowedUpdates = {};
  
  if (updates.status && ['opened', 'accepted'].includes(updates.status)) {
    allowedUpdates.status = updates.status;
  }
  if (typeof updates.openedAt === 'number') {
    allowedUpdates.openedAt = updates.openedAt;
  }
  if (typeof updates.acceptedAt === 'number') {
    allowedUpdates.acceptedAt = updates.acceptedAt;
  }
  
  // No valid updates
  if (Object.keys(allowedUpdates).length === 0) return false;
  
  try {
    const proposalRef = ref(database, 'proposals/' + proposalId);
    await update(proposalRef, allowedUpdates);
    return true;
  } catch (error) {
    return false;
  }
}

// Real-time listener for proposal changes
export function listenToProposal(proposalId, callback) {
  // Validate proposal ID
  if (!isValidProposalId(proposalId)) {
    return () => {};
  }
  
  const proposalRef = ref(database, 'proposals/' + proposalId);
  
  const unsubscribe = onValue(proposalRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Sanitize data before callback
      callback({
        proposerName: sanitizeInput(data.proposerName || '', 30),
        proposerGender: data.proposerGender === 'female' ? 'female' : 'male',
        partnerName: sanitizeInput(data.partnerName || '', 30),
        partnerGender: data.partnerGender === 'female' ? 'female' : 'male',
        status: ['pending', 'opened', 'accepted'].includes(data.status) ? data.status : 'pending',
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
        openedAt: typeof data.openedAt === 'number' ? data.openedAt : null,
        acceptedAt: typeof data.acceptedAt === 'number' ? data.acceptedAt : null
      });
    } else {
      callback(null);
    }
  }, (error) => {
    // Silent fail - return null to callback
    callback(null);
  });
  
  return unsubscribe;
}

// --- URL helpers ---

// Get proposal ID from URL params
export function getProposalIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  // Validate and return only if valid format
  if (id && isValidProposalId(id)) {
    return id;
  }
  return null;
}

// Get base URL (uses origin, never hardcoded)
export function getBaseUrl() {
  return window.location.origin + window.location.pathname.replace(/[^\/]*$/, '');
}

// Generate links
export function getProposalLink(proposalId) {
  if (!isValidProposalId(proposalId)) return getBaseUrl();
  return `${getBaseUrl()}proposal.html?id=${encodeURIComponent(proposalId)}`;
}

export function getTrackingLink(proposalId) {
  if (!isValidProposalId(proposalId)) return getBaseUrl();
  return `${getBaseUrl()}tracking.html?id=${encodeURIComponent(proposalId)}`;
}

export function getCelebrationLink(proposalId) {
  if (!isValidProposalId(proposalId)) return getBaseUrl();
  return `${getBaseUrl()}celebration.html?id=${encodeURIComponent(proposalId)}`;
}

export function redirectToHome() {
  window.location.href = getBaseUrl() + 'index.html';
}
