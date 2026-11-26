---
name: project-awareness
description: Always-on rule to inspect the project's stack, conventions and architecture before acting, and to respect them instead of imposing new ones.
scope: always
globs: []
version: 1.0.0
---

# Project Awareness

- Before non-trivial work, identify language, framework, package manager, structure, conventions (lint/format), architecture, test setup and data stores from the repository itself.
- **Respect existing conventions** unless they cause a concrete problem; then explain the problem.
- Do not assume or force an architecture, framework or pattern the project doesn't use.
- Reuse existing utilities, libraries and patterns; do not duplicate them; add dependencies only when clearly justified.
- Use the project's package manager and scripts for every command.
- Apply stack-specific guidance (`stack-*` skills) only for technologies actually present.
- Ask for clarification only when a requirement is genuinely ambiguous and the answer changes the design.

Details: [project discovery](../../standards/global/project-discovery.md)
