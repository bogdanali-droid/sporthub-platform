# SportHub Component Library Guide

This guide explains how to use the standardized reusable components available in the SportHub platform. These components ensure consistent UI/UX across all pages.

---

## 📑 Table of Contents

1. [DetailPageTabs](#detailpagetabs)
2. [ActionButtons](#actionbuttons)
3. [StatCard](#statcard)
4. [DataTable](#datatable)
5. [Format Utilities](#format-utilities)

---

## DetailPageTabs

**Purpose**: Create consistent tab navigation for detail pages (Player, Match, Team, etc.)

**Location**: `src/components/DetailPageTabs.astro`

### Usage

```astro
---
import DetailPageTabs from '@/components/DetailPageTabs.astro';

const tabs = [
  { id: 'profil', label: 'Profil', icon: '👤' },
  { id: 'evaluari', label: 'Evaluări', icon: '⭐' },
  { id: 'fizic', label: 'Teste Fizice', icon: '💪' },
  { id: 'medical', label: 'Medical', icon: '🏥' },
];

const currentTab = Astro.url.searchParams.get('tab') ?? 'profil';
---

<DetailPageTabs 
  tabs={tabs}
  currentTab={currentTab}
  basePath={`/admin/players/${playerId}`}
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `Tab[]` | Array of tab objects with `id`, `label`, and optional `icon` |
| `currentTab` | `string` | Current active tab ID |
| `basePath` | `string` | Base URL path for navigation |
| `className` | `string` (optional) | Additional CSS classes |

### Tab Object Structure

```typescript
interface Tab {
  id: string;      // Unique identifier (used in URL)
  label: string;   // Display text
  icon?: string;   // Emoji or icon (optional)
}
```

---

## ActionButtons

**Purpose**: Display consistent action buttons for CRUD operations

**Location**: `src/components/ActionButtons.astro`

### Usage

```astro
---
import ActionButtons from '@/components/ActionButtons.astro';

const actions = [
  { 
    icon: '✏️', 
    label: 'Editează', 
    action: 'edit',
    onClick: `editPlayer('${playerId}')`,
    variant: 'secondary'
  },
  { 
    icon: '📊', 
    label: 'Evaluări', 
    action: 'view',
    href: `/admin/players/${playerId}?tab=evaluari`,
    variant: 'secondary'
  },
  { 
    icon: '🗑️', 
    label: 'Șterge', 
    action: 'delete',
    onClick: `deletePlayer('${playerId}')`,
    variant: 'danger'
  },
];
---

<ActionButtons actions={actions} size="md" />
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `actions` | `Action[]` | Array of action objects |
| `size` | `'sm' \| 'md' \| 'lg'` | Button size (default: `'md'`) |

### Action Object Structure

```typescript
interface Action {
  icon: string;                           // Emoji/icon
  label: string;                          // Display text
  action: 'edit'|'view'|'delete'|...;    // Action type
  onClick?: string;                       // JavaScript to execute
  href?: string;                          // Link URL
  title?: string;                         // Tooltip text
  className?: string;                     // Additional CSS classes
  variant?: 'primary'|'secondary'|'danger'|'ghost'; // Style
}
```

### Variants

- **primary**: Blue background, used for main actions
- **secondary**: Gray background (default)
- **danger**: Red background, for destructive actions
- **ghost**: Transparent, minimal style

---

## StatCard

**Purpose**: Display key metrics and statistics

**Location**: `src/components/StatCard.astro`

### Usage

```astro
---
import StatCard from '@/components/StatCard.astro';
---

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
  <StatCard 
    icon="👥"
    label="Jucători activi"
    value={125}
    subtext="3 accidentați"
    variant="info"
  />

  <StatCard 
    icon="💳"
    label="Plăți încasate"
    value="2,500 RON"
    trend="up"
    trendValue="+15%"
    variant="success"
  />

  <StatCard 
    icon="⚠️"
    label="Plăți restante"
    value="850 RON"
    trend="down"
    trendValue="-5%"
    variant="danger"
  />

  <StatCard 
    icon="⚔️"
    label="Meciuri luna asta"
    value={8}
    href="/admin/matches"
  />
</div>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `string` | Emoji or icon |
| `label` | `string` | Metric label |
| `value` | `string \| number` | Metric value |
| `subtext` | `string` (optional) | Secondary text |
| `trend` | `'up' \| 'down' \| 'neutral'` (optional) | Trend direction |
| `trendValue` | `string` (optional) | Trend value (e.g., "+15%") |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | Color style |
| `href` | `string` (optional) | Make card clickable link |
| `className` | `string` (optional) | Additional CSS classes |

### Variants

- **default**: Blue (primary color)
- **success**: Green (for positive metrics)
- **warning**: Orange (for caution)
- **danger**: Red (for negative/critical)
- **info**: Cyan (for informational)

---

## DataTable

**Purpose**: Display tabular data with consistent styling

**Location**: `src/components/DataTable.astro`

### Usage

```astro
---
import DataTable from '@/components/DataTable.astro';

const columns = [
  { 
    key: 'name', 
    header: 'Nume',
    render: (value, row) => `<strong>${row.first_name} ${row.last_name}</strong>`
  },
  { 
    key: 'team_name', 
    header: 'Echipă' 
  },
  { 
    key: 'status', 
    header: 'Status',
    render: (value) => `<span class="badge badge--${value.toLowerCase()}">${value}</span>`
  },
  { 
    key: 'amount', 
    header: 'Sumă',
    align: 'right'
  },
];
---

<DataTable 
  columns={columns}
  data={players}
  hover
  striped
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `Column[]` | Column definitions |
| `data` | `any[]` | Data rows to display |
| `emptyMessage` | `string` (optional) | Message when no data |
| `emptyIcon` | `string` (optional) | Icon for empty state |
| `hover` | `boolean` | Enable hover effect (default: `true`) |
| `striped` | `boolean` | Alternate row colors |
| `compact` | `boolean` | Reduce padding for dense display |
| `className` | `string` (optional) | Additional CSS classes |

### Column Object Structure

```typescript
interface Column {
  key: string;                              // Data field name
  header: string;                           // Column heading
  align?: 'left' | 'center' | 'right';     // Text alignment
  width?: string;                           // Column width (e.g., "20%")
  render?: (value: any, row: any) => string; // Custom render function
}
```

### Render Function

The `render` function receives:
- `value`: The cell value from the row
- `row`: The entire row object (for accessing other fields)

Return HTML as a string using template literals.

---

## Format Utilities

**Purpose**: Consistent data formatting across the platform

**Location**: `src/lib/format.ts`

### Available Functions

#### `formatDate(date, locale)`

```astro
---
import { formatDate } from '@/lib/format';

const date = '2025-04-22T14:30:00Z';
---

{formatDate(date)} <!-- Output: 22 apr 2025 -->
```

#### `formatDateTime(datetime, locale)`

```astro
---
import { formatDateTime } from '@/lib/format';
---

{formatDateTime(datetime)} <!-- Output: 22 apr 2025 14:30 -->
```

#### `formatCurrency(amount, currency, locale)`

```astro
---
import { formatCurrency } from '@/lib/format';
---

{formatCurrency(1500, 'RON')} <!-- Output: 1.500 RON -->
{formatCurrency(99.99, 'EUR')} <!-- Output: 99,99 EUR -->
```

#### `formatPercentage(value, decimals)`

```astro
---
import { formatPercentage } from '@/lib/format';
---

{formatPercentage(85.5)} <!-- Output: 85% -->
{formatPercentage(85.5, 1)} <!-- Output: 85.5% -->
```

#### `getInitials(firstName, lastName)`

```astro
---
import { getInitials } from '@/lib/format';
---

{getInitials('Ion', 'Popescu')} <!-- Output: IP -->
```

#### `getStatusBadgeClass(status)`

```astro
---
import { getStatusBadgeClass } from '@/lib/format';
---

<span class={`badge ${getStatusBadgeClass('PAID')}`}>Plătit</span>
<!-- Output: <span class="badge badge-green">Plătit</span> -->
```

#### `getStatusLabel(status, context)`

```astro
---
import { getStatusLabel } from '@/lib/format';
---

{getStatusLabel('PENDING', 'payment')} <!-- Output: În așteptare -->
{getStatusLabel('ACTIVE', 'player')}   <!-- Output: Activ -->
```

#### `getEmojiForStatus(status, context)`

```astro
---
import { getEmojiForStatus } from '@/lib/format';
---

{getEmojiForStatus('PAID', 'payment')} <!-- Output: ✅ -->
{getEmojiForStatus('INJURED', 'player')} <!-- Output: 🩹 -->
```

---

## Best Practices

### 1. **Use Components Consistently**

When creating new pages, use the reusable components instead of writing custom HTML/CSS.

### 2. **Leverage Format Utilities**

Always use format utilities for displaying dates, currency, and status values across the app.

### 3. **Component Composition**

Combine components to create rich UIs:

```astro
<DetailPageTabs tabs={tabs} currentTab={tab} basePath={basePath} />

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
  <StatCard icon="👥" label="Jucători" value={count} />
  <StatCard icon="💳" label="Plăți" value={total} variant="success" />
  <StatCard icon="⚠️" label="Probleme" value={issues} variant="danger" />
</div>

<DataTable columns={columns} data={data} hover striped />
```

### 4. **Mobile Responsiveness**

All components are responsive by default. Test on mobile devices before deploying.

### 5. **Accessibility**

- Always provide meaningful `label` and `title` attributes
- Use semantic HTML where possible
- Ensure sufficient color contrast ratios

---

## Future Enhancements

- Add `Modal` component for consistent dialogs
- Add `Form` component with field validation
- Add `Pagination` component for large datasets
- Add `Search` component with filtering
- Add `Toast` notifications component

---

## Questions or Issues?

Review the component source files in `src/components/` for additional details and code examples.
