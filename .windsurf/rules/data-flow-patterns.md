---
trigger: glob
globs: src/app/**/*.tsx,src/lib/queries.ts,src/hooks/**/*.ts
---

# Data Flow & State Management

## Philosophy

Use TanStack Query for server state. Treat server data as a client-side cache to simplify logic and improve UX.

## Guidelines

### 1. Encapsulate Queries in Custom Hooks

**Rule:** Never call `useQuery` or `useMutation` directly in components. Wrap them in custom hooks (e.g., `useGetPosts`).

**Why:** Centralizes logic, improves reusability, and decouples components from fetching implementation.

**Example:** `export const useGetPosts = () => useQuery({ ... });`

### 2. Implement Optimistic Updates

**Rule:** Use optimistic updates for mutations to provide an instantaneous UI response.

**How:** Use `onMutate` to update the cache, `onError` to roll back on failure, and `onSettled` to refetch and sync.

**Example:** `onMutate: async (newPost) => { ... }`

### 3. Use `select` to Optimize Re-renders

**Rule:** If a component only needs a subset of query data, use the `select` option to transform it.

**Why:** Prevents re-renders by memoizing the transformation. The component only updates when the selected value changes.

**Example:** `select: (data) => data.posts.map((post) => post.title)`

### 4. Configure `staleTime`

**Rule:** Set a reasonable `staleTime` for data that isn't highly dynamic to reduce unnecessary network requests.

- **`staleTime`**: Duration before data is considered stale. Serves cache without a background refetch.
- **`cacheTime`**: Duration until inactive data is garbage collected (default: 5 mins).

**Example:** `useQuery({ queryKey: ['posts'], queryFn: fetchPosts, staleTime: 1000 * 60 * 5 })`
