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
  .tag { display: inline-block; background: #e94560; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.8em; margin-right: 4px; }
---

# Code Review Exercise

## Product List — Lit + TypeScript

> _"A junior developer coded this. You need to check the code. A new requirement: sort items by price. How would you implement it? And pagination?"_

This is the **actual interview task** from the coding document.

---

## Code Review — HTML Red Flags to Spot Immediately

Before looking at TypeScript, scan the template for these common issues:

**Wrong element choice:**

- `<form>` with no inputs → not a form. Use `<article>` (self-contained content) or `<section>` (grouped content with heading)
- `<a>` + `<button>` nested or combined → invalid. `<a>` navigates, `<button>` acts. Never nest them.
- `<div class="divider">` → use `<hr>` (thematic break, announced by screen readers)
- `<div>` or `<p>` for subtitles → use `<h3>` or appropriate heading level

**Missing attributes:**

- `<img>` without `alt` → screen reader reads the filename aloud. Always add `alt=""` (decorative) or descriptive text.
- `<button>` with only an icon and no visible text → must have `aria-label`

**Heading order:**

- Skipping from `<h1>` to `<h3>` breaks the document outline. Screen readers navigate by headings — missing levels confuse users.

**ARIA misuse:**

- `<button>` already has an implicit role — adding `role="button"` is redundant
- `aria-label` on a button is valid and useful when the visible text isn't enough context

---

## Step 1 — Code Review

Open `product-list-buggy.ts`.

Find as many issues as you can before looking at the checklist on the next slide.

Write your findings:

```
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
```

---

## Code Review — Issues Checklist

| #   | Issue                                            | Category            |
| --- | ------------------------------------------------ | ------------------- |
| 1   | `@property` used for internal toggle state       | @property vs @state |
| 2   | Missing `super.connectedCallback()` call         | Lifecycle           |
| 3   | `Array.sort()` mutates the original `products`   | Immutability        |
| 4   | `map()` instead of `repeat()` — no stable keys   | Performance         |
| 5   | `any` type on product parameter                  | TypeScript          |
| 6   | No loading state, no error handling              | UX                  |
| 7   | Event dispatched without `composed: true`        | Events / Shadow DOM |
| 8   | `<div>` used instead of `<ul>/<li>`              | Semantic HTML       |
| 9   | No `aria-live` region for screen readers         | Accessibility       |
| 10  | Hard-coded URL — should be `@property` or config | Architecture        |

---

## Step 2 — Add Sorting by Price

Implement in `product-list-solution.ts`.

**Requirements:**

- Sort toggle button: ASC / DESC
- Never mutate `this.products` — sort a **copy**
- Sort state is internal → `@state()`

Open `product-list-solution.ts` → `sortedProducts` getter + `toggleSort()`

---

## Answer 2 — Sorting

```typescript
// State
@state() private sortOrder: 'asc' | 'desc' = 'asc';

// Computed getter — copy first, never mutate
private get sortedProducts(): Product[] {
  return [...this.products].sort((a, b) => {
    const diff = a.price - b.price;
    return this.sortOrder === 'asc' ? diff : -diff;
  });
}

// Handler — also resets pagination
private toggleSort() {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  this.currentPage = 1;
}

// In render()
html`
  <button @click=${this.toggleSort}
    aria-label="Sort by price ${this.sortOrder === 'asc' ? 'descending' : 'ascending'}">
    Price ${this.sortOrder === 'asc' ? '↑' : '↓'}
  </button>
`
```

---

## Step 3 — Add Pagination

**Requirements:**

- 5 products per page
- Previous / Next buttons
- Show current page / total pages
- Sort change → reset to page 1
- Disable Prev on first page, Next on last page

Open `product-list-solution.ts` → `paginatedProducts`, `goToPage()`, render pagination

---

## Answer 3 — Pagination (Logic)

```typescript
@state() private currentPage = 1;
private readonly pageSize = 5;

private get totalPages(): number {
  return Math.ceil(this.products.length / this.pageSize);
}

private get paginatedProducts(): Product[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.sortedProducts.slice(start, start + this.pageSize);
}

private goToPage(page: number) {
  // clamp between 1 and totalPages
  this.currentPage = Math.max(1, Math.min(page, this.totalPages));
}
```

---

## Answer 3 — Pagination (Render)

```typescript
// List — repeat() gives stable DOM keys
${repeat(this.paginatedProducts, (p) => p.id, (p) => html`
  <li tabindex="0"
    @click=${() => this.handleProductClick(p)}
    @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.handleProductClick(p)}>
    <span>${p.name}</span>
    <span class="price">€${p.price.toFixed(2)}</span>
  </li>
`)}

// Controls
html`<div class="pagination">
  <button ?disabled=${this.currentPage === 1}
    @click=${() => this.goToPage(this.currentPage - 1)}
    aria-label="Previous page">← Previous</button>

  <span aria-current="page">Page ${this.currentPage} of ${this.totalPages}</span>

  <button ?disabled=${this.currentPage === this.totalPages}
    @click=${() => this.goToPage(this.currentPage + 1)}
    aria-label="Next page">Next →</button>
</div>`
```

---

## Step 4 — Discussion: Client vs Server

**Q: Where should sorting happen — client or server?**

| Client-side                      | Server-side                  |
| -------------------------------- | ---------------------------- |
| Fast UX, no extra request        | Handles datasets of any size |
| Only works if all data is loaded | Requires query params on API |
| Fine for ~50–200 items           | Required for 1000+ items     |

> **Answer to give:** _"It depends on the dataset size. For a small catalogue fully loaded upfront — client is fine and simpler. For a large product database — you'd pass `sort` and `page` as query params to the backend and let it do the work."_

---

## Step 4 — Discussion: Testing & Real-time

**Q: How would you test this component?**

- Unit test: sort/paginate logic as a pure function — no DOM needed
- Integration test: render component → click sort → assert DOM order
- Tool: `@web/test-runner` + `@open-wc/testing`

**Q: What if the list updates in real time?**

- WebSocket or SSE pushes updates
- Re-apply current sort + pagination after data refresh
- Use `repeat()` with stable keys → Lit reuses DOM nodes, no flicker

---

## Testing — The Three Levels

Think of testing as a pyramid. The base is wide (many cheap tests), the top is narrow (few expensive tests).

```
        /‾‾‾‾‾‾‾‾‾‾‾‾‾\
       /   E2E Tests    \      few, slow, test full user journeys
      /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
     / Integration Tests  \    medium, test components with real DOM
    /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
   /      Unit Tests        \  many, fast, test logic in isolation
  /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
```

Each level has a different purpose and a different tool. You don't choose one — you use all three for different things.

---

## Unit Tests — Testing Logic in Isolation

A unit test tests **one function or one piece of logic** in isolation. No browser, no DOM, no network. Just input → output.

**When to write them:** pure functions, business logic, utility helpers, data transformations.

```typescript
// The sort logic extracted as a pure function — easy to unit test
function sortProducts(products: Product[], order: "asc" | "desc"): Product[] {
  return [...products].sort((a, b) => {
    const diff = a.price - b.price;
    return order === "asc" ? diff : -diff;
  });
}

// Unit test with Vitest
import { describe, it, expect } from "vitest";

describe("sortProducts", () => {
  const products = [
    { id: "1", name: "Mouse", price: 29 },
    { id: "2", name: "Laptop", price: 999 },
    { id: "3", name: "Cable", price: 9 },
  ];

  it("sorts ascending by price", () => {
    const result = sortProducts(products, "asc");
    expect(result.map((p) => p.price)).toEqual([9, 29, 999]);
  });

  it("sorts descending by price", () => {
    const result = sortProducts(products, "desc");
    expect(result.map((p) => p.price)).toEqual([999, 29, 9]);
  });

  it("does not mutate the original array", () => {
    const original = [...products];
    sortProducts(products, "asc");
    expect(products).toEqual(original);
  });
});
```

---

## Unit Test Tools

| Tool       | What it is                                    | Use case                                       |
| ---------- | --------------------------------------------- | ---------------------------------------------- |
| **Vitest** | Fast unit test runner, Vite-native            | Modern projects, TS-first, Jest-compatible API |
| **Jest**   | The classic JS test runner                    | Older projects, wide ecosystem                 |
| **Mocha**  | Flexible test runner (no assertions built in) | Paired with Chai for assertions                |
| **Chai**   | Assertion library                             | Used with Mocha — `expect`, `assert`, `should` |

**Vitest vs Jest:** Vitest is the modern choice — faster (runs in Vite's ESM pipeline), no config needed, same API as Jest so knowledge transfers. If you're starting a project today, use Vitest.

```bash
# Run all tests
npx vitest run

# Watch mode during development
npx vitest

# With coverage report
npx vitest run --coverage
```

---

## Integration Tests — Testing Components with Real DOM

Integration tests render an actual component in a real browser (or browser-like environment) and interact with it. They check that the component works end-to-end: data comes in, user clicks, correct DOM comes out.

**For Lit / Web Components — `@web/test-runner` + `@open-wc/testing`:**

```typescript
import { fixture, html, expect } from "@open-wc/testing";
import "../product-list.js";

describe("product-list", () => {
  it("renders products", async () => {
    const el = await fixture(html`
      <product-list
        .products=${[{ id: "1", name: "Laptop", price: 999 }]}
      ></product-list>
    `);

    const item = el.shadowRoot!.querySelector("li");
    expect(item?.textContent).to.include("Laptop");
  });

  it("sorts by price ascending on button click", async () => {
    const el = await fixture(
      html`<product-list .products=${products}></product-list>`,
    );
    const sortBtn = el.shadowRoot!.querySelector("button");

    sortBtn?.click();
    await el.updateComplete; // wait for Lit to re-render

    const prices = [...el.shadowRoot!.querySelectorAll(".price")].map((p) =>
      parseFloat(p.textContent ?? "0"),
    );
    expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
  });
});
```

---

## Integration Test Tools

| Tool                   | What it is                                                                |
| ---------------------- | ------------------------------------------------------------------------- |
| **`@web/test-runner`** | Runs tests in a real browser — best choice for web components             |
| **`@open-wc/testing`** | Helpers for Lit/web component tests: `fixture()`, `expect`, `waitUntil()` |
| **`jest-axe`**         | Runs axe accessibility checks inside Jest/Vitest unit tests               |
| **Testing Library**    | Framework-agnostic helpers: `getByRole`, `getByText`, `userEvent`         |
| **JSDOM**              | Fake DOM environment — fast but doesn't support Shadow DOM fully          |
| **Happy DOM**          | Faster JSDOM alternative — better Shadow DOM support                      |

> **Key difference from unit tests:** integration tests need a DOM. For web components, always prefer a real browser environment (`@web/test-runner`) over JSDOM — Shadow DOM behaviour in JSDOM is incomplete.

```bash
# Run web test runner
npx wtr "src/**/*.test.ts" --node-resolve
```

---

## E2E Tests — Testing Full User Journeys

E2E (end-to-end) tests launch a real browser, navigate to your running app, and simulate what a real user would do: click, type, scroll, wait for responses. They test the whole stack together.

**When to write them:** critical user flows — login, checkout, form submission, navigation.

```typescript
// Playwright — E2E test for the product list
import { test, expect } from "@playwright/test";

test("user can sort products by price", async ({ page }) => {
  await page.goto("http://localhost:5173/products");

  // Wait for products to load
  await page.waitForSelector("product-list li");

  // Click the sort button
  await page.getByRole("button", { name: /sort by price/i }).click();

  // Read the first price shown
  const firstPrice = await page
    .locator("product-list li .price")
    .first()
    .textContent();
  expect(parseFloat(firstPrice ?? "")).toBeLessThanOrEqual(10); // cheapest first
});

test("pagination works", async ({ page }) => {
  await page.goto("http://localhost:5173/products");
  await page.getByRole("button", { name: "Next →" }).click();
  await expect(page.getByText("Page 2 of")).toBeVisible();
});
```

---

## E2E Test Tools

| Tool           | What it is                                        | Key strength                                                  |
| -------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| **Playwright** | Microsoft — controls Chrome, Firefox, Safari      | Most powerful, best TS support, parallel, Shadow DOM piercing |
| **Cypress**    | Developer-friendly, in-browser test runner        | Great DX, time-travel debugging, visual test runner           |
| **Selenium**   | The original — controls any browser via WebDriver | Legacy projects, Java/Python ecosystems                       |
| **Puppeteer**  | Google — headless Chrome only                     | Lightweight, good for scraping/screenshots                    |

**Playwright vs Cypress today:**
Playwright is the modern default — it supports all browsers, runs in parallel by default, and has first-class Shadow DOM support with `locator.pierce()`. Cypress is excellent too but historically had limitations with multiple tabs and cross-origin.

```bash
# Run Playwright tests
npx playwright test

# Open interactive UI mode
npx playwright test --ui

# Generate tests by clicking (record mode)
npx playwright codegen localhost:5173
```

---

## Accessibility Testing — Automated Tools

Accessibility testing fits into all three levels:

```typescript
// Unit / integration level — jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<ProductCard product={mockProduct} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// With @open-wc/testing
it('passes axe', async () => {
  const el = await fixture(html`<product-card .product=${mock}></product-card>`);
  await expect(el).to.be.accessible(); // uses axe under the hood
});
```

**E2E level — Playwright + axe:**

```typescript
import { checkA11y } from "axe-playwright";

test("product page is accessible", async ({ page }) => {
  await page.goto("/products");
  await checkA11y(page);
});
```

---

## Testing Summary — What to Say in the Interview

> _"I approach testing in three layers. Unit tests cover pure logic — sort functions, data transformations, anything with no DOM dependency. For component tests I use `@web/test-runner` with `@open-wc/testing` — it renders the actual Lit component in a real browser, so Shadow DOM works correctly. For E2E I use Playwright — it supports Shadow DOM piercing and runs across all browsers in parallel. I also layer in accessibility testing: `jest-axe` for component-level automated checks, and manual VoiceOver testing for complex ARIA patterns."_

**The key thing they want to hear:**

- You know the difference between the levels and when to use each
- You don't just say "Jest" for everything
- You know that JSDOM / standard Jest doesn't handle Shadow DOM well
- You mention accessibility testing as part of the testing strategy, not an afterthought
