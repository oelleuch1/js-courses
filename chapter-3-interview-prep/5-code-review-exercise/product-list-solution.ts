// ✅ SOLUTION — Product List with Sort + Pagination
// Complete the TODOs below. Solution comments are at the bottom.

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

// ─── Types ───────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

type SortOrder = 'asc' | 'desc';

// ─── Component ───────────────────────────────────

@customElement('product-list')
export class ProductList extends LitElement {

  // Public API
  @property({ type: String }) apiUrl = '/api/products';

  // Internal state
  @state() private products: Product[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private sortOrder: SortOrder = 'asc';
  @state() private currentPage = 1;

  private readonly pageSize = 5;

  // ─── Lifecycle ───────────────────────────────────

  connectedCallback() {
    super.connectedCallback(); // ← always call super!
    this.fetchProducts();
  }

  // ─── Data Fetching ───────────────────────────────

  private async fetchProducts() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(this.apiUrl);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      this.products = await res.json();
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Failed to load products';
    } finally {
      this.loading = false;
    }
  }

  // ─── Computed Values ─────────────────────────────

  private get sortedProducts(): Product[] {
    // TODO: return a sorted COPY of this.products by price
    // Remember: never mutate this.products!
  }

  private get totalPages(): number {
    // TODO: calculate total pages based on pageSize
  }

  private get paginatedProducts(): Product[] {
    // TODO: slice sortedProducts for current page
    // Hint: start = (currentPage - 1) * pageSize
  }

  // ─── Event Handlers ──────────────────────────────

  private toggleSort() {
    // TODO: flip sortOrder between 'asc' and 'desc'
    // AND reset currentPage to 1
  }

  private goToPage(page: number) {
    // TODO: set currentPage (clamp between 1 and totalPages)
  }

  private handleProductClick(product: Product) {
    this.dispatchEvent(new CustomEvent('product-selected', {
      detail: { product },
      bubbles: true,
      composed: true, // ← required to cross Shadow DOM boundary
    }));
  }

  // ─── Styles ──────────────────────────────────────

  static styles = css`
    :host { display: block; font-family: sans-serif; }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: background 0.15s;
    }

    li:hover { background: #f5f5f5; }
    li:focus { outline: 2px solid #2980b9; outline-offset: 2px; }

    .price { font-weight: 700; color: #2980b9; }

    .pagination {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }

    .error { color: #c0392b; padding: 12px; background: #fdf0ed; border-radius: 6px; }
    .loading { color: #7f8c8d; padding: 12px; }
  `;

  // ─── Render ──────────────────────────────────────

  render() {
    if (this.loading) {
      return html`<p class="loading" aria-live="polite">Loading products...</p>`;
    }
    if (this.error) {
      return html`
        <p class="error" role="alert">${this.error}</p>
        <button @click=${this.fetchProducts}>Retry</button>
      `;
    }

    return html`
      <div>
        <div class="toolbar">
          <span>${this.products.length} products</span>
          <button @click=${this.toggleSort} aria-label="Sort by price ${this.sortOrder === 'asc' ? 'descending' : 'ascending'}">
            Price ${this.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <!-- TODO: render paginatedProducts as <ul>/<li> using repeat() directive -->
        <!-- Each li should be keyboard focusable (tabindex="0") and have @click + @keydown.enter -->

        <!-- TODO: render pagination controls -->
        <!-- Previous | Page X of Y | Next -->
        <!-- Disable Previous on page 1, disable Next on last page -->
      </div>
    `;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION (uncomment to check your work)
// ─────────────────────────────────────────────────────────────────────────────

/*
private get sortedProducts(): Product[] {
  return [...this.products].sort((a, b) => {
    const diff = a.price - b.price;
    return this.sortOrder === 'asc' ? diff : -diff;
  });
}

private get totalPages(): number {
  return Math.ceil(this.products.length / this.pageSize);
}

private get paginatedProducts(): Product[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.sortedProducts.slice(start, start + this.pageSize);
}

private toggleSort() {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  this.currentPage = 1; // reset to page 1 when sort changes
}

private goToPage(page: number) {
  this.currentPage = Math.max(1, Math.min(page, this.totalPages));
}

// In render():
${repeat(
  this.paginatedProducts,
  (p) => p.id,
  (p) => html`
    <li
      tabindex="0"
      @click=${() => this.handleProductClick(p)}
      @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.handleProductClick(p)}
    >
      <span>${p.name}</span>
      <span class="price">€${p.price.toFixed(2)}</span>
    </li>
  `
)}

<div class="pagination">
  <button
    ?disabled=${this.currentPage === 1}
    @click=${() => this.goToPage(this.currentPage - 1)}
    aria-label="Previous page"
  >← Previous</button>

  <span aria-current="page">Page ${this.currentPage} of ${this.totalPages}</span>

  <button
    ?disabled=${this.currentPage === this.totalPages}
    @click=${() => this.goToPage(this.currentPage + 1)}
    aria-label="Next page"
  >Next →</button>
</div>
*/
