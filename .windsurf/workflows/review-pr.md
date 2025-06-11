---
description: Review a Pull Request
---

# Review Pull Request Workflow

This workflow assists in reviewing a GitHub Pull Request.

1.  Ask for the Pull Request number or URL.
2.  Checkout the PR branch: `gh pr checkout [pr-number]`
3.  Fetch PR details and comments using the GitHub CLI: `gh pr view [pr-number] --comments`
4.  For each comment, analyze the suggested change in the context of the file.
5.  If you can implement the change, do so.
6.  If the change is unclear or requires more context, ask for clarification.
7.  After processing all comments, summarize the changes made and which comments still require attention.
