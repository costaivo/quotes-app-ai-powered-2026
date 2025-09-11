---
title: "Database schema and persistence"
filename: "rfd-002-database-schema.md"
date: 2025-09-11
author: Ivo Costa
status: Approved
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
  **2025-09-11** - Ivo Costa
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

- Phase 1 (owner: Backend): TypeORM setup and entity modeling
  - Install TypeORM and Postgres driver and (if using Nest) the Nest TypeORM integration: `npm install typeorm @nestjs/typeorm pg`.
  - Add DB configuration using `TypeOrmModule.forRoot()` (read settings from environment variables). Ensure CI and local Docker Postgres use the same env var names.
  - Create a `Quote` entity at `src/entities/quote.entity.ts` with the following column choices (match PRD and recorded decisions):
    - `id`: `uuid` primary generated column
    - `quote`: `text`, max 1000 characters enforced by DTO/validation (DB stores `text`)
    - `author`: `varchar(200)` (recorded constraint)
    - `like_count`: `integer` default `0` with a DB `CHECK (like_count >= 0)` constraint
    - `tags`: `varchar(500)` storing semicolon-delimited tags
  - Add repository/service scaffolding to use the TypeORM `Repository<Quote>` for DB operations.

- Phase 2 (owner: Backend): Migrations and migration workflow (repo-managed CLI)
  - Use TypeORM migrations stored in the repository. Preferred workflow:
    1. Create entities and run a migration generation command to produce a migration file.
    2. Review migration file and commit to the repository.
    3. CI runs `npm run typeorm:migrate:run` (or equivalent) to apply migrations against the test/staging DB before running integration tests.
  - Example npm scripts (suggested) to add to `package.json`:
    - `typeorm:migration:generate`: generate migration from entities
    - `typeorm:migration:run`: run pending migrations
    - `typeorm:migration:revert`: revert last migration
  - Example TypeORM CLI usage (project may need `ts-node`/transpile helpers depending on setup):
    - `npx typeorm migration:generate src/migrations/CreateQuotesTable -d src/data-source.ts`

- Phase 3 (owner: Backend): Example migration skeleton (TypeORM migration class)
  - Provide an initial migration that creates the `quotes` table and the `like_count` constraint. Example (TypeScript migration implementing `MigrationInterface`):

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuotesTable1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quotes',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'quote', type: 'text', isNullable: false },
          { name: 'author', type: 'varchar', length: '200', isNullable: false },
          { name: 'like_count', type: 'integer', default: 0 },
          { name: 'tags', type: 'varchar', length: '500', isNullable: true },
          { name: 'created_at', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updated_at', type: 'timestamp with time zone', default: 'now()' },
        ],
      }),
    );

    // enforce non-negative like_count
    await queryRunner.query("ALTER TABLE \"quotes\" ADD CONSTRAINT like_count_non_negative CHECK (like_count >= 0)");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "quotes" DROP CONSTRAINT IF EXISTS like_count_non_negative');
    await queryRunner.dropTable('quotes');
  }
}
```

- Phase 4 (owner: Backend): Local & CI developer experience
  - Add a `src/data-source.ts` (or `ormconfig` equivalent) that exports a TypeORM DataSource configured from env vars so migrations can run in CI (`ts-node` or compiled JS depending on CI setup).
  - Ensure CI workflow applies migrations before tests and that a rollback path exists (e.g., revert migration or restore DB snapshot).

- Phase 5 (owner: Backend): Migration to normalized tags (future work)
  - If later moving to normalized `tags` table, author and quote extraction migration should:
    1. Create `tags` and `quote_tags` tables in a new migration.
    2. Backfill existing `quotes.tags` by parsing semicolon-delimited values and inserting tag rows and join rows in a controlled migration script (idempotent where possible).
    3. Update write paths to populate `tags` table on writes and maintain consistency.


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


