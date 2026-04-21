# SportHub — Roadmap

## Faza 1 (MVP — Pilot Baseball5 & Softball) 🚧

### Infrastructura de bază
- [x] Repository GitHub (`sporthub-platform`)
- [x] Schema multi-sport (D1 SQLite)
- [x] Seed data sporturi (Rugby, Baseball5, Softball, Fotbal)
- [x] Auth system (sessions KV, brute-force protection)
- [x] Sport config system (`getSportConfig` / `getClubSportConfig`)
- [x] Middleware RBAC (SUPERADMIN, ADMIN, COACH, PLAYER, PARENT)
- [ ] Onboarding flow (creare club + selectie sport)
- [ ] Admin layout adaptat per sport
- [ ] Login page

### Module core (toate sporturile)
- [ ] Jucatori (CRUD + foto + import bulk)
- [ ] Echipe (categorii configurabile per sport)
- [ ] Antrenamente + Prezenta (QR check-in)
- [ ] Meciuri + Convocari
- [ ] Plati (RON, PAID/PENDING/OVERDUE)
- [ ] Vizite medicale
- [ ] Documente (R2)

### Baseball5 & Softball specific (pilot FRBS)
- [ ] Live scoring cu innings
- [ ] Statistici per jucator (batting avg, ERA, fielding %)
- [ ] Raport meci (box score)
- [ ] Portal federatie (campionat, clasament)
- [ ] Formular inscriere online

## Faza 2 (Extensie — Rugby + Fotbal)

- [ ] Migrare clubs existente din Rugby Hub
- [ ] Lineup editor vizual (drag & drop pe teren)
- [ ] Evaluari jucatori (radar chart per sport)
- [ ] Drill library per sport
- [ ] Notificari (email Brevo + SMS + push)
- [ ] iCal export
- [ ] Portal parinti & jucatori
- [ ] Analytics (attendance risk, performance trends)

## Faza 3 (Platforma)

- [ ] SuperAdmin dashboard (toate cluburile, toate sporturile)
- [ ] Federatii & asociatii (portal cross-club)
- [ ] Campionate multi-club
- [ ] Onboarding self-service (orice club)
- [ ] Billing / subscriptii
- [ ] API public (webhook events)
- [ ] Mobile app (React Native sau PWA)

## Stack tehnic

- Astro 4 + Cloudflare Workers + D1 + KV + R2
- TailwindCSS + Vanilla JS (event delegation)
- Zod validation + bcryptjs auth
- Brevo (email) + Twilio (SMS optional)
