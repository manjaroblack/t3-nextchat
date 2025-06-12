# Development Environment Setup

This document provides a comprehensive guide to setting up the development environment for the T3-NextChat project. Adhering to these guidelines will ensure consistency across the team and streamline the development process.

## Operating System

- **OS:** Windows 11
- **Terminal:** PowerShell

All development and testing should be compatible with this setup.

## IDE

- **IDE:** Windsurf

## Tech Stack

### Core Technologies

- **Framework:** [Next.js](https://nextjs.org)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **API Layer:** [tRPC](https://trpc.io/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [@stackframe/stack](https://www.stackframe.co/)
- **Database:** [Neon](https://neon.tech/) PostgreSQL

### Key Libraries

- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable UI components.
- **State Management:** [TanStack Query](https://tanstack.com/query/latest) - For server state management, caching, and data fetching.
- **Styling Utilities:**
  - [tailwind-merge](https://github.com/dcastil/tailwind-merge) - For merging Tailwind CSS classes without style conflicts.
  - [class-variance-authority](https://cva.style/docs) - For creating type-safe and composable component variants.

## Development Environment

- **Package Manager:** [pnpm](https://pnpm.io/)
- **Node.js:** LTS version
- **Code Quality:** [Biome](https://biomejs.dev/) - The configuration is in `biome.json`.

## Deployment

This project is configured for deployment on [Netlify](https://www.netlify.com/). The configuration can be found in the `netlify.toml` file at the root of the project.

## Environment Variables

To run the application locally, you need to create a `.env.local` file in the root of the project and add the following environment variables. A `.env.example` file is provided in the repository for your convenience.

```dotenv
# .env.example

# Prisma
# The connection string for your Neon PostgreSQL database.
DATABASE_URL="postgresql://..."

# Stack Auth
# Get these from your Neon project's Stack Auth integration.
NEXT_PUBLIC_STACK_PROJECT_ID=""
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=""
STACK_SECRET_SERVER_KEY=""

# OpenAI API
# Your API key for accessing OpenAI models.
OPENAI_API_KEY=""

# VirusTotal API (Optional)
# Used for scanning files uploaded to the knowledge base.
# VIRUSTOTAL_API_KEY=""
```

## Version Control

- **System**: Git
- **Hosting**: GitHub

### Branching Strategy

- `main`: This branch is for production-ready code. Direct pushes are disabled. All changes must come through a pull request.
- `develop`: This is the primary development branch. Features are merged here before being promoted to `main`.
- `feat/<feature-name>`: All new features should be developed in a dedicated feature branch, branched off from `develop`.

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for all commit messages. This creates a structured, readable history that is easy to navigate and can be used to automate changelogs.

Before creating a pull request, it's recommended to rebase your feature branch onto `develop` to maintain a clean, linear history.

For a complete set of rules, including detailed commit types and our branching strategy, please refer to the [Version Control Guidelines](./.windsurf/rules/version-control-guidelines.md).
