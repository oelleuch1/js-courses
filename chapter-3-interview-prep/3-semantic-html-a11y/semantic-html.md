---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: 'Segoe UI', sans-serif;
    font-size: 20px;
    padding: 40px 60px;
  }
  h1 { color: #1a1a2e; border-bottom: 3px solid #e94560; padding-bottom: 10px; }
  h2 { color: #16213e; }
  code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #f0f2f5; color: #2d2d2d; padding: 20px; border-radius: 8px; font-size: 0.75em; }
  table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
  th { background: #16213e; color: white; padding: 8px; }
  td { padding: 8px; border: 1px solid #ddd; }
  blockquote { border-left: 4px solid #e94560; padding-left: 16px; color: #555; font-style: italic; }
---

# Semantic HTML + Accessibility (a11y)

**What you will learn:**
- Choose correct semantic elements for structure and meaning
- Apply ARIA attributes correctly
- Make interactive elements keyboard accessible
- Understand WCAG principles

---

## Semantic Landmarks

```html
<header>      <!-- site header, logo, main nav -->
<nav>         <!-- navigation links -->
<main>        <!-- unique main content per page (only one per page) -->
<article>     <!-- self-contained piece of content -->
<section>     <!-- thematic grouping — always pair with a heading -->
<aside>       <!-- tangentially related content, sidebars -->
<footer>      <!-- site or article footer -->
<figure>      <!-- self-contained media with optional caption -->
<figcaption>  <!-- caption for figure -->
```

> **Rule:** If it has its own heading and could stand alone → `<article>`.
> If it groups related content within a page → `<section>`.

---

## Native Elements vs ARIA Anti-patterns

| Wrong | Right | Why |
|---|---|---|
| `<div @click>` | `<button>` | Keyboard focusable + screen reader role |
| `<div role="link">` | `<a href="">` | Native semantics + keyboard support |
| `<div>` for form | `<form>` | Enter key submit, form role, accessible |
| `<p>` for error | `<p role="alert">` | Screen reader announces immediately |
| `<div class="list">` | `<ul><li>` | Announced as list with item count |

---

## `<a>` vs `<button>` — The Most Common Mistake

These two look similar but serve completely different purposes. You cannot nest them, and you should never use one for the other's job.

| | `<a>` — Anchor | `<button>` — Button |
|---|---|---|
| **Purpose** | Navigation — goes somewhere | Action — triggers something |
| **When to use** | Links, page anchors, external URLs | Click handlers, submit, toggle |
| **Keyboard** | Enter activates | Enter + Space activate |
| **Default cursor** | pointer (underlined) | pointer |

**`href` has exactly 3 forms:**
```html
<a href="https://example.com">External link</a>   <!-- opens another site -->
<a href="/about">Internal link</a>                 <!-- navigates within app -->
<a href="#section-id">Scroll link</a>              <!-- jumps to id on page -->
```

**Wrong — can't nest, can't combine:**
```html
<a href="/product"><button>View</button></a>  ← invalid HTML, undefined behaviour
```

**Rule:** If pressing it navigates → `<a>`. If pressing it *does something* → `<button>`.

---

## Form, Article, Section — Which One?

`<form>` is only correct when there are inputs the user fills in and submits. A product card, a display panel, a read-only info block — these are *not* forms even if they look boxed.

```html
<!-- WRONG: form with no inputs -->
<form class="product-card">
  <h2>Laptop Pro</h2>
  <p>€999</p>
  <button>Add to cart</button>   ← this is a user action, not a form submit
</form>

<!-- RIGHT: article — self-contained, could stand alone -->
<article class="product-card">
  <h2>Laptop Pro</h2>
  <p>€999</p>
  <button type="button">Add to cart</button>
</article>

<!-- RIGHT: section — groups related content with a heading -->
<section aria-labelledby="filters-heading">
  <h2 id="filters-heading">Filter by</h2>
  ...
</section>
```

---

## Heading Order — The Document Outline

Screen readers and assistive tools use headings as navigation landmarks. Users can jump between h1 → h2 → h3 like a table of contents.

**Rules:**
- One `<h1>` per page — the main page title
- Don't skip levels: h1 → h2 → h3 ✓ — h1 → h3 ✗
- Heading level = document structure, not visual size (use CSS for size)
- Inside a component: if the page uses h2, your sub-items should be h3

```html
<!-- WRONG — skips h2, heading used just to look small -->
<h1>Products</h1>
<h3>Description</h3>   ← jumped from h1 to h3, breaks the outline

<!-- RIGHT -->
<h1>Products</h1>
  <h2>Laptop Pro</h2>
    <h3>Description</h3>   ← logical hierarchy
    <h3>Specifications</h3>

<!-- WRONG — using div with class for visual subtitle -->
<div class="product-subtitle">Technical specs</div>

<!-- RIGHT — semantic heading for subtitles -->
<h3>Technical specs</h3>
```

---

## Images and Dividers

**`<img>` — alt attribute is not optional**

```html
<!-- WRONG — no alt: screen reader reads the filename -->
<img src="product.jpg">

<!-- WRONG — empty alt missing: same problem -->
<img src="product.jpg" alt>

<!-- RIGHT — descriptive alt for informative images -->
<img src="product.jpg" alt="Laptop Pro 15 inch in silver">

<!-- RIGHT — empty string for decorative images (screen reader skips it) -->
<img src="decoration.svg" alt="">
```

The difference between `alt=""` (decorative, skip) and a missing `alt` (reads filename aloud) matters.

**`<hr>` for visual dividers — not `<div>`**

```html
<!-- WRONG — a div with a line style has no meaning -->
<div class="divider"></div>

<!-- RIGHT — hr = thematic break between sections -->
<hr>
```

`<hr>` is announced as "separator" by screen readers and signals a content section change. Style it with CSS if needed.

---

## ARIA — When to Use

**Rule #1: Always prefer native HTML over ARIA.**

```html
<!-- Don't: -->
<div role="button" tabindex="0">Click</div>

<!-- Do: -->
<button>Click</button>
```

**Use ARIA only when native elements aren't enough:**
```html
<div aria-live="polite" aria-atomic="true">${this.statusMessage}</div>
<button aria-label="Close dialog">×</button>
<input aria-describedby="hint-id" />
<p id="hint-id">Must be at least 8 characters</p>
```

---

## ARIA Attributes — The Full Picture

**Naming an element** (how it gets announced):

| Attribute | When to use | Example |
|---|---|---|
| `aria-label` | No visible text label exists | `<button aria-label="Close">×</button>` |
| `aria-labelledby` | Label text is already visible on screen | `<input aria-labelledby="title-id">` |
| `aria-describedby` | Extra description after the label | `<input aria-describedby="hint-id">` |

The difference: `aria-label` *replaces* the name. `aria-labelledby` *points to* visible text. `aria-describedby` adds a secondary description read after the name.

---

## ARIA Attributes — State and Live Regions

**Hiding and revealing:**
```html
aria-hidden="true"      <!-- hide from screen readers (decorative icon, duplicate text) -->
aria-expanded="false"   <!-- for toggles: accordion, dropdown, menu -->
aria-current="page"     <!-- marks current item in nav, breadcrumb, pagination -->
aria-required="true"    <!-- required form field -->
aria-invalid="true"     <!-- field has a validation error -->
aria-disabled="true"    <!-- disabled state (use with tabindex="-1" too) -->
```

**Live regions — announcing dynamic changes:**
```html
<!-- polite: waits for user to finish current action before announcing -->
<div aria-live="polite">3 results found</div>

<!-- assertive: interrupts immediately — use only for critical errors -->
<div aria-live="assertive" role="alert">Session expired. Please log in again.</div>

<!-- aria-busy: tells screen reader "content is loading, wait" -->
<div aria-live="polite" aria-busy="true">Loading products...</div>
```

**Role shortcuts:** `role="alert"` = `aria-live="assertive"` + `aria-atomic="true"` in one.

---

## Keyboard Navigation Checklist

- All interactive elements reachable by `Tab`
- `Enter` or `Space` activates buttons and links
- `Escape` closes dialogs and menus
- Visible focus indicator — never just `outline: none`
- Logical tab order matching visual order
- Focus **trapped** inside open modals
- Focus **returned** to trigger after modal closes

---

## In Lit — Accessibility Patterns

```typescript
// Loading state — screen readers follow aria-live
html`
  <div aria-live="polite" aria-busy=${this.loading}>
    ${this.loading ? html`<span>Loading...</span>` : this.renderContent()}
  </div>
`

// Error announced immediately via role="alert"
html`<p role="alert" class="error">${this.errorMessage}</p>`

// Icon button — label must make sense out of context
html`<button aria-label="Delete product ${this.product.name}">🗑</button>`

// Dynamic count in heading
html`
  <h2>Products <span aria-live="polite">(${this.count})</span></h2>
`
```

---

## Exercise 1 — Semantic Rewrite

Rewrite the `<div>`-soup in `semantic-html.ts → PageLayout`:
- Site header with logo and nav links
- Main content with a heading and product list
- Footer with copyright

Open `semantic-html.ts` → Exercise 1

---

## Answer 1 — Semantic Rewrite

```typescript
render() {
  return html`
    <header>
      <span class="logo">ShopApp</span>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/products">Products</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <h1>Featured Products</h1>
      <section aria-label="Product list">
        <ul>
          <li>Laptop</li>
          <li>Mouse</li>
          <li>Keyboard</li>
        </ul>
      </section>
    </main>
    <footer><p>© 2026 ShopApp</p></footer>
  `;
}
```

---

## Exercise 2 — Accessible Product Card

Fix three a11y issues in `semantic-html.ts → ProductCardA11y`:
1. Rating stars — not readable by screen readers
2. Sale price — reduction not announced
3. Button label — "Add to cart" means nothing out of context

Open `semantic-html.ts` → Exercise 2

---

## Answer 2 — Accessible Product Card

```typescript
// 1. Stars — wrap with aria-label + role="img"
private renderStars(rating: number) {
  const filled = '★'.repeat(rating);
  const empty  = '☆'.repeat(5 - rating);
  return html`
    <span class="stars" role="img" aria-label="Rating: ${rating} out of 5 stars">
      ${filled}${empty}
    </span>
  `;
}

// 2. Sale price — hide visual from SR, provide readable text
${isOnSale ? html`
  <span class="original" aria-hidden="true">€${originalPrice}</span>
  <span class="sr-only">Was €${originalPrice}, now</span>
  <span class="sale">€${price.toFixed(2)}</span>
` : html`<span>€${price.toFixed(2)}</span>`}

// 3. Button — include product name for context
<button @click=${() => {}}>Add ${name} to cart</button>
```

---

## Exercise 3 — Keyboard Navigation

Add keyboard support to `AccessibleDropdown` in `semantic-html.ts`:
- `Enter` / `Space` — open/close
- `ArrowDown` / `ArrowUp` — move focus through options
- `Escape` — close and return focus to trigger
- Correct ARIA: `aria-haspopup`, `aria-expanded`, `role="listbox"`, `role="option"`, `aria-selected`

Open `semantic-html.ts` → Exercise 3

---

## Answer 3 — Keyboard Navigation

```typescript
private handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    this.isOpen = !this.isOpen;
  } else if (e.key === 'Escape') {
    this.isOpen = false;
    (this.shadowRoot?.querySelector('.trigger') as HTMLElement)?.focus();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    this.focusedIndex = Math.min(this.focusedIndex + 1, this.options.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
  }
}

// Trigger button ARIA:
html`
  <button class="trigger"
    aria-haspopup="listbox"
    aria-expanded=${this.isOpen}
    aria-controls="dropdown-list"
    @click=${() => this.isOpen = !this.isOpen}
    @keydown=${this.handleKeyDown}>
    ${this.options[this.selectedIndex]} ▼
  </button>
`

// List ARIA:
html`
  <ul id="dropdown-list" role="listbox">
    ${this.options.map((opt, i) => html`
      <li role="option" aria-selected=${i === this.selectedIndex}
        @click=${() => { this.selectedIndex = i; this.isOpen = false; }}>
        ${opt}
      </li>
    `)}
  </ul>
`
