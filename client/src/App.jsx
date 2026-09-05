import { useEffect, useState } from 'react';
import ChatBubble from './ChatBubble';
import { MidnightLogo, BloodstrikeLogo, ValorantLogo, PubgLogo, RobloxLogo } from './Logo';

const divisions = [
  { name: 'Bloodstrike', code: 'BS', Logo: BloodstrikeLogo, type: 'FPS / Tactical', status: 'Active', copy: 'Fast entries, clean comms, and weekly team play.' },
  { name: 'Valorant', code: 'VAL', Logo: ValorantLogo, type: 'Tactical shooter', status: 'Active', copy: 'Build better habits through structured scrim sessions.' },
  { name: 'PUBG Mobile', code: 'PUBG', Logo: PubgLogo, type: 'Battle royale', status: 'Active', copy: 'Rotate together, communicate clearly, finish stronger.' },
  { name: 'Roblox', code: 'RBLX', Logo: RobloxLogo, type: 'Community play', status: 'Community', copy: 'A lighter lane for events, friends, and creative play.' }
];

const scrims = [
  ['FRI', 'Bloodstrike', '20:00 WIB'],
  ['SAT', 'Valorant', '19:30 WIB'],
  ['SUN', 'PUBG Mobile', '21:00 WIB']
];

const rules = [
  { num: '01', title: 'Respect All Players', desc: 'Dilarang keras melakukan toxic, SARA, harassment, atau perilaku merugikan sesama anggota.' },
  { num: '02', title: 'Clean Comms & Teamwork', desc: 'Utamakan komunikasi yang efektif saat bermain. Tidak asal blaming atau meluapkan emosi saat match.' },
  { num: '03', title: 'Fair Play & Sportsmanship', desc: 'Tanpa cheat, hack, atau exploit apapun. Menang secara bersih, kalah secara terhormat.' },
  { num: '04', title: 'Active Participation', desc: 'Rutin meramaikan Voice Channel Discord dan ikut dalam scrim atau event komunitas mingguan.' }
];

const faqs = [
  { q: 'Apakah bergabung di Midnight Community berbayar?', a: 'Tidak. Komunitas Midnight 100% gratis dan terbuka untuk siapa saja yang ingin berkembang bersama.' },
  { q: 'Apakah ada minimal rank untuk mendaftar?', a: 'Tidak ada minimal rank untuk community member. Yang terpenting adalah keinginan untuk bermain bersih dan mau belajar.' },
  { q: 'Bagaimana cara mendaftar scrim mingguan?', a: 'Kamu bisa mendaftar lewat form di website ini pada bagian Scrims, atau konfirmasi tim kamu secara langsung di server Discord.' },
  { q: 'Game apa saja yang ada di Midnight?', a: 'Saat ini divisi aktif kami meliputi Bloodstrike (PC & Mobile), Valorant, PUBG Mobile, dan Roblox.' },
  { q: 'Berapa lama proses pendaftaran anggota diproses?', a: 'Tim admin kami akan memproses pendaftaran dan menghubungi kamu lewat Discord dalam 1×24 jam.' }
];

function App() {
  const [members, setMembers] = useState([]);
  const [memberState, setMemberState] = useState('loading');
  const [query, setQuery] = useState('');
  const [gameFilter, setGameFilter] = useState('All');
  const [mobileNav, setMobileNav] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [scrimGame, setScrimGame] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
  }, []);

  const filteredMembers = members.filter(member => {
    const text = `${member.nama || ''} ${member.role || ''} ${member.game || ''} ${member.bio || ''}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesGame = gameFilter === 'All' || (member.game || '').toLowerCase().includes(gameFilter.toLowerCase());
    return matchesQuery && matchesGame;
  });
  const displayedMembers = showAll ? filteredMembers : filteredMembers.slice(0, 8);

  const gameCategories = ['All', ...new Set(members.map(m => {
    const g = (m.game || '').toLowerCase();
    if (g.includes('bloodstrike') && g.includes('pc')) return 'Bloodstrike PC';
    if (g.includes('bloodstrike') && g.includes('mobile')) return 'Bloodstrike Mobile';
    if (g.includes('blood strike') && g.includes('pc')) return 'Bloodstrike PC';
    if (g.includes('blood strike') && g.includes('mobile')) return 'Bloodstrike Mobile';
    if (g.includes('bloodstrike')) return 'Bloodstrike';
    if (g.includes('blood strike')) return 'Bloodstrike';
    return m.game || 'Lainnya';
  }).filter(Boolean))];

  const stats = {
    total: members.length,
    admins: members.filter(m => /admin|founder|core|staff|streamer/i.test(m.role)).length,
    games: new Set(members.map(m => (m.game || '').replace(/\s*(pc|mobile)\s*/gi, '').trim().toLowerCase())).size,
  };

  const closeNav = () => setMobileNav(false);
  const showNotice = message => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div className="app-shell">
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
          <a href="#rules" onClick={closeNav}>Rules</a>
          <a href="#faq" onClick={closeNav}>FAQ</a>
          <a className="nav-action" href="#join" onClick={closeNav}>Join Discord <span>↗</span></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-frame">
          <div className="hero-kicker"><span className="live-dot" /> Community esport / Indonesia</div>
          <div className="hero-grid">
            <div>
              <h1>Make your<br /><em>midnight</em><br />count.</h1>
            </div>
            <div className="hero-intro">
              <p className="lead">A serious place to play better, meet your people, and build something after dark.</p>
              <p>Midnight adalah komunitas esport inklusif untuk Bloodstrike, Valorant, PUBG Mobile, dan Roblox.</p>
              <div className="hero-actions"><a className="button button-primary" href="#divisions">Explore divisions <span>↓</span></a><button className="text-button" onClick={() => setJoinOpen(true)}>Bergabung sekarang <span>→</span></button></div>
            </div>
          </div>
          <div className="hero-meta"><span>01 — EST. 2024</span><span>OPEN COMMUNITY</span><span>JAKARTA / ONLINE</span></div>
        </section>

        <section className="signal-strip section-frame" id="about">
          <div><strong>{memberState === 'ready' ? String(stats.total).padStart(2, '0') : '01'}</strong><span>Members</span><p>Pemain aktif yang terdaftar di database komunitas Midnight.</p></div>
          <div><strong>{memberState === 'ready' ? String(stats.admins).padStart(2, '0') : '02'}</strong><span>Staff & Core</span><p>Admin, founder, dan core member yang menggerakkan komunitas.</p></div>
          <div><strong>{memberState === 'ready' ? String(stats.games).padStart(2, '0') : '03'}</strong><span>Games</span><p>Jumlah game aktif yang dimainkan di dalam komunitas.</p></div>
        </section>

        <section className="content-section section-frame" id="divisions">
          <div className="section-heading"><span>02 / PLAY</span><h2>Choose your lane.</h2><p>Setiap divisi punya ritme dan jalur bermain yang berbeda.</p></div>
          <div className="division-list">{divisions.map((division, index) => <article className="division-row" key={division.name}><span className="row-index">0{index + 1}</span><div className="division-code" title={division.code}><division.Logo size={32} /></div><div className="division-main"><h3>{division.name}</h3><p>{division.copy}</p></div><div className="division-type"><span>{division.type}</span><b className={division.status === 'Active' ? 'status-active' : ''}>{division.status}</b></div><span className="row-arrow">↗</span></article>)}</div>
        </section>

        <section className="content-section section-frame" id="scrims">
          <div className="section-heading split-heading"><div><span>03 / SCHEDULE</span><h2>Show up. Play sharp.</h2></div><p>Jadwal komunitas mingguan. Konfirmasi slot dan perubahan waktu melalui Discord.</p></div>
          <div className="scrim-grid">{scrims.map(([day, game, time]) => <button className="scrim-row" key={game} onClick={() => setScrimGame(`${game} Scrim / ${time}`)}><strong>{day}</strong><div><h3>{game} Scrim</h3><p>Weekly session / open for registered teams</p></div><time>{time}</time><span>→</span></button>)}</div>
        </section>

        <section className="content-section section-frame" id="roster">
          <div className="section-heading split-heading"><div><span>04 / ROSTER</span><h2>People make<br />the night.</h2></div><a className="text-button" href="#database">View database <span>↗</span></a></div>
          <div className="roster-toolbar"><p>{memberState === 'ready' ? `${filteredMembers.length} member${gameFilter !== 'All' ? ` · ${gameFilter}` : ''} dari database komunitas` : memberState === 'offline' ? 'Database sedang offline' : 'Menghubungkan ke database...'}</p><label><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari member" /></label></div>
          {memberState === 'ready' && <div className="game-filter">{gameCategories.map(g => <button key={g} className={gameFilter === g ? 'filter-btn active' : 'filter-btn'} onClick={() => { setGameFilter(g); setShowAll(false); }}>{g}</button>)}</div>}
          <div className="member-grid" id="database">{memberState === 'ready' && displayedMembers.map((member, index) => <article className="member-card" key={`${member.nama}-${index}`} onClick={() => setSelectedMember(member)}>
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
          </article>)}{memberState === 'offline' && <div className="empty-state">Member database belum bisa diakses. Coba refresh beberapa saat lagi.</div>}{memberState === 'ready' && !filteredMembers.length && <div className="empty-state">Tidak ada member yang cocok dengan pencarian.</div>}</div>
          {memberState === 'ready' && filteredMembers.length > 8 && !showAll && <div className="show-all-wrap"><button className="button button-primary" onClick={() => setShowAll(true)}>Tampilkan semua {filteredMembers.length} member <span>↓</span></button></div>}
        </section>

        <section className="content-section section-frame" id="rules">
          <div className="section-heading"><span>05 / GUIDELINES</span><h2>Community Rules.</h2><p>Aturan dasar untuk menjaga lingkungan bermain yang sehat dan kompetitif.</p></div>
          <div className="rules-grid">
            {rules.map(rule => <div className="rule-card" key={rule.num}>
              <span className="rule-num">{rule.num}</span>
              <h3>{rule.title}</h3>
              <p>{rule.desc}</p>
            </div>)}
          </div>
        </section>

        <section className="content-section section-frame" id="faq">
          <div className="section-heading"><span>06 / QUESTIONS</span><h2>Frequently Asked.</h2><p>Pertanyaan umum seputar keanggotaan dan aktivitas Midnight Community.</p></div>
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

        <section className="join-section section-frame" id="join"><div><span>07 / JOIN</span><h2>There is room<br />for you here.</h2></div><div><p>Masuk ke server Discord, kenalkan diri, lalu pilih jalur bermainmu. Community member tidak dikenakan biaya.</p><button className="button button-primary" onClick={() => setJoinOpen(true)}>Bergabung sekarang <span>↗</span></button></div></section>
      </main>

      <footer className="site-footer"><span>© 2026 Midnight Community</span><span>Built for the after-hours players.</span><a href="https://discord.gg/sH4WESmjMK" target="_blank" rel="noreferrer">Discord ↗</a></footer>
      {notice && <div className="toast">{notice}</div>}
      {joinOpen && <JoinModal onClose={() => setJoinOpen(false)} onNotice={showNotice} />}
      {scrimGame && <ScrimModal event={scrimGame} onClose={() => setScrimGame('')} onNotice={showNotice} />}
      {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
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
    const labels = { ign: 'IGN / In-Game Name', discord: 'Discord Tag', email: 'Email', game: 'Game Utama', motivasi: 'Motivasi Join' };
    const fields = Object.entries(form)
      .filter(([_, value]) => value.trim())
      .map(([name, value]) => ({ name: labels[name] || name.toUpperCase(), value: `\`${value}\``, inline: name !== 'motivasi' }));

    const payload = {
      embeds: [{
        title: '📋 PENDAFTARAN MEMBER BARU — MIDNIGHT COMMUNITY',
        color: 12906586,
        description: 'Pendaftaran anggota baru melalui website Midnight Community.',
        fields,
        footer: { text: 'Midnight Community System • Form Pendaftaran' },
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
      onNotice('Pendaftaran member baru terkirim. Cek Discord dalam 1×24 jam.');
      onClose();
    } catch {
      onNotice('Gagal mengirim pendaftaran. Periksa koneksi backend.');
    } finally {
      setSending(false);
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}><div className="join-modal" role="dialog" aria-modal="true" aria-labelledby="join-title"><button className="modal-close" onClick={onClose} aria-label="Tutup">×</button><span>ENTRY FORM / MEMBER BARU</span><h2 id="join-title">Join Midnight.</h2><p>Isi data singkat untuk menjadi bagian dari komunitas Midnight.</p><form onSubmit={submit}>
    <label>IGN / In-Game Name<input name="ign" value={form.ign} onChange={update} placeholder="contoh: MID◆Luffy" required /></label>
    <label>Discord Username<input name="discord" value={form.discord} onChange={update} placeholder="username / user#1234" required /></label>
    <label>Email<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
    <label>Game Utama<select name="game" value={form.game} onChange={update}><option>Bloodstrike PC</option><option>Bloodstrike Mobile</option><option>Valorant</option><option>PUBG Mobile</option><option>Roblox</option><option>Mobile Legends</option></select></label>
    <label>Motivasi Join Komunitas<input name="motivasi" value={form.motivasi} onChange={update} placeholder="Mengapa ingin bergabung dengan Midnight Community?" required /></label>
    <button type="submit" className="button button-primary" disabled={sending}>{sending ? 'Mengirim...' : 'Kirim Pendaftaran Member ↗'}</button>
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
      onNotice('Pendaftaran team scrim terkirim ke Discord.');
      onClose();
    } catch {
      onNotice('Gagal mengirim pendaftaran scrim. Periksa koneksi backend.');
    } finally {
      setSending(false);
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={input => input.target === input.currentTarget && onClose()}><div className="join-modal" role="dialog" aria-modal="true" aria-labelledby="scrim-title"><button className="modal-close" onClick={onClose} aria-label="Tutup">×</button><span>SCRIM ENTRY / {event}</span><h2 id="scrim-title">Register Team.</h2><p>Isi nama tim, kontak manager/kapten, dan roster pemain.</p><form onSubmit={submit}>
    <label>Nama Tim<input name="team" value={form.team} onChange={update} placeholder="contoh: Midnight Core" required /></label>
    <label>Kontak Manager / Kapten (Discord)<input name="contact" value={form.contact} onChange={update} placeholder="username / user#1234" required /></label>
    <label>Captain (Player 1)<input name="p1" value={form.p1} onChange={update} placeholder="IGN Captain / IGL" required /></label>
    <label>Player 2<input name="p2" value={form.p2} onChange={update} placeholder="IGN Player 2" required /></label>
    <label>Player 3<input name="p3" value={form.p3} onChange={update} placeholder="IGN Player 3" required /></label>
    <label>Player 4<input name="p4" value={form.p4} onChange={update} placeholder="IGN Player 4" required /></label>
    <label>Player Cadangan (opsional)<input name="sub" value={form.sub} onChange={update} placeholder="IGN Player Substitute" /></label>
    <button type="submit" className="button button-primary" disabled={sending}>{sending ? 'Mengirim...' : 'Kirim Pendaftaran Scrim ↗'}</button>
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

export default App;
