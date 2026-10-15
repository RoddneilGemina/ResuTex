---
name: full-design-system
description: Full design system architecture skill for AI coding agents. Enforces end-to-end design system best practices, multi-tier design tokens (primitives, semantics, components), accessibility standards, component variants, unified states, and anti-slop design engineering.
---

# Full Design System Architecture & Implementation Skill

A comprehensive, production-grade guide for conceiving, architecting, scaling, and implementing full design systems across web applications.

---

## 1. Multi-Tier Design Token Architecture

Every full design system must be structured into three distinct, non-leaking token tiers:

```
[Tier 1: Primitives] ───► [Tier 2: Semantics] ───► [Tier 3: Component Tokens]
  (Raw Hex, Values)         (Purpose & Roles)         (Scoped Element Specs)
  #090d16, 14px, 400        --canvas, --ink-muted     --btn-primary-bg
```

### Tier 1: Primitives (Values without context)
- **Palette**: Neutral scales (slate, gray, zinc, or warm neutral 50–950), brand accents, semantic base colors.
- **Typography**: Raw font families (`Inter`, `Geist Sans`, `EB Garamond`), weight steps (300, 400, 500, 600, 700), raw sizes (12px, 14px, 16px, 20px, 24px, 32px, 48px, 64px).
- **Spacing**: 4px baseline grid (`space-1`: 4px, `space-2`: 8px, `space-3`: 12px, `space-4`: 16px, `space-6`: 24px, `space-8`: 32px, `space-12`: 48px).
- **Radii**: `rounded-none`, `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (12px), `rounded-xl` (16px), `rounded-full` (9999px).
- **Shadows**: Calibrated multi-layer ambient + direct shadows (never single heavy black drop-shadows).

### Tier 2: Semantics (Contextual intent & role)
- **Surfaces**: `--canvas` (page background), `--surface-soft` (cards/inputs), `--surface-raised` (popovers/modals), `--surface-sunken` (wells/previews).
- **Text & Foreground**: `--ink` (primary copy), `--ink-muted` (supporting copy), `--ink-subtle` (captions/metadata), `--inverse-ink` (contrasting text on inverted canvas).
- **Borders & Dividers**: `--hairline` (subtle separating borders), `--hairline-soft` (internal grid dividers).
- **Feedback & Status**: `--status-success`, `--status-warning`, `--status-error`, `--status-info`.

### Tier 3: Component Tokens (Component-scoped overrides)
- Button: `--btn-height`, `--btn-padding-x`, `--btn-radius`, `--btn-bg`, `--btn-text`, `--btn-focus-ring`.
- Input: `--input-border`, `--input-focus-border`, `--input-placeholder`, `--input-bg`.
- Card: `--card-bg`, `--card-border`, `--card-padding`, `--card-radius`, `--card-shadow`.

---

## 2. Typographic Hierarchy & Scale

1. **Display & Hero**:
   - `clamp(40px, 5vw, 80px)` with tight line-height (`1.05`–`1.15`) and negative tracking (`-0.03em` to `-0.02em`).
2. **Headlines (`h1`–`h3`)**:
   - `h1`: 32px–40px, `h2`: 24px–28px, `h3`: 18px–20px. Font weight 600–700 with letter-spacing calibrated for legibility.
3. **Eyebrows & Labels**:
   - 10px–12px uppercase monospace or tight sans, letter-spacing `+0.05em` to `+0.08em`, font-weight 600.
4. **Body Copy**:
   - Base 15px–16px, line-height 1.5–1.6, letter-spacing `-0.01em` on modern sans-serifs.
5. **Data & Tabular**:
   - Apply `tabular-nums` / `font-variant-numeric: tabular-nums` to all prices, counts, percentages, and metrics.

---

## 3. Component Architecture & Anatomy

Every core component must provide:
1. **Explicit Variants**: Primary, Secondary, Ghost, Destructive, Outline, Subtle.
2. **Standard Sizes**: Small (`sm`), Medium (`md`), Large (`lg`).
3. **Full State Coverage**:
   - `rest`: Default clean presentation.
   - `hover`: Subtle brightness/surface shift (scale 1.01 max, never bouncy gimmicks).
   - `focus-visible`: 2px offset ring with high contrast (`focus-visible:ring-2 focus-visible:ring-offset-2`).
   - `active`: Slight depression (scale 0.98 or darker shade).
   - `disabled`: Opacity 0.4–0.5, pointer-events none, non-focusable cursor.
   - `loading`: Retains component geometry with inline spinner or skeleton pulse.
4. **Zero Layout Thrashing**: Dimensions must not jump between states (e.g., border width changes should use box-shadow or transparent borders).

---

## 4. Dark Mode & High-Contrast Adaptation

- **Never invert 1:1**: True black `#000000` is reserved for high-contrast accents or borders; preferred dark canvas is calibrated dark slate/navy (e.g. `#090d16`, `#0b0f19`).
- **Elevations via Lightness**: In dark mode, raised cards and modals get lighter background tones (`#111827` -> `#1e293b`), mimicking ambient reflection.
- **Hairlines**: Light mode borders (`#e5e7eb` / `#e2e8f0`), Dark mode borders (`#1e293b` / `#334155`).

---

## 5. Accessibility & Engineering Quality Standards

- **Color Contrast**: Minimum 4.5:1 for normal text (WCAG AA), 3:1 for large display text and interactive UI borders.
- **Hit Targets**: Minimum 44x44 CSS pixels for all touch/mouse interactive controls.
- **Semantic Tags**: Always use native HTML elements (`<button>`, `<dialog>`, `<nav>`, `<aside>`, `<main>`) before ARIA workarounds.
- **Reduced Motion**: All animations wrapped with `@media (prefers-reduced-motion: reduce)`.

---

## 6. Anti-Slop Design Directives

- 🚫 **Banned**: Clichéd purple/violet saturated gradient blobs behind every heading.
- 🚫 **Banned**: Three identical feature cards with generic placeholder copy ("Seamlessly elevate your workflow").
- 🚫 **Banned**: Uncalibrated glassy cards stacked inside other glassy cards.
- 🚫 **Banned**: Tiny unreadable text inside decorative badges.
- ✅ **Required**: Intentional typography contrast (e.g. EB Garamond editorial pairing with Geist Sans or Inter).
- ✅ **Required**: Purposeful visual rhythm, generous calibrated whitespace, and clear information density.
