---
name: web-design-guidelines
description: Review UI code for Vercel Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check against web design guidelines".
---

# Web Interface Guidelines (by Vercel)

Review frontend UI files and components for compliance with Vercel's Web Interface Guidelines.

## Guidelines Checklist

### 1. Accessibility
- **Icon-only buttons**: Always provide an explicit `aria-label`.
- **Form controls**: Always associate `<label>` with `htmlFor` or include an `aria-label`.
- **Interactive elements**: Provide keyboard handlers (`onKeyDown`, `onKeyUp`, Enter, Space).
- **Semantics**: Use `<button>` for actions, `<a>` / `<Link>` for navigation. Never `<div onClick>`.
- **Images**: Require descriptive `alt` attribute (or `alt=""` if strictly decorative).
- **Icons**: Decorative SVG icons require `aria-hidden="true"`.
- **Live Regions**: Asynchronous updates (toast notifications, validation messages) need `aria-live="polite"`.
- **Heading Hierarchy**: Maintain strict sequential heading order `<h1>` through `<h6>`.
- **Anchor Offsets**: Apply `scroll-margin-top` on heading anchors with fixed headers.

### 2. Focus States
- **Visible Focus**: Interactive elements must feature visible focus rings (e.g. `focus-visible:ring-2 focus-visible:outline-none`).
- **Never bare outline-none**: Do not use `outline: none` or `outline-none` without a calibrated replacement focus indicator.
- **`:focus-visible` over `:focus`**: Prevent intrusive focus rings on mouse click while preserving keyboard accessibility.
- **Compound Controls**: Group focus states using `:focus-within`.
- **Occlusion**: Sticky headers, footers, or overlays must not occlude focused elements.

### 3. Forms & Inputs
- **Autocomplete & Names**: Inputs must define `name` and appropriate `autocomplete` attributes.
- **Input Types**: Use precise input types (`email`, `tel`, `url`, `number`) and `inputmode`.
- **Paste Preservation**: Never block paste (`onPaste` + `preventDefault`).
- **Hit Targets**: Checkbox/radio label and control must share a unified hit target with no dead zone.
- **Submit Feedback**: Keep submit button enabled until request initiates; show a loading spinner during execution.
- **Inline Errors**: Display error messages adjacent to invalid inputs; focus the first error on validation failure.
- **Placeholders**: Ellipsis ending `…` with a clear example pattern.
- **Spellcheck**: Turn off spellcheck for emails, codes, and usernames (`spellCheck={false}`).

### 4. Animation & Motion
- **Reduced Motion**: Honor `prefers-reduced-motion` (disable or provide instant transitions).
- **Compositor Friendly**: Only animate `transform` and `opacity` to avoid layout thrashing.
- **Explicit Transitions**: Avoid `transition: all`. Explicitly specify transitioned properties (e.g. `transition: transform 0.15s ease, opacity 0.15s ease`).
- **Transform Origin**: Explicitly configure `transform-origin` on scaling and rotating elements.
- **Interruptible**: Micro-interactions must feel snappy and remain interruptible by user input.

### 5. Typography & Formatting
- **Ellipsis**: Use proper unicode horizontal ellipsis `…` instead of three periods `...`.
- **Quotes**: Use curly typographic quotation marks `“` and `”` rather than straight quotes `"`.
- **Non-breaking Spaces**: Insert `&nbsp;` between values and units (`10&nbsp;MB`), shortcut symbols (`⌘&nbsp;K`), and brand terms.
- **Tabular Numbers**: Use `font-variant-numeric: tabular-nums` or `tabular-nums` for numeric counters, timestamps, and column data.
- **Widow Prevention**: Apply `text-wrap: balance` or `text-wrap: pretty` on headlines and cards.

### 6. Content Handling & Resilience
- **Truncation**: Constrain text containers with `truncate`, `line-clamp-*`, or `break-words`.
- **Flex Child Overflow**: Add `min-w-0` to flex child containers to enable text truncation without layout blowouts.
- **Empty States**: Gracefully render zero-state, empty array, and null states.
- **Variable Length**: Test UI resilience against short, realistic, and extreme text strings.

### 7. Performance & Images
- **Aspect Ratio & Dimensions**: Provide explicit `width` and `height` (or aspect-ratio) on images to eliminate CLS (Cumulative Layout Shift).
- **Loading Strategy**: Set `loading="lazy"` on below-the-fold assets, and `priority` on above-the-fold LCP candidates.
- **No Layout Thrashing**: Never perform layout reads (`getBoundingClientRect`, `offsetHeight`, `scrollTop`) inside render cycles.
