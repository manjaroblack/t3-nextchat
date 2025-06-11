---
trigger: glob
globs: "**/src/components/**/*.tsx"
---

# Component Design (shadcn/ui)

## Guidelines

### 1. Composition

**Rule:** Favor composition. Use the `asChild` prop pattern (from shadcn/ui) to merge custom functionality onto underlying elements.

**Example:** `<Button asChild><Link href="/login">Login</Link></Button>`

### 2. Styling

- **Variants:** Use `class-variance-authority` (CVA) for component variants.
- **Merging:** Use `tailwind-merge` (`cn` function) to prevent Tailwind CSS class conflicts.

**Example:** `className={cn(buttonVariants({ variant, size, className }))}`

### 3. Accessibility (a11y)

**Rule:** Prioritize accessibility.

- Use semantic HTML (`<button>`, `<nav>`).
- Ensure keyboard navigability and clear focus indicators (shadcn/ui defaults).
- Rely on semantic HTML before ARIA; Radix UI (shadcn/ui base) handles most ARIA.
- Verify color contrast.

### 4. State Management

- **Client Components:** Use `'use client'` for interactivity.
- **Local State:** Use `useState` for simple component state.
- **Shared State:** Use React Context or a state library for complex cross-component client state. Server state is managed by TanStack Query via tRPC.

### 5. Forms

**Rule:** Integrate `shadcn/ui` with `react-hook-form`. Use `Form`, `FormField`, `FormItem`.

**Example:** `<FormField control={form.control} name="username" ... />`

### 6. Customization

**Rule:** Customize `shadcn/ui` components directly in the project as needed. They are part of your codebase.
