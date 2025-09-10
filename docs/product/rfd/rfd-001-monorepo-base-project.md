---
title: "Monorepo base project"
filename: "rfd-001-monorepo-base-project.md"
date: 2025-09-10
author: Ivo Costa
status: approved
rfd_number: 001
---

# Summary

Create the monorepo base project that initializes the repository structure and developer toolchain for the Quotes Application. This RFD requests approval to create `app/be` and `app/fe` folders with initial scaffolding and configuration aligned to the backend and frontend rules (`app/be/be-rules`, `app/fe/fe-rules`).

# Background & Context

The PRD for the Quotes Application (Part 1) describes the need for a backend REST API and frontend client. Before implementing features, the repository must have a consistent monorepo layout and baseline tooling so teams can work in parallel and follow the project's tech rules. See `docs/product/prd.md` for product-level requirements.

# Scope

In-scope:
- Create `app/be/` and `app/fe/` directories in the repository root.
- Add minimal scaffold files and README placeholders to each folder to document initial tech stack and next steps.
- Initialize shared developer configs (editor config, linting) where appropriate.
- husky for commitlint messages to follow conventional commits messaging
- use nodejs LTS v20.9.0

Out-of-scope:
- Full implementation of backend or frontend features.
- CI pipelines or production deployment configurations beyond placeholders.

# Decision Being Requested

Approve creating the monorepo base project with the structure and initial files described above and adopting the tech rules defined in `app/be/be-rules` and `app/fe/fe-rules` as the canonical development standards.

# Goals & Success Metrics

- Goal: Provide a reproducible monorepo structure enabling parallel work on backend and frontend.
- Metric: `app/be/` and `app/fe/` exist with README and scaffold files; PRD updated with RFD Register entry.

# Constraints & Non-Goals

- Constraint: Keep initial changes minimal and non-invasive to reduce risk; use placeholders not full implementations.
- Non-goal: Ship production-ready services or UI in this RFD.

# Options Considered

## Option A — Monorepo with `app/be` and `app/fe` (recommended)
- Description: Create `app/` root with `be/` and `fe/` folders and basic scaffolding following the existing rules files.
- Pros: Clear separation, fast to set up, aligns with rules.
- Cons: Slight initial overhead for repo changes.

- Monorepo structure:
quotes-app/
├── apps/
│ ├── be/
│ │ ├── src/
│ │ ├── package.json
│ │ └── Dockerfile
│ └── fe/
│ ├── src/
│ ├── package.json
│ └── Dockerfile
├── docker-compose.yml
├── .env.example
└── docs/

- Docker-Compose services:
  - `be` → NestJS backend
  - `fe` → React frontend
  - `db` → PostgreSQL
  - `adminer` → Adminer for DB inspection
- Environment variables in `.env` file

## Option B — Separate repositories for backend and frontend
- Description: Keep backend and frontend in separate repositories.
- Pros: Clear separation of concerns and CI per repo.
- Cons: Higher overhead for cross-cutting changes, harder to share configs and coordinate.

# Recommended Option

Recommend Option A: create a monorepo with `app/be` and `app/fe`. This enables shared conventions, easier local development with `docker-compose`, and simplified cross-team collaboration.

# Implementation Plan

- Phase 1 — Create directories and placeholder files (owner: Ivo Costa, duration: 1 day)
  - Create `app/be/README.md` and `app/fe/README.md` describing tech stacks and next steps.
  - Add `.editorconfig` and top-level `README.md` updates linking to new folders.
  - Add a top-level `docker-compose.yml` that can bring up `app/be`, `app/fe`, PostgreSQL, and an Adminer HTML client for local development.

- Phase 2 — Add starter configs (owner: Ivo Costa, duration: 1-2 days)
  - Add initial `package.json` in `app/fe` (Vite + TypeScript) and `app/be` (NestJS), or add placeholders pointing to chosen scaffolding commands.
  - Add linting and formatting configs referencing project rules.
  - Add .npmrc file and set saving of packages versions as exact. Apply any default setting which you feel are required
  - Add .nvmrc and mention the version of the nodeJS used
  - Add Dockerfiles for backend (`app/be/Dockerfile`) and frontend (`app/fe/Dockerfile`) as lightweight starters to support local development, CI builds, and containerized deployments; include explicit Node/OS versions and multi-stage build where appropriate. (owner: Ivo Costa)

- Phase 3 — Minimal runtime endpoints and frontend stub (owner: Ivo Costa, duration: 1 day)
  - Backend:
    - Add a lightweight controller that exposes a GET `/version` endpoint returning the application's version.
    - The controller must read the `version` value from `package.json` at runtime (do not hardcode the value).
    - Ensure `app/be/` implementation adheres to the rules in `app/be/be-rules.mdc` (coding standards, dependency injection, configuration, logging, and testing guidance).
    - Add a minimal `package.json` in `app/be/` with a `version` field so the endpoint can be validated.
  - Frontend:
    - Create a minimal runnable frontend in `app/fe/` that displays a heading "Quotes Application" and the description " Comming soon.....".
    - Ensure `app/fe/` follows the rules in `app/fe/fe-rules.mdc` (tooling, linting, TypeScript/Vite defaults and accessibility basics).
    - Provide instructions in `app/fe/README.md` to start the dev server and verify the stub page.

# Dependencies

- No external teams required. Relies on repository admin permissions to create files and folders.

# Risks & Mitigations

- Risk: Overstepping by committing opinionated configs prematurely. Mitigation: Start with minimal placeholders and document choices in READMEs.

# Monitoring & Rollback

- Monitor: Confirm directories and READMEs are present and developers can bootstrap locally.
- Rollback: Remove added files via revert commit if issues arise.

# Open Questions

- Confirm whether CI placeholders should include actual pipeline steps or remain as TODOs.
Decision: No piplelines required for current phase
- Confirm desired Node / TypeScript versions for the frontend and backend starters.  
Decision: use nodejs LTS v20.9.0 and update in the .nvmrc file of each project. 

# Approvals

- Ivo Costa — owner — approved 2025-09-10

# Change Log

- rfd-001 created 2025-09-10 by Ivo Costa
- rfd-001 approved 2025-09-10 by Ivo Costa



