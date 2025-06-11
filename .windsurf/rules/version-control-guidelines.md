---
trigger: glob
globs: "**/*"
---

# Git & Version Control

## Philosophy

A clean, consistent version control history is essential for collaboration and maintenance. We use a structured workflow based on Conventional Commits.

## Guidelines

### 1. Branching Strategy

**Rule:** All work occurs on feature branches. No direct commits to `develop` or `main`.

- **`main`**: Production-ready code. Merges only from `develop`.
- **`develop`**: Integration branch for completed features. Source for the next release.
- **`feat/<name>` or `fix/<name>`**: Branches for new features or fixes.

### 2. Commit Messages (Conventional Commits)

**Rule:** Commits MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (`<type>(<scope>): <subject>`).

**Why:** Creates a structured history for automated changelogs and easier navigation.

**Common Types:** `feat`, `fix`, `perf`, `refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore`.

**Example:** `feat(auth): add password reset endpoint`

### 3. Pull Requests (PRs)

**Rule:** All branches must be merged into `develop` via a PR.

- **Keep PRs small and focused.**
- **Write clear descriptions** explaining the *what* and *why*.
- **Require at least one review** before merging.

### 4. Clean History

**Rule:** Rebase your feature branch onto `develop` before creating a PR.

**Why:** Rebasing (`git pull --rebase origin develop`) creates a linear, easy-to-follow history and avoids merge commits.
