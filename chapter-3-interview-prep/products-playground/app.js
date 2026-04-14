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
            5
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
    size: {
      type: Number,
    },
    index: {
      type: Number,
    },
    count: {
      Number,
    }
  };

  /** Filled in the challenge; start empty like the document. */
  static styles = css``;

  constructor() {
    super();
    this.products = [];
    this.title = 'All ';
    this.sortOrder = 'desc';
    this.size = 3;
    this.index = 0;
  }


  /****************************************************************************
   * TODO 1: debug and fix the following code to render a list of product details
   ****************************************************************************/
  // https://jsonplaceholder.typicode.com/posts??_page=1&_limit=10

  fetchProducts(size, index) {
    fetch(`https://jsonplaceholder.typicode.com/posts??_page=${index}&_limit=${size}`)
      .then((response) => response.json())
      .then((data) => { this.products = Array.isArray(data) ? data : [] })
  }

  firstUpdated() {
    this.fetchProducts(this.size, this.index);
  }


  handleClick(event, newPageIndex) {
    event.preventDefault();
    this.index = newPageIndex;
    this.fetchProducts(this.size, this.index)
  }

  handleSize(option) {
    console.log(option)
  }

  /****************************************************************************
   * TODO 2: implement sort — toggle sort order of products by price each time
   * the Sort button is pressed (discussion: whole list vs current page).
   ****************************************************************************/
  sort() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

    this.products = this.products.toSorted((a, b) => {
      if (this.sortOrder === 'asc') {
        return b.price < a.price ? 1 : -1
      } else {
        return b.price > a.price ? 1 : -1
      }
    }

    )


  }
  // if local - sorting is for the cur

  // updateSize(e) {
  //   this.index = 0;
  //   this.size = e.target.value;
  //   this.fetchProducts(this.size, this.index);
  // }

  render() {
    return html`
      <h1 class="products-heading">${this.title}(page 1 of x)</h1>

      <div class="products-actions">
        <button type="button" @click=${this.sort}>Sort</button>
        <button type="button">Filter Products</button>
      </div>

      <nav class="products-pagination" aria-label="Pagination">
      ${Array.from({ length: 10 }).map((_, index) => html`
        <a href="#" @click=${(event) => this.handleClick(event, index)}>${index + 1}</a>
      `)}
        <span class="products-pagination__ellipsis">...</span>
        <a href="#">last</a>
      </nav>


      ${html`<select name="size" @change="${(e) => this.updateSize(e)}">
        <option value="3">3</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>`}

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
