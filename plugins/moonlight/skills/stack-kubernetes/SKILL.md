---
name: "stack-kubernetes"
description: "Use when a project has Kubernetes manifests, Helm charts or Kustomize overlays to review workload configuration, security context, resources, probes, networking, RBAC, rollout safety and GitOps practices."
---
# Kubernetes

## Detect

`k8s/`, `deploy/`, `manifests/`, `charts/` (Helm `Chart.yaml`, `values.yaml`), `kustomization.yaml`, Argo CD/Flux files, `apiVersion:`/`kind:` YAML, `kubectl`/`helm` in CI.

## Review focus

- **Workloads**: Deployments for stateless, StatefulSets for stateful (with PVC retention understood), Jobs/CronJobs (`concurrencyPolicy`, `backoffLimit`, `ttlSecondsAfterFinished`); `replicas ≥ 2` for availability; rolling update (`maxUnavailable`/`maxSurge`) tuned.
- **Resources**: CPU/memory **requests and limits** set sensibly (memory limit ≈ request to avoid OOM surprises; be careful with CPU limits causing throttling); HPA on meaningful metrics; VPA/right-sizing; QoS class awareness; JVM/Node memory flags aligned with limits.
- **Probes & lifecycle**: `startupProbe` for slow boots, `readinessProbe` reflects ability to serve (dependencies), `livenessProbe` conservative (no dependency checks, avoid restart storms); `terminationGracePeriodSeconds` ≥ shutdown time, `preStop` hook/sleep for LB deregistration; app handles `SIGTERM`.
- **Security**: `securityContext` (`runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, drop `ALL` capabilities, `seccompProfile: RuntimeDefault`); no `privileged`/hostPath/hostNetwork; Pod Security Standards (restricted); images by digest from trusted registries, `imagePullPolicy` appropriate; no secrets in env literals/ConfigMaps — use Secrets with encryption at rest + External Secrets/CSI; dedicated **ServiceAccounts**, `automountServiceAccountToken: false` when unused; **RBAC least privilege** (no `cluster-admin` bindings for apps, no wildcards).
- **Networking**: Services/Ingress correct ports and TLS; **NetworkPolicies default-deny** + explicit allows; no unnecessary `LoadBalancer`/`NodePort` exposure; DNS/`ndots` awareness; mTLS/service mesh policies if used.
- **Resilience**: PodDisruptionBudgets; topology spread/anti-affinity across zones/nodes; priority classes; node selectors/taints tolerations deliberate; graceful draining; resource quotas/limit ranges per namespace.
- **Config**: ConfigMaps immutable/versioned with rollout on change (checksum annotations); env separation via overlays/values; no environment drift; labels (`app.kubernetes.io/*`) consistent; namespaces per env/team.
- **Helm/Kustomize**: values documented, templates not over-parameterised, `helm lint/template` + `kubeconform`/`kubeval` + policy checks (Kyverno/OPA/Conftest) in CI; chart/app versions pinned; no secrets in values files.
- **GitOps/delivery**: declarative source of truth; Argo/Flux sync policies (prune, self-heal) understood; progressive delivery (Argo Rollouts/Flagger); rollback = revert commit; no manual `kubectl apply` to prod.
- **Observability**: Prometheus scrape annotations/ServiceMonitor, structured logs to stdout, resource and rollout alerts.

## Implementation conventions

Match existing manifest style/tooling; add probes/resources/securityContext rather than rewriting structure; validate with `kubectl apply --dry-run=client`/`server` (non-prod) and schema validators; never target production clusters from analysis tasks.

## Pitfalls

No limits/requests; liveness probe checking the database; running as root; `latest` image tags; missing PDB with single replica; secrets committed in values; permissive RBAC; CPU limits throttling latency-sensitive pods; no graceful shutdown causing 5xx on deploy.
