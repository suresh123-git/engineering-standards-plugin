---
name: stack-docker
description: Use when a project has Dockerfiles or docker-compose files to apply image build, security, caching, runtime and local-development best practices.
version: 1.0.0
category: stack
---

# Docker

## Detect

`Dockerfile*`, `.dockerignore`, `docker-compose*.yml`/`compose.yaml`, `docker build/run` in scripts or CI, `devcontainer.json`.

## Review focus

Apply the full checklist in [containers and IaC](../../../standards/devops/containers-and-iac.md) (Dockerfiles section) and [secrets](../../../standards/security/secrets-management.md). Highlights to verify in the actual files:

- **Base image**: pinned tag (+digest for prod), minimal and maintained; version matches the project's runtime (`engines`, `.nvmrc`); Alpine/musl caveats for native modules (glibc-based slim is safer for many Node/Python builds).
- **Multi-stage** build: build tools and dev dependencies only in the builder stage; final stage copies artefacts; `npm ci --omit=dev`/`pip install --no-cache-dir`; correct `NODE_ENV`.
- **Layer cache**: manifest/lockfile copied and installed before source; BuildKit cache mounts; `.dockerignore` present and effective (excludes `.git`, `node_modules`, `.env*`, build outputs, tests).
- **Security**: non-root `USER` with proper ownership (`--chown`), no secrets in layers/ARG/ENV (use `--mount=type=secret`), no `latest`, no `ADD` from URLs, healthcheck/probes, drop capabilities, read-only FS where possible, image scanning in CI.
- **Runtime**: exec-form `CMD`; PID 1 signal handling (`--init`/tini, or app handles `SIGTERM`); graceful shutdown; memory limits aligned with runtime flags; logs to stdout/stderr; one process per container; deterministic start (migrations as separate job).
- **Compose (local/dev)**: `depends_on` with `condition: service_healthy`; named volumes for data; ports bound to `127.0.0.1` for databases; env via `.env`/`env_file` not committed secrets; profiles for optional services; dev override files; resource limits when needed.
- **Reproducibility**: same image across environments; build args limited to non-sensitive; labels (`org.opencontainers.image.*`); SBOM/provenance when required.

## Implementation conventions

Follow the existing Dockerfile style; prefer small diffs that improve security/cache without changing the runtime contract (ports, entrypoint, env vars); document build/run commands in README; add `hadolint` to CI if absent (suggest, don't force).

## Testing conventions

Build in CI; run container smoke tests (`/health`), container-structure-tests, Trivy/Grype scans; test that the container runs as non-root and shuts down within the orchestrator's grace period.

## Pitfalls

Running as root; secrets in image history; copying `node_modules` from host; cache-busting `COPY . .` before install; `latest` tags; shell-form `CMD` swallowing signals; images bloated with build tools; exposing DB ports publicly in compose.
