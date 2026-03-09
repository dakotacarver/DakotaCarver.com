/* ============================================
   DAKOTA CARVER — RESUME SITE ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08 });
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, .skill-category, .venture-card, .edu-card, .timeline-content, .contact-big-link').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
  });

  document.querySelectorAll('[data-cursor-color]').forEach(section => {
    ScrollTrigger.create({
      trigger: section, start: 'top center', end: 'bottom center',
      onEnter: () => follower.style.borderColor = section.dataset.cursorColor + '80',
      onEnterBack: () => follower.style.borderColor = section.dataset.cursorColor + '80',
    });
  });

  // ============================================
  // MAGNETIC BUTTONS
  // ============================================
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    });
  });

  // ============================================
  // NAV SCROLL EFFECT
  // ============================================
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 80),
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) gsap.to(window, { scrollTo: { y: target, autoKill: false }, duration: 1.2, ease: 'power3.inOut' });
    });
  });

  // ============================================
  // HERO ANIMATION
  // ============================================
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .from('.title-word', { y: 130, opacity: 0, duration: 1.2, ease: 'power4.out', stagger: 0.15 })
    .to('.hero-eyebrow',  { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.6')
    .from('.hero-tagline', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('.hero-divider', { width: 0, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('.hero-sub',     { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
    .from('.hero-cta-row', { y: 20, opacity: 0, duration: 0.5 }, '-=0.1')
    .from('.scroll-indicator', { opacity: 0, y: 20, duration: 0.5 }, '-=0.1');

  // ============================================
  // PARTICLE CANVAS
  // ============================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      const dx = mouseX - this.x, dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) { this.x -= dx * 0.01; this.y -= dy * 0.01; }
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
      ctx.fill();
    }
  }

  const pCount = Math.min(90, Math.floor(window.innerWidth / 14));
  for (let i = 0; i < pCount; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${0.07 * (1 - d / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  (function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
  })();

  // ============================================
  // SKILLS BG — ANIMATED BLOBS
  // ============================================
  const skillsBg = document.getElementById('skills-bg');
  if (skillsBg) {
    const blobColors = ['#5c6af7', '#a05cf7', '#00f0ff'];
    blobColors.forEach((color, i) => {
      const blob = document.createElement('div');
      blob.style.cssText = `
        position:absolute; border-radius:50%; opacity:0.06; filter:blur(80px);
        width:${350 + i * 80}px; height:${350 + i * 80}px;
        background:${color};
        left:${[10, 50, 70][i]}%; top:${[20, 60, 10][i]}%;
        transform: translate(-50%,-50%);
      `;
      skillsBg.appendChild(blob);
      gsap.to(blob, {
        x: `random(-80,80)`, y: `random(-80,80)`,
        duration: `random(6,10)`, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: i * 1.5,
      });
    });
  }

  // ============================================
  // SCROLL REVEALS
  // ============================================
  gsap.utils.toArray('.reveal-text').forEach(el => {
    if (el.closest('.hero-content') || el.closest('.scroll-indicator')) return;
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
      }
    );
  });

  gsap.utils.toArray('.reveal-up').forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // ============================================
  // TIMELINE — GLOW ON SCROLL
  // ============================================
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // Timeline line fill animation
  const timelineLine = document.querySelector('.timeline::before');
  // Animate dots as they enter view
  gsap.utils.toArray('.timeline-dot').forEach(dot => {
    ScrollTrigger.create({
      trigger: dot, start: 'top 85%',
      onEnter: () => gsap.to(dot, { scale: 1.5, duration: 0.3, ease: 'back.out(3)', yoyo: true, repeat: 1 }),
    });
  });

  // ============================================
  // VENTURES PARALLAX
  // ============================================
  const venturesSection = document.getElementById('ventures');
  if (venturesSection) {
    gsap.utils.toArray('#ecdysis-parallax .parallax-shape').forEach((shape, i) => {
      gsap.to(shape, {
        y: -(i + 1) * 40,
        scrollTrigger: { trigger: venturesSection, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });
    venturesSection.addEventListener('mousemove', (e) => {
      const shapes = venturesSection.querySelectorAll('.parallax-shape');
      const rect = venturesSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      shapes.forEach((shape, i) => {
        gsap.to(shape, { x: x * (i + 1) * 20, duration: 0.8, ease: 'power2.out' });
      });
    });
  }

  // ============================================
  // VENTURE CARDS — TILT
  // ============================================
  document.querySelectorAll('.venture-card, .skill-category, .edu-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.3, ease: 'power2.out', transformPerspective: 800 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.8)' });
    });
  });

  // ============================================
  // CONTACT SECTION — RIPPLE ON CLICK
  // ============================================
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      const ripple = document.createElement('div');
      const rect = contactSection.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute; width:0; height:0; border-radius:50%;
        background: radial-gradient(circle, rgba(255,107,107,0.25), rgba(155,89,182,0.08), transparent);
        left:${e.clientX - rect.left}px; top:${e.clientY - rect.top}px;
        transform:translate(-50%,-50%); pointer-events:none; z-index:0;
      `;
      contactSection.appendChild(ripple);
      gsap.to(ripple, { width: 500, height: 500, opacity: 0, duration: 1.2, ease: 'power2.out', onComplete: () => ripple.remove() });
    });
  }

  // ============================================
  // ANIMATED BG SHAPES (contact reuse)
  // ============================================
  document.querySelectorAll('.carvr-shape').forEach((shape, i) => {
    gsap.to(shape, {
      x: `random(-60,60)`, y: `random(-60,60)`,
      scale: `random(0.8,1.4)`,
      duration: `random(5,9)`, repeat: -1, yoyo: true,
      ease: 'sine.inOut', delay: i * 0.6,
    });
  });

  // ============================================
  // EDU SHAPE FLOAT
  // ============================================
  document.querySelectorAll('.edu-shape').forEach((shape, i) => {
    gsap.to(shape, {
      x: `random(-40,40)`, y: `random(-40,40)`,
      duration: `random(7,12)`, repeat: -1, yoyo: true,
      ease: 'sine.inOut', delay: i * 2,
    });
  });

  // ============================================
  // TAG STAGGER ANIMATION
  // ============================================
  gsap.utils.toArray('.skill-category').forEach(cat => {
    const tags = cat.querySelectorAll('.tag');
    gsap.fromTo(tags,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: cat, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  // ============================================
  // BG COLOR TRANSITIONS
  // ============================================
  [
    { trigger: '#about',     bg: '#111111' },
    { trigger: '#skills',    bg: '#0d0d0d' },
    { trigger: '#experience',bg: '#111111' },
    { trigger: '#ventures',  bg: '#0a0a0a' },
    { trigger: '#education', bg: '#0e0e0e' },
    { trigger: '#contact',   bg: '#0f0a1a' },
  ].forEach(({ trigger, bg }) => {
    ScrollTrigger.create({
      trigger, start: 'top 80%',
      onEnter:     () => gsap.to('body', { backgroundColor: bg, duration: 0.6 }),
      onEnterBack: () => gsap.to('body', { backgroundColor: bg, duration: 0.6 }),
    });
  });

  ScrollTrigger.create({
    trigger: '#hero', start: 'top 50%',
    onEnterBack: () => gsap.to('body', { backgroundColor: '#0a0a0a', duration: 0.6 }),
  });

  // ============================================
  // HIGHLIGHT STAGGER
  // ============================================
  gsap.utils.toArray('.ref-card').forEach((card, i) => {
    gsap.fromTo(card,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // ============================================
  // CONTACT LINKS SLIDE IN
  // ============================================
  gsap.utils.toArray('.contact-big-link').forEach((link, i) => {
    gsap.fromTo(link,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: link, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

});
