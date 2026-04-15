'use strict';

// ============================================================
// MIDNIGHT COMMUNITY — script.js (v3 – Full Feature Build)
// ============================================================

const DISCORD_WEBHOOK     = 'https://discord.com/api/webhooks/1493829314540470414/-TafK8S2of06A3owJnUFwt9OcU6jwbznGH5sVYSC6CxDmwx6-CAOsMRoQ1qmokO4zFkp';
const RSVP_WEBHOOK        = 'https://discord.gg/sH4WESmjMK';
const RSVP_WEBHOOK_ACTUAL = 'https://discord.com/api/webhooks/1493852317160837241/i1JecxioTJNmkIoH6F2Zv9oyfflMo7oDh8Z4sfquT4Ec2wMguaGroXu1gc6C3eyJFTGz';

document.addEventListener('DOMContentLoaded', () => {

  // ── Toast ──────────────────────────────────────────────────
  function showToast(msg, type = 'success') {
    const iconMap = { success: 'check-circle', error: 'times-circle', warn: 'exclamation-triangle', info: 'info-circle' };
    const t = document.createElement('div');
    t.className = 'toast-message';
    t.innerHTML = `<i class="fas fa-${iconMap[type] || 'check-circle'}"></i> ${msg}`;
    if (type === 'error') t.style.background = 'rgba(220,38,38,.92)';
    if (type === 'warn')  t.style.background = 'rgba(217,119,6,.92)';
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .4s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 400);
    }, 3500);
  }
  window._showToast = showToast;

  // ── Preloader ──────────────────────────────────────────────
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const p = document.getElementById('preloader');
    if (p) { p.classList.add('fade-out'); setTimeout(() => p.style.display = 'none', 550); }
  });

  // ── tsParticles ────────────────────────────────────────────
  if (window.tsParticles) {
    tsParticles.load('tsparticles', {
      fpsLimit: 60,
      particles: {
        number: { value: 36 },
        color:  { value: ['#7c3aed', '#a78bfa', '#22d3ee'] },
        shape:  { type: 'circle' },
        opacity:{ value: 0.28 },
        size:   { value: 3 },
        move:   { enable: true, speed: 0.45, direction: 'none', random: true },
        links:  { enable: true, distance: 155, color: '#8b5cf6', opacity: 0.22 }
      },
      interactivity: { events: { onHover: { enable: true, mode: 'repulse' } } },
      background: { color: 'transparent' }
    });
  }

  // ── Navbar ─────────────────────────────────────────────────
  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navLinks?.classList.remove('show');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
    });
  });

  // ── Active nav on scroll ───────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const sp = window.scrollY + 130;
    let cur = '';
    sections.forEach(s => { if (s.offsetTop <= sp && s.offsetTop + s.offsetHeight > sp) cur = s.id; });
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }, { passive: true });

  // ── Back-to-top + Progress ring + Top bar ─────────────────
  const backTop = document.getElementById('backToTop');
  const ring    = document.querySelector('.progress-ring__circle');
  const circum  = ring ? 2 * Math.PI * ring.r.baseVal.value : 0;
  const topBar  = document.getElementById('topProgressBar');
  if (ring) { ring.style.strokeDasharray = `${circum} ${circum}`; ring.style.strokeDashoffset = circum; }

  window.addEventListener('scroll', () => {
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 300);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? window.scrollY / docH : 0;
    if (ring)   ring.style.strokeDashoffset = circum * (1 - pct);
    if (topBar) topBar.style.width = (pct * 100) + '%';
  }, { passive: true });

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Theme ──────────────────────────────────────────────────
  const themeBtn  = document.getElementById('themeToggle');
  const themeIcon = themeBtn?.querySelector('i');
  const applyTheme = light => {
    document.body.classList.toggle('light-mode', light);
    if (themeIcon) themeIcon.className = light ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', light ? 'light' : 'dark');
  };
  themeBtn?.addEventListener('click', () => applyTheme(!document.body.classList.contains('light-mode')));
  applyTheme(localStorage.getItem('theme') === 'light');

  // ── Typing hero subtitle ───────────────────────────────────
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) {
    const phrases = [
      'Bergabunglah. Berkembang. Dominasi dari kegelapan.',
      'Rise from the shadows. Compete. Conquer.',
      'Komunitas gaming paling gelap & kompetitif.',
      'Scrim. Tournament. Community. Family.'
    ];
    let pi = 0, ci = 0, deleting = false;
    const base = 'Komunitas gaming kompetitif inklusif — Bloodstrike, Valorant, PUBG, dan Roblox.\n';

    function typeLoop() {
      const phrase = phrases[pi];
      if (!deleting) {
        heroSub.innerHTML = base + phrase.substring(0, ci + 1);
        ci++;
        if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
      } else {
        heroSub.innerHTML = base + phrase.substring(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(typeLoop, deleting ? 38 : 62);
    }
    setTimeout(typeLoop, 1800);
  }

  // ── Main countdown ─────────────────────────────────────────
  (function countdown() {
    const target = new Date('2026-04-25T20:00:00+07:00').getTime();
    const pad = n => String(Math.floor(n)).padStart(2, '0');
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = pad(v); };
    const tick = () => {
      const diff = target - Date.now();
      const lbl  = document.getElementById('countdown-label');
      if (diff <= 0) {
        ['days','hours','minutes','seconds'].forEach(id => set(id, 0));
        if (lbl) lbl.textContent = '🔥 Event sudah dimulai!';
        return;
      }
      set('days',    diff / 86400000);
      set('hours',   (diff % 86400000) / 3600000);
      set('minutes', (diff % 3600000)  / 60000);
      set('seconds', (diff % 60000)    / 1000);
    };
    tick(); setInterval(tick, 1000);
  })();

  // ── Event MINI Countdown (per event card) ─────────────────
  function initMiniCountdowns() {
    const miniEls = document.querySelectorAll('.event-mini-countdown[data-target]');
    if (!miniEls.length) return;

    function renderMini(el) {
      const target = new Date(el.dataset.target).getTime();
      const diff   = target - Date.now();
      if (diff <= 0) { el.innerHTML = '<span>🔴 Live / Ended</span>'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);
      const pad = n => String(n).padStart(2,'0');
      el.innerHTML = `<span>${pad(d)}d</span> <span>${pad(h)}h</span> <span>${pad(m)}m</span> <span>${pad(s)}s</span>`;
    }

    miniEls.forEach(el => { renderMini(el); });
    setInterval(() => miniEls.forEach(el => renderMini(el)), 1000);
  }
  initMiniCountdowns();

  // ── Intersection Observer (scroll animations) ──────────────
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));

  // ── Mouse glow ─────────────────────────────────────────────
  const glow = document.getElementById('mouse-glow');
  if (glow) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  // ── Member filter ──────────────────────────────────────────
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const memberCards = document.querySelectorAll('.member-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      memberCards.forEach(c => {
        const show = f === 'all' || c.dataset.game === f;
        c.style.display   = show ? '' : 'none';
        if (show) c.style.animation = 'bodyFadeIn .3s forwards';
      });
    });
  });

  // ── Member search ──────────────────────────────────────────
  const searchInput = document.getElementById('memberSearch');
  searchInput?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    memberCards.forEach(c => {
      const name = c.querySelector('.member-name')?.textContent.toLowerCase() || '';
      const show = !q || name.includes(q);
      c.style.display   = show ? '' : 'none';
      c.style.animation = show ? 'bodyFadeIn .3s forwards' : '';
    });
    if (!q) { filterBtns.forEach(b => b.classList.remove('active')); filterBtns[0]?.classList.add('active'); }
  });

  // ── Hall of Fame counter ───────────────────────────────────
  let counted = false;
  const animateStats = () => {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const tgt = +el.getAttribute('data-target') || 0;
      let n = 0;
      const step = tgt / 55;
      const run = () => {
        n = Math.min(n + step, tgt);
        el.textContent = Math.ceil(n).toLocaleString('id-ID') + (n >= tgt && tgt > 10 ? '+' : '');
        if (n < tgt) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  };
  window.addEventListener('scroll', () => {
    const hof = document.getElementById('hof');
    if (hof && !counted && window.scrollY + window.innerHeight > hof.offsetTop + 80) {
      counted = true; animateStats();
    }
  }, { passive: true });

  // ── Discord widget skeleton ────────────────────────────────
  const iframe   = document.getElementById('discordWidget');
  const skeleton = document.getElementById('widgetSkeleton');
  if (iframe && skeleton) {
    iframe.addEventListener('load', () => {
      skeleton.style.opacity = '0';
      setTimeout(() => skeleton.style.display = 'none', 500);
    });
    setTimeout(() => { skeleton.style.opacity = '0'; }, 8000);
  }

  // ── FAQ Accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const was = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
      if (!was) item.classList.add('active');
    });
  });

  // ── Division card clicks ──────────────────────────────────
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const g = card.getAttribute('data-game') || 'division';
      showToast(`🎮 Division ${g.toUpperCase()} — coming soon!`);
    });
  });

  // ── Member Modal (holographic) ────────────────────────────
  const overlay   = document.getElementById('memberModalOverlay');
  const closeBtn  = document.getElementById('closeModalBtn');
  const mAvatar   = document.getElementById('modalAvatar');
  const mName     = document.getElementById('modalName');
  const mRole     = document.getElementById('modalRole');
  const mGame     = document.getElementById('modalGame');

  memberCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!overlay) return;
      if (mAvatar) mAvatar.textContent = card.querySelector('.member-avatar')?.textContent.trim() || '?';
      if (mName)   mName.innerHTML     = card.querySelector('.member-name')?.innerHTML || '';
      if (mRole)   mRole.innerText     = card.querySelector('.member-role')?.innerText || '';
      if (mGame)   mGame.innerHTML     = card.querySelector('.member-game')?.innerHTML || '';
      overlay.classList.add('active');
    });
  });
  closeBtn?.addEventListener('click',  () => overlay?.classList.remove('active'));
  overlay?.addEventListener('click',  e => { if (e.target === overlay) overlay.classList.remove('active'); });

  // ── 3D tilt member cards ───────────────────────────────────
  memberCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -11;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  11;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // ── Right-click copy IGN ──────────────────────────────────
  memberCards.forEach(card => {
    card.addEventListener('contextmenu', e => {
      e.preventDefault();
      const name = card.querySelector('.member-name')?.textContent;
      if (name && navigator.clipboard) {
        navigator.clipboard.writeText(name).then(() => showToast(`📋 IGN "<b>${name}</b>" disalin!`));
      }
    });
  });

  // ── Gallery drag-scroll ────────────────────────────────────
  const gallery    = document.getElementById('dragGallery');
  const slideLeft  = document.getElementById('slideLeft');
  const slideRight = document.getElementById('slideRight');
  const SLIDE_AMT  = 324;

  if (gallery) {
    let dragging = false, startX = 0, scrollLeft = 0;
    gallery.addEventListener('mousedown', e => {
      dragging = true; startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft; gallery.classList.add('dragging');
    });
    document.addEventListener('mouseup',   () => { dragging = false; gallery.classList.remove('dragging'); });
    gallery.addEventListener('mouseleave', () => { dragging = false; gallery.classList.remove('dragging'); });
    gallery.addEventListener('mousemove',  e => {
      if (!dragging) return; e.preventDefault();
      gallery.scrollLeft = scrollLeft - (e.pageX - gallery.offsetLeft - startX) * 1.7;
    });
    let tX = 0;
    gallery.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
    gallery.addEventListener('touchmove',  e => {
      const dx = tX - e.touches[0].clientX;
      gallery.scrollLeft += dx * 0.85; tX = e.touches[0].clientX;
    }, { passive: true });

    slideLeft?.addEventListener('click',  () => gallery.scrollBy({ left: -SLIDE_AMT, behavior: 'smooth' }));
    slideRight?.addEventListener('click', () => gallery.scrollBy({ left:  SLIDE_AMT, behavior: 'smooth' }));

    const syncArrows = () => {
      if (slideLeft)  slideLeft.style.opacity  = gallery.scrollLeft < 10 ? '.35' : '1';
      if (slideRight) slideRight.style.opacity = (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 10) ? '.35' : '1';
    };
    gallery.addEventListener('scroll', syncArrows, { passive: true });
    syncArrows();
  }

  // ── Lightbox ──────────────────────────────────────────────
  const lightbox  = document.getElementById('lightboxModal');
  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose   = document.getElementById('lightboxClose');
  if (lightbox) {
    document.querySelectorAll('.gallery-item[data-full]').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-full');
        if (!src) return;
        if (lbImg)     { lbImg.src = src; lbImg.alt = item.getAttribute('data-caption') || ''; }
        if (lbCaption) lbCaption.textContent = item.getAttribute('data-caption') || '';
        lightbox.classList.add('active');
      });
    });
    lbClose?.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });
  }

  // ── UI Sounds ─────────────────────────────────────────────
  const hoverSfx = document.getElementById('audioHover');
  const clickSfx = document.getElementById('audioClick');
  function playSfx(el) { if (!el) return; el.currentTime = 0; el.play().catch(() => {}); }
  document.querySelectorAll('a, button, .member-card, .game-card, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => playSfx(hoverSfx));
    el.addEventListener('click',      () => playSfx(clickSfx));
  });

  // ── Online / Offline ──────────────────────────────────────
  window.addEventListener('offline', () => showToast('📡 Kamu sedang offline!', 'warn'));
  window.addEventListener('online',  () => showToast('✅ Koneksi kembali!'));


  // ─────────────────────────────────────────────────────────
  // ── REGISTRATION FORM → Discord Webhook ───────────────────
  // ─────────────────────────────────────────────────────────
  const form       = document.getElementById('registrationForm');
  const submitBtn  = document.getElementById('submitBtn');
  const emailInput = document.getElementById('email');
  const discordIn  = document.getElementById('discord');
  const emailErr   = document.getElementById('emailError');
  const discordErr = document.getElementById('discordError');

  const isValidEmail   = v => /^\S+@\S+\.\S+$/.test(v);
  const isValidDiscord = v => /^.{2,32}(#\d{4})?$/.test(v);

  emailInput?.addEventListener('input', () => {
    if (emailErr) emailErr.style.display = (emailInput.value.length > 0 && !isValidEmail(emailInput.value)) ? 'block' : 'none';
  });
  discordIn?.addEventListener('input', () => {
    if (discordErr) discordErr.style.display = (discordIn.value.length > 0 && !isValidDiscord(discordIn.value)) ? 'block' : 'none';
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const ign     = document.getElementById('ign')?.value.trim()     || '';
    const discord = discordIn?.value.trim()                           || '';
    const email   = emailInput?.value.trim()                          || '';
    const game    = document.getElementById('game')?.value            || '';
    const pesan   = document.getElementById('pesan')?.value.trim()   || '-';

    if (!ign)                     { showToast('⚠️ IGN wajib diisi!', 'warn');                return; }
    if (!discord)                 { showToast('⚠️ Username Discord wajib diisi!', 'warn');   return; }
    if (!email)                   { showToast('⚠️ Email wajib diisi!', 'warn');              return; }
    if (!game)                    { showToast('⚠️ Pilih game utamamu!', 'warn');             return; }
    if (!isValidEmail(email))     { showToast('❌ Format email tidak valid.', 'error');       return; }
    if (!isValidDiscord(discord)) { showToast('❌ Format Discord tidak valid.', 'error');     return; }

    const orig = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Mengirim...';

    const payload = {
      embeds: [{
        title: '📝 Pendaftaran Anggota Baru — Midnight Community',
        color: 7681245,
        thumbnail: { url: 'https://placehold.co/80x80/02040d/a78bfa?text=MID' },
        fields: [
          { name: '👤  IGN',        value: `\`${ign}\``,     inline: true  },
          { name: '💬  Discord',    value: `\`${discord}\``, inline: true  },
          { name: '📧  Email',      value: `\`${email}\``,   inline: true  },
          { name: '🎮  Game',       value: game,              inline: true  },
          { name: '💌  Pesan',      value: pesan,             inline: false }
        ],
        footer: { text: 'Midnight Community · Registration System' },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      const res = await fetch(DISCORD_WEBHOOK, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      if (res.ok || res.status === 204) {
        showToast('✅ Pendaftaran berhasil dikirim! Cek Discord dalam 24 jam.');
        form.reset();
        if (emailErr)   emailErr.style.display   = 'none';
        if (discordErr) discordErr.style.display = 'none';
      } else {
        showToast(`❌ Gagal mengirim (${res.status}). Coba lagi.`, 'error');
      }
    } catch {
      showToast('❌ Periksa koneksi internet dan coba lagi.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = orig;
    }
  });

  // ── PWA Service Worker ─────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  // ── Stagger delays ─────────────────────────────────────────
  document.querySelectorAll('.stat-card, .gallery-item').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.06) + 's';
  });

});
