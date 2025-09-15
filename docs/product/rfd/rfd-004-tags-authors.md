---
title: "Tags and authors normalization"
filename: "rfd-004-tags-authors.md"
date: 2025-09-11
author: generated-by-ai
status: draft
rfd_number: 004
---

# Summary

Define normalization and retrieval behavior for tags and authors endpoints. This RFD requests decisions on normalization rules, whether to compute tags on read or maintain a normalized store, and how to handle semicolons in tag values.

# Background & Context

The PRD requires `/quotes/tags` and `/quotes/authors` endpoints to return normalized, deduplicated, sorted lists. The `tags` field is currently defined as semicolon-separated strings; implementations must decide where normalization happens and how to maintain correctness and performance.

# Scope

In-scope:
- Exact normalization rules (trim, lowercase, dedupe, sort)
- Implementation strategy: compute-on-read vs maintain normalized tables
- Handling of semicolons inside tag values

Out-of-scope:
- Advanced tag search and relevance ranking

# Decision Being Requested

- Confirm normalization steps (PRD suggests trim + lowercase + dedupe + sort).
- Choose compute-on-read vs normalized `tags` table maintained on writes.
- Decide whether to allow semicolons inside tag values (escape policy or disallow).

# Goals & Success Metrics

- Goal: Provide correct and consistent tags/authors lists per PRD.
- Metric: Endpoints return normalized, deduplicated, sorted lists; unit tests cover edge cases.

# Constraints & Non-Goals

- Constraint: Prefer simple solutions for MVP; avoid heavy indexing until necessary.

# Options Considered

## Option A — Compute tags on read (recommended for MVP)
- Description: Parse the semicolon-delimited `tags` string at runtime, normalize, dedupe, sort, and return results.
- Pros: Simple, no additional schema work.
- Cons: Repeated parsing cost for each request.

## Option B — Maintain normalized `tags` table
- Description: Maintain a `tags` table and join table at write time.
- Pros: Fast reads and indexable queries.
- Cons: More complex write logic and migrations.

# Recommended Option

Recommend Option A for MVP: compute tags on read, implement robust parsing and normalization according to the PRD, and add a telemetry/monitoring checkpoint to evaluate performance. If tag queries become a hotspot, migrate to Option B.

# Implementation Plan

- Phase 1 (owner: Backend): Implement `GET /quotes/tags` to scan `quotes.tags`, split on `;`, trim, lowercase, dedupe and sort before returning.
- Phase 2 (owner: Backend): Add tests for edge cases (empty tags, duplicate tags, trailing semicolons, semicolons inside values if allowed).
- Phase 3 (owner: Backend): If migrating to normalized table, create migration and update write paths.

# Dependencies

- DB access to read `quotes.tags` and integration tests.

- Postman collection: refer to `docs/postman/quotes.postman_collection.json` (see RFD-003) for example requests covering `/quotes/tags` and `/quotes/authors` endpoints.

# Risks & Mitigations

- Risk: Unexpected semicolons in tag values. Mitigation: Disallow semicolons in tag values for MVP and document the rule.

# Monitoring & Rollback

- Monitor: Endpoint latency and error rates for `/quotes/tags`.
- Rollback: Revert to previous parsing behavior if regressions found.

# Open Questions

- Should we disallow semicolons in tag values permanently, or support an escape syntax?
Decision: Disallow semicolons in tag values permanently

# Approvals

- Backend lead — owner — pending

 # Change Log

- rfd-004 created 2025-09-11 by generated-by-ai

- updated 2025-09-15 by ivo: added Postman collection reference (`docs/postman/quotes.postman_collection.json`) and clarified decision to disallow semicolons in tag values for MVP.


