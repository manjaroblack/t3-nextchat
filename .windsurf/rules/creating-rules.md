---
trigger: model_decision
description: Best practices and guidelines for authoring Windsurf rule files
---

# Creating Windsurf Rules

## Philosophy

Effective rules guide the AI to produce consistent, high-quality output while respecting context limits. Rules should be direct, unambiguous, and focused on providing guardrails, not verbose explanations. The goal is maximum utility with minimum character count.

## Guidelines

### 1. Stay Current with Research

**Rule:** You MUST always perform a comprehensive web search before creating or updating any rule. This is a non-negotiable first step. The goal is to find the latest cutting-edge trends, advanced techniques, and best practices for the topic. You MUST fetch and synthesize information from multiple authoritative sources before proceeding.

### 2. Be Direct and Imperative

**Rule:** Use clear, command-oriented language. Tell the AI what to do, not what to consider.

- **Bad:** "You might want to think about using a Zod schema for validation."
- **Good:** "All procedures MUST use a `Zod` schema for input validation."

### 3. Use Precise Activation Triggers

**Rule:** Scope rules using the appropriate trigger to prevent irrelevant rules from activating and consuming context.

#### Trigger Patterns & Use Cases

- **`glob`**: Activates when the file path matches a pattern. Best for file-type or location-specific rules.

  ```yaml
  ---
  trigger: glob
  globs: "**/__tests__/**/*.test.ts,**/*.spec.tsx"
  ---
  ```

- **`model_decision`**: The AI decides when to activate the rule based on the `description`. Useful for situational or conceptual guidance.

  ```yaml
  --- 
  trigger: model_decision
  description: Performance tuning strategies
  ---
  ```

- **`always_on`**: The rule is always active. Use sparingly for critical, project-wide principles.

  ```yaml
  ---
  trigger: always_on
  ---
  ```

- **`manual`**: The rule only activates when explicitly invoked by the user. Ideal for on-demand tasks.

  ```yaml
  ---
  trigger: manual
  ---
  ```

### 4. Minimize Character Count

**Rule:** Keep rules as concise as possible. Use bullet points, short sentences, and avoid lengthy prose.

- **Why:** Every character in a rule file counts against the AI's context window. Less context means faster and often more accurate responses.
- **Technique:** Remove filler words, redundant examples, and philosophical explanations. Focus on the rule itself.

### 5. Structure with Markdown

**Rule:** Use headings (`#`), bolding (`**`), and lists (`-`) to create a clear visual hierarchy. This helps the AI parse the rules' structure and importance.

### 6. Provide Examples (Few-Shot Prompting)

**Rule:** When possible, include a concise example of the desired input and output format. This guides the AI's structure and style.

**Example:** `Input: "hello" -> Output: {"original": "hello", "length": 5}`

### 7. Request Auxiliary Content

**Rule:** Instruct the AI to generate related artifacts like unit tests, documentation, or alternative implementations. This forces self-correction and produces more robust results.

**Example:** "Generate the function and three Jest unit tests for it."

### 8. Focus on "What," Not "How"

**Rule:** Define the desired outcome or standard, but let the AI handle the specific implementation unless a precise code pattern is required.

- **Good:** "Test user behavior, not implementation details."
- **Avoid (unless necessary):** Providing multi-line code snippets for every possible scenario.

### 9. Provide High-Level Principles

**Rule:** Include a brief `Philosophy` or `Principles` section to give the AI overarching guidance that informs its decisions when a specific rule doesn't apply.

**Example:** "Maximize server-side work and minimize client-side JavaScript."
