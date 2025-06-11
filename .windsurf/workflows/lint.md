---
description: Lint and format codebase
---

# Lint & Format Workflow

This workflow uses Biome to check for linting errors and format the code according to project standards.

1.  Run the Biome check command: `pnpm biome check --apply .`
2.  This command will identify issues and automatically apply safe fixes.
3.  Review any remaining errors that could not be fixed automatically.
4.  Suggest and apply manual fixes for the outstanding issues.
