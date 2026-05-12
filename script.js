/* ============================================
   TOYZ — main.js
   Animações premium sem dependências externas
   ============================================ */

/* ─── 1. NAVBAR DINÂMICA ─────────────────────── */
(function () {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }, { passive: true });
})();


/* ─── 2. SCROLL REVEAL (Intersection Observer) ── */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((el) => observer.observe(el));
})();


/* ─── 3. STAGGERED CARD REVEAL ───────────────── */
(function () {
  const groups = document.querySelectorAll('[data-stagger]');
  if (!groups.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('[data-stagger-item]');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('revealed');
          }, i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  groups.forEach((g) => observer.observe(g));
})();


/* ─── 4. PARTÍCULAS FLUTUANTES NO HERO ──────── */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -Math.random() * 0.4 - 0.1;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
  };

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.pulse += 0.015;
      const a = p.alpha + Math.sin(p.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,197,94,${Math.max(0, a)})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -4 || p.x < -4 || p.x > W + 4) p.reset();
    });
    raf = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
})();


/* ─── 5. GLOW ANIMADO ATRÁS DO DASHBOARD ────── */
(function () {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  const wrap = heroImg.closest('.col-lg-6.text-center') || heroImg.parentElement;
  wrap.style.position = 'relative';

  const glow = document.createElement('div');
  glow.className = 'hero-glow';
  wrap.insertBefore(glow, heroImg);
})();


/* ─── 6. CONTADOR ANIMADO ────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
})();


/* ─── 7. MAGNETIC HOVER NO BOTÃO PRINCIPAL ───── */
(function () {
  const btns = document.querySelectorAll('.btn-primary-custom');

  btns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ─── 8. EFEITO TYPING NA HERO TITLE ─────────── */
(function () {
  const span = document.querySelector('.hero-title span');
  if (!span) return;

  const words = [
    'muito mais controle',
    'máxima eficiência',
    'zero planilha',
    'crescimento real',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let paused = false;

  function type() {
    const current = words[wordIndex];

    if (!deleting) {
      span.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        paused = true;
        setTimeout(() => { paused = false; }, 2200);
      }
    } else {
      span.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    if (!paused) {
      const speed = deleting ? 42 : 68;
      setTimeout(type, speed);
    } else {
      setTimeout(type, 100);
    }
  }

  setTimeout(type, 900);
})();


/* ─── 9. FEATURE CARDS — ACTIVE HIGHLIGHT ───── */
(function () {
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach((c) => c.classList.remove('feature-card--active'));
      card.classList.add('feature-card--active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('feature-card--active');
    });
  });
})();


/* ─── 10. SMOOTH ACTIVE NAV LINK ─────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove('nav-link--active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('nav-link--active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach((s) => observer.observe(s));
})();


/* ─── 11. RIPPLE NO BOTÃO CTA ────────────────── */
(function () {
  document.querySelectorAll('.btn-primary-custom').forEach((btn) => {
    btn.style.overflow = 'hidden';
    btn.style.position = 'relative';

    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.offsetWidth, btn.offsetHeight);
      const rect = btn.getBoundingClientRect();

      circle.style.cssText = `
        position: absolute;
        width: ${diameter}px;
        height: ${diameter}px;
        top: ${e.clientY - rect.top - diameter / 2}px;
        left: ${e.clientX - rect.left - diameter / 2}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.55s ease-out forwards;
        pointer-events: none;
      `;

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
})();


/* ─── 12. FLOAT ANIMATION — SMARTPHONE ──────── */
(function () {
  const phone = document.querySelector('.phone-img');
  if (!phone) return;
  phone.classList.add('float-phone');
})();


/* ─── INJETAR KEYFRAMES DINÂMICOS ────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();