---
name: "stack-cloudformation"
description: "Use in projects with AWS CloudFormation, SAM or CDK-synthesised templates to review parameters, resource policies, deletion/update behaviour, change sets, drift, nested stacks and security."
---
# CloudFormation

## Detect

Templates with `AWSTemplateFormatVersion` or `Transform: AWS::Serverless-2016-10-31`, `template.yaml/json`, `samconfig.toml`, `cdk.out/`, `aws cloudformation` / `sam deploy` / `cdk deploy` in scripts or CI.

## Review focus

- **Parameters & config**: types and `AllowedValues`/`AllowedPattern`/`ConstraintDescription`; sensitive parameters `NoEcho: true` **and** prefer dynamic references (`{{resolve:secretsmanager:...}}`, `{{resolve:ssm-secure:...}}`) — NoEcho values still appear in some places; use `Mappings`/`Conditions` sparingly and readably; environment separation by account/stack.
- **Resource safety**: `DeletionPolicy`/`UpdateReplacePolicy: Retain|Snapshot` on databases, buckets, KMS keys, log groups with data; RDS `DeletionProtection`; know which property changes cause **Replacement** (check the resource docs' "Update requires") before changing; avoid hard-coded physical names that block replacement; stack policies for critical resources.
- **Security**: IAM least privilege (scoped `Resource`, conditions, no `*:*`), roles over users, `AssumeRolePolicyDocument` trust scoped, encryption (KMS/SSE) enabled, S3 `PublicAccessBlockConfiguration`, security groups tight, no secrets in `Environment` literals/Outputs, Outputs don't leak sensitive values; scan with `cfn-lint`, `cfn-guard`/`cfn_nag`/`checkov`.
- **Change management**: always **create and review a change set** (`--no-execute-changeset`) before applying; rollback configuration and alarms (`RollbackConfiguration`); `UpdatePolicy` for ASG/Lambda aliases (CodeDeploy hooks); detect drift regularly; avoid manual console edits; handle `UPDATE_ROLLBACK_FAILED` runbook knowledge.
- **Structure**: nested stacks/modules for reuse and the 500-resource/size limits; cross-stack references via `Export/ImportValue` create tight coupling (prefer SSM parameters or nested stacks, understand export deletion constraints); avoid circular `DependsOn`; use `!Ref`/`!GetAtt` for implicit dependencies; consistent tags.
- **SAM specifics**: `Globals` defaults; function memory/timeout/concurrency; event source `BatchSize`/`FunctionResponseTypes: ReportBatchItemFailures`; DLQ/OnFailure destinations; API auth (`Auth:` defaults) so no accidental open endpoints; `AutoPublishAlias` + deployment preferences (Canary/Linear).
- **CDK**: constructs levels, `removalPolicy`, aspects/cdk-nag for guardrails, avoid environment-agnostic stacks needing lookups, review synthesised template and `cdk diff`.
- **Operations**: stack outputs documented; tagging; log retention for Lambda/ECS log groups (default never expires); alarms defined with resources.

## Implementation conventions

Follow the project's tool (raw CFN vs SAM vs CDK) — don't mix styles within a stack; YAML with short-form intrinsics consistent with the repo; parameterise per environment via parameter files/`samconfig`; validate with `cfn-lint` before committing.

## Testing conventions

`cfn-lint`, `cfn-guard`, `sam validate --lint`, CDK assertions tests (`Template.fromStack`), deploy to a sandbox account for integration tests.

## Safety

Do not create, update or delete stacks or change sets against shared/production accounts without explicit approval; analysis stays read-only ([safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md)).

## Pitfalls

Missing retain policies on data stores; unnoticed replacement of stateful resources; secrets in parameters/outputs; hard-coded names/ARNs/account ids; cross-stack exports blocking updates; skipping change-set review; unbounded log retention.
