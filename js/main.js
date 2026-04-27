// ─────────────────────────────────────────────────────────────
//  MAIN — core app logic
//  Covers: icons, avatar, CTA magnetism, particle canvas, navbar,
//          active nav link, mobile menu, scroll reveals,
//          smooth scroll, process beam, page loader
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

// ── CTA Magnetism ──
(function () {
  var supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsFinePointer || prefersReducedMotion) return;

  var magneticSelector = [
    '.btn-primary',
    '.hero-actions .btn-outline',
    '.contact-cta-wrap .btn-primary'
  ].join(',');

  var elements = Array.prototype.slice.call(document.querySelectorAll(magneticSelector));
  if (!elements.length) return;

  elements.forEach(function (element) {
    var reset = function () {
      element.style.transform = '';
    };

    element.addEventListener('mousemove', function (event) {
      var rect = element.getBoundingClientRect();
      var offsetX = event.clientX - rect.left - rect.width / 2;
      var offsetY = event.clientY - rect.top - rect.height / 2;
      var moveX = Math.max(-8, Math.min(8, offsetX * 0.12));
      var moveY = Math.max(-6, Math.min(6, offsetY * 0.12));

      element.style.transform = 'translate(' + moveX.toFixed(2) + 'px, ' + moveY.toFixed(2) + 'px)';
    });

    element.addEventListener('mouseleave', reset);
    element.addEventListener('blur', reset);
  });
})();

// Hero automation mesh canvas
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  if (!ctx || !hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
  const NODE_COUNT = 42;
  const CONNECT_DISTANCE = 170;
  const MOUSE_DISTANCE = 150;
  const MAX_SPEED = 0.18;
  const SIGNAL_COUNT = 7;

  let width = 0;
  let height = 0;
  let rafId = null;
  let nodes = [];
  let signals = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    nodes = createNodes();
    signals = createSignals();
    drawScene(0);
  }

  function createNodes() {
    return Array.from({ length: NODE_COUNT }, function (_, index) {
      const col = index % 7;
      const row = Math.floor(index / 7);
      const jitterX = (Math.random() - 0.5) * 70;
      const jitterY = (Math.random() - 0.5) * 58;

      return {
        x: ((col + 0.5) / 7) * width + jitterX,
        y: ((row + 0.5) / 6) * height + jitterY,
        vx: (Math.random() - 0.5) * MAX_SPEED,
        vy: (Math.random() - 0.5) * MAX_SPEED,
        radius: 1.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  function createSignals() {
    return Array.from({ length: SIGNAL_COUNT }, function (_, index) {
      const from = Math.floor(Math.random() * NODE_COUNT);
      let to = Math.floor(Math.random() * NODE_COUNT);
      if (to === from) to = (to + 1) % NODE_COUNT;

      return {
        from: from,
        to: to,
        progress: (index / SIGNAL_COUNT) * 0.95,
        speed: 0.0024 + Math.random() * 0.0015
      };
    });
  }

  function moveNodes() {
    nodes.forEach(function (node) {
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (supportsFinePointer && distance < MOUSE_DISTANCE && distance > 0.01) {
        const force = (MOUSE_DISTANCE - distance) / MOUSE_DISTANCE;
        node.vx += (dx / distance) * force * 0.018;
        node.vy += (dy / distance) * force * 0.018;
      }

      node.x += node.vx;
      node.y += node.vy;
      node.vx *= 0.985;
      node.vy *= 0.985;

      if (node.x < 16 || node.x > width - 16) node.vx *= -1;
      if (node.y < 16 || node.y > height - 16) node.vy *= -1;

      node.x = Math.max(16, Math.min(width - 16, node.x));
      node.y = Math.max(16, Math.min(height - 16, node.y));
    });
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(79, 140, 255, 0.035)';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawConnections(time) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > CONNECT_DISTANCE) continue;

        const alpha = (1 - distance / CONNECT_DISTANCE) * 0.16;
        const shimmer = 0.025 * Math.sin(time * 0.001 + a.phase + b.phase);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(79, 140, 255, ${Math.max(0.035, alpha + shimmer)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function drawSignals() {
    signals.forEach(function (signal) {
      const from = nodes[signal.from];
      const to = nodes[signal.to];
      if (!from || !to || signal.from === signal.to) return;

      const x = from.x + (to.x - from.x) * signal.progress;
      const y = from.y + (to.y - from.y) * signal.progress;

      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(47, 111, 221, 0.34)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79, 140, 255, 0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();

      signal.progress += signal.speed;
      if (signal.progress > 1) {
        signal.from = signal.to;
        signal.to = Math.floor(Math.random() * NODE_COUNT);
        if (signal.to === signal.from) signal.to = (signal.to + 1) % NODE_COUNT;
        signal.progress = 0;
        signal.speed = 0.0024 + Math.random() * 0.0015;
      }
    });
  }

  function drawNodes(time) {
    nodes.forEach(function (node) {
      const pulse = 0.5 + Math.sin(time * 0.0012 + node.phase) * 0.5;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + pulse * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(47, 111, 221, 0.34)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79, 140, 255, 0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  function drawScene(time) {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawConnections(time);
    drawSignals();
    drawNodes(time);
  }

  function drawFrame(time) {
    drawScene(time);
    if (!prefersReducedMotion) {
      moveNodes();
      rafId = window.requestAnimationFrame(drawFrame);
    }
  }

  hero.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  }, { passive: true });

  hero.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
      return;
    }

    if (!document.hidden && !prefersReducedMotion && !rafId) {
      rafId = window.requestAnimationFrame(drawFrame);
    }
  });

  resize();
  if (!prefersReducedMotion) {
    rafId = window.requestAnimationFrame(drawFrame);
  }
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


// ── Page Loader ──
(function() {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;
  var progressBar = loader.querySelector('.page-loader-bar');
  var progressText = loader.querySelector('.page-loader-status span:last-child');
  var duration = 1500, startTime = Date.now();

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

// ── Footer year ──
(function() {
  var el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

// ── Mobile menu focus trap ──
(function() {
  var menu = document.getElementById('mobileMenu');
  var btn  = document.getElementById('menuBtn');
  if (!menu) return;
  var FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

  document.addEventListener('keydown', function(e) {
    if (!menu.classList.contains('open') || e.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(menu.querySelectorAll(FOCUSABLE)).filter(function(el) {
      return !el.closest('[hidden]') && el.offsetParent !== null;
    });
    if (!focusable.length) { e.preventDefault(); return; }
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
})();

// ── Contact form ──
(function() {
  var form    = document.getElementById('contactForm');
  var success = document.getElementById('cfSuccess');
  if (!form || !success) return;
  var submitBtn = form.querySelector('.cf-submit');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name    = document.getElementById('cfName').value.trim();
    var email   = document.getElementById('cfEmail').value.trim();
    var message = document.getElementById('cfMessage').value.trim();
    if (!name || !email || !message) return;

    var subject = encodeURIComponent('Portfolio Inquiry from ' + name);
    var body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
    window.location.href = 'mailto:jopsonaljohnkarl@gmail.com?subject=' + subject + '&body=' + body;

    success.classList.add('show');
    form.reset();
    setTimeout(function() { success.classList.remove('show'); }, 6000);

    // Re-init Lucide icons after form reset re-renders the submit button
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
})();
