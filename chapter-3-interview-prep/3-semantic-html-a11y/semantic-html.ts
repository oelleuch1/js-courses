import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ─────────────────────────────────────────────
// EXERCISE 1 — Semantic Rewrite
//
// The template below uses only divs. Rewrite it using
// correct semantic HTML5 elements.
//
// Original structure:
// - site header with logo and nav links
// - main content area with a list of products
// - footer with copyright
// ─────────────────────────────────────────────

@customElement('page-layout')
export class PageLayout extends LitElement {
  render() {
    // TODO: rewrite this using header, nav, main, ul, li, footer
    return html`
      <div class="header">
        <div class="logo">ShopApp</div>
        <div class="nav">
          <div class="nav-item">Products</div>
          <div class="nav-item">About</div>
          <div class="nav-item">Contact</div>
        </div>
      </div>
      <div class="main">
        <div class="title">Featured Products</div>
        <div class="product-list">
          <div class="product">Laptop</div>
          <div class="product">Mouse</div>
          <div class="product">Keyboard</div>
        </div>
      </div>
      <div class="footer">© 2026 ShopApp</div>
    `;
  }
}

// ─────────────────────────────────────────────
// EXERCISE 2 — Accessible Product Card
//
// Add accessibility to the product card:
// - The card itself should convey product info to screen readers
// - Rating stars should be readable (not just visual)
// - The button label must make sense out of context
// - Price reduction should be announced properly
// ─────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number; // 1-5
}

@customElement('product-card-a11y')
export class ProductCardA11y extends LitElement {
  @property({ type: Object }) product!: Product;

  static styles = css`
    :host { display: block; }
    .card { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
    .stars { color: gold; font-size: 1.2rem; }
    .original { text-decoration: line-through; color: #999; }
    .sale { color: #c0392b; font-weight: bold; }
  `;

  private renderStars(rating: number) {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    // TODO: wrap in span with aria-label="Rating: X out of 5 stars"
    return html`<span class="stars">${filled}${empty}</span>`;
  }

  render() {
    const { name, price, originalPrice, rating } = this.product;
    const isOnSale = originalPrice !== undefined && originalPrice > price;

    return html`
      <div class="card">
        <!-- TODO: make the heading semantic -->
        <div class="name">${name}</div>

        <!-- TODO: announce price reduction to screen readers -->
        ${isOnSale ? html`
          <span class="original">€${originalPrice}</span>
          <span class="sale">€${price.toFixed(2)}</span>
        ` : html`
          <span>€${price.toFixed(2)}</span>
        `}

        ${this.renderStars(rating)}

        <!-- TODO: improve this button label -->
        <button @click=${() => {}}>Add to cart</button>
      </div>
    `;
  }
}

// ─────────────────────────────────────────────
// EXERCISE 3 — Keyboard Accessible Dropdown
//
// Implement keyboard navigation:
// - Enter/Space to open/close
// - Arrow keys to navigate options
// - Escape to close and return focus to trigger
// - Selected item announced to screen reader
// ─────────────────────────────────────────────

@customElement('accessible-dropdown')
export class AccessibleDropdown extends LitElement {
  @property({ type: Array }) options: string[] = ['Option A', 'Option B', 'Option C'];
  @state() private isOpen = false;
  @state() private selectedIndex = 0;
  @state() private focusedIndex = 0;

  static styles = css`
    :host { display: inline-block; position: relative; }
    .trigger { padding: 8px 16px; cursor: pointer; border: 1px solid #333; background: white; }
    .dropdown {
      position: absolute;
      top: 100%; left: 0;
      border: 1px solid #ddd;
      background: white;
      min-width: 200px;
      list-style: none;
      padding: 0; margin: 0;
      z-index: 10;
    }
    .dropdown li { padding: 8px 16px; cursor: pointer; }
    .dropdown li[aria-selected='true'] { background: #2980b9; color: white; }
    .dropdown li:focus { outline: 2px solid #2980b9; }
  `;

  // TODO: implement keyboard handler
  private handleKeyDown(e: KeyboardEvent) {
    // Handle: Enter/Space = toggle, Escape = close, ArrowDown/Up = navigate
  }

  render() {
    const selected = this.options[this.selectedIndex];
    return html`
      <!-- TODO: add proper ARIA attributes to trigger button -->
      <!-- aria-haspopup, aria-expanded, aria-controls -->
      <button class="trigger" @click=${() => this.isOpen = !this.isOpen}>
        ${selected} ▼
      </button>

      ${this.isOpen ? html`
        <!-- TODO: add proper ARIA to the list -->
        <!-- role="listbox", id for aria-controls -->
        <ul class="dropdown">
          ${this.options.map((opt, i) => html`
            <li
              @click=${() => { this.selectedIndex = i; this.isOpen = false; }}
            >
              ${opt}
            </li>
          `)}
        </ul>
      ` : null}
    `;
  }
}

// ─────────────────────────────────────────────
// SOLUTIONS (collapsed)
// ─────────────────────────────────────────────

/*
// SOLUTION 1 — Semantic Layout (render method)
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

// SOLUTION 2 — Stars with aria-label
private renderStars(rating: number) {
  const filled = '★'.repeat(rating);
  const empty = '☆'.repeat(5 - rating);
  return html`
    <span class="stars" aria-label="Rating: ${rating} out of 5 stars" role="img">
      ${filled}${empty}
    </span>
  `;
}

// SOLUTION 2 — Sale price with sr-only
${isOnSale ? html`
  <span class="original" aria-hidden="true">€${originalPrice}</span>
  <span class="sr-only">Was €${originalPrice}, now</span>
  <span class="sale">€${price.toFixed(2)}</span>
` : html`<span>€${price.toFixed(2)}</span>`}

// SOLUTION 2 — Button with context
<button @click=${() => {}}>Add ${name} to cart</button>
*/
