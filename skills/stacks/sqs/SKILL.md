---
name: stack-sqs
description: Use in projects using Amazon SQS (and SNS fan-out) to review queue configuration, visibility timeouts, redrive/DLQ, standard vs FIFO semantics, idempotent consumers, batching, IAM and monitoring.
version: 1.0.0
category: stack
---

# Amazon SQS (with SNS)

## Detect

`@aws-sdk/client-sqs`, `@aws-sdk/client-sns`, `sqs-consumer`, `@ssut/nestjs-sqs`, Lambda event source mappings, `AWS::SQS::Queue`/`aws_sqs_queue` in IaC, `.fifo` queue names.

## Review focus

- **Queue type**: Standard (at-least-once, best-effort ordering, near-unlimited throughput) vs FIFO (ordering per `MessageGroupId`, exactly-once processing via dedup within 5 min, throughput limits/high-throughput mode). Choose by need; **consumers must be idempotent in both**.
- **Visibility timeout**: ≥ max processing time (AWS guidance: also ≥ 6× Lambda function timeout for Lambda consumers); extend (`ChangeMessageVisibility`) for long jobs; heartbeats; avoid duplicate processing from timeouts too short.
- **Redrive/DLQ**: every queue has a DLQ with `maxReceiveCount` (e.g., 3–5); DLQ retention longer than source (messages keep original enqueue time); **alarm on DLQ depth > 0**; documented redrive procedure (DLQ redrive to source); FIFO DLQ must be FIFO.
- **Consumption**: long polling (`WaitTimeSeconds` 20) to cut cost/empty receives; batch receive/delete (up to 10); **delete only after success**; partial batch failure handling (`ReportBatchItemFailures` for Lambda; otherwise delete successes individually); bounded concurrency; graceful shutdown.
- **Producing**: batch sends; message size limit 256 KiB (use S3 pointer / extended client for large payloads); `DelaySeconds`/message timers where needed; FIFO `MessageDeduplicationId`/`MessageGroupId` design (group id too coarse limits parallelism); structured attributes for routing/tracing; outbox for DB-then-publish reliability.
- **SNS fan-out**: SNS → multiple SQS queues for pub/sub; subscription filter policies; raw message delivery decision; queue policies allowing only the SNS topic ARN; DLQ for subscriptions.
- **Retention & limits**: retention period set (default 4 days, max 14); queue/Lambda concurrency controls (`maximum concurrency`) to protect downstreams; in-flight limits (120k standard).
- **Security**: SSE (SQS-managed or KMS) enabled; least-privilege IAM (`sqs:SendMessage` / `ReceiveMessage` / `DeleteMessage` scoped to ARN); queue policies not public (`Principal: *` without conditions); VPC endpoints; no PII in message attributes unnecessarily.
- **Observability**: `ApproximateAgeOfOldestMessage`, `ApproximateNumberOfMessagesVisible`, DLQ depth, `NumberOfMessagesDeleted` vs received, consumer error rate; trace-id propagation in attributes ([observability](../../../standards/devops/observability.md)).
- **Testing**: LocalStack/ElasticMQ or a real sandbox queue; test duplicate delivery, visibility expiry, poison → DLQ, partial batch failure.

## Implementation conventions

Message envelope (`id`, `type`, `version`, `occurredAt`, `correlationId`, payload) validated on consume; wrap SQS behind a port; define queues/DLQs/policies in IaC ([Terraform/CloudFormation](../../../standards/devops/containers-and-iac.md)).

## Pitfalls

Deleting messages before work finishes; visibility timeout shorter than processing; no DLQ (poison loops forever); assuming order in Standard queues; FIFO with a single message group serialising everything; unbounded Lambda concurrency overwhelming a database; ignoring 256 KiB limit.
