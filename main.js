/* =========================================
   WAVEYU — main.js
   ========================================= */

'use strict';

// ─── Locomotive Scroll ───────────────────
let locoScroll;

// ─── Navbar scroll state ─────────────────
function initNavbar() {
  const nb = document.getElementById('nb');
  const toggle = document.getElementById('nb-toggle');
  const panel = document.getElementById('nb-panel');
  if (!nb || !toggle) return;

  function open() {
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

  // Change nav bar color based on hero section
  const stats = document.querySelector('.stats-strip');
  if (stats && typeof gsap !== 'undefined') {
    ScrollTrigger.create({
      trigger: stats,
      start: 'top 90%',
      onEnter: () => nb.classList.add('past-hero'),
      onLeaveBack: () => nb.classList.remove('past-hero')
    });
  }
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
    const btn = item.querySelector('.faq-btn');
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
  const pills = document.querySelectorAll('.ut-pill');
  const quoteEl = document.getElementById('ut-quote');
  const roleEl = document.getElementById('ut-role');
  if (!pills.length || !quoteEl || !roleEl) return;

  let active = 0;
  let busy = false;

  function select(idx) {
    if (idx === active || busy) return;
    busy = true;

    // fade out
    quoteEl.classList.add('animating');
    roleEl.classList.add('animating');

    setTimeout(() => {
      // swap content
      quoteEl.innerHTML = pills[idx].dataset.quote;
      roleEl.innerHTML = pills[idx].dataset.role;

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
// ─── Footer ───────────────────────────────
function initFooter() {
  if (typeof gsap === 'undefined') return;

  const footer = document.getElementById('site-footer');
  const borderLine = footer?.querySelector('.footer-border-line');
  const brandName = document.getElementById('footer-brand-name');
  const col1 = document.getElementById('footer-col-1');
  const col2 = document.getElementById('footer-col-2');
  const wordmark = document.getElementById('footer-wordmark');
  const copy = footer?.querySelector('.footer-copy');
  if (!footer) return;

  // ── 1. Border line draws left → right on enter ──
  if (borderLine) {
    gsap.to(borderLine, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: footer,
        start: 'top 92%',
        toggleActions: 'play none none none'
      }
    });
  }

  // ── 2. Brand name + cols stagger up ──
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: footer,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  if (brandName) {
    tl.to(brandName, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
  }
  if (col1) tl.to(col1, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');
  if (col2) tl.to(col2, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');

  // ── 3. Wordmark scrubs horizontally with scroll (ScrollTrigger scrub) ──
  if (wordmark) {
    gsap.fromTo(wordmark,
      { x: '-4%' },
      {
        x: '2%',
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      }
    );
  }

  // ── 4. Copyright fades in ──
  if (copy) {
    gsap.to(copy, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: copy,
        start: 'top 95%',
        toggleActions: 'play none none none'
      }
    });
  }

  // ── 5. Footer link hover: SVG underline draws in/out ──
  footer.querySelectorAll('.footer-link').forEach(link => {
    // inject SVG underline into each link
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'footer-link-ul');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '1');
    svg.setAttribute('viewBox', '0 0 200 1');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'position:absolute;bottom:0;left:0;pointer-events:none;overflow:visible;';
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0.5');
    line.setAttribute('x2', '200');
    line.setAttribute('y2', '0.5');
    line.setAttribute('stroke', 'currentColor');
    line.setAttribute('stroke-width', '1');
    line.style.cssText = 'stroke-dasharray:200;stroke-dashoffset:200;';
    svg.appendChild(line);
    link.appendChild(svg);

    link.addEventListener('mouseenter', () => {
      gsap.to(line, { strokeDashoffset: 0, duration: 0.32, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(line, {
        strokeDashoffset: -200, duration: 0.25, ease: 'power2.in',
        onComplete: () => gsap.set(line, { strokeDashoffset: 200 })
      });
    });
  });
}

// ─── How It Works ────────────────────────
function initHowItWorks() {
  const wrap = document.querySelector('.how-track-wrap');
  const steps = document.querySelectorAll('.how-step');
  const hint = document.getElementById('how-drag-hint');
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

  const rows = document.querySelectorAll('[data-why-row]');
  if (!rows.length) return;

  const progressNum = document.getElementById('why-progress-num');
  const headline = document.getElementById('why-headline');

  // per-row headline text shown in sticky left panel
  const headlineTexts = [
    'Local knowledge\nno portal can\nreplicate.',
    'Legal team\nempanelled\nwith banks.',
    'Direct bank\npartnerships,\nfaster loans.',
    'One team.\nSearch to\nregistration.',
    '100 years of\ncombined\nexpertise.',
  ];

  function switchHeader(idx) {
    if (!headline && !progressNum) return;
    const tl = gsap.timeline();
    // exit: slide up + fade
    tl.to([headline, progressNum].filter(Boolean), {
      y: -18, opacity: 0, duration: 0.22, ease: 'power2.in', stagger: 0.04
    });
    tl.call(() => {
      if (progressNum) progressNum.textContent = `${String(idx + 1).padStart(2, '0')} / 05`;
      if (headline) headline.innerHTML = headlineTexts[idx].replace(/\n/g, '<br>');
    });
    // enter: slide up from below + fade
    tl.fromTo([headline, progressNum].filter(Boolean),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.32, ease: 'power2.out', stagger: 0.05 }
    );
  }

  // ── ScrollTrigger per row ──
  rows.forEach((row, idx) => {
    ScrollTrigger.create({
      trigger: row,
      start: 'top 52%',
      end: 'bottom 52%',
      onEnter: () => switchHeader(idx),
      onEnterBack: () => switchHeader(idx),
    });
  });

  // Animate header into view
  const header = document.getElementById('why-header');
  if (header) {
    gsap.from(header, {
      opacity: 0, x: -24,
      duration: 1, ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  // CTA link arrow micro-bounce on load
  const ctaLink = document.getElementById('why-cta-link');
  if (ctaLink) {
    const arrow = ctaLink.querySelector('.why-cta-arrow');
    if (arrow) {
      ctaLink.addEventListener('mouseenter', () => {
        gsap.to(arrow, { x: 3, y: -3, duration: 0.2, ease: 'power2.out' });
      });
      ctaLink.addEventListener('mouseleave', () => {
        gsap.to(arrow, { x: 0, y: 0, duration: 0.3, ease: 'power2.inOut' });
      });
    }
  }

  // Each row: fade+translate in, then SVG path draws
  rows.forEach((row, idx) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 78%',
        toggleActions: 'play none none none'
      }
    });

    // Row slides up + fades in
    tl.to(row, {
      opacity: 1, y: 0,
      duration: 0.7,
      ease: 'power3.out',
      delay: idx * 0.04
    });

    // SVG paths draw in after row appears
    const paths = row.querySelectorAll('.why-svg-path');
    if (paths.length) {
      // measure actual length per path
      paths.forEach(path => {
        try {
          const len = path.getTotalLength ? path.getTotalLength() : 200;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(path, {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: 'power2.inOut'
          }, '-=0.4');
        } catch (e) {
          tl.to(path, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.4');
        }
      });
    }

    // Number fades in with slight scale
    const num = row.querySelector('.why-row-num');
    if (num) {
      tl.from(num, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' }, 0.1);
    }

    // Title chars stagger — only if gsap SplitText unavailable, do word fade
    const title = row.querySelector('.why-row-title');
    if (title) {
      tl.from(title, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 0.2);
    }

    const body = row.querySelector('.why-row-body');
    if (body) {
      tl.from(body, { opacity: 0, y: 8, duration: 0.5, ease: 'power2.out' }, 0.35);
    }
  });

  // Horizontal rule micro — left border on why-wrap animates width
  const wrap = document.querySelector('.why-wrap');
  if (wrap) {
    gsap.from(wrap, {
      opacity: 0,
      duration: 0.4, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 90%' }
    });
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
    const xModal = gsap.quickTo(modal, 'left', { duration: 0.8, ease: 'power3' });
    const yModal = gsap.quickTo(modal, 'top', { duration: 0.8, ease: 'power3' });
    const xCursor = gsap.quickTo(cursor, 'left', { duration: 0.5, ease: 'power3' });
    const yCursor = gsap.quickTo(cursor, 'top', { duration: 0.5, ease: 'power3' });
    moveModal = (x, y) => { xModal(x); yModal(y); };
    moveCursor = (x, y) => { xCursor(x); yCursor(y); };
  } else {
    moveModal = (x, y) => { modal.style.left = x + 'px'; modal.style.top = y + 'px'; };
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
// ─── Property ticker card ────────────────
// ─── Contact CTA left panel GSAP ─────────
function initContactCTA() {
  if (typeof gsap === 'undefined') return;

  const panel = document.getElementById('cta-left-panel');
  if (!panel) return;

  const lines = panel.querySelectorAll('.cta-line');
  const divider = panel.querySelector('.cta-divider-line');
  const sub = document.getElementById('cta-sub');
  const address = document.getElementById('cta-address');
  const enquire = document.getElementById('open-enquiry');
  const waBtn = document.getElementById('cta-wa-btn');

  // ── set initial states ──
  gsap.set(lines, { yPercent: 110 });         // below clip
  gsap.set([sub, address].filter(Boolean), { opacity: 0, y: 16 });
  gsap.set([enquire, waBtn].filter(Boolean), { opacity: 0, y: 12 });
  if (divider) gsap.set(divider, { strokeDashoffset: 400 });

  // ── entrance timeline — triggered by scroll ──
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      start: 'top 72%',
      toggleActions: 'play none none none'
    }
  });

  // Lines reveal: each slides up from clip one by one
  tl.to(lines, {
    yPercent: 0,
    duration: 0.9,
    ease: 'power4.out',
    stagger: 0.12
  });

  // Divider draws left → right
  if (divider) {
    tl.to(divider, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.3');
  }

  // Sub text fades up
  if (sub) {
    tl.to(sub, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
  }

  // Meta row fades
  if (address) {
    tl.to(address, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }

  // Buttons stagger in
  [enquire, waBtn].filter(Boolean).forEach((el, i) => {
    tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, `-=0.${i === 0 ? 3 : 2}`);
  });

  // ── enquire button micro-interactions ──
  if (enquire) {
    const ulLine = enquire.querySelector('.cta-ul-line');
    const arrowEl = enquire.querySelector('.cta-btn-arrow');

    enquire.addEventListener('mouseenter', () => {
      // underline draws in
      if (ulLine) gsap.to(ulLine, { strokeDashoffset: 0, duration: 0.38, ease: 'power2.out' });
      // arrow nudges right
      if (arrowEl) gsap.to(arrowEl, { x: 5, duration: 0.22, ease: 'power2.out' });
    });

    enquire.addEventListener('mouseleave', () => {
      // underline retracts from left → erases right
      if (ulLine) gsap.to(ulLine, {
        strokeDashoffset: -200, duration: 0.3, ease: 'power2.in',
        onComplete: () => gsap.set(ulLine, { strokeDashoffset: 200 })
      });
      if (arrowEl) gsap.to(arrowEl, { x: 0, duration: 0.25, ease: 'power2.inOut' });
    });
  }

  // ── WhatsApp btn: text nudges on hover ──
  if (waBtn) {
    waBtn.addEventListener('mouseenter', () => {
      gsap.to(waBtn, { x: 4, duration: 0.2, ease: 'power2.out' });
    });
    waBtn.addEventListener('mouseleave', () => {
      gsap.to(waBtn, { x: 0, duration: 0.3, ease: 'power2.inOut' });
    });
  }
}

function initPropertyTicker() {
  const slides = document.querySelectorAll('.cta-ticker-slide');
  const dotBtns = document.querySelectorAll('.cta-ticker-dot-btn');
  const tags = document.querySelectorAll('.cta-ticker-tag');
  const countEl = document.getElementById('ticker-count');
  if (!slides.length) return;

  let cur = 0;
  let timer;

  function goTo(idx) {
    slides[cur].classList.remove('active');
    dotBtns[cur]?.classList.remove('active');
    tags[cur]?.classList.remove('active');
    cur = (idx + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dotBtns[cur]?.classList.add('active');
    tags[cur]?.classList.add('active');
    if (countEl) countEl.textContent = `0${cur + 1} / 0${slides.length}`;
  }

  function autoplay() { timer = setInterval(() => goTo(cur + 1), 4000); }

  dotBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => { clearInterval(timer); goTo(i); autoplay(); });
  });

  autoplay();
}

// ─── Enquiry Form (Typeform-style) ────────
function initEnquiryForm() {
  const section = document.getElementById('enquiry-form');
  const openBtn = document.getElementById('open-enquiry');
  const closeBtn = document.getElementById('eq-close');
  const progress = document.getElementById('eq-progress');
  const counter = document.getElementById('eq-counter');
  if (!section || !openBtn) return;

  const TOTAL = 5; // question steps (0-4), step 5 = submit
  const answers = {};
  let current = 0;
  let isOpen = false;

  // ── open / close ──
  function openForm() {
    section.classList.add('open');
    section.setAttribute('aria-hidden', 'false');
    isOpen = true;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const firstInput = section.querySelector('.eq-step.active .eq-input');
    if (firstInput) setTimeout(() => firstInput.focus(), 500);
  }

  function closeForm() {
    section.classList.remove('open');
    section.setAttribute('aria-hidden', 'true');
    isOpen = false;
  }

  openBtn.addEventListener('click', openForm);
  if (closeBtn) closeBtn.addEventListener('click', closeForm);

  // ── navigation ──
  function updateUI(idx) {
    counter.textContent = `${Math.min(idx + 1, TOTAL)} / ${TOTAL}`;
    const pct = (idx / TOTAL) * 100;
    progress.style.width = pct + '%';
  }

  // glow positions per step — shifts the radial bg
  const glowPositions = [
    { x: '20%', y: '70%' },
    { x: '70%', y: '40%' },
    { x: '50%', y: '80%' },
    { x: '30%', y: '30%' },
    { x: '75%', y: '65%' },
    { x: '50%', y: '50%' },
  ];

  function showStep(newIdx) {
    const steps = section.querySelectorAll('.eq-step');
    const cur = steps[current];
    const next = steps[newIdx];
    if (!next) return;

    // exit current
    if (cur) {
      cur.classList.add('exit-up');
      setTimeout(() => {
        cur.classList.remove('active', 'exit-up');
        cur.style.display = 'none';
      }, 280);
    }

    // enter next
    setTimeout(() => {
      next.style.display = 'flex';
      next.classList.add('enter-down');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          next.classList.add('active');
          next.classList.remove('enter-down');
          const inp = next.querySelector('.eq-input');
          if (inp) inp.focus();
        });
      });
    }, 200);

    current = newIdx;
    updateUI(newIdx);

    // shift glow bg
    const g = glowPositions[newIdx] || glowPositions[0];
    section.querySelector('.eq-inner').style.setProperty('--glow-x', g.x);
    section.querySelector('.eq-inner').style.setProperty('--glow-y', g.y);
  }

  function collectCurrent() {
    const step = section.querySelectorAll('.eq-step')[current];
    if (!step) return '';
    const inp = step.querySelector('.eq-input');
    if (inp) return inp.value.trim();
    const sel = step.querySelector('.eq-option.selected');
    if (sel) return sel.dataset.value || sel.textContent.trim();
    return '';
  }

  function next() {
    const val = collectCurrent();
    // validate required steps
    if ((current === 0 || current === 1) && !val) {
      const inp = section.querySelectorAll('.eq-step')[current].querySelector('.eq-input');
      if (inp) { inp.style.borderBottomColor = '#ef4444'; setTimeout(() => inp.style.borderBottomColor = '', 1200); }
      return;
    }
    answers[current] = val;
    if (current < TOTAL) {
      showStep(current + 1);
    }
  }

  // OK buttons
  section.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', next);
  });

  // Enter key
  section.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const active = section.querySelector('.eq-step.active');
      if (!active) return;
      const isTextarea = document.activeElement.tagName === 'TEXTAREA';
      if (!isTextarea) { e.preventDefault(); next(); }
    }
  });

  // Option buttons (steps 2, 3)
  section.querySelectorAll('.eq-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const parent = opt.closest('.eq-step');
      parent.querySelectorAll('.eq-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      answers[current] = opt.dataset.value || opt.textContent.trim();
      setTimeout(next, 300);
    });
  });

  // ── submit ──
  function buildMessage() {
    const name = answers[0] || 'Not provided';
    const phone = answers[1] || 'Not provided';
    const intent = answers[2] || 'Not specified';
    const budget = answers[3] || 'Not specified';
    const note = answers[4] || '';
    return `Hi, I am ${name}. I am interested in: ${intent}. Budget: ${budget}. ${note ? 'Note: ' + note : ''} My phone: ${phone}`;
  }

  const sendWA = document.getElementById('eq-send-wa');
  const sendEmail = document.getElementById('eq-send-email');

  if (sendWA) {
    sendWA.addEventListener('click', () => {
      const msg = encodeURIComponent(buildMessage());
      window.open(`https://wa.me/919731740060?text=${msg}`, '_blank');
    });
  }
  if (sendEmail) {
    sendEmail.addEventListener('click', () => {
      const body = encodeURIComponent(buildMessage());
      const sub = encodeURIComponent('Property Enquiry from vittubharat.com');
      window.open(`mailto:info@vittubharat.com?subject=${sub}&body=${body}`);
    });
  }

  // init progress
  updateUI(0);
}

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

// ─── Team Marquee (Auto-scroll + Manual drag) ───
function initTeamMarquee() {
  const wrap = document.querySelector('.team-marquee-wrap');
  const track = document.querySelector('.team-marquee');
  if (!wrap || !track) return;

  let isPaused = false;
  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  const speed = 0.8; // px per frame

  function getHalfWidth() {
    return track.scrollWidth / 2;
  }

  function normalizeScroll(val, halfWidth) {
    if (halfWidth <= 0) return val;
    let mod = val % halfWidth;
    if (mod < 0) mod += halfWidth;
    return mod;
  }

  function step() {
    if (!isPaused && !isDown) {
      wrap.scrollLeft += speed;
      const half = getHalfWidth();
      if (half > 0 && wrap.scrollLeft >= half) {
        wrap.scrollLeft -= half;
      }
    }
    requestAnimationFrame(step);
  }

  // Handle manual trackpad/mousewheel/touch scrolling boundary reset
  wrap.addEventListener('scroll', () => {
    if (!isDown) {
      const half = getHalfWidth();
      if (half > 0) {
        if (wrap.scrollLeft >= half) {
          wrap.scrollLeft -= half;
        } else if (wrap.scrollLeft <= 0) {
          wrap.scrollLeft += half;
        }
      }
    }
  });

  // Hover pause
  wrap.addEventListener('mouseenter', () => { isPaused = true; });
  wrap.addEventListener('mouseleave', () => {
    isPaused = false;
    isDown = false;
    wrap.classList.remove('is-grabbing');
  });

  // Mouse Drag
  wrap.addEventListener('mousedown', (e) => {
    isDown = true;
    isPaused = true;
    wrap.classList.add('is-grabbing');
    startX = e.pageX - wrap.offsetLeft;
    startScrollLeft = wrap.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      wrap.classList.remove('is-grabbing');
    }
  });

  wrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    const walk = (x - startX) * 1.4;
    const half = getHalfWidth();
    const targetScroll = startScrollLeft - walk;
    wrap.scrollLeft = normalizeScroll(targetScroll, half);
  });

  // Touch events for mobile drag & pause
  let touchTimeout;
  wrap.addEventListener('touchstart', () => {
    isPaused = true;
    clearTimeout(touchTimeout);
  }, { passive: true });

  wrap.addEventListener('touchend', () => {
    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => { isPaused = false; }, 800);
  }, { passive: true });

  requestAnimationFrame(step);
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
  initContactCTA();
  initFooter();
  initPropertyTicker();
  initEnquiryForm();
  initStatsCountup();
  initServiceModal();
  initHowItWorks();
  initWhyApartAnimations();
  initRevealText();
  initTeamMarquee();
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

// ─── Hero Sound Icon & Audio Player ──────────────────────
function initHeroSound() {
  const btn = document.getElementById('hero-sound-btn');
  const audio = document.getElementById('hero-bg-audio');
  const heroSection = document.getElementById('hero');
  if (!btn || !audio) return;

  let isPlaying = false;

  function playAudio() {
    audio.play().then(() => {
      isPlaying = true;
      btn.classList.remove('muted');
      btn.setAttribute('aria-label', 'Mute');
    }).catch(err => {
      console.log('Audio playback blocked:', err);
    });
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    btn.classList.add('muted');
    btn.setAttribute('aria-label', 'Unmute');
  }

  function toggleAudio() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }

    // Trigger shake animation on the SVG
    btn.classList.remove('shake');
    void btn.offsetWidth; // reflow to restart animation
    btn.classList.add('shake');
    btn.addEventListener('animationend', () => btn.classList.remove('shake'), { once: true });
  }

  // Button click toggle
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudio();
  });

  // Play audio on hero section press or touch
  if (heroSection) {
    const handleHeroInteraction = (e) => {
      if (e.target.closest('a, button')) return;
      if (!isPlaying) {
        playAudio();
      }
    };

    heroSection.addEventListener('click', handleHeroInteraction);
    heroSection.addEventListener('touchstart', handleHeroInteraction, { passive: true });
  }
}

initHeroSound();

// ─── Stats Scramble Counter ────────────────
function initStatsCounter() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('counted');

        const target = parseInt(el.getAttribute('data-target') || 0, 10);
        const suffix = el.getAttribute('data-suffix') || '';

        const duration = 1800; // ms
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // easeOutExpo for buttery smooth deceleration
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

          let currentVal = Math.floor(target * ease);

          // Scramble effect: show some fast random numbers during the early phase
          if (progress < 0.6 && Math.random() > 0.4) {
            currentVal = Math.floor(Math.random() * target);
          }

          el.textContent = currentVal + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNums.forEach(el => observer.observe(el));
}

initStatsCounter();

// ─── Text Roll Hover Effect ────────────────
function initTextRoll() {
  const titles = document.querySelectorAll('.hero-title');

  titles.forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';

    // Split by spaces to handle word-by-word hovering
    const words = text.split(' ');
    const STAGGER = 0.035;

    words.forEach((word, wordIdx) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'text-roll-word';

      const len = word.length;
      for (let i = 0; i < len; i++) {
        const char = word[i];
        const delay = STAGGER * Math.abs(i - (len - 1) / 2);

        const charWrap = document.createElement('span');
        charWrap.className = 'text-roll-char-wrap';

        const span1 = document.createElement('span');
        span1.className = 'text-roll-char';
        span1.textContent = char;
        span1.style.transitionDelay = `${delay}s`;

        const span2 = document.createElement('span');
        span2.className = 'text-roll-char text-roll-char-clone';
        span2.textContent = char;
        span2.style.transitionDelay = `${delay}s`;

        charWrap.appendChild(span1);
        charWrap.appendChild(span2);
        wordWrap.appendChild(charWrap);
      }

      el.appendChild(wordWrap);

      // Add a raw space between words (except after the last word)
      if (wordIdx < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  });
}

initTextRoll();
