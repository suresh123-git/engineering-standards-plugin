# Runbook: <Alert / failure mode>

- **Service / owner**: 
- **Severity**: 
- **Last reviewed**: YYYY-MM-DD

## Symptoms and impact

What users/systems experience; how this alert fires; related dashboards (link).

## Quick diagnosis

1. Check <dashboard/metric> — expected vs abnormal.
2. Check recent deploys / flag changes / config changes.
3. Check dependencies (DB, queue, third parties): status and saturation.
4. Query logs: `<query>` with correlation id.

## Mitigation

| Situation | Action | Risk |
|---|---|---|
| Bad deploy | Roll back to previous version: `<command>` | Check DB compatibility |
| Dependency down | Enable degraded mode / flag `<name>` | |
| Overload | Scale out / shed load / raise limits | Cost |

## Escalation

Who to page next, when, and how (team, on-call rotation, vendor support).

## Resolution and follow-up

Confirm recovery metrics; communicate; open post-incident review (see incident template).
