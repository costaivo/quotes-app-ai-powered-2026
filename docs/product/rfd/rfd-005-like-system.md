---
title: "Like system and concurrency handling"
filename: "rfd-005-like-system.md"
date: 2025-09-11
author: generated-by-ai
status: draft
rfd_number: 005
---

# Summary

Define the API surface and concurrency model for the `like_count` on quotes. This RFD requests decisions on whether likes use a dedicated endpoint, how to guarantee non-negative counts, and how to handle concurrent increments/decrements.

# Background & Context

The PRD requires a like counter constrained to never become negative. The implementation must consider race conditions when many clients increment likes concurrently and whether to expose a dedicated endpoint vs using `PATCH /quotes/{id}`.

# Scope

In-scope:
- Endpoint shape for likes (PATCH vs dedicated POST/DELETE)
- Database-level constraints and concurrency strategy (atomic DB increments, optimistic locking, or external counters)
- Rate-limiting/abuse considerations (basic recommendations)

Out-of-scope:
- Per-user like tracking and authentication

# Decision Being Requested

- Choose endpoint: `PATCH /quotes/{id}` vs `POST /quotes/{id}/like` (and `DELETE` for unlike if supported).
- Choose concurrency model: DB atomic operations vs optimistic locking vs external counter (Redis).

# Goals & Success Metrics

- Goal: Ensure like increments are correct under concurrency and `like_count` never drops below zero.
- Metric: Integration tests simulate concurrent increments and assert correctness; DB constraint prevents negative values.

# Constraints & Non-Goals

- Constraint: No per-user guarantees; likes are anonymous and simple.

# Options Considered

## Option A — Dedicated endpoint + DB atomic increment (recommended)
- Description: Provide `POST /quotes/{id}/like` which performs an atomic DB increment (e.g., `UPDATE quotes SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count`). Use DB constraint to prevent negative values.
- Pros: Simple, safe under concurrency, easy to reason about.
- Cons: No per-user semantics; unbounded increments unless rate-limited.

## Option B — Use `PATCH /quotes/{id}` with optimistic locking
- Description: Client reads current value and sends PATCH with new value; server uses optimistic locking to avoid lost updates.
- Pros: Flexible for multiple fields updates.
- Cons: More complex and error-prone under concurrent likes.

## Option C — External counter (Redis) with periodic sync
- Description: Use Redis for high-throughput increments and periodically persist to Postgres.
- Pros: High performance for heavy write loads.
- Cons: Operational complexity and eventual consistency; not necessary for MVP.

# Recommended Option

Recommend Option A: add `POST /quotes/{id}/like` that atomically increments `like_count` in Postgres. Use DB check constraint and transaction to ensure non-negative values. Add optional `POST /quotes/{id}/unlike` guarded to prevent negative counts.

# Implementation Plan

- Phase 1 (owner: Backend): Implement `POST /quotes/{id}/like` and store atomic increment operation in DB. Add DB constraint `CHECK (like_count >= 0)`.
- Phase 2 (owner: Backend): Add integration tests for concurrent increments and a simple rate-limiting middleware (e.g., per-IP request burst limit).
- Phase 3 (owner: Backend): If needed, evaluate Redis-backed counters for extreme scale.

# Dependencies

- Postgres transactional support and migration scripts to add constraints.

# Risks & Mitigations

- Risk: High write volume overwhelms DB. Mitigation: Evaluate Redis counters if traffic patterns demand it.

# Monitoring & Rollback

- Monitor: Rate of like requests, DB load, and test results from concurrency simulations.
- Rollback: Disable new endpoint and revert DB changes if needed.

# Open Questions

- Do we want a corresponding `unlike` operation? If yes, do we allow anonymous unlikes?

# Approvals

- Backend lead — owner — pending

# Change Log

- rfd-005 created 2025-09-11 by generated-by-ai


