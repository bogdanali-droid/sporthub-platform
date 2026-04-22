# SportHub Brand Guidelines

## Logo Usage

### Variante Logo

1. **sporthub-logo-main.svg** - Logo principal cu gradient albastru
   - Utilizare: Fundal alb sau deschis
   - Minimum size: 32px înălțime

2. **sporthub-logo-dark-bg.svg** - Logo pentru fundal întunecat
   - Utilizare: Fundal negru, gri închis, sau imagini întunecate
   - Are contur alb pentru vizibilitate

3. **sporthub-logo-mono.svg** - Logo monocrom
   - Utilizare: Print alb-negru, situații cu restricții de culoare
   - Menține gradarea prin opacity

4. **sporthub-favicon-32.svg** - Favicon standard (32x40px)
   - Utilizare: App icons, favicons pentru browser

5. **sporthub-favicon-16.svg** - Favicon mic (16x20px)
   - Utilizare: Browser tabs la rezoluție mică
   - Versiune simplificată cu doar 2 chevron-uri

### Reguli Logo

✅ PERMITE:
- Utilizează logo-ul pe fundal alb/deschis (varianta main)
- Utilizează varianta dark-bg pe fundal întunecat
- Menține spațiu liber minim în jurul logo-ului (20px)
- Scalează proporțional (păstrează aspect ratio 1:1.2)
- Utilizează SVG-uri pentru scalabilitate perfectă

❌ NU PERMITE:
- Să modifici culorile logo-ului
- Să rotești sau să deformezi logo-ul
- Să adaugi efecte (drop shadow, outer glow, etc.)
- Să plasezi logo pe fundaluri complexe sau imagini aglomerate
- Să folosești alte fonturi decât Space Grotesk pentru branding
- Să separi chevron-urile de ecuson

### Dimensiuni Minime

- Website header: 80px înălțime
- Mobile app icon: 64px înălțime
- Favicon: 32px înălțime
- Browser tab: 16px înălțime (folosește favicon-16.svg)

## Paleta de Culori

### Primary (Albastru)
- **#1976C2** - Culoarea principală
- Utilizare: Butoane principale, linkuri, headers, navigare
- Mesaj: Încredere, profesionalism, tehnologie

### Secondary (Portocaliu)
- **#FF7849** - Culoarea secundară
- Utilizare: Call-to-action, alerte importante, highlight-uri, live events
- Mesaj: Energie, acțiune, urgență

### Accent Colors
- **#00C48C** (Verde) - Success, confirmare
- **#FFB020** (Galben) - Warning, atenție

### Neutrals
- **#1A1D23** - Text principal
- **#5E636E** - Text secundar
- **#DFE1E6** - Borders
- **#F3F4F6** - Backgrounds

## Tipografie

### Fonturi

1. **Space Grotesk** (Display/Headings)
   - Weight: 400, 500, 600, 700
   - Utilizare: Titluri, headings, branding
   - Import: `https://fonts.google.com/specimen/Space+Grotesk`

2. **Inter** (Body)
   - Weight: 400, 500, 600
   - Utilizare: Body text, UI, forme, tabele
   - Import: `https://fonts.google.com/specimen/Inter`

### Ierarhie Tipografică

```
H1: 48px / Space Grotesk Bold
H2: 36px / Space Grotesk Bold
H3: 28px / Space Grotesk SemiBold
H4: 24px / Space Grotesk Medium
Body Large: 18px / Inter Regular
Body: 16px / Inter Regular
Body Small: 14px / Inter Regular
Caption: 12px / Inter Regular
```

## Componente UI

### Butoane

**Primary Button:**
- Background: #1976C2
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Font: Inter SemiBold 15px
- Hover: #114B7E

**Secondary Button:**
- Background: #FF7849
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Font: Inter SemiBold 15px
- Hover: #E8581C

### Cards
- Background: White
- Border: 1px solid #DFE1E6
- Border Radius: 16px
- Padding: 24px
- Shadow: 0 2px 8px rgba(0,0,0,0.06)

### Badges
- Success: Background #5EDDB4, Text #005A3C
- Warning: Background #FFCB5B, Text #7A4F00
- Border Radius: 6px
- Padding: 6px 12px
- Font: Inter SemiBold 13px

## Tone of Voice

### Personalitate Brand
- **Profesional** dar nu rigid
- **Energic** dar nu copilăresc
- **Clar** fără jargon
- **Eficient** direct la subiect

### Exemple

✅ BUN: "Adaugă jucători, organizează meciuri, gestionează echipa - totul într-un loc."
❌ RĂU: "Revoluționăm paradigma management-ului sportiv prin soluții inovatoare de ultimă generație."

✅ BUN: "Legitimare aprobată"
❌ RĂU: "Demersul dumneavoastră a fost procesat cu succes"

## Implementare

### CSS Variables
Toate culorile, fonturile și spacing-urile sunt disponibile ca CSS variables în `sporthub-variables.css`.

Import în proiect:
```css
@import url('./css/sporthub-variables.css');
```

### Logo în HTML
```html
<!-- Logo standard -->
<img src="/logos/sporthub-logo-main.svg" alt="SportHub" height="80">

<!-- Logo pe fundal întunecat -->
<img src="/logos/sporthub-logo-dark-bg.svg" alt="SportHub" height="80">

<!-- Favicon în <head> -->
<link rel="icon" type="image/svg+xml" href="/logos/sporthub-favicon-32.svg">
```

### Logo în React/JSX
```jsx
import LogoMain from './logos/sporthub-logo-main.svg';

<img src={LogoMain} alt="SportHub" className="h-20" />
```

## Contact

Pentru întrebări despre utilizarea brandului SportHub:
- Email: brand@sporthub.ro (exemplu)
- Versiune: 1.0
- Data: Aprilie 2026
