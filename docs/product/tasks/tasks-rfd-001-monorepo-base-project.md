---
title: "Tasks for RFD 001 - Monorepo base project"
rfd_source: "rfd-001-monorepo-base-project.md"
created: 2025-09-10
---

## Relevant Files

- `app/be/README.md` - Placeholder README describing backend choices, scaffold commands, and next steps (NestJS).
- `app/fe/README.md` - Placeholder README describing frontend choices, scaffold commands, and next steps (Vite + TypeScript).
- `app/be/Dockerfile` - Starter Dockerfile for backend (multi-stage, Node LTS declared).
- `app/fe/Dockerfile` - Starter Dockerfile for frontend (multi-stage, Node LTS declared).
- `app/be/package.json` - Placeholder `package.json` with scaffold/run scripts for backend.
- `app/fe/package.json` - Placeholder `package.json` with scaffold/run scripts for frontend.
- `app/be/.nvmrc` - Node LTS version for backend.
- `app/fe/.nvmrc` - Node LTS version for frontend.
- `.npmrc` - Top-level npm config to pin exact versions.
- `.editorconfig` - Shared editor configuration for the monorepo.
- `docker-compose.yml` - Top-level compose file to orchestrate `app_be`, `app_fe`, `postgres`, and `adminer` for local development.
- `/.github/workflows/ci.yml` - CI workflow placeholder with TODOs and references to build steps for `app/be` and `app/fe`.
- `docs/product/prd.md` - Product requirements (update to reference the created RFD and tasks file).
- `docs/product/rfd/rfd-001-monorepo-base-project.md` - Source RFD (already present).

Approval:

- **Next Sub-task**: Awaiting approval

### Notes

- This tasks document follows the RFD; initial work is intentionally minimal and focuses on scaffolding and documentation.
- Unit tests are out-of-scope for this phase but identify where tests should later live: `app/be/src/__tests__/` and `app/fe/src/__tests__/`.
- Use Node LTS in `.nvmrc` files and document the exact value (e.g., `lts/*` or `20.x`) in each README.

## Tasks

- [x] 1.0 Create `app/be` and `app/fe` directories with placeholder READMEs
  - [x] 1.1 Create directories: `app/be/` and `app/fe/` in the repo root
  - [x] 1.2 Add `app/be/README.md` with sections: Purpose, Tech choices (NestJS), Node version reference, How to scaffold, Next steps
  - [x] 1.3 Add `app/fe/README.md` with sections: Purpose, Tech choices (Vite + TypeScript), Node version reference, How to scaffold, Next steps
  - [x] 1.4 Add brief example commands in each README to scaffold a starter app (e.g., `npx @nestjs/cli new` and `npm create vite@latest --template react-ts` or pointers to run generators)
  - [x] 1.5 Link both READMEs back to `docs/product/rfd/rfd-001-monorepo-base-project.md` and this tasks file
  - [ ] 1.6 Add basic backend scaffold: create the initial NestJS application structure and files following `app/be/.cursor/rules/be-rules.mdc` (include `package.json` scripts, `.nvmrc`, initial `src/` layout, and a Dockerfile placeholder)
  - [ ] 1.7 Add basic frontend scaffold: create the initial Vite + React TypeScript application structure and files following `app/fe/.cursor/rules/fe-rules.mdc` (include `package.json` scripts, `.nvmrc`, initial `src/` layout, and a Dockerfile placeholder)

 - [x] 2.0 Add shared developer configs and CI placeholders
  - [x] 2.1 Add top-level `.editorconfig` with basic settings (UTF-8, 2-space or project default; reference rules files)
  - [x] 2.2 Add top-level `.npmrc` with `save-exact=true` and any recommended registry settings
  - [x] 2.3 Add `/.github/workflows/ci.yml` placeholder containing:
    - [x] job to build `app/be` image (placeholder steps)
    - [x] job to build `app/fe` image (placeholder steps)
    - [x] TODO comments and links to the RFD for team owners to fill in
  - [x] 2.4 Add a `CONTRIBUTING.md` or extend top-level `README.md` with development bootstrapping notes and where to find `app/be` and `app/fe` rules

- [ ] 3.0 Add top-level `docker-compose.yml` to bring up services for local development
  - [ ] 3.1 Ensure `docker-compose.yml` defines services: `app_be`, `app_fe`, `postgres`, `adminer` with sensible defaults and volumes for DB persistence
  - [ ] 3.2 Add environment variable examples in `.env.example` for DB credentials
  - [ ] 3.3 Add minimal healthchecks or ports mapping so developers can access the frontend and Adminer locally
  - [ ] 3.4 Document `docker-compose` usage in top-level `README.md` and `app/*/README.md`

- [ ] 4.0 Add starter Dockerfiles and Node version files
  - [ ] 4.1 Add `app/be/Dockerfile` starter: multi-stage build, explicit Node LTS base image, copy sources, install, build, and run steps; include comments indicating where to adapt for NestJS specifics
  - [ ] 4.2 Add `app/fe/Dockerfile` starter: multi-stage build, explicit Node LTS base image, build static assets, simple static server stage or serve with Node
  - [ ] 4.3 Add `app/be/.nvmrc` and `app/fe/.nvmrc` set to Node LTS (document exact value in READMEs)
  - [ ] 4.4 Add minimal `.dockerignore` files in each of `app/be` and `app/fe`

- [ ] 5.0 Add `package.json` placeholders or scaffolding commands
  - [ ] 5.1 Add `app/fe/package.json` placeholder containing recommended scripts: `dev`, `build`, `preview`, and a `scaffold` script that documents how to generate the starter app
  - [ ] 5.2 Add `app/be/package.json` placeholder containing recommended scripts: `start:dev`, `build`, `start`, and a `scaffold` script with NestJS generator pointer
  - [ ] 5.3 Document in each `package.json` which exact Node and package manager versions are expected (link to `.nvmrc` and top-level `.npmrc`)

- [ ] 6.0 Document decisions and update PRD and RFD register
  - [ ] 6.1 Add a short entry to `docs/product/prd.md` referencing this RFD and the tasks file (add link + date + owner)
  - [ ] 6.2 Ensure `docs/product/rfd/rfd-001-monorepo-base-project.md` has the RFD register metadata and approval recorded (already present) and link back to the tasks file
  - [ ] 6.3 If your org uses an RFD register file, add an index entry linking to `rfd-001` (otherwise note where it's recorded)


## Acceptance Criteria

- `app/be/` and `app/fe/` exist with `README.md` files that describe how to scaffold and run a starter app
- Top-level `docker-compose.yml`, `.editorconfig`, `.npmrc`, and `/.github/workflows/ci.yml` placeholders exist
- `app/*/Dockerfile` and `.nvmrc` files are present and reference Node LTS
- `docs/product/prd.md` is updated with a link to the RFD and the generated tasks file



