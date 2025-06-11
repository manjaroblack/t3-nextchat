---
trigger: glob
globs: "src/app/**/*.tsx"
---

# Next.js Performance Tuning

## Philosophy

Maximize server-side work and minimize client-side JavaScript to ensure a fast initial load and optimal user experience.

## Guidelines

### 1. Default to Server Components

**Rule:** Use Server Components by default. Only use Client Components (`'use client'`) for interactivity (state, effects, browser APIs).

**Why:** Server Component code isn't sent to the client, reducing bundle size.

### 2. Isolate Client Components

**Rule:** Place `'use client'` at the leaves of the component tree.

**Why:** The `'use client'` directive makes all imported components into Client Components. Isolating it prevents large sub-trees from being added to the client bundle.

### 3. Fetch Data on the Server

**Rule:** Perform primary data fetching in Server Components, ideally at the page/layout level.

**Why:** Simplifies fetching with `async/await`, reduces client-server waterfalls, and streams pages with data already populated.

### 4. Leverage Caching

**Rule:** Use Next.js's built-in `fetch` caching and revalidation strategies.

- **Time-based:** `fetch('...', { next: { revalidate: 3600 } });`
- **Route-based:** `export const revalidate = 60;`

### 5. Use Dynamic Imports

**Rule:** Dynamically import large components/libraries not critical for the initial view (e.g., modals, charts).

**Why:** Creates separate JS chunks loaded on-demand, reducing the initial bundle.

**Example:** `const HeavyComponent = dynamic(() => import('../components/HeavyComponent'))`
