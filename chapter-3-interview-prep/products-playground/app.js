import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class ProductDetails extends LitElement {
  static properties = {
    product: {
      type: Object,
    },
  };

  constructor() {
    super();
    this.products = {};
  }

  createRenderRoot() {
    return this;
  }

  static styles = css`
    .product-details {
      margin-bottom: 16px;
      border-bottom: 1px solid black;
    }
  `;

  render() {
    return html`
      <div class="product-details">
        <div class="product-title">
          ${this.product.title}
        </div>

        <div class="product-property">
          <div>
            Description
          </div>
          <div>
            ${this.product.description}
          </div>
        </div>

        <div class="product-property">
          <div>
            Price
          </div>
          <div>
            ${this.product.price}
          </div>
        </div>

        <div class="product-property">
          <div>
            Rating
          </div>
          <div>
            ${this.product.rating.rate}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('product-details', ProductDetails);

export class ProductsComponent extends LitElement {
  static properties = {
    title: {
      type: String,
    },
    products: {
      type: Array,
    },
    sortOrder: {
      type: String,
    },
  };

  /** Filled in the challenge; start empty like the document. */
  static styles = css``;

  constructor() {
    super();
    this.products = [];
    this.title = 'All ';
    this.sortOrder = 'desc';
  }


  /****************************************************************************
   * TODO 1: debug and fix the following code to render a list of product details
   ****************************************************************************/
  firstUpdated() {
    const data = fetch('https://fakestoreapi.com/products?size=3&page=0');
    this.products = data.content;
  }

  firstUpdated() {
    fetch('https://fakestoreapi.com/products?size=3&page=0')
      .then((response) => response.json())
      .then((data) => this.products = data)
  }

  /****************************************************************************
   * TODO 2: implement sort — toggle sort order of products by price each time
   * the Sort button is pressed (discussion: whole list vs current page).
   ****************************************************************************/
  sort() {
    console.log('Sorted products');
  }

  render() {
    return html`
      <h1 class="products-heading">${this.title}(page 1 of x)</h1>

      <div class="products-actions">
        <button type="button" @click=${this.sort}>Sort</button>
        <button type="button">Filter Products</button>
      </div>

      <nav class="products-pagination" aria-label="Pagination">
        <a href="#">1</a>
        <a href="#">2</a>
        <a href="#">3</a>
        <span class="products-pagination__ellipsis">...</span>
        <a href="#">last</a>
      </nav>

      <div class="products-list">
        ${this.products.map(
      (product) =>
        html`<product-details .product=${product}></product-details>`
    )}
      </div>
    `;
  }
}

customElements.define('products-component', ProductsComponent);
