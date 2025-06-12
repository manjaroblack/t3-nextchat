---
description: Concise Next.js App Router best practices.
trigger: model_decision
tags: [nextjs, app-router, react, server-components, client-components, data-fetching, routing, performance, nextjs15]
---

# Next.js App Router: Core Guidelines

Essential practices for Next.js App Router development, covering Server/Client Components, data flow, routing, error handling, and performance with Next.js 15 updates.

## 1. Server vs. Client Components

- **Server Components (Default):** Use for data fetching, backend access, and server-side logic. Perform primary data fetching here to reduce client-server waterfalls.
- **Client Components (`'use client'`):** Use sparingly for:
  - Interactivity & event listeners (`onClick`, `onChange`).
  - State & lifecycle hooks (`useState`, `useEffect`).
  - Browser-only APIs (`window`, `localStorage`).
  - Hooks depending on the above.
- **Minimize Client Footprint:** Keep Client Components small. Pass Server Components as `children` or props from a Server Component parent (do not import Server Components directly into Client Component files for rendering).

## 2. Data Fetching & Server Actions

- **Server Components:**
  - Use `async/await`. Next.js 15: `cookies()`, `headers()`, `params`, `searchParams` are async (`await` them).
  - `fetch()` is extended for auto-deduping & caching (see Caching section for Next.js 15 Route Handler changes).
  - Access DB/backend logic directly or via imported functions.
- **Server Actions (`'use server'`):** For data mutations (POST, PUT, DELETE) and forms. Callable from Server/Client Components. Define in Server Components or separate files.
- **Route Handlers (API Endpoints - `app/api/...`):** For external APIs, webhooks, or specific client-side fetch needs not met by Server Actions.
  - Avoid `fetch`ing Route Handlers from Server Components; call underlying logic directly.
  - Next.js 15: `GET` Route Handlers are **not cached by default**. Opt-in with e.g., `export const dynamic = 'force-static'`. Metadata routes remain cached.
- **Client-Side Fetching:** Use SWR/TanStack Query in Client Components for dynamic, user-specific data requiring client-side interactions (caching, revalidation).
- **Parallel Fetching (Server Components):** Use `Promise.all` for concurrent data fetching.

  ```typescript
  // Example: Parallel fetching
  async function Page() {
    const [userData, productData] = await Promise.all([getUser(), getProducts()]);
    // ...
  }
  ```

- **Sequential Fetching:** `await` sequentially if data depends on prior fetches. Use `<Suspense>` for streaming.

## 3. Routing & Layouts

- **File Conventions:**
  - `page.tsx`: Route UI.
  - `layout.tsx`: Shared, stateful UI for segments.
  - `template.tsx`: Similar to layout, but new instance per child (state not preserved).
  - `loading.tsx`: Suspense-based loading UI.
  - `error.tsx`: Segment-specific error UI (Client Component).
  - `global-error.tsx`: App-level error boundary (replaces root layout).
  - `not-found.tsx`: UI for `notFound()` or unmatched routes.
- **Route Groups `(...)`:** Organize routes without URL path changes.
- **Dynamic Segments:** `[slug]`, `[...slug]` (catch-all), `[[...slug]]` (optional catch-all).

## 4. Loading UI & Streaming

- **`loading.tsx`:** For instant loading UI with Suspense during Server Component data fetching.
- **Granular Suspense:** Wrap specific components in `<Suspense fallback={...}>` for finer-grained loading.
- **Streaming:** Enabled by Server Components & Suspense for improved perceived performance.

## 5. Error Handling

- **`error.tsx` (Client Component):** Handles errors in a segment. Receives `error` object and `reset` function. Doesn't catch errors in its segment's `layout.tsx` (place in parent).
- **`global-error.tsx`:** For root layout errors. Must define `<html>` & `<body>`.
- **`notFound()`:** Renders `not-found.tsx` from Server Components/Route Handlers.
- **Reporting:** Log errors to services (Sentry) from `error.tsx`/`global-error.tsx`.
- **`instrumentation.ts` (Next.js 15+ Stable):** Use `register()` for observability (OpenTelemetry). Hook `onRequestError` for detailed server-side error context.

## 6. Performance & Caching

- **Data Cache & `fetch()`:**
  - Server Component `fetch()` is cached by default. Control with `{ cache: 'no-store' }` or `{ next: { revalidate: seconds } }`.
  - Next.js 15: `GET` Route Handlers **not cached by default** (opt-in with `export const dynamic = 'force-static'`).
- **Full Route Cache:** Caches entire route segments on server for static/infrequent changes.
- **Router Cache (Client-Side):**
  - Stores Server Component payloads for visited segments.
  - Next.js 15: Page components (dynamic segments) **not cached by default** on forward navigation (`staleTime: 0`) for fresh data. Layouts/`loading.tsx` remain cached.
- **Key Optimizations:**
  - **Prefetching:** `next/link` prefetches visible routes.
  - **Dynamic Functions:** `cookies()`, `headers()` opt into dynamic rendering.
  - **Code Splitting:** Automatic per route segment.
  - **Bundle Analysis:** Use `@next/bundle-analyzer`.
  - **Optimized Assets:** `next/image`, `next/font`.
- **Next.js 15+ Enhancements:**
  - **Turbopack:** `next dev --turbo` for faster development.
  - **Server Components HMR Cache:** Reuses `fetch` responses during HMR.
  - **Faster Static Generation:** Build time optimizations.
  - **Static Route Indicator:** Dev-mode visual cue for static/dynamic routes.
  - **`unstable_after()` (Experimental):** Schedule tasks post-response.

    ```typescript
    // Example: unstable_after()
    import { unstable_after as after } from 'next/server';
    export async function GET(request: Request) {
      const data = await getSomeData();
      after(() => { /* e.g., logAnalyticsEvent() */ });
      return Response.json(data);
    }
    ```

## 7. Server Actions (Recap & Best Practices)

- **Primary for Mutations:** Use for all data changes (CRUD).
- **Progressive Enhancement:** Work without JS if used with `<form action={...}>`.
- **Error Handling & Revalidation:** Handle errors within actions; use `revalidatePath`/`revalidateTag`.
- **Optimistic Updates:** Implement in Client Components for better UX.

## 8. Styling

- **CSS Modules:** For component-local styles.
- **Tailwind CSS:** Recommended utility-first approach.
- **Global Styles:** `app/globals.css` or `app/layout.tsx`.

## 9. Core Principles

- **Colocate:** Keep related Server/Client Components together.
- **Minimize Client JS:** Push logic to server where possible.
- **Understand Rendering:** Distinguish server vs. client rendering.
- **Follow Conventions:** Use Next.js file-system routing and special files.
