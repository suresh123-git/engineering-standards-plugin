---
name: stack-kafka
description: Use in projects using Apache Kafka (kafkajs, confluent clients, Spring Kafka, MSK) to review producers, consumers, partitioning and ordering, delivery semantics, schemas, retries/DLQ and operations.
version: 1.0.0
category: stack
---

# Apache Kafka

## Detect

`kafkajs`, `@confluentinc/kafka-javascript`, `node-rdkafka`, `@nestjs/microservices` (Kafka transport), Spring Kafka, Kafka Streams/ksqlDB, schema registry config, MSK/Confluent in IaC, `docker-compose` kafka/zookeeper/kraft.

## Review focus

- **Topic design**: topics per domain event type/stream; naming convention; partition count sized for target consumer parallelism (hard to reduce later); replication factor ≥ 3 and `min.insync.replicas` 2 in production; retention vs compaction (compacted for latest-state topics); keys chosen to preserve **per-entity ordering** and distribute load (avoid hot keys).
- **Producers**: `acks=all`, idempotent producer enabled (`enable.idempotence`), retries with backoff, `delivery.timeout`, batching/compression (`linger.ms`, `compression.type`), serialisation with schema (Avro/Protobuf/JSON Schema) + **schema registry** compatibility mode; **transactional outbox** to publish reliably from DB changes; no fire-and-forget on critical events.
- **Consumers**: consumer group per logical service; **at-least-once** by default → handlers **idempotent** (dedupe by event id/natural key, upserts); commit offsets **after** processing (manual commit/`eachMessage` semantics), not before; bounded concurrency; `max.poll.interval.ms` vs processing time (avoid rebalances); cooperative rebalancing; graceful shutdown (disconnect/commit); cap batch sizes.
- **Error handling**: classify transient vs poison messages; retry topics with backoff and a **dead-letter topic** carrying original headers + error; never block a partition indefinitely on a poison message without an alert; monitor DLQ depth.
- **Ordering & delivery semantics**: ordering only within a partition; exactly-once only within Kafka transactions/streams (not for external side effects); design side effects to be idempotent.
- **Schema evolution**: backward/forward-compatible changes only; envelope with `eventId`, `type`, `version`, `occurredAt`, `correlationId`; consumers tolerant of unknown fields; event contracts owned and versioned (see the `stack-microservices` skill for contract ownership).
- **Security**: TLS + SASL/IAM authentication, ACLs per principal (least privilege per topic/group), no PII in keys/headers unless intended, encryption at rest, secrets management.
- **Operations/observability**: consumer lag per group/partition (alert on lag growth/age), under-replicated partitions, request latency, rebalance rate, DLQ rates; capacity planning (throughput, retention × size); topic provisioning as code.
- **Testing**: Testcontainers Kafka/Redpanda; test duplicate and out-of-order delivery, rebalance during processing, poison message → DLQ, schema compatibility checks in CI.

## Implementation conventions

Wrap the client behind a messaging port (publisher/subscriber interfaces) so domain code isn't coupled to Kafka ([hexagonal architecture](../../../standards/architecture/hexagonal-architecture.md)); central config for brokers/auth; typed event classes + validation on consume.

## Pitfalls

Committing offsets before processing (data loss) or never (duplicates); assuming exactly-once end-to-end; too few partitions to scale; random keys breaking ordering; unbounded retries blocking partitions; breaking schema changes; consuming with long handlers causing rebalance storms.
