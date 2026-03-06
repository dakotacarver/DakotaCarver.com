/* ============================================
   DAKOTA CARVER — PORTFOLIO ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor hover effects
  const hoverTargets = document.querySelectorAll('a, button, .magnetic-btn, .skill-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });

  // Cursor color change per section
  const sections = document.querySelectorAll('[data-cursor-color]');
  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updateCursorColor(section.dataset.cursorColor),
      onEnterBack: () => updateCursorColor(section.dataset.cursorColor),
    });
  });

  function updateCursorColor(color) {
    follower.style.borderColor = color + '80';
  }

  // ============================================
  // MAGNETIC BUTTONS
  // ============================================
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ============================================
  // NAVIGATION SCROLL EFFECT
  // ============================================
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      if (self.scroll() > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, autoKill: false },
          duration: 1.2,
          ease: 'power3.inOut'
        });
      }
    });
  });

  // ============================================
  // HERO ANIMATIONS
  // ============================================
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .from('.title-word', {
      y: 120,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.15,
    })
    .from('.hero-tagline', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .from('.hero-divider', {
      width: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.3')
    .from('.hero-sub', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from('.scroll-indicator', {
      opacity: 0,
      y: 20,
      duration: 0.6,
    }, '-=0.1');

  // ============================================
  // PARTICLE CANVAS (HERO)
  // ============================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ============================================
  // SCROLL-TRIGGERED REVEALS
  // ============================================

  // Reveal text elements
  gsap.utils.toArray('.reveal-text').forEach(el => {
    if (el.closest('.hero-content') || el.closest('.scroll-indicator')) return; // Skip hero (handled above)
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Reveal up elements
  gsap.utils.toArray('.reveal-up').forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ============================================
  // ECDYSIS — PARALLAX SHAPES
  // ============================================
  const ecdysisSection = document.getElementById('ecdysis');
  if (ecdysisSection) {
    gsap.utils.toArray('#ecdysis-parallax .parallax-shape').forEach((shape, i) => {
      const speed = (i + 1) * 30;
      gsap.to(shape, {
        y: -speed,
        scrollTrigger: {
          trigger: ecdysisSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    // Mouse-reactive parallax
    ecdysisSection.addEventListener('mousemove', (e) => {
      const shapes = ecdysisSection.querySelectorAll('.parallax-shape');
      const rect = ecdysisSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      shapes.forEach((shape, i) => {
        const factor = (i + 1) * 15;
        gsap.to(shape, {
          x: x * factor,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    });
  }

  // ============================================
  // SOIL REVIVAL — FLOATING LEAF PARTICLES
  // ============================================
  const soilSection = document.getElementById('soil');
  const soilParticlesContainer = document.getElementById('soil-particles');
  if (soilSection && soilParticlesContainer) {
    for (let i = 0; i < 15; i++) {
      const leaf = document.createElement('div');
      leaf.style.cssText = `
        position: absolute;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${['#4a7c28', '#6b8f3c', '#8fbc5a', '#d4a96a'][Math.floor(Math.random() * 4)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '50% 0'};
        opacity: ${Math.random() * 0.3 + 0.1};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      soilParticlesContainer.appendChild(leaf);

      gsap.to(leaf, {
        y: `random(-80, 80)`,
        x: `random(-40, 40)`,
        rotation: `random(-180, 180)`,
        duration: `random(6, 12)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
    }
  }

  // ============================================
  // CARVR — ANIMATED BACKGROUND SHAPES
  // ============================================
  const carvrShapes = document.querySelectorAll('.carvr-shape');
  carvrShapes.forEach((shape, i) => {
    gsap.to(shape, {
      x: `random(-50, 50)`,
      y: `random(-50, 50)`,
      scale: `random(0.8, 1.3)`,
      duration: `random(4, 8)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.5,
    });
  });

  // CARVR section — mouse ripple effect
  const carvrSection = document.getElementById('carvr');
  if (carvrSection) {
    carvrSection.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      const rect = carvrSection.getBoundingClientRect();
      ripple.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,107,107,0.3), rgba(155,89,182,0.1), transparent);
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 0;
      `;
      carvrSection.appendChild(ripple);

      gsap.to(ripple, {
        width: 400,
        height: 400,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      });
    });
  }

  // ============================================
  // SKILL CARDS — TILT EFFECT
  // ============================================
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 600,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.8)',
      });
    });
  });

  // ============================================
  // SECTION TRANSITION — BG COLOR BLEND
  // ============================================
  const sectionBgs = [
    { trigger: '#about', bg: '#111111' },
    { trigger: '#ecdysis', bg: '#0a0a0a' },
    { trigger: '#soil', bg: '#1a1208' },
    { trigger: '#carvr', bg: '#0f0a1a' },
  ];

  sectionBgs.forEach(({ trigger, bg }) => {
    ScrollTrigger.create({
      trigger: trigger,
      start: 'top 80%',
      onEnter: () => gsap.to('body', { backgroundColor: bg, duration: 0.6 }),
      onEnterBack: () => gsap.to('body', { backgroundColor: bg, duration: 0.6 }),
    });
  });

  // Reset to hero bg
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 50%',
    onEnterBack: () => gsap.to('body', { backgroundColor: '#0a0a0a', duration: 0.6 }),
  });

  // ============================================
  // HIGHLIGHT ITEMS — STAGGERED REVEAL
  // ============================================
  gsap.utils.toArray('.business-highlights').forEach(container => {
    const items = container.querySelectorAll('.highlight-item');
    gsap.fromTo(items,
      { x: 30, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
});
