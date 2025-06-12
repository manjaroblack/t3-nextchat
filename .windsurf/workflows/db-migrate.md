---
description: "Run a Prisma database migration with a descriptive name."
---

# Database Migration Workflow

This workflow streamlines the process of creating and applying a new database migration using Prisma.

1. **Prompt for Migration Name**
   - The agent will ask the user for a short, descriptive, snake_cased name for the migration (e.g., `add_user_profiles`).

2. **Run Prisma Migrate**
   - // turbo
   - The agent will execute the following command, inserting the user-provided name:

     ```bash
     pnpm prisma migrate dev --name <migration_name>
     ```

3. **Confirm Success**
   - The agent will check the command output to confirm that the migration was created and applied successfully.
