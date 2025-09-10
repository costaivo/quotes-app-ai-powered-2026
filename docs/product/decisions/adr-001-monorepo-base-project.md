# ADR 001 — Monorepo base project

- **Status:** accepted
- **Date:** 2025-09-10
- **Decider / Owner:** Ivo Costa

## Context
The repository needs a reproducible monorepo layout and minimal developer toolchain so backend and frontend teams can work in parallel. See the RFD: `docs/product/rfd/rfd-001-monorepo-base-project.md`.

## Decision
Create a monorepo root with `app/be/` and `app/fe/` and add minimal scaffolding as described in RFD-001:
- Add `README.md` placeholders in each folder documenting the chosen starter stack and next steps.
- Add shared developer configs at repo root where appropriate (`.editorconfig`, linting/formatting configs).
- Add lightweight starter `Dockerfile`s for `app/be` and `app/fe`.
- Add `.nvmrc` in each project and set `engines` in `package.json` to pin Node major/minor (use Node LTS at project start).
- Add minimal CI placeholder files: provide small, commented GitHub Actions templates (checkout → install/cache → lint → test → build). These are intentionally minimal and documented; they are placeholders, not production pipelines.

## Alternatives considered
- **Option B — Separate repositories**: rejected due to higher overhead for cross-cutting changes and harder sharing of configs.

## Consequences / Risks
- Introducing minimal opinions early (Node/TS versions, lightweight Dockerfile patterns). Mitigation: keep starters minimal, document upgrade policy, and use placeholders rather than full production pipelines.
- Teams must agree on upgrade cadence for Node/TypeScript (suggest quarterly review and CI validation before upgrades).

## Implementation / Next steps
- Commit scaffolding in two phases per RFD-001 (phase 1: directories/README/placeholder CI; phase 2: starter configs and Dockerfiles).
- Provide a `docker-compose.yml` at the repository root to run `app/be`, `app/fe`, the PostgreSQL database, and an Adminer HTML client for local development and testing.
- Link the PR implementing the RFD to this ADR (add PR URL here after creation).

## Related
- RFD: `docs/product/rfd/rfd-001-monorepo-base-project.md`
- Implementation PR: (add link)
