# SportHub Brand Assets

Pachet complet de brand identity pentru SportHub - platforma multisport pentru managementul structurilor sportive din România.

## 📦 Conținut Pachet

```
sporthub-brand-assets/
├── logos/
│   ├── sporthub-logo-main.svg          # Logo principal (fundal deschis)
│   ├── sporthub-logo-dark-bg.svg       # Logo pentru fundal întunecat
│   ├── sporthub-logo-mono.svg          # Logo monocrom
│   ├── sporthub-favicon-32.svg         # Favicon standard 32x40px
│   └── sporthub-favicon-16.svg         # Favicon mic 16x20px
├── css/
│   └── sporthub-variables.css          # CSS variables complete
└── docs/
    └── BRAND-GUIDELINES.md             # Ghid complet de utilizare
```

## 🚀 Quick Start

### 1. Logo în Aplicație

**HTML:**
```html
<img src="logos/sporthub-logo-main.svg" alt="SportHub" height="80">
```

**React:**
```jsx
import Logo from './logos/sporthub-logo-main.svg';
<img src={Logo} alt="SportHub" className="h-20" />
```

### 2. CSS Variables

**Import în proiect:**
```css
@import url('./css/sporthub-variables.css');
```

**Utilizare:**
```css
.my-button {
  background-color: var(--primary-600);
  color: white;
  font-family: var(--font-body);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
}
```

### 3. Favicon

**În `<head>`:**
```html
<link rel="icon" type="image/svg+xml" href="/logos/sporthub-favicon-32.svg">
```

## 🎨 Culori Principale

| Culoare | Hex | Utilizare |
|---------|-----|-----------|
| Primary Blue | `#1976C2` | Butoane, headers, linkuri |
| Secondary Orange | `#FF7849` | CTA, alerte, energie |
| Success Green | `#00C48C` | Confirmări, succes |
| Warning Amber | `#FFB020` | Atenționări |

## 📝 Tipografie

- **Display/Headings:** Space Grotesk (700, 600, 500)
- **Body/UI:** Inter (400, 500, 600)

## 🎯 Logo Specs

**Varianta Power:**
- Unghi chevron: 60° (sharp)
- Grosime stroke: 7px (bold)
- Spațiere: 8px (tight)
- Formă: Ecuson clasic
- Gradient: #1976C2 → #0A2540

**Dimensiuni minime:**
- Header website: 80px height
- Mobile app: 64px height
- Favicon: 32px height
- Browser tab: 16px height

## ⚠️ Important

**NU modifica:**
- Culorile logo-ului
- Proporțiile ecuson-ului
- Pozițiile chevron-urilor
- Fonturile brand (Space Grotesk, Inter)

**DA:**
- Scalează proporțional
- Folosește varianta potrivită pentru fundal
- Menține spațiu liber (min 20px) în jurul logo-ului
- Folosește SVG pentru scalabilitate

## 📖 Documentație Completă

Vezi `docs/BRAND-GUIDELINES.md` pentru:
- Reguli complete de utilizare
- Exemple de componente UI
- Tone of voice
- Ghid de implementare tehnică

## 🔧 Integrare în Cloudflare

Pentru proiectul tău pe Cloudflare Pages:

1. Copiază `/logos` în `/public/assets/logos`
2. Import CSS variables în global stylesheet
3. Update favicon în `index.html`
4. Înlocuiește emoji 🏟️ cu `<img src="/assets/logos/sporthub-logo-main.svg">`

## 📊 Versiune

- **Versiune:** 1.0
- **Data:** Aprilie 2026
- **Status:** Final - Gata de implementare

---

**SportHub** - Platforma multisport pentru managementul structurilor sportive
