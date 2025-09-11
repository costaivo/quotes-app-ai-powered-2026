---
title: "Database schema and persistence"
filename: "rfd-002-database-schema.md"
date: 2025-09-11
author: generated-by-ai
status: draft
rfd_number: 002
---

# Summary

Define the Postgres schema and persistence strategy for the Quotes Application. This RFD requests decisions about table structure for `quotes`, tags/authors storage strategy (denormalized semicolon strings vs normalized tables), choice of ORM and migration tooling, and backup/migration policy.

# Background & Context

The PRD specifies persistence in PostgreSQL with UUID primary keys and mentions tags stored as semicolon-separated strings for simplicity. The implementation tradeoff between simplicity and query performance must be decided before implementation. Refer to `docs/product/prd.md` §Functional Requirements and §Technical Considerations.

# Scope

In-scope:
- Schema for `quotes` entity (fields: id, quote, author, like_count, tags)
- Design decision: normalized `tags`/`authors` tables vs semicolon-delimited `tags` string
- Choice of ORM and migration tooling (Prisma, TypeORM, or plain SQL + migrations)
- Migration and backup strategy for production and local dev

Out-of-scope:
- Detailed indexing strategy for high-scale telemetry
- Cross-database portability beyond Postgres

# Decision Being Requested

- Choose the database schema shape (denormalized `tags` string vs normalized `tags` and `authors` tables).
- Select an ORM/migration tool (Prisma vs TypeORM vs SQL migrations).
- Define migration and backup policy for prod and CI environments.

# Recorded Decisions (from stakeholder)

- ORM choice: **TypeORM** — reason: tried-and-tested and previously used by the team.
- Tags storage: **Option A** — keep `tags` as a semicolon-delimited string on the `quotes` row (MVP, simpler).
- Authors: **store as text on `quotes`** (do not normalize into separate `authors` table).
- Migrations: **repo-managed CLI migrations** (maintain migration files in the repository).
- Backups & retention: **Approve** proposed policy — daily backups with 30-day retention.
- Additional constraints: increase `author` max length to **200** characters.

# Goals & Success Metrics

- Goal: Select a DB model and tooling that balances developer productivity and query performance.
- Metric: Completed schema and migration scripts enabling local dev and CI integration; integration tests pass using the chosen tooling.

# Constraints & Non-Goals

- Constraint: Keep initial delivery small and low-risk; prefer approaches that can be iterated later.
- Non-goal: Premature micro-optimizations for very large datasets.

# Options Considered

## Option A — Simple denormalized storage (recommended for MVP)
- Description: Keep `tags` as a semicolon-delimited string on the `quotes` row, store `author` as text on the quote row.
- Pros: Simple schema, faster to implement, fewer joins, easier migrations.
- Cons: Harder to query tags efficiently at scale; requires parsing at read-time.

## Option B — Normalized tags and authors tables
- Description: Create `tags` table and join table `quote_tags`; optionally an `authors` table for deduplication.
- Pros: Efficient tag queries, easier to enforce tag constraints, indexes possible.
- Cons: More complex schema and migrations; slightly more implementation overhead.

## Option C — Hybrid: maintain tags as string + optional index table
- Description: Store tags in the `quotes` row but also maintain a `tags` table updated on writes for quick reads.
- Pros: Balanced read/write tradeoffs; incremental complexity.
- Cons: Requires write-side maintenance logic and eventual consistency considerations.

# Recommended Option

Recommend Option A for MVP (denormalized semicolon string) to deliver features quickly. If tag queries become frequent or performance becomes a concern, migrate to Option B or C in a follow-up RFD and migration plan.

# Implementation Plan

- Phase 1 (owner: Backend): Implement `quotes` table with UUID primary key, `quote` (text, max 1000), `author` (varchar(100)), `like_count` (integer default 0, check >= 0), `tags` (varchar(500)). Add DB constraint to prevent negative `like_count`.
- Phase 2 (owner: Backend): Add Prisma or TypeORM schema and migration scripts (decide ORM in Decision section). Add local Docker Postgres for dev and CI.
- Phase 3 (owner: Backend): If later migrating to normalized tags, provide a migration script that extracts tags and populates `tags` and `quote_tags` tables.

# Dependencies

- Postgres instance in CI and local dev via Docker.
- ORM/migration tooling (Prisma/TypeORM) chosen by this RFD.

# Risks & Mitigations

- Risk: Denormalized tags may become slow to query at scale. Mitigation: Monitor tag query patterns and prepare migration plan.

# Monitoring & Rollback

- Monitor: Query latency and tag endpoint response time in integration tests and staging.
- Rollback: Revert schema change commits and restore DB from backups if a migration causes issues.

# Open Questions

- Do we expect heavy tag-based filtering that justifies a normalized design upfront?
- Which ORM/migration tooling do we prefer (Prisma recommended for type-safety)?

# Approvals

- Backend lead — owner — pending

# Change Log

- rfd-002 created 2025-09-11 by generated-by-ai


