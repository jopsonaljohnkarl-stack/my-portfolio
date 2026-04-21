// ─────────────────────────────────────────────────────────────
//  CAROUSEL (Coverflow) + Tab Filtering + Project Modal
//  Depends on: js/projects.js  (must load first)
// ─────────────────────────────────────────────────────────────

(function () {
  let current = 0;
  let cards = [];
  const stage    = document.getElementById('cfStage');
  const detail   = document.getElementById('workDetail');
  const dotsWrap = document.getElementById('cfDots');
  const btnPrev  = document.getElementById('cfPrev');
  const btnNext  = document.getElementById('cfNext');
  if (!stage) return;

  function buildImg(src, alt) {
    return '<img class="cf-card-img" src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" />';
  }

  let activeProjects = PROJECTS;

  function getPos(i) {
    const n = activeProjects.length;
    let d = ((i - current) % n + n) % n;
    if (d > n / 2) d -= n;
    if (d ===  0) return 'active';
    if (d === -1) return 'prev';
    if (d ===  1) return 'next';
    if (d === -2) return 'far-prev';
    if (d ===  2) return 'far-next';
    return 'hidden';
  }

  function renderDetail(idx) {
    if (activeProjects.length === 0) return;
    const p = activeProjects[idx];
    detail.innerHTML =
      '<div class="wd-company">' + p.company + '</div>' +
      '<div class="wd-badge"><span style="color:' + p.color + ';margin-right:4px;">●</span>' + p.tag + '</div>' +
      '<div class="wd-title">' + p.title + '</div>' +
      '<div class="wd-skills">' + p.skills.map(s => '<span class="skill-pill">' + s + '</span>').join('') + '</div>' +
      '<div class="wd-desc">' + p.desc + '</div>' +
      '<ul class="wd-features">' + p.features.map(f => '<li>' + f + '</li>').join('') + '</ul>' +
      '<div class="wd-footer">' +
        '<div class="wd-hours"><strong>' + p.hours + '</strong> hrs/week saved</div>' +
        '<div class="wd-counter">' + (idx + 1) + ' / ' + activeProjects.length + '</div>' +
      '</div>';
  }

  function goTo(idx) {
    if (activeProjects.length === 0) return;
    current = ((idx % activeProjects.length) + activeProjects.length) % activeProjects.length;
    cards.forEach((c, i) => c.setAttribute('data-pos', getPos(i)));
    dotsWrap.querySelectorAll('.cf-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    detail.classList.add('updating');
    setTimeout(function () {
      renderDetail(current);
      detail.classList.remove('updating');
    }, 160);
  }

  function buildCarousel() {
    stage.innerHTML = '';
    dotsWrap.innerHTML = '';
    cards = [];

    activeProjects.forEach(function (p, i) {
      const card = document.createElement('div');
      card.className = 'cf-card';
      card.setAttribute('data-pos', 'hidden');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', p.title);
      card.innerHTML =
        '<div class="cf-card-header">' +
          '<div class="cf-card-dot" style="background:' + p.color + '"></div>' +
          '<div class="cf-card-dot" style="background:rgba(255,255,255,0.15)"></div>' +
          '<div class="cf-card-dot" style="background:rgba(255,255,255,0.08)"></div>' +
          '<div class="cf-card-titlebar">' + p.title + '</div>' +
        '</div>' +
        buildImg(p.img, p.title) +
        '<div class="cf-card-footer">' +
          '<div class="cf-tag">' + p.tag + '</div>' +
          '<div class="cf-hours">&#9201; ' + p.hours + 'h/wk saved</div>' +
        '</div>';
      card.addEventListener('click', (function (idx) {
        return function () { if (card.getAttribute('data-pos') !== 'active') goTo(idx); };
      })(i));
      card.addEventListener('keydown', (function (idx) {
        return function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(idx); } };
      })(i));
      stage.appendChild(card);
      cards.push(card);
    });

    activeProjects.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'cf-dot';
      dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
      dot.addEventListener('click', (function (idx) { return function () { goTo(idx); }; })(i));
      dotsWrap.appendChild(dot);
    });
  }

  buildCarousel();

  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  document.addEventListener('keydown', function (e) {
    const workEl = document.getElementById('work');
    if (!workEl) return;
    const r = workEl.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  // ── Swipe / Drag ──
  let dragStartX = 0, dragStartY = 0, isDragging = false, isSwiping = false, dragStartTime = 0;

  stage.ondragstart = function() { return false; };
  stage.style.touchAction = 'pan-y';

  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      isDragging = true; isSwiping = false;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      dragStartTime = Date.now();
    }
  }, { passive: false });

  stage.addEventListener('touchmove', function (e) {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragStartX;
      const dy = e.touches[0].clientY - dragStartY;
      if (Math.abs(dx) > 15 || Math.sqrt(dx * dx + dy * dy) > 10) {
        isSwiping = true;
        e.preventDefault();
      }
    }
  }, { passive: false });

  stage.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - dragStartX;
    const dy = e.changedTouches[0].clientY - dragStartY;
    const duration = Date.now() - dragStartTime;
    isDragging = false;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) && duration < 500) {
      goTo(dx < 0 ? current + 1 : current - 1);
      setTimeout(function() { isSwiping = false; }, 100);
    } else {
      setTimeout(function() { isSwiping = false; }, 50);
    }
  });

  stage.addEventListener('pointerdown', function (e) {
    isDragging = true; isSwiping = false;
    dragStartX = e.clientX; dragStartY = e.clientY;
    dragStartTime = Date.now();
  });

  document.addEventListener('pointermove', function (e) {
    if (isDragging) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.sqrt(dx * dx + dy * dy) > 10) isSwiping = true;
    }
  });

  document.addEventListener('pointerup', function (e) {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    isDragging = false;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
    setTimeout(function() { isSwiping = false; }, 50);
  });

  document.addEventListener('pointercancel', function () { isDragging = false; isSwiping = false; });

  stage.addEventListener('click', function (e) {
    if (isSwiping) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  goTo(0);

  // ── Tab Filtering ──
  document.querySelectorAll('.work-tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.work-tab-btn').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      let selectedCat = btn.getAttribute('data-cat');
      activeProjects = selectedCat === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === selectedCat);

      buildCarousel();
      goTo(0);
    });
  });

  // ── Project Modal ──
  var overlay = document.getElementById('projModalOverlay');
  var mTitle  = document.getElementById('projModalTitle');
  var mImg    = document.getElementById('projModalImg');
  var mTag    = document.getElementById('projModalTag');
  var mHours  = document.getElementById('projModalHours');
  var mClose  = document.getElementById('projModalClose');

  function openModal(idx) {
    var p = activeProjects[idx];
    mTitle.textContent = p.title;
    mTag.textContent   = p.tag;
    mHours.innerHTML   = '<strong>' + p.hours + '</strong> hrs/week saved';
    mImg.innerHTML     = '<img src="' + p.img + '" alt="' + p.title + '" style="width:100%;display:block;" />';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    mClose.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  mClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

  stage.addEventListener('click', function(e) {
    var card = e.target.closest('.cf-card');
    if (!card) return;
    if (card.getAttribute('data-pos') === 'active') {
      var idx = cards.indexOf(card);
      if (idx !== -1) openModal(idx);
    }
  });
})();
