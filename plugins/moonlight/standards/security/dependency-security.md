---
title: Dependency and Supply-Chain Security
version: 1.0.0
---

# Dependency and Supply-Chain Security

## Assessment procedure (`/dependencies`)

1. Inventory direct and transitive dependencies from manifests and lockfiles (detect the package manager first).
2. Run the ecosystem's audit tooling **if available offline/online and permitted**: `npm audit` / `pnpm audit` / `yarn npm audit`, `pip-audit`, `osv-scanner`, `mvn dependency-check`, `govulncheck`, `cargo audit`, `trivy fs`, GitHub Dependabot alerts. If tools cannot run, analyse manifests manually and say that results are unverified.
3. Triage each advisory by **reachability and exposure**: is the vulnerable function used? Is it runtime or dev-only? Is untrusted input able to reach it? Severity (CVSS) is a starting point, not the answer.
4. Evaluate health: last release, maintainers, open security issues, download trends, licence, install scripts, size.
5. Identify unused, duplicated and overlapping packages; heavy packages replaceable by platform features.
6. Check version policy: lockfile committed; ranges (`^`, `~`, `*`, `latest`) appropriate; engine/runtime EOL status; major versions behind.

## Risk signals

- Known critical/high CVEs in runtime dependencies; EOL frameworks/runtimes.
- Abandoned packages (no releases > 2 years, archived repo); single-maintainer critical packages.
- Typosquatting-looking names; recently transferred ownership; unexpected `postinstall` scripts; git/URL dependencies; unpinned GitHub Actions (`@main`, `@v1` instead of SHA for third-party).
- Licence conflicts (GPL/AGPL in proprietary distribution), missing licence.
- `*` or `latest` versions; lockfile missing or out of sync; multiple lockfiles.

## Practices to recommend

- Commit lockfiles; use `npm ci`/frozen installs in CI; pin and verify (integrity hashes).
- Automate updates (Dependabot/Renovate) with grouped, tested PRs; patch/minor weekly, major planned.
- Minimise dependencies; prefer platform APIs; vendor tiny utilities rather than adding packages for one function.
- Separate dev vs runtime deps; slim production images; SBOM (CycloneDX/SPDX) generation; signature/provenance verification (npm provenance, Sigstore).
- Disable install scripts for untrusted packages (`--ignore-scripts`) where feasible; use private registry/proxy with allow-listing.
- Include a documented process for emergency patching.

## Output

Table: package, current → fixed version, severity, reachability, action (upgrade/replace/remove/accept), effort, risk of upgrade (breaking changes). Never auto-upgrade majors without approval; propose commands, don't run mutating ones in audit mode.
