# SportHub Banner — Astro component

Drop-in pentru landing page Astro pe Cloudflare Pages. Zero dependențe, zero config.

## Instalare

1. Copiază `SportHubBanner.astro` în `src/components/`.

2. Importă și folosește:

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import SportHubBanner from '../components/SportHubBanner.astro';
---

<Layout title="SportHub România">
  <main>
    <SportHubBanner />
    <!-- restul conținutului -->
  </main>
</Layout>
```

Gata. Se compilează cu Astro, merge pe Cloudflare Pages, funcționează fără JavaScript framework (vanilla script inclus în component).

## Props

| Prop | Tip | Default | Ce face |
|---|---|---|---|
| `speed` | `number` | `4` | Secunde per slide |
| `href` | `string` | `'https://sporthub-platform.pages.dev/login'` | Destinație click |
| `sports` | `Sport[]` | 5 sporturi default | Listă custom |

### Exemplu cu props

```astro
<SportHubBanner
  speed={5}
  href="/login"
/>
```

### Listă custom de sporturi

```astro
---
import SportHubBanner, { type Sport } from '../components/SportHubBanner.astro';

const mySports: Sport[] = [
  {
    id: 'fotbal', name: 'FOTBAL', emoji: '⚽',
    tag: '11 jucători · 90 minute',
    accent: '#16a34a',
    stat: 'Liga 1',
    cta: 'Vezi meciurile',
    bg: 'linear-gradient(135deg,#064e3b,#16a34a,#fbbf24)',
    pattern: 'radial-gradient(circle at 20% 40%, rgba(22,163,74,0.4), transparent 45%)',
  },
  // ...
];
---

<SportHubBanner sports={mySports} />
```

## Caracteristici

- **Zero dependențe** — nu folosește React/Vue, doar vanilla JS inline
- **Responsive** — `aspect-ratio: 3/1` și `clamp()` pe fontSize-uri, arată bine 400–1200px
- **Accesibilitate** — respectă `prefers-reduced-motion`, aria-labels, semantic `<a>`
- **Eficient cu bateria** — `IntersectionObserver` oprește carusel-ul când bannerul nu e vizibil pe ecran
- **Hover = pauză** — autoplay se oprește când utilizatorul intenționează să dea click
- **SSG compatible** — se pre-renderizează static, JS rulează doar client-side
- **CSS scoped** — stilurile Astro sunt scoped automat, nu pot intra în conflict cu restul site-ului

## Cloudflare Pages

Nimic special de făcut. Build-ul Astro produce HTML + CSS + un mic fișier JS; Cloudflare le servește de la edge. Dimensiune totală: ~8KB uncompressed, ~3KB gzipped.

Dacă folosești `output: 'static'` (default Astro) sau `output: 'server'` cu adapter `@astrojs/cloudflare` — ambele merg.

## Înlocuire emoji cu imagini reale

Când ai fotografii sport, modifică:

```astro
<!-- În loc de -->
<div class="sh-banner__emoji" data-sh-emoji>{first.emoji}</div>

<!-- Pune -->
<img class="sh-banner__emoji" data-sh-img src={first.image} alt="" />
```

Și în `<script>` înlocuiește `emojiEl.textContent = s.emoji` cu `imgEl.src = s.image`. Adaugă `image: string` la interfața `Sport`.

## Culori accent

- Baseball5 — `#f97316`
- Softball — `#facc15`
- Rugby — `#22c55e`
- Baschet — `#fb923c`
- Handbal — `#ef4444`
- Brand base: navy **`#0b1f3a`**
