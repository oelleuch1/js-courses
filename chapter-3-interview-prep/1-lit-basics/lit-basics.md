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

# Lit Basics — TypeScript

**What you will learn:**
- Create a LitElement component with properties and state
- Understand the rendering lifecycle
- Use templates, directives, and event handling
- Understand Shadow DOM and style encapsulation

---

## Core Imports

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
```

---

## Decorators Quick Reference

| Decorator | Purpose |
|---|---|
| `@customElement('tag-name')` | Registers element as `<tag-name>` |
| `@property()` | Public reactive property (attribute-reflected) |
| `@state()` | Private reactive state (no attribute) |
| `@query('selector')` | Like `shadowRoot.querySelector()` |
| `@queryAll('selector')` | Like `shadowRoot.querySelectorAll()` |

---

## @property Options

```typescript
// Reflect to HTML attribute (default: true for primitives)
@property({ type: String, reflect: true }) status = 'active';

// Attribute name differs from property name
@property({ type: Number, attribute: 'max-items' }) maxItems = 10;

// No attribute mapping at all
@property({ type: Array, attribute: false }) items: string[] = [];

// Custom converter
@property({
  converter: {
    fromAttribute: (val) => val?.split(',') ?? [],
    toAttribute: (val: string[]) => val.join(','),
  }
}) tags: string[] = [];
```

---

## Lifecycle Hooks

```typescript
connectedCallback()         // DOM attached — call super.connectedCallback() first!
disconnectedCallback()      // DOM removed — clean up listeners here
attributeChangedCallback()  // attribute changed (handled by Lit automatically)
willUpdate(changed)         // before render — derive computed state here
render()                    // return TemplateResult — the only required method
firstUpdated(changed)       // first render done — safe to access DOM/focus
updated(changed)            // after every update — respond to prop changes
```

> **Interview tip:** `super.connectedCallback()` — forgetting this is a common junior mistake they will look for in code review.

---

## Template Syntax

```typescript
render() {
  return html`
    <p>${this.message}</p>                              <!-- text binding -->

    <input .value=${this.value}>                        <!-- property binding -->

    <button ?disabled=${this.isLoading}>Submit</button> <!-- boolean attribute -->

    <button @click=${this.handleClick}>Click</button>   <!-- event listener -->

    ${this.show ? html`<span>Visible</span>` : nothing} <!-- conditional -->

    ${this.items.map(item => html`<li>${item}</li>`)}   <!-- list -->
  `;
}
```

---

## Why Lit? — The Big Idea

The core principle behind Lit is: **UI as a function of state**.

You don't write code like *"find this element and change its text."* Instead, you write: *"when state looks like X, the UI looks like Y"* — and Lit figures out what changed.

```typescript
// Imperative (old DOM way) — you manage every update manually
document.querySelector('.count').textContent = String(count);

// Declarative (Lit way) — you just describe the result
render() {
  return html`<span>${this.count}</span>`;
}
```

Every time `this.count` changes, Lit calls `render()` and figures out the minimum DOM change needed. You never touch the DOM yourself.

---

## Why Lit? — Efficient Updates

Lit does **not** use a Virtual DOM like React. It does something smarter: it tracks only the **dynamic parts** of your template — the `${}` holes.

```
html`<h1>Hello ${this.name}!</h1>`
         ──────            ──────
         static            dynamic ← only this gets checked on re-render
```

On the first render it builds the DOM. On every update it only revisits the `${}` expressions and patches just those nodes. The static parts are never touched again. This makes Lit updates very fast even without a virtual DOM.

---

## Why Lit? — No Framework Lock-in

The biggest practical reason a company uses Lit:

> A Lit component is a **native web component**. It works in any framework — React, Vue, Angular, Svelte — or no framework at all. You write it once and use it everywhere.

This is exactly why this company uses it. They likely have:
- Multiple products or teams using different frameworks
- A shared design system or component library
- A need to publish components that won't break when a framework updates

With React or Vue components you're locked into that ecosystem. With Lit you ship a custom HTML element — it just works, like `<input>` or `<video>`.

---

## fetch() and Promises — How Data Loading Works

`fetch()` is the browser's built-in way to make HTTP requests. It returns a **Promise**.

A Promise is an object that represents work happening in the background. Think of it like a ticket at a restaurant — you don't have your food yet, but you have a ticket that *will* resolve into food (or an error).

**3 states:**
- **Pending** — request is in flight, no answer yet
- **Fulfilled / Resolved** — success, response received
- **Rejected** — something went wrong (network error, 404, 500...)

```typescript
// Promise chain style
fetch('/api/products')
  .then(res => res.json())     // runs on success
  .then(data => { this.products = data; })
  .catch(err => { this.error = err.message; }) // runs on rejection
  .finally(() => { this.loading = false; });   // always runs

// async/await — same thing, easier to read
async fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    this.products = await res.json();
  } catch (e) {
    this.error = e instanceof Error ? e.message : 'Failed';
  } finally {
    this.loading = false;
  }
}
```

---

## Exercise 1 — Counter `<my-counter>`

- `@state()` count starting at 0
- Increment / decrement buttons
- Display current count

Open `lit-basics.ts` → Exercise 1

---

## Answer 1 — Counter

```typescript
@customElement('my-counter')
export class MyCounter extends LitElement {
  @state() private count = 0;

  static styles = css`
    :host { display: inline-flex; align-items: center; gap: 12px; }
    button { padding: 4px 12px; font-size: 1rem; cursor: pointer; }
    span { min-width: 2ch; text-align: center; font-weight: bold; }
  `;

  render() {
    return html`
      <button @click=${() => this.count--}>−</button>
      <span>${this.count}</span>
      <button @click=${() => this.count++}>+</button>
    `;
  }
}
```

---

## Exercise 2 — Toggle `<my-toggle>`

- `@property()` label (string)
- `@state()` isOn (private)
- On click: flip state, dispatch `toggle-changed`
  - `detail: { isOn }`, `bubbles: true`, `composed: true`

Open `lit-basics.ts` → Exercise 2

---

## Answer 2 — Toggle

```typescript
@customElement('my-toggle')
export class MyToggle extends LitElement {
  @property({ type: String }) label = 'Toggle';
  @state() private isOn = false;

  static styles = css`
    :host { display: inline-block; }
    button { padding: 8px 16px; border-radius: 20px; border: 2px solid #333; cursor: pointer; background: white; }
    button.active { background: #28a745; color: white; border-color: #28a745; }
  `;

  private handleToggle() {
    this.isOn = !this.isOn;
    this.dispatchEvent(new CustomEvent('toggle-changed', {
      detail: { isOn: this.isOn },
      bubbles: true,
      composed: true,   // ← required to cross Shadow DOM boundary
    }));
  }

  render() {
    return html`
      <button class=${this.isOn ? 'active' : ''} @click=${this.handleToggle}>
        ${this.label}
      </button>
    `;
  }
}
```

---

## Exercise 3 — User Badge `<user-badge>`

- `name: string` property
- `role: 'admin' | 'user' | 'viewer'` property, default `'user'`
- Different `:host([role='...'])` styles per role
  - admin = dark red, user = blue, viewer = grey

Open `lit-basics.ts` → Exercise 3

---

## Answer 3 — User Badge

```typescript
type UserRole = 'admin' | 'user' | 'viewer';

@customElement('user-badge')
export class UserBadge extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String, reflect: true }) role: UserRole = 'user';

  static styles = css`
    :host {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    :host([role='admin'])  { background: #c0392b; color: white; }
    :host([role='user'])   { background: #2980b9; color: white; }
    :host([role='viewer']) { background: #7f8c8d; color: white; }
  `;

  render() {
    return html`${this.name} (${this.role})`;
  }
}
```

> `reflect: true` on `role` is required so `:host([role='...'])` CSS selector works.
