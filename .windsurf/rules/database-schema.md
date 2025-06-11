---
trigger: glob
globs: "prisma/schema.prisma"
---

# Prisma Schema Design

## Philosophy

`schema.prisma` is the single source of truth for database structure. Prioritize clarity, consistency, and explicitness for type safety, performance, and maintainability.

## Guidelines

### 1. Naming Conventions

**Rule:** Use consistent naming.

- **Models:** PascalCase, singular (e.g., `User`, `BlogPost`).
- **Fields:** camelCase (e.g., `firstName`, `createdAt`).
- **Enums:** PascalCase for name, UPPER_CASE for values (e.g., `enum Role { USER, ADMIN }`).

### 2. Explicit Relations

**Rule:** Define both sides of relationships. Use explicit scalar fields for foreign keys. For M-N relations, use an explicit join table.

**Why:** Improves clarity, query performance (via targeted indexes), and allows metadata on join tables (e.g., `assignedAt`).

**Example:**

```prisma
model Post {
  id       Int     @id @default(autoincrement())
  author   User    @relation(fields: [authorId], references: [id])
  authorId Int
}
```

### 3. Indexing

**Rule:** Add indexes (`@index` or `@@index`) to foreign keys and frequently queried/ordered fields.

**Why:** Speeds up reads. A necessary trade-off for write overhead.

**Example:** `@@index([authorId, status])`

### 4. Data Types

**Rule:** Use the most specific and correct data type for each field.

**Why:** Ensures data integrity and efficient storage. Enables type-specific operations (e.g., date queries on `DateTime`).

**Example:** `createdAt DateTime @default(now())`

### 5. Normalization

**Rule:** Avoid redundant data. Decompose large models into smaller, related tables.

**Why:** Reduces anomalies, saves space, and simplifies maintenance.
