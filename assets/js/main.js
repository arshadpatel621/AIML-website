// AIML Department Website - Interactions & Animations
// No build tools required; GSAP via CDN

// Helpers
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// Mobile nav toggle
(function mobileNav() {
  const toggle = qs('.nav-toggle');
  const links = qs('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('show');
  });
  // Close on link click (mobile)
  links.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'a') {
      links.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Smooth scroll for anchor links
(function smoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = qs(href);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });
})();

// Footer year
(function year() {
  const y = qs('#year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Counters in hero
(function counters() {
  const counters = qsa('.stat[data-counter]');
  if (!counters.length) return;
  const animateCounter = (el) => {
    const end = Number(el.getAttribute('data-counter') || '0');
    const dur = 1.2; // seconds
    let startTs;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / (dur * 1000), 1);
      const val = Math.floor(end * (0.2 + 0.8 * p * p));
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(end);
    };
    requestAnimationFrame(step);
  };
  // Trigger when hero is visible
  let triggered = false;
  const onScroll = () => {
    const hero = qs('.hero-stats');
    if (!hero || triggered) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      triggered = true;
      counters.forEach(animateCounter);
      window.removeEventListener('scroll', onScroll);
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
})();

// Toppers slider (simple)
(function slider() {
  const track = qs('.topper-track');
  const prev = qs('.slider-controls .prev');
  const next = qs('.slider-controls .next');
  if (!track || !prev || !next) return;

  let index = 0;
  const getCards = () => qsa('.topper-card', track);
  const update = () => {
    const card = getCards()[0];
    if (!card) return;
    const gap = 12;
    const width = card.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * width}px)`;
  };
  prev.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
  next.addEventListener('click', () => { index = Math.min(getCards().length - 1, index + 1); update(); });
  window.addEventListener('resize', update);
  update();
})();

// GSAP Animations
(function animations() {
  if (!(window.gsap && window.ScrollTrigger)) return;
  const gs = window.gsap;
  gs.registerPlugin(window.ScrollTrigger);

  // Hero entrance
  gs.from('.hero-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gs.from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
  gs.from('.hero-cta', { y: 16, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' });
  gs.from('.hero-card', { y: 24, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' });

  // Parallax blobs
  const blobs = qsa('.blob');
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.05;
    blobs.forEach((b, i) => b.style.transform = `translateY(${(i % 2 ? -y : y).toFixed(1)}px)`);
  });

  // Section reveals
  qsa('.section').forEach((sec) => {
    gs.from(sec.querySelectorAll('.section-head h2, .section-head p'), {
      scrollTrigger: { trigger: sec, start: 'top 80%' },
      y: 16, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out'
    });
    gs.from(sec.querySelectorAll('.card, .faculty-card, .activity-card'), {
      scrollTrigger: { trigger: sec, start: 'top 75%' },
      y: 22, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out'
    });
  });
})();
