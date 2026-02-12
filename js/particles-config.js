// Particles.js configs for different themes

const particleConfigs = {
  // Hearts (pink theme)
  hearts: {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#ff6b8a", "#ff8fab", "#ffb4c4", "#ffc0cb"]
      },
      shape: {
        type: "image",
        image: {
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff6b8a'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E",
          width: 24,
          height: 24
        }
      },
      opacity: {
        value: 0.6,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.2,
          sync: false
        }
      },
      size: {
        value: 15,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 8,
          sync: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "bottom",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 150,
          size: 20,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        push: {
          particles_nb: 3
        }
      }
    },
    retina_detect: true
  },

  // Star particles for female proposer (blue/purple theme)
  stars: {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#7c4dff", "#536dfe", "#b388ff", "#82b1ff"]
      },
      shape: {
        type: "star",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 0.7,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 4,
        random: true,
        anim: {
          enable: true,
          speed: 3,
          size_min: 1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#7c4dff",
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.4
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  },

  // Celebration particles (mixed hearts and stars)
  celebration: {
    particles: {
      number: {
        value: 60,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#ff6b8a", "#7c4dff", "#ffd700", "#ff8fab", "#b388ff"]
      },
      shape: {
        type: ["circle", "star"],
        stroke: {
          width: 0,
          color: "#000000"
        }
      },
      opacity: {
        value: 0.7,
        random: true,
        anim: {
          enable: true,
          speed: 1.5,
          opacity_min: 0.2,
          sync: false
        }
      },
      size: {
        value: 6,
        random: true,
        anim: {
          enable: true,
          speed: 4,
          size_min: 2,
          sync: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 5
        }
      }
    },
    retina_detect: true
  },

  // Soft ambient particles for home/neutral
  ambient: {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: ["#ff6b8a", "#7c4dff", "#ffffff"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.3,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 180,
        color: "#ffffff",
        opacity: 0.08,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: false
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 120,
          line_linked: {
            opacity: 0.2
          }
        }
      }
    },
    retina_detect: true
  }
};

// Initialize particles based on theme
export function initParticles(theme = 'ambient') {
  const config = particleConfigs[theme] || particleConfigs.ambient;
  
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', config);
  }
  // Silent fail if particles.js not loaded
}

// Update particles theme
export function updateParticles(theme) {
  // Destroy existing particles
  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
  
  // Initialize with new theme
  initParticles(theme);
}
