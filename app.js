/* =============================================
   SANKAR B — PORTFOLIO JAVASCRIPT
   Animations, Interactions & Effects
   ============================================= */

// ---- Wait for DOM ----
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initParticles();
  initCursorGlow();
  initNavigation();
  initTypewriter();
  initGSAPReveal();
  initParallax();
  initMagnetic();
  initScrollProgress();
  initCounterAnimation();
  initSmoothScroll();
  initActiveNav();
  initSecretArea();
});

// ---- Lenis Smooth Scroll ----
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);
  }
}

// ---- Particle System ----
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDirection * 0.002;
      if (this.opacity <= 0.05 || this.opacity >= 0.5) this.fadeDirection *= -1;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles (fewer on mobile)
  const count = window.innerWidth < 768 ? 30 : 60;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }
  animate();
}

// ---- Cursor Glow ----
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) {
    if (glow) glow.style.display = 'none';
    return;
  }
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// ---- Navigation ----
function initNavigation() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

// ---- Typewriter Effect ----
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'build security tools.',
    'break & fix things.',
    'monitor radio frequencies.',
    'automate everything.',
    'hunt vulnerabilities.',
    'love Linux (btw).'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(type, 1500);
      return;
    }

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isPaused = true;
        setTimeout(type, 100);
        return;
      }
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 1000);
}

// ---- GSAP Reveal Animations ----
function initGSAPReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    gsap.fromTo(el, 
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

// ---- Parallax Layers ----
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const layers = document.querySelectorAll('.ambient-layer');
  layers.forEach(layer => {
    const speed = layer.getAttribute('data-speed') || 0.5;
    gsap.to(layer, {
      y: () => (ScrollTrigger.maxScroll(window) * speed),
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });
  });
}

// ---- Magnetic Hover Effect ----
function initMagnetic() {
  if (window.innerWidth < 768 || typeof gsap === 'undefined') return;
  const magneticEls = document.querySelectorAll('.btn, .social-link, .nav-link, .project-link-icon, .contact-card');
  
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) - (rect.width / 2);
      const y = (e.clientY - rect.top) - (rect.height / 2);
      
      gsap.to(el, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.6,
        ease: "power3.out"
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
}

// ---- Scroll Progress ----
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  gsap.to(progressBar, {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3
    }
  });
}

// ---- Counter Animation ----
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + '+';
    }
  }
  requestAnimationFrame(update);
}

// ---- Smooth Scroll ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        if (typeof lenis !== 'undefined') {
          lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// ---- Active Nav Link ----
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// ---- Tilt Effect on Project Cards ----
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

// ---- Secret Area (Login & Notes) ----
function initSecretArea() {
  const loginForm = document.getElementById('loginForm');
  const loginUser = document.getElementById('loginUser');
  const loginPass = document.getElementById('loginPass');
  const loginError = document.getElementById('loginError');
  const secretLogin = document.getElementById('secretLogin');
  const secretDashboard = document.getElementById('secretDashboard');
  const logoutBtn = document.getElementById('logoutBtn');
  const secretNotes = document.getElementById('secretNotes');
  const saveStatus = document.getElementById('saveStatus');
  
  if (!loginForm) return;

  const SESSION_KEY = 'portfolio_auth_token';
  const NOTES_KEY = 'portfolio_secret_notes';

  // Check if already logged in
  if (localStorage.getItem(SESSION_KEY) === 'true') {
    showDashboard();
  }

  // Handle Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (loginUser.value.trim() === 'sank' && loginPass.value.trim() === 'sank') {
      localStorage.setItem(SESSION_KEY, 'true');
      showDashboard();
      loginError.textContent = '';
      loginForm.reset();
    } else {
      loginError.textContent = 'ACCESS DENIED: Invalid credentials';
      // Add shake animation
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(loginForm, { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => { gsap.set(loginForm, {x: 0}) } });
      }
    }
  });

  // Handle Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(SESSION_KEY);
    secretDashboard.style.display = 'none';
    secretLogin.style.display = 'block';
    
    // Refresh ScrollTrigger since layout changed
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  // Auto-save logic
  let saveTimeout;
  secretNotes.addEventListener('input', () => {
    saveStatus.textContent = 'Saving...';
    saveStatus.style.color = 'var(--text-muted)';
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem(NOTES_KEY, secretNotes.value);
      saveStatus.textContent = 'Saved';
      saveStatus.style.color = 'var(--accent-green)';
      
      // Reset color after a bit
      setTimeout(() => {
        saveStatus.style.color = 'var(--text-muted)';
      }, 2000);
    }, 1000); 
  });

  function showDashboard() {
    secretLogin.style.display = 'none';
    secretDashboard.style.display = 'block';
    
    // Load notes
    const savedNotes = localStorage.getItem(NOTES_KEY);
    if (savedNotes) {
      secretNotes.value = savedNotes;
    }
    
    // Refresh ScrollTrigger since layout changed
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
}

