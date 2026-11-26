---
disable-model-invocation: true
name: "stack-rabbitmq"
description: "Use in projects using RabbitMQ (amqplib, amqp-connection-manager, Spring AMQP, NestJS RMQ) to review exchanges/queues topology, acknowledgements, prefetch, retries/DLX, durability and connection resilience."
---
# RabbitMQ

## Detect

`amqplib`, `amqp-connection-manager`, `@golevelup/nestjs-rabbitmq`, `@nestjs/microservices` (RMQ), Spring AMQP, `rabbitmq` in docker-compose/IaC (Amazon MQ), definitions JSON.

## Review focus

- **Topology**: exchange types fit use (direct/topic/fanout/headers); queues per consumer service; consistent naming; topology declared idempotently (assert) from one owner or via definitions-as-code; avoid default-exchange coupling to queue names for multi-consumer patterns.
- **Durability**: durable exchanges/queues, **persistent messages** (`deliveryMode: 2`) for important data, **publisher confirms** for critical publishes (don't fire-and-forget), mandatory flag/return handling for unroutable messages; quorum queues for HA in production (classic mirrored queues deprecated).
- **Consumers**: **manual acknowledgements** after successful processing; `prefetch` (QoS) tuned (start low, e.g., 10–50) to prevent one consumer hoarding messages and memory growth; `nack/reject` with `requeue=false` for poison messages; idempotent handlers (redelivery happens: at-least-once).
- **Retries & DLX**: dead-letter exchange per queue; delayed retry via TTL queues or delayed-message plugin with capped attempts and backoff; count attempts (`x-death`/custom header); DLQ monitoring and replay procedure; avoid infinite requeue loops.
- **Message design**: versioned schema, `messageId`, `correlationId`, `timestamp`, `type` headers; size limits; content-type; no PII beyond need; validation on consume.
- **Connections/channels**: one connection per process, channel per consumer/publisher (channels aren't thread-safe for concurrent publish in some clients); handle `connection.on('error'|'close')` with reconnect + topology re-assertion; heartbeats set; backpressure via `drain`/confirm channel.
- **Ordering**: only guaranteed per queue with a single consumer and no requeue; document when ordering matters.
- **Security**: TLS, per-service users with vhost-scoped permissions, no default `guest` account, management UI not public, secrets via manager.
- **Observability/ops**: queue depth/age, unacked count, consumer count, publish/ack rates, memory/disk alarms, DLQ size alerts; limits (`x-max-length`, TTL) to protect broker.
- **Testing**: Testcontainers RabbitMQ; tests for redelivery, nack→DLQ, publisher confirm failure, reconnect.

## Implementation conventions

Hide the broker behind publisher/consumer ports; centralise exchange/queue names and bindings in config; graceful shutdown (cancel consumers, wait for in-flight acks, then close channel/connection).

## Pitfalls

Auto-ack consumers losing messages; unlimited prefetch; requeue loops on poison messages; non-durable queues with persistent messages (lost on restart); publishing without confirms; one channel shared across threads; topology drift between environments.
