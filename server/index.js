import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...vals] = line.trim().split('=');
    if (key && vals.length && !process.env[key]) {
      process.env[key] = vals.join('=').trim();
    }
  }
}

const app = express();
const port = Number(process.env.PORT || 8787);
const databaseUrl = process.env.MIDNIGHT_DATABASE_URL || 'https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/export?format=csv&gid=1851270134';
const leaderboardDatabaseUrl = process.env.MIDNIGHT_LEADERBOARD_URL || 'https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/export?format=csv&gid=2046397247';
const achievementsDatabaseUrl = process.env.MIDNIGHT_ACHIEVEMENTS_URL || 'https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/export?format=csv&gid=990758237';
const newsDatabaseUrl = process.env.MIDNIGHT_NEWS_URL || 'https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/export?format=csv&gid=1032271976';
const distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

app.use(express.json({ limit: '24kb' }));

app.get('/api/admin/sheet-link', (_req, res) => {
  res.json({
    membersSheet: 'https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/edit#gid=1851270134',
    leaderboardSheet: 'https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/edit#gid=2046397247',
    achievementsSheet: 'https://docs.google.com/spreadsheets/d/1iCtvJ_ABa3LZjQDefk2dMHBVBIIO9CNI2rQSc30OIvc/edit#gid=990758237'
  });
});

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') { value += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { row.push(value.trim()); value = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; value = '';
    } else value += character;
  }

  if (value || row.length) { row.push(value.trim()); rows.push(row); }
  return rows;
}

app.get('/api/members', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(databaseUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) throw new Error('Database response not ok');
    const rows = parseCsv(await response.text());
    const members = rows.slice(1).map(columns => ({
      nama: columns[1] || '',
      role: columns[2] || 'Member',
      game: columns[3] || 'Midnight',
      bio: columns[4] || 'Anggota resmi Midnight Community.',
      ig: columns[5] || '',
      tt: columns[6] || '',
      yt: columns[7] || '',
      achievements: columns[8] || ''
    })).filter(member => member.nama);
    res.json(members);
  } catch {
    res.status(502).json({ error: 'Unable to reach member database' });
  }
});

app.get('/api/leaderboard', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(leaderboardDatabaseUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) throw new Error('Leaderboard response not ok');
    const rows = parseCsv(await response.text());
    const leaderboard = rows.slice(1).map(columns => ({
      rank: Number(columns[0]) || 1,
      name: columns[1] || '',
      role: columns[2] || 'Member',
      game: columns[3] || 'Midnight',
      score: columns[4] ? `${columns[4]} pts` : '0 pts'
    })).filter(item => item.name);
    res.json(leaderboard);
  } catch {
    res.status(502).json({ error: 'Unable to reach leaderboard database' });
  }
});

app.get('/api/achievements', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(achievementsDatabaseUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) throw new Error('Achievements response not ok');
    const rows = parseCsv(await response.text());
    const medalMap = { '1': '🥇 1st Place', '2': '🥈 2nd Place', '3': '🥉 3rd Place' };
    const items = rows.slice(1).map(columns => {
      const p = (columns[0] || '').trim();
      return {
        place: medalMap[p] || (p ? `🏆 Place #${p}` : '🏆 Winner'),
        title: columns[1] || '',
        team: columns[2] || 'Midnight',
        date: columns[3] || '2026'
      };
    }).filter(item => item.title);
    res.json(items);
  } catch {
    res.status(502).json({ error: 'Unable to reach achievements database' });
  }
});

app.get('/api/news', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(newsDatabaseUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) throw new Error('News response not ok');
    const rows = parseCsv(await response.text());
    const news = rows.slice(1).map(columns => ({
      tag: (columns[0] || 'COMMUNITY').toUpperCase(),
      title: columns[1] || '',
      snippet: columns[2] || '',
      date: columns[3] || '2026'
    })).filter(item => item.title);
    res.json(news);
  } catch {
    res.status(502).json({ error: 'Unable to reach news database' });
  }
});

function getEnv(key) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const [k, ...vals] = line.trim().split('=');
      if (k === key) return vals.join('=').trim();
    }
  }
  return process.env[key];
}

app.post('/api/submit', async (req, res) => {
  const webhook = req.body?.type === 'registration'
    ? getEnv('DISCORD_REGISTRATION_WEBHOOK')
    : req.body?.type === 'scrim'
      ? getEnv('DISCORD_SCRIM_WEBHOOK')
      : null;

  if (!webhook || !req.body?.payload?.embeds?.length) {
    return res.status(webhook ? 400 : 503).json({ error: webhook ? 'Invalid submission' : 'Discord webhook is not configured' });
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body.payload)
    });
    if (!response.ok && response.status !== 204) return res.status(502).json({ error: 'Notification failed' });
    res.json({ ok: true });
  } catch {
    res.status(502).json({ error: 'Unable to reach notification service' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.use((_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(port, () => console.log(`Midnight API listening on http://localhost:${port}`));
