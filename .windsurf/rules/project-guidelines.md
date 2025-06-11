---
trigger: always_on
---

# Project Guidelines

## Project Overview

- This is a Next.js project using the App Router.
- The primary language is TypeScript.
- The project is deployed on Netlify.

## Tech Stack

### Frontend

- UI Components: Use shadcn/ui.
- State Management: Use TanStack Query (React Query) for server state.
- Styling: Use Tailwind CSS.
- Styling Utilities: Use `tailwind-merge` and `class-variance-authority` for composable component styles.

### Backend

- API Layer: Use tRPC.
- ORM: Use Prisma.
- Database: The project uses a Neon PostgreSQL database.
- Authentication: Use @stackframe/stack for modern, integrated authentication.

## Development Environment

- Package Manager: Use pnpm for all package management commands.
- Code Quality: Use Biome for linting and formatting. Adhere to the rules in `biome.json`.
