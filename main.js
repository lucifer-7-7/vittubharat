/* =========================================
   WAVEYU — main.js
   ========================================= */

'use strict';

// ─── Locomotive Scroll ───────────────────
let locoScroll;

// ─── Navbar scroll state ─────────────────
function initNavbar() {
  const nb     = document.getElementById('nb');
  const toggle = document.getElementById('nb-toggle');
  const panel  = document.getElementById('nb-panel');
  if (!nb || !toggle) return;

  function open()  {
    nb.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel && panel.setAttribute('aria-hidden', 'false');
  }
  function close() {
    nb.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel && panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () =>
    nb.classList.contains('open') ? close() : open()
  );

  // close on link click
  document.querySelectorAll('.nb-link').forEach(l =>
    l.addEventListener('click', close)
  );

  // close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#nb')) close();
  });
}

// ─── Hero carousel (trip highlights) ────
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  const prev = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  function autoPlay() {
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  if (prev) prev.addEventListener('click', () => { clearInterval(timer); goTo(current - 1); autoPlay(); });
  if (next) next.addEventListener('click', () => { clearInterval(timer); goTo(current + 1); autoPlay(); });
  autoPlay();
}

// ─── Room accordion (Stay) ───────────────
function initRoomAccordion() {
  document.querySelectorAll('.room-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.room-item');
      const body = btn.nextElementSibling;
      const chevron = btn.querySelector('.room-chevron');
      const isOpen = body.classList.contains('room-body--open');

      // Close all
      document.querySelectorAll('.room-body').forEach(b => b.classList.remove('room-body--open'));
      document.querySelectorAll('.room-chevron').forEach(c => c.classList.remove('room-chevron--open'));
      document.querySelectorAll('.room-header').forEach(b => b.setAttribute('aria-expanded', 'false'));

      if (!isOpen) {
        body.classList.add('room-body--open');
        chevron.classList.add('room-chevron--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ─── Timeline accordion (Program) ────────
function initTimeline() {
  document.querySelectorAll('.timeline-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.timeline-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ─── FAQ accordion ────────────────────────
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  // GSAP entrance animations on scroll
  if (typeof gsap !== 'undefined') {
    // header
    const header = document.querySelector('[data-faq-header]');
    if (header) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          gsap.to(e.target, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        });
      }, { threshold: 0.2 });
      io.observe(header);
    }

    // each faq item staggered
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        const idx = Array.from(items).indexOf(e.target);
        gsap.to(e.target, { opacity: 1, y: 0, duration: 0.6, delay: idx * 0.07, ease: 'power2.out' });
      });
    }, { threshold: 0.1 });
    items.forEach(el => io2.observe(el));

    // CTA strip
    const cta = document.querySelector('[data-faq-cta]');
    if (cta) {
      const io3 = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io3.unobserve(e.target);
          gsap.to(e.target, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        });
      }, { threshold: 0.2 });
      io3.observe(cta);
    }
  } else {
    // no GSAP fallback: show immediately
    document.querySelectorAll('[data-faq-header],[data-faq-item],[data-faq-cta]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // accordion with GSAP height animation
  items.forEach(item => {
    const btn  = item.querySelector('.faq-btn');
    const body = item.querySelector('.faq-body');
    if (!btn || !body) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all
      items.forEach(i => {
        if (i === item) return;
        i.classList.remove('open');
        i.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
        const b = i.querySelector('.faq-body');
        if (b) {
          if (typeof gsap !== 'undefined') gsap.to(b, { height: 0, duration: 0.4, ease: 'power2.inOut' });
          else b.style.height = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (typeof gsap !== 'undefined') gsap.to(body, { height: 0, duration: 0.4, ease: 'power2.inOut' });
        else body.style.height = '0';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        // measure natural height
        body.style.height = 'auto';
        const h = body.offsetHeight;
        body.style.height = '0';
        if (typeof gsap !== 'undefined') gsap.to(body, { height: h, duration: 0.45, ease: 'power2.out' });
        else body.style.height = h + 'px';
      }
    });
  });
}

// ─── Pricing accordion ────────────────────
function initPricingAccordion() {
  document.querySelectorAll('.pricing-acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
    });
  });
}

// ─── Instructor slider ────────────────────
function initInstructorSlider() {
  const slides = document.querySelectorAll('.instr-slide');
  if (!slides.length) return;
  let current = 0;

  function goTo(idx) {
    slides[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  // All nav buttons inside the slider share navigation
  document.querySelectorAll('.instr-prev').forEach(btn => {
    btn.addEventListener('click', () => goTo(current - 1));
  });
  document.querySelectorAll('.instr-next').forEach(btn => {
    btn.addEventListener('click', () => goTo(current + 1));
  });
}

// ─── Testimonial slider ───────────────────
function initTestiSlider() {
  const pills   = document.querySelectorAll('.ut-pill');
  const quoteEl = document.getElementById('ut-quote');
  const roleEl  = document.getElementById('ut-role');
  if (!pills.length || !quoteEl || !roleEl) return;

  let active = 0;
  let busy   = false;

  function select(idx) {
    if (idx === active || busy) return;
    busy = true;

    // fade out
    quoteEl.classList.add('animating');
    roleEl.classList.add('animating');

    setTimeout(() => {
      // swap content
      quoteEl.innerHTML = pills[idx].dataset.quote;
      roleEl.innerHTML  = pills[idx].dataset.role;

      // swap active pill
      pills[active].classList.remove('ut-pill--active');
      pills[idx].classList.add('ut-pill--active');
      active = idx;

      // fade in
      quoteEl.classList.remove('animating');
      roleEl.classList.remove('animating');

      setTimeout(() => { busy = false; }, 400);
    }, 220);
  }

  pills.forEach((pill, i) => {
    pill.addEventListener('click', () => select(i));
  });
}

// ─── Level card hover text slide-in ──────
function initLevelCards() {
  // Pure CSS hover handles the animation via .level-card:hover .level-card-bottom
  // JS just ensures keyboard accessibility
  document.querySelectorAll('.level-card').forEach(card => {
    card.setAttribute('tabindex', '0');
  });
}

// ─── Scroll reveal (IntersectionObserver) ─
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.section-label, .overview-heading, .levels-heading, .stay-heading, ' +
    '.experience-heading, .program-heading, .instructors-heading, ' +
    '.testimonials-heading, .steps-heading, .pricing-heading, .faq-heading, ' +
    '.team-heading, .step-row, .exp-card, .pricing-card, .faq-item, .testi-card'
  );

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
}

// ─── Smooth anchor scrolling & Loco ─────────
function initLocomotiveScroll() {
  const container = document.querySelector('[data-scroll-container]');
  if (!container) return;
  
  locoScroll = new LocomotiveScroll({
    el: container,
    smooth: true,
    multiplier: 1
  });

  new ResizeObserver(() => locoScroll.update()).observe(container);
  window.addEventListener('load', () => locoScroll.update());
  setTimeout(() => locoScroll.update(), 1000);

  const navbar = document.getElementById('navbar');
  locoScroll.on('scroll', (obj) => {
    navbar.classList.toggle('scrolled', obj.scroll.y > 60);
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        locoScroll.scrollTo(target);
      }
    });
  });
}

// ─── Scroll reveal text (word-by-word grey → black) ──
function initRevealText() {
  const els = document.querySelectorAll('.reveal-text');
  if (!els.length) return;

  els.forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w =>
      `<span class="word">${w}</span>`
    ).join(' ');
  });

  function update() {
    const wh = window.innerHeight;
    els.forEach(el => {
      const words = el.querySelectorAll('.word');
      const total = words.length;
      const rect = el.getBoundingClientRect();
      const progress = 1 - (rect.bottom / (wh + rect.height));
      const lit = Math.round(Math.max(0, Math.min(1, progress * 1.4)) * total);
      words.forEach((w, i) => w.classList.toggle('lit', i < lit));
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ─── Why + Apart GSAP animations ─────────
// ─── How It Works ────────────────────────
function initHowItWorks() {
  const wrap = document.querySelector('.how-track-wrap');
  const steps = document.querySelectorAll('.how-step');
  const hint  = document.getElementById('how-drag-hint');
  if (!wrap || !steps.length) return;

  // drag to scroll
  let isDown = false, startX = 0, scrollLeft = 0;
  wrap.addEventListener('mousedown', e => {
    isDown = true;
    wrap.classList.add('is-grabbing');
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.classList.remove('is-grabbing'); });
  wrap.addEventListener('mouseup', () => { isDown = false; wrap.classList.remove('is-grabbing'); });
  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });

  // hide drag hint after first scroll
  wrap.addEventListener('scroll', () => {
    if (hint && wrap.scrollLeft > 40) hint.classList.add('hidden');
  }, { once: true });

  // GSAP stagger entrance + line reveal
  if (typeof gsap !== 'undefined') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const idx = Array.from(steps).indexOf(entry.target);
        gsap.to(entry.target, {
          opacity: 1, y: 0,
          duration: 0.8, delay: idx * 0.15,
          ease: 'power3.out',
          onComplete: () => entry.target.classList.add('in-view')
        });
      });
    }, { threshold: 0.2 });
    steps.forEach(s => io.observe(s));
  } else {
    steps.forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; s.classList.add('in-view'); });
  }
}

function initWhyApartAnimations() {
  if (typeof gsap === 'undefined') return;

  // Why top header
  const whyTop = document.querySelector('[data-gsap-why-top]');
  if (whyTop) {
    const ioT = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        ioT.unobserve(e.target);
        gsap.to(e.target, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      });
    }, { threshold: 0.2 });
    ioT.observe(whyTop);
  }

  // Why cards — staggered slide up from bottom
  const whyCards = document.querySelectorAll('[data-gsap-why]');
  if (whyCards.length) {
    gsap.set(whyCards, { opacity: 0, y: 60 });
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const idx = Array.from(whyCards).indexOf(entry.target);
        gsap.to(entry.target, {
          opacity: 1, y: 0,
          duration: 0.8,
          delay: idx * 0.12,
          ease: 'power3.out'
        });
      });
    }, { threshold: 0.15 });
    whyCards.forEach(c => io.observe(c));
  }

  // Apart left — fade + slide right
  const apartLeft = document.querySelector('[data-gsap-apart-left]');
  if (apartLeft) {
    gsap.set(apartLeft, { opacity: 0, x: -32 });
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io2.unobserve(entry.target);
        gsap.to(entry.target, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' });
      });
    }, { threshold: 0.2 });
    io2.observe(apartLeft);
  }

  // Apart items — staggered fade up
  const apartItems = document.querySelectorAll('[data-gsap-apart]');
  if (apartItems.length) {
    gsap.set(apartItems, { opacity: 0, y: 28 });
    const io3 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io3.unobserve(entry.target);
        const idx = Array.from(apartItems).indexOf(entry.target);
        gsap.to(entry.target, {
          opacity: 1, y: 0,
          duration: 0.65,
          delay: idx * 0.08,
          ease: 'power2.out'
        });
      });
    }, { threshold: 0.1 });
    apartItems.forEach(el => io3.observe(el));
  }
}

// ─── Services hover modal ────────────────
function initServiceModal() {
  const rows = document.querySelectorAll('.svc-row');
  const modal = document.getElementById('svc-modal');
  const track = document.getElementById('svc-modal-track');
  const cursor = document.getElementById('svc-cursor');
  if (!rows.length || !modal || !track || !cursor) return;

  const slideCount = track.querySelectorAll('.svc-modal-slide').length;
  const slideH = 260;
  track.style.height = (slideCount * slideH) + 'px';

  let activeIndex = 0;
  let isActive = false;

  // GSAP quickTo for smooth following — fall back to direct set if no GSAP
  let moveModal, moveCursor;
  if (typeof gsap !== 'undefined') {
    const xModal  = gsap.quickTo(modal,  'left', { duration: 0.8, ease: 'power3' });
    const yModal  = gsap.quickTo(modal,  'top',  { duration: 0.8, ease: 'power3' });
    const xCursor = gsap.quickTo(cursor, 'left', { duration: 0.5, ease: 'power3' });
    const yCursor = gsap.quickTo(cursor, 'top',  { duration: 0.5, ease: 'power3' });
    moveModal  = (x, y) => { xModal(x);  yModal(y);  };
    moveCursor = (x, y) => { xCursor(x); yCursor(y); };
  } else {
    moveModal  = (x, y) => { modal.style.left  = x + 'px'; modal.style.top  = y + 'px'; };
    moveCursor = (x, y) => { cursor.style.left = x + 'px'; cursor.style.top = y + 'px'; };
  }

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      activeIndex = parseInt(row.dataset.index, 10) || 0;
      track.style.top = (-activeIndex * slideH) + 'px';
      modal.classList.add('active');
      cursor.classList.add('active');
      isActive = true;
    });
    row.addEventListener('mouseleave', () => {
      modal.classList.remove('active');
      cursor.classList.remove('active');
      isActive = false;
    });
  });

  window.addEventListener('mousemove', e => {
    if (!isActive) return;
    moveModal(e.clientX, e.clientY);
    moveCursor(e.clientX, e.clientY);
  });
}

// ─── Stats countup + scramble ────────────
function initStatsCountup() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const chars = '0123456789';

  function scrambleTo(el, target, suffix, delay) {
    let frame = 0;
    const totalFrames = 28;
    const scrambleFrames = 12;

    setTimeout(() => {
      el.classList.add('counted');
      const tick = setInterval(() => {
        frame++;
        if (frame <= scrambleFrames) {
          // random scramble phase
          el.textContent = chars[Math.floor(Math.random() * chars.length)] + suffix;
        } else {
          // count up phase
          const progress = (frame - scrambleFrames) / (totalFrames - scrambleFrames);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = Math.round(eased * target);
          el.textContent = val + suffix;
          if (frame >= totalFrames) {
            el.textContent = target + suffix;
            clearInterval(tick);
          }
        }
      }, 32);
    }, delay);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const idx = Array.from(nums).indexOf(el);
      scrambleTo(el, target, suffix, idx * 120);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => io.observe(el));
}

// ─── INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCarousel();
  initRoomAccordion();
  initTimeline();
  initFAQ();
  initPricingAccordion();
  initInstructorSlider();
  initTestiSlider();
  initLevelCards();
  initScrollReveal();
  initStatsCountup();
  initServiceModal();
  initHowItWorks();
  initWhyApartAnimations();
  initRevealText();
  initLocomotiveScroll();

  // ─── Footer Spotlight ─────────
  const wordmark = document.querySelector('.footer-wordmark');
  if (wordmark) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isHovering = false;
    
    function animateSpotlight() {
      if (!isHovering) return;
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      wordmark.style.setProperty('--mouse-x', `${currentX}px`);
      wordmark.style.setProperty('--mouse-y', `${currentY}px`);
      requestAnimationFrame(animateSpotlight);
    }

    wordmark.addEventListener('mouseenter', (e) => {
      const rect = wordmark.getBoundingClientRect();
      targetX = currentX = e.clientX - rect.left;
      targetY = currentY = e.clientY - rect.top;
      wordmark.style.setProperty('--mouse-x', `${currentX}px`);
      wordmark.style.setProperty('--mouse-y', `${currentY}px`);
      isHovering = true;
      requestAnimationFrame(animateSpotlight);
    });

    wordmark.addEventListener('mousemove', (e) => {
      const rect = wordmark.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    wordmark.addEventListener('mouseleave', () => {
      isHovering = false;
    });
  }
});
