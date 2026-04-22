# SportHub Brand Guidelines - Final

## Overview

SportHub este o platformă tech pentru managementul structurilor sportive. Identitatea vizuală comunică **profesionalism tech**, nu "club sportiv local".

Versiune: 2.0 (Pure Wordmark)  
Data: Aprilie 2026  
Bazat pe: Research industrie (TeamSnap, SportsEngine, Hudl)

---

## Logo System

### Filosofie

**Pure Wordmark** = zero simboluri, doar tipografie.

**De ce?**
- Platformele tech de succes (TeamSnap, Stripe, Linear) folosesc wordmark-uri clean
- Scalează perfect de la favicon (16px) la billboard
- Comunică "suntem software" nu "suntem echipă sportivă"
- Implementare simplă, costuri mici

### Variante Logo

#### 1. **sporthub-logo-gradient.svg** (PRINCIPAL)
- Gradient albastru-cyan (#1976C2 → #00D9FF)
- Utilizare: Website, aplicații, marketing digital
- Font: Outfit ExtraBold, 72px, letter-spacing -2

#### 2. **sporthub-logo-blue.svg**
- Albastru solid (#1976C2)
- Utilizare: Print monocrom, documente oficiale
- Când gradientul nu funcționează

#### 3. **sporthub-logo-white.svg**
- Alb solid
- Utilizare: Fundal întunecat, poze, video overlays

#### 4. **sporthub-logo-dark.svg**
- Negru/gri închis (#0A0E27)
- Utilizare: Fundal alb când vrei contrast maxim

#### 5. **sporthub-favicon.svg**
- Literele "SH" în pătrat rotunjit cu gradient
- Utilizare: Favicon browser, app icons, avatar-uri mici

---

## Typography

### Font Principal: **Outfit**

**Unde se folosește:**
- Logo (ExtraBold 800)
- Headings (Bold 700, SemiBold 600)
- Elemente de brand (Display text)

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
```

**Caracteristici:**
- Sans-serif geometric modern
- Foarte lizibil la dimensiuni mici
- Personalitate distinctă fără să fie excentric
- Open source (Google Fonts)

### Font UI: **Inter**

**Unde se folosește:**
- Body text
- Butoane, formulare, tabele
- UI components
- Tot ce nu e brand/display

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
```

---

## Colors

### Primary (Albastru)

| Swatch | Hex | Usage |
|--------|-----|-------|
| 900 | `#0A2540` | Text pe fundal deschis |
| 700 | `#114B7E` | Hover states |
| **500** | **`#1976C2`** | **Brand principal** |
| 300 | `#74ACE8` | Light variants |
| 100 | `#D0E2F7` | Backgrounds |

### Gradient Principal

```css
background: linear-gradient(90deg, #1976C2 0%, #00D9FF 100%);
```

**Utilizare:**
- Logo principal
- CTA buttons
- Hero sections
- Highlights

### Secondary (Portocaliu)

| Hex | Usage |
|-----|-------|
| **`#FF7849`** | **Accent principal** |
| `#FF9270` | Lighter variant |
| `#FFE0DC` | Very light backgrounds |

**Utilizare:**
- Call-to-action secundar
- Notificări importante
- Live indicators
- Progress bars

### Functional

- **Success:** `#00C48C` (Verde)
- **Warning:** `#FFB020` (Galben)
- **Error:** `#E63946` (Roșu)

---

## Logo Usage Rules

### ✅ DO (Permite)

1. **Utilizează varianta potrivită pentru fundal**
   - Gradient pe alb/deschis
   - White pe întunecat
   - Blue/Dark când ai nevoie de contrast specific

2. **Păstrează spațiu liber**
   - Minim 24px în jurul logo-ului
   - Pe mobile: minim 16px

3. **Scalează proporțional**
   - Păstrează aspectul original
   - Nu deforma text-ul

4. **Folosește font-ul original**
   - Outfit ExtraBold pentru logo
   - Dacă nu ai access la font, folosește SVG-ul

### ❌ DON'T (Nu permite)

1. **Nu modifica culorile**
   - Nu schimba gradientul
   - Nu adăuga efecte (drop shadow, glow, etc.)
   - Nu folosești alte culori decât cele definite

2. **Nu adăuga elemente**
   - Nu pune logo-ul în forme (cercuri, pătrate, ecusoane)
   - Nu adăuga tagline-uri custom
   - Nu combina cu alte logo-uri fără aprobare

3. **Nu deforma**
   - Nu streci pe orizontală/verticală
   - Nu rotești (doar 0° sau 180°)
   - Nu curba sau distorsionezi

4. **Nu folosești pe fundaluri complexe**
   - Evită poze aglomerate sub logo
   - Evită pattern-uri care reduc lizibilitatea

---

## Implementation

### HTML Usage

```html
<!-- Gradient logo (primary) -->
<h1 class="logo-sporthub logo-sporthub-lg">SportHub</h1>

<!-- Or using SVG -->
<img src="/assets/logos/sporthub-logo-gradient.svg" alt="SportHub" height="48">

<!-- Favicon in <head> -->
<link rel="icon" type="image/svg+xml" href="/assets/logos/sporthub-favicon.svg">
```

### CSS Classes

```css
/* Size variants */
.logo-sporthub-sm   /* 24px */
.logo-sporthub-md   /* 36px - default */
.logo-sporthub-lg   /* 48px */
.logo-sporthub-xl   /* 72px */

/* Color variants */
.logo-sporthub-blue   /* Solid blue */
.logo-sporthub-white  /* White */
.logo-sporthub-dark   /* Dark gray */
```

### React/JSX

```jsx
import Logo from './assets/logos/sporthub-logo-gradient.svg';

function Header() {
  return (
    <header className="flex items-center justify-between">
      <img src={Logo} alt="SportHub" className="h-12" />
    </header>
  );
}
```

---

## Minimum Sizes

| Context | Min Height | Notes |
|---------|-----------|-------|
| Website Header | 40px | Desktop |
| Mobile Header | 32px | Mobile |
| Favicon | 32px | Browser tab |
| App Icon | 48px | iOS/Android |
| Print | 20mm | Business cards, letterhead |

La dimensiuni sub 32px, folosește favicon-ul (SH) în loc de wordmark complet.

---

## File Formats Delivered

### SVG (Vector)
- `sporthub-logo-gradient.svg` - Logo principal
- `sporthub-logo-blue.svg` - Solid blue
- `sporthub-logo-white.svg` - White
- `sporthub-logo-dark.svg` - Dark
- `sporthub-favicon.svg` - Icon SH

**Avantaje SVG:**
- Scalează la orice dimensiune fără pierdere calitate
- File size mic (< 2KB)
- Editabil în cod
- Suportă gradiente și transparență

### CSS
- `sporthub-brand.css` - Sistem complet cu variabile, clase, componente

---

## Brand Voice & Messaging

### Personalitate
- **Profesional** dar accesibil
- **Tech-forward** dar uman
- **Eficient** fără să fie rece
- **Încrezător** fără să fie arogant

### Tone of Voice

**✅ Scrie așa:**
- "Gestionează clubul mai simplu"
- "Toate datele într-un loc"
- "Live scoring în timp real"

**❌ Nu scrie așa:**
- "Revoluționăm paradigma management-ului sportiv"
- "Soluție holistică de digitalizare"
- "Platformă disruptivă next-gen"

### Exemple Copy

**Hero Section:**
> SportHub  
> Platforma completă pentru managementul cluburilor sportive  
> Jucători, meciuri, plăți, legitimări — totul organizat.

**Feature Description:**
> **Live Scoring**  
> Urmărește scorul în timp real. Innings, substituții, statistici — totul actualizat instant.

**CTA Button:**
> "Începe gratuit" (nu "Încearcă acum")  
> "Vezi demo" (nu "Descoperă soluția")

---

## Quick Reference

### Culori Principale
- Primary: `#1976C2`
- Gradient: `#1976C2 → #00D9FF`
- Accent: `#FF7849`

### Fonts
- Brand: Outfit (800, 700, 600)
- UI: Inter (400, 500, 600)

### Logo Files
- Main: `sporthub-logo-gradient.svg`
- Dark BG: `sporthub-logo-white.svg`
- Favicon: `sporthub-favicon.svg`

---

## Support

**Întrebări despre brand:**
Email: brand@sporthub.ro (placeholder)

**Asset-uri noi:**
Dacă ai nevoie de variante custom (alte culori, dimensiuni speciale), contactează echipa de design.

**Versiune:** 2.0 Final  
**Ultima actualizare:** Aprilie 2026
