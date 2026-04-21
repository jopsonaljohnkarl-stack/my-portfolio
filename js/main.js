// ─────────────────────────────────────────────────────────────
//  MAIN — core app logic
//  Covers: icons, avatar, cursor, particle canvas, navbar,
//          active nav link, mobile menu, scroll reveals,
//          smooth scroll, process beam, ring cursor, page loader
// ─────────────────────────────────────────────────────────────

lucide.createIcons();

// Hide avatar fallback text once photo loads
(function() {
  const img = document.querySelector('.hero-avatar-inner img');
  const fb  = document.getElementById('avatarFallback');
  if (!img || !fb) return;
  if (img.complete && img.naturalWidth > 0) { fb.style.display = 'none'; }
  else { img.addEventListener('load', function() { fb.style.display = 'none'; }); }
})();

// ── Crystalline Physics-Based Cursor ──
(function() {
  const core = document.getElementById('cursorCore');
  const crystal = document.getElementById('cursorCrystal');
  if (!core || !crystal) return;

  if (!window.matchMedia('(pointer: fine)').matches) {
    core.style.display = 'none';
    return;
  }

  const crystallineSVG = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(12, 12)">
        <polygon points="0,-10 8.66,-5 5,-8.66 10,0 5,8.66 8.66,5 0,10 -8.66,5 -5,8.66 -10,0 -5,-8.66 -8.66,-5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
        <polygon points="0,-6 5.2,-3 3,-5.2 6,0 3,5.2 5.2,3 0,6 -5.2,3 -3,5.2 -6,0 -3,-5.2 -5.2,-3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6"/>
        <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.9"/>
        <line x1="-3" y1="-3" x2="2" y2="2" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
      </g>
    </svg>
  `;
  crystal.innerHTML = crystallineSVG;
  crystal.style.color = 'var(--accent)';

  let mx = 0, my = 0, cx = 0, cy = 0, vx = 0, vy = 0, ax = 0, ay = 0;
  let rotation = 0, isHovering = false, lastFragmentTime = 0, raf;
  const friction = 0.97, acceleration = 0.35, maxVelocity = 16;

  cx = window.innerWidth / 2;
  cy = window.innerHeight / 2;
  core.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(animate);
  });

  function animate() {
    const dx = mx - cx, dy = my - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0.5) {
      ax = (dx / distance) * acceleration;
      ay = (dy / distance) * acceleration;
    } else {
      ax *= friction; ay *= friction;
    }
    vx = (vx + ax) * friction;
    vy = (vy + ay) * friction;
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > maxVelocity) { vx = (vx / speed) * maxVelocity; vy = (vy / speed) * maxVelocity; }
    cx += vx; cy += vy;
    rotation += speed * 2;
    core.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${rotation}deg)`;
    const currentTime = Date.now();
    if (isHovering && speed > 1.5 && currentTime - lastFragmentTime > 100) {
      createFragment(cx, cy, vx, vy);
      lastFragmentTime = currentTime;
    }
    if (speed > 0.5) createTrail(cx, cy, vx, vy);
    raf = requestAnimationFrame(animate);
  }

  function createFragment(x, y, vx, vy) {
    const fragment = document.createElement('div');
    fragment.className = 'cursor-fragment';
    fragment.style.color = 'var(--accent)';
    fragment.innerHTML = `<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" width="8" height="8"><polygon points="6,0 10,6 6,10 2,6" fill="currentColor" opacity="0.7"/><circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.4"/></svg>`;
    document.body.appendChild(fragment);
    const angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * Math.PI * 0.5;
    const spd = Math.sqrt(vx * vx + vy * vy) * (0.5 + Math.random() * 0.5);
    const fvx = Math.cos(angle) * spd, fvy = Math.sin(angle) * spd;
    const startTime = Date.now(), duration = 800;
    (function updateFragment() {
      const elapsed = Date.now() - startTime, progress = elapsed / duration;
      if (progress >= 1) { fragment.remove(); return; }
      const fx = x + fvx * elapsed * 0.2 - elapsed * elapsed * 0.0002;
      const fy = y + fvy * elapsed * 0.2 + elapsed * elapsed * 0.0001;
      fragment.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%) rotate(${progress * 360}deg) scale(${1 - progress * 0.5})`;
      fragment.style.opacity = (1 - progress) * 0.6;
      requestAnimationFrame(updateFragment);
    })();
  }

  function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = 'width:3px;height:3px;border-radius:50%;background:var(--accent);box-shadow:0 0 4px rgba(79,140,255,0.6);';
    document.body.appendChild(trail);
    const startTime = Date.now(), duration = 400;
    (function updateTrail() {
      const elapsed = Date.now() - startTime, progress = elapsed / duration;
      if (progress >= 1) { trail.remove(); return; }
      trail.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${1 - progress * 0.6})`;
      trail.style.opacity = (1 - progress) * 0.4;
      requestAnimationFrame(updateTrail);
    })();
  }

  const interactables = 'a, button, [role="button"], input, textarea, select, label, .tool-item, .service-card, .cf-card, .contact-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactables)) { isHovering = true; core.classList.add('hovering'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactables)) { isHovering = false; core.classList.remove('hovering'); }
  });
  document.addEventListener('mouseleave', () => { core.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { core.style.opacity = '1'; });
})();

// ── Particle Network Canvas ──
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -999, y: -999 };
  const COUNT = 90, CONNECT_DIST = 140, MOUSE_DIST = 120, SPEED = 0.35;

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  function mkParticle() {
    const hues = [260, 240, 220, 280, 200];
    const hue = hues[Math.floor(Math.random() * hues.length)];
    return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED, r: Math.random() * 1.8 + 0.8, hue, alpha: Math.random() * 0.5 + 0.3 };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(108,61,232,0.04)'; ctx.lineWidth = 1;
    const gSize = 48;
    for (let x = 0; x < W; x += gSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += gSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.8;
        p.vx += (dx / dist) * force * 0.06;
        p.vy += (dy / dist) * force * 0.06;
      }
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > SPEED * 2.5) { p.vx *= SPEED * 2.5 / speed; p.vy *= SPEED * 2.5 / speed; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `hsla(${p.hue}, 80%, 75%, ${p.alpha})`);
      grad.addColorStop(1, `hsla(${p.hue}, 80%, 75%, 0)`);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${p.alpha + 0.2})`; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x, ey = p.y - q.y, ed = Math.sqrt(ex * ex + ey * ey);
        if (ed < CONNECT_DIST) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 70%, 70%, ${(1 - ed / CONNECT_DIST) * 0.35})`;
          ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  const hero = canvas.closest('.hero');
  hero.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
  window.addEventListener('resize', () => { resize(); }, { passive: true });

  resize();
  particles = Array.from({ length: COUNT }, mkParticle);
  draw();
})();

// ── Navbar ──
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const heroSection = document.querySelector('.hero');
const heroGlow1 = document.querySelector('.hero-glow-1');
const heroGlow2 = document.querySelector('.hero-glow-2');
const aboutPhotoCard = document.querySelector('.about-photo-card');

function updateNavbar() {
  const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
  const scrolled = window.scrollY > 20;
  navbar.classList.toggle('scrolled', scrolled && heroBottom <= 80);
  navbar.classList.toggle('on-dark', heroBottom > 80);
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (window.scrollY / windowHeight) * 100 + '%';
  if (heroGlow1 && window.scrollY < window.innerHeight) heroGlow1.style.transform = `translateY(${window.scrollY * 0.5}px)`;
  if (heroGlow2 && window.scrollY < window.innerHeight) heroGlow2.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  if (aboutPhotoCard) {
    const rect = aboutPhotoCard.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      aboutPhotoCard.style.transform = `translateY(${(window.innerHeight - rect.top) * 0.1}px)`;
    }
  }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ── Active nav link on scroll ──
(function() {
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sectionIds = Array.prototype.map.call(navLinks, function(a) { return a.getAttribute('href').slice(1); });
  var sections = sectionIds.map(function(id) { return document.getElementById(id); }).filter(Boolean);
  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function(a) { a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id); });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function(s) { sectionObserver.observe(s); });
})();

// ── Mobile menu ──
// These functions are global so HTML onclick attributes can call them
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mobileClose.focus();
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  menuBtn.focus();
}

menuBtn.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
});

// ── Scroll Reveal ──
const reveals = document.querySelectorAll('.reveal');
const observerOptions = { threshold: [0, 0.05, 0.1, 0.15, 0.2] };

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.proof-value').forEach(el => el.classList.add('animate'));
      entry.target.querySelectorAll('.service-card').forEach(el => el.classList.add('animate'));
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

reveals.forEach(el => revealObserver.observe(el));

const proofObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
      entry.target.classList.add('animate');
      proofObserver.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll('.proof-value').forEach(el => proofObserver.observe(el));

const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);
document.querySelectorAll('.service-card').forEach(el => cardObserver.observe(el));

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Process Beam ──
(function() {
  var beam    = document.getElementById('processBeam');
  var stepsEl = document.getElementById('processSteps');
  var trackEl = stepsEl && stepsEl.querySelector('.process-beam-track');
  if (!beam || !stepsEl || !trackEl) return;

  var nums = Array.prototype.slice.call(stepsEl.querySelectorAll('.process-num'));
  var DURATION = 3400, PAUSE = 700, BEAM_W = 80;
  var started = false, startTime = null, popped = [], rafId = null;

  function measureCircles() {
    var trackRect = trackEl.getBoundingClientRect();
    return nums.map(function(num) {
      var r = num.getBoundingClientRect();
      return (r.left + r.width / 2) - trackRect.left;
    });
  }

  function popStep(i) {
    if (!nums[i]) return;
    nums[i].classList.remove('popping');
    void nums[i].offsetWidth;
    nums[i].classList.add('popping');
  }

  function resetPopped() {
    popped = [];
    for (var i = 0; i < nums.length; i++) popped[i] = false;
  }

  var circlePx = null;

  function frame(ts) {
    if (!startTime) { startTime = ts; circlePx = measureCircles(); }
    var progress = Math.min((ts - startTime) / DURATION, 1);
    var trackW = trackEl.offsetWidth;
    var beamLeft = -BEAM_W + progress * (trackW + BEAM_W);
    var beamCenter = beamLeft + BEAM_W / 2;
    beam.style.left = beamLeft + 'px';
    var alpha = progress < 0.05 ? progress / 0.05 : progress > 0.92 ? (1 - progress) / 0.08 : 1;
    beam.style.opacity = alpha;
    for (var i = 0; i < circlePx.length; i++) {
      if (!popped[i] && beamCenter >= circlePx[i]) { popped[i] = true; popStep(i); }
    }
    if (progress < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      beam.style.opacity = 0;
      setTimeout(function() { startTime = null; resetPopped(); rafId = requestAnimationFrame(frame); }, PAUSE);
    }
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !started) {
        started = true;
        setTimeout(function() { resetPopped(); rafId = requestAnimationFrame(frame); }, 500);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(stepsEl);
})();

// ── Ring Cursor ──
(function() {
  var ring = document.createElement('div'); ring.className = 'c-ring';
  var dot  = document.createElement('div'); dot.className  = 'c-dot';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  var TRAIL = 9, trail = [];
  for (var i = 0; i < TRAIL; i++) {
    var t = document.createElement('div'); t.className = 'c-trail';
    var sz = Math.round(6 - i * 0.5);
    t.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;opacity:' + (0.55 - i * 0.055).toFixed(2) + ';';
    document.body.appendChild(t);
    trail.push({ el: t, x: -200, y: -200 });
  }

  var mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function tick() {
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    trail[0].x += (mx - trail[0].x) * 0.45; trail[0].y += (my - trail[0].y) * 0.45;
    trail[0].el.style.left = trail[0].x + 'px'; trail[0].el.style.top = trail[0].y + 'px';
    for (var i = 1; i < TRAIL; i++) {
      trail[i].x += (trail[i-1].x - trail[i].x) * 0.38;
      trail[i].y += (trail[i-1].y - trail[i].y) * 0.38;
      trail[i].el.style.left = trail[i].x + 'px'; trail[i].el.style.top = trail[i].y + 'px';
    }
    requestAnimationFrame(tick);
  })();

  var BURST_COLORS = ['#7c4ff8','#a78bfa','#c4b5fd','#e879f9','#fff','#818cf8'];
  document.addEventListener('click', function(e) {
    ring.style.width = '52px'; ring.style.height = '52px';
    ring.style.borderColor = 'rgba(167,139,250,1)';
    setTimeout(function() {
      ring.style.width = '30px'; ring.style.height = '30px';
      ring.style.borderColor = 'rgba(124,79,248,0.75)';
    }, 220);
    for (var i = 0; i < 12; i++) {
      (function(idx) {
        var p = document.createElement('div'); p.className = 'c-burst';
        var sz = 3 + Math.random() * 5;
        var ang = (idx / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        var vel = 35 + Math.random() * 55;
        var tx = Math.cos(ang) * vel, ty = Math.sin(ang) * vel;
        var col = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
        p.style.cssText = ['width:'+sz+'px','height:'+sz+'px','background:'+col,'left:'+e.clientX+'px','top:'+e.clientY+'px','transition:transform .55s cubic-bezier(.2,.8,.3,1), opacity .45s ease','opacity:1'].join(';');
        document.body.appendChild(p);
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            p.style.transform = 'translate(calc(-50% + ' + tx + 'px), calc(-50% + ' + ty + 'px)) scale(0.1)';
            p.style.opacity = '0';
          });
        });
        setTimeout(function() { p.remove(); }, 600);
      })(i);
    }
  });

  var HOVER_SEL = 'a,button,[role="button"],.cf-card,.service-card,.contact-card,.work-tab-btn';
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(HOVER_SEL)) { ring.style.width = '46px'; ring.style.height = '46px'; ring.style.borderColor = 'rgba(167,139,250,0.9)'; }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(HOVER_SEL)) { ring.style.width = '30px'; ring.style.height = '30px'; ring.style.borderColor = 'rgba(124,79,248,0.75)'; }
  });
  document.addEventListener('mouseleave', function() { ring.style.opacity = '0'; dot.style.opacity = '0'; trail.forEach(function(t) { t.el.style.opacity = '0'; }); });
  document.addEventListener('mouseenter', function() { ring.style.opacity = ''; dot.style.opacity = ''; trail.forEach(function(t, i) { t.el.style.opacity = (0.55 - i * 0.055).toFixed(2); }); });
})();

// ── Page Loader ──
(function() {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;
  var progressBar = loader.querySelector('.page-loader-bar');
  var progressText = loader.querySelector('.page-loader-status span:last-child');
  var duration = 3000, startTime = Date.now();

  function updateProgress() {
    var elapsed = Date.now() - startTime;
    var progress = Math.min(1, elapsed / duration);
    var percent = Math.round(progress * 100);
    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
    if (progress < 1) requestAnimationFrame(updateProgress);
  }

  requestAnimationFrame(updateProgress);
  window.addEventListener('load', function() {
    var elapsed = Date.now() - startTime;
    setTimeout(function() {
      progressBar.style.width = '100%';
      progressText.textContent = '100%';
      loader.classList.add('fade-out');
      document.body.classList.remove('page-loading');
      setTimeout(function() { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 450);
    }, Math.max(0, duration - elapsed));
  });
})();
