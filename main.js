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
  const sliderEl = document.querySelector('.instr-slider');
  if (!slides.length) return;
  let current = 0;
  let autoTimer = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  document.querySelectorAll('.instr-prev').forEach(btn => {
    btn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  });
  document.querySelectorAll('.instr-next').forEach(btn => {
    btn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  });

  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', stopAuto);
    sliderEl.addEventListener('mouseleave', startAuto);
  }

  startAuto();
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
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const cols = footer.querySelectorAll('.footer-links-col, .footer-brand-col');
  const wordmark = document.getElementById('footer-wordmark');
  const copy = footer.querySelector('.footer-copy');

  if (typeof gsap !== 'undefined') {
    // ── Stagger reveal cols ──
    if (cols.length && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(cols,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }
}

// ─── How It Works ────────────────────────
function initHowItWorks() {
  const section = document.querySelector('.section-how');
  const wrap = document.querySelector('.how-track-wrap');
  const track = document.querySelector('.how-track');
  const steps = document.querySelectorAll('.how-step');
  const hint = document.getElementById('how-drag-hint');
  if (!section || !wrap || !track || !steps.length) return;

  // Make steps visible and active for smooth horizontal scroll
  steps.forEach(s => {
    s.style.opacity = '1';
    s.style.transform = 'none';
    s.classList.add('in-view');
  });

  function getScrollAmount() {
    return Math.max(0, track.scrollWidth - wrap.clientWidth);
  }

  // Pin section and scroll track horizontally driven by vertical page scroll
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const scrollAmount = getScrollAmount();
    if (scrollAmount > 0) {
      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });
    }
  }

  // Drag to scroll fallback
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

  let currentIdx = -1;
  function switchHeader(idx) {
    if (idx === currentIdx || (!headline && !progressNum)) return;
    currentIdx = idx;

    // update active class on rows
    rows.forEach((r, i) => r.classList.toggle('active', i === idx));

    const tl = gsap.timeline();
    // exit: slide up + fade
    tl.to([headline, progressNum].filter(Boolean), {
      y: -14, opacity: 0, duration: 0.18, ease: 'power2.in', stagger: 0.03
    });
    tl.call(() => {
      if (progressNum) progressNum.textContent = `${String(idx + 1).padStart(2, '0')} / 05`;
      if (headline) headline.innerHTML = headlineTexts[idx].replace(/\n/g, '<br>');
    });
    // enter: slide up from below + fade
    tl.fromTo([headline, progressNum].filter(Boolean),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out', stagger: 0.04 }
    );
  }

  // ── ScrollTrigger + Hover per row ──
  rows.forEach((row, idx) => {
    row.addEventListener('mouseenter', () => switchHeader(idx));

    ScrollTrigger.create({
      trigger: row,
      start: 'top 52%',
      end: 'bottom 52%',
      onEnter: () => switchHeader(idx),
      onEnterBack: () => switchHeader(idx),
    });
  });

  // Animate header into view without transform (prevents breaking position: sticky)
  const header = document.getElementById('why-header');
  if (header) {
    gsap.from(header, {
      opacity: 0,
      duration: 0.8, ease: 'power3.out',
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

  // Each row: fade+translate in cleanly, then SVG path draws
  rows.forEach((row, idx) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    // Row slides up + fades in from opacity 0
    tl.fromTo(row,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: idx * 0.03 }
    );

    // SVG paths draw in after row appears
    const paths = row.querySelectorAll('.why-svg-path');
    if (paths.length) {
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

  setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 100);
}

// ─── Services Ultra-Simple GSAP Accordion ────
// ─── Services Ultra-Smooth GSAP Accordion ────
function initServiceModal() {
  const items = document.querySelectorAll('.svc-acc-item');
  if (!items.length) return;

  let hoverTimer = null;

  function closeItem(item) {
    if (!item.classList.contains('active')) return;
    item.classList.remove('active');

    const header = item.querySelector('.svc-acc-header');
    const body = item.querySelector('.svc-acc-body');
    const icon = item.querySelector('.svc-plus-icon');

    if (header) header.setAttribute('aria-expanded', 'false');

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(body);
      gsap.killTweensOf(icon);

      gsap.to(body, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          body.style.display = 'none';
        }
      });

      if (icon) gsap.to(icon, { rotate: 0, duration: 0.5, ease: 'power3.inOut' });
    } else {
      body.style.display = 'none';
    }
  }

  function openItem(targetItem) {
    items.forEach(item => {
      const isTarget = item === targetItem;
      const header = item.querySelector('.svc-acc-header');
      const body = item.querySelector('.svc-acc-body');
      const icon = item.querySelector('.svc-plus-icon');
      const img = item.querySelector('.svc-acc-img img');
      const desc = item.querySelector('.svc-acc-desc');
      const btn = item.querySelector('.svc-acc-btn');

      if (isTarget) {
        if (!item.classList.contains('active')) {
          item.classList.add('active');
          if (header) header.setAttribute('aria-expanded', 'true');

          if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(body);
            gsap.killTweensOf(icon);

            body.style.display = 'block';
            body.style.height = 'auto';
            body.style.opacity = '0';
            const naturalH = body.offsetHeight;
            body.style.height = '0px';

            // Ultra-smooth opening height & opacity
            gsap.to(body, {
              height: naturalH,
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
              onComplete: () => { body.style.height = 'auto'; }
            });

            // Smooth plus icon rotation
            if (icon) gsap.to(icon, { rotate: 45, duration: 0.6, ease: 'power3.out' });

            // Silky smooth image zoom & reveal
            if (img) gsap.fromTo(img, { scale: 1.08, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' });

            // Staggered text & button slide up
            if (desc) gsap.fromTo(desc, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.15, ease: 'power3.out' });
            if (btn) gsap.fromTo(btn, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.25, ease: 'power3.out' });
          } else {
            body.style.display = 'block';
          }
        }
      } else {
        closeItem(item);
      }
    });
  }

  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  items.forEach(item => {
    const header = item.querySelector('.svc-acc-header');
    if (!header) return;

    if (!isTouch) {
      item.addEventListener('mouseenter', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          openItem(item);
        }, 80);
      });

      item.addEventListener('mouseleave', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
      });
    }

    header.addEventListener('click', (e) => {
      e.preventDefault();
      if (hoverTimer) clearTimeout(hoverTimer);
      const isOpen = item.classList.contains('active');
      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
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
  const callBtn = document.getElementById('cta-call-btn');

  // ── set initial states ──
  gsap.set(lines, { yPercent: 110 });         // below clip
  gsap.set([sub, address].filter(Boolean), { opacity: 0, y: 16 });
  gsap.set([waBtn, callBtn, enquire].filter(Boolean), { opacity: 0, y: 12 });
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
  [waBtn, callBtn, enquire].filter(Boolean).forEach((el, i) => {
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
      window.open(`https://wa.me/919380939961?text=${msg}`, '_blank');
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

  // Button click navigation for prev / next arrows
  const prevBtns = document.querySelectorAll('.team-prev-btn, #team-prev-hdr');
  const nextBtns = document.querySelectorAll('.team-next-btn, #team-next-hdr');

  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isPaused = true;
      const card = track.querySelector('.team-card');
      const stepDist = card ? (card.offsetWidth + 20) : 380;
      const target = wrap.scrollLeft - stepDist;
      if (typeof gsap !== 'undefined') {
        gsap.to(wrap, { scrollLeft: target, duration: 0.45, ease: 'power2.out' });
      } else {
        wrap.scrollBy({ left: -stepDist, behavior: 'smooth' });
      }
      setTimeout(() => { isPaused = false; }, 1200);
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isPaused = true;
      const card = track.querySelector('.team-card');
      const stepDist = card ? (card.offsetWidth + 20) : 380;
      const target = wrap.scrollLeft + stepDist;
      if (typeof gsap !== 'undefined') {
        gsap.to(wrap, { scrollLeft: target, duration: 0.45, ease: 'power2.out' });
      } else {
        wrap.scrollBy({ left: stepDist, behavior: 'smooth' });
      }
      setTimeout(() => { isPaused = false; }, 1200);
    });
  });

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

// ─── Why Us Mobile Stack Cards Animation ────
function initWhyMobileStack() {
  const container = document.getElementById('why-list');
  if (!container) return;

  const rows = Array.from(container.querySelectorAll('[data-why-row]'));
  if (rows.length < 2) return;

  let activeIndex = 0;
  let autoTimer = null;
  let isSwiping = false;
  let startX = 0;
  let currentX = 0;
  let isAnimating = false;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function updateStack(animate = true) {
    if (!isMobile()) {
      rows.forEach(row => {
        row.style.transform = '';
        row.style.opacity = '';
        row.style.zIndex = '';
        row.style.pointerEvents = '';
      });
      return;
    }

    const total = rows.length;
    rows.forEach((row, i) => {
      let relIndex = (i - activeIndex + total) % total;

      let zIndex = total - relIndex;
      let scale = Math.max(0.8, 1 - relIndex * 0.05);
      let translateY = relIndex * 12;
      let rotate = relIndex === 1 ? -3 : relIndex === 2 ? 3 : 0;
      let opacity = relIndex <= 2 ? 1 : 0;
      let pointerEvents = relIndex === 0 ? 'auto' : 'none';

      row.style.zIndex = zIndex;
      row.style.pointerEvents = pointerEvents;

      if (typeof gsap !== 'undefined' && animate) {
        gsap.to(row, {
          x: 0,
          y: translateY,
          scale: scale,
          rotate: rotate,
          opacity: opacity,
          duration: 0.5,
          ease: 'power2.out'
        });
      } else {
        row.style.transform = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(${rotate}deg)`;
        row.style.opacity = opacity;
      }
    });
  }

  function nextCard(direction = -1) {
    if (!isMobile() || isAnimating) return;
    isAnimating = true;

    const currentCard = rows[activeIndex];
    const nextIndex = (activeIndex + 1) % rows.length;

    if (typeof gsap !== 'undefined') {
      const exitX = direction * (window.innerWidth * 0.9);
      const exitRot = direction * 18;

      gsap.to(currentCard, {
        x: exitX,
        rotate: exitRot,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          activeIndex = nextIndex;
          updateStack(true);
          setTimeout(() => { isAnimating = false; }, 150);
        }
      });
    } else {
      activeIndex = nextIndex;
      updateStack(false);
      isAnimating = false;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (!isMobile()) return;
    autoTimer = setInterval(() => {
      nextCard(-1);
    }, 4000);
  }

  function stopAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
  }

  container.addEventListener('touchstart', (e) => {
    if (!isMobile()) return;
    stopAutoPlay();
    startX = e.touches[0].clientX;
    currentX = startX;
    isSwiping = true;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isSwiping || !isMobile() || isAnimating) return;
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    const currentCard = rows[activeIndex];
    const rot = (deltaX / window.innerWidth) * 22;

    if (currentCard && typeof gsap !== 'undefined') {
      gsap.set(currentCard, {
        x: deltaX,
        rotate: rot
      });
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    if (!isSwiping || !isMobile() || isAnimating) return;
    isSwiping = false;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 50) {
      nextCard(deltaX < 0 ? -1 : 1);
    } else {
      const currentCard = rows[activeIndex];
      if (currentCard && typeof gsap !== 'undefined') {
        gsap.to(currentCard, {
          x: 0,
          rotate: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
    startAutoPlay();
  });

  window.addEventListener('resize', () => {
    updateStack(false);
    if (isMobile()) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  });

  updateStack(false);
  if (isMobile()) startAutoPlay();
}

initWhyMobileStack();


/* ── Friendly enquiry CTA — sends to WhatsApp ── */
function initFriendlyEnquiry() {
  document.querySelectorAll('.fq-form').forEach(function (form) {
    const err = form.querySelector('.fq-error');

    function fail(msg, field) {
      if (err) {
        err.textContent = msg;
        err.hidden = false;
      }
      if (field) field.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (err) err.hidden = true;

      const nameEl = form.querySelector('[name="name"]');
      const phoneEl = form.querySelector('[name="phone"]');
      const needEl = form.querySelector('[name="need"]');
      const noteEl = form.querySelector('[name="note"]');

      const name = nameEl.value.trim();
      const phone = phoneEl.value.trim();

      if (!name) return fail('Please tell us your name so we know who we are speaking to.', nameEl);

      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) return fail('Please enter a phone number we can reach you on.', phoneEl);

      const note = noteEl && noteEl.value.trim();
      const msg =
        'Hi, I am ' + name + '. ' +
        'I need help with: ' + needEl.value + '. ' +
        (note ? note + '. ' : '') +
        'My number is ' + phone + '.';

      window.open('https://wa.me/919380939961?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  });
}

initFriendlyEnquiry();
