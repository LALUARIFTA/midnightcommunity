import { useEffect, useState, useRef, useCallback } from 'react';
import ChatBubble from './ChatBubble';
import { MidnightLogo, BloodstrikeLogo, ValorantLogo, PubgLogo, RobloxLogo } from './Logo';

/* ── Scroll-triggered animation hook ── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}

/* ── Animated counter hook ── */
function useCounter(target, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = now => { const p = Math.min((now - start) / duration, 1); setVal(Math.round(p * target)); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return [val, ref];
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const h = () => { const d = document.documentElement; setW((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100); };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return <div className="scroll-progress" style={{ width: `${w}%` }} />;
}

/* ── Back to top ── */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return show ? <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Kembali ke atas">↑</button> : null;
}

/* ── Announcement banner ── */
function AnnouncementBanner({ text, onClose }) {
  if (!text) return null;
  return <div className="announcement-bar"><span>{text}</span><button onClick={onClose} aria-label="Tutup">×</button></div>;
}

/* ── Particle canvas for hero ── */
function HeroParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current, ctx = c.getContext('2d');
    let raf, particles = [];
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 60; i++) particles.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 2 + 0.5, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4, a: Math.random() * 0.5 + 0.15 });
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of particles) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = `rgba(196,240,90,${p.a})`; ctx.fill();
      }
      // draw lines between close particles
      for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(196,240,90,${0.08 * (1 - d / 120)})`; ctx.stroke(); }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="hero-particles" />;
}

/* ── Skeleton loader ── */
function SkeletonCard() {
  return <div className="member-card skeleton-card"><div className="skeleton-avatar" /><div className="skeleton-line w60" /><div className="skeleton-line w40" /><div className="skeleton-line w80" /></div>;
}

const divisions = [
  { name: 'Bloodstrike', code: 'BS', Logo: BloodstrikeLogo, type: 'FPS / Tactical', status: 'Active', copy: 'Fast entries, clean comms, and weekly team play.' },
  { name: 'Valorant', code: 'VAL', Logo: ValorantLogo, type: 'Tactical shooter', status: 'Active', copy: 'Build better habits through structured scrim sessions.' },
  { name: 'PUBG Mobile', code: 'PUBG', Logo: PubgLogo, type: 'Battle royale', status: 'Active', copy: 'Rotate together, communicate clearly, finish stronger.' },
  { name: 'Roblox', code: 'RBLX', Logo: RobloxLogo, type: 'Community play', status: 'Community', copy: 'A lighter lane for events, friends, and creative play.' }
];

const scrims = [
  { day: 'FRI', game: 'Bloodstrike', time: '20:00 WIB', slots: 12, maxSlots: 16 },
  { day: 'SAT', game: 'Valorant', time: '19:30 WIB', slots: 16, maxSlots: 16 },
  { day: 'SUN', game: 'PUBG Mobile', time: '21:00 WIB', slots: 8, maxSlots: 16 }
];

const rules = [
  { num: '01', title: 'Respect All Players', desc: 'Strictly no toxicity, harassment, hate speech, or harmful behavior towards fellow members.' },
  { num: '02', title: 'Clean Comms & Teamwork', desc: 'Prioritize effective communication during games. No unnecessary blaming or venting during matches.' },
  { num: '03', title: 'Fair Play & Sportsmanship', desc: 'No cheats, hacks, or exploits of any kind. Win cleanly, lose with honor.' },
  { num: '04', title: 'Active Participation', desc: 'Routinely join Discord Voice Channels and participate in weekly community scrims and events.' }
];

const faqs = [
  { q: 'Is joining Midnight Community free?', a: 'Yes. Midnight Community is 100% free and open to anyone looking to improve and play together.' },
  { q: 'Is there a minimum rank required to join?', a: 'No minimum rank required for community members. The most important thing is a clean play style and willingness to learn.' },
  { q: 'How do I sign up for weekly scrims?', a: 'You can register through the Scrims section form on this website, or confirm your team directly in our Discord server.' },
  { q: 'What games are active in Midnight?', a: 'Our currently active divisions include Bloodstrike (PC & Mobile), Valorant, PUBG Mobile, and Roblox.' },
  { q: 'How long does member application processing take?', a: 'Our admin team will process applications and reach out via Discord within 24 hours.' }
];

const achievements = [
  { title: 'Bloodstrike Community Cup #3', place: '🥇 1st Place', date: 'Aug 2026', team: 'MID Core' },
  { title: 'Valorant Rookie Series S2', place: '🥈 2nd Place', date: 'Jul 2026', team: 'MID Valorant' },
  { title: 'PUBG Mobile Scrims League', place: '🏆 Champion', date: 'Jun 2026', team: 'MID PUBG' },
  { title: 'Bloodstrike Inter-Community War', place: '🥉 3rd Place', date: 'May 2026', team: 'MID BS Mobile' },
];

const highlights = [
  { title: 'MID Core ACE Clutch — Bloodstrike', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', game: 'Bloodstrike' },
  { title: 'Valorant 1v4 Comeback — Finals', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', game: 'Valorant' },
  { title: 'PUBG Mobile Final Circle Win', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', game: 'PUBG Mobile' },
];

const leaderboardData = [
  { rank: 1, name: 'MID◆Luffy', game: 'Bloodstrike PC', score: '2,840 pts', role: 'IGL / Core' },
  { rank: 2, name: 'MidnightZero', game: 'Valorant', score: '2,610 pts', role: 'Duelist' },
  { rank: 3, name: 'Valkyrie99', game: 'PUBG Mobile', score: '2,450 pts', role: 'Rusher' },
  { rank: 4, name: 'ShadowKev', game: 'Bloodstrike Mobile', score: '2,310 pts', role: 'Sniper' },
  { rank: 5, name: 'AstroBoy', game: 'Roblox', score: '2,100 pts', role: 'Member' },
];

const newsArticles = [
  { title: 'Midnight Core Secures Victory in Bloodstrike Cup #3', date: 'Sep 02, 2026', tag: 'TOURNAMENT', snippet: 'An intense 5-map grand final series ended with Midnight Core taking the trophy and a 10M IDR prize pool.' },
  { title: 'Valorant Division Opens Recruitment for Season 4', date: 'Aug 28, 2026', tag: 'COMMUNITY', snippet: 'Looking for dedicated players aiming to compete in regional amateur leagues. Apply through our Discord.' },
  { title: 'PUBG Mobile Weekly Scrim Rules Update', date: 'Aug 15, 2026', tag: 'SCRIMS', snippet: 'Updated point allocation system and lobby access protocols to ensure fair play and smooth scheduling.' },
];

const partners = [
  { name: 'Discord', role: 'COMMUNITY HUB' },
  { name: 'Logitech G', role: 'PERIPHERALS' },
  { name: 'ROG Indonesia', role: 'HARDWARE' },
  { name: 'Monster Energy', role: 'BEVERAGE' },
];

function App() {
  const [members, setMembers] = useState([]);
  const [memberState, setMemberState] = useState('loading');
  const [leaderboard, setLeaderboard] = useState(leaderboardData);
  const [achievementsList, setAchievementsList] = useState(achievements);
  const [newsList, setNewsList] = useState(newsArticles);
  const [query, setQuery] = useState('');
  const [gameFilter, setGameFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [mobileNav, setMobileNav] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [scrimGame, setScrimGame] = useState('');
  const [activeClip, setActiveClip] = useState(null);
  const [notice, setNotice] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [announcement, setAnnouncement] = useState('🏆 Bloodstrike Community Cup #4 — Registration open until September 15, 2026!');

  useEffect(() => {
    fetch('/api/members')
      .then(response => {
        if (!response.ok) throw new Error('Database unavailable');
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length) {
          setMembers(data);
          setMemberState('ready');
        }
      })
      .catch(() => setMemberState('offline'));

    fetch('/api/leaderboard')
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLeaderboard(data);
        }
      })
      .catch(() => {});

    fetch('/api/achievements')
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAchievementsList(data);
        }
      })
      .catch(() => {});

    fetch('/api/news')
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNewsList(data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredMembers = members.filter(member => {
    const text = `${member.nama || ''} ${member.role || ''} ${member.game || ''} ${member.bio || ''}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesGame = gameFilter === 'All' || (member.game || '').toLowerCase().includes(gameFilter.toLowerCase());
    const matchesRole = roleFilter === 'All' 
      ? true 
      : roleFilter === 'Staff/Core' 
        ? /admin|founder|core|staff|streamer/i.test(member.role || '')
        : !( /admin|founder|core|staff|streamer/i.test(member.role || '') );
    return matchesQuery && matchesGame && matchesRole;
  });
  const displayedMembers = showAll ? filteredMembers : filteredMembers.slice(0, 8);

  const roleCategories = ['All', 'Staff/Core', 'Regular Member'];

  const gameCategories = ['All', ...new Set(members.map(m => {
    const g = (m.game || '').toLowerCase();
    if (g.includes('bloodstrike') && g.includes('pc')) return 'Bloodstrike PC';
    if (g.includes('bloodstrike') && g.includes('mobile')) return 'Bloodstrike Mobile';
    if (g.includes('blood strike') && g.includes('pc')) return 'Bloodstrike PC';
    if (g.includes('blood strike') && g.includes('mobile')) return 'Bloodstrike Mobile';
    if (g.includes('bloodstrike')) return 'Bloodstrike';
    if (g.includes('blood strike')) return 'Bloodstrike';
    return m.game || 'Others';
  }).filter(Boolean))];

  const stats = {
    total: members.length,
    admins: members.filter(m => /admin|founder|core|staff|streamer/i.test(m.role)).length,
    games: new Set(members.map(m => (m.game || '').replace(/\s*(pc|mobile)\s*/gi, '').trim().toLowerCase())).size,
  };

  const [cTotal, cTotalRef] = useCounter(memberState === 'ready' ? stats.total : 1);
  const [cAdmins, cAdminsRef] = useCounter(memberState === 'ready' ? stats.admins : 2);
  const [cGames, cGamesRef] = useCounter(memberState === 'ready' ? stats.games : 3);

  const closeNav = () => setMobileNav(false);
  const showNotice = message => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div className="app-shell">
      <ScrollProgress />
      <AnnouncementBanner text={announcement} onClose={() => setAnnouncement('')} />
      <header className="site-header">
        <a className="brand" href="#top" onClick={closeNav}>
          <span className="brand-mark"><MidnightLogo size={20} /></span>
          <span><strong>MIDNIGHT</strong><small>COMMUNITY / 2026</small></span>
        </a>
        <button className="nav-toggle" aria-label="Buka navigasi" aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}>☰</button>
        <nav className={mobileNav ? 'site-nav is-open' : 'site-nav'}>
          <a href="#divisions" onClick={closeNav}>Divisions</a>
          <a href="#scrims" onClick={closeNav}>Scrims</a>
          <a href="#roster" onClick={closeNav}>Roster</a>
          <a href="#highlights" onClick={closeNav}>Clips</a>
          <a href="#leaderboard" onClick={closeNav}>Ranking</a>
          <a href="#news" onClick={closeNav}>News</a>
          <a href="#achievements" onClick={closeNav}>Achievements</a>
          <a href="#rules" onClick={closeNav}>Rules</a>
          <a href="#faq" onClick={closeNav}>FAQ</a>
          <a className="nav-action" href="#join" onClick={closeNav}>Join Discord <span>↗</span></a>
          <button className="text-button admin-nav-btn" onClick={() => setAdminOpen(true)}>Admin Portal</button>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-frame">
          <HeroParticles />
          <div className="hero-kicker"><span className="live-dot" /> Esports Community / Indonesia</div>
          <div className="hero-grid">
            <div>
              <h1>Make your<br /><em>midnight</em><br />count.</h1>
            </div>
            <div className="hero-intro">
              <p className="lead">A serious place to play better, meet your people, and build something after dark.</p>
              <p>Midnight is an inclusive esports community for Bloodstrike, Valorant, PUBG Mobile, and Roblox.</p>
              <div className="hero-actions"><a className="button button-primary" href="#divisions">Explore divisions <span>↓</span></a><button className="text-button" onClick={() => setJoinOpen(true)}>Join now <span>→</span></button></div>
            </div>
          </div>
          <div className="hero-meta"><span>01 — EST. 2024</span><span>OPEN COMMUNITY</span><span>JAKARTA / ONLINE</span></div>
        </section>

        <section className="signal-strip section-frame" id="about">
          <div><strong>{memberState === 'ready' ? String(stats.total).padStart(2, '0') : '01'}</strong><span>Members</span><p>Active players registered in the Midnight community database.</p></div>
          <div><strong>{memberState === 'ready' ? String(stats.admins).padStart(2, '0') : '02'}</strong><span>Staff & Core</span><p>Admins, founders, and core members driving the community.</p></div>
          <div><strong>{memberState === 'ready' ? String(stats.games).padStart(2, '0') : '03'}</strong><span>Games</span><p>Active games played within the community.</p></div>
        </section>

        <section className="content-section section-frame" id="divisions">
          <div className="section-heading"><span>02 / PLAY</span><h2>Choose your lane.</h2><p>Each division has a distinct playstyle and rhythm.</p></div>
          <div className="division-list">{divisions.map((division, index) => <article className="division-row" key={division.name}><span className="row-index">0{index + 1}</span><div className="division-code" title={division.code}><division.Logo size={32} /></div><div className="division-main"><h3>{division.name}</h3><p>{division.copy}</p></div><div className="division-type"><span>{division.type}</span><b className={division.status === 'Active' ? 'status-active' : ''}>{division.status}</b></div><span className="row-arrow">↗</span></article>)}</div>
        </section>

        <section className="content-section section-frame" id="scrims">
          <div className="section-heading split-heading"><div><span>03 / SCHEDULE & SLOTS</span><h2>Show up. Play sharp.</h2></div><p>Weekly community schedule with real-time slot counter. Register early to secure your spot.</p></div>
          <div className="scrim-grid">{scrims.map((scrim) => {
            const isFull = scrim.slots >= scrim.maxSlots;
            return (
              <button 
                className={`scrim-row ${isFull ? 'is-full' : ''}`} 
                key={scrim.game} 
                disabled={isFull}
                onClick={() => setScrimGame(`${scrim.game} Scrim / ${scrim.time}`)}
              >
                <strong>{scrim.day}</strong>
                <div>
                  <h3>{scrim.game} Scrim</h3>
                  <p>Weekly session / open for registered teams</p>
                </div>
                <div className="scrim-slot-badge">
                  <time>{scrim.time}</time>
                  <span className={`slot-count ${isFull ? 'full' : ''}`}>
                    {isFull ? 'LOBBY FULL' : `${scrim.slots}/${scrim.maxSlots} SLOTS`}
                  </span>
                </div>
                <span>{isFull ? '✕' : '→'}</span>
              </button>
            );
          })}</div>
        </section>

        <section className="content-section section-frame" id="roster">
          <div className="section-heading split-heading"><div><span>04 / ROSTER</span><h2>People make<br />the night.</h2></div><a className="text-button" href="#database">View database <span>↗</span></a></div>
          <div className="roster-toolbar"><p>{memberState === 'ready' ? `${filteredMembers.length} member${filteredMembers.length !== 1 ? 's' : ''}${gameFilter !== 'All' ? ` · ${gameFilter}` : ''}${roleFilter !== 'All' ? ` · ${roleFilter}` : ''} from community database` : memberState === 'offline' ? 'Database offline' : 'Connecting to database...'}</p><label><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search member" /></label></div>
          {memberState === 'ready' && (
            <div className="filter-wrapper">
              <div className="game-filter">
                <span className="filter-label">GAME:</span>
                {gameCategories.map(g => <button key={g} className={gameFilter === g ? 'filter-btn active' : 'filter-btn'} onClick={() => { setGameFilter(g); setShowAll(false); }}>{g}</button>)}
              </div>
              <div className="game-filter role-filter-row">
                <span className="filter-label">ROLE:</span>
                {roleCategories.map(r => <button key={r} className={roleFilter === r ? 'filter-btn active' : 'filter-btn'} onClick={() => { setRoleFilter(r); setShowAll(false); }}>{r}</button>)}
              </div>
            </div>
          )}
          <div className="member-grid" id="database">{memberState === 'loading' && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}{memberState === 'ready' && displayedMembers.map((member, index) => <article className="member-card" key={`${member.nama}-${index}`} onClick={() => setSelectedMember(member)}>
            <div className="member-card-head"><div className="member-avatar">{(member.nama || '?').charAt(0).toUpperCase()}</div><div className="member-card-badge">{/admin|founder|core|staff|streamer/i.test(member.role) ? '★' : ''}</div></div>
            <h3>{member.nama}</h3>
            <p className="member-role">{member.role || 'Member'}</p>
            <p className="member-game">{member.game || 'Midnight'}</p>
            {member.bio && <p className="member-bio">{member.bio}</p>}
            <div className="member-socials">
              {member.ig && <a href={member.ig.startsWith('http') ? member.ig : `https://instagram.com/${member.ig}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} title="Instagram">IG</a>}
              {member.tt && <a href={member.tt.startsWith('http') ? member.tt : `https://tiktok.com/@${member.tt}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} title="TikTok">TT</a>}
              {member.yt && member.yt.toLowerCase() !== 'ga punya' && member.yt.toLowerCase() !== 'kosyong jirrrr' && <a href={member.yt.startsWith('http') ? member.yt : `https://youtube.com/@${member.yt}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} title="YouTube">YT</a>}
            </div>
          </article>)}{memberState === 'offline' && <div className="empty-state">Member database unavailable. Please refresh in a moment.</div>}{memberState === 'ready' && !filteredMembers.length && <div className="empty-state">No members matching search query.</div>}</div>
          {memberState === 'ready' && filteredMembers.length > 8 && !showAll && <div className="show-all-wrap"><button className="button button-primary" onClick={() => setShowAll(true)}>Show all {filteredMembers.length} members <span>↓</span></button></div>}
        </section>

        <section className="content-section section-frame" id="highlights">
          <div className="section-heading"><span>05 / HIGHLIGHTS</span><h2>Community Clips.</h2><p>Best gameplay moments from Midnight players.</p></div>
          <div className="highlights-grid">
            {highlights.map((clip, idx) => (
              <div className="highlight-card" key={idx} onClick={() => setActiveClip(clip)} style={{ cursor: 'pointer' }}>
                <div className="highlight-thumb">
                  <div className="highlight-play">▶</div>
                </div>
                <div className="highlight-info">
                  <h3>{clip.title}</h3>
                  <p>{clip.game}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section section-frame" id="leaderboard">
          <div className="section-heading"><span>06 / RANKING</span><h2>Community Leaderboard.</h2><p>Top active players and contributors this month.</p></div>
          <div className="leaderboard-grid">
            {leaderboard.map((user, idx) => (
              <div className="leaderboard-row" key={idx}>
                <span className={`leaderboard-rank top-${user.rank || idx + 1}`}>#{user.rank || idx + 1}</span>
                <div className="leaderboard-user">
                  {user.name}
                  <small>{user.game}</small>
                </div>
                <span className="leaderboard-badge">{user.role}</span>
                <span className="leaderboard-score">{user.score}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section section-frame" id="news">
          <div className="section-heading"><span>07 / LATEST</span><h2>Community News.</h2><p>Updates, recap articles, and announcement posts from Midnight staff.</p></div>
          <div className="news-grid">
            {newsList.map((article, idx) => (
              <article className="news-card" key={idx}>
                <div className="news-tag">{article.tag}</div>
                <h3>{article.title}</h3>
                <p>{article.snippet}</p>
                <time className="news-date">{article.date}</time>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section section-frame" id="achievements">
          <div className="section-heading"><span>08 / TRACK RECORD</span><h2>Community Achievements.</h2><p>Tournament records and competitive milestones won by Midnight teams.</p></div>
          <div className="achievements-grid">
            {achievementsList.map((item, idx) => (
              <div className="achievement-card" key={idx}>
                <div className="achievement-place">{item.place}</div>
                <h3>{item.title}</h3>
                <div className="achievement-meta">
                  <span>{item.team}</span>
                  <time>{item.date}</time>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section section-frame" id="partners">
          <div className="section-heading"><span>09 / NETWORK</span><h2>Partners & Supporters.</h2><p>Organizations and brands powering the Midnight esports ecosystem.</p></div>
          <div className="partners-grid">
            {partners.map((p, idx) => (
              <div className="partner-card" key={idx}>
                <strong>{p.name}</strong>
                <span>{p.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section section-frame" id="rules">
          <div className="section-heading"><span>08 / GUIDELINES</span><h2>Community Rules.</h2><p>Core guidelines for maintaining a healthy and competitive playing environment.</p></div>
          <div className="rules-grid">
            {rules.map(rule => <div className="rule-card" key={rule.num}>
              <span className="rule-num">{rule.num}</span>
              <h3>{rule.title}</h3>
              <p>{rule.desc}</p>
            </div>)}
          </div>
        </section>

        <section className="content-section section-frame" id="faq">
          <div className="section-heading"><span>09 / QUESTIONS</span><h2>Frequently Asked.</h2><p>Common questions regarding membership and Midnight activities.</p></div>
          <div className="faq-list">
            {faqs.map((faq, idx) => <div className={openFaq === idx ? 'faq-item is-open' : 'faq-item'} key={idx} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div className="faq-question">
                <h3>{faq.q}</h3>
                <span className="faq-icon">{openFaq === idx ? '−' : '+'}</span>
              </div>
              {openFaq === idx && <div className="faq-answer"><p>{faq.a}</p></div>}
            </div>)}
          </div>
        </section>

        <section className="join-section section-frame" id="join"><div><span>10 / JOIN</span><h2>There is room<br />for you here.</h2></div><div><p>Join our Discord server, introduce yourself, and pick your main game lane. Membership is free.</p><button className="button button-primary" onClick={() => setJoinOpen(true)}>Join now <span>↗</span></button></div></section>
      </main>

      <footer className="site-footer"><span>© 2026 Midnight Community</span><span>Built for the after-hours players.</span><a href="https://discord.gg/sH4WESmjMK" target="_blank" rel="noreferrer">Discord ↗</a></footer>
      <BackToTop />
      {notice && <div className="toast">{notice}</div>}
      {joinOpen && <JoinModal onClose={() => setJoinOpen(false)} onNotice={showNotice} />}
      {scrimGame && <ScrimModal event={scrimGame} onClose={() => setScrimGame('')} onNotice={showNotice} />}
      {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      {activeClip && <ClipModal clip={activeClip} onClose={() => setActiveClip(null)} />}
      {adminOpen && <AdminModal onClose={() => setAdminOpen(false)} onUpdateBanner={(txt) => setAnnouncement(txt)} onNotice={showNotice} />}
      <ChatBubble />
    </div>
  );
}

function JoinModal({ onClose, onNotice }) {
  const [form, setForm] = useState({ ign: '', discord: '', email: '', game: 'Bloodstrike PC', motivasi: '' });
  const [sending, setSending] = useState(false);
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async event => {
    event.preventDefault();
    setSending(true);
    const labels = { ign: 'IGN / In-Game Name', discord: 'Discord Username', email: 'Email', game: 'Main Game', motivasi: 'Motivation' };
    const fields = Object.entries(form)
      .filter(([_, value]) => value.trim())
      .map(([name, value]) => ({ name: labels[name] || name.toUpperCase(), value: `\`${value}\``, inline: name !== 'motivasi' }));

    const payload = {
      embeds: [{
        title: '📋 NEW MEMBER REGISTRATION — MIDNIGHT COMMUNITY',
        color: 12906586,
        description: 'New member registration submitted via Midnight Community website.',
        fields,
        footer: { text: 'Midnight Community System • Registration Form' },
        timestamp: new Date().toISOString()
      }]
    };
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'registration', payload })
      });
      if (!response.ok) throw new Error();
      onNotice('Member application sent! Check Discord within 24 hours.');
      onClose();
    } catch {
      onNotice('Failed to submit application. Please check backend connection.');
    } finally {
      setSending(false);
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}><div className="join-modal" role="dialog" aria-modal="true" aria-labelledby="join-title"><button className="modal-close" onClick={onClose} aria-label="Close">×</button><span>ENTRY FORM / NEW MEMBER</span><h2 id="join-title">Join Midnight.</h2><p>Fill out the form below to become a member of Midnight Community.</p><form onSubmit={submit}>
    <label>IGN / In-Game Name<input name="ign" value={form.ign} onChange={update} placeholder="e.g. MID◆Luffy" required /></label>
    <label>Discord Username<input name="discord" value={form.discord} onChange={update} placeholder="username / user#1234" required /></label>
    <label>Email<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
    <label>Main Game<select name="game" value={form.game} onChange={update}><option>Bloodstrike PC</option><option>Bloodstrike Mobile</option><option>Valorant</option><option>PUBG Mobile</option><option>Roblox</option><option>Mobile Legends</option></select></label>
    <label>Motivation to Join<input name="motivasi" value={form.motivasi} onChange={update} placeholder="Why do you want to join Midnight Community?" required /></label>
    <button type="submit" className="button button-primary" disabled={sending}>{sending ? 'Submitting...' : 'Submit Application ↗'}</button>
  </form></div></div>;
}

function ScrimModal({ event, onClose, onNotice }) {
  const [form, setForm] = useState({ team: '', contact: '', p1: '', p2: '', p3: '', p4: '', sub: '' });
  const [sending, setSending] = useState(false);
  const update = input => setForm({ ...form, [input.target.name]: input.target.value });
  const submit = async input => {
    input.preventDefault();
    setSending(true);
    const labels = { team: 'Nama Tim', contact: 'Kontak Manager (Discord)', p1: 'Captain (Player 1)', p2: 'Player 2', p3: 'Player 3', p4: 'Player 4', sub: 'Cadangan (Sub)' };
    const fields = Object.entries(form)
      .filter(([_, value]) => value.trim())
      .map(([name, value]) => ({ name: labels[name] || name.toUpperCase(), value: `\`${value}\``, inline: name !== 'team' }));

    const payload = {
      embeds: [{
        title: `⚔️ PENDAFTARAN SCRIM — ${event}`,
        color: 16744550,
        description: `Tim baru mendaftar untuk **${event}**.`,
        fields,
        footer: { text: 'Midnight Community System • Form Scrim' },
        timestamp: new Date().toISOString()
      }]
    };
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'scrim', payload })
      });
      if (!response.ok) throw new Error();
      onNotice('Team scrim registration sent to Discord.');
      onClose();
    } catch {
      onNotice('Failed to send scrim registration. Please check backend connection.');
    } finally {
      setSending(false);
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={input => input.target === input.currentTarget && onClose()}><div className="join-modal" role="dialog" aria-modal="true" aria-labelledby="scrim-title"><button className="modal-close" onClick={onClose} aria-label="Close">×</button><span>SCRIM ENTRY / {event}</span><h2 id="scrim-title">Register Team.</h2><p>Provide your team name, captain contact, and roster details.</p><form onSubmit={submit}>
    <label>Team Name<input name="team" value={form.team} onChange={update} placeholder="e.g. Midnight Core" required /></label>
    <label>Manager / Captain Contact (Discord)<input name="contact" value={form.contact} onChange={update} placeholder="username / user#1234" required /></label>
    <label>Captain (Player 1)<input name="p1" value={form.p1} onChange={update} placeholder="IGN Captain / IGL" required /></label>
    <label>Player 2<input name="p2" value={form.p2} onChange={update} placeholder="IGN Player 2" required /></label>
    <label>Player 3<input name="p3" value={form.p3} onChange={update} placeholder="IGN Player 3" required /></label>
    <label>Player 4<input name="p4" value={form.p4} onChange={update} placeholder="IGN Player 4" required /></label>
    <label>Substitute Player (optional)<input name="sub" value={form.sub} onChange={update} placeholder="IGN Substitute Player" /></label>
    <button type="submit" className="button button-primary" disabled={sending}>{sending ? 'Submitting...' : 'Submit Scrim Registration ↗'}</button>
  </form></div></div>;
}

function MemberModal({ member, onClose }) {
  const socialLink = (url, fallback, label) => {
    if (!url || /ga punya|kosyong/i.test(url)) return null;
    const href = url.startsWith('http') ? url : `${fallback}${url}`;
    return <a href={href} target="_blank" rel="noreferrer" className="member-modal-social">{label} <span>↗</span></a>;
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="join-modal member-modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose} aria-label="Tutup">×</button>
    <div className="member-modal-header"><div className="member-avatar member-avatar-lg">{(member.nama || '?').charAt(0).toUpperCase()}</div><div><span className="member-modal-badge">{member.role || 'Member'}</span><h2>{member.nama}</h2><p>{member.game || 'Midnight'}</p></div></div>
    {member.bio && <div className="member-modal-section"><span>BIO</span><p>{member.bio}</p></div>}
    {member.achievements && <div className="member-modal-section"><span>ACHIEVEMENTS</span><p>{member.achievements}</p></div>}
    <div className="member-modal-links">
      {socialLink(member.ig, 'https://instagram.com/', 'Instagram')}
      {socialLink(member.tt, 'https://tiktok.com/@', 'TikTok')}
      {socialLink(member.yt, 'https://youtube.com/@', 'YouTube')}
    </div>
  </div></div>;
}

function ClipModal({ clip, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="join-modal clip-modal" style={{ maxWidth: '800px', padding: '24px' }} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <span style={{ color: 'var(--acid)', fontSize: '.68rem', letterSpacing: '1.5px' }}>GAMEPLAY HIGHLIGHT / {clip.game.toUpperCase()}</span>
        <h2 style={{ fontSize: '1.6rem', margin: '8px 0 16px' }}>{clip.title}</h2>
        <div className="video-responsive-wrap">
          <iframe
            src={clip.embedUrl}
            title={clip.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function AdminModal({ onClose, onUpdateBanner, onNotice }) {
  const [pass, setPass] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [bannerInput, setBannerInput] = useState('');

  const login = (e) => {
    e.preventDefault();
    if (pass === 'midnight2026') {
      setAuthenticated(true);
      onNotice('Admin authenticated successfully.');
    } else {
      onNotice('Incorrect Admin Key.');
    }
  };

  const update = (e) => {
    e.preventDefault();
    onUpdateBanner(bannerInput);
    onNotice('Announcement banner updated!');
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="join-modal" style={{ maxWidth: '580px' }} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <span>INTERNAL / ADMIN PORTAL</span>
        <h2>Admin Portal.</h2>
        {!authenticated ? (
          <form onSubmit={login}>
            <label>Admin Security Key
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter admin key..." required />
            </label>
            <button type="submit" className="button button-primary">Unlock Portal 🔓</button>
          </form>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            <form onSubmit={update}>
              <label>Update Banner Announcement
                <input value={bannerInput} onChange={e => setBannerInput(e.target.value)} placeholder="Enter new banner text..." required />
              </label>
              <button type="submit" className="button button-primary" style={{ marginTop: '8px' }}>Save Banner 💾</button>
            </form>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
              <span style={{ color: 'var(--acid)', fontSize: '.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>DATABASE MANAGEMENT (GOOGLE SHEETS CRUD)</span>
              <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '14px' }}>Click any link below to Edit, Add, or Delete entries directly in Google Sheets:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/edit#gid=1851270134" target="_blank" rel="noreferrer" className="button" style={{ justifyContent: 'space-between' }}>
                  <span>📋 Manage Member Roster</span>
                  <span>Open Sheet ↗</span>
                </a>
                <a href="https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/edit#gid=2046397247" target="_blank" rel="noreferrer" className="button" style={{ justifyContent: 'space-between' }}>
                  <span>📊 Manage Leaderboard & Ranking</span>
                  <span>Open Sheet ↗</span>
                </a>
                <a href="https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/edit#gid=990758237" target="_blank" rel="noreferrer" className="button" style={{ justifyContent: 'space-between' }}>
                  <span>🏆 Manage Achievements</span>
                  <span>Open Sheet ↗</span>
                </a>
                <a href="https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/edit#gid=1032271976" target="_blank" rel="noreferrer" className="button" style={{ justifyContent: 'space-between' }}>
                  <span>📰 Manage Community News</span>
                  <span>Open Sheet ↗</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
