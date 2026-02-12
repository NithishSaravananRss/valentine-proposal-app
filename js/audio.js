// Audio manager

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.isInitialized = false;
    this.currentMusic = null;
    
    // Audio URLs (using royalty-free placeholder URLs)
    this.audioSources = {
      // Romantic instrumental music
      romanticMale: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      romanticFemale: 'https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3',
      celebration: 'https://assets.mixkit.co/music/preview/mixkit-happy-bell-melody-580.mp3',
      
      // Sound effects
      heartbeat: 'https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3',
      confetti: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'
    };
  }

  // Initialize audio context (must be called after user interaction)
  async init() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isInitialized = true;
    } catch (error) {
      // Silent fail - audio is optional
    }
  }

  // Preload an audio file
  async preload(name) {
    if (this.sounds[name]) return this.sounds[name];
    
    const url = this.audioSources[name];
    if (!url) {
      return null;
    }

    const audio = new Audio(url);
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    
    this.sounds[name] = audio;
    return audio;
  }

  // Play background music
  async playMusic(name, loop = true) {
    await this.init();
    
    // Stop current music
    if (this.currentMusic) {
      this.stopMusic();
    }

    let audio = this.sounds[name];
    if (!audio) {
      audio = await this.preload(name);
    }
    
    if (!audio) return;

    audio.volume = this.musicVolume;
    audio.loop = loop;
    
    try {
      await audio.play();
      this.currentMusic = audio;
    } catch (error) {
      // Silent fail - audio playback may be blocked
    }
  }

  // Stop current music
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  // Play sound effect
  async playSFX(name) {
    await this.init();

    let audio = this.sounds[name];
    if (!audio) {
      audio = await this.preload(name);
    }
    
    if (!audio) return;

    // Clone for overlapping sounds
    const clone = audio.cloneNode();
    clone.volume = this.sfxVolume;
    
    try {
      await clone.play();
    } catch (error) {
      // Silent fail - audio playback may be blocked
    }
  }

  // Fade out music
  async fadeOutMusic(duration = 1000) {
    if (!this.currentMusic) return;

    const audio = this.currentMusic;
    const startVolume = audio.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = startVolume / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      audio.volume = Math.max(0, startVolume - (volumeStep * (i + 1)));
    }

    this.stopMusic();
  }

  // Set music volume
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
  }

  // Set SFX volume
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

// Create global audio manager instance
export const audioManager = new AudioManager();

// Audio overlay handler
export function setupAudioOverlay(callback) {
  const overlay = document.getElementById('audioOverlay');
  if (!overlay) return;

  const handleInteraction = async () => {
    await audioManager.init();
    overlay.classList.add('hidden');
    if (callback) callback();
  };

  overlay.addEventListener('click', handleInteraction);
  overlay.addEventListener('touchstart', handleInteraction);
}
