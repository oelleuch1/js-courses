import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';


export class ProductDetails extends LitElement {
  static properties = {
    product: {
      type: Object
    },
  };

  constructor() {
    super();
    this.products = {};
  }

  static styles = css`
    .product-details {
      margin-bottom: 16px;
      border-bottom: 1px solid black;
    }
  `

  render() {
    return html`
   <div class="product-details">
    <div class="product-title">
      ${this.product.title}
    </div>
   

  </div>
  `
  }
}
customElements.define('product-details', ProductDetails);


export class ProductsComponent extends LitElement {

  static properties = {
    title: {
      type: String
    },
    products: {
      type: Array
    },
    sortOrder: {
      type: String
    },
  };

  static styles = css``;

  constructor() {
    super();
    this.products = [];
    this.title = "All Products";
    this.sortOrder = 'desc';
  }



  /* ********************************************************************************* */
  /* TODO 1: debug and fix the following code to render a list of product details        */

  async firstUpdated() {
    const url = "https://my-json-server.typicode.com/typicode/demo/posts";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      this.products = result;
      console.log(this.products, 'products');
    } catch (error) {
      console.error(error.message);
    }
  }









  /* ********************************************************************************* */

  /* TODO 2: there is a new requirement to implement a sort functionality. The user wants to be
      be able to toggle the sort order of the products based on price every time the button is pressed
  */

  sort() {
    console.log("Sorted products");
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    console.log(this.sortOrder, 'this.sortOrder');

    this.products = [...this.products].sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return b.id < a.id ? 1 : -1
      } else {
        return b.id > a.id ? 1 : -1
      }
    })

  }

  /* ********************************************************************************* */


  /* ********************************************************************************* */

  /* TODO 3: there is a new requirement to show the best and worst products. */

  filterProducts() {
    console.log("Filtered products");
  }

  /* ********************************************************************************* */





  render() {
    return html`
      <h1>${this.title} (page 1 of x)</h1>
      <button type="button" @click=${this.sort}>Sort</button>
      <button type="button" @click=${this.filterProducts}>Filter Products</button>
      <div>
        ${this.products.map(product => html`
          <product-details .product=${product}></product-details>
        `
    )}
      </div>
      <a href=#>1</>
      <a href=#>2</>
      <a href=#>3</>
      ...
      <a href=#>last</>
      `;
  }
}

customElements.define('products-component', ProductsComponent);

-------

<form>
  <div class="product-details">
    <div>
      <img src="https://cdn.dummyjson.com/products/images/smartphones/iPhone%205s/2.png" />
      <a href="some-url" class="more-detailsbutton">
        <button>More details</button>
      </a>
    </div>
    <div class="product-title" role="button" aria-label="view gallery">
      iPhone 9
    </div>
    <div class="divider"></div>
    <div class="product-property">
      <div>
        Description
      </div>
      <div>
        An apple mobile which is nothing like apple
      </div>
    </div>
    <div class="product-property">
      <div>
        Price
      </div>

      <div>
        549
      </div>
    </div>
    <div class="product-property">
      <div>
        In Stock
      </div>
      <div>
        94
      </div>
    </div>
    <label for="quantity">
      Quantity
    </label>

    <div id="quantity">
      <input type="text" />
      <button id="cart-button">
        Add to Cart
      </button>
    </div>
  </div>
</form>