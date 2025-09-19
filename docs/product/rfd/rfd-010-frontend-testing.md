---
title: "Frontend testing strategy"
filename: "rfd-010-frontend-testing.md"
date: 2025-01-27
author: ivo
status: draft
rfd_number: 010
---

# Summary

Define a testing strategy for the frontend including unit tests, integration tests, and end-to-end tests.

# Options Considered

## Option A — Jest + React Testing Library + Cypress (recommended)
- Pros: Strong unit and integration support, Cypress for reliable e2e tests
- Cons: Requires CI setup for e2e tests

## Option B — Playwright for e2e + Jest for unit tests
- Pros: Playwright is powerful for cross-browser e2e testing
- Cons: Larger setup and different test tooling

# Recommended Option

Recommend Option A: Jest + React Testing Library for unit/integration tests and Cypress for e2e testing.

# Implementation Plan

- Phase 1: Add Jest and testing library configuration
- Phase 2: Add Cypress configuration and example e2e tests
- Phase 3: Integrate tests into CI pipeline

# Approvals

- Frontend lead — owner — pending

# Change Log

- rfd-010 created 2025-01-27 by ivo


