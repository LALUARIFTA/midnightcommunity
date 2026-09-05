# midnight community

Website komunitas esport Midnight, dibangun dengan React, Vite, dan Node.js.

## Struktur

- `client/` — aplikasi React dan design system.
- `server/` — API Node untuk database member dan submission.
- `legacy/` — versi static lama, dipertahankan sebagai arsip.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. API Node berjalan di `http://localhost:8787` dan meneruskan `/api/members` ke database Apps Script.

## Konfigurasi backend

Isi environment variable berikut pada deployment Node:

```env
MIDNIGHT_DATABASE_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
DISCORD_REGISTRATION_WEBHOOK=https://discord.com/api/webhooks/...
DISCORD_SCRIM_WEBHOOK=https://discord.com/api/webhooks/...
```

`DISCORD_REGISTRATION_WEBHOOK` dipakai form join member dan `DISCORD_SCRIM_WEBHOOK` dipakai form daftar scrim.

`server/index.js` mem-proxy database member dan meneruskan submission ke Discord tanpa mengekspos URL webhook ke browser. Webhook lama yang pernah tertanam di frontend sebaiknya segera di-rotate dari Discord.

Database saat ini dibaca dari Google Sheets CSV yang dipublikasikan. Pastikan `MIDNIGHT_DATABASE_URL` menunjuk ke URL CSV sheet yang aktif jika sumbernya berubah.