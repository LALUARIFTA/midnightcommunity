'use strict';

// URL Database (Google Apps Script Web App JSON)
const SHEETS_JSON_URL = 'https://script.google.com/macros/s/AKfycby5m2iVBs-pXkGj6oRYm6EyUPh7mZcjfxEDOOajf6x4gU7tq9fRdhzLjcmRnmUzpdQp/exec';

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {

    // ── Mouse Glow ──────────────────
    const glow = document.getElementById('mouse-glow');
    document.addEventListener('mousemove', e => {
        if (glow) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }
    }, { passive: true });

    // ── tsParticles ──────────────────
    if (window.tsParticles) {
        tsParticles.load('tsparticles', {
            fpsLimit: 60,
            particles: {
                number: { value: 30 },
                color: { value: '#7c3aed' },
                shape: { type: 'circle' },
                opacity: { value: 0.2 },
                size: { value: 3 },
                move: { enable: true, speed: 0.5 },
                links: { enable: true, opacity: 0.1 }
            },
            background: { color: 'transparent' }
        });
    }

    // ── Navbar ─────────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);
        }, { passive: true });
    }

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

    // ── Theme ──────────────────────────────────────────────────
    const themeBtn = document.getElementById('themeToggle');
    const applyTheme = light => {
        document.body.classList.toggle('light-mode', light);
        localStorage.setItem('theme', light ? 'light' : 'dark');
        const icon = themeBtn?.querySelector('i');
        if (icon) icon.className = light ? 'fas fa-moon' : 'fas fa-sun';
    };
    themeBtn?.addEventListener('click', () => applyTheme(!document.body.classList.contains('light-mode')));
    applyTheme(localStorage.getItem('theme') === 'light');

    // ── Top Progress Bar ─────────────────────────────────────
    const topBar = document.getElementById('topProgressBar');
    window.addEventListener('scroll', () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? window.scrollY / docH : 0;
        if (topBar) topBar.style.width = (pct * 100) + '%';
    }, { passive: true });

    // Load Data
    fetchMembers();
});

async function fetchMembers() {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('membersGrid');
    
    // Render Skeletons
    grid.innerHTML = Array(8).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-text" style="width: 60%"></div>
            <div class="skeleton-text" style="width: 40%"></div>
            <div class="skeleton-text" style="width: 80%"></div>
            <div class="shimmer-wrap"></div>
        </div>
    `).join('');

    console.log('🚀 Memulai fetch data via Apps Script API...');

    try {
        const response = await fetch(SHEETS_JSON_URL);
        if (!response.ok) throw new Error('Status: ' + response.status);
        
        const members = await response.json();
        console.log('✅ Data JSON Diterima. Jumlah member:', members.length);
        
        if (loading) loading.style.display = 'none';
        grid.innerHTML = '';
        
        members.forEach((m, index) => {
            if (!m.nama) return;

            const card = document.createElement('div');
            card.className = 'member-card';
            card.setAttribute('data-search', `${m.nama} ${m.role} ${m.game}`.toLowerCase());
            
            const initials = m.nama ? m.nama.charAt(0).toUpperCase() : '?';
            
            card.innerHTML = `
                <div class="member-avatar">${initials}</div>
                <div class="member-name">${m.nama}</div>
                <div class="member-role">${m.role}</div>
                <div class="member-game"><i class="fas fa-gamepad"></i> ${m.game}</div>
            `;

            // Click event for modal
            card.onclick = () => openModal({ ...m, name: m.nama, index: index + 1 });
            
            // 3D Tilt
            initTilt(card);

            grid.appendChild(card);
        });

    } catch (err) {
        console.error('❌ API Error:', err);
        if (loading) loading.style.display = 'none';
        
        // Failsafe: Tampilkan Data Contoh jika terblokir
        renderDummyData();
    }
}

function renderDummyData() {
    const grid = document.getElementById('membersGrid');
    const dummy = [
        { nama: "MID◆YK (Trial)", role: "Founder", game: "Bloodstrike PC", bio: "Gagal menyambung ke API Google Apps Script." },
        { nama: "Sistem Error", role: "CORS Issue", game: "Local File", bio: "Gunakan Live Server untuk akses API sungguhan." }
    ];

    grid.innerHTML = '';
    dummy.forEach((d, i) => {
        const initials = d.nama ? d.nama.charAt(0).toUpperCase() : '?';
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-avatar">${initials}</div>
            <div class="member-name">${d.nama}</div>
            <div class="member-role">${d.role}</div>
            <div class="member-game"><i class="fas fa-gamepad"></i> ${d.game}</div>
        `;
        card.onclick = () => openModal({ ...d, name: d.nama, index: i + 1 });
        initTilt(card);
        grid.appendChild(card);
    });
}

function initTilt(card) {
    card.onmousemove = (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -14; // Increased intensity
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 14; 
        
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.05, 1.05, 1.05)`;
        card.style.zIndex = '100';
    };
    card.onmouseleave = () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.zIndex = '';
    };
}

function openModal(data) {
    const modal = document.getElementById('memberModalOverlay');
    const firstLetter = data.name ? data.name.charAt(0).toUpperCase() : '?';
    document.getElementById('modalAvatar').innerText = firstLetter;
    document.getElementById('modalName').innerText = data.name;
    document.getElementById('modalRole').innerText = data.role;
    document.getElementById('modalGame').innerHTML = `<i class="fas fa-gamepad"></i> ${data.game}`;
    document.getElementById('tab-bio').innerText = data.bio || "Anggota resmi Midnight Community.";

    // Socials
    const ig = document.getElementById('m-ig');
    const tt = document.getElementById('m-tt');
    const yt = document.getElementById('m-yt');

    if (ig) { ig.href = data.ig || '#'; ig.parentElement.style.display = data.ig ? 'block' : 'none'; }
    if (tt) { tt.href = data.tt || '#'; tt.parentElement.style.display = data.tt ? 'block' : 'none'; }
    if (yt) { yt.href = data.yt || '#'; yt.parentElement.style.display = data.yt ? 'block' : 'none'; }

    modal.classList.add('active');
}

window.closeModal = () => {
    document.getElementById('memberModalOverlay').classList.remove('active');
};

window.setCategory = (cat) => {
    currentCategory = cat;
    
    // Update active UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const isMatch = btn.innerText.toLowerCase() === cat.toLowerCase() || (cat === 'all' && btn.innerText === 'All');
        btn.classList.toggle('active', isMatch);
    });

    filterMembers();
};

window.filterMembers = () => {
    const q = document.getElementById('memberSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach(c => {
        const text = c.getAttribute('data-search');
        const matchesSearch = text.includes(q);
        const matchesCat = (currentCategory === 'all') || text.includes(currentCategory.toLowerCase());
        
        if (matchesSearch && matchesCat) {
            c.style.display = '';
            c.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
            c.style.display = 'none';
        }
    });
};
