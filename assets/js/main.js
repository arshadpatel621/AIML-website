// AIML Department Website - Interactions & Animations
// No build tools required; GSAP via CDN

// Helpers
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// Page Loader
(function pageLoader() {
  const loader = qs('#pageLoader');
  if (!loader) return;
  
  // Hide loader once page is loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      // Remove from DOM after animation
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 800); // Show loader for at least 800ms
  });
  
  // Also hide loader if page takes too long (fallback)
  setTimeout(() => {
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  }, 3000); // Max 3 seconds
})();

// Enhanced sticky navigation
(function enhancedStickyNav() {
  const header = qs('.site-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  let isNavVisible = true;
  const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show
  
  const updateNavVisibility = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDiff = Math.abs(currentScrollTop - lastScrollTop);
    
    // Only update if scroll difference is significant enough
    if (scrollDiff < scrollThreshold) return;
    
    // Always show nav when at top of page
    if (currentScrollTop <= 80) {
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
      isNavVisible = true;
    }
    // Show nav immediately when scrolling up (any amount)
    else if (currentScrollTop < lastScrollTop) {
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
      isNavVisible = true;
    }
    // Hide nav when scrolling down (after some distance)
    else if (currentScrollTop > lastScrollTop && currentScrollTop > 150) {
      header.style.transform = 'translateY(-100%)';
      header.style.opacity = '0.7';
      isNavVisible = false;
    }
    
    lastScrollTop = currentScrollTop;
  };
  
  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateNavVisibility);
      ticking = true;
      setTimeout(() => { ticking = false; }, 10);
    }
  };
  
  window.addEventListener('scroll', requestTick, { passive: true });
});

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

// Floating CTA
(function floatingCTA() {
  const floatingCta = qs('#floatingCta');
  if (!floatingCta) return;
  
  let lastScrollTop = 0;
  const showThreshold = 500; // Show after scrolling 500px
  
  const updateCTAVisibility = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show CTA after scrolling past threshold and when scrolling up
    if (currentScrollTop > showThreshold) {
      if (currentScrollTop < lastScrollTop || currentScrollTop > window.innerHeight) {
        floatingCta.classList.add('show');
      }
    } else {
      floatingCta.classList.remove('show');
    }
    
    // Hide when near bottom of page
    if ((window.innerHeight + currentScrollTop) >= document.body.offsetHeight - 200) {
      floatingCta.classList.remove('show');
    }
    
    lastScrollTop = currentScrollTop;
  };
  
  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateCTAVisibility);
      ticking = true;
      setTimeout(() => { ticking = false; }, 10);
    }
  };
  
  window.addEventListener('scroll', requestTick, { passive: true });
})();

// Enhanced card hover effects
(function cardEffects() {
  const cards = qsa('.card, .faculty-card, .activity-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      // Add subtle rotation based on mouse position
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });
})();

// Welcome Popup
(function welcomePopup() {
  const popup = qs('#welcomePopup');
  const closeBtn = qs('#closePopup');
  const closeBtnAlt = qs('#closePopupBtn');
  const exploreBtn = qs('#exploreBtn');
  const overlay = qs('.popup-overlay');
  
  if (!popup) return;
  
  // Check if user has seen popup before (localStorage)
  const hasSeenPopup = localStorage.getItem('aiml-welcome-popup-seen');
  
  const showPopup = () => {
    document.body.classList.add('popup-open');
    popup.classList.add('show');
    
    // Focus management for accessibility
    const firstFocusable = popup.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 300);
    }
  };
  
  const hidePopup = () => {
    popup.classList.remove('show');
    document.body.classList.remove('popup-open');
    
    // Mark as seen in localStorage
    localStorage.setItem('aiml-welcome-popup-seen', 'true');
    
    // Return focus to body
    document.body.focus();
  };
  
  const exploreAndHide = () => {
    hidePopup();
    // Smooth scroll to about section after a brief delay
    setTimeout(() => {
      const aboutSection = qs('#about');
      if (aboutSection) {
        const y = aboutSection.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 300);
  };
  
  // Event listeners
  closeBtn?.addEventListener('click', hidePopup);
  closeBtnAlt?.addEventListener('click', hidePopup);
  exploreBtn?.addEventListener('click', exploreAndHide);
  overlay?.addEventListener('click', hidePopup);
  
  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('show')) {
      hidePopup();
    }
  });
  
  // Show popup every time (for testing)
  // Remove the condition to show popup on every visit
  setTimeout(() => {
    showPopup();
  }, 1000); // Show after 1 second
  
  // Optional: Show popup again after 30 days
  const lastShown = localStorage.getItem('aiml-welcome-popup-last-shown');
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  
  if (lastShown && (now - parseInt(lastShown)) > thirtyDays) {
    localStorage.removeItem('aiml-welcome-popup-seen');
    localStorage.setItem('aiml-welcome-popup-last-shown', now.toString());
  }
  
  // Update last shown time when popup is displayed
  if (!hasSeenPopup) {
    localStorage.setItem('aiml-welcome-popup-last-shown', now.toString());
  }
})();

// Enhanced Counters with Progress Bars in hero
(function enhancedCounters() {
  const counters = qsa('.stat[data-counter]');
  const progressBars = qsa('.stat-progress-bar[data-progress]');
  if (!counters.length) return;
  
  const animateCounter = (el) => {
    const end = Number(el.getAttribute('data-counter') || '0');
    const dur = 2.5; // seconds
    let startTs;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / (dur * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - p, 4); // Better easing
      const val = Math.floor(end * easeOutQuart);
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(end);
    };
    requestAnimationFrame(step);
  };
  
  const animateProgressBar = (el) => {
    const progress = Number(el.getAttribute('data-progress') || '0');
    setTimeout(() => {
      el.style.width = progress + '%';
    }, 200); // Small delay for better visual effect
  };
  
  // Trigger when hero stats are visible
  let triggered = false;
  const onScroll = () => {
    const hero = qs('.hero-stats');
    if (!hero || triggered) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      triggered = true;
      
      // Animate counters
      counters.forEach(animateCounter);
      
      // Animate progress bars
      progressBars.forEach(animateProgressBar);
      
      // Add entrance animations to stat cards
      qsa('.stat-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('stat-animate');
      });
      
      window.removeEventListener('scroll', onScroll);
    }
  };
  
  window.addEventListener('scroll', onScroll);
  onScroll();
})();

// Scroll-triggered animations for sections
(function scrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe all sections and cards
  qsa('.section, .card, .faculty-card, .activity-card').forEach(el => {
    observer.observe(el);
  });
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

// Department Gallery (animated slideshow)
(function departmentGallery() {
  const track = qs('.gallery-track');
  const slides = qsa('.gallery-slide', track);
  const prevBtn = qs('.gallery-prev');
  const nextBtn = qs('.gallery-next');
  const dots = qsa('.gallery-dots .dot');
  
  if (!track || !slides.length) return;
  
  let currentSlide = 0;
  let isAnimating = false;
  
  const updateSlide = (newIndex) => {
    if (isAnimating || newIndex === currentSlide) return;
    
    isAnimating = true;
    
    // Update active slide
    slides[currentSlide].classList.remove('active');
    slides[newIndex].classList.add('active');
    
    // Update active dot
    dots[currentSlide]?.classList.remove('active');
    dots[newIndex]?.classList.add('active');
    
    currentSlide = newIndex;
    
    // Reset animation lock after transition
    setTimeout(() => { isAnimating = false; }, 600);
  };
  
  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length;
    updateSlide(next);
  };
  
  const prevSlide = () => {
    const prev = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    updateSlide(prev);
  };
  
  // Button controls
  nextBtn?.addEventListener('click', nextSlide);
  prevBtn?.addEventListener('click', prevSlide);
  
  // Dot controls
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateSlide(index));
  });
  
  // Auto-advance every 5 seconds
  let autoSlide = setInterval(nextSlide, 5000);
  
  // Pause auto-advance on hover
  track.addEventListener('mouseenter', () => {
    clearInterval(autoSlide);
  });
  
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextSlide, 5000);
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
})();

// Stack uploads: CSV/JSON render
(function stackUploads() {
  const boxes = qsa('.stack-box');
  if (!boxes.length) return;

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.map(line => line.split(',').map(cell => cell.trim()));
  };

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));

  const renderTable = (rows, container) => {
    if (!rows.length) { container.textContent = 'No rows found.'; return; }
    const header = rows[0];
    const body = rows.slice(1);
    const thead = `<thead><tr>${header.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${body.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    container.innerHTML = `<table>${thead}${tbody}</table>`;
  };

  const renderJSON = (data, container) => {
    try {
      if (Array.isArray(data) && data.length && typeof data[0] === 'object' && !Array.isArray(data[0])) {
        const keys = Array.from(new Set(data.flatMap(o => Object.keys(o))));
        const rows = [keys, ...data.map(o => keys.map(k => o[k] ?? ''))];
        renderTable(rows, container);
        return;
      }
      if (Array.isArray(data)) {
        const rows = [['Value'], ...data.map(v => [typeof v === 'object' ? JSON.stringify(v) : v])];
        renderTable(rows, container);
        return;
      }
      if (typeof data === 'object' && data) {
        const rows = [['Key','Value'], ...Object.entries(data).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v])];
        renderTable(rows, container);
        return;
      }
      container.textContent = String(data);
    } catch (e) {
      container.textContent = 'Unable to render JSON data.';
    }
  };

  boxes.forEach((box) => {
    const input = qs('input[type="file"]', box);
    const content = qs('.stack-content', box);
    if (!input || !content) return;

    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      content.textContent = 'Loading...';
      try {
        const text = await file.text();
        const name = file.name.toLowerCase();
        if (name.endsWith('.csv')) {
          const rows = parseCSV(text);
          renderTable(rows, content);
        } else if (name.endsWith('.json')) {
          const data = JSON.parse(text);
          renderJSON(data, content);
        } else {
          content.textContent = 'Unsupported file format. Please upload CSV or JSON.';
        }
      } catch (e) {
        content.textContent = 'Failed to read or parse file.';
      } finally {
        input.value = '';
      }
    });
  });
})();

// About Us Typing Animation
(function aboutUsAnimations() {
  const taglineText = qs('#tagline-text');
  const cursor = qs('#typing-cursor');
  
  if (!taglineText || !cursor) return;
  
  const text = taglineText.textContent;
  taglineText.textContent = '';
  
  let index = 0;
  const typeSpeed = 50; // milliseconds per character
  
  function typeWriter() {
    if (index < text.length) {
      taglineText.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, typeSpeed);
    } else {
      // Start cursor blinking after typing is complete
      cursor.style.opacity = '1';
    }
  }
  
  // Start typing animation when About section comes into view
  const aboutSection = qs('.about-section');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeWriter, 500); // Small delay before starting
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(aboutSection);
  }
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
  gs.from('.stat-card', { y: 16, opacity: 0, duration: 0.6, delay: 0.25, stagger: 0.08, ease: 'power3.out' });
  gs.to('.floating-badges .badge', { y: -6, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 2.0, stagger: 0.15 });

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
    // Avoid double-animating Mission & Vision cards by excluding them here
    const cardSelector = sec.id === 'mission' ? '.faculty-card, .activity-card' : '.card, .faculty-card, .activity-card';
    const cardEls = sec.querySelectorAll(cardSelector);
    if (cardEls.length) {
      gs.from(cardEls, {
        scrollTrigger: { trigger: sec, start: 'top 75%' },
        y: 22, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out'
      });
    }
  });

  // About Us section animations
  const aboutSection = qs('.about-section');
  if (aboutSection) {
    gs.from('.about-title', {
      scrollTrigger: { trigger: aboutSection, start: 'top 80%' },
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    
    gs.from('.about-intro', {
      scrollTrigger: { trigger: aboutSection, start: 'top 75%' },
      y: 20, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power2.out'
    });
    
    gs.from('.highlight-card', {
      scrollTrigger: { trigger: aboutSection, start: 'top 70%' },
      y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out'
    });
  }

  // Mission & Vision specific reveals
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    gs.from('#mission .mv-card', {
      scrollTrigger: { trigger: '#mission', start: 'top 78%' },
      y: 30,
      opacity: 0,
      rotateX: 8,
      transformPerspective: 800,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out'
    });
    gs.from('#mission h3.mv-title', {
      scrollTrigger: { trigger: '#mission', start: 'top 78%' },
      y: 10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      delay: 0.1,
      ease: 'power2.out'
    });
  }
})();
