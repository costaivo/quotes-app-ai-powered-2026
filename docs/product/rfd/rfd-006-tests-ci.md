---
title: "Integration tests and CI pipeline"
filename: "rfd-006-tests-ci.md"
date: 2025-09-11
author: generated-by-ai
status: draft
rfd_number: 006
---

# Summary

Define integration test strategy and CI pipeline for the Quotes Application. This RFD requests decisions on CI provider, test infrastructure (Dockerized Postgres for integration tests), and gating rules for PRs.

# Background & Context

Automated tests and CI are essential to ensure endpoints conform to the PRD and to prevent regressions. The project uses Docker Compose already in the repository; CI should run unit and integration tests with a Postgres instance.

# Scope

In-scope:
- Choose CI provider (GitHub Actions recommended)
- Integration test infra using Dockerized Postgres or testcontainers
- Test coverage and gating rules for PRs

Out-of-scope:
- Production deployment pipelines and CD

# Decision Being Requested

- Choose CI provider and pipeline steps.
- Decide whether to use Docker Compose in CI or testcontainers for starting Postgres.
- Define required checks for PRs (unit tests, integration tests, lint).

# Goals & Success Metrics

- Goal: Ensure feature branches are validated automatically and integration tests run reliably.
- Metric: CI passes on PRs and prevents merging on failing tests; integration tests run within a reasonable time (e.g., < 10 minutes).

# Constraints & Non-Goals

- Constraint: Keep CI simple and low-cost for initial project phase.

# Options Considered

## Option A — GitHub Actions + Dockerized Postgres (recommended)
- Description: Use GitHub Actions with a job that starts Postgres via service containers or Docker Compose and runs unit + integration tests and lint.
- Pros: Built-in to GitHub, easy to configure, reproducible.
- Cons: Slightly longer setup times.

## Option B — Use testcontainers in Node tests
- Description: Use `testcontainers` library to spin up ephemeral Postgres containers during test runs.
- Pros: Tests manage lifecycle; easier local parity.
- Cons: Requires Docker support in CI runners.

# Recommended Option

Recommend Option A: use GitHub Actions with a Postgres service container for integration tests, and include a job matrix for Node versions if desired. Use `npm ci`, run linter and unit tests, then run integration tests against the Postgres service.

# Implementation Plan

- Phase 1 (owner: DevOps/Backend): Add `.github/workflows/ci.yml` that runs on PRs and main, starts a Postgres service container, installs dependencies, runs lint, unit tests and integration tests.
- Phase 2 (owner: Backend): Create integration test helpers to seed DB and teardown between tests; include example tests for `GET /quotes` and `POST /quotes`.
- Phase 3 (owner: Backend): Set minimal coverage gates and require passing CI checks for merges.

# Dependencies

- GitHub Actions access to repository; Docker support in runners.

# Risks & Mitigations

- Risk: Slow CI run-times. Mitigation: Cache dependencies and limit integration test scope.

# Monitoring & Rollback

- Monitor: CI run durations and failure rates.
- Rollback: Revert workflow changes if they destabilize CI.

# Open Questions

- Are there enterprise constraints on CI providers or secrets storage?

# Approvals

- DevOps / Backend — owner — pending

# Change Log

- rfd-006 created 2025-09-11 by generated-by-ai


