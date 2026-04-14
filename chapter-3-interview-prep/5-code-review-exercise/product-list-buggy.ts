// ⚠️ JUNIOR DEVELOPER CODE — FOR CODE REVIEW
// Find all the issues before looking at the checklist in exercise.md

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Issue: no proper interface defined
interface Product {
  id: number;
  name: string;
  price: number;
}

@customElement('product-list')
export class ProductList extends LitElement {

  // Issue 1: should this be @property or @state?
  @property({ type: Array }) products: Product[] = [];
  @property({ type: Boolean }) showDetails = false; // internal UI state

  static styles = css`
    :host { display: block; }
    .container { padding: 16px; }
    .product { border: 1px solid #ddd; padding: 12px; margin-bottom: 8px; }
  `;

  // Issue 2: missing something important here
  connectedCallback() {
    this.loadProducts();
  }

  async loadProducts() {
    // Issue 3: hard-coded URL
    const res = await fetch('http://localhost:3000/products');
    const data = await res.json();
    this.products = data;
    // Issue 4: no error handling, no loading state
  }

  // Issue 5: this mutates the original array!
  sortByPrice() {
    this.products.sort((a, b) => a.price - b.price);
    this.requestUpdate();
  }

  handleProductClick(product: any) { // Issue 6: any type
    this.dispatchEvent(new CustomEvent('product-selected', {
      detail: product,
      bubbles: true,
      // Issue 7: missing something for Shadow DOM events
    }));
  }

  render() {
    return html`
      <div class="container">
        <button @click=${this.sortByPrice}>Sort by price</button>

        <!-- Issue 8: wrong semantic element for a list -->
        <div>
          ${this.products.map((product: Product) => html`
            <!-- Issue 9: no accessible label, no keyboard interaction -->
            <div class="product" @click=${() => this.handleProductClick(product)}>
              <h3>${product.name}</h3>
              <p>€${product.price}</p>
            </div>
          `)}
        </div>
        <!-- Issue 10: no loading state shown to user OR screen reader -->
      </div>
    `;
  }
}
