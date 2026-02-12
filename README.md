# 💕 Valentine Proposal Web App

A premium, cinematic Valentine's Day proposal web app with real-time Firebase tracking, GSAP animations, particle backgrounds, and romantic music.

## ✨ Features

- **Cinematic Proposal Experience**: Beautiful GSAP animations, typewriter effects, and particle backgrounds
- **Real-time Tracking**: Watch as your partner opens and accepts your proposal
- **Dynamic Themes**: Automatic theme switching based on proposer gender (pink/hearts or purple/stars)
- **Playful Interactions**: "No" button that dodges and shrinks when hovered
- **Celebration Page**: Full confetti experience when proposal is accepted
- **Viral Loop**: Share button redirects back to create new proposals

## 🚀 Getting Started

### 1. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable **Realtime Database**:
   - Click "Realtime Database" in the sidebar
   - Click "Create Database"
   - Choose your region
   - Start in **test mode** (for development)
4. Get your Firebase config:
   - Click the gear icon → Project Settings
   - Scroll to "Your apps" → Add web app
   - Copy the firebaseConfig object

### 2. Configure the App

Open `js/firebase-config.js` and replace the placeholder config:


## 📁 Project Structure

```
Valentine/
├── index.html          # Homepage - Create proposal
├── proposal.html       # Partner view - The proposal question
├── tracking.html       # Proposer view - Real-time status
├── celebration.html    # Both users - Victory celebration
├── css/
│   ├── styles.css      # Main styles & components
│   └── themes.css      # Gender-based theme styles
└── js/
    ├── firebase-config.js   # Firebase setup & helpers
    ├── particles-config.js  # Particle.js configurations
    ├── animations.js        # GSAP animation library
    ├── audio.js            # Audio management
    ├── home.js             # Homepage logic
    ├── proposal.js         # Proposal page logic
    ├── tracking.js         # Tracking page logic
    └── celebration.js      # Celebration page logic
```

## 🎨 Themes

### Male Proposer (Pink Theme)
- Soft pink gradients
- Heart/rose particles
- Warm romantic glow
- Gentle instrumental music

### Female Proposer (Purple Theme)
- Deep blue/purple gradients
- Star particles with connections
- Light beam effects
- Emotional instrumental music

## 📱 How It Works

1. **Proposer** creates a proposal with names and genders
2. **App** generates unique proposal ID and stores in Firebase
3. **Proposer** gets two links:
   - Proposal link (to send to partner)
   - Tracking link (to monitor status)
4. **Partner** opens proposal link and sees cinematic experience
5. **Partner** clicks "Yes" (No button dodges away!)
6. **Firebase** updates status to "accepted"
7. **Both** users are redirected to celebration page
8. **Celebration** shows confetti, music, and share button
9. **Share** redirects back to homepage (viral loop!)

## 🔊 Audio

The app includes:
- Romantic background music (gender-themed)
- Heartbeat sound before proposal reveal
- Confetti/success sound effects

Audio requires user interaction to play (tap-to-begin overlay handles this).

## 📊 Firebase Data Model

```
proposals/
  └── {proposalId}/
      ├── proposerName: string
      ├── proposerGender: "male" | "female"
      ├── partnerName: string
      ├── partnerGender: "male" | "female"
      ├── status: "pending" | "opened" | "accepted"
      ├── createdAt: timestamp
      ├── openedAt: timestamp | null
      └── acceptedAt: timestamp | null
```

## 🛠 Technologies Used

- **HTML5 & CSS3** - Glassmorphism, gradients, animations
- **Vanilla JavaScript (ES6+)** - No frameworks!
- **Firebase Realtime Database** - Real-time data sync
- **GSAP** - Cinematic animations
- **Particles.js** - Beautiful particle backgrounds
- **Canvas Confetti** - Celebration effects
- **Google Fonts** - Playfair Display, Poppins, Great Vibes

## 💡 Tips

- Test locally before deploying
- Use Firebase test mode during development
- The "No" button is designed to be playful - it dodges!
- Audio starts only after user taps (browser autoplay policy)
- Works on mobile and desktop

## 📄 License

MIT License - Feel free to use for your own Valentine proposals! 💕

---

Made with ❤️ for lovers everywhere
