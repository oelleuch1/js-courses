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

# Web Components — The Native Browser API

**What you will learn:**
- What Web Components actually are (4 browser APIs)
- How to build one without any framework
- Shadow DOM: open vs closed, slots, styling
- Component communication: events up, properties down
- Why Lit exists — what it adds on top

---

## The 4 Building Blocks

Web Components are not a single API — they're **4 browser features** working together:

| API | What it does |
|---|---|
| **Custom Elements** | Register your own HTML tag (`<my-card>`) with behaviour |
| **Shadow DOM** | Give a component its own encapsulated DOM tree and styles |
| **HTML `<template>`** | Inert HTML fragment — not rendered until cloned into the page |
| **HTML `<slot>`** | Hole in a Shadow DOM where light DOM content gets projected |

Lit is just a thin library that makes these four APIs much less verbose. Under the hood it's still exactly these browser APIs running natively.

---

## Custom Elements — Registering a Tag

The minimum you need to create a custom element:

```typescript
// 1. Create a class that extends HTMLElement
class ProductBadge extends HTMLElement {

  // Called when the element is inserted into the DOM
  connectedCallback() {
    this.textContent = 'New';
  }
}

// 2. Register it with the browser under a custom tag name
//    Tag name MUST contain a hyphen — this avoids clashing with built-in HTML
customElements.define('product-badge', ProductBadge);
```

```html
<!-- 3. Now you can use it in HTML like any other element -->
<product-badge></product-badge>
```

> The hyphen rule (`product-badge`, not `productbadge`) is a browser requirement — it's what separates custom elements from built-in ones.

---

## Custom Elements — Lifecycle Callbacks

These are the native lifecycle hooks the browser calls automatically:

```typescript
class MyElement extends HTMLElement {

  connectedCallback() {
    // Element added to the DOM — initialise, fetch data, add listeners
  }

  disconnectedCallback() {
    // Element removed from the DOM — clean up timers, remove listeners
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // A watched attribute changed — react to it
    if (name === 'label') this.render();
  }

  // You must declare which attributes to watch
  static get observedAttributes() {
    return ['label', 'disabled'];
  }

  adoptedCallback() {
    // Element moved to a different document (rare — iframes)
  }
}
```

> **Lit equivalent:** `connectedCallback` → `connectedCallback`, `attributeChangedCallback` → `@property` decorator handles this automatically.

---

## Shadow DOM — Your Own Private DOM Tree

Shadow DOM lets a component have its own internal DOM structure and styles that the outside world can't accidentally break — and can't accidentally style.

```typescript
class MyCard extends HTMLElement {
  connectedCallback() {
    // attachShadow() creates the private DOM tree
    // mode: 'open'   → outside JS can access it via element.shadowRoot
    // mode: 'closed' → element.shadowRoot returns null (more private)
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        /* These styles are SCOPED — they don't leak out */
        p { color: navy; font-weight: bold; }
      </style>
      <p>I'm inside Shadow DOM</p>
    `;
  }
}

customElements.define('my-card', MyCard);
```

The `<p>` style above only affects the `<p>` inside this shadow root. Any `p { color: red }` on the page has zero effect here.

---

## Shadow DOM — Open vs Closed

```typescript
// Open — shadow root is accessible from outside
const shadow = this.attachShadow({ mode: 'open' });
element.shadowRoot; // → ShadowRoot object, you can query it

// Closed — shadow root is hidden from outside JS
const shadow = this.attachShadow({ mode: 'closed' });
element.shadowRoot; // → null
```

**Which to use?**
- **Open** is the standard in almost all cases — including Lit (which always uses `open`)
- **Closed** is for high-security components (browser built-ins like `<input>` use it internally)
- Closed doesn't actually prevent determined attackers — it's not a security boundary, just a privacy convention

> Lit always uses `open` mode. You never call `attachShadow` yourself with Lit — it happens automatically when the element renders.

---

## Slots — Projecting Content Into a Component

`<slot>` is the mechanism for passing HTML content *into* a web component. Think of it as a placeholder the component owner can fill from outside.

```html
<!-- Component template (inside Shadow DOM) -->
<div class="card">
  <div class="card__header">
    <slot name="header">Default header text</slot>  <!-- named slot -->
  </div>
  <div class="card__body">
    <slot></slot>                                    <!-- default slot -->
  </div>
  <div class="card__footer">
    <slot name="footer"></slot>                      <!-- named slot -->
  </div>
</div>
```

```html
<!-- Consumer — using the component -->
<my-card>
  <h2 slot="header">Laptop Pro</h2>     <!-- goes into slot name="header" -->
  <p>The best laptop of 2026.</p>       <!-- goes into the default slot -->
  <button slot="footer">Buy now</button>
</my-card>
```

---

## Slots — Styling Slotted Content

Slotted content lives in the **light DOM** (the consumer's document), not in the Shadow DOM. You can only style it from inside the shadow using `::slotted()`.

```css
/* Inside the component styles */

/* Target any element placed in the default slot */
::slotted(*) {
  margin: 0;
}

/* Target only paragraphs in the default slot */
::slotted(p) {
  color: #555;
  line-height: 1.6;
}

/* Target elements in a named slot */
::slotted([slot="header"]) {
  font-size: 1.2rem;
}
```

> **Limitation:** `::slotted()` only reaches one level deep — it can't select children of slotted elements.

---

## Slots in Lit

In Lit you use `<slot>` in your `render()` template exactly like in vanilla — no special API needed:

```typescript
@customElement('my-card')
export class MyCard extends LitElement {
  static styles = css`
    .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .card__header { padding: 12px 16px; background: #f5f5f5; }
    .card__body { padding: 16px; }
    ::slotted(p) { margin: 0 0 8px; }
  `;

  render() {
    return html`
      <div class="card">
        <div class="card__header">
          <slot name="header">Untitled</slot>
        </div>
        <div class="card__body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
```

---

## Component Communication — The Two Directions

Web components follow one rule: **properties/attributes down, events up**.

```
  Parent
    │
    │  @property / attribute   ← parent sets data on child
    ▼
  Child
    │
    │  CustomEvent (bubbles + composed)  ← child notifies parent
    ▼
  Parent listens with @eventname
```

This keeps components decoupled — child doesn't need to know who its parent is.

```typescript
// Parent passes data down via property binding (Lit syntax)
html`<product-card .product=${this.selectedProduct}></product-card>`

// Child sends events up
this.dispatchEvent(new CustomEvent('add-to-cart', {
  detail: { productId: this.product.id },
  bubbles: true,   // event travels up the DOM tree
  composed: true   // event crosses the Shadow DOM boundary ← REQUIRED
}));

// Parent listens
html`<product-card @add-to-cart=${this.handleAddToCart}></product-card>`
```

---

## `composed: true` — Why It Matters

This is one of the most common bugs with web component events and a likely interview question.

By default, events stop at the Shadow DOM boundary. They bubble up through the shadow root but **do not cross into the light DOM** where the parent lives.

```typescript
// WRONG — parent never receives this event
this.dispatchEvent(new CustomEvent('item-selected', {
  detail: { id: 1 },
  bubbles: true,
  // composed: false is the default
}));

// CORRECT — event crosses the Shadow DOM boundary
this.dispatchEvent(new CustomEvent('item-selected', {
  detail: { id: 1 },
  bubbles: true,
  composed: true,  // ← this is the fix
}));
```

> If a parent component is not receiving your event, the first thing to check is `composed: true`.

---

## Attributes vs Properties — What's the Difference?

This confuses a lot of people. They're two different ways to pass data to an element.

**Attributes** — exist in HTML, always strings, set via HTML or `setAttribute()`

**Properties** — exist in JavaScript, can be any type, set via JS or Lit's `.prop=` binding

```html
<!-- Attribute — string only, visible in the DOM -->
<my-card label="Hello"></my-card>

<!-- In Lit — property binding passes any JS value -->
<my-card .items=${this.productArray}></my-card>
```

```typescript
// Get attribute (always a string)
element.getAttribute('label') // → "Hello"

// Get property (full JS value)
element.items // → [{ id: 1, name: '...' }, ...]
```

> **Interview answer:** Use attributes for simple config (strings, booleans). Use properties for complex data (arrays, objects). Lit's `@property({ type: Array })` bridges both — it converts the attribute string automatically.

---

## Vanilla vs Lit — What Lit Adds

| Vanilla Web Component | With Lit |
|---|---|
| `attributeChangedCallback` + `observedAttributes` | `@property()` decorator |
| Manual `this.shadowRoot.querySelector(...)` updates | Reactive templates — just `${this.value}` |
| `this.attachShadow({ mode: 'open' })` | Automatic |
| Manual DOM diffing | Lit diffs and patches only changed parts |
| Boilerplate `connectedCallback` render call | Lifecycle managed automatically |
| ~50 lines for a simple counter | ~15 lines |

Lit doesn't change what's happening under the hood — it's still Custom Elements + Shadow DOM + slots. It just removes the boilerplate and makes the reactive update cycle predictable.

---

## Exercise 1 — Vanilla Custom Element

Build `<product-badge>` **without Lit** — using only `HTMLElement` and `customElements.define()`:
- Accepts a `label` attribute (`"new"`, `"sale"`, `"hot"`)
- Renders a styled badge using Shadow DOM
- Updates the text when the `label` attribute changes

Open `web-components.ts` → Exercise 1

---

## Answer 1 — Vanilla Custom Element

```typescript
class ProductBadge extends HTMLElement {
  static get observedAttributes() { return ['label']; }

  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }

  attributeChangedCallback() { this.render(); }

  private render() {
    const label = this.getAttribute('label') ?? 'new';
    this.shadow.innerHTML = `
      <style>
        span {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          background: ${label === 'sale' ? '#e74c3c' : '#2ecc71'};
          color: white;
        }
      </style>
      <span>${label}</span>
    `;
  }
}

customElements.define('product-badge', ProductBadge);
```

---

## Exercise 2 — Slots

Build `<info-card>` in Lit with **three named slots**: `header`, `body`, `footer`.
- Default fallback text for each slot when nothing is provided
- Style slotted `<p>` elements with `::slotted(p)`
- The header slot content should have a distinct background

Open `web-components.ts` → Exercise 2

---

## Answer 2 — Slots

```typescript
@customElement('info-card')
export class InfoCard extends LitElement {
  static styles = css`
    :host { display: block; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .header { padding: 12px 16px; background: #f5f5f5; font-weight: 600; }
    .body   { padding: 16px; }
    .footer { padding: 10px 16px; background: #fafafa; font-size: 0.85rem; color: #777; }
    ::slotted(p) { margin: 0 0 8px; line-height: 1.5; }
    ::slotted(p:last-child) { margin-bottom: 0; }
  `;

  render() {
    return html`
      <div class="header">
        <slot name="header">Untitled</slot>
      </div>
      <div class="body">
        <slot>No content provided.</slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }
}
```

---

## Exercise 3 — Component Communication

Build two components:
- `<product-item>` — displays a product name and price, has an "Add" button
  - On button click: dispatches `add-to-cart` with `{ detail: { name, price } }`
- `<cart-summary>` — listens for `add-to-cart` events on itself, keeps a count
  - Displays: `"Cart: X items"`

The two components should communicate only through events — no shared variable.

Open `web-components.ts` → Exercise 3

---

## Answer 3 — Component Communication

```typescript
@customElement('product-item')
export class ProductItem extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: Number }) price = 0;

  render() {
    return html`
      <span>${this.name} — €${this.price}</span>
      <button @click=${this.handleAdd}>Add</button>
    `;
  }

  private handleAdd() {
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: { name: this.name, price: this.price },
      bubbles: true,
      composed: true,  // must cross Shadow DOM boundary
    }));
  }
}

@customElement('cart-summary')
export class CartSummary extends LitElement {
  @state() private count = 0;

  connectedCallback() {
    super.connectedCallback();
    // Listen on the host element itself — events bubble up to it
    this.addEventListener('add-to-cart', () => this.count++);
  }

  render() {
    return html`<p>Cart: ${this.count} items</p>`;
  }
}
```
