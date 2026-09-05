const config = {
  adminWhatsApp: "6288987004237",
  games: [
    {
      id: "bloodstrike",
      name: "Bloodstrike",
      icon: "fas fa-crosshairs",
      image: "https://placehold.co/600x400/02040d/7c3aed?text=Bloodstrike", // Ganti dengan URL asli jika ada
      idGuideImage: "https://placehold.co/500x300/1e1b4b/a78bfa?text=Bloodstrike+ID+Guide",
      needsZoneId: false,
      packages: [
        { id: "bs_100", name: "100 Gold", price: 15000 },
        { id: "bs_300", name: "300 Gold", price: 42000 },
        { id: "bs_500", name: "500 Gold", price: 70000 },
        { id: "bs_1000", name: "1000 Gold", price: 135000 }
      ]
    },
    {
      id: "valorant",
      name: "Valorant",
      icon: "fas fa-fire",
      image: "https://placehold.co/600x400/02040d/ff4655?text=Valorant",
      idGuideImage: "https://placehold.co/500x300/1e1b4b/ff4655?text=Valorant+ID+Guide",
      needsZoneId: false,
      packages: [
        { id: "val_300", name: "300 VP", price: 48000 },
        { id: "val_600", name: "600 VP", price: 95000 },
        { id: "val_1120", name: "1120 VP", price: 175000 },
        { id: "val_2880", name: "2880 VP", price: 445000 }
      ]
    },
    {
      id: "mlbb",
      name: "Mobile Legends",
      icon: "fas fa-gamepad",
      image: "https://placehold.co/600x400/02040d/22d3ee?text=Mobile+Legends",
      idGuideImage: "https://placehold.co/500x300/1e1b4b/22d3ee?text=MLBB+ID+Guide",
      needsZoneId: true,
      packages: [
        { id: "ml_86", name: "86 Diamonds", price: 23000 },
        { id: "ml_172", name: "172 Diamonds", price: 45000 },
        { id: "ml_257", name: "257 Diamonds", price: 65000 },
        { id: "ml_706", name: "706 Diamonds", price: 175000 },
        { id: "ml_wdp", name: "Weekly Diamond Pass", price: 28000 }
      ]
    }
  ]
};

// State
let selectedGame = null;
let selectedPackage = null;

// DOM Elements
const gamesGrid = document.getElementById('gamesGrid');
const packagesGrid = document.getElementById('packagesGrid');
const packagesSection = document.getElementById('packagesSection');
const checkoutSection = document.getElementById('checkoutSection');
const serverZoneGroup = document.getElementById('serverZoneGroup');

// Summary DOM
const sumGame = document.getElementById('sumGame');
const sumItem = document.getElementById('sumItem');
const sumPrice = document.getElementById('sumPrice');
const topupForm = document.getElementById('topupForm');

// Modal Elements
const idGuideModal = document.getElementById('idGuideModal');
const guideImg = document.getElementById('guideImg');
const modalTitle = document.getElementById('modalTitle');

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

// 1. Render Games
function renderGames() {
  gamesGrid.innerHTML = config.games.map(game => `
    <div class="game-select-card" data-id="${game.id}">
      <img src="${game.image}" alt="${game.name}" class="game-banner">
      <div class="game-overlay"></div>
      <span>${game.name}</span>
    </div>
  `).join('');

  document.querySelectorAll('.game-select-card').forEach(card => {
    card.addEventListener('click', (e) => {
      document.querySelectorAll('.game-select-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const gameId = card.getAttribute('data-id');
      handleGameSelection(gameId);
    });
  });
}

// Handle Game Selection
function handleGameSelection(gameId) {
  selectedGame = config.games.find(g => g.id === gameId);
  selectedPackage = null; // Reset package
  
  // Update Summary
  sumGame.textContent = selectedGame.name;
  sumItem.textContent = '-';
  sumPrice.textContent = 'Rp 0';

  // Toggle Zone ID input
  serverZoneGroup.style.display = selectedGame.needsZoneId ? 'block' : 'none';
  if(!selectedGame.needsZoneId) {
    document.getElementById('zoneId').removeAttribute('required');
  } else {
    document.getElementById('zoneId').setAttribute('required', 'true');
  }

  // Render Packages
  renderPackages(selectedGame.packages);

  // Show Packages Section
  packagesSection.style.display = 'block';
  setTimeout(() => {
    packagesSection.style.opacity = '1';
    // Smooth scroll to packages
    packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);

  // Hide Checkout Section until package is selected
  checkoutSection.style.opacity = '0';
  setTimeout(() => {
    checkoutSection.style.display = 'none';
  }, 400);
}

// 2. Render Packages
function renderPackages(packages) {
  packagesGrid.innerHTML = packages.map(pkg => `
    <div class="package-card" data-id="${pkg.id}" data-name="${pkg.name}" data-price="${pkg.price}">
      <h4>${pkg.name}</h4>
      <p>${formatRupiah(pkg.price)}</p>
    </div>
  `).join('');

  document.querySelectorAll('.package-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      selectedPackage = {
        name: card.getAttribute('data-name'),
        price: parseInt(card.getAttribute('data-price'))
      };

      // Update Summary
      sumItem.textContent = selectedPackage.name;
      sumPrice.textContent = formatRupiah(selectedPackage.price);

      // Show Checkout Section
      checkoutSection.style.display = 'block';
      setTimeout(() => {
        checkoutSection.style.opacity = '1';
        // Smooth scroll to checkout
        checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  });
}

// 3. Checkout Form Submit
topupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!selectedGame || !selectedPackage) return;

  const playerId = document.getElementById('playerId').value.trim();
  const zoneId = document.getElementById('zoneId').value.trim();
  const playerNick = document.getElementById('playerNick').value.trim();

  let text = `Halo Admin Midnight! Saya mau top-up:\n\n`;
  text += `*Game:* ${selectedGame.name}\n`;
  text += `*Item:* ${selectedPackage.name}\n`;
  text += `*Total Harga:* ${formatRupiah(selectedPackage.price)}\n\n`;
  
  text += `*Data Player*\n`;
  text += `ID: ${playerId}\n`;
  if (selectedGame.needsZoneId) {
    text += `Zone ID: ${zoneId}\n`;
  }
  if (playerNick) {
    text += `Nickname: ${playerNick}\n`;
  }

  text += `\nMohon info pembayaran selanjutnya. Terima kasih!`;

  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/${config.adminWhatsApp}?text=${encodedText}`, '_blank');
});

// Modal Logic
window.openIdGuide = function() {
  if(!selectedGame) {
    alert('Pilih game terlebih dahulu!');
    return;
  }
  modalTitle.textContent = `Cara Cek ID ${selectedGame.name}`;
  guideImg.src = selectedGame.idGuideImage;
  idGuideModal.classList.add('active');
};

window.closeIdGuide = function() {
  idGuideModal.classList.remove('active');
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderGames();

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

  // ── Mouse Glow ─────────────────────────────────────────────
  const mouseGlow = document.getElementById('mouse-glow');
  window.addEventListener('mousemove', (e) => {
    if (mouseGlow) {
      mouseGlow.style.left = e.clientX + 'px';
      mouseGlow.style.top = e.clientY + 'px';
    }
  }, { passive: true });

  // ── Navbar Scrolled ────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ── Theme Toggle ───────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const applyTheme = (light) => {
    body.classList.toggle('light-mode', light);
    if(themeToggle) themeToggle.innerHTML = light ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', light ? 'light' : 'dark');
  };
  themeToggle?.addEventListener('click', () => applyTheme(!body.classList.contains('light-mode')));
  applyTheme(localStorage.getItem('theme') === 'light');

  // ── Mobile Nav Toggle ──────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if(menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
    });

    // Auto-close menu on link click
    document.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => {
            navLinks.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
  }

  // ── Animate on Scroll ──────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // ── Preloader ──────────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  const removeLoader = () => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      document.body.classList.add('loaded');
      setTimeout(() => { preloader.style.display = 'none'; }, 600);
      document.body.style.opacity = '1';
    }
  };
  window.addEventListener('load', removeLoader);
  setTimeout(removeLoader, 3500);
});

// ── 3D Tilt Logic ───────────────────────────────────────────
function init3DTilt(selector) {
  const cards = document.querySelectorAll(selector);
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -11;
      const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 11;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
      card.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.zIndex = '';
    });
  });
}

// Update Renderers to call Tilt Logic
const originalRenderGames = renderGames;
renderGames = function() {
  originalRenderGames();
  init3DTilt('.game-select-card');
};

const originalRenderPackages = renderPackages;
renderPackages = function(packages) {
  originalRenderPackages(packages);
  init3DTilt('.package-card');
};

