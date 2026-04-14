import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ─────────────────────────────────────────────────────────────
// EXERCISE 1 — Vanilla Custom Element (no Lit)
//
// Build <product-badge> using only HTMLElement + Shadow DOM.
// - Accepts a `label` attribute: "new" | "sale" | "hot"
// - Renders a styled badge in Shadow DOM
// - Re-renders when the `label` attribute changes
// ─────────────────────────────────────────────────────────────

class ProductBadge extends HTMLElement {
  // TODO: declare which attributes to observe
  static get observedAttributes(): string[] {
    return [];
  }

  constructor() {
    super();
    // TODO: attach shadow DOM (mode: 'open')
  }

  // TODO: call render when added to DOM
  connectedCallback() {}

  // TODO: call render when attribute changes
  attributeChangedCallback(_name: string, _old: string | null, _new: string | null) {}

  // TODO: implement render — use this.getAttribute('label')
  // badge should show the label text
  // bonus: different background colour per label value
  private render() {}
}

customElements.define('product-badge', ProductBadge);

// ─────────────────────────────────────────────────────────────
// EXERCISE 2 — Named Slots in Lit
//
// Build <info-card> with three named slots: header, body, footer
// - Fallback text for each slot when nothing is slotted
// - Style slotted <p> elements with ::slotted(p)
// - Header area has a distinct light grey background
// ─────────────────────────────────────────────────────────────

@customElement('info-card')
export class InfoCard extends LitElement {
  static styles = css`
    :host { display: block; }
    /* TODO: style .header, .body, .footer containers */
    /* TODO: add ::slotted(p) styles */
  `;

  render() {
    return html`
      <!-- TODO: three sections, each wrapping a named or default slot -->
      <!-- header slot fallback: "Untitled" -->
      <!-- body slot fallback: "No content provided." -->
      <!-- footer slot: no fallback -->
    `;
  }
}

// ─────────────────────────────────────────────────────────────
// EXERCISE 3 — Component Communication via Custom Events
//
// Build two components:
//
// <product-item name="Laptop" price=999>
//   - Displays name and price
//   - "Add" button dispatches 'add-to-cart' event with
//     { detail: { name, price }, bubbles: true, composed: true }
//
// <cart-summary>
//   - Listens for 'add-to-cart' events
//   - Tracks a count of items added
//   - Renders: "Cart: X items"
//   - Wrap <product-item> elements inside <cart-summary> in your HTML
// ─────────────────────────────────────────────────────────────

@customElement('product-item')
export class ProductItem extends LitElement {
  // TODO: add @property() for name and price

  // TODO: dispatch 'add-to-cart' event on button click
  // remember: bubbles: true, composed: true

  render() {
    return html`
      <!-- TODO: show name + price, add button -->
    `;
  }
}

@customElement('cart-summary')
export class CartSummary extends LitElement {
  // TODO: @state() for count

  connectedCallback() {
    super.connectedCallback();
    // TODO: listen for 'add-to-cart' on this element
    // events bubble up from child <product-item> components
  }

  render() {
    return html`
      <!-- TODO: show "Cart: X items" + slot for product items -->
    `;
  }
}

// ─────────────────────────────────────────────────────────────
// SOLUTIONS
// ─────────────────────────────────────────────────────────────

/*
// ── SOLUTION 1 — Vanilla Custom Element ──────────────────────

class ProductBadgeSolution extends HTMLElement {
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
    const bg = label === 'sale' ? '#e74c3c' : label === 'hot' ? '#e67e22' : '#2ecc71';
    this.shadow.innerHTML = `
      <style>
        span {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          background: ${bg};
          color: white;
        }
      </style>
      <span>${label}</span>
    `;
  }
}
customElements.define('product-badge-solution', ProductBadgeSolution);

// ── SOLUTION 2 — Named Slots ──────────────────────────────────

@customElement('info-card-solution')
class InfoCardSolution extends LitElement {
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
      <div class="header"><slot name="header">Untitled</slot></div>
      <div class="body"><slot>No content provided.</slot></div>
      <div class="footer"><slot name="footer"></slot></div>
    `;
  }
}

// ── SOLUTION 3 — Component Communication ─────────────────────

@customElement('product-item-solution')
class ProductItemSolution extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: Number }) price = 0;

  private handleAdd() {
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: { name: this.name, price: this.price },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <span>${this.name} — €${this.price}</span>
      <button @click=${this.handleAdd}>Add</button>
    `;
  }
}

@customElement('cart-summary-solution')
class CartSummarySolution extends LitElement {
  @state() private count = 0;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('add-to-cart', () => this.count++);
  }

  render() {
    return html`
      <p>Cart: ${this.count} items</p>
      <slot></slot>
    `;
  }
}
*/
