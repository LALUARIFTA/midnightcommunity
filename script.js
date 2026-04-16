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


  // ── Preloader & Failsafe ───────────────────────────────────
  const preloader = document.getElementById('preloader');
  const removeLoader = () => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      document.body.classList.add('loaded');
      setTimeout(() => { preloader.style.display = 'none'; }, 600);
    }
  };

  // 1. Remove on window load
  window.addEventListener('load', removeLoader);

  // 2. Failsafe: Remove after 3.5s regardless of external assets
  setTimeout(removeLoader, 3500);

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
      // Reveal names on interaction
      document.getElementById('membersGrid')?.classList.remove('names-hidden');
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
    // Reveal names on interaction
    document.getElementById('membersGrid')?.classList.remove('names-hidden');
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


  // ── Member Modal (holographic + tabs) ────────────────────────────
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
      

      // Load Tabs Data
      const bio = card.dataset.bio || "No biography provided.";
      const gearRaw = card.dataset.gear || "PC: Not specified, Setup: Standard.";
      
      const bioContent = overlay.querySelector('#tab-bio');
      if (bioContent) bioContent.innerText = bio;
      
      // Parse Gear
      const gearParts = gearRaw.split(',').map(s => s.trim());
      const gearMap = { pc: 'gear-pc', mouse: 'gear-mouse', kb: 'gear-kb', audio: 'gear-audio' };
      
      // Clear defaults efficiently
      Object.values(gearMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = '-';
      });

      gearParts.forEach(part => {
        const [key, ...val] = part.split(':');
        const value = val.join(':').trim();
        if (key.toLowerCase().includes('pc')) document.getElementById('gear-pc').innerText = value;
        if (key.toLowerCase().includes('mouse')) document.getElementById('gear-mouse').innerText = value;
        if (key.toLowerCase().includes('kb')) document.getElementById('gear-kb').innerText = value;
        if (key.toLowerCase().includes('headset') || key.toLowerCase().includes('audio')) {
           const el = document.getElementById('gear-audio');
           if (el) el.innerText = value;
        }
      });

      const achData = card.dataset.achievements || "";
      loadAchievements(achData);

      overlay.classList.add('active');
    });
  });

  // Modal Tab Switching
  window.switchTab = function(tabId, btn) {
    const modal = document.getElementById('memberModalOverlay');
    if (!modal) return;
    
    modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    modal.querySelector(`#tab-${tabId}`).classList.add('active');
    btn.classList.add('active');
  };

  closeBtn?.addEventListener('click',  () => overlay?.classList.remove('active'));
  overlay?.addEventListener('click',  e => { if (e.target === overlay) overlay.classList.remove('active'); });

  // ── Store Cart Logic ───────────────────────────────────────
  let cart = [];
  const WHATSAPP_NUM = "6288987004237";

  window.updateQty = function(id, delta) {
    const el = document.getElementById(`qty-${id}`);
    if (!el) return;
    let qty = parseInt(el.innerText) + delta;
    if (qty < 1) qty = 1;
    el.innerText = qty;
  };

  window.addToCart = function(id) {
    const card = document.querySelector(`.merch-card[data-id="${id}"]`);
    if (!card) return;
    
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const qty = parseInt(document.getElementById(`qty-${id}`).innerText);
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, name, price, qty });
    }
    
    updateCartUI();
    showToast(`🛒 ${name} ditambahkan ke keranjang!`);
  };

  function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const floatCart = document.getElementById('floatingCart');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    if (countEl) countEl.innerText = totalItems;
    if (floatCart) floatCart.classList.toggle('visible', totalItems > 0);
  }


  window.checkoutWA = function(e) {
    if (e) e.preventDefault();
    if (cart.length === 0) return;
    
    const overlay = document.getElementById('storeModalOverlay');
    const summary = document.getElementById('checkoutSummary');
    if (!overlay || !summary) return;

    // Build summary html
    let total = 0;
    let listHtml = '<div style="font-size: 0.85rem; color: #cbd5e1">';
    cart.forEach(item => {
      const st = item.price * item.qty;
      total += st;
      listHtml += `<div style="display:flex; justify-content:space-between; margin-bottom:5px">
                     <span>${item.name} (${item.qty}x)</span>
                     <span>Rp ${st.toLocaleString('id-ID')}</span>
                   </div>`;
    });
    listHtml += `<div style="margin-top:10px; padding-top:10px; border-top: 1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; font-weight:800; color:var(--primary-glow)">
                    <span>TOTAL</span>
                    <span>Rp ${total.toLocaleString('id-ID')}</span>
                 </div></div>`;
    
    summary.innerHTML = listHtml;
    overlay.classList.add('active');
  };

  window.closeStoreModal = function() {
    document.getElementById('storeModalOverlay')?.classList.remove('active');
  };

  window.submitStoreOrder = function(e) {
    e.preventDefault();
    const nama = document.getElementById('checkoutNama')?.value;
    const alamat = document.getElementById('checkoutAlamat')?.value;
    
    if (!nama || !alamat) return;

    let message = `*HALO MIDNIGHT STORE!* 🛒\n\n`;
    message += `Saya ingin melakukan pemesanan:\n`;
    
    let total = 0;
    cart.forEach(item => {
      const st = item.price * item.qty;
      message += `• ${item.name} (${item.qty}x) - Rp ${st.toLocaleString('id-ID')}\n`;
      total += st;
    });

    message += `\n💰 *Total: Rp ${total.toLocaleString('id-ID')}*\n\n`;
    message += `👤 *Pemesanan Atas Nama:*\n${nama}\n\n`;
    message += `📍 *Alamat Pengiriman:*\n${alamat}\n\n`;
    message += `_Mohon segera diproses ya Min! Terima kasih._`;

    const url = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    window.closeStoreModal();
    
    // Clear cart after redirect
    cart = [];
    updateCartUI();
  };

  // ── 3D tilt cards ───────────────────────────────────
  const tiltCards = document.querySelectorAll('.member-card, .game-card, .benefit-card, .event-card, .partner-card, .streamer-card, .merch-card, .stat-card, .gallery-item');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -11;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  11;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
      card.style.zIndex = '10'; // Elevate on hover
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.zIndex = '';
    });
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

  // ── Google Sheets Integration (DASHBOARD OTOMATIS) ────────
  const SHEETS_CSV_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://docs.google.com/spreadsheets/d/e/2PACX-1vTd4COjrmybwAop2jet8COF4u6nZ80TZvRWsiijfm-Qd4z-O4UmM1C6-HJpS_BvTG8RWUvYwyNoAEPf/pub?output=csv'); // Link Fix

  async function loadMembersFromSheets() {
    if (!SHEETS_CSV_URL) return;
    console.log('🔄 Mencoba memuat data dari Google Sheets...');

    try {
      const response = await fetch(SHEETS_CSV_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.text();
      
      const rows = data.split('\n').map(r => r.trim()).filter(r => r.length > 0).slice(1);
      console.log(`✅ Berhasil mengambil ${rows.length} baris data.`);
      
      const grid = document.getElementById('membersGrid');
      if (!grid) return;

      grid.innerHTML = ''; 
      grid.classList.remove('names-hidden');

      rows.forEach((row, index) => {
        // Robust CSV matching (handles empty columns)
        const cleanCols = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) {
            cleanCols.push(current.trim());
            current = "";
          } else current += char;
        }
        cleanCols.push(current.trim());

        if (cleanCols.length < 3) return;

        // Map Kolom: 1:Nama, 2:Role, 3:Game, 4:Bio, 5:IG, 6:TT, 7:YT, 8:Ach
        const name = cleanCols[1] || "Anonymous";
        const role = cleanCols[2] || "Member";
        const game = cleanCols[3] || "Midnight";
        const bio  = cleanCols[4] || "Anggota resmi Midnight Community.";
        const ig   = cleanCols[5] || "";
        const tt   = cleanCols[6] || "";
        const yt   = cleanCols[7] || "";
        const ach  = cleanCols[8] || "";

        const card = document.createElement('div');
        card.className = 'member-card animate-on-scroll';
        card.dataset.game = game.toLowerCase().replace(/\s/g, '');
        card.dataset.bio  = bio;
        card.dataset.ig   = ig;
        card.dataset.tt   = tt;
        card.dataset.yt   = yt;
        card.dataset.achievements = ach;

        card.innerHTML = `
          <div class="member-avatar">${index + 1}</div>
          <div class="member-name">${name}</div>
          <div class="member-role">${role}</div>
          <div class="member-game">
            <i class="fas fa-gamepad"></i> ${game}
          </div>
        `;

        grid.appendChild(card);
        if (typeof obs !== 'undefined') obs.observe(card);
      });

      initMemberInteractions();
      
    } catch (err) {
      console.error('❌ Google Sheets Error:', err.message);
    }
  }

  function initMemberInteractions() {
    const dynamicCards = document.querySelectorAll('.member-card');
    dynamicCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -11;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 11;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
        card.style.zIndex = '10';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = ''; card.style.zIndex = '';
      });

      card.addEventListener('click', () => {
          const overlay = document.getElementById('memberModalOverlay');
          if (!overlay) return;
          document.getElementById('modalAvatar').textContent = card.querySelector('.member-avatar')?.textContent || '?';
          document.getElementById('modalName').innerHTML = card.querySelector('.member-name')?.innerHTML || '';
          document.getElementById('modalRole').innerText = card.querySelector('.member-role')?.innerText || '';
          document.getElementById('modalGame').innerHTML = card.querySelector('.member-game')?.innerHTML || '';
          document.getElementById('tab-bio').innerText = card.dataset.bio;
          
          // Social Media Links Setup
          const ig = document.getElementById('m-ig');
          const tt = document.getElementById('m-tt');
          const yt = document.getElementById('m-yt');
          
          if(ig) { ig.href = card.dataset.ig || '#'; ig.style.display = card.dataset.ig ? 'flex' : 'none'; }
          if(tt) { tt.href = card.dataset.tt || '#'; tt.style.display = card.dataset.tt ? 'flex' : 'none'; }
          if(yt) { yt.href = card.dataset.yt || '#'; yt.style.display = card.dataset.yt ? 'flex' : 'none'; }

          overlay.classList.add('active');
      });

      card.addEventListener('contextmenu', e => {
        e.preventDefault();
        const name = card.querySelector('.member-name')?.textContent;
        if (name) navigator.clipboard.writeText(name).then(() => window._showToast(`📋 IGN "${name}" disalin!`));
      });
    });
  }

  // loadMembersFromSheets(); // Dinonaktifkan sementara untuk pengujian di halaman terpisah

  // ──────────────────────────────────────────────────────────
  // ── SCRIM REGISTRATION UI LOGIC (Unified) ─────────────────
  // ──────────────────────────────────────────────────────────
  const SCRIM_WEBHOOK = "https://discord.com/api/webhooks/1493863897999085588/hIjCbaL9ZPPEcj_z-2k0-lSX9uH3zesi5zcwZDITku5BhzsDZmw3Biv9Y5KjzhyHm2Vv";
  let currentEvent   = '';
  let currentJadwal  = '';

  window.bukaFormScrim = function(namaEvent, jadwal) {
    currentEvent  = namaEvent;
    currentJadwal = jadwal;
    const modal   = document.getElementById('popupScrim');
    if (!modal) return;

    const judul = document.getElementById('judulScrim');
    const meta  = document.getElementById('metaScrim');
    const form  = document.getElementById('formScrim');

    if (judul) judul.innerText = `Daftar Tim: ${namaEvent}`;
    if (meta)  meta.innerText  = `📅 ${jadwal}`;
    if (form)  form.reset();

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  };

  window.tutupFormScrim = function() {
    const modal = document.getElementById('popupScrim');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  };

  // Scrim Submit Handler
  const scrimForm = document.getElementById('formScrim');
  scrimForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const namaTim = document.getElementById('scrimNamaTim')?.value.trim();
    const kontak  = document.getElementById('scrimKontak')?.value.trim();
    const p1      = document.getElementById('scrimP1')?.value.trim();
    const p2      = document.getElementById('scrimP2')?.value.trim();
    const p3      = document.getElementById('scrimP3')?.value.trim();
    const p4      = document.getElementById('scrimP4')?.value.trim();
    const sub1    = document.getElementById('scrimSub1')?.value.trim() || '-';
    const sub2    = document.getElementById('scrimSub2')?.value.trim() || '-';

    const btn = document.getElementById('btnSubmitScrim');
    const old = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Mengirim...';
    btn.disabled = true;

    const payload = {
      embeds: [{
        title: `⚔️ Pendaftaran Scrim — ${currentEvent}`,
        color: 7506394,
        fields: [
          { name: '🎮 Event', value: currentEvent, inline: true },
          { name: '🗓️ Jadwal', value: currentJadwal, inline: true },
          { name: '🛡️ Nama Tim', value: `**${namaTim}**`, inline: true },
          { name: '📞 Manager', value: `\`${kontak}\``, inline: true },
          { name: '👤 Players', value: `1. ${p1}\n2. ${p2}\n3. ${p3}\n4. ${p4}`, inline: false },
          { name: '⏳ Subs', value: `1. ${sub1}\n2. ${sub2}`, inline: true }
        ],
        footer: { text: "Midnight Community · System Registration" },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      const res = await fetch(SCRIM_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok || res.status === 204) {
        showToast('✅ Tim berhasil didaftarkan!', 'success');
        window.tutupFormScrim();
      } else {
        showToast('❌ Gagal mengirim pendaftaran.', 'error');
      }
    } catch {
      showToast('❌ Masalah koneksi.', 'error');
    } finally {
      btn.innerHTML = old;
      btn.disabled  = false;
    }
  });

  // ──────────────────────────────────────────────────────────
  // ── COMMUNITY HUB DATA (Simulation) ───────────────────────
  // ──────────────────────────────────────────────────────────
  
  // 1. Live Status Logic
  const streamers = [
    { id: 'midnightupzone.id', live: true, platform: 'tiktok' },
    { id: 'll.trasna', live: false, platform: 'tiktok' },
    { id: 'nejahere', live: true, platform: 'youtube' }
  ];

  function updateLiveStatus() {
    streamers.forEach(s => {
      const cards = document.querySelectorAll('.streamer-card');
      cards.forEach(card => {
        if (card.innerHTML.includes(s.id)) {
          card.classList.toggle('is-live', s.live);
          if (s.live && !card.querySelector('.live-indicator')) {
            const badge = document.createElement('div');
            badge.className = 'live-indicator';
            badge.innerHTML = '<span class="pulse"></span> LIVE';
            card.appendChild(badge);
          }
        }
      });
    });
  }
  updateLiveStatus();

  // 2. Midnight Leaderboard Interaction
  window.filterLeaderboard = function(game) {
    const rows = document.querySelectorAll('.lb-row');
    rows.forEach(row => {
      row.style.display = (game === 'all' || row.dataset.game === game) ? '' : 'none';
      if (row.style.display !== 'none') row.style.animation = 'bodyFadeIn .3s forwards';
    });
  };

  // 3. Recruitment Data
  const recruitment = {
    bloodstrike: 'OPEN',
    valorant: 'FULL',
    pubg: 'OPEN',
    roblox: 'FULL'
  };

  function applyRecruitmentLabels() {
    document.querySelectorAll('.game-card').forEach(card => {
      const game = card.dataset.game;
      if (game && recruitment[game]) {
        const badge = document.createElement('span');
        badge.className = `recruit-badge ${recruitment[game].toLowerCase()}`;
        badge.innerText = recruitment[game];
        card.appendChild(badge);
      }
    });
  }

  applyRecruitmentLabels();

  // ──────────────────────────────────────────────────────────
  // ── V4.0: INTERACTIVE UPGRADES ───────────────────────────
  // ──────────────────────────────────────────────────────────

  // 1. Custom Cursor Tracking
  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('custom-cursor-dot');
  
  if (cursor && dot) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    });

    // Cursor hover effects
    const interactiveEls = 'a, button, .member-card, .merch-card, .theme-opt, .game-card, .scrim-card, .stat-card';
    document.querySelectorAll(interactiveEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 2. Theme Color Customizer Logic
  window.changeThemeColor = function(primary, glow, btn) {
    const root = document.documentElement;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--primary-glow', glow);
    
    // Update active state in customizer
    document.querySelectorAll('.theme-opt').forEach(opt => opt.classList.remove('active'));
    btn.classList.add('active');
    
    showToast('🎨 Theme Color Updated!');
  };

  // 3. Achievements Population
  const achievementList = {
    'founder':   { icon: '👑', label: 'Founder' },
    'tournament': { icon: '🏆', label: 'Tournament Winner' },
    'streamer':  { icon: '🎥', label: 'Verified Streamer' },
    'loyalty':   { icon: '🤝', label: 'Veteran Member' },
    'top_donor': { icon: '💎', label: 'Midnight Supporter' }
  };

  function loadAchievements(achStr) {
    const container = document.getElementById('modal-achievements');
    if (!container) return;
    container.innerHTML = '';
    
    const userAchs = achStr ? achStr.split(',') : [];
    
    Object.keys(achievementList).forEach(key => {
      const ach = achievementList[key];
      const isUnlocked = userAchs.includes(key);
      const iconWrap = document.createElement('div');
      iconWrap.className = `ach-icon ${isUnlocked ? 'unlocked' : ''}`;
      iconWrap.innerHTML = `
        ${ach.icon}
        <span class="tooltip">${ach.label} ${isUnlocked ? '(Unlocked)' : '(Locked)'}</span>
      `;
      container.appendChild(iconWrap);
    });
  }

  // Enhance member card click to load achievements
  document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('click', () => {
      const achData = card.dataset.achievements || "";
      loadAchievements(achData);
    });
  });

});


