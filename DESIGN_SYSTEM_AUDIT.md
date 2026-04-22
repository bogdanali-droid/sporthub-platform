# Design System Audit & Unification Plan

## Current State Analysis

### 1. Layout Dimensions

| Element | Admin | Federație | Asociație | Should Be |
|---------|-------|-----------|-----------|-----------|
| Sidebar width | 260px | 248px | 248px | **260px** |
| Topbar height | 64px | 64px | 64px | ✓ 64px |
| Content padding | 32px 40px | 32px 40px | 32px 40px | ✓ Consistent |
| Topbar padding | 0 32px | 0 32px | 0 32px | ✓ Consistent |

**Issue**: AdminLayout sidebar is 12px wider — needs standardization.

---

### 2. Button Styles

#### AdminLayout
- `.btn-primary` → blue (#1976C2)
- `.btn-secondary` → gray with border
- `.btn-danger` → red
- `.btn-success` → green

#### FederatieLayout
- `.btn-primary` → dark navy (#001524)
- `.btn-gold` → gold (#F4B400)
- `.btn-danger` → red
- `.btn-outline` → white with gray border

#### AsociatieLayout
- `.btn-accent` → orange (#f97316)
- `.btn-outline` → white with gray border
- NO `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`

**Issues**:
1. Different class names per portal (`.btn-gold` vs `.btn-primary` vs `.btn-accent`)
2. AsociatieLayout missing standard button types
3. All should have: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`, `.btn-outline`, `.btn-sm`, `.btn-lg`

---

### 3. Form Field Styling

| Property | Admin | Federație | Asociație | Should Be |
|----------|-------|-----------|-----------|-----------|
| Border width | 2px | 2px | 2px | ✓ 2px |
| Border radius | 8px | 8px | 8px | ✓ 8px |
| Padding | 12px 16px | 12px 16px | 12px 16px | ✓ Consistent |
| Focus shadow | 3px | 3px | 3px | ✓ Consistent |
| Placeholder color | var(--text-light) | #94a3b8 | #94a3b8 | ✓ Consistent |

**Issue**: All form fields are consistent — GOOD ✓

---

### 4. Card & Stat Card Styling

| Property | Admin | Federație | Asociație | Should Be |
|----------|-------|-----------|-----------|-----------|
| Card border-radius | 12px | 12px | 12px | ✓ 12px |
| Card padding | 28px | 28px | 28px | ✓ Consistent |
| Stat card padding | 24px | 28px | 20px | **28px** |
| Stat card border-radius | 12px | 12px | 10px | **12px** |
| Stat value font-size | 32px | 32px | 28px | **32px** |
| Stat value font-weight | 800 | 800 | 700 | **800** |

**Issues**:
1. Stat card padding differs: 24px vs 28px vs 20px
2. Stat card border-radius differs: 12px vs 12px vs 10px
3. Stat value font-size differs: 32px vs 32px vs 28px
4. Stat value font-weight differs: 800 vs 800 vs 700

---

### 5. Table Styling

| Property | Admin | Federație | Asociație | Should Be |
|----------|-------|-----------|-----------|-----------|
| TH padding | 14px 16px | 14px 16px | 10px 12px | **14px 16px** |
| TD padding | 14px 16px | 14px 16px | 11px 12px | **14px 16px** |
| TH font-size | 12px | 12px | 11px | **12px** |
| Table font-size | 13px | 13px | 13.5px | **13px** |
| TH text-transform | uppercase | uppercase | uppercase | ✓ Consistent |

**Issues**:
1. AsociatieLayout has tighter padding (10px 12px vs 14px 16px)
2. AsociatieLayout has smaller header font (11px vs 12px)
3. AsociatieLayout has slightly larger table font (13.5px vs 13px)

---

### 6. Badge Styling

| Property | Admin | Federație | Asociație | Should Be |
|----------|-------|-----------|-----------|-----------|
| Padding | 4px 12px | 3px 9px | 3px 9px | **4px 12px** |
| Gap | 6px | 4px | 4px | **6px** |
| Border-radius | 6px | 12px | 12px | **8px** |
| Font-size | 12px | 11px | 11px | **11px** |
| Font-weight | 700 | 600 | 600 | **600** |

**Issues**:
1. Admin uses 6px gap while others use 4px
2. Admin uses 6px border-radius while others use 12px
3. Admin uses 12px font-size while others use 11px
4. Admin uses 700 weight while others use 600

---

### 7. Sidebar Navigation Items

| Property | Admin | Federație | Asociație | Should Be |
|----------|-------|-----------|-----------|-----------|
| Padding | 12px 18px | 12px 18px | 12px 18px | ✓ 12px 18px |
| Border-radius | 8px | 8px | 8px | ✓ 8px |
| Margin | 3px 12px | 3px 12px | 3px 12px | ✓ Consistent |
| Font-size | 14px | 14px | 14px | ✓ Consistent |
| Font-weight | 500 | 500 | 500 | ✓ Consistent |
| Active box-shadow | Present | Present | Present | ✓ Consistent |

**Issue**: Nav items are consistent — GOOD ✓

---

### 8. Color Palette & Variables

#### AdminLayout Variables
- `--sidebar-bg`: #0A2540
- `--primary`: #1976C2
- `--primary-dark`: #114B7E
- `--secondary`: #FF7849
- `--success`: #00C48C
- `--warning`: #FFB020
- `--danger`: #E63946
- `--topbar-bg`: #ffffff
- `--content-bg`: #f8fafc
- `--border-color`: #e2e8f0

#### FederatieLayout Variables
- `--fed-bg`: #001524
- `--fed-text`: #94a3b8
- `--fed-active`: #ffffff
- `--fed-accent`: #F4B400
- `--fed-border`: #0a2540
- `--content-bg`: #f1f5f9
- `--font-brand`: 'Outfit'
- `--font-ui`: 'Inter'

#### AsociatieLayout Variables
- `--aso-bg`: #431407
- `--aso-text`: #fcd9b0
- `--aso-active`: #ffffff
- `--aso-accent`: #f97316
- `--aso-border`: #6b2408
- `--content-bg`: #f1f5f9

**Issues**:
1. Different variable naming per portal (inconsistent naming conventions)
2. Content background differs: #f8fafc (Admin) vs #f1f5f9 (Fed & Aso)
3. Missing standard color variables in some layouts

---

### 9. Sidebar Logo Styling

| Property | Admin | Federație | Asociație | Should Be |
|----------|-------|-----------|-----------|-----------|
| Logo height | 40px | 32px | 32px | **40px** |
| Sport label font-size | 10px | 10px | N/A (uses brand-sub) | **10px** |
| Brand sub font-size | N/A | 10px | 10px | **10px** |
| Brand sub color | N/A | --fed-accent | --aso-accent | **Portal accent** |

**Issue**: Admin logo is larger (40px vs 32px) — should standardize to 40px.

---

### 10. Topbar Styling

All consistent:
- Height: 64px
- Padding: 0 32px
- Border-bottom: 2px solid
- User badge: 36px avatar + text
- User avatar background: Portal-specific color

---

### 11. Alert Styles

| Portal | Has Alerts? | Includes | Missing |
|--------|------------|----------|---------|
| Admin | NO | None | All alert types |
| Federație | YES | .alert-info, .alert-warning, .alert-success, .alert-error | None |
| Asociație | YES | .alert-success, .alert-warning | .alert-info, .alert-error |

**Issue**: AdminLayout missing all alert styles.

---

### 12. Modal Styles

| Portal | Has Modals? | Includes |
|--------|------------|----------|
| Admin | NO visible | None |
| Federație | YES | .modal, .modal-overlay, .modal-header, .modal-body, .modal-footer |
| Asociație | YES | .modal, .modal-overlay, .modal-header, .modal-body, .modal-footer |

**Issue**: AdminLayout missing modal styling.

---

## Unification Plan

### Phase 1: Standardize Dimensions
1. **Sidebar width**: Change AdminLayout from 260px → 260px (keep as is, set FederatieLayout & AsociatieLayout to 260px)
2. **Logo height**: Standardize to 40px across all layouts
3. **Table padding**: Standardize to 14px 16px for all cells
4. **Table font-size**: Standardize to 13px

### Phase 2: Unify Button System
All layouts should have these classes (with portal-specific colors):
```
.btn-primary          (Admin: blue, Federation: navy, Association: brown)
.btn-secondary        (Admin: gray with border, Federation: navy with border, Association: gray with border)
.btn-danger           (All: red #E63946)
.btn-success          (Admin: green, Federation: none, Association: none)
.btn-outline          (All: white with border)
.btn-sm              (All: 8px 16px, 13px font-size)
.btn-lg              (All: 14px 32px, 15px font-size)
```

Plus portal-specific:
- Federation: `.btn-gold` → #F4B400
- Association: `.btn-accent` → #f97316

### Phase 3: Unify Card System
```
.card {
  padding: 28px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stat-card {
  padding: 28px;           (STANDARDIZE from 24px/20px)
  border-radius: 12px;     (STANDARDIZE from 10px)
}

.stat-value {
  font-size: 32px;         (STANDARDIZE from 28px)
  font-weight: 800;        (STANDARDIZE from 700)
}
```

### Phase 4: Unify Badge System
```
.badge {
  padding: 4px 12px;       (STANDARDIZE from 3px 9px)
  border-radius: 8px;      (STANDARDIZE from 6px/12px)
  gap: 6px;                (STANDARDIZE from 4px)
  font-size: 12px;         (STANDARDIZE from 11px)
  font-weight: 700;        (STANDARDIZE from 600)
}
```

### Phase 5: Add Missing Styles
1. AdminLayout: Add all alert styles (`.alert-info`, `.alert-warning`, `.alert-success`, `.alert-error`)
2. AdminLayout: Add modal styles
3. AsociatieLayout: Add missing alert types (`.alert-info`, `.alert-error`)

### Phase 6: Standardize Color Variables
All layouts should define:
```
:root {
  --sidebar-bg: (portal color)
  --sidebar-text: (text color on sidebar)
  --sidebar-accent: (active nav item color)
  --primary-bg: (main topbar/content background)
  --border-color: #e2e8f0
  --text-primary: #1e293b
  --text-secondary: #475569
  --text-light: #64748b
  --font-brand: 'Outfit'
  --font-ui: 'Inter'
  
  Plus portal-specific accent:
  --accent: (#1976C2 for Admin, #F4B400 for Fed, #f97316 for Aso)
}
```

### Phase 7: Standardize Content Background
- Change AdminLayout from #f8fafc → #f1f5f9 (matching Fed & Aso)

---

## Implementation Order

1. **AdminLayout** → FederatieLayout → AsociatieLayout (deploy all at once)
2. **Critical files to modify**:
   - `/src/layouts/AdminLayout.astro` (260px sidebar, all missing styles)
   - `/src/layouts/FederatieLayout.astro` (260px sidebar, standardize badges/cards)
   - `/src/layouts/AsociatieLayout.astro` (260px sidebar, standardize everything)

3. **Testing**:
   - Verify all button styles render correctly with portal colors
   - Verify forms look identical across portals
   - Verify cards and stat cards are identical
   - Verify tables have consistent padding/spacing
   - Verify badges look identical
   - Verify badges, cards, and all elements scale properly on mobile

---

## Summary of Changes

### AdminLayout Changes:
- [ ] Change sidebar width from 260px → 260px (KEEP)
- [ ] Add all alert styles (.alert-info, .alert-warning, .alert-success, .alert-error)
- [ ] Add all modal styles
- [ ] Standardize content-bg from #f8fafc → #f1f5f9
- [ ] Standardize badge styles (padding, gap, border-radius, font-size)
- [ ] Add .btn-outline if missing
- [ ] Ensure all .stat-card properties are standardized

### FederatieLayout Changes:
- [ ] Change sidebar width from 248px → 260px
- [ ] Add .btn-secondary and .btn-primary with proper federation colors
- [ ] Rename button classes for consistency (use .btn-gold as modifier, not replacement)
- [ ] Standardize badge styles to 4px 12px, 8px border-radius, 6px gap
- [ ] Ensure .stat-card has 28px padding, 12px border-radius
- [ ] Ensure .stat-value has 32px font-size, 800 font-weight

### AsociatieLayout Changes:
- [ ] Change sidebar width from 248px → 260px
- [ ] Rename .btn-accent → keep it but ensure .btn-primary exists as portal-specific
- [ ] Add .btn-secondary, .btn-success, .btn-danger
- [ ] Standardize table padding to 14px 16px, font-size to 13px
- [ ] Standardize .stat-card to 28px padding, 12px border-radius
- [ ] Standardize .stat-value to 32px font-size, 800 font-weight
- [ ] Add missing alert styles (.alert-info, .alert-error)
- [ ] Standardize badge styles
