/* =============================================
   SANKAR B — EDITORIAL BRUTALIST JS
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCursor();
  initNav();
  initHeroReveal();
  initScrollAnimations();
  initScrollProgress();
  initCounters();
  initSmoothAnchors();
  initActiveNav();
  initCardTilt();
});

// ---- Lenis ----
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({ duration: 1.3, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);
  }
}

// ---- Cursor Dot ----
function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (!dot || window.innerWidth < 768) { if (dot) dot.style.display = 'none'; return; }
  let mx = 0, my = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    dx += (mx - dx) * 0.12; dy += (my - dy) * 0.12;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
    requestAnimationFrame(loop);
  })();
  // Scale up on interactive elements
  document.querySelectorAll('a, button, .proj-card, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(3)'; dot.style.opacity = '0.5'; });
    el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; dot.style.opacity = '1'; });
  });
}

// ---- Navigation ----
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
  toggle.addEventListener('click', () => { toggle.classList.toggle('active'); links.classList.toggle('open'); });
  links.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { toggle.classList.remove('active'); links.classList.remove('open'); }));
}

// ---- Hero Reveal ----
function initHeroReveal() {
  if (typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Lines slide up
  tl.to('.hero-line-inner', {
    y: 0, duration: 1.4, stagger: 0.15
  }, 0.3);

  // Top labels fade in
  tl.fromTo('.hero-label', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.8);

  // Bottom content
  tl.fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 1.2);
  tl.fromTo('.hero-stats', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 1.4);

  // Profile image
  tl.to('.hero-profile', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.0);

  // Scroll indicator
  tl.fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2);

  // CTA buttons
  tl.fromTo('.hero-cta .btn-primary, .hero-cta .btn-outline',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.6);
}

// ---- Scroll Triggered Animations ----
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Section labels slide in
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.fromTo(el, { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
  });

  // Big headings - each line reveals
  gsap.utils.toArray('.big-heading').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
  });

  // Generic reveal
  gsap.utils.toArray('.anim-reveal').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
  });

  // Experience cards cascade with rotation
  gsap.utils.toArray('.exp-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, rotation: i % 2 === 0 ? -1.5 : 1.5, scale: 0.97 },
      { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        delay: (i % 2) * 0.1 });
  });

  // Project cards stagger
  gsap.utils.toArray('.proj-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 60, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        delay: i * 0.06 });
  });

  // Skill blocks slide from alternating sides
  gsap.utils.toArray('.skill-block').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 },
      { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        delay: i * 0.08 });
  });

  // Contact items pop
  gsap.utils.toArray('.contact-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
        delay: i * 0.1 });
  });

  // GitHub cards
  gsap.utils.toArray('.gh-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        delay: i * 0.12 });
  });

  // Education card
  gsap.utils.toArray('.edu-card').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.92, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
  });

  // Terminal
  gsap.utils.toArray('.terminal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, rotation: 1 },
      { opacity: 1, y: 0, rotation: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
  });

  // Section line wipes (proj-top-bar on scroll)
  // Center CTAs
  gsap.utils.toArray('.center-cta').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
  });

  // Marquee parallax speed
  const marquee = document.querySelector('.marquee');
  if (marquee) {
    gsap.fromTo(marquee,
      { opacity: 0 },
      { opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: marquee, start: 'top 95%', toggleActions: 'play none none reverse' } });
  }
}

// ---- Scroll Progress ----
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.to(bar, {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
  });
}

// ---- Counters ----
function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        const target = parseInt(e.target.dataset.count);
        const start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / 2000, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(eased * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else e.target.textContent = target.toLocaleString() + '+';
        })(start);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

// ---- Smooth Anchors ----
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { if (lenis) lenis.scrollTo(t); else t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

// ---- Active Nav ----
function initActiveNav() {
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.getAttribute('id'); });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
    });
  });
}

// ---- Card Tilt ----
function initCardTilt() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.proj-card, .exp-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = (e.clientY - r.top - r.height / 2) / 20;
      const ry = (r.width / 2 - (e.clientX - r.left)) / 20;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
