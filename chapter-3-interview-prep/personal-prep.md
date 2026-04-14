---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: 'Segoe UI', sans-serif;
    font-size: 19px;
    padding: 40px 60px;
  }
  h1 { color: #1a1a2e; border-bottom: 3px solid #e94560; padding-bottom: 10px; }
  h2 { color: #16213e; }
  h3 { color: #e94560; font-size: 1em; margin-bottom: 4px; }
  code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #f0f2f5; color: #2d2d2d; padding: 20px; border-radius: 8px; font-size: 0.75em; }
  table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
  th { background: #16213e; color: white; padding: 8px; }
  td { padding: 8px; border: 1px solid #ddd; }
  blockquote { border-left: 4px solid #e94560; padding: 10px 16px; color: #333; font-style: italic; background: #fafafa; margin: 8px 0; }
---

# Personal Interview Prep
## Talking Points & Scripts

Your specific stories and how to frame them.
This is not theory — it's **your narrative**.

---

## Your Lit Story — The Setup

**Facts to work with:**
- Brief project at **Clearly GmbH**, ~3 years ago
- Web components context with Lit
- Short involvement — don't remember specifics
- You've been refreshing before this interview

**Why honest works here:**
- Builds trust immediately
- They'll find out anyway if you oversell
- You still know the real concepts — that's what matters
- Connecting to *their* use case shows you listened

---

## Your Lit Story — What to Say

> *"I worked with Lit at Clearly GmbH on a web components project — it was a short stint and a few years back, so I'll be upfront that I'm rusty on specifics. What I do remember clearly is the core philosophy: LitElement wraps the native custom elements API, Shadow DOM handles style encapsulation, and the reactive property system with `@property` and `@state` drives re-renders efficiently.*

> *I've been refreshing my knowledge before this interview and I'm genuinely excited about the approach — especially the point you made about not needing to update everything on each release. That's a real advantage for a long-running financial product."*

---

## GraphQL — Vocabulary to Use Naturally

| Say this... | In this context |
|---|---|
| **schema** | "Strapi auto-generates a GraphQL schema from content types" |
| **query / mutation** | "queries for reading, mutations for cart and order updates" |
| **fragment** | "a `ProductFields` fragment reused across multiple queries" |
| **variables** | "parameterized queries with variables for filtering and pagination" |
| **Apollo Client** | "we used Apollo Client on the Nuxt side" |
| **`.gql` files** | "queries in separate files — queries/, mutations/, fragments/" |
| **codegen** | "ideally you'd run codegen to auto-generate TS types from the schema" |

---

## GraphQL — Your Story (Part 1)

> *"I connected a Strapi CMS to a custom e-commerce frontend in Nuxt.js using GraphQL. Strapi auto-generates a GraphQL schema from the content types you define in the admin — so products, categories, and orders were all exposed as GraphQL types automatically.*

> *On the Nuxt side I used Apollo Client. We kept the queries in separate `.gql` files — a `queries/` folder for reads, `mutations/` for writes like cart updates and order creation, and a `fragments/` folder for reusable field selections."*

---

## GraphQL — Your Story (Part 2)

> *"For example, we had a `ProductFields` fragment that we used in the product listing query, the detail page, and the search results — so if the product type changed in Strapi, we only updated one place.*

> *Strapi's pagination came through query variables — `{ pagination: { limit, start } }` — which made implementing pages or infinite scroll clean."*

**If asked about a problem you faced:**
> *"One challenge was that Strapi's auto-generated schema produced deeply nested `data.attributes` wrappers. We used fragments specifically to flatten that so the query results were usable without transforming them everywhere in the UI."*

---

## Your Accessibility Story — Thread 1

### The Audit (Previous Company)

> *"At my previous company we had a formal accessibility audit conducted by an external agency. They delivered a report with findings categorized by WCAG criterion and severity — critical, major, minor.*

> *I was involved in the remediation: we fixed missing `aria-label` attributes on icon-only buttons, color contrast failures on secondary text, and keyboard traps in modal dialogs where focus wasn't being managed properly."*

---

## Your Accessibility Story — Thread 2

### Current Design System — WCAG 2.2 AA

> *"Currently I'm building a custom component library to WCAG 2.2 AA. After each component I run axe DevTools in Chrome to catch automated violations, then manually test keyboard navigation — Tab order, Enter/Space activation, Escape for dismissal, focus visibility.*

> *For WCAG 2.2 specifically I've been paying attention to the new criteria: Focus Appearance, the minimum touch Target Size of 24×24px, and Accessible Authentication.*

> *I also do a quick VoiceOver smoke test on anything with complex ARIA patterns — accordions, tabs, live regions."*

---

## Accessibility Tools — Name These Confidently

| Tool | How you use it |
|---|---|
| **axe DevTools** | Chrome extension — primary automated scan after each component |
| **VoiceOver** | macOS built-in (`Cmd+F5`) — screen reader smoke test |
| **Lighthouse** | Chrome DevTools — quick score + recommendations |
| **WAVE** | WebAIM browser extension — visual overlay of issues |
| **jest-axe** | Unit tests: `expect(container).toHaveNoViolations()` |
| **Color Contrast Analyzer** | Eyedropper tool for checking contrast ratios |

---

## Scrum — What to Say

> *"I've been working in Scrum teams for several years — comfortable with the full cycle: planning, daily standups, refinements, and reviews. In refinements I like to flag API contract questions early — things like 'the backend says this field is optional but UX always shows it, let's agree on that now.' It saves back-and-forth mid-sprint."*

**If they ask about challenges:**
> *"Frontend estimation gets harder when the API isn't defined yet. I try to propose schema-first contracts early — even a quick agreement on the response shape — so frontend and backend can develop in parallel without blocking each other."*

**Vocabulary:** Definition of Done · Velocity · Spike · Technical debt

---

## Questions to Ask — Best Openers

Pick **3 maximum**. Make it feel like curiosity, not a checklist.

**Start with one of these:**
- *"You mentioned Lit — are you working towards a shared component library, or more per-project components right now?"*
- *"What does onboarding look like in the first couple of weeks — is there documentation, or more hands-on?"*

**Good follow-ups:**
- *"How do you test Lit components — `@web/test-runner`, Playwright?"*
- *"How is collaboration with UX structured — design tokens from Figma, or a separate handoff step?"*
- *"What's the remote/on-site balance in practice?"*

---

## Questions to Ask — AI (These Are Memorable)

Most candidates don't ask about AI. In fintech 2026, there's almost certainly an internal conversation happening.

- *"Is the team using any AI tooling in the dev workflow — Copilot, Cursor, Claude, anything like that?"*
- *"Are there AI-powered features in the product — recommendations, search, anything like that?"*
- *"Is there a roadmap for integrating LLMs into the platform?"*
- *"How do you handle consistency of AI-generated code in reviews?"*

> These questions signal you think about the **product**, not just the code. That's what they want from a senior contractor.

---

## Handling Difficult Moments

**"Tell me more about your Lit experience..."**
→ Use your Lit Story script. Honest → concepts → enthusiasm.

**"Have you worked with [thing you haven't]?"**
→ *"Not directly, but I've worked with [comparable thing] which solves a similar problem. I'd be keen to dig in."*

**Silent moment during coding:**
→ Narrate: *"Okay, I need to sort without mutating — I'll spread the array first..."*

**You don't know the answer:**
→ *"I don't have that at the top of my head — can I work through it or Google that quickly?"*
They literally said this is fine.

**Bug you can't spot immediately:**
→ *"Let me add a console.log here to verify what this actually returns..."*
