---
title: "Auditing and Data Integrity"
filename: "rfd-005-auditing-and-data-integrity.md"
date: 2025-12-03
author: "Ivo"
status: Approved
rfd_number: 005
---

# Summary
Implement data integrity and audit trail capabilities for the Quote entity by adding automatic timestamping (`created_at`, `updated_at`) and user tracking (`created_by`, `updated_by`) to standardize the entity definition and track record lifecycle.

# Background & Context
As defined in **PRD Part 5: Data Integrity & Auditing**, the system requires auditing columns to track when quotes are created/modified and by whom. Currently, the system lacks these standardized fields and relies on inconsistent naming (`text` vs `quote`).
See PRD § "Feature: Data Integrity & Auditing (Part 5)".

# Scope
**In-scope:**
- Modifying the `Quote` entity to add `created_at`, `updated_at`, `created_by`, `updated_by`.
- Renaming existing fields `text` → `quote` and `likes` → `like_count` to match the new schema definition.
- Database migrations to apply these changes and backfill existing records.
- Updating API responses to include the new audit fields.

**Out-of-scope:**
- User authentication (AuthN).
- Implementation of actual user tracking logic (fields will be placeholders).

# Decision Being Requested
1. **Schema Renaming**: Confirm renaming of `text` and `likes` columns to `quote` and `like_count`.
2. **Audit Automation**: Use TypeORM decorators (`@CreateDateColumn`, `@UpdateDateColumn`) for timestamp management.
3. **User Placeholders**: Set `created_by` and `updated_by` to `NULL` by default as authentication is not yet implemented.

# Goals & Success Metrics
- **Goal 1**: All new and updated quotes have accurate `created_at` (immutable) and `updated_at` (updates on change) timestamps.
- **Goal 2**: The API exposes the new audit fields in the response.
- **Metric 1**: 100% of API responses for Quotes include valid ISO 8601 timestamps for audit fields.

# Constraints & Non-Goals
- **Constraint**: Must maintain existing data integrity during migration.
- **Non-Goal**: Implementing a User entity or login flow.

# Options Considered
## Option A — Database Triggers
Use PostgreSQL triggers (`BEFORE UPDATE`) to manage `updated_at`.
- **Pros**: Robust; language-agnostic.
- **Cons**: Hides business logic in the database; complicates migrations.
- **Effort**: Medium.

## Option B — TypeORM Subscribers/Decorators (Recommended)
Use TypeORM's built-in `@CreateDateColumn` and `@UpdateDateColumn`.
- **Pros**: Standard practice for NestJS; logic lives in the application code; easy to maintain.
- **Cons**: Requires the application to perform the updates (bypassable by raw SQL).
- **Effort**: Low.

# Recommended Option
**Option B (TypeORM)**. It aligns with our current tech stack and keeps the logic transparent in the codebase.
For `created_by` and `updated_by`, we will define them as `nullable: true` columns. Since no auth context exists, we will not populate them (defaulting to NULL), fulfilling the decision to use them as placeholders.

# Implementation Plan
- **Phase 1**: Create a migration script to rename columns and add new audit columns (with default timestamps for existing rows). (Owner: Backend Dev)
- **Phase 2**: Update the `Quote` entity with new properties and decorators.
- **Phase 3**: Verify API responses return the new structure.

# Dependencies
- None.

# Risks & Mitigations
- **Risk**: Renaming `text` to `quote` breaks existing API clients if the JSON response key also changes.
- **Mitigation**: The PRD implies transparency. If strictly required, we can map the internal `quote` column to the `text` JSON key in the DTO. However, per PRD Part 5 requirements ("Renamed fields... replace the old field names"), we will proceed with the breaking change to standardise the API.

# Monitoring & Rollback
- **Monitoring**: Check application logs for database errors after deployment.
- **Rollback**: Revert the database migration and deploy the previous Docker image.

# Open Questions
- None.

# Approvals
- Stakeholder 1 — Approved - Ivo Costa

# Change Log
- rfd-005 created 2025-12-03 by Ivo

