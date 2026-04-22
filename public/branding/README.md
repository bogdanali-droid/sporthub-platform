# SportHub Brand Assets - Final Package

Pure Wordmark identity pentru SportHub - platformă tech de management sportiv.

## 📦 Conținut

```
sporthub-final/
├── logos/
│   ├── sporthub-logo-gradient.svg    # Logo principal cu gradient
│   ├── sporthub-logo-blue.svg        # Logo albastru solid
│   ├── sporthub-logo-white.svg       # Logo alb (fundal întunecat)
│   ├── sporthub-logo-dark.svg        # Logo negru (contrast maxim)
│   └── sporthub-favicon.svg          # Favicon SH
├── css/
│   └── sporthub-brand.css            # Sistem complet CSS
└── docs/
    └── BRAND-GUIDELINES.md           # Documentație completă
```

## 🚀 Quick Start

### 1. Logo în Website

**HTML + CSS Class:**
```html
<link rel="stylesheet" href="css/sporthub-brand.css">

<h1 class="logo-sporthub logo-sporthub-lg">SportHub</h1>
```

**HTML + SVG:**
```html
<img src="logos/sporthub-logo-gradient.svg" alt="SportHub" height="48">
```

**React/JSX:**
```jsx
import Logo from './logos/sporthub-logo-gradient.svg';

<img src={Logo} alt="SportHub" className="h-12" />
```

### 2. Favicon

```html
<head>
  <link rel="icon" type="image/svg+xml" href="/logos/sporthub-favicon.svg">
</head>
```

### 3. CSS Import

```css
@import url('./css/sporthub-brand.css');

/* Acum ai acces la: */
.logo-sporthub        /* Logo cu gradient */
.btn-primary          /* Buton primary */
.card                 /* Card component */
/* + toate variabilele CSS */
```

## 🎨 Logo Variants

| File | Când se folosește |
|------|-------------------|
| `sporthub-logo-gradient.svg` | Website, app, marketing (PRINCIPAL) |
| `sporthub-logo-blue.svg` | Print, când gradientul nu funcționează |
| `sporthub-logo-white.svg` | Fundal întunecat, video overlays |
| `sporthub-logo-dark.svg` | Fundal alb, contrast maxim |
| `sporthub-favicon.svg` | Browser favicon, app icons |

## 📏 Dimensiuni Recomandate

| Context | Height |
|---------|--------|
| Website Header | 40-48px |
| Mobile Header | 32-36px |
| Favicon | 32px |
| App Icon | 48-64px |

## 🎯 Culori Principale

```css
/* Primary Blue */
--primary-500: #1976C2

/* Gradient */
--logo-gradient: linear-gradient(90deg, #1976C2 0%, #00D9FF 100%)

/* Secondary Orange */
--secondary-500: #FF7849
```

## 🔤 Fonts

**Outfit** (Brand/Display)
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**Inter** (UI/Body)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Sau import direct din CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
```

## ✅ Reguli Esențiale

**DO:**
- Folosește gradient pe fundal deschis
- Folosește white pe fundal întunecat
- Păstrează spațiu liber (min 24px) în jurul logo-ului
- Scalează proporțional

**DON'T:**
- Nu modifica culorile
- Nu adăuga efecte (shadow, glow, etc.)
- Nu deforma sau rotești
- Nu pune logo pe fundaluri complexe

## 🔧 Integrare Cloudflare Pages

```bash
# 1. Copiază logo-urile
cp -r logos/ your-project/public/assets/

# 2. Copiază CSS
cp css/sporthub-brand.css your-project/styles/

# 3. Update index.html
# Înlocuiește emoji 🏟️ cu:
<img src="/assets/logos/sporthub-logo-gradient.svg" alt="SportHub" height="48">

# 4. Update favicon
<link rel="icon" type="image/svg+xml" href="/assets/logos/sporthub-favicon.svg">
```

## 📖 Documentație Completă

Vezi `docs/BRAND-GUIDELINES.md` pentru:
- Reguli detaliate de utilizare
- Exemple de implementare
- Brand voice & messaging
- Componente UI
- Best practices

## 💡 Tips

1. **Performance:** SVG-urile sunt mici (< 2KB). Nu e nevoie de optimizare suplimentară.

2. **Responsive:** Logo-ul scalează perfect. Pe mobile, poți reduce height la 32px.

3. **Favicon Alternative:** La rezoluții foarte mici (< 24px), favicon-ul (SH) e mai lizibil decât wordmark-ul complet.

4. **Dark Mode:** Folosește `sporthub-logo-white.svg` automat când detectezi dark mode:
   ```css
   @media (prefers-color-scheme: dark) {
     .logo { content: url('/logos/sporthub-logo-white.svg'); }
   }
   ```

## 🆚 vs. Logo Anterior

**Ce s-a schimbat:**
- ❌ Ecuson cu chevron-uri (prea "club sportiv")
- ✅ Pure wordmark (comunică "tech platform")

**De ce:**
- Research industrie: TeamSnap, SportsEngine, Hudl = toate wordmark
- Mesaj clar: "Suntem software, nu echipă"
- Scalabilitate perfectă
- Implementare mai simplă

## 📊 Stats

- **Logo files:** 5 SVG-uri (total ~8KB)
- **CSS file:** 1 fișier complet (12KB)
- **Fonts:** 2 familii (Google Fonts CDN)
- **Load time impact:** < 50ms

---

**Versiune:** 2.0 Final  
**Data:** Aprilie 2026  
**Status:** Production Ready ✅

Pentru întrebări: brand@sporthub.ro
