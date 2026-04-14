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
  code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
  pre { background: #f0f2f5; color: #2d2d2d; padding: 20px; border-radius: 8px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #16213e; color: white; padding: 8px; }
  td { padding: 8px; border: 1px solid #ddd; }
  .highlight { background: #fff3cd; padding: 4px 8px; border-left: 4px solid #ffc107; }
  .danger { background: #f8d7da; padding: 4px 8px; border-left: 4px solid #dc3545; }
  .tip { background: #d4edda; padding: 4px 8px; border-left: 4px solid #28a745; }
---

# Interview Prep — Frontend Developer

## Frankfurt Fintech | Lit + TypeScript + Web Components

**Start:** 01.05.2026 | **Duration:** 3 months+ | **Stack:** HTML5, CSS3/SASS, JS ES6+, TypeScript, **Lit**

Entwicklung und Pflege von Frontend-Komponenten und Web-Applikationen
Implementierung von Schnittstellen (REST/GraphQL) und Integration ins Backend
Optimierung von Performance, Ladezeiten und Benutzerfreundlichkeit
Unit- und Integrationstests sowie Fehleranalyse und Bugfixing
Dokumentation von Features, Komponenten und Architektur
Enge Zusammenarbeit mit Backend, UX/UI, QA und Product Owner
Sicherstellung von Code-Qualität, Einhaltung von Standards und Clean-Code-Praktiken
Mitwirkung in Scrum-Prozessen (Reviews, Dailys, Refinements)
Sehr gute Kommunikationsskills auf Englisch und Deutsch

---

# What to Expect in This Interview

Based on the coding task document:

| Phase           | What Happens                                         |
| --------------- | ---------------------------------------------------- |
| 1. Code Review  | Screen share — review junior dev's product list code |
| 2. Live Coding  | Add sorting by price + pagination                    |
| 3. Discussion   | Semantic HTML, BEM, accessibility, Lit internals     |
| 4. Architecture | Web components philosophy, state management          |

> **Key tip:** They said _"we don't care if you Google — just don't sit in silence"_. Think aloud!

---

# Lit Framework — The Core Concept

Lit = Google's library built on top of **native Web Components**.

```
Web Components APIs       +    Lit sugar
────────────────────────────────────────
customElements.define()   →    @customElement decorator
HTMLElement               →    LitElement base class
attachShadow()            →    Shadow DOM auto-managed
connectedCallback()       →    lifecycle hooks
attributeChangedCallback()→    @property decorator
```

**Why Lit over React/Vue?**

- Zero-dependency runtime (~5KB)
- Native browser standard = no breaking framework updates
- _"Every new release, you don't have to update everything"_ (their words!)

---

# LitElement — Anatomy

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("my-product-card")
export class ProductCard extends LitElement {
  // Public API — can be set as HTML attribute
  @property({ type: String }) name = "";
  @property({ type: Number }) price = 0;

  // Internal state — triggers re-render, not reflected to DOM
  @state() private isExpanded = false;

  static styles = css`
    :host {
      display: block;
    }
    .card {
      padding: 16px;
      border: 1px solid #ddd;
    }
  `;

  render() {
    return html`
      <div class="card">
        <h2>${this.name}</h2>
        <p>€${this.price.toFixed(2)}</p>
      </div>
    `;
  }
}
```

---

# @property vs @state

|                        | `@property`                 | `@state`          |
| ---------------------- | --------------------------- | ----------------- |
| Reflected to DOM attr? | Yes (by default)            | No                |
| Visible from outside?  | Yes                         | No (private)      |
| Triggers re-render?    | Yes                         | Yes               |
| Use case               | Public API, HTML attributes | Internal UI state |

```typescript
// WRONG: using @property for internal toggle
@property() isMenuOpen = false; // leaks to DOM attribute

// CORRECT
@state() private isMenuOpen = false;
```

---

# Lit Reactivity — How Updates Work

1. Property/state changes → **Lit schedules async update**
2. Batches multiple changes into one render cycle
3. Calls `render()` → diffs against previous template
4. Updates only changed DOM parts (via tagged template literals)

```typescript
// These two changes cause ONE render, not two:
this.items = [...this.items, newItem];
this.isLoading = false;
// ^ Lit batches both → single efficient DOM update
```

**Lifecycle hooks:**

```typescript
connectedCallback(); // element added to DOM
disconnectedCallback(); // element removed
firstUpdated(); // first render complete (good for focus)
updated(changedProps); // after every update
willUpdate(changedProps); // before render (good for derived state)
```

---

# Shadow DOM — Key Concepts

```
Light DOM (regular)          Shadow DOM (encapsulated)
─────────────────────────────────────────────────────
<my-card>                    #shadow-root
  <slot></slot>                <style>  ← scoped!
</my-card>                     <div class="card">
                                 <slot></slot>  ← content projected
                               </div>
```

**CSS in Shadow DOM:**

```typescript
static styles = css`
  :host { display: block; }           /* the element itself */
  :host([disabled]) { opacity: 0.5; } /* when has attr */
  ::slotted(p) { color: red; }        /* slotted children */
`;
```

**CSS Custom Properties pierce the Shadow DOM:**

```css
/* Parent page can style internals via custom props */
my-product-card {
  --card-bg: #f5f5f5;
}
/* Inside component: */
.card {
  background: var(--card-bg, white);
}
```

---

# Events in Lit — Communication Patterns

```typescript
// Child → Parent: dispatch custom events
private handleClick() {
  this.dispatchEvent(new CustomEvent('product-selected', {
    detail: { id: this.productId, name: this.name },
    bubbles: true,    // propagates up the DOM
    composed: true    // crosses Shadow DOM boundary!
  }));
}

// Parent listens:
html`<my-product @product-selected=${this.onSelect}>`
```

> **Interview trap:** Without `composed: true`, events don't escape Shadow DOM!

---

# TypeScript with Lit — Common Patterns

```typescript
// Type your properties clearly
interface Product {
  id: string;
  name: string;
  price: number;
  category: "electronics" | "clothing" | "food";
}

@customElement("product-list")
export class ProductList extends LitElement {
  @property({ type: Array }) products: Product[] = [];
  @state() private sortBy: "price" | "name" = "name";
  @state() private currentPage = 1;

  // Computed values — use willUpdate or getter
  private get sortedProducts(): Product[] {
    return [...this.products].sort((a, b) =>
      this.sortBy === "price"
        ? a.price - b.price
        : a.name.localeCompare(b.name),
    );
  }
}
```

---

# REST / GraphQL Integration in Lit

```typescript
@customElement("product-list")
export class ProductList extends LitElement {
  @state() private products: Product[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchProducts();
  }

  private async fetchProducts() {
    this.loading = true;
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.products = await res.json();
    } catch (e) {
      this.error = e instanceof Error ? e.message : "Unknown error";
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) return html`<p>Loading...</p>`;
    if (this.error) return html`<p role="alert">Error: ${this.error}</p>`;
    return html`${this.products.map(
      (p) => html`<my-product .product=${p}></my-product>`,
    )}`;
  }
}
```

---

# Semantic HTML — What They Will Ask

**Why semantic HTML matters:**

- Accessibility (screen readers, keyboard nav)
- SEO
- Code clarity/maintainability

```html
<!-- WRONG — divs everywhere -->
<div class="header"><div class="nav">...</div></div>
<div class="main"><div class="article">...</div></div>

<!-- CORRECT — semantic -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <article>
    <h1>Product Catalog</h1>
    <section aria-label="Product list">
      <ul role="list">
        <li>...</li>
      </ul>
    </section>
  </article>
</main>
<footer>...</footer>
```

---

# Accessibility (a11y) — Key Points

| Concept          | What to Know                                           |
| ---------------- | ------------------------------------------------------ |
| ARIA roles       | `role="list"`, `role="alert"`, `role="dialog"`         |
| ARIA labels      | `aria-label`, `aria-labelledby`, `aria-describedby`    |
| Keyboard nav     | All interactive elements reachable via Tab/Enter/Space |
| Focus management | `focus()` after modal opens, trap focus in dialogs     |
| Color contrast   | WCAG AA: 4.5:1 ratio for normal text                   |
| Images           | `alt` text always; decorative = `alt=""`               |
| Forms            | `<label for="id">` or `aria-label` on every input      |

```typescript
// In Lit — loading state accessible
render() {
  return html`
    <div aria-live="polite" aria-busy=${this.loading}>
      ${this.loading ? html`<span>Loading products...</span>` : this.renderList()}
    </div>
  `;
}
```

---

# BEM — CSS Methodology

**B**lock **E**lement **M**odifier

```css
/* Block */
.product-card {
}

/* Element (part of block) — double underscore */
.product-card__title {
}
.product-card__price {
}
.product-card__image {
}

/* Modifier (variant) — double dash */
.product-card--featured {
}
.product-card--out-of-stock {
}
.product-card__price--discounted {
}
```

```html
<div class="product-card product-card--featured">
  <h2 class="product-card__title">Laptop Pro</h2>
  <span class="product-card__price product-card__price--discounted">€999</span>
</div>
```

> **In Shadow DOM:** BEM is less critical since styles are scoped, but still good for readability.

---

# Performance Optimization

| Technique         | How                                            |
| ----------------- | ---------------------------------------------- |
| Lazy loading      | `import()` dynamic, `loading="lazy"` on images |
| Debounce/throttle | Search inputs, scroll handlers                 |
| Memoization       | Cache expensive computed values                |
| Virtual scrolling | Render only visible items in long lists        |
| Bundle splitting  | Code-split by route/feature                    |
| CSS containment   | `contain: content` on list items               |

```typescript
// Lit: use `repeat()` directive for efficient list updates
import { repeat } from 'lit/directives/repeat.js';

render() {
  return html`
    ${repeat(
      this.products,
      (p) => p.id,        // key function — tells Lit which items moved
      (p) => html`<product-card .product=${p}></product-card>`
    )}
  `;
}
```

---

# Code Review Checklist — What They Expect

When reviewing junior dev code, check:

- [ ] **Correctness** — Does it do what it's supposed to?
- [ ] **Edge cases** — Empty array, null/undefined, network error
- [ ] **Performance** — Unnecessary re-renders, missing `repeat()` keys
- [ ] **Accessibility** — ARIA, semantic HTML, keyboard nav
- [ ] **TypeScript types** — `any` usage, missing types
- [ ] **Error handling** — Try/catch, loading states
- [ ] **Naming** — Clear, descriptive, consistent
- [ ] **DRY** — Duplicated logic
- [ ] **Security** — XSS via `unsafeHTML`, unvalidated inputs
- [ ] **State management** — @property vs @state usage

---

# Sorting + Pagination — The Main Exercise

This is likely the live coding task. Know this pattern cold:

```typescript
@state() private sortOrder: 'asc' | 'desc' = 'asc';
@state() private currentPage = 1;
private readonly pageSize = 10;

private get sortedProducts(): Product[] {
  return [...this.products].sort((a, b) => {
    const diff = a.price - b.price;
    return this.sortOrder === 'asc' ? diff : -diff;
  });
}

private get paginatedProducts(): Product[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.sortedProducts.slice(start, start + this.pageSize);
}

private get totalPages(): number {
  return Math.ceil(this.products.length / this.pageSize);
}
```

> **Gotcha:** Always sort a **copy** (`[...this.products]`), never mutate the original array!

---

# Scrum Vocabulary — They Mentioned It

| Term               | What to Say                                       |
| ------------------ | ------------------------------------------------- |
| Daily Standup      | "Yesterday I did X, today Y, blockers: Z"         |
| Sprint Review      | Demo completed features to stakeholders           |
| Refinement         | Estimate and clarify upcoming stories             |
| Definition of Done | Agreed checklist (tests pass, reviewed, deployed) |
| Story Points       | Relative complexity estimate (Fibonacci)          |

**Cross-team collaboration they expect:**

- Backend → REST/GraphQL contract agreement
- UX/UI → Component spec reviews, design handoff (Figma)
- QA → Test scenarios, bug reports
- Product Owner → Acceptance criteria clarification

---

# Potential Interview Questions — Deep Dive

| Question                               | Quick Answer                                                  |
| -------------------------------------- | ------------------------------------------------------------- |
| What is Shadow DOM?                    | Encapsulated DOM subtree, scoped styles                       |
| @property vs @state?                   | Public API vs private internal state                          |
| How does Lit updating work?            | Async batched, efficient template diffing                     |
| composed: true — why?                  | Events need to cross Shadow DOM boundaries                    |
| How do you style Lit from outside?     | CSS custom properties                                         |
| What is :host?                         | CSS selector targeting the element itself                     |
| `repeat()` vs `map()` in templates?    | `repeat()` with key fn = efficient DOM reuse                  |
| How to share state between components? | Parent props, events up, or a store (e.g. Redux/MobX/context) |

---

# Potential Interview Questions — HTML/CSS

| Question                  | Quick Answer                             |
| ------------------------- | ---------------------------------------- |
| Semantic HTML vs divs?    | Meaning + accessibility + SEO            |
| BEM approach?             | Block\_\_Element--Modifier naming        |
| SASS vs LESS vs CSS vars? | SASS = compile-time, vars = runtime      |
| CSS specificity?          | inline > id > class > tag                |
| Flexbox vs Grid?          | Flex = 1D layout, Grid = 2D layout       |
| What is `contain`?        | CSS isolation for performance            |
| How to make responsive?   | Mobile-first, media queries, fluid units |
| WCAG AA vs AAA?           | AA = 4.5:1 contrast, AAA = 7:1           |

---

# Potential Interview Questions — TypeScript/JS

| Question                 | Quick Answer                                   |
| ------------------------ | ---------------------------------------------- |
| `interface` vs `type`?   | Interface extendable, type for unions/mapped   |
| Generic constraints?     | `<T extends object>` restricts T               |
| `unknown` vs `any`?      | `unknown` forces type check first              |
| Narrowing?               | `typeof`, `instanceof`, type guards            |
| Optional chaining `?.`?  | Short-circuits on null/undefined               |
| Nullish coalescing `??`? | Fallback only for null/undefined (not falsy)   |
| Promise vs async/await?  | Same thing, async/await = syntactic sugar      |
| Event loop?              | Call stack + microtask queue + macrotask queue |

---

# What to Do Before the Interview

1. **Run the Lit tutorial** — lit.dev/tutorial (~30 min, free, interactive)
2. **Skim Lit docs** — Properties, Events, Lifecycle, Directives sections
3. **Practice the main exercise** — `5-code-review-exercise/` (sort + paginate)
4. **Read your Lit talking points** — `personal-prep.md` section on Clearly GmbH
5. **Rehearse GraphQL story** — Strapi + Nuxt, fragments, file structure
6. **Rehearse accessibility story** — audit + current WCAG 2.2 design system
7. **Review questions to ask** — especially the AI questions (they're memorable)
8. **WCAG 2.2 AA new criteria** — just 3 to know: Focus Appearance, Target Size, Auth

---

# Your Strongest Selling Points

| Their Need               | Your Story                                                                 |
| ------------------------ | -------------------------------------------------------------------------- |
| Lit / Web Components     | Clearly GmbH — short project, honest about it (see "Your Lit Story" slide) |
| GraphQL                  | Strapi CMS + custom e-commerce platform in Nuxt.js                         |
| Accessibility            | WCAG 2.2 AA design system + past audit remediation                         |
| TypeScript               | Current & recent projects — daily use                                      |
| Clean Code / Code Review | Design system work = documentation + standards                             |
| REST API                 | Multiple projects, API integration                                         |
| Scrum                    | Daily standups, refinements, reviews                                       |

> Prepare 2-3 concrete **STAR stories** (Situation, Task, Action, Result) for behavioral questions.

---

# Your Lit Story — How to Handle It Honestly

**The situation:** Brief Lit exposure at Clearly GmbH ~3 years ago. Don't fake expertise.

**What to say (honest + confident):**

> _"I worked with Lit at Clearly GmbH on a web components project — it was a relatively short period and was a few years ago, so I'll be upfront that I'm rusty on specifics. What I do remember clearly is the core philosophy: LitElement extends the native custom elements API, Shadow DOM for style encapsulation, and the reactive property system. I've been refreshing my knowledge and I'm genuinely excited about the framework because of the no-update-needed story you mentioned — that's a real advantage in a long-running product."_

**What this shows:**

- Honesty (builds trust immediately)
- You understand the core concepts
- You did your homework before the interview
- You engaged with what they said about their use case

---

# GraphQL — Vocabulary & Concepts

**Core building blocks:**

```graphql
# Schema — defines the shape of your data (written by backend)
type Product {
  id: ID!
  name: String!
  price: Float!
  category: Category
}

# Query — read data (equivalent to GET)
query GetProducts($categoryId: ID, $limit: Int) {
  products(category: $categoryId, pagination: { limit: $limit }) {
    data {
      id
      attributes {
        name
        price
      }
    }
  }
}

# Mutation — write/modify data (equivalent to POST/PUT/DELETE)
mutation UpdateProduct($id: ID!, $price: Float!) {
  updateProduct(id: $id, data: { price: $price }) {
    data {
      id
      attributes {
        price
      }
    }
  }
}
```

---

# GraphQL — More Vocabulary

| Term              | What It Is                                              |
| ----------------- | ------------------------------------------------------- |
| **Schema**        | Contract between frontend & backend — defines all types |
| **Query**         | Read operation — like GET                               |
| **Mutation**      | Write/update/delete operation                           |
| **Subscription**  | Real-time updates via WebSocket                         |
| **Fragment**      | Reusable piece of a query (DRY principle)               |
| **Resolver**      | Backend function that returns data for a field          |
| **Variables**     | Parameterized queries — avoids string interpolation     |
| **Introspection** | Querying the schema itself (powers tooling)             |
| **Apollo Client** | Most popular GraphQL client library                     |
| **codegen**       | Auto-generates TypeScript types from your schema        |
| **`gql` tag**     | Tagged template literal to write GraphQL in JS/TS       |

---

# GraphQL — Fragments & File Structure

**How you organized queries in Nuxt.js + Strapi:**

```
graphql/
├── fragments/
│   ├── productFields.fragment.gql    ← reusable field sets
│   └── categoryFields.fragment.gql
├── queries/
│   ├── getProducts.query.gql
│   ├── getProductById.query.gql
│   └── getCategories.query.gql
└── mutations/
    ├── updateProduct.mutation.gql
    └── createOrder.mutation.gql
```

```graphql
# fragments/productFields.fragment.gql
fragment ProductFields on Product {
  id
  attributes {
    name
    price
    slug
    image {
      data {
        attributes {
          url
          alternativeText
        }
      }
    }
  }
}

# queries/getProducts.query.gql
query GetProducts($limit: Int, $start: Int) {
  products(pagination: { limit: $limit, start: $start }) {
    data {
      ...ProductFields
    }
    meta {
      pagination {
        total
        pageCount
      }
    }
  }
}
```

---

# GraphQL — Your Story (Strapi + Nuxt.js)

**What to say when asked about GraphQL experience:**

> _"I worked with GraphQL connecting a Strapi CMS to a custom e-commerce frontend built in Nuxt.js. Strapi auto-generates a GraphQL schema from the content types you define, so we had products, categories, and orders all exposed as GraphQL types. On the frontend, I used Apollo Client — we organized the queries into separate `.gql` files: a `queries/` folder, a `mutations/` folder, and a `fragments/` folder for reusable field sets. Fragments were especially useful — we had a `ProductFields` fragment that got reused across the product listing query, the detail page query, and search results, so when the product type changed we only updated one place._

> _One thing I appreciated about Strapi's GraphQL was the built-in pagination and filtering through query variables — `{ pagination: { limit, start } }` — which made implementing infinite scroll clean on the frontend."_

---

# Accessibility — Your Experience

**Two threads to mention:**

**1. Past audit (previous company):**

> _"At [company], we had a formal accessibility audit conducted by an external agency. They delivered a report with findings categorized by WCAG criterion and severity. I was part of the team that worked through the remediation — things like missing `aria-label` on icon buttons, insufficient color contrast, and keyboard traps in modal dialogs."_

**2. Current design system work (WCAG 2.2 AA):**

> _"In my current role, I'm building a custom component library to WCAG 2.2 AA standard. After completing each component, I run it through axe DevTools in the browser, check keyboard navigation manually, and test with VoiceOver. For 2.2 specifically, I've been paying attention to the new criteria — Focus Appearance, minimum touch Target Size (24×24px), and Accessible Authentication."_

---

# Accessibility Tools — Know These

| Tool                        | Type                          | What it Does                                    |
| --------------------------- | ----------------------------- | ----------------------------------------------- |
| **axe DevTools**            | Browser ext (Chrome/FF)       | Automated WCAG scan, highlights issues in DOM   |
| **Lighthouse**              | Chrome DevTools               | Accessibility score + recommendations           |
| **WAVE** (WebAIM)           | Browser ext                   | Visual overlay of a11y issues on page           |
| **Storybook a11y addon**    | Dev tooling                   | Runs axe on each story in Storybook             |
| **jest-axe**                | Unit testing                  | `expect(container).toHaveNoViolations()`        |
| **VoiceOver**               | Screen reader (macOS/iOS)     | Built-in — Cmd+F5 to toggle                     |
| **NVDA**                    | Screen reader (Windows, free) | Most-used screen reader in surveys              |
| **Color Contrast Analyzer** | Desktop app                   | Eyedropper-based contrast checking              |
| **Figma: Contrast plugin**  | Design                        | Check contrast before dev starts                |
| **axe-core**                | Library                       | Programmatic a11y testing in any test framework |

> **WCAG 2.2 AA new in 2.2:** Focus Appearance (2.4.11), Target Size min 24×24px (2.5.8), Accessible Authentication (3.3.8)

---

# Questions to Ask Them

**About the role & codebase:**

- How is the component library currently structured — single repo, monorepo?
- What does the testing strategy look like for Lit components? (`@web/test-runner`, Playwright?)
- How mature is the Lit migration — is this greenfield or are there still legacy parts?
- How do you handle versioning and publishing of shared components?

**About team & process:**

- What does a typical sprint look like — how many people, how long?
- How is the collaboration between frontend and UX/UI organized? (Figma, design tokens?)
- What does the onboarding look like for the first 2 weeks?
- Remote/on-site balance in practice?

**About AI in the project:**

- Are there any AI-assisted features in the product (e.g. recommendations, search, chat)?
- Do you use AI tooling in your development workflow — Copilot, Claude, Cursor?
- Is there any plan to integrate LLMs into the platform in the near term?
- How do you handle the quality/consistency of AI-generated code in code reviews?

---

# Scrum — What to Say

**You don't need war stories — process knowledge is enough:**

> _"I've been working in Scrum teams for X years. I'm comfortable with the standard ceremonies — daily standups, sprint planning, refinement, and reviews. In refinements I typically help clarify acceptance criteria from the frontend perspective and flag things like 'this UX flow will be tricky — let's break it into two stories.' "_

**If they ask about challenges:**

> _"One thing I've found important is the contract between frontend and backend during sprint planning — agreeing on API shapes before both sides start building. GraphQL schema-first or OpenAPI contracts help a lot there because you can work in parallel instead of blocking on each other."_

**Useful Scrum vocabulary:**

- _"Definition of Done"_ — agreed checklist before a story is closed
- _"Velocity"_ — team's story points per sprint (never commit to a fixed velocity)
- _"Spike"_ — time-boxed research task when requirements are unclear
- _"Technical debt"_ — name it explicitly, put it in the backlog

---

# Summary — Day Before Interview

- [ ] Rehearse Lit story (Clearly GmbH — honest + confident)
- [ ] Rehearse GraphQL story (Strapi + Nuxt, say "fragments", "variables", "Apollo")
- [ ] Rehearse a11y story (audit at old company + WCAG 2.2 AA design system)
- [ ] Practice sort + paginate in `product-list-solution.ts`
- [ ] Read through the code review checklist
- [ ] Pick 3 questions to ask them (include one AI question)
- [ ] Sleep 8h. Water. 5 min early.

**Remember:** Think out loud. It's ok to Google. They said so themselves.  
Silence is the only thing they don't want to see.

---

# Quick German Tech Vocabulary

| English       | Deutsch                      |
| ------------- | ---------------------------- |
| Component     | Komponente                   |
| Performance   | Leistung / Performance       |
| Accessibility | Barrierefreiheit             |
| Unit test     | Unit-Test / Komponenten-Test |
| Code Review   | Code-Überprüfung             |
| Deployment    | Bereitstellung / Deployment  |
| Bug           | Fehler / Bug                 |
| Feature       | Funktion / Feature           |
| Sprint        | Sprint                       |
| Stakeholder   | Auftraggeber / Stakeholder   |
