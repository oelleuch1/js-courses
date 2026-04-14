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

# CSS — BEM + SASS + Custom Properties

**What you will learn:**
- Apply BEM naming methodology
- Use SASS nesting for BEM
- Use CSS custom properties to style across Shadow DOM
- Know when to use each approach

---

## BEM — What It Actually Means in Plain English

BEM is just a naming convention that makes your CSS self-documenting. When you look at a class name, you can immediately tell **where it lives** and **what state it's in** — without reading the HTML.

**`__` double underscore = "I am a child of this block"**

It shows parent-child relationship in the name itself. You're not relying on nesting in the CSS or HTML to know that `.product-card__title` belongs to `.product-card`.

**`--` double dash = "I am a variant or state of this thing"**

A modifier overrides the default state or adds extra styles. It never stands alone — `.product-card--featured` only makes sense on a `.product-card`.

```
.product-card               → the block (self-contained component)
.product-card__title        → "title" lives inside "product-card"
.product-card__title--large → the title, in its large variant
.product-card--featured     → the whole card, in its featured state
```

The class name tells the full story: *what it is*, *where it belongs*, *what state it's in*.

---

## BEM Quick Reference

**B**lock → **E**lement (`__`) → **M**odifier (`--`)

```css
.product-card { }                        /* Block */
.product-card__image { }                 /* Element */
.product-card__title { }
.product-card__price { }
.product-card__price--discounted { }     /* Element modifier */
.product-card__badge { }
.product-card--featured { }              /* Block modifier */
.product-card--out-of-stock { }
```

---

## BEM in SASS

```scss
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  &__price {
    color: #333;

    &--discounted {         /* element modifier */
      color: #c0392b;
      font-weight: bold;
    }
  }

  &--featured {             /* block modifier */
    border-color: #f39c12;
    box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
  }

  &--out-of-stock {
    opacity: 0.6;
    pointer-events: none;
  }
}
```

---

## CSS Custom Properties — Shadow DOM Bridge

Shadow DOM blocks all external CSS **except** custom properties.

```css
/* Inside the Lit component — define defaults with :host */
:host {
  display: block;
  --product-card-bg: white;
  --product-card-radius: 8px;
  --product-card-border: 1px solid #ddd;
}

.card {
  background: var(--product-card-bg);
  border-radius: var(--product-card-radius);
  border: var(--product-card-border);
}
```

```css
/* External page — override without touching the component */
product-card {
  --product-card-bg: #f8f9fa;
  --product-card-radius: 0;
}
```

---

## rem vs px — Why It Matters for Accessibility

`px` is absolute — 16px is always 16px regardless of any browser or OS settings.

`rem` is relative to the **root font size** — the size the user (or browser) has set as their base. The browser default is 16px, so `1rem = 16px` by default. But if a user has set their browser font size to 20px (common for people with visual impairments), `1rem = 20px`.

```css
/* px — ignores user's browser font size preference */
font-size: 14px;    /* always 14px, even if user needs bigger text */
padding: 16px;

/* rem — scales with user's preference */
font-size: 0.875rem;  /* 14px at default, 17.5px if user set 20px base */
padding: 1rem;         /* 16px at default, 20px if user set 20px base */
```

**Practical rule:**
- Use `rem` for **font sizes and spacing** — things that should scale with text
- `px` is fine for **borders, box-shadows, 1px lines** — things that shouldn't scale

```css
/* Good combination */
.card {
  font-size: 1rem;        /* scales */
  padding: 1.5rem;        /* scales */
  border: 1px solid #ddd; /* stays crisp at 1px */
  border-radius: 0.5rem;  /* scales */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* fine as px */
}
```

---

## CSS Pseudo-classes — Targeting Elements by State

A **pseudo-class** targets an element based on its *state* or *position*. Single colon `:`.
A **pseudo-element** creates virtual content. Double colon `::` (e.g. `::before`, `::after`).

**Position-based:**
```css
li:first-child          /* first item in its parent */
li:last-child           /* last item */
li:nth-child(2)         /* exactly the 2nd item */
li:nth-child(2n)        /* every even item (2, 4, 6...) — zebra striping */
li:nth-child(2n+1)      /* every odd item (1, 3, 5...) */
li:nth-child(3n)        /* every 3rd item */
```

**State-based:**
```css
a:hover                 /* mouse over */
input:focus             /* keyboard or click focus */
input:focus-visible     /* only keyboard focus — skip mouse focus */
input:checked           /* checkbox or radio that's checked */
:empty                  /* element with no children */
```

**Exclusion:**
```css
li:not(:last-child)     /* all list items except the last */
li:not(.disabled)       /* all items without class "disabled" */
button:not([disabled])  /* all buttons that aren't disabled */
```

**Practical examples:**
```css
/* Zebra striping a table */
tr:nth-child(2n) { background: #f5f5f5; }

/* Style all items except last (no border on last divider) */
li:not(:last-child) { border-bottom: 1px solid #eee; }
```

---

## SASS Variables vs CSS Custom Properties

| | SASS Variables | CSS Custom Properties |
|---|---|---|
| When resolved | Build-time | Runtime |
| Can JS change them? | No | Yes |
| Crosses Shadow DOM? | No | **Yes** |
| Browser support | N/A (compiled away) | 97%+ |
| Best for | Design tokens at build time | Runtime theming, Lit components |

---

## Interview Questions — CSS

**Q: How do you style inside a web component from outside?**
You can't with regular CSS (Shadow DOM). Options:
- **CSS custom properties** — pierce the boundary
- **`::part()`** — author exposes elements with `part="name"`
- **`::slotted()`** — style projected slot content

**Q: What is `::part()`?**
```html
<!-- Inside component template -->
<button part="submit-button">Submit</button>
```
```css
/* External page can style it */
my-form::part(submit-button) { background: green; }
```

**Q: SASS vs LESS?**
Both are preprocessors. SASS (SCSS) is more popular, better tooling. LESS is rarely used today. In Lit you often use the `css` tagged template directly.

---

## Utility Classes vs BEM — Know the Difference

You might see code like this in the wild:

```html
<div class="mt-100px pr-20px flex-row">...</div>
```

These are **utility classes** (Tailwind CSS style) — one class = one CSS property. They're not BEM. They're a completely different approach: instead of naming components, you compose styles from small atomic classes directly in the HTML.

**BEM** → component-scoped, meaningful names, good for design systems and Lit components
**Utility classes** → rapid prototyping, no context-switching between HTML and CSS, popular in Tailwind

In Shadow DOM Lit components, BEM (or just descriptive class names) is the natural choice — the shadow boundary already scopes your styles, so you don't need utility classes for isolation.

---

## Exercise 1 — BEM Naming

Given a navigation component with these parts:
- The nav itself
- A logo on the left
- A list of links
- A single active link
- A hamburger button (mobile)
- An open/expanded state of the nav

Write all BEM class names.

---

## Answer 1 — BEM Naming

```css
.site-nav { }                      /* Block */

.site-nav__logo { }                /* Elements */
.site-nav__links { }
.site-nav__link { }
.site-nav__hamburger { }

.site-nav__link--active { }        /* Element modifier */

.site-nav--open { }                /* Block modifier */
```

```html
<nav class="site-nav site-nav--open">
  <a class="site-nav__logo" href="/">ShopApp</a>
  <ul class="site-nav__links">
    <li><a class="site-nav__link site-nav__link--active" href="/">Home</a></li>
    <li><a class="site-nav__link" href="/products">Products</a></li>
  </ul>
  <button class="site-nav__hamburger">☰</button>
</nav>
```

---

## Exercise 2 — SASS Nesting

Convert this flat BEM CSS to SASS using `&` nesting:

```css
.card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
.card__header { font-size: 1.2rem; font-weight: bold; margin-bottom: 8px; }
.card__body { color: #555; line-height: 1.5; }
.card__footer { font-size: 0.85rem; color: #999; margin-top: 12px; }
.card--highlighted { border-color: #f39c12; background: #fffbf0; }
.card--highlighted .card__header { color: #f39c12; }
```

---

## Answer 2 — SASS Nesting

```scss
.card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;

  &__header {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__body {
    color: #555;
    line-height: 1.5;
  }

  &__footer {
    font-size: 0.85rem;
    color: #999;
    margin-top: 12px;
  }

  &--highlighted {
    border-color: #f39c12;
    background: #fffbf0;

    .card__header { color: #f39c12; }  // or: #{&}__header
  }
}
```

---

## Exercise 3 — CSS Custom Properties in Lit

Create a `<themed-card>` Lit component where the consumer controls:
- Background color via `--card-bg`
- Text color via `--card-color`
- Border radius via `--card-radius`

With sensible defaults when the variables are not set.

---

## Answer 3 — CSS Custom Properties in Lit

```typescript
@customElement('themed-card')
export class ThemedCard extends LitElement {
  @property({ type: String }) heading = '';
  @property({ type: String }) body = '';

  static styles = css`
    :host {
      display: block;
      /* Define defaults — consumer overrides these */
      --card-bg: white;
      --card-color: #333;
      --card-radius: 8px;
    }
    .card {
      background: var(--card-bg);
      color: var(--card-color);
      border-radius: var(--card-radius);
      border: 1px solid #ddd;
      padding: 16px;
    }
  `;

  render() {
    return html`
      <div class="card">
        <h2>${this.heading}</h2>
        <p>${this.body}</p>
      </div>
    `;
  }
}
```

```css
/* External page — no component code changed */
themed-card.dark {
  --card-bg: #1a1a2e;
  --card-color: #eee;
  --card-radius: 0;
}
```
