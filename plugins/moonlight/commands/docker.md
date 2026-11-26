---
disable-model-invocation: true
description: "Review Dockerfiles, compose files and image build practices for security, size, build speed and runtime correctness."
argument-hint: "<Dockerfile | compose file | directory>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /docker

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Audit container build and runtime configuration: image security, secrets, layer/caching efficiency, image size, reproducibility, process/signal handling and compose setups. Reports prioritised findings with corrected snippets.

## Expected Input

A Dockerfile, compose file(s), or a directory. Optionally the runtime (Node/JVM/Python), target platform (ECS/Kubernetes/local) and build context size.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Locate all Dockerfiles, `.dockerignore`, compose files, build scripts and CI image build steps.
- Read the app's start command, ports, health endpoints, env vars, build outputs and package manager to validate what the image should contain.
- Load `stack-docker` skill.

## Applicable Standards

- [Containers and IaC](${CLAUDE_PLUGIN_ROOT}/standards/devops/containers-and-iac.md) — Dockerfile section
- [Secrets management](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. **Base image**: pinned version (and digest for prod), official/minimal (slim/distroless/alpine caveats for glibc/native deps), maintained, matching runtime version in project.
2. **Security**: non-root `USER`, no secrets in `ARG`/`ENV`/layers/`COPY .env`, no `curl | sh`, minimal packages, no SSH keys, `--no-install-recommends`, read-only root FS and dropped capabilities guidance, no `privileged`/host mounts in compose.
3. **Build quality**: multi-stage; deps layer cached before source copy; lockfile-based installs (`npm ci --omit=dev`); `.dockerignore` excludes `.git`, `node_modules`, tests, `.env`; clean caches in the same `RUN`; BuildKit cache/secret mounts; deterministic builds.
4. **Runtime**: exec-form `CMD`/`ENTRYPOINT`, proper signal handling (init/tini; Node as PID 1 caveats), `EXPOSE` accuracy, `HEALTHCHECK` or orchestrator probes, `WORKDIR`, `NODE_ENV=production`, memory flags (e.g. `--max-old-space-size` vs container limits), timezone/locale if relevant.
5. **Compose**: service dependencies with health conditions, networks/ports exposure (bind to localhost for dev DBs), volume usage, resource limits, env handling via files/secrets, separate dev vs prod overrides, restart policy.
6. **Size & speed**: estimate image size drivers; recommend slimming steps; build-time improvements.
7. **Supply chain**: image scanning (Trivy/Grype), SBOM, provenance, registry policy, rebuild cadence for patched bases.
8. Provide a **corrected Dockerfile** only for the parts that change (diff-style).

## Output Format

Shared findings format (category: infrastructure) with corrected snippets; summary table (area | status); top 5 quick wins; optional "target Dockerfile" at the end.

## Safety Constraints

- Read-only; do not build images, push to registries, or run containers unless asked and local.
- Never print secrets found in files, env or history; report location only.
- Don't switch base-image families (e.g., to Alpine) without noting native-dependency risks.

## Examples

```
/docker
/docker apps/api/Dockerfile
/docker docker-compose.yml — local dev vs prod differences
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
