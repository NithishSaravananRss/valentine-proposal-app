// GSAP animations

export const animations = {
  // Page entrance animation
  pageEnter(elements, options = {}) {
    const defaults = {
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    };
    const config = { ...defaults, ...options };

    gsap.fromTo(elements,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease
      }
    );
  },

  // Cinematic fade in
  cinematicFadeIn(element, options = {}) {
    const defaults = {
      duration: 1.5,
      delay: 0,
      ease: "power2.out"
    };
    const config = { ...defaults, ...options };

    gsap.fromTo(element,
      {
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)"
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: config.duration,
        delay: config.delay,
        ease: config.ease
      }
    );
  },

  // Glass card reveal
  glassCardReveal(element, options = {}) {
    const defaults = {
      duration: 1.2,
      ease: "back.out(1.2)"
    };
    const config = { ...defaults, ...options };

    gsap.fromTo(element,
      {
        opacity: 0,
        y: 100,
        rotateX: -15,
        scale: 0.8,
        transformPerspective: 1000
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: config.duration,
        ease: config.ease
      }
    );
  },

  // Typewriter effect
  typewriter(element, text, options = {}) {
    const defaults = {
      speed: 80,
      delay: 0,
      cursor: true
    };
    const config = { ...defaults, ...options };

    return new Promise((resolve) => {
      element.textContent = '';
      
      if (config.cursor) {
        element.innerHTML = '<span class="typewriter-cursor"></span>';
      }

      setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          if (i < text.length) {
            if (config.cursor) {
              element.innerHTML = text.slice(0, i + 1) + '<span class="typewriter-cursor"></span>';
            } else {
              element.textContent = text.slice(0, i + 1);
            }
            i++;
          } else {
            clearInterval(interval);
            
            // Remove cursor after completion
            setTimeout(() => {
              if (config.cursor) {
                const cursor = element.querySelector('.typewriter-cursor');
                if (cursor) cursor.remove();
              }
              resolve();
            }, 500);
          }
        }, config.speed);
      }, config.delay);
    });
  },

  // Button pulse
  buttonPulse(element) {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  },

  // Heartbeat animation
  heartbeat(element, options = {}) {
    const defaults = {
      scale: 1.15,
      duration: 0.3
    };
    const config = { ...defaults, ...options };

    return gsap.timeline({ repeat: -1, repeatDelay: 0.3 })
      .to(element, {
        scale: config.scale,
        duration: config.duration,
        ease: "power2.out"
      })
      .to(element, {
        scale: 1,
        duration: config.duration,
        ease: "power2.in"
      })
      .to(element, {
        scale: config.scale * 0.95,
        duration: config.duration * 0.8,
        ease: "power2.out"
      })
      .to(element, {
        scale: 1,
        duration: config.duration * 0.8,
        ease: "power2.in"
      });
  },

  // Float animation
  float(element, options = {}) {
    const defaults = {
      y: -15,
      duration: 2,
      ease: "sine.inOut"
    };
    const config = { ...defaults, ...options };

    gsap.to(element, {
      y: config.y,
      duration: config.duration,
      yoyo: true,
      repeat: -1,
      ease: config.ease
    });
  },

  // Glow pulse
  glowPulse(element, color = 'rgba(255, 107, 138, 0.5)') {
    gsap.to(element, {
      boxShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  },

  // Success celebration
  successCelebration(element) {
    const tl = gsap.timeline();
    
    tl.to(element, {
      scale: 1.2,
      duration: 0.3,
      ease: "back.out(3)"
    })
    .to(element, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    })
    .to(element, {
      rotation: "+=10",
      duration: 0.1,
      ease: "none"
    })
    .to(element, {
      rotation: "-=20",
      duration: 0.2,
      ease: "none"
    })
    .to(element, {
      rotation: "0",
      duration: 0.1,
      ease: "none"
    });

    return tl;
  },

  // Fade out and redirect
  fadeOutRedirect(url, duration = 0.8) {
    gsap.to('body', {
      opacity: 0,
      duration: duration,
      ease: "power2.in",
      onComplete: () => {
        window.location.href = url;
      }
    });
  },

  // NO button dodge animation
  dodgeButton(button, container) {
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    // Generate random position within container
    const maxX = containerRect.width - buttonRect.width - 20;
    const maxY = containerRect.height - buttonRect.height - 20;
    
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;

    gsap.to(button, {
      x: newX,
      y: newY,
      duration: 0.3,
      ease: "power2.out"
    });
  },

  // Shrink button
  shrinkButton(button, currentScale) {
    const newScale = Math.max(0.3, currentScale - 0.15);
    
    gsap.to(button, {
      scale: newScale,
      duration: 0.2,
      ease: "power2.out"
    });

    return newScale;
  },

  // Names reveal animation for celebration
  namesReveal(proposerEl, heartEl, partnerEl) {
    const tl = gsap.timeline();

    tl.fromTo(proposerEl,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(heartEl,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
      "-=0.3"
    )
    .fromTo(partnerEl,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );

    return tl;
  },

  // Status change animation
  statusChange(element) {
    gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
    );
  },

  // Confetti burst using canvas-confetti
  confettiBurst(options = {}) {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    };
    const config = { ...defaults, ...options };

    if (typeof confetti === 'function') {
      confetti(config);
    }
  },

  // Celebration confetti sequence
  celebrationConfetti() {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const colors = ['#ff6b8a', '#7c4dff', '#ffd700', '#ff8fab', '#b388ff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
};
