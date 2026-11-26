---
description: "Audit dependency risks — vulnerabilities, abandonment, licences, bloat and update strategy — with reachability-based triage and an upgrade plan."
argument-hint: "<repo | package | specific dependency>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /dependencies

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Establish what the project depends on, which of it is risky or unnecessary, and how to reduce the risk safely. Covers known vulnerabilities, EOL/abandoned packages, licence conflicts, supply-chain red flags, version drift, duplicates and unused packages.

## Expected Input

The repository (default), a workspace package in a monorepo, or one dependency to evaluate ("should we adopt X?"). 

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Identify every manifest and lockfile (monorepo workspaces, Dockerfiles with OS packages, CI action versions, Terraform providers, Helm charts).
- Determine the package manager and whether a lockfile is committed and in sync.
- Find existing automation: Dependabot/Renovate config, audit scripts, SBOM generation, `.npmrc`/registry settings, licence policy.

## Applicable Standards

- [Dependency and supply-chain security](${CLAUDE_PLUGIN_ROOT}/standards/security/dependency-security.md) — procedure, risk signals, output table
- [Secrets management](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md) for registry tokens
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. **Inventory** direct vs transitive, runtime vs dev; capture versions and ranges.
2. **Vulnerabilities**: run the ecosystem audit tool if available (`npm audit --omit=dev`, `pnpm audit`, `pip-audit`, `osv-scanner`, `trivy fs`); if not runnable, say so and analyse manifests against known-risk signals. Do **not** auto-fix.
3. **Triage by reachability**: is the vulnerable API used? Is untrusted input able to reach it? Runtime or dev-only? Document reasoning; do not just forward CVSS.
4. **Health & supply chain**: last release, maintainers, archived repos, install scripts, typosquat-like names, git/URL dependencies, unpinned CI actions.
5. **Licences**: list non-permissive or unknown licences against the project's distribution model.
6. **Hygiene**: unused (use `depcheck`/`knip` if present), duplicates/multiple versions, heavy packages replaceable by platform features, wrong dependency type.
7. **Upgrade plan**: group updates (patch/minor safe; majors planned), order, breaking-change notes (read changelogs), required code changes, test strategy. Provide commands for the **detected package manager**.
8. **Process recommendations**: lockfile policy, Renovate/Dependabot config, CI audit gate, SBOM, provenance.

## Output Format

```
## Summary (counts by severity, top 3 actions)
## Vulnerability triage table (package | current → fixed | severity | reachable? | action)
## Supply-chain & health risks
## Licence issues
## Unused / duplicate / heavy packages
## Upgrade plan (ordered; commands; risk of each)
## Process improvements
```
Findings use the shared format when a dependency issue is individually actionable.

## Safety Constraints

- Read-only analysis. **Do not install, upgrade, remove or run lifecycle scripts**; propose commands instead. Do not rewrite lockfiles.
- Do not disclose registry tokens found in `.npmrc` etc.
- Adding a new dependency recommendation requires justification (need, alternatives, maintenance, licence, size).

## Examples

```
/dependencies
/dependencies packages/api
/dependencies evaluate replacing moment with date-fns
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
