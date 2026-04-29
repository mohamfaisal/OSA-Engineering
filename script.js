/* ============================================
   OSA ENGINEERING — COMPLETE REDESIGN
   script.js
   ============================================ */

'use strict';

/* ============================================
   LOADING SCREEN
   ============================================ */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  if (!loading) return;
  setTimeout(() => {
    loading.classList.add('hidden');
    document.body.style.overflow = '';
    initHeroParticles();
    initTiltCards();
  }, 1400);
});

document.body.style.overflow = 'hidden';

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX   = 0, ringY   = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
  }
});

function animateCursor() {
  if (cursorRing) {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ============================================
   HERO PARTICLE CANVAS
   ============================================ */
function initHeroParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 60;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height ||
          this.life > this.maxLife) {
        this.reset();
      }
    }
    draw() {
      const progress = this.life / this.maxLife;
      const fade     = progress < 0.1
        ? progress / 0.1
        : progress > 0.8
          ? 1 - (progress - 0.8) / 0.2
          : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 165, 0, ${this.alpha * fade})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger start
    particles.push(p);
  }

  // Connection lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(240, 165, 0, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================
   NAVBAR
   ============================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

// Scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  handleBackToTop();
});

// Hamburger toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

// Close mobile nav on link click
document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// Active nav link based on scroll position
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(l => l.classList.add('active'));
      }
    }
  });
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounter(el, target, suffix = '', duration = 1800) {
  let start     = 0;
  const step    = target / (duration / 16);
  const timer   = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start) + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num[data-target]');
      nums.forEach(num => {
        const target = parseInt(num.dataset.target);
        const suffix = num.dataset.suffix || '';
        animateCounter(num, target, suffix);
        num.removeAttribute('data-target');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

/* ============================================
   3D TILT ON CARDS
   ============================================ */
function initTiltCards() {
  const tiltCards = document.querySelectorAll('.industry-card, .service-card, .feature-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -6;
      const rotY   = ((x - cx) / cx) *  6;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });
}

/* ============================================
   PARALLAX HERO BG
   ============================================ */
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1)`;
  }
});

window.addEventListener('load', () => {
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }
});

/* ============================================
   HERO TITLE TEXT SPLIT ANIMATION
   ============================================ */
function splitAndAnimateText() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
}
splitAndAnimateText();

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
document.querySelectorAll('.btn-gold, .btn-ghost').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect   = btn.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s ease';
  });
});

/* ============================================
   BACK TO TOP
   ============================================ */
const backToTop = document.querySelector('.back-to-top');

function handleBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   CONTACT FORM
   ============================================ */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn  = contactForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    // Simple validation
    const name    = contactForm.querySelector('[name="name"]').value.trim();
    const email   = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();
    const terms   = contactForm.querySelector('[name="terms"]').checked;

    if (!name || !email || !message) {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }

    if (!terms) {
      showFormMessage('Please accept the terms and conditions.', 'error');
      return;
    }

    // Simulate sending
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#2ecc71';
      showFormMessage('Thank you! We\'ll get back to you shortly.', 'success');
      contactForm.reset();
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 1800);
  });
}

function showFormMessage(text, type) {
  let msg = document.getElementById('form-message');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'form-message';
    contactForm.appendChild(msg);
  }
  msg.textContent    = text;
  msg.style.cssText  = `
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.88rem;
    margin-top: 0.5rem;
    background: ${type === 'success' ? 'rgba(46,204,113,0.15)' : 'rgba(224,92,58,0.15)'};
    border: 1px solid ${type === 'success' ? 'rgba(46,204,113,0.4)' : 'rgba(224,92,58,0.4)'};
    color: ${type === 'success' ? '#2ecc71' : '#e05c3a'};
  `;
  setTimeout(() => {
    if (msg) msg.remove();
  }, 4000);
}

/* ============================================
   GALLERY LIGHTBOX (SIMPLE)
   ============================================ */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999;
    display: none; align-items: center; justify-content: center;
    cursor: none;
  `;

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width: 90vw; max-height: 88vh; object-fit: contain;
    border-radius: 8px; box-shadow: 0 20px 80px rgba(0,0,0,0.8);
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.style.cssText = `
    position: absolute; top: 1.5rem; right: 2rem;
    background: rgba(240,165,0,0.2); border: 1px solid rgba(240,165,0,0.4);
    color: #f0a500; width: 44px; height: 44px; border-radius: 50%;
    font-size: 1rem; cursor: none; transition: background 0.2s;
  `;
  closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(240,165,0,0.5)';
  closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(240,165,0,0.2)';

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      lightboxImg.src = src;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
  });
}

initLightbox();

/* ============================================
   SMOOTH SECTION TRANSITIONS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================
   TICKER / MARQUEE (SERVICE NAMES)
   ============================================ */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  // Clone the track for seamless loop
  const clone = tickerTrack.cloneNode(true);
  tickerTrack.parentNode.appendChild(clone);
}

/* ============================================
   GLOWING BORDER ON HOVER (SERVICE CARDS)
   ============================================ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger reveal for elements already in viewport
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('active');
      }
    });
  }, 200);
});