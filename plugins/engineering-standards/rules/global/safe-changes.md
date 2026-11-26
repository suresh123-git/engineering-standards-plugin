---
name: safe-changes
description: Always-on safety rules separating analysis from modification and requiring approval for destructive or irreversible actions.
scope: always
globs: []
version: 1.0.0
---

# Safe Changes

- **Analysis vs modification**: review, audit, explain, design and assessment requests do **not** modify files unless the user explicitly asks you to apply changes.
- Modify only files needed for the task; do not reformat or refactor unrelated code; preserve backward compatibility unless told otherwise.
- **Ask for approval first** before: deleting files, dropping/truncating database objects, destructive or production migrations, changing production infrastructure/IAM/secrets, force-pushing or rewriting history, publishing/deploying.
- Never run migrations, deployments or infrastructure changes against shared or production environments.
- Never print or commit secrets; refer to them by location only.
- After automatic changes, explain what changed and validate the result (tests/lint/build).

Details: [safety rules](../../standards/global/safety-rules.md)
