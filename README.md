# SportHub — Multi-Sport Platform for Romania

Platformă SaaS multisport pentru cluburi, federații și asociații sportive din România.

**Moto**: *O platformă, toate sporturile.*

## Viziune

SportHub extinde arhitectura Rugby Hub (un management complet pentru cluburi de rugby) pentru a deservi **orice sport**, cu configurare modulară pe sport:

- **Rugby** (moștenit din Rugby Hub)
- **Baseball5 & Softball** (pilot Federația Română de Baseball5 și Softball)
- **Fotbal, Handbal, Baschet, Volei, Tenis** (roadmap)
- **Orice alt sport** (via configurare declarativă)

## Stack

- **Framework**: Astro 4 (SSR, server mode)
- **Deploy**: Cloudflare Workers + Pages
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (media, documente)
- **Sessions**: Cloudflare KV
- **Styling**: TailwindCSS
- **Validare**: Zod
- **Auth**: bcryptjs + cookie sessions + TOTP 2FA

## Arhitectură modulară multi-sport

În SportHub, fiecare club are un **sport_type**. Sportul determină:

- Categoriile de vârstă disponibile (U6 rugby vs. U8 softball)
- Pozițiile pe teren (Pilier vs. Pitcher/Catcher)
- Evenimentele de meci (Try/Conversion vs. Home Run/Strikeout)
- Atributele de evaluare ale jucătorilor (viteză/forță vs. batting/fielding)
- Categoriile de antrenamente/drill-uri
- Regulile de lineup și scoring

Toate aceste elemente sunt configurate prin `src/lib/sport-config/` — fiecare sport are propriul fișier declarativ.

## Sporturi suportate în v1

| Sport       | Status     | Pilot |
|-------------|------------|-------|
| Rugby       | ✅ Full    | —     |
| Baseball5   | 🚧 Pilot   | ✅ FRBS |
| Softball    | 🚧 Pilot   | ✅ FRBS |
| Fotbal      | 📋 Roadmap | —     |
| Handbal     | 📋 Roadmap | —     |

## Module comune (toate sporturile)

- Autentificare (sesiuni KV, brute-force protection, CSRF, 2FA)
- Multi-tenant (un deployment → multe cluburi, fiecare cu sport-ul său)
- Management jucători (CRUD, foto, import bulk)
- Echipe (categorii configurabile per sport)
- Antrenamente + Prezență (check-in QR, bulk attendance)
- Meciuri + Convocări (selecție lot)
- Live scoring (evenimente configurabile per sport)
- Plăți (tracking RON, PAID/PENDING/OVERDUE)
- Vizite medicale + Probe fizice (configurabile)
- Documente jucători (R2 storage)
- Notificări (email, SMS, push)
- Calendar unificat (iCal export)
- GDPR consimțăminte
- Analytics (attendance trends, risk scoring)
- Portal federație (campionate cross-club)
- Portal părinți & jucători

## Setup

```bash
npm install
```

### Cloudflare Resources

1. KV namespace: `wrangler kv:namespace create SESSION_KV`
2. R2 bucket: `wrangler r2 bucket create sporthub-media`
3. D1 database: `wrangler d1 create sporthub-db`
4. Actualizează `wrangler.jsonc` cu ID-urile generate
5. Rulează schema: `wrangler d1 execute sporthub-db --file=schema.sql`

### Development

```bash
npm run dev
```

### Deploy

```bash
npm run build && npm run deploy
```

## Documente cheie

- [ROADMAP.md](ROADMAP.md) — etape majore de dezvoltare
- [SPORTS_CONFIG.md](SPORTS_CONFIG.md) — cum se adaugă un sport nou
- [docs/baseball5-softball-pilot.md](docs/baseball5-softball-pilot.md) — propunere pilot FRBS

## Licență

Proprietary — © 2026 SportHub Romania.
