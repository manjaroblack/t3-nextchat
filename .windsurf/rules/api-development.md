---
trigger: glob
globs: "**/src/server/**/*.ts,**/src/app/api/**/*.ts"
---

# API Development (tRPC)

## Guidelines

### 1. Validation

**Rule:** All procedures MUST use a `Zod` schema for input validation. Use `z.infer` to derive TypeScript types from schemas.

**Example:** `input(z.object({ text: z.string().min(1) }))`

### 2. Procedure Types

- **`query`**: For read-only operations.
- **`mutation`**: For write (C/U/D) operations.

### 3. Auth

**Rule:** Use `middleware` to create a `protectedProcedure` for authenticated routes. Perform fine-grained authorization checks inside the procedure.

**Example:** `export const protectedProcedure = t.procedure.use(isAuthed);`

### 4. Error Handling

**Rule:** Throw `TRPCError` with specific codes (e.g., `UNAUTHORIZED`, `NOT_FOUND`). Do not leak server error details.

**Example:** `throw new TRPCError({ code: 'UNAUTHORIZED' });`

### 5. Database Logic

**Rule:** Encapsulate Prisma calls within procedures. Never expose the Prisma client or raw models in API responses. Select only necessary fields.

**Example:** `select: { id: true, name: true }`

### 6. Context

**Rule:** Use `createContext` to provide dependencies (Prisma client, session) to all procedures.

**Example:** `export const createContext = async (opts: CreateNextContextOptions) => { ... }`

### 7. Server Actions vs. tRPC

- **Server Action**: For simple, component-specific mutations.
- **tRPC Procedure**: For reusable, complex, or multi-component business logic.
