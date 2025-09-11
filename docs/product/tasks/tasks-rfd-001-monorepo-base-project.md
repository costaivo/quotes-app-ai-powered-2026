---
title: "Tasks for RFD-001 Monorepo base project"
rfd: "rfd-001-monorepo-base-project.md"
date: 2025-09-10
---

## Relevant Files

- `app/be/README.md` - Placeholder README describing backend tech stack and next steps.
- `app/fe/README.md` - Placeholder README describing frontend tech stack and next steps.
- `app/be/package.json` - Minimal package.json (contains `version` field required by `/version` endpoint).
- `app/fe/package.json` - Minimal package.json to bootstrap the Vite+TypeScript app.
- `docker-compose.yml` - Top-level development compose file to bring up `be`, `fe`, `db`, and `adminer`.
- `.env.example` - Example environment variables for docker-compose.
- `.editorconfig` - Shared editor configuration for the repository.
- `.nvmrc` - Node.js LTS version file (v20.9.0) for each project.
- `.npmrc` - npm config to pin exact package versions.
- `app/be/Dockerfile` - Starter Dockerfile for backend.
- `app/fe/Dockerfile` - Starter Dockerfile for frontend.
- `app/be/src/controllers/version.controller.ts` - Backend controller exposing GET `/version`.
- `app/be/src/main.ts` - Backend application bootstrap (example for NestJS or chosen framework).
- `app/fe/src/App.tsx` - Frontend stub displaying title and "Comming soon.....".
- `app/be/src/__tests__/version.controller.spec.ts` - Tests for `/version` endpoint.

### Notes

- Unit tests should be placed alongside implementation files (e.g., `version.controller.spec.ts` next to controller).
- The `version` endpoint must read the `version` field from `app/be/package.json` at runtime (do not hardcode).
- Use Node LTS `v20.9.0` as specified in `.nvmrc` files.
- This file contains detailed sub-tasks; mark items as done in PRs and reference the RFD number.

## Tasks

- [x] 1.0 Create monorepo directories and placeholders
  - [x] 1.1 Create `app/be/` and `app/fe/` directories at repo root
  - [x] 1.2 Add `app/be/README.md` with:
    - [x] short overview of stack (e.g., NestJS, Node v20.9.0)
    - [x] quick start: install, run, test commands
    - [x] link to `app/be/be-rules.mdc`
  - [x] 1.3 Add `app/fe/README.md` with:
    - [x] short overview of stack (e.g., Vite + React + TypeScript)
    - [x] quick start: install, run dev, build commands
    - [x] link to `app/fe/fe-rules.mdc`
  - [x] 1.4 Add or update top-level `README.md` with links to `app/be` and `app/fe` and the RFD reference
  - [x] 1.5 Commit the new directories and README placeholders with a conventional-commit message

- [x] 2.0 Initialize shared developer configs
  - [x] 2.1 Add `.editorconfig` at repo root with basic indentation and charset rules
  - [x] 2.2 Add top-level lint/format placeholders (e.g., `.eslintrc.json` and `prettier.config.js`) that reference project rules
  - [x] 2.3 Add `.npmrc` at repo root with `save-exact=true` and any recommended defaults
  - [x] 2.4 Add `.nvmrc` at repo root pinned to `20.9.0` and copy into `app/be` and `app/fe` if desired
  - [x] 2.5 Add husky and commitlint configuration:
    - [x] install husky and commitlint as dev dependencies in the top-level or workspace
    - [x] add commit message lint hook enforcing conventional commits
  - [x] 2.6 Commit config files with a conventional-commit message

- [x] 3.0 Add starter package manifests and Dockerfiles
  - [x] 3.1 Create `app/be/package.json` with fields:
    - [x] `name`, `version` (e.g., `0.1.0`), `scripts` (`start:dev`, `start`, `test`)
    - [x] minimal dependencies placeholder (or a note to run scaffolding)
  - [x] 3.2 Create `app/fe/package.json` with fields:
    - [x] `name`, `version`, `scripts` (`dev`, `build`, `preview`)
    - [x] minimal devDependencies placeholders for Vite + React + TypeScript
  - [x] 3.3 Add `app/be/Dockerfile` (lightweight multi-stage starter) including explicit node base image and build steps
  - [x] 3.4 Add `app/fe/Dockerfile` (lightweight multi-stage starter) including explicit node base image and build steps
  - [x] 3.5 Commit package manifests and Dockerfiles with a conventional-commit message

- [x] 4.0 Add top-level `docker-compose.yml` for local development
  - [x] 4.1 Create `docker-compose.yml` with services: `be`, `fe`, `db` (Postgres), `adminer`
  - [x] 4.2 Use environment variables from `.env.example` and document required values in the README
  - [x] 4.3 Add `docker-compose.override.yml` example for developer convenience (optional)
  - [x] 4.4 Commit compose files and `.env.example`

- [x] 5.0 Implement minimal backend endpoint
  - [x] 5.1 Add backend bootstrap (`app/be/src/main.ts`) wiring up chosen framework (NestJS or minimal Express) with an application port env var
  - [x] 5.2 Implement `app/be/src/controllers/version.controller.ts` exposing GET `/version`:
    - [x] read `version` from `app/be/package.json` at runtime (use fs.readFile or require depending on runtime)
    - [x] respond with `{ version: "x.y.z" }` and HTTP 200
  - [x] 5.3 Add a unit test `app/be/src/__tests__/version.controller.spec.ts` verifying the endpoint returns the package version
  - [x] 5.4 Add an integration smoke test that runs the server and requests `/version` (optional but recommended)
  - [x] 5.5 Ensure code follows rules in `app/be/be-rules.mdc` (DI, config, logging) - add TODOs or linters enforcing selected rules
  - [x] 5.6 Commit backend changes with a conventional-commit message and include test run in CI placeholder if present

- [x] 6.0 Implement minimal frontend stub
  - [x] 6.1 Scaffold minimal Vite+React+TS project under `app/fe/src/` or add a minimal index.html + `src/App.tsx`
  - [x] 6.2 Implement `app/fe/src/App.tsx` to render:
    - [x] a heading: "Quotes Application"
    - [x] a paragraph: " Comming soon....."
  - [x] 6.3 Add `app/fe/README.md` instructions to run `npm install` and `npm run dev` and verify the page
  - [x] 6.4 Add basic accessibility and TypeScript settings per `app/fe/fe-rules.mdc`
  - [x] 6.5 Commit frontend stub with a conventional-commit message

- [x] 7.0 Documentation, PRs and approvals
  - [x] 7.1 Update `docs/product/prd.md` to include an RFD register entry referencing `rfd-001-monorepo-base-project.md`
  - [x] 7.2 Add RFD approvals and changelog entries if not already present
  - [x] 7.3 Open PRs for the implemented changes, include a checklist referencing these tasks, and request review from the owner
  - [x] 7.4 After PR merge, verify that `app/be/` and `app/fe/` scaffold can be bootstrapped locally and document any deviations
