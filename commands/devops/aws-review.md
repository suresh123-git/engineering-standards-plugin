---
name: aws-review
description: Review AWS infrastructure (IaC, configs, IAM, networking, data stores) against the Well-Architected pillars with prioritised, actionable findings.
category: devops
version: 1.0.0
mode: read-only
argument-hint: "<terraform dir | cloudformation/cdk templates | architecture description>"
standards:
  - global/project-discovery
  - global/safety-rules
  - global/review-findings
  - devops/containers-and-iac
  - devops/production-readiness
  - security/secrets-management
skills:
  - secure-coding
  - performance-engineering
---

# /aws-review

## Purpose

Assess AWS infrastructure defined in IaC (Terraform, CloudFormation, CDK, SAM, Serverless) or described by the user against the Well-Architected pillars: security, reliability, performance efficiency, cost optimisation, operational excellence and sustainability. **It inspects code and configs; it does not change cloud resources.**

## Expected Input

IaC directory/files, or a written description (services, accounts, regions, traffic). Provide the environment (dev/stage/prod) if findings should be weighted.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Detect IaC tool and structure (modules, environments/workspaces, state backend, naming/tagging conventions).
- Build a **resource inventory**: compute (EC2/ECS/EKS/Lambda), data (RDS/Aurora/DynamoDB/S3/ElastiCache), messaging (SQS/SNS/Kinesis/MSK), network (VPC/subnets/SGs/ALB/API GW/CloudFront), identity (IAM roles/policies), observability.
- Load `stack-aws`, `stack-terraform`, `stack-cloudformation` skills as applicable.
- Check if AWS CLI/MCP access to a real account exists; **do not use it to mutate anything**.

## Applicable Standards

- [Containers and IaC](../../standards/devops/containers-and-iac.md) (AWS general, Terraform, CloudFormation)
- [Production readiness](../../standards/devops/production-readiness.md), [secrets management](../../standards/security/secrets-management.md)
- [Findings format](../../standards/global/review-findings.md)

## Execution Steps

1. Inventory resources and draw a Mermaid architecture diagram of what the code defines.
2. **Security**: IAM (wildcards, `iam:PassRole`, over-broad trust policies, user vs role, no MFA/conditions), security groups (`0.0.0.0/0` on admin/data ports), public S3/RDS/OpenSearch, encryption at rest (KMS) and in transit, secrets in plaintext/env/state, VPC endpoints, WAF, CloudTrail/Config/GuardDuty, Block Public Access, IMDSv2.
3. **Reliability**: multi-AZ, backups/PITR and restore tests, autoscaling, health checks, deletion protection, `DeletionPolicy`/`prevent_destroy`, DLQs, retries/timeouts, single points of failure, quotas, DR (RPO/RTO).
4. **Performance**: right-sizing, instance families, DB/parameter settings, caching (CloudFront/ElastiCache), connection management (RDS Proxy), Lambda memory/concurrency/cold starts, throughput limits (DynamoDB capacity, Kinesis shards, SQS).
5. **Cost**: idle/over-provisioned resources, NAT gateway egress, data transfer, storage classes/lifecycle policies, Savings Plans/Spot fit, log retention, tagging for allocation, budgets/alerts.
6. **Operational excellence**: IaC drift handling, tagging, naming, environments separation, observability (logs/metrics/alarms/dashboards), deployment safety, runbooks.
7. **Sustainability** (brief): right-sizing, managed/serverless where suitable, region choice.
8. Check IaC practices: state security, module versioning, change-set/plan review, no hard-coded ARNs/account IDs/secrets, parameterisation.
9. Rank findings (Critical = publicly exposed data, admin-wide access, no backups on prod data) with fix snippets in the project's IaC dialect and verification commands (read-only CLI).

## Output Format

Shared findings format (category: infrastructure, plus **Pillar** and **AWS service**), architecture diagram, pillar scorecard, and a prioritised remediation plan noting which changes cause **resource replacement/downtime**.

## Safety Constraints

- Read-only. **No `terraform apply/destroy`, `aws ... create/update/delete`, or stack operations.** `terraform plan`/`validate` only with explicit permission and never with prod credentials.
- Do not print account IDs/keys/secrets; use placeholders. Changes to production infrastructure require explicit approval and a reviewed plan.
- Be explicit about service limits and pricing claims; verify against current AWS documentation instead of memory.

## Examples

```
/aws-review infra/terraform
/aws-review template.yaml — SAM API with DynamoDB and SQS
/aws-review ECS Fargate + RDS + ALB design for prod, ~500 rps
```
