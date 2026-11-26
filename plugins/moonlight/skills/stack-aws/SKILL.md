---
name: "stack-aws"
description: "Use in projects deploying to or calling AWS (SDK, CDK/SAM, Lambda, ECS/EKS, RDS, S3, IAM) to review architecture and code against Well-Architected security, reliability, performance, cost and operations practices."
---
# AWS

## Detect

`@aws-sdk/*`/`aws-sdk`/`boto3`, `cdk.json`, `template.yaml` (SAM), `serverless.yml`, Terraform `aws` provider, `buildspec.yml`, ECS task definitions, Lambda handlers, `.aws/` config, region/account env vars.

## Review focus

- **IAM**: least privilege per role (resource-scoped ARNs, conditions), no wildcard `Action: *`/`Resource: *` without justification, roles not long-lived access keys, no `iam:PassRole` over-grants, trust policies scoped (external ID/OIDC subject conditions), permission boundaries/SCPs where org-managed, separate roles per workload.
- **Data protection**: S3 Block Public Access, bucket policies, versioning, SSE-KMS, lifecycle rules; RDS/Aurora encryption, Multi-AZ, backups + PITR, deletion protection, parameter groups, snapshots tested; DynamoDB PITR, capacity mode, hot partitions, TTL; secrets in Secrets Manager/SSM (not env plaintext in IaC).
- **Networking**: private subnets for compute/data, security groups least-open (no `0.0.0.0/0` for SSH/DB), VPC endpoints for S3/DynamoDB/ECR/etc., NAT cost awareness, ALB/WAF/CloudFront for public edge, TLS everywhere (ACM).
- **Compute**: Lambda (memory/timeout tuning, concurrency limits, cold starts, idempotency, DLQs/destinations, layers/size, VPC attach implications, SDK clients created outside handler); ECS/Fargate (task roles vs execution roles, health checks, autoscaling, secrets injection, log drivers); EKS (see `stack-kubernetes`); EC2 (IMDSv2, patching, ASGs).
- **SDK usage**: reuse clients; configure timeouts and retries (adaptive/standard modes); pagination handled (`NextToken`/paginators); credentials from the default provider chain (no hard-coded keys); region/endpoint config via env; error handling by exception name; presigned URL expiry short and scoped.
- **Reliability**: multi-AZ, health checks, backoff/jitter, DLQs, SQS/SNS decoupling, quotas awareness, backups/DR (RPO/RTO) strategy, deploy via blue/green or canary (CodeDeploy), CloudFormation/Terraform drift management.
- **Cost**: right-sizing, Graviton, Savings Plans/Spot fit, S3 storage classes, log retention, NAT/data-transfer costs, idle resources, tagging, budgets/anomaly alerts.
- **Observability & audit**: CloudWatch logs (retention) / metrics / alarms, structured logs, X-Ray/ADOT tracing, CloudTrail (org trail), Config rules, GuardDuty, Security Hub ([observability](${CLAUDE_PLUGIN_ROOT}/standards/devops/observability.md)).
- **IaC**: all resources in code; reviewed plans; tagging standards; modules; environment separation by account; no console drift ([containers and IaC](${CLAUDE_PLUGIN_ROOT}/standards/devops/containers-and-iac.md)).

## Implementation conventions

Follow the project's IaC tool and naming; configure via environment/parameters; keep AWS calls behind adapters for testability; prefer managed services consistent with existing stack; verify API and quota details in current AWS docs before asserting them.

## Testing conventions

LocalStack/moto for integration where acceptable; contract tests for IAM via policy simulation/Access Analyzer in CI; unit-test adapters with SDK mocks (`aws-sdk-client-mock`); never use real prod accounts in tests.

## Pitfalls

Over-broad IAM; public buckets; secrets in Lambda env plaintext; no timeouts on SDK calls; unbounded Lambda concurrency vs DB connections; single-AZ data stores; NAT gateway surprise bills; no deletion protection or backups on prod data.
